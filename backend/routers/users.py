"""
Users Router
GET  /users         (admin)
GET  /users/{id}    (admin)
PUT  /users/{id}    (admin)
PUT  /users/{id}/role (admin)
POST /users/{id}/deactivate (admin)

Tenant isolation: admins only see users within their own tenant.
SuperAdmins see all users across tenants.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import require_role
from auth.passwords import hash_password
from models.user import User
from schemas.user import UserRead, UserUpdate, UserRoleUpdate, UserCreate
from schemas.common import ApiResponse, PaginatedResponse
from services.audit_logger import log_action

router = APIRouter(prefix="/users", tags=["Users"])


def _is_superadmin(user) -> bool:
    role = user.role.value if hasattr(user.role, "value") else user.role
    return role == "superadmin"


@router.get("/", response_model=ApiResponse[PaginatedResponse[UserRead]])
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: str = Query(None),
    department: str = Query(None),
    is_active: bool = Query(None),
    search: str = Query(None),
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """List users. Admins see their tenant only; SuperAdmins see all."""
    statement = select(User)

    # Tenant isolation — admins scoped to their own tenant
    if not _is_superadmin(user) and user.tenant_id:
        statement = statement.where(User.tenant_id == user.tenant_id)

    if role:
        statement = statement.where(User.role == role)
    if department:
        statement = statement.where(User.department == department)
    if is_active is not None:
        statement = statement.where(User.is_active == is_active)
    if search:
        statement = statement.where(
            (User.name.ilike(f"%{search}%")) | (User.email.ilike(f"%{search}%"))
        )

    count_stmt = select(func.count()).select_from(statement.subquery())
    total = (await session.execute(count_stmt)).scalar_one()

    statement = statement.offset((page - 1) * page_size).limit(page_size)
    users = (await session.execute(statement)).scalars().all()

    return ApiResponse(
        success=True,
        data=PaginatedResponse(
            items=[UserRead.model_validate(u) for u in users],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(total + page_size - 1) // page_size,
        ),
    )


@router.get("/{user_id}", response_model=ApiResponse[UserRead])
async def get_user(
    user_id: str,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Get user by ID."""
    target = (await session.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not _is_superadmin(user) and target.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return ApiResponse(success=True, data=UserRead.model_validate(target))


@router.put("/{user_id}", response_model=ApiResponse[UserRead])
async def update_user(
    user_id: str,
    update: UserUpdate,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Update user details."""
    target = (await session.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not _is_superadmin(user) and target.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(target, key, value)
    target.updated_at = datetime.utcnow()
    session.add(target)
    await session.flush()
    await session.refresh(target)

    await log_action(
        session, user.id,
        user.role.value if hasattr(user.role, "value") else user.role,
        "update", "user_profile", user_id,
        description=f"User profile updated by {user.email}",
    )
    return ApiResponse(success=True, data=UserRead.model_validate(target))


@router.put("/{user_id}/role", response_model=ApiResponse[UserRead])
async def update_user_role(
    user_id: str,
    role_update: UserRoleUpdate,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Change a user's role."""
    target = (await session.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not _is_superadmin(user) and target.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    old_role = target.role.value if hasattr(target.role, "value") else target.role
    target.role = role_update.role
    target.updated_at = datetime.utcnow()
    session.add(target)
    await session.flush()
    await session.refresh(target)

    await log_action(
        session, user.id,
        user.role.value if hasattr(user.role, "value") else user.role,
        "update", "user_profile", user_id,
        description=f"Role changed: {old_role} → {role_update.role}",
    )
    return ApiResponse(success=True, data=UserRead.model_validate(target))


@router.post("/", response_model=ApiResponse[UserRead], status_code=201)
async def create_user(
    data: UserCreate,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """
    Admin creates a new user in their tenant.
    SuperAdmin can create users in any tenant (pass tenant_id in body).
    """
    from sqlmodel import select as _select
    existing = (await session.execute(
        _select(User).where(User.email == data.email)
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    # Admins can only create users in their own tenant
    tenant_id = data.tenant_id if _is_superadmin(user) else user.tenant_id

    # Admins cannot create superadmins
    role = data.role
    if not _is_superadmin(user) and role == "superadmin":
        raise HTTPException(status_code=403, detail="Admins cannot create superadmin accounts")

    new_user = User(
        email=data.email,
        name=data.name,
        hashed_password=hash_password(data.password),
        role=role,
        department=data.department,
        locale=data.locale,
        region=data.region,
        tenant_id=tenant_id,
        is_active=True,
    )
    session.add(new_user)
    await session.flush()
    await session.refresh(new_user)

    await log_action(
        session, user.id,
        user.role.value if hasattr(user.role, "value") else user.role,
        "create", "user_profile", new_user.id,
        description=f"Admin created user {new_user.email} with role {role}",
    )
    return ApiResponse(success=True, data=UserRead.model_validate(new_user))


@router.post("/{user_id}/deactivate", response_model=ApiResponse)
async def deactivate_user(
    user_id: str,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Deactivate a user account."""
    target = (await session.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not _is_superadmin(user) and target.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    target.is_active = False
    target.updated_at = datetime.utcnow()
    session.add(target)

    await log_action(
        session, user.id,
        user.role.value if hasattr(user.role, "value") else user.role,
        "update", "user_profile", user_id,
        description=f"User {target.email} deactivated",
    )
    return ApiResponse(success=True, meta={"message": f"User {user_id} deactivated"})


@router.post("/{user_id}/activate", response_model=ApiResponse)
async def activate_user(
    user_id: str,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Reactivate a deactivated user account."""
    target = (await session.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
    if target is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not _is_superadmin(user) and target.tenant_id != user.tenant_id:
        raise HTTPException(status_code=403, detail="Access denied")

    target.is_active = True
    target.updated_at = datetime.utcnow()
    session.add(target)

    await log_action(
        session, user.id,
        user.role.value if hasattr(user.role, "value") else user.role,
        "update", "user_profile", user_id,
        description=f"User {target.email} reactivated",
    )
    return ApiResponse(success=True, meta={"message": f"User {user_id} activated"})
