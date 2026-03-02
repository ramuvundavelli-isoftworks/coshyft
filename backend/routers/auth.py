"""
Auth Router
POST /auth/login, /auth/register, /auth/refresh, /auth/logout
GET  /auth/me
PUT  /auth/me, /auth/me/gdpr-consent, /auth/me/password
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from database import get_session
from auth.jwt import create_access_token, create_refresh_token, verify_token
from auth.passwords import hash_password, verify_password
from auth.dependencies import get_current_user
from auth.constants import TokenType
from models.user import User, GDPRConsent
from schemas.auth import LoginRequest, RegisterRequest, TokenResponse, RefreshRequest, GDPRConsentUpdate, PasswordChangeRequest
from schemas.user import UserRead, UserUpdate
from schemas.common import ApiResponse
from services.audit_logger import log_action, log_gdpr_action
from config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=ApiResponse[TokenResponse])
async def login(
    request: LoginRequest,
    req: Request,
    session: AsyncSession = Depends(get_session),
):
    """Authenticate user and return JWT tokens."""
    statement = select(User).where(User.email == request.email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if user is None or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    access_token = create_access_token(
        user_id=user.id,
        role=user.role.value if hasattr(user.role, 'value') else user.role,
        tenant_id=user.tenant_id,
        region=user.region.value if hasattr(user.region, 'value') else user.region,
    )
    refresh_token = create_refresh_token(user_id=user.id)

    # Audit log
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "login", "user_profile", user.id,
        ip_address=req.client.host if req.client else None,
    )

    return ApiResponse(
        success=True,
        data=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        ),
    )


@router.post("/register", response_model=ApiResponse[UserRead], status_code=201)
async def register(
    request: RegisterRequest,
    session: AsyncSession = Depends(get_session),
):
    """Register a new user (default role: employee)."""
    # Check existing
    statement = select(User).where(User.email == request.email)
    result = await session.execute(statement)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=request.email,
        name=request.name,
        hashed_password=hash_password(request.password),
        role="employee",
        department=request.department,
        locale=request.locale,
        region=request.region,
    )
    session.add(user)
    await session.flush()
    await session.refresh(user)

    return ApiResponse(success=True, data=UserRead.model_validate(user))


@router.post("/refresh", response_model=ApiResponse[TokenResponse])
async def refresh_token(
    request: RefreshRequest,
    session: AsyncSession = Depends(get_session),
):
    """Refresh an access token using a refresh token."""
    try:
        payload = verify_token(request.refresh_token, TokenType.REFRESH)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    user_id = payload.get("sub")
    statement = select(User).where(User.id == user_id, User.is_active == True)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    access_token = create_access_token(
        user_id=user.id,
        role=user.role.value if hasattr(user.role, 'value') else user.role,
        tenant_id=user.tenant_id,
        region=user.region.value if hasattr(user.region, 'value') else user.region,
    )
    new_refresh = create_refresh_token(user_id=user.id)

    return ApiResponse(
        success=True,
        data=TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        ),
    )


@router.post("/logout", response_model=ApiResponse)
async def logout(
    req: Request,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Logout (invalidate refresh token server-side in production)."""
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "logout", "user_profile", user.id,
        ip_address=req.client.host if req.client else None,
    )
    return ApiResponse(success=True, data=None, meta={"message": "Logged out successfully"})


@router.get("/me", response_model=ApiResponse[UserRead])
async def get_me(user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return ApiResponse(success=True, data=UserRead.model_validate(user))


@router.put("/me", response_model=ApiResponse[UserRead])
async def update_me(
    update: UserUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update current user's profile."""
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    user.updated_at = datetime.now(timezone.utc)

    session.add(user)
    await session.flush()
    await session.refresh(user)

    return ApiResponse(success=True, data=UserRead.model_validate(user))


@router.put("/me/password", response_model=ApiResponse)
async def change_password(
    request: PasswordChangeRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Change current user's password."""
    if not verify_password(request.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if len(request.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters",
        )

    user.hashed_password = hash_password(request.new_password)
    user.updated_at = datetime.now(timezone.utc)
    session.add(user)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "update", "user_profile", user.id,
    )

    return ApiResponse(success=True, meta={"message": "Password changed successfully"})


@router.put("/me/gdpr-consent", response_model=ApiResponse)
async def update_gdpr_consent(
    consent: GDPRConsentUpdate,
    req: Request,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update GDPR consent preferences."""
    statement = select(GDPRConsent).where(GDPRConsent.user_id == user.id)
    result = await session.execute(statement)
    existing = result.scalar_one_or_none()

    if existing:
        existing.essential = consent.essential
        existing.analytics = consent.analytics
        existing.marketing = consent.marketing
        existing.data_sharing_carpooling = consent.data_sharing_carpooling
        existing.consent_date = datetime.now(timezone.utc)
        existing.ip_address = req.client.host if req.client else None
        session.add(existing)
    else:
        new_consent = GDPRConsent(
            user_id=user.id,
            essential=consent.essential,
            analytics=consent.analytics,
            marketing=consent.marketing,
            data_sharing_carpooling=consent.data_sharing_carpooling,
            ip_address=req.client.host if req.client else None,
        )
        session.add(new_consent)

    # GDPR audit log
    await log_gdpr_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "consent_given", "personal_data", user.id,
        gdpr_basis="consent",
        region=user.region.value if hasattr(user.region, 'value') else user.region,
    )

    return ApiResponse(success=True, meta={"message": "GDPR consent updated"})


@router.post("/me/data-export", response_model=ApiResponse)
async def request_data_export(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """GDPR right of access - request personal data export."""
    await log_gdpr_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "export", "personal_data", user.id,
        gdpr_basis="consent",
    )
    return ApiResponse(
        success=True,
        meta={"message": "Data export request received. You will be notified when ready."},
    )


@router.delete("/me/data", response_model=ApiResponse)
async def request_data_deletion(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """GDPR right to erasure - request data deletion."""
    await log_gdpr_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "delete", "personal_data", user.id,
        gdpr_basis="consent",
    )
    return ApiResponse(
        success=True,
        meta={"message": "Data deletion request received. Will be processed within 30 days per GDPR."},
    )