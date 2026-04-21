"""
JWT Token Management
Create and verify access/refresh tokens.
"""

import uuid
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from config import settings
from auth.constants import TokenType


def create_access_token(
    user_id: str,
    role: str,
    tenant_id: Optional[str] = None,
    region: str = "IE",
) -> str:
    """Create a short-lived access token with a unique jti for future revocation."""
    now = datetime.utcnow()
    expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": user_id,
        "role": role,
        "tenant_id": tenant_id,
        "region": region,
        "jti": str(uuid.uuid4()),   # Unique token ID — enables server-side blacklisting
        "exp": expire,
        "iat": now,
        "type": TokenType.ACCESS,
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    """Create a long-lived refresh token with a unique jti."""
    now = datetime.utcnow()
    expire = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": user_id,
        "jti": str(uuid.uuid4()),   # Unique token ID — enables rotation/revocation
        "exp": expire,
        "iat": now,
        "type": TokenType.REFRESH,
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def verify_token(token: str, expected_type: TokenType = TokenType.ACCESS) -> Dict[str, Any]:
    """
    Verify and decode a JWT token.
    Raises JWTError if invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        token_type = payload.get("type")
        if token_type != expected_type:
            raise JWTError(f"Expected {expected_type} token, got {token_type}")

        user_id = payload.get("sub")
        if user_id is None:
            raise JWTError("Token missing subject claim")

        return payload
    except JWTError:
        raise
