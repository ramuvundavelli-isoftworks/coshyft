"""
Users Router
GET  /users         (admin)
GET  /users/{id}    (admin)
PUT  /users/{id}    (admin)
PUT  /users/{id}/role (admin)
POST /users/{id}/deactivate (admin)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime

from database import get_session
from auth.dependencies import require_role
from models.user import User
from schemas.user import UserRead, UserUpdate, UserRoleUpdate
from schemas.common import ApiResponse, PaginatedResponse

router = APIRouter(prefix="/users", tags=["Users"])


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
    """List all users with pagination and filters (Admin/SuperAdmin only)."""
    statement = select(User)

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

    # Count total
    count_stmt = select(func.count()).select_from(statement.subquery())
    total_result = await session.execute(count_stmt)
    total = total_result.scalar_one()

    # Paginate
    statement = statement.offset((page - 1) * page_size).limit(page_size)
    result = await session.execute(statement)
    users = result.scalars().all()

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
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    target = result.scalar_one_or_none()

    if target is None:
        raise HTTPException(status_code=404, detail="User not found")

    return ApiResponse(success=True, data=UserRead.model_validate(target))


@router.put("/{user_id}", response_model=ApiResponse[UserRead])
async def update_user(
    user_id: str,
    update: UserUpdate,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Update user details (Admin only)."""
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    target = result.scalar_one_or_none()

    if target is None:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(target, key, value)
    target.updated_at = datetime.utcnow()

    session.add(target)
    await session.flush()
    await session.refresh(target)

    return ApiResponse(success=True, data=UserRead.model_validate(target))


@router.put("/{user_id}/role", response_model=ApiResponse[UserRead])
async def update_user_role(
    user_id: str,
    role_update: UserRoleUpdate,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Change a user's role."""
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    target = result.scalar_one_or_none()

    if target is None:
        raise HTTPException(status_code=404, detail="User not found")

    target.role = role_update.role
    target.updated_at = datetime.utcnow()
    session.add(target)
    await session.flush()
    await session.refresh(target)

    return ApiResponse(success=True, data=UserRead.model_validate(target))


@router.post("/{user_id}/deactivate", response_model=ApiResponse)
async def deactivate_user(
    user_id: str,
    user=Depends(require_role("admin", "superadmin")),
    session: AsyncSession = Depends(get_session),
):
    """Deactivate a user account."""
    statement = select(User).where(User.id == user_id)
    result = await session.execute(statement)
    target = result.scalar_one_or_none()

    if target is None:
        raise HTTPException(status_code=404, detail="User not found")

    target.is_active = False
    target.updated_at = datetime.utcnow()
    session.add(target)

    return ApiResponse(success=True, meta={"message": f"User {user_id} deactivated"})
