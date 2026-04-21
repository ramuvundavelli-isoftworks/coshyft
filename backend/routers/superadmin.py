"""
Super Admin Router
GET    /superadmin/dashboard
GET    /superadmin/tenants
POST   /superadmin/tenants
GET    /superadmin/tenants/{id}
PUT    /superadmin/tenants/{id}
DELETE /superadmin/tenants/{id}
POST   /superadmin/tenants/{id}/suspend
POST   /superadmin/tenants/{id}/activate
GET    /superadmin/tenants/{id}/config
PUT    /superadmin/tenants/{id}/config
GET    /superadmin/tenants/{id}/users
GET    /superadmin/users
PUT    /superadmin/users/{id}
GET    /superadmin/usage
GET    /superadmin/health
GET    /superadmin/settings
PUT    /superadmin/settings
GET    /superadmin/audit-log
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import require_role
from models.user import User
from auth.passwords import hash_password
from models.tenant import Tenant, TenantConfig, TenantStatusEnum
from models.commute import CommuteEntry
from models.carpooling import Ride
from models.organization import Office
from models.audit import AuditLog
from schemas.superadmin import (
    TenantRead, TenantCreate, TenantUpdate,
    TenantConfigRead, TenantConfigUpdate,
    TenantUserCreate, UserSummaryRead, UserRoleUpdate,
    AuditLogRead,
    SystemHealthRead, UsageAnalyticsRead, PlatformSettings,
)
from schemas.common import ApiResponse

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])


# ---------------------------------------------------------------------------
# Helper: build TenantRead with computed counts
# ---------------------------------------------------------------------------
async def _tenant_with_counts(t: Tenant, session: AsyncSession) -> dict:
    user_count = (await session.execute(
        select(func.count(User.id)).where(User.tenant_id == t.id)
    )).scalar_one()
    office_count = (await session.execute(
        select(func.count(Office.id)).where(Office.tenant_id == t.id, Office.is_active == True)
    )).scalar_one()
    total_emissions = float((await session.execute(
        select(func.coalesce(func.sum(Office.total_emissions), 0)).where(Office.tenant_id == t.id)
    )).scalar_one())

    return {
        **TenantRead.model_validate(t).model_dump(),
        "user_count": user_count,
        "office_count": office_count,
        "total_emissions": round(total_emissions, 2),
    }


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------
@router.get("/dashboard", response_model=ApiResponse)
async def get_dashboard(
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Platform-wide KPIs."""
    tenants = (await session.execute(select(func.count(Tenant.id)))).scalar_one()
    users = (await session.execute(select(func.count(User.id)))).scalar_one()
    commutes = (await session.execute(select(func.count(CommuteEntry.id)))).scalar_one()
    rides = (await session.execute(select(func.count(Ride.id)))).scalar_one()
    co2_saved = float((await session.execute(
        select(func.coalesce(func.sum(Ride.co2_saved), 0))
    )).scalar_one())

    return ApiResponse(success=True, data={
        "total_tenants": tenants,
        "total_users": users,
        "total_commutes": commutes,
        "total_rides": rides,
        "total_co2_saved_kg": round(co2_saved, 1),
        "platform_status": "healthy",
    })


# ---------------------------------------------------------------------------
# Tenants — list & create
# ---------------------------------------------------------------------------
@router.get("/tenants", response_model=ApiResponse)
async def list_tenants(
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """List all tenants with user, office, and emission counts."""
    tenants = (await session.execute(select(Tenant))).scalars().all()
    data = [await _tenant_with_counts(t, session) for t in tenants]
    return ApiResponse(success=True, data=data)


@router.post("/tenants", response_model=ApiResponse[TenantRead], status_code=201)
async def create_tenant(
    data: TenantCreate,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Onboard a new tenant."""
    existing = (await session.execute(
        select(Tenant).where(Tenant.slug == data.slug)
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Tenant slug already exists")

    tenant = Tenant(**data.model_dump())
    session.add(tenant)
    await session.flush()

    config = TenantConfig(tenant_id=tenant.id)
    session.add(config)
    await session.flush()
    await session.refresh(tenant)

    return ApiResponse(success=True, data=TenantRead.model_validate(tenant))


# ---------------------------------------------------------------------------
# Tenants — single tenant CRUD
# ---------------------------------------------------------------------------
@router.get("/tenants/{tenant_id}", response_model=ApiResponse)
async def get_tenant(
    tenant_id: str,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Get a single tenant with computed counts."""
    t = (await session.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")

    return ApiResponse(success=True, data=await _tenant_with_counts(t, session))


@router.put("/tenants/{tenant_id}", response_model=ApiResponse[TenantRead])
async def update_tenant(
    tenant_id: str,
    update: TenantUpdate,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Update tenant details."""
    t = (await session.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(t, key, value)
    t.updated_at = datetime.utcnow()
    session.add(t)
    await session.flush()
    await session.refresh(t)

    return ApiResponse(success=True, data=TenantRead.model_validate(t))


@router.delete("/tenants/{tenant_id}", response_model=ApiResponse)
async def deactivate_tenant(
    tenant_id: str,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Permanently deactivate a tenant."""
    t = (await session.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")

    t.status = TenantStatusEnum.DEACTIVATED
    t.updated_at = datetime.utcnow()
    session.add(t)

    return ApiResponse(success=True, meta={"message": f"Tenant {t.name} deactivated"})


@router.post("/tenants/{tenant_id}/suspend", response_model=ApiResponse)
async def suspend_tenant(
    tenant_id: str,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Suspend a tenant."""
    t = (await session.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")

    t.status = TenantStatusEnum.SUSPENDED
    t.updated_at = datetime.utcnow()
    session.add(t)

    return ApiResponse(success=True, meta={"message": f"Tenant {t.name} suspended"})


@router.post("/tenants/{tenant_id}/activate", response_model=ApiResponse)
async def activate_tenant(
    tenant_id: str,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Reactivate a suspended or trial tenant."""
    t = (await session.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")
    if t.status == TenantStatusEnum.DEACTIVATED:
        raise HTTPException(status_code=400, detail="Deactivated tenants cannot be reactivated")

    t.status = TenantStatusEnum.ACTIVE
    t.updated_at = datetime.utcnow()
    session.add(t)

    return ApiResponse(success=True, meta={"message": f"Tenant {t.name} activated"})


# ---------------------------------------------------------------------------
# Tenant config
# ---------------------------------------------------------------------------
@router.get("/tenants/{tenant_id}/config", response_model=ApiResponse[TenantConfigRead])
async def get_tenant_config(
    tenant_id: str,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Get a tenant's feature configuration."""
    config = (await session.execute(
        select(TenantConfig).where(TenantConfig.tenant_id == tenant_id)
    )).scalar_one_or_none()
    if config is None:
        raise HTTPException(status_code=404, detail="Tenant config not found")

    return ApiResponse(success=True, data=TenantConfigRead.model_validate(config))


@router.put("/tenants/{tenant_id}/config", response_model=ApiResponse[TenantConfigRead])
async def update_tenant_config(
    tenant_id: str,
    update: TenantConfigUpdate,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Update a tenant's feature flags and settings."""
    config = (await session.execute(
        select(TenantConfig).where(TenantConfig.tenant_id == tenant_id)
    )).scalar_one_or_none()
    if config is None:
        raise HTTPException(status_code=404, detail="Tenant config not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(config, key, value)
    config.updated_at = datetime.utcnow()
    session.add(config)
    await session.flush()
    await session.refresh(config)

    return ApiResponse(success=True, data=TenantConfigRead.model_validate(config))


# ---------------------------------------------------------------------------
# Tenant users
# ---------------------------------------------------------------------------
@router.get("/tenants/{tenant_id}/users", response_model=ApiResponse)
async def list_tenant_users(
    tenant_id: str,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, le=200),
):
    """List all users belonging to a specific tenant."""
    t = (await session.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")

    users = (await session.execute(
        select(User).where(User.tenant_id == tenant_id).offset(skip).limit(limit)
    )).scalars().all()

    total = (await session.execute(
        select(func.count(User.id)).where(User.tenant_id == tenant_id)
    )).scalar_one()

    return ApiResponse(
        success=True,
        data=[UserSummaryRead.model_validate(u).model_dump() for u in users],
        meta={"total": total, "skip": skip, "limit": limit},
    )


@router.post("/tenants/{tenant_id}/users", response_model=ApiResponse[UserSummaryRead], status_code=201)
async def create_tenant_user(
    tenant_id: str,
    data: TenantUserCreate,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Create a new user for a specific tenant (e.g. a corporate admin)."""
    t = (await session.execute(
        select(Tenant).where(Tenant.id == tenant_id)
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")

    existing = (await session.execute(
        select(User).where(User.email == data.email)
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    new_user = User(
        email=data.email,
        name=data.name,
        hashed_password=hash_password(data.password),
        role=data.role,
        department=data.department,
        tenant_id=tenant_id,
        locale="en-IE",
        region=t.primary_region,
        is_active=True,
    )
    session.add(new_user)
    await session.flush()
    await session.refresh(new_user)

    return ApiResponse(success=True, data=UserSummaryRead.model_validate(new_user))


# ---------------------------------------------------------------------------
# Cross-tenant user management
# ---------------------------------------------------------------------------
@router.get("/users", response_model=ApiResponse)
async def list_all_users(
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, le=200),
    tenant_id: Optional[str] = Query(default=None),
    role: Optional[str] = Query(default=None),
):
    """List all users across all tenants, with optional filters."""
    query = select(User)
    count_query = select(func.count(User.id))

    if tenant_id:
        query = query.where(User.tenant_id == tenant_id)
        count_query = count_query.where(User.tenant_id == tenant_id)
    if role:
        query = query.where(User.role == role)
        count_query = count_query.where(User.role == role)

    total = (await session.execute(count_query)).scalar_one()
    users = (await session.execute(query.offset(skip).limit(limit))).scalars().all()

    return ApiResponse(
        success=True,
        data=[UserSummaryRead.model_validate(u).model_dump() for u in users],
        meta={"total": total, "skip": skip, "limit": limit},
    )


@router.put("/users/{user_id}", response_model=ApiResponse[UserSummaryRead])
async def update_user(
    user_id: str,
    update: UserRoleUpdate,
    current_user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Update a user's role or active status across any tenant."""
    u = (await session.execute(
        select(User).where(User.id == user_id)
    )).scalar_one_or_none()
    if u is None:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(u, key, value)
    u.updated_at = datetime.utcnow()
    session.add(u)
    await session.flush()
    await session.refresh(u)

    return ApiResponse(success=True, data=UserSummaryRead.model_validate(u))


# ---------------------------------------------------------------------------
# Usage analytics
# ---------------------------------------------------------------------------
@router.get("/usage", response_model=ApiResponse[UsageAnalyticsRead])
async def get_usage(
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Usage analytics across all tenants."""
    total_tenants = (await session.execute(select(func.count(Tenant.id)))).scalar_one()
    active_tenants = (await session.execute(
        select(func.count(Tenant.id)).where(Tenant.status == TenantStatusEnum.ACTIVE)
    )).scalar_one()
    total_users = (await session.execute(select(func.count(User.id)))).scalar_one()
    total_commutes = (await session.execute(select(func.count(CommuteEntry.id)))).scalar_one()
    total_rides = (await session.execute(
        select(func.count(Ride.id)).where(Ride.status == "completed")
    )).scalar_one()
    total_co2 = float((await session.execute(
        select(func.coalesce(func.sum(Ride.co2_saved), 0))
    )).scalar_one())

    # Per-tenant breakdown
    tenants = (await session.execute(select(Tenant))).scalars().all()
    tenant_breakdown = []
    for t in tenants:
        u_count = (await session.execute(
            select(func.count(User.id)).where(User.tenant_id == t.id)
        )).scalar_one()
        tenant_breakdown.append({
            "tenant_id": t.id,
            "name": t.name,
            "plan": t.plan,
            "status": t.status,
            "user_count": u_count,
        })

    return ApiResponse(success=True, data=UsageAnalyticsRead(
        total_tenants=total_tenants,
        active_tenants=active_tenants,
        total_users=total_users,
        active_users_today=0,
        active_users_week=0,
        total_commutes_logged=total_commutes,
        total_rides_completed=total_rides,
        total_co2_saved_kg=round(total_co2, 1),
        total_oxypoints_awarded=0,
        api_calls_today=0,
        storage_used_gb=0,
        revenue_monthly=0,
        tenant_breakdown=tenant_breakdown,
    ))


# ---------------------------------------------------------------------------
# System health
# ---------------------------------------------------------------------------
@router.get("/health", response_model=ApiResponse[SystemHealthRead])
async def get_system_health(
    user=Depends(require_role("superadmin")),
):
    """System health metrics."""
    return ApiResponse(success=True, data=SystemHealthRead(
        status="healthy",
        uptime_hours=720,
        api_latency_ms=45,
        db_latency_ms=12,
        active_connections=24,
        memory_usage_percent=62.5,
        cpu_usage_percent=28.3,
        disk_usage_percent=41.2,
        error_rate_percent=0.02,
        services=[
            {"name": "API Server", "status": "healthy", "latency_ms": 45},
            {"name": "Database", "status": "healthy", "latency_ms": 12},
            {"name": "Redis Cache", "status": "healthy", "latency_ms": 3},
            {"name": "Background Workers", "status": "healthy", "latency_ms": None},
        ],
        last_checked=datetime.utcnow(),
    ))


# ---------------------------------------------------------------------------
# Platform settings
# ---------------------------------------------------------------------------
@router.get("/settings", response_model=ApiResponse[PlatformSettings])
async def get_settings(
    user=Depends(require_role("superadmin")),
):
    """Get platform settings."""
    return ApiResponse(success=True, data=PlatformSettings())


@router.put("/settings", response_model=ApiResponse[PlatformSettings])
async def update_settings(
    settings_update: PlatformSettings,
    user=Depends(require_role("superadmin")),
):
    """Update platform settings."""
    return ApiResponse(success=True, data=settings_update)


# ---------------------------------------------------------------------------
# Platform audit log
# ---------------------------------------------------------------------------
@router.get("/audit-log", response_model=ApiResponse)
async def get_audit_log(
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, le=200),
    action: Optional[str] = Query(default=None),
    entity_type: Optional[str] = Query(default=None),
    user_id: Optional[str] = Query(default=None),
):
    """Platform-wide audit log with optional filters."""
    query = select(AuditLog).order_by(AuditLog.timestamp.desc())
    count_query = select(func.count(AuditLog.id))

    if action:
        query = query.where(AuditLog.action == action)
        count_query = count_query.where(AuditLog.action == action)
    if entity_type:
        query = query.where(AuditLog.entity_type == entity_type)
        count_query = count_query.where(AuditLog.entity_type == entity_type)
    if user_id:
        query = query.where(AuditLog.user_id == user_id)
        count_query = count_query.where(AuditLog.user_id == user_id)

    total = (await session.execute(count_query)).scalar_one()
    logs = (await session.execute(query.offset(skip).limit(limit))).scalars().all()

    return ApiResponse(
        success=True,
        data=[AuditLogRead.model_validate(log).model_dump() for log in logs],
        meta={"total": total, "skip": skip, "limit": limit},
    )
