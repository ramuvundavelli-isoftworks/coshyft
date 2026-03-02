"""
FastAPI Auth Dependencies
Inject current user and enforce role-based access control.
"""

from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError

from database import get_session
from auth.jwt import verify_token
from auth.constants import TokenType, UserRole

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: AsyncSession = Depends(get_session),
):
    """
    Dependency: extract and validate user from JWT bearer token.
    Returns the User ORM object.
    """
    token = credentials.credentials
    try:
        payload = verify_token(token, TokenType.ACCESS)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")

    # Import here to avoid circular imports
    from models.user import User

    statement = select(User).where(User.id == user_id, User.is_active == True)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    return user


def require_role(*allowed_roles: str):
    """
    Dependency factory: restrict endpoint to specific roles.

    Usage:
        @router.get("/baseline")
        async def get_baseline(user = Depends(require_role("sustainability", "auditor"))):
    """

    async def role_checker(
        credentials: HTTPAuthorizationCredentials = Depends(security),
        session: AsyncSession = Depends(get_session),
    ):
        # Import here to avoid circular imports
        from models.user import User

        token = credentials.credentials
        try:
            payload = verify_token(token, TokenType.ACCESS)
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("sub")
        user_role = payload.get("role")

        # Super admin always has access
        if user_role == UserRole.SUPERADMIN:
            statement = select(User).where(User.id == user_id, User.is_active == True)
            result = await session.execute(statement)
            user = result.scalar_one_or_none()
            if user is None:
                raise HTTPException(status_code=401, detail="User not found")
            return user

        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user_role}' not authorized. Required: {', '.join(allowed_roles)}",
            )

        statement = select(User).where(User.id == user_id, User.is_active == True)
        result = await session.execute(statement)
        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        return user

    return role_checker
