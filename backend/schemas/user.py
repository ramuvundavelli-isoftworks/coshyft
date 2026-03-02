"""
User Schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr


class UserRead(BaseModel):
    id: str
    email: str
    name: str
    role: str
    department: Optional[str] = None
    avatar_url: Optional[str] = None
    locale: str
    region: str
    tenant_id: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: str = "employee"
    department: Optional[str] = None
    locale: str = "en-IE"
    region: str = "IE"
    tenant_id: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None
    locale: Optional[str] = None
    region: Optional[str] = None


class UserRoleUpdate(BaseModel):
    role: str


class UserListFilter(BaseModel):
    role: Optional[str] = None
    department: Optional[str] = None
    is_active: Optional[bool] = None
    search: Optional[str] = None


class GDPRConsentRead(BaseModel):
    user_id: str
    essential: bool
    analytics: bool
    marketing: bool
    data_sharing_carpooling: bool
    consent_date: datetime

    class Config:
        from_attributes = True
