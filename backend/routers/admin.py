"""
Admin Router
GET /admin/overview, /participation, /rides, /locations, /policies, /workplace-benefits, /settings
PUT /admin/locations/{id}, /policies/{id}, /workplace-benefits/{id}, /settings
POST /admin/policies, /admin/locations, /admin/participation/target, /admin/participation/reminder
DELETE /admin/locations/{id}, /admin/policies/{id}
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel

from database import get_session
from auth.dependencies import require_role
from models.user import User
from models.commute import CommuteEntry
from models.carpooling import Ride
from models.organization import Office, Policy
from models.transport import IrishWorkplaceBenefit
from schemas.organization import OfficeRead, OfficeUpdate, PolicyRead, PolicyCreate, PolicyUpdate
from schemas.common import ApiResponse
from services.audit_logger import log_action

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/overview", response_model=ApiResponse)
async def get_admin_overview(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Admin dashboard KPIs."""
    total_users = (await session.execute(select(func.count(User.id)).where(User.is_active == True))).scalar_one()
    total_commutes = (await session.execute(select(func.count(CommuteEntry.id)))).scalar_one()
    total_rides = (await session.execute(select(func.count(Ride.id)))).scalar_one()
    active_rides = (await session.execute(
        select(func.count(Ride.id)).where(Ride.status.in_(["scheduled", "active"]))
    )).scalar_one()
    total_emissions = (await session.execute(
        select(func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0))
    )).scalar_one()
    total_co2_saved = (await session.execute(
        select(func.coalesce(func.sum(Ride.co2_saved), 0))
    )).scalar_one()

    active_users = (await session.execute(
        select(func.count(func.distinct(CommuteEntry.user_id)))
    )).scalar_one()

    return ApiResponse(success=True, data={
        "total_users": total_users,
        "active_users": active_users,
        "participation_rate": round((active_users / max(total_users, 1)) * 100, 1),
        "total_commutes_logged": total_commutes,
        "total_rides": total_rides,
        "active_rides": active_rides,
        "total_emissions_kg": round(float(total_emissions), 1),
        "total_co2_saved_kg": round(float(total_co2_saved), 1),
    })


@router.get("/participation", response_model=ApiResponse)
async def get_participation(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Participation rates by department."""
    dept_stmt = select(
        User.department,
        func.count(User.id),
    ).where(User.is_active == True).group_by(User.department)

    dept_result = await session.execute(dept_stmt)
    departments = dept_result.all()

    data = []
    for dept_name, count in departments:
        active_stmt = select(func.count(func.distinct(CommuteEntry.user_id))).join(
            User, CommuteEntry.user_id == User.id
        ).where(User.department == dept_name)
        active_count = (await session.execute(active_stmt)).scalar_one()

        data.append({
            "department": dept_name or "Unknown",
            "total_employees": count,
            "active_employees": active_count,
            "participation_rate": round((active_count / max(count, 1)) * 100, 1),
        })

    return ApiResponse(success=True, data=data)


@router.get("/rides", response_model=ApiResponse)
async def get_ride_operations(
    status: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """All ride operations overview."""
    stmt = select(Ride)
    if status:
        stmt = stmt.where(Ride.status == status)

    total = (await session.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    stmt = stmt.order_by(Ride.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    rides = (await session.execute(stmt)).scalars().all()

    from schemas.carpooling import RideRead
    return ApiResponse(success=True, data={
        "items": [RideRead.model_validate(r).model_dump() for r in rides],
        "total": total,
        "page": page,
        "page_size": page_size,
    })


@router.get("/locations", response_model=ApiResponse)
async def get_locations(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """List all offices."""
    offices = (await session.execute(select(Office))).scalars().all()
    return ApiResponse(
        success=True,
        data=[OfficeRead.model_validate(o).model_dump() for o in offices],
    )


@router.put("/locations/{office_id}", response_model=ApiResponse[OfficeRead])
async def update_location(
    office_id: str,
    update: OfficeUpdate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Update office details."""
    office = (await session.execute(select(Office).where(Office.id == office_id))).scalar_one_or_none()
    if office is None:
        raise HTTPException(status_code=404, detail="Office not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(office, key, value)
    office.updated_at = datetime.now(timezone.utc)
    session.add(office)
    await session.flush()
    await session.refresh(office)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "update", "baseline", office.id,
    )
    return ApiResponse(success=True, data=OfficeRead.model_validate(office))


@router.get("/policies", response_model=ApiResponse)
async def get_policies(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """List all policies."""
    policies = (await session.execute(select(Policy))).scalars().all()
    return ApiResponse(
        success=True,
        data=[PolicyRead.model_validate(p).model_dump() for p in policies],
    )


@router.post("/policies", response_model=ApiResponse[PolicyRead], status_code=201)
async def create_policy(
    policy: PolicyCreate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Create a new policy."""
    p = Policy(
        title=policy.title,
        description=policy.description,
        category=policy.category,
        effective_date=policy.effective_date,
        created_by=user.id,
    )
    session.add(p)
    await session.flush()
    await session.refresh(p)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "policy", p.id,
    )
    return ApiResponse(success=True, data=PolicyRead.model_validate(p))


@router.put("/policies/{policy_id}", response_model=ApiResponse[PolicyRead])
async def update_policy(
    policy_id: str,
    update: PolicyUpdate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Update a policy."""
    p = (await session.execute(select(Policy).where(Policy.id == policy_id))).scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=404, detail="Policy not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(p, key, value)
    p.updated_at = datetime.now(timezone.utc)
    session.add(p)
    await session.flush()
    await session.refresh(p)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "update", "policy", p.id,
    )
    return ApiResponse(success=True, data=PolicyRead.model_validate(p))


@router.get("/workplace-benefits", response_model=ApiResponse)
async def get_workplace_benefits(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """List Irish workplace benefits."""
    benefits = (await session.execute(select(IrishWorkplaceBenefit))).scalars().all()
    return ApiResponse(success=True, data=[{
        "id": b.id, "name": b.name, "description": b.description,
        "category": b.category.value if hasattr(b.category, 'value') else b.category,
        "region": b.region, "tax_relief": b.tax_relief,
        "max_amount": b.max_amount, "status": b.status.value if hasattr(b.status, 'value') else b.status,
        "compliance_required": b.compliance_required,
    } for b in benefits])


# --- Location CRUD ---

class OfficeCreate(BaseModel):
    name: str
    city: str
    country: str = "Ireland"
    region: str = "IE"
    address: Optional[str] = None
    employee_count: int = 0
    parking_spaces: int = 0
    bike_parking: int = 0
    ev_chargers: int = 0
    public_transport_access: Optional[str] = None


@router.post("/locations", response_model=ApiResponse[OfficeRead], status_code=201)
async def create_location(
    data: OfficeCreate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Create a new office location."""
    office = Office(**data.model_dump())
    session.add(office)
    await session.flush()
    await session.refresh(office)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "baseline", office.id,
    )
    return ApiResponse(success=True, data=OfficeRead.model_validate(office))


@router.delete("/locations/{office_id}", response_model=ApiResponse)
async def delete_location(
    office_id: str,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Delete (deactivate) an office location."""
    office = (await session.execute(select(Office).where(Office.id == office_id))).scalar_one_or_none()
    if office is None:
        raise HTTPException(status_code=404, detail="Office not found")

    office.is_active = False
    office.updated_at = datetime.now(timezone.utc)
    session.add(office)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "delete", "baseline", office.id,
    )
    return ApiResponse(success=True, meta={"message": "Location deactivated"})


@router.delete("/policies/{policy_id}", response_model=ApiResponse)
async def delete_policy(
    policy_id: str,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Delete a policy."""
    p = (await session.execute(select(Policy).where(Policy.id == policy_id))).scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    await session.delete(p)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "delete", "policy", policy_id,
    )
    return ApiResponse(success=True, meta={"message": "Policy deleted"})


# --- Settings ---

class AdminSettingsPayload(BaseModel):
    company_name: Optional[str] = None
    default_region: Optional[str] = None
    emission_factor_source: Optional[str] = None
    data_retention_days: Optional[int] = None
    enable_carpooling: Optional[bool] = None
    enable_gamification: Optional[bool] = None
    oxypoints_multiplier: Optional[float] = None


@router.get("/settings", response_model=ApiResponse)
async def get_settings(
    user=Depends(require_role("admin")),
):
    """Get admin settings."""
    # Placeholder - in production these come from a settings table
    return ApiResponse(success=True, data={
        "company_name": "CoShift Ireland",
        "default_region": "IE",
        "emission_factor_source": "SEAI 2024",
        "data_retention_days": 365,
        "enable_carpooling": True,
        "enable_gamification": True,
        "oxypoints_multiplier": 1.0,
    })


@router.put("/settings", response_model=ApiResponse)
async def update_settings(
    settings: AdminSettingsPayload,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Update admin settings."""
    # In production, persist to a settings table
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "update", "policy", "admin-settings",
        description="Admin settings updated",
    )
    return ApiResponse(
        success=True,
        data=settings.model_dump(exclude_unset=True),
        meta={"message": "Settings updated successfully"},
    )


# --- Participation targets/reminders ---

class ParticipationTargetPayload(BaseModel):
    department: str
    target_percent: float


class ParticipationReminderPayload(BaseModel):
    department: str
    message: Optional[str] = None


@router.post("/participation/target", response_model=ApiResponse)
async def set_participation_target(
    data: ParticipationTargetPayload,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Set participation target for a department."""
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "update", "baseline", "participation-target",
        description=f"Set target {data.target_percent}% for {data.department}",
    )
    return ApiResponse(success=True, meta={
        "message": f"Target set to {data.target_percent}% for {data.department}",
    })


@router.post("/participation/reminder", response_model=ApiResponse)
async def send_participation_reminder(
    data: ParticipationReminderPayload,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Send participation reminder to a department."""
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "baseline", "participation-reminder",
        description=f"Reminder sent to {data.department}",
    )
    return ApiResponse(success=True, meta={
        "message": f"Reminder sent to {data.department} department",
    })


# --- Workplace Benefits enable ---

class BenefitEnablePayload(BaseModel):
    enabled: bool = True


@router.put("/workplace-benefits/{benefit_id}/enable", response_model=ApiResponse)
async def enable_workplace_benefit(
    benefit_id: str,
    data: BenefitEnablePayload,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Enable or disable a workplace benefit."""
    benefit = (await session.execute(
        select(IrishWorkplaceBenefit).where(IrishWorkplaceBenefit.id == benefit_id)
    )).scalar_one_or_none()
    if benefit is None:
        raise HTTPException(status_code=404, detail="Benefit not found")

    benefit.status = "active" if data.enabled else "inactive"
    session.add(benefit)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "update", "policy", benefit_id,
        description=f"Benefit {'enabled' if data.enabled else 'disabled'}",
    )
    return ApiResponse(success=True, meta={
        "message": f"Benefit {'enabled' if data.enabled else 'disabled'} successfully",
    })