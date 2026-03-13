"""
Emission Factors Router
CRUD /emission-factors
GET  /emission-factors/region/{region}
POST /emission-factors/{id}/submit, approve, reject
GET  /emission-factors/{id}/history
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import require_role, get_current_user
from models.user import User
from models.emission import EmissionFactor
from schemas.emission import EmissionFactorRead, EmissionFactorCreate, EmissionFactorUpdate, EmissionFactorApproval
from schemas.common import ApiResponse, PaginatedResponse
from services.audit_logger import log_action

router = APIRouter(prefix="/emission-factors", tags=["Emission Factors"])


@router.get("/", response_model=ApiResponse[PaginatedResponse[EmissionFactorRead]])
async def list_factors(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    region: str = Query(None),
    status: str = Query(None),
    user=Depends(require_role("sustainability", "auditor")),
    session: AsyncSession = Depends(get_session),
):
    """List all emission factors."""
    stmt = select(EmissionFactor)
    if region:
        stmt = stmt.where(EmissionFactor.region == region)
    if status:
        stmt = stmt.where(EmissionFactor.approval_status == status)

    total = (await session.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)
    factors = (await session.execute(stmt)).scalars().all()

    return ApiResponse(success=True, data=PaginatedResponse(
        items=[EmissionFactorRead.model_validate(f) for f in factors],
        total=total, page=page, page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    ))


@router.get("/region/{region}", response_model=ApiResponse)
async def get_factors_by_region(
    region: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get emission factors for a specific region."""
    factors = (await session.execute(
        select(EmissionFactor).where(
            EmissionFactor.region == region,
            EmissionFactor.approval_status == "approved",
        )
    )).scalars().all()

    return ApiResponse(
        success=True,
        data=[EmissionFactorRead.model_validate(f).model_dump() for f in factors],
    )


@router.post("/", response_model=ApiResponse[EmissionFactorRead], status_code=201)
async def create_factor(
    data: EmissionFactorCreate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Create a new emission factor (status: draft)."""
    existing = (await session.execute(
        select(EmissionFactor).where(EmissionFactor.id == data.id)
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Factor ID already exists")

    factor = EmissionFactor(**data.model_dump(), approval_status="draft")
    session.add(factor)
    await session.flush()
    await session.refresh(factor)

    await log_action(session, user.id, "sustainability", "create", "emission_factor", factor.id)
    return ApiResponse(success=True, data=EmissionFactorRead.model_validate(factor))


@router.put("/{factor_id}", response_model=ApiResponse[EmissionFactorRead])
async def update_factor(
    factor_id: str,
    update: EmissionFactorUpdate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Update an emission factor."""
    f = (await session.execute(
        select(EmissionFactor).where(EmissionFactor.id == factor_id)
    )).scalar_one_or_none()
    if f is None:
        raise HTTPException(status_code=404, detail="Factor not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(f, key, value)
    f.updated_at = datetime.utcnow()
    session.add(f)
    await session.flush()
    await session.refresh(f)

    await log_action(session, user.id, "sustainability", "update", "emission_factor", f.id)
    return ApiResponse(success=True, data=EmissionFactorRead.model_validate(f))


@router.post("/{factor_id}/submit", response_model=ApiResponse)
async def submit_factor(
    factor_id: str,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Submit factor for approval (draft -> pending)."""
    f = (await session.execute(
        select(EmissionFactor).where(EmissionFactor.id == factor_id)
    )).scalar_one_or_none()
    if f is None:
        raise HTTPException(status_code=404, detail="Factor not found")
    if f.approval_status != "draft":
        raise HTTPException(status_code=400, detail="Only draft factors can be submitted")

    f.approval_status = "pending"
    f.updated_at = datetime.utcnow()
    session.add(f)

    return ApiResponse(success=True, meta={"message": "Factor submitted for approval"})


@router.put("/{factor_id}/approve", response_model=ApiResponse)
async def approve_factor(
    factor_id: str,
    data: EmissionFactorApproval,
    user=Depends(require_role("sustainability", "auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Approve or reject an emission factor."""
    f = (await session.execute(
        select(EmissionFactor).where(EmissionFactor.id == factor_id)
    )).scalar_one_or_none()
    if f is None:
        raise HTTPException(status_code=404, detail="Factor not found")

    if data.approved:
        f.approval_status = "approved"
        f.approved_by = user.id
        f.approved_at = datetime.utcnow()
    else:
        f.approval_status = "rejected"

    f.updated_at = datetime.utcnow()
    session.add(f)

    action = "approve" if data.approved else "reject"
    await log_action(session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
                     action, "emission_factor", f.id)

    return ApiResponse(success=True, meta={"message": f"Factor {'approved' if data.approved else 'rejected'}"})
