"""
Gamification Router
GET  /gamification/profile, /achievements, /leaderboard, /challenges, /history
POST /gamification/challenges/{id}/join, /redeem
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import get_current_user
from models.user import User
from models.gamification import (
    OxyPointsLedger, UserAchievement, UserBadge,
    Challenge, ChallengeParticipant,
)
from schemas.gamification import (
    OxyPointsBalance, OxyPointsTransaction, AchievementRead,
    BadgeRead, ChallengeRead, LeaderboardRead, LeaderboardEntry, RedeemRequest,
)
from schemas.common import ApiResponse, PaginatedResponse
from services.gamification_engine import calculate_level, calculate_tier

router = APIRouter(prefix="/gamification", tags=["Gamification"])


@router.get("/profile", response_model=ApiResponse[OxyPointsBalance])
async def get_profile(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get OxyPoints balance, level, tier, streak."""
    # Sum all points
    total_points = (await session.execute(
        select(func.coalesce(func.sum(OxyPointsLedger.points), 0))
        .where(OxyPointsLedger.user_id == user.id)
    )).scalar_one()
    total_points = int(total_points)

    level, points_to_next = calculate_level(total_points)
    tier = calculate_tier(total_points)

    # Count achievements and rides
    achievements_count = (await session.execute(
        select(func.count(UserAchievement.id))
        .where(UserAchievement.user_id == user.id, UserAchievement.is_unlocked == True)
    )).scalar_one()

    from models.commute import CommuteEntry
    total_rides = (await session.execute(
        select(func.count(CommuteEntry.id)).where(CommuteEntry.user_id == user.id)
    )).scalar_one()
    total_co2 = float((await session.execute(
        select(func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0))
        .where(CommuteEntry.user_id == user.id)
    )).scalar_one())

    return ApiResponse(success=True, data=OxyPointsBalance(
        user_id=user.id,
        total_points=total_points,
        level=level,
        points_to_next_level=points_to_next,
        tier=tier,
        streak=0,
        longest_streak=0,
        total_co2_saved=round(total_co2, 1),
        total_rides=total_rides,
        rank=0,
    ))


@router.get("/achievements", response_model=ApiResponse)
async def get_achievements(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get all achievements with unlock status."""
    achievements = (await session.execute(
        select(UserAchievement).where(UserAchievement.user_id == user.id)
    )).scalars().all()

    return ApiResponse(
        success=True,
        data=[AchievementRead.model_validate(a).model_dump() for a in achievements],
    )


@router.get("/leaderboard", response_model=ApiResponse[LeaderboardRead])
async def get_leaderboard(
    type: str = Query("points"),
    period: str = Query("all-time"),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get leaderboard by type and period."""
    # Aggregate points per user
    stmt = select(
        OxyPointsLedger.user_id,
        func.sum(OxyPointsLedger.points).label("total"),
    ).group_by(OxyPointsLedger.user_id).order_by(func.sum(OxyPointsLedger.points).desc()).limit(20)

    result = await session.execute(stmt)
    rows = result.all()

    entries = []
    for rank, row in enumerate(rows, 1):
        u = (await session.execute(select(User).where(User.id == row[0]))).scalar_one_or_none()
        name = u.name if u else "Unknown"
        total = int(row[1])

        entries.append(LeaderboardEntry(
            rank=rank,
            user_id=row[0],
            name=name,
            score=total,
            change=0,
            tier=calculate_tier(total),
        ))

    user_rank = next((e.rank for e in entries if e.user_id == user.id), None)

    return ApiResponse(success=True, data=LeaderboardRead(
        type=type,
        period=period,
        entries=entries,
        user_rank=user_rank,
    ))


@router.get("/challenges", response_model=ApiResponse)
async def get_challenges(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get active challenges."""
    challenges = (await session.execute(
        select(Challenge).where(Challenge.status == "active")
    )).scalars().all()

    data = []
    for c in challenges:
        participant = (await session.execute(
            select(ChallengeParticipant).where(
                ChallengeParticipant.challenge_id == c.id,
                ChallengeParticipant.user_id == user.id,
            )
        )).scalar_one_or_none()

        cr = ChallengeRead.model_validate(c)
        cr.user_progress = participant.progress if participant else None
        cr.user_completed = participant.completed if participant else None
        data.append(cr.model_dump())

    return ApiResponse(success=True, data=data)


@router.post("/challenges/{challenge_id}/join", response_model=ApiResponse)
async def join_challenge(
    challenge_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Join a challenge."""
    challenge = (await session.execute(
        select(Challenge).where(Challenge.id == challenge_id)
    )).scalar_one_or_none()
    if challenge is None:
        raise HTTPException(status_code=404, detail="Challenge not found")

    existing = (await session.execute(
        select(ChallengeParticipant).where(
            ChallengeParticipant.challenge_id == challenge_id,
            ChallengeParticipant.user_id == user.id,
        )
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Already joined")

    participant = ChallengeParticipant(
        challenge_id=challenge_id,
        user_id=user.id,
    )
    session.add(participant)
    challenge.participant_count += 1
    session.add(challenge)

    return ApiResponse(success=True, meta={"message": "Joined challenge"})


@router.get("/history", response_model=ApiResponse[PaginatedResponse[OxyPointsTransaction]])
async def get_points_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get OxyPoints transaction history."""
    stmt = select(OxyPointsLedger).where(OxyPointsLedger.user_id == user.id)
    total = (await session.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()

    stmt = stmt.order_by(OxyPointsLedger.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    txns = (await session.execute(stmt)).scalars().all()

    return ApiResponse(success=True, data=PaginatedResponse(
        items=[OxyPointsTransaction.model_validate(t) for t in txns],
        total=total, page=page, page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    ))


@router.post("/redeem", response_model=ApiResponse)
async def redeem_points(
    request: RedeemRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Redeem OxyPoints for rewards."""
    total = (await session.execute(
        select(func.coalesce(func.sum(OxyPointsLedger.points), 0))
        .where(OxyPointsLedger.user_id == user.id)
    )).scalar_one()

    if int(total) < request.points:
        raise HTTPException(status_code=400, detail="Insufficient OxyPoints")

    ledger = OxyPointsLedger(
        user_id=user.id,
        points=-request.points,
        reason="redemption",
        description=f"Redeemed for {request.reward_type}",
    )
    session.add(ledger)

    return ApiResponse(success=True, meta={"message": f"Redeemed {request.points} OxyPoints"})
