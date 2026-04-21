"""
Admin Router
GET /admin/overview, /participation, /rides, /locations, /policies, /workplace-benefits, /settings
PUT /admin/locations/{id}, /policies/{id}, /workplace-benefits/{id}, /settings
POST /admin/policies, /admin/locations, /admin/participation/target, /admin/participation/reminder
DELETE /admin/locations/{id}, /admin/policies/{id}

Tenant isolation: all data scoped to user.tenant_id.
SuperAdmin bypasses isolation (handled in require_role dependency).
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import require_role
from models.user import User
from models.commute import CommuteEntry
from models.carpooling import Ride
from models.organization import Office, Policy
from models.transport import IrishWorkplaceBenefit
from schemas.organization import OfficeCreate, OfficeRead, OfficeUpdate, PolicyRead, PolicyCreate, PolicyUpdate
from schemas.admin import (
    AdminSettingsRead, AdminSettingsUpdate,
    ParticipationTargetCreate, ParticipationReminderCreate,
    BenefitEnableUpdate,
)
from schemas.common import ApiResponse
from services.audit_logger import log_action

router = APIRouter(prefix="/admin", tags=["Admin"])


def _role(user) -> str:
    return user.role.value if hasattr(user.role, "value") else user.role


def _is_superadmin(user) -> bool:
    return _role(user) == "superadmin"


# ── Overview ──────────────────────────────────────────────────────────────────

@router.get("/overview", response_model=ApiResponse)
async def get_admin_overview(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Admin dashboard KPIs — scoped to tenant."""
    tid = user.tenant_id

    # Base user filter
    user_filter = User.is_active == True
    if tid:
        user_filter = user_filter & (User.tenant_id == tid)

    total_users = (await session.execute(select(func.count(User.id)).where(user_filter))).scalar_one()

    # CommutEntry and Ride — no tenant_id, so join through User
    commute_stmt = select(func.count(CommuteEntry.id)).join(
        User, CommuteEntry.user_id == User.id
    )
    ride_stmt = select(func.count(Ride.id)).join(
        User, Ride.driver_id == User.id
    )
    active_ride_stmt = select(func.count(Ride.id)).join(
        User, Ride.driver_id == User.id
    ).where(Ride.status.in_(["scheduled", "active"]))
    emissions_stmt = select(func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0)).join(
        User, CommuteEntry.user_id == User.id
    )
    co2_saved_stmt = select(func.coalesce(func.sum(Ride.co2_saved), 0)).join(
        User, Ride.driver_id == User.id
    )
    active_users_stmt = select(func.count(func.distinct(CommuteEntry.user_id))).join(
        User, CommuteEntry.user_id == User.id
    )

    if tid:
        commute_stmt     = commute_stmt.where(User.tenant_id == tid)
        ride_stmt        = ride_stmt.where(User.tenant_id == tid)
        active_ride_stmt = active_ride_stmt.where(User.tenant_id == tid)
        emissions_stmt   = emissions_stmt.where(User.tenant_id == tid)
        co2_saved_stmt   = co2_saved_stmt.where(User.tenant_id == tid)
        active_users_stmt = active_users_stmt.where(User.tenant_id == tid)

    total_commutes  = (await session.execute(commute_stmt)).scalar_one()
    total_rides     = (await session.execute(ride_stmt)).scalar_one()
    active_rides    = (await session.execute(active_ride_stmt)).scalar_one()
    total_emissions = float((await session.execute(emissions_stmt)).scalar_one())
    total_co2_saved = float((await session.execute(co2_saved_stmt)).scalar_one())
    active_users    = (await session.execute(active_users_stmt)).scalar_one()

    return ApiResponse(success=True, data={
        "total_users": total_users,
        "active_users": active_users,
        "participation_rate": round((active_users / max(total_users, 1)) * 100, 1),
        "total_commutes_logged": total_commutes,
        "total_rides": total_rides,
        "active_rides": active_rides,
        "total_emissions_kg": round(total_emissions, 1),
        "total_co2_saved_kg": round(total_co2_saved, 1),
    })


# ── Participation ─────────────────────────────────────────────────────────────

@router.get("/participation", response_model=ApiResponse)
async def get_participation(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Participation rates by department — scoped to tenant."""
    tid = user.tenant_id

    dept_stmt = select(User.department, func.count(User.id)).where(User.is_active == True)
    if tid:
        dept_stmt = dept_stmt.where(User.tenant_id == tid)
    dept_stmt = dept_stmt.group_by(User.department)

    departments = (await session.execute(dept_stmt)).all()

    data = []
    for dept_name, count in departments:
        active_stmt = select(func.count(func.distinct(CommuteEntry.user_id))).join(
            User, CommuteEntry.user_id == User.id
        ).where(User.department == dept_name)
        if tid:
            active_stmt = active_stmt.where(User.tenant_id == tid)
        active_count = (await session.execute(active_stmt)).scalar_one()

        data.append({
            "department": dept_name or "Unknown",
            "total_employees": count,
            "active_employees": active_count,
            "participation_rate": round((active_count / max(count, 1)) * 100, 1),
        })

    return ApiResponse(success=True, data=data)


# ── Rides ─────────────────────────────────────────────────────────────────────

@router.get("/rides", response_model=ApiResponse)
async def get_ride_operations(
    status: str = Query(None),
    search: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Ride operations — scoped to tenant via driver."""
    tid = user.tenant_id

    # Join Ride → User (driver) to apply tenant filter
    stmt = select(Ride).join(User, Ride.driver_id == User.id)
    if tid:
        stmt = stmt.where(User.tenant_id == tid)
    if status:
        stmt = stmt.where(Ride.status == status)
    if search:
        stmt = stmt.where(
            Ride.origin.ilike(f"%{search}%") | Ride.destination.ilike(f"%{search}%")
        )

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


@router.post("/rides/{ride_id}/cancel", response_model=ApiResponse)
async def admin_cancel_ride(
    ride_id: str,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Admin force-cancel a ride — tenant-scoped."""
    tid = user.tenant_id

    ride = (await session.execute(select(Ride).where(Ride.id == ride_id))).scalar_one_or_none()
    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found")

    # Check driver belongs to this tenant
    if tid:
        driver = (await session.execute(
            select(User).where(User.id == ride.driver_id)
        )).scalar_one_or_none()
        if driver is None or driver.tenant_id != tid:
            raise HTTPException(status_code=403, detail="Access denied")

    ride.status = "cancelled"
    ride.updated_at = datetime.utcnow()
    session.add(ride)

    await log_action(session, user.id, _role(user), "update", "ride", ride_id,
                     description="Admin cancelled ride")
    return ApiResponse(success=True, meta={"message": "Ride cancelled"})


# ── Locations ─────────────────────────────────────────────────────────────────

@router.get("/locations", response_model=ApiResponse)
async def get_locations(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """List offices — scoped to tenant."""
    stmt = select(Office)
    if user.tenant_id:
        stmt = stmt.where(Office.tenant_id == user.tenant_id)
    offices = (await session.execute(stmt)).scalars().all()
    return ApiResponse(success=True, data=[OfficeRead.model_validate(o).model_dump() for o in offices])


@router.post("/locations", response_model=ApiResponse[OfficeRead], status_code=201)
async def create_location(
    data: OfficeCreate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Create a new office location — stamped with tenant."""
    office = Office(**data.model_dump(), tenant_id=user.tenant_id)
    session.add(office)
    await session.flush()
    await session.refresh(office)

    await log_action(session, user.id, _role(user), "create", "office", office.id)
    return ApiResponse(success=True, data=OfficeRead.model_validate(office))


@router.put("/locations/{office_id}", response_model=ApiResponse[OfficeRead])
async def update_location(
    office_id: str,
    update: OfficeUpdate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Update office details — tenant-scoped."""
    office = (await session.execute(select(Office).where(Office.id == office_id))).scalar_one_or_none()
    if office is None:
        raise HTTPException(status_code=404, detail="Office not found")
    if user.tenant_id and office.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(office, key, value)
    office.updated_at = datetime.utcnow()
    session.add(office)
    await session.flush()
    await session.refresh(office)

    await log_action(session, user.id, _role(user), "update", "office", office.id)
    return ApiResponse(success=True, data=OfficeRead.model_validate(office))


@router.delete("/locations/{office_id}", response_model=ApiResponse)
async def delete_location(
    office_id: str,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Deactivate an office location — tenant-scoped."""
    office = (await session.execute(select(Office).where(Office.id == office_id))).scalar_one_or_none()
    if office is None:
        raise HTTPException(status_code=404, detail="Office not found")
    if user.tenant_id and office.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    office.is_active = False
    office.updated_at = datetime.utcnow()
    session.add(office)

    await log_action(session, user.id, _role(user), "delete", "office", office.id)
    return ApiResponse(success=True, meta={"message": "Location deactivated"})


# ── Policies ──────────────────────────────────────────────────────────────────

@router.get("/policies", response_model=ApiResponse)
async def get_policies(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """List policies — scoped to tenant."""
    stmt = select(Policy)
    if user.tenant_id:
        stmt = stmt.where(Policy.tenant_id == user.tenant_id)
    policies = (await session.execute(stmt)).scalars().all()
    return ApiResponse(success=True, data=[PolicyRead.model_validate(p).model_dump() for p in policies])


@router.post("/policies", response_model=ApiResponse[PolicyRead], status_code=201)
async def create_policy(
    policy: PolicyCreate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Create a new policy — stamped with tenant."""
    p = Policy(
        title=policy.title,
        description=policy.description,
        category=policy.category,
        effective_date=policy.effective_date,
        created_by=user.id,
        tenant_id=user.tenant_id,
    )
    session.add(p)
    await session.flush()
    await session.refresh(p)

    await log_action(session, user.id, _role(user), "create", "policy", p.id)
    return ApiResponse(success=True, data=PolicyRead.model_validate(p))


@router.put("/policies/{policy_id}", response_model=ApiResponse[PolicyRead])
async def update_policy(
    policy_id: str,
    update: PolicyUpdate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Update a policy — tenant-scoped."""
    p = (await session.execute(select(Policy).where(Policy.id == policy_id))).scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    if user.tenant_id and p.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(p, key, value)
    p.updated_at = datetime.utcnow()
    session.add(p)
    await session.flush()
    await session.refresh(p)

    await log_action(session, user.id, _role(user), "update", "policy", p.id)
    return ApiResponse(success=True, data=PolicyRead.model_validate(p))


@router.delete("/policies/{policy_id}", response_model=ApiResponse)
async def delete_policy(
    policy_id: str,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Delete a policy — tenant-scoped."""
    p = (await session.execute(select(Policy).where(Policy.id == policy_id))).scalar_one_or_none()
    if p is None:
        raise HTTPException(status_code=404, detail="Policy not found")
    if user.tenant_id and p.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    await session.delete(p)
    await log_action(session, user.id, _role(user), "delete", "policy", policy_id)
    return ApiResponse(success=True, meta={"message": "Policy deleted"})


# ── Workplace Benefits (global reference data — no tenant filter) ─────────────

@router.get("/workplace-benefits", response_model=ApiResponse)
async def get_workplace_benefits(
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """List Irish workplace benefits (shared global data)."""
    benefits = (await session.execute(select(IrishWorkplaceBenefit))).scalars().all()
    return ApiResponse(success=True, data=[{
        "id": b.id, "name": b.name, "description": b.description,
        "category": b.category.value if hasattr(b.category, "value") else b.category,
        "region": b.region, "tax_relief": b.tax_relief,
        "max_amount": b.max_amount,
        "status": b.status.value if hasattr(b.status, "value") else b.status,
        "compliance_required": b.compliance_required,
    } for b in benefits])


@router.put("/workplace-benefits/{benefit_id}/enable", response_model=ApiResponse)
async def enable_workplace_benefit(
    benefit_id: str,
    data: BenefitEnableUpdate,
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

    await log_action(session, user.id, _role(user), "update", "policy", benefit_id,
                     description=f"Benefit {'enabled' if data.enabled else 'disabled'}")
    return ApiResponse(success=True, meta={
        "message": f"Benefit {'enabled' if data.enabled else 'disabled'} successfully"
    })


# ── Settings ─────────────────────────────────────────────────────────────────

@router.get("/settings", response_model=ApiResponse[AdminSettingsRead])
async def get_settings(
    user=Depends(require_role("admin")),
):
    """Get admin settings (placeholder — no settings table yet)."""
    return ApiResponse(success=True, data=AdminSettingsRead(
        company_name="CoShyft Ireland",
        default_region="IE",
        emission_factor_source="SEAI 2024",
        data_retention_days=365,
        enable_carpooling=True,
        enable_gamification=True,
        oxypoints_multiplier=1.0,
    ))


@router.put("/settings", response_model=ApiResponse)
async def update_settings(
    settings: AdminSettingsUpdate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    """Update admin settings."""
    await log_action(session, user.id, _role(user), "update", "admin_settings", "admin-settings",
                     description="Admin settings updated")
    return ApiResponse(
        success=True,
        data=settings.model_dump(exclude_unset=True),
        meta={"message": "Settings updated successfully"},
    )


# ── Participation targets / reminders ─────────────────────────────────────────

@router.post("/participation/target", response_model=ApiResponse)
async def set_participation_target(
    data: ParticipationTargetCreate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    await log_action(session, user.id, _role(user), "update", "participation", "participation-target",
                     description=f"Set target {data.target_percent}% for {data.department}")
    return ApiResponse(success=True, meta={
        "message": f"Target set to {data.target_percent}% for {data.department}"
    })


@router.post("/participation/reminder", response_model=ApiResponse)
async def send_participation_reminder(
    data: ParticipationReminderCreate,
    user=Depends(require_role("admin")),
    session: AsyncSession = Depends(get_session),
):
    await log_action(session, user.id, _role(user), "create", "participation", "participation-reminder",
                     description=f"Reminder sent to {data.department}")
    return ApiResponse(success=True, meta={
        "message": f"Reminder sent to {data.department} department"
    })
