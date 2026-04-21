"""
Emissions Router
GET /emissions/summary, /trends, /mode-split, /locations, /locations/{id},
    /by-department

All aggregation endpoints are tenant-scoped:
- admin / sustainability: see only their tenant's data.
- superadmin: cross-tenant (no filter applied).
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


# ── Helpers ───────────────────────────────────────────────────────────────────

def _role(user) -> str:
    return user.role.value if hasattr(user.role, "value") else user.role


def _is_superadmin(user) -> bool:
    return _role(user) == "superadmin"


def _tenant_commute_base(user, year: Optional[int] = None):
    """
    Return a SELECT statement base that joins CommuteEntry → User and applies
    tenant + optional year filters. Callers can add extra columns/conditions.
    """
    stmt = select(CommuteEntry).join(User, CommuteEntry.user_id == User.id)
    if year is not None:
        stmt = stmt.where(func.extract("year", CommuteEntry.commute_date) == year)
    if not _is_superadmin(user) and user.tenant_id:
        stmt = stmt.where(User.tenant_id == user.tenant_id)
    return stmt


async def _get_tenant_user_ids(session: AsyncSession, user) -> Optional[list]:
    """Get user IDs scoped to tenant; None means no filter (superadmin)."""
    if _is_superadmin(user) or not user.tenant_id:
        return None
    rows = (await session.execute(
        select(User.id).where(User.tenant_id == user.tenant_id)
    )).all()
    return [r[0] for r in rows]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/summary", response_model=ApiResponse[EmissionSummary])
async def get_emissions_summary(
    year: int = Query(2026),
    user=Depends(require_role("sustainability", "admin")),
    session: AsyncSession = Depends(get_session),
):
    """Get emission KPI dashboard summary. Scoped to caller's tenant."""
    uid_list = await _get_tenant_user_ids(session, user)

    def _commute_filter(stmt, y):
        stmt = stmt.where(func.extract("year", CommuteEntry.commute_date) == y)
        if uid_list is not None:
            stmt = stmt.where(CommuteEntry.user_id.in_(uid_list))
        return stmt

    entries_stmt = _commute_filter(
        select(
            func.count(CommuteEntry.id),
            func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0),
            func.coalesce(func.sum(CommuteEntry.distance_km), 0),
        ),
        year,
    )
    row = (await session.execute(entries_stmt)).one()
    total_commutes = row[0]
    total_emissions = float(row[1])

    prev_emissions = float((await session.execute(
        _commute_filter(
            select(func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0)),
            year - 1,
        )
    )).scalar_one())

    yoy_change = round(
        ((total_emissions - prev_emissions) / prev_emissions * 100) if prev_emissions > 0 else 0,
        1,
    )

    active_users = (await session.execute(
        _commute_filter(
            select(func.count(func.distinct(CommuteEntry.user_id))),
            year,
        )
    )).scalar_one()

    total_users_stmt = select(func.count(User.id)).where(User.is_active == True)
    if not _is_superadmin(user) and user.tenant_id:
        total_users_stmt = total_users_stmt.where(User.tenant_id == user.tenant_id)
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
            data_quality_score=78.5,
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
    """Get monthly emission trends. Scoped to caller's tenant."""
    uid_list = await _get_tenant_user_ids(session, user)

    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    trends = []

    for i, month_name in enumerate(months, 1):
        stmt = select(
            func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0),
        ).where(
            func.extract("year", CommuteEntry.commute_date) == year,
            func.extract("month", CommuteEntry.commute_date) == i,
        )
        if uid_list is not None:
            stmt = stmt.where(CommuteEntry.user_id.in_(uid_list))

        actual = float((await session.execute(stmt)).scalar_one())
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
    """Get transport mode distribution. Scoped to caller's tenant."""
    uid_list = await _get_tenant_user_ids(session, user)

    stmt = select(
        CommuteEntry.transport_mode_label,
        func.count(CommuteEntry.id),
        func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0),
    ).where(
        func.extract("year", CommuteEntry.commute_date) == year
    ).group_by(CommuteEntry.transport_mode_label)

    if uid_list is not None:
        stmt = stmt.where(CommuteEntry.user_id.in_(uid_list))

    rows = (await session.execute(stmt)).all()
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
    """Get per-office emission performance. Scoped to caller's tenant."""
    stmt = select(Office).where(Office.is_active == True)
    if not _is_superadmin(user) and user.tenant_id:
        stmt = stmt.where(Office.tenant_id == user.tenant_id)

    offices = (await session.execute(stmt)).scalars().all()
    data = [LocationEmissionPerformance.model_validate(o).model_dump() for o in offices]
    return ApiResponse(success=True, data=data)


@router.get("/by-department", response_model=ApiResponse)
async def get_emissions_by_department(
    year: int = Query(2026),
    user=Depends(require_role("sustainability", "admin")),
    session: AsyncSession = Depends(get_session),
):
    """Get emission totals grouped by department. Scoped to caller's tenant."""
    uid_list = await _get_tenant_user_ids(session, user)

    dept_stmt = select(
        User.department,
        func.count(func.distinct(User.id)),
    ).where(User.is_active == True).group_by(User.department)

    if not _is_superadmin(user) and user.tenant_id:
        dept_stmt = dept_stmt.where(User.tenant_id == user.tenant_id)

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
        if uid_list is not None:
            stmt = stmt.where(CommuteEntry.user_id.in_(uid_list))

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
    office = (await session.execute(
        select(Office).where(Office.id == office_id)
    )).scalar_one_or_none()

    if office is None:
        raise HTTPException(status_code=404, detail="Office not found")

    if not _is_superadmin(user) and user.tenant_id and office.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    return ApiResponse(success=True, data=LocationEmissionPerformance.model_validate(office))
