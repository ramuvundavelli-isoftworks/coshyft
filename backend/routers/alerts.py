"""
Alerts Router
GET  /alerts, /alerts/stats
PUT  /alerts/{id}/resolve, /alerts/{id}/dismiss
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import get_current_user
from models.user import User
from models.alert import Alert
from schemas.alert import AlertRead, AlertResolve, AlertStats
from schemas.common import ApiResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/", response_model=ApiResponse)
async def get_alerts(
    severity: str = Query(None),
    resolved: bool = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get alerts for current user/role."""
    stmt = select(Alert).where(Alert.dismissed == False)

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
    """Alert summary counts."""
    total = (await session.execute(select(func.count(Alert.id)))).scalar_one()
    critical = (await session.execute(
        select(func.count(Alert.id)).where(Alert.severity == "critical", Alert.resolved == False)
    )).scalar_one()
    warning = (await session.execute(
        select(func.count(Alert.id)).where(Alert.severity == "warning", Alert.resolved == False)
    )).scalar_one()
    info = (await session.execute(
        select(func.count(Alert.id)).where(Alert.severity == "info", Alert.resolved == False)
    )).scalar_one()
    unresolved = (await session.execute(
        select(func.count(Alert.id)).where(Alert.resolved == False)
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
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Resolve an alert."""
    alert = (await session.execute(select(Alert).where(Alert.id == alert_id))).scalar_one_or_none()
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.resolved = True
    alert.resolved_by = user.id
    alert.resolved_at = datetime.utcnow()
    session.add(alert)

    return ApiResponse(success=True, meta={"message": "Alert resolved"})


@router.put("/{alert_id}/dismiss", response_model=ApiResponse)
async def dismiss_alert(
    alert_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Dismiss an alert."""
    alert = (await session.execute(select(Alert).where(Alert.id == alert_id))).scalar_one_or_none()
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.dismissed = True
    session.add(alert)

    return ApiResponse(success=True, meta={"message": "Alert dismissed"})
