"""
Emissions Router
GET /emissions/summary, /trends, /mode-split, /locations, /locations/{id}
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from database import get_session
from auth.dependencies import require_role
from models.user import User
from models.commute import CommuteEntry
from models.organization import Office
from models.emission import EmissionRecord
from schemas.emission import EmissionSummary, EmissionTrend, ModeDistribution, LocationEmissionPerformance
from schemas.common import ApiResponse

router = APIRouter(prefix="/emissions", tags=["Emissions"])


@router.get("/summary", response_model=ApiResponse[EmissionSummary])
async def get_emissions_summary(
    year: int = Query(2026),
    user=Depends(require_role("sustainability", "admin")),
    session: AsyncSession = Depends(get_session),
):
    """Get emission KPI dashboard summary."""
    # Aggregate from commute entries
    entries_stmt = select(
        func.count(CommuteEntry.id),
        func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0),
        func.coalesce(func.sum(CommuteEntry.distance_km), 0),
    ).where(func.extract("year", CommuteEntry.commute_date) == year)

    result = await session.execute(entries_stmt)
    row = result.one()
    total_commutes = row[0]
    total_emissions = float(row[1])
    total_distance = float(row[2])

    # Previous year for comparison
    prev_stmt = select(
        func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0),
    ).where(func.extract("year", CommuteEntry.commute_date) == year - 1)
    prev_result = await session.execute(prev_stmt)
    prev_emissions = float(prev_result.scalar_one())

    yoy_change = round(
        ((total_emissions - prev_emissions) / prev_emissions * 100) if prev_emissions > 0 else 0,
        1,
    )

    # Employee count
    user_count_stmt = select(func.count(func.distinct(CommuteEntry.user_id))).where(
        func.extract("year", CommuteEntry.commute_date) == year
    )
    active_users = (await session.execute(user_count_stmt)).scalar_one()

    total_users_stmt = select(func.count(User.id)).where(User.is_active == True)
    total_users = (await session.execute(total_users_stmt)).scalar_one()

    participation = round((active_users / max(total_users, 1)) * 100, 1)
    intensity = round(total_emissions / max(active_users, 1), 2)

    return ApiResponse(
        success=True,
        data=EmissionSummary(
            total_emissions_kg=round(total_emissions, 2),
            total_emissions_previous_period=round(prev_emissions, 2),
            yoy_change_percent=yoy_change,
            emission_intensity=intensity,
            total_commutes=total_commutes,
            participation_rate=participation,
            data_quality_score=78.5,  # Placeholder - calculate from actual data quality service
            target_emissions_kg=None,
            gap_to_target=None,
        ),
    )


@router.get("/trends", response_model=ApiResponse)
async def get_emissions_trends(
    year: int = Query(2026),
    user=Depends(require_role("sustainability", "admin")),
    session: AsyncSession = Depends(get_session),
):
    """Get monthly emission trends."""
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    trends = []

    for i, month_name in enumerate(months, 1):
        stmt = select(
            func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0),
        ).where(
            func.extract("year", CommuteEntry.commute_date) == year,
            func.extract("month", CommuteEntry.commute_date) == i,
        )
        result = await session.execute(stmt)
        actual = float(result.scalar_one())

        trends.append(EmissionTrend(
            period=month_name,
            actual=round(actual, 1),
            forecast=None,
            target=None,
        ))

    return ApiResponse(success=True, data=[t.model_dump() for t in trends])


@router.get("/mode-split", response_model=ApiResponse)
async def get_mode_split(
    year: int = Query(2026),
    user=Depends(require_role("sustainability", "admin")),
    session: AsyncSession = Depends(get_session),
):
    """Get transport mode distribution."""
    stmt = select(
        CommuteEntry.transport_mode_label,
        func.count(CommuteEntry.id),
        func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0),
    ).where(
        func.extract("year", CommuteEntry.commute_date) == year
    ).group_by(CommuteEntry.transport_mode_label)

    result = await session.execute(stmt)
    rows = result.all()

    total_count = sum(r[1] for r in rows) or 1
    colors = ["#00bc7d", "#10b981", "#22c55e", "#34d399", "#94a3b8", "#6366f1", "#f59e0b"]

    distribution = [
        ModeDistribution(
            mode=row[0],
            percentage=round(row[1] / total_count * 100, 1),
            emissions=round(float(row[2]), 1),
            commute_count=row[1],
            color=colors[i % len(colors)],
        ).model_dump()
        for i, row in enumerate(rows)
    ]

    return ApiResponse(success=True, data=distribution)


@router.get("/locations", response_model=ApiResponse)
async def get_location_performance(
    user=Depends(require_role("sustainability", "admin")),
    session: AsyncSession = Depends(get_session),
):
    """Get per-office emission performance."""
    stmt = select(Office).where(Office.is_active == True)
    result = await session.execute(stmt)
    offices = result.scalars().all()

    data = [LocationEmissionPerformance.model_validate(o).model_dump() for o in offices]
    return ApiResponse(success=True, data=data)


@router.get("/by-department", response_model=ApiResponse)
async def get_emissions_by_department(
    year: int = Query(2026),
    user=Depends(require_role("sustainability", "admin")),
    session: AsyncSession = Depends(get_session),
):
    """Get emission totals grouped by department."""
    dept_stmt = select(
        User.department,
        func.count(func.distinct(User.id)),
    ).where(User.is_active == True).group_by(User.department)
    depts = (await session.execute(dept_stmt)).all()

    data = []
    for dept_name, employee_count in depts:
        stmt = select(
            func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0),
            func.count(func.distinct(CommuteEntry.user_id)),
        ).join(User, CommuteEntry.user_id == User.id).where(
            User.department == dept_name,
            func.extract("year", CommuteEntry.commute_date) == year,
        )
        row = (await session.execute(stmt)).one()
        total_emissions = round(float(row[0]), 2)
        active_users = row[1]
        data.append({
            "department": dept_name or "Unknown",
            "total_emissions": total_emissions,
            "employee_count": employee_count,
            "active_employees": active_users,
            "per_employee": round(total_emissions / max(active_users, 1), 3),
        })

    return ApiResponse(success=True, data=data)


@router.get("/locations/{office_id}", response_model=ApiResponse[LocationEmissionPerformance])
async def get_location_detail(
    office_id: str,
    user=Depends(require_role("sustainability", "admin")),
    session: AsyncSession = Depends(get_session),
):
    """Get single office emission details."""
    stmt = select(Office).where(Office.id == office_id)
    result = await session.execute(stmt)
    office = result.scalar_one_or_none()

    if office is None:
        raise HTTPException(status_code=404, detail="Office not found")

    return ApiResponse(success=True, data=LocationEmissionPerformance.model_validate(office))
