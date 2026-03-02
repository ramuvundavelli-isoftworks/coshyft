"""
Auth Schemas
Login, Register, Token responses.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    password: str
    department: Optional[str] = None
    locale: str = "en-IE"
    region: str = "IE"


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class RefreshRequest(BaseModel):
    refresh_token: str


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


class GDPRConsentUpdate(BaseModel):
    essential: bool = True
    analytics: bool = False
    marketing: bool = False
    data_sharing_carpooling: bool = False
