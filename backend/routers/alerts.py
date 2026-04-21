"""
Alerts Router
GET  /alerts, /alerts/stats
PUT  /alerts/{id}/resolve, /alerts/{id}/dismiss

Role-based scoping:
- superadmin: sees all alerts across all tenants.
- admin / sustainability / auditor: sees alerts for their own tenant only,
  AND only alerts whose target_roles includes their role (or target_roles is NULL/empty).
- employee: sees only alerts targeted to the 'employee' role for their tenant.

Resolve: requires admin, sustainability, or superadmin role.
Dismiss: any authenticated user (within scope).
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import get_current_user, require_role
from models.user import User
from models.alert import Alert
from schemas.alert import AlertRead, AlertResolve, AlertStats
from schemas.common import ApiResponse
from services.audit_logger import log_action

router = APIRouter(prefix="/alerts", tags=["Alerts"])


def _role(user) -> str:
    return user.role.value if hasattr(user.role, "value") else user.role


def _is_superadmin(user) -> bool:
    return _role(user) == "superadmin"


def _build_alert_stmt(user):
    """Build base SELECT for alerts applying tenant + role visibility rules."""
    stmt = select(Alert).where(Alert.dismissed == False)
    role = _role(user)

    # Tenant isolation
    if not _is_superadmin(user) and user.tenant_id:
        stmt = stmt.where(
            (Alert.tenant_id == user.tenant_id) | (Alert.tenant_id == None)
        )

    # Role visibility: show alerts targeted to this role OR with no targeting set
    if role != "superadmin":
        stmt = stmt.where(
            (Alert.target_roles == None) |
            (Alert.target_roles == "") |
            Alert.target_roles.contains(role)
        )

    return stmt


@router.get("/", response_model=ApiResponse)
async def get_alerts(
    severity: str = Query(None),
    resolved: bool = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get alerts visible to the current user's role and tenant."""
    stmt = _build_alert_stmt(user)

    if severity:
        stmt = stmt.where(Alert.severity == severity)
    if resolved is not None:
        stmt = stmt.where(Alert.resolved == resolved)

    total = (await session.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    stmt = stmt.order_by(Alert.timestamp.desc()).offset((page - 1) * page_size).limit(page_size)
    alerts = (await session.execute(stmt)).scalars().all()

    return ApiResponse(success=True, data={
        "items": [AlertRead.model_validate(a).model_dump() for a in alerts],
        "total": total,
        "page": page,
        "page_size": page_size,
    })


@router.get("/stats", response_model=ApiResponse[AlertStats])
async def get_alert_stats(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Alert summary counts — scoped to visible alerts for this user/role."""
    base = _build_alert_stmt(user)

    total = (await session.execute(
        select(func.count(Alert.id)).select_from(base.subquery())
    )).scalar_one()
    critical = (await session.execute(
        select(func.count(Alert.id)).select_from(
            base.where(Alert.severity == "critical", Alert.resolved == False).subquery()
        )
    )).scalar_one()
    warning = (await session.execute(
        select(func.count(Alert.id)).select_from(
            _build_alert_stmt(user).where(Alert.severity == "warning", Alert.resolved == False).subquery()
        )
    )).scalar_one()
    info = (await session.execute(
        select(func.count(Alert.id)).select_from(
            _build_alert_stmt(user).where(Alert.severity == "info", Alert.resolved == False).subquery()
        )
    )).scalar_one()
    unresolved = (await session.execute(
        select(func.count(Alert.id)).select_from(
            _build_alert_stmt(user).where(Alert.resolved == False).subquery()
        )
    )).scalar_one()

    return ApiResponse(success=True, data=AlertStats(
        total=total,
        critical=critical,
        warning=warning,
        info=info,
        unresolved=unresolved,
        resolved_today=0,
    ))


@router.put("/{alert_id}/resolve", response_model=ApiResponse)
async def resolve_alert(
    alert_id: str,
    data: AlertResolve,
    user=Depends(require_role("admin", "sustainability", "auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Resolve an alert. Requires admin, sustainability, or auditor role."""
    alert = (await session.execute(
        select(Alert).where(Alert.id == alert_id)
    )).scalar_one_or_none()
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    # Tenant check
    if not _is_superadmin(user) and user.tenant_id and alert.tenant_id and alert.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    alert.resolved = True
    alert.resolved_by = user.id
    alert.resolved_at = datetime.utcnow()
    session.add(alert)

    await log_action(
        session, user.id,
        _role(user),
        "update", "evidence", alert_id,
        description=f"Alert resolved: {data.resolution_notes or alert_id}",
    )
    return ApiResponse(success=True, meta={"message": "Alert resolved"})


@router.put("/{alert_id}/dismiss", response_model=ApiResponse)
async def dismiss_alert(
    alert_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Dismiss an alert (hide from current user's view)."""
    alert = (await session.execute(
        select(Alert).where(Alert.id == alert_id)
    )).scalar_one_or_none()
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    # Tenant check
    if not _is_superadmin(user) and user.tenant_id and alert.tenant_id and alert.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    alert.dismissed = True
    session.add(alert)

    await log_action(
        session, user.id,
        _role(user),
        "update", "evidence", alert_id,
        description=f"Alert dismissed by {_role(user)}",
    )
    return ApiResponse(success=True, meta={"message": "Alert dismissed"})
