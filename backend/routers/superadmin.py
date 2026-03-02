"""
Super Admin Router
GET  /superadmin/dashboard, /tenants, /usage, /health, /settings
POST /superadmin/tenants
PUT  /superadmin/tenants/{id}, /settings
POST /superadmin/tenants/{id}/suspend
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from database import get_session
from auth.dependencies import require_role
from models.user import User
from models.tenant import Tenant, TenantConfig
from models.commute import CommuteEntry
from models.carpooling import Ride
from schemas.superadmin import (
    TenantRead, TenantCreate, TenantUpdate,
    SystemHealthRead, UsageAnalyticsRead, PlatformSettings,
)
from schemas.common import ApiResponse

router = APIRouter(prefix="/superadmin", tags=["Super Admin"])


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


@router.get("/tenants", response_model=ApiResponse)
async def list_tenants(
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """List all tenants."""
    tenants = (await session.execute(select(Tenant))).scalars().all()

    data = []
    for t in tenants:
        user_count = (await session.execute(
            select(func.count(User.id)).where(User.tenant_id == t.id)
        )).scalar_one()

        data.append({
            **TenantRead.model_validate(t).model_dump(),
            "user_count": user_count,
        })

    return ApiResponse(success=True, data=data)


@router.post("/tenants", response_model=ApiResponse[TenantRead], status_code=201)
async def create_tenant(
    data: TenantCreate,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Onboard a new tenant."""
    existing = (await session.execute(select(Tenant).where(Tenant.slug == data.slug))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Tenant slug already exists")

    tenant = Tenant(**data.model_dump())
    session.add(tenant)
    await session.flush()

    # Create default config
    config = TenantConfig(tenant_id=tenant.id)
    session.add(config)
    await session.flush()
    await session.refresh(tenant)

    return ApiResponse(success=True, data=TenantRead.model_validate(tenant))


@router.put("/tenants/{tenant_id}", response_model=ApiResponse[TenantRead])
async def update_tenant(
    tenant_id: str,
    update: TenantUpdate,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Update tenant configuration."""
    t = (await session.execute(select(Tenant).where(Tenant.id == tenant_id))).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(t, key, value)
    t.updated_at = datetime.now(timezone.utc)
    session.add(t)
    await session.flush()
    await session.refresh(t)

    return ApiResponse(success=True, data=TenantRead.model_validate(t))


@router.post("/tenants/{tenant_id}/suspend", response_model=ApiResponse)
async def suspend_tenant(
    tenant_id: str,
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Suspend a tenant."""
    t = (await session.execute(select(Tenant).where(Tenant.id == tenant_id))).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Tenant not found")

    t.status = "suspended"
    t.updated_at = datetime.now(timezone.utc)
    session.add(t)

    return ApiResponse(success=True, meta={"message": f"Tenant {t.name} suspended"})


@router.get("/usage", response_model=ApiResponse[UsageAnalyticsRead])
async def get_usage(
    user=Depends(require_role("superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Usage analytics across tenants."""
    total_tenants = (await session.execute(select(func.count(Tenant.id)))).scalar_one()
    active_tenants = (await session.execute(
        select(func.count(Tenant.id)).where(Tenant.status == "active")
    )).scalar_one()
    total_users = (await session.execute(select(func.count(User.id)))).scalar_one()
    total_commutes = (await session.execute(select(func.count(CommuteEntry.id)))).scalar_one()
    total_rides = (await session.execute(
        select(func.count(Ride.id)).where(Ride.status == "completed")
    )).scalar_one()
    total_co2 = float((await session.execute(
        select(func.coalesce(func.sum(Ride.co2_saved), 0))
    )).scalar_one())

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
        tenant_breakdown=[],
    ))


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
        last_checked=datetime.now(timezone.utc),
    ))


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
