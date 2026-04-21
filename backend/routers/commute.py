"""
Commute Router
POST /commute                 - Log a commute
GET  /commute/history         - Paginated history
GET  /commute/stats           - Personal stats
GET  /commute/stats/monthly   - Monthly breakdown
PUT  /commute/{id}            - Edit entry
DELETE /commute/{id}          - Delete entry
GET  /commute/transport-modes - List transport modes
POST /commute/calculate       - Preview emission calc
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date, timedelta

from database import get_session
from auth.dependencies import get_current_user
from models.user import User
from models.commute import CommuteEntry
from models.transport import IrishTransportMode
from schemas.commute import (
    CommuteEntryCreate, CommuteEntryRead, CommuteEntryUpdate,
    CommuteStats, EmissionCalculationRequest, EmissionCalculationResponse,
    CommuteProfileRead, CommuteProfileUpdate, MonthlyCommuteStats,
)
from schemas.common import ApiResponse, PaginatedResponse
from models.commute import CommuteProfile
from services.emission_calculator import calculate_emissions
from services.audit_logger import log_action

router = APIRouter(prefix="/commute", tags=["Commute"])


@router.post("/", response_model=ApiResponse[CommuteEntryRead], status_code=201)
async def log_commute(
    entry: CommuteEntryCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Log a new commute entry. Emissions and OxyPoints are auto-calculated."""
    # Get transport mode label
    mode_stmt = select(IrishTransportMode).where(IrishTransportMode.id == entry.transport_mode_id)
    mode_result = await session.execute(mode_stmt)
    mode = mode_result.scalar_one_or_none()

    mode_label = mode.mode if mode else entry.transport_mode_id

    # Calculate emissions
    calc = calculate_emissions(
        entry.transport_mode_id,
        entry.distance_km,
        region=user.region.value if hasattr(user.region, 'value') else user.region,
        carpool_passengers=entry.carpool_passengers,
    )

    commute = CommuteEntry(
        user_id=user.id,
        commute_date=entry.date,
        transport_mode_id=entry.transport_mode_id,
        transport_mode_label=mode_label,
        distance_km=entry.distance_km,
        duration_minutes=entry.duration_minutes,
        origin_address=entry.origin_address,
        destination_address=entry.destination_address,
        origin_lat=entry.origin_lat,
        origin_lng=entry.origin_lng,
        destination_lat=entry.destination_lat,
        destination_lng=entry.destination_lng,
        emissions_kg_co2=calc["emissions_kg_co2"],
        emission_factor_id=entry.transport_mode_id,
        emission_factor_value=calc["emission_factor_used"],
        is_return_trip=entry.is_return_trip,
        carpool_passengers=entry.carpool_passengers,
        oxypoints_earned=calc["oxypoints"],
        verification_method=entry.verification_method,
        notes=entry.notes,
    )

    session.add(commute)
    await session.flush()
    await session.refresh(commute)

    # Audit log
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "commute_entry", commute.id,
        description=f"Logged {mode_label} commute: {entry.distance_km}km",
    )

    return ApiResponse(success=True, data=CommuteEntryRead.model_validate(commute))


@router.get("/history", response_model=ApiResponse[PaginatedResponse[CommuteEntryRead]])
async def get_commute_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    start_date: date = Query(None),
    end_date: date = Query(None),
    transport_mode_id: str = Query(None),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get paginated commute history for the current user."""
    statement = select(CommuteEntry).where(CommuteEntry.user_id == user.id)

    if start_date:
        statement = statement.where(CommuteEntry.commute_date >= start_date)
    if end_date:
        statement = statement.where(CommuteEntry.commute_date <= end_date)
    if transport_mode_id:
        statement = statement.where(CommuteEntry.transport_mode_id == transport_mode_id)

    # Count
    count_stmt = select(func.count()).select_from(statement.subquery())
    total = (await session.execute(count_stmt)).scalar_one()

    # Fetch
    statement = statement.order_by(CommuteEntry.commute_date.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await session.execute(statement)
    entries = result.scalars().all()

    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            items=[CommuteEntryRead.model_validate(e) for e in entries],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(total + page_size - 1) // page_size,
        ),
    )


@router.get("/stats", response_model=ApiResponse[CommuteStats])
async def get_commute_stats(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get personal commute statistics."""
    statement = select(CommuteEntry).where(CommuteEntry.user_id == user.id)
    result = await session.execute(statement)
    entries = result.scalars().all()

    if not entries:
        return ApiResponse(
            success=True,
            data=CommuteStats(
                total_commutes=0, total_distance_km=0, total_emissions_kg=0,
                total_oxypoints=0, avg_daily_distance=0, avg_daily_emissions=0,
                modal_split=[], monthly_trend=[], streak=0, co2_saved_vs_car=0,
            ),
        )

    total_distance = sum(e.distance_km for e in entries)
    total_emissions = sum(e.emissions_kg_co2 for e in entries)
    total_oxypoints = sum(e.oxypoints_earned for e in entries)
    unique_days = len(set(e.commute_date for e in entries))

    # Modal split
    mode_counts = {}
    for e in entries:
        mode_counts[e.transport_mode_label] = mode_counts.get(e.transport_mode_label, 0) + 1
    modal_split = [
        {"mode": mode, "count": count, "percentage": round(count / len(entries) * 100, 1)}
        for mode, count in mode_counts.items()
    ]

    # CO2 saved vs solo car
    avg_car_factor = 0.178
    co2_if_car = total_distance * avg_car_factor
    co2_saved = max(0, co2_if_car - total_emissions)

    return ApiResponse(
        success=True,
        data=CommuteStats(
            total_commutes=len(entries),
            total_distance_km=round(total_distance, 1),
            total_emissions_kg=round(total_emissions, 2),
            total_oxypoints=total_oxypoints,
            avg_daily_distance=round(total_distance / max(unique_days, 1), 1),
            avg_daily_emissions=round(total_emissions / max(unique_days, 1), 2),
            modal_split=modal_split,
            monthly_trend=[],
            streak=0,
            co2_saved_vs_car=round(co2_saved, 2),
        ),
    )


@router.put("/{entry_id}", response_model=ApiResponse[CommuteEntryRead])
async def update_commute(
    entry_id: str,
    update: CommuteEntryUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Edit a commute entry (within 48-hour window)."""
    statement = select(CommuteEntry).where(
        CommuteEntry.id == entry_id, CommuteEntry.user_id == user.id
    )
    result = await session.execute(statement)
    entry = result.scalar_one_or_none()

    if entry is None:
        raise HTTPException(status_code=404, detail="Commute entry not found")

    # 48-hour edit window
    if (datetime.utcnow() - entry.created_at).total_seconds() > 48 * 3600:
        raise HTTPException(status_code=403, detail="Edit window (48 hours) has expired")

    update_data = update.model_dump(exclude_unset=True)

    # Recalculate emissions if distance or mode changed
    need_recalc = "distance_km" in update_data or "transport_mode_id" in update_data
    for key, value in update_data.items():
        setattr(entry, key, value)

    if need_recalc:
        calc = calculate_emissions(
            entry.transport_mode_id,
            entry.distance_km,
            region=user.region.value if hasattr(user.region, 'value') else user.region,
            carpool_passengers=entry.carpool_passengers,
        )
        entry.emissions_kg_co2 = calc["emissions_kg_co2"]
        entry.emission_factor_value = calc["emission_factor_used"]
        entry.oxypoints_earned = calc["oxypoints"]

    entry.updated_at = datetime.utcnow()
    session.add(entry)
    await session.flush()
    await session.refresh(entry)

    return ApiResponse(success=True, data=CommuteEntryRead.model_validate(entry))


@router.delete("/{entry_id}", response_model=ApiResponse)
async def delete_commute(
    entry_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Delete a commute entry (GDPR right to erasure)."""
    statement = select(CommuteEntry).where(
        CommuteEntry.id == entry_id, CommuteEntry.user_id == user.id
    )
    result = await session.execute(statement)
    entry = result.scalar_one_or_none()

    if entry is None:
        raise HTTPException(status_code=404, detail="Commute entry not found")

    await session.delete(entry)

    return ApiResponse(success=True, meta={"message": "Commute entry deleted"})


@router.get("/transport-modes", response_model=ApiResponse)
async def list_transport_modes(
    session: AsyncSession = Depends(get_session),
):
    """List all available Irish transport modes."""
    statement = select(IrishTransportMode).where(IrishTransportMode.is_active == True)
    result = await session.execute(statement)
    modes = result.scalars().all()

    return ApiResponse(
        success=True,
        data=[{
            "id": m.id,
            "mode": m.mode,
            "operator": m.operator,
            "regions": m.regions,
            "emission_factor": m.emission_factor,
            "category": m.category.value if hasattr(m.category, 'value') else m.category,
            "tax_relief": m.tax_relief,
            "bike_to_work_scheme": m.bike_to_work_scheme,
        } for m in modes],
    )


@router.post("/calculate", response_model=ApiResponse[EmissionCalculationResponse])
async def preview_calculation(
    request: EmissionCalculationRequest,
):
    """Preview emission calculation without saving."""
    calc = calculate_emissions(
        request.transport_mode_id,
        request.distance_km,
        region=request.region,
        carpool_passengers=request.carpool_passengers,
    )

    return ApiResponse(
        success=True,
        data=EmissionCalculationResponse(
            emissions_kg_co2=calc["emissions_kg_co2"],
            emission_factor_used=calc["emission_factor_used"],
            emission_factor_source=calc["emission_factor_source"],
            oxypoints_estimate=calc["oxypoints"],
            co2_saved_vs_car=calc["co2_saved_vs_car"],
        ),
    )


@router.get("/stats/monthly", response_model=ApiResponse)
async def get_monthly_stats(
    year: int = Query(None),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Monthly commute breakdown for the current user."""
    target_year = year or datetime.utcnow().year
    MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    avg_car_factor = 0.178
    data = []

    for month_num in range(1, 13):
        stmt = select(CommuteEntry).where(
            CommuteEntry.user_id == user.id,
            func.extract("year", CommuteEntry.commute_date) == target_year,
            func.extract("month", CommuteEntry.commute_date) == month_num,
        )
        entries = (await session.execute(stmt)).scalars().all()

        total_dist = sum(e.distance_km for e in entries)
        total_em = sum(e.emissions_kg_co2 for e in entries)
        total_pts = sum(e.oxypoints_earned for e in entries)
        co2_if_car = total_dist * avg_car_factor
        co2_saved = max(0.0, co2_if_car - total_em)

        data.append(MonthlyCommuteStats(
            month=month_num,
            month_name=MONTH_NAMES[month_num - 1],
            total_commutes=len(entries),
            total_distance_km=round(total_dist, 1),
            total_emissions_kg=round(total_em, 2),
            total_oxypoints=total_pts,
            co2_saved_vs_car=round(co2_saved, 2),
        ).model_dump())

    return ApiResponse(success=True, data=data)


@router.get("/profile", response_model=ApiResponse[CommuteProfileRead])
async def get_commute_profile(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get current user's commute profile (home/work addresses, defaults)."""
    profile = (await session.execute(
        select(CommuteProfile).where(CommuteProfile.user_id == user.id)
    )).scalar_one_or_none()

    if profile is None:
        # Return empty defaults if not yet set up
        return ApiResponse(success=True, data=CommuteProfileRead(
            user_id=user.id,
            updated_at=datetime.utcnow(),
        ))

    return ApiResponse(success=True, data=CommuteProfileRead.model_validate(profile))


@router.put("/profile", response_model=ApiResponse[CommuteProfileRead])
async def update_commute_profile(
    update: CommuteProfileUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create or update current user's commute profile."""
    profile = (await session.execute(
        select(CommuteProfile).where(CommuteProfile.user_id == user.id)
    )).scalar_one_or_none()

    if profile is None:
        profile = CommuteProfile(user_id=user.id)

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    profile.updated_at = datetime.utcnow()
    session.add(profile)
    await session.flush()
    await session.refresh(profile)

    return ApiResponse(success=True, data=CommuteProfileRead.model_validate(profile))
