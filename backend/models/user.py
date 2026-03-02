"""
User Models
Maps to TypeScript: User, GDPRConsent, DataRetentionPolicy
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, String, Enum as SAEnum
import enum


class UserRoleEnum(str, enum.Enum):
    EMPLOYEE = "employee"
    ADMIN = "admin"
    SUSTAINABILITY = "sustainability"
    AUDITOR = "auditor"
    SUPERADMIN = "superadmin"


class LocaleEnum(str, enum.Enum):
    EN_IE = "en-IE"
    EN_GB = "en-GB"
    EN_US = "en-US"
    GA_IE = "ga-IE"


class RegionEnum(str, enum.Enum):
    IE = "IE"
    GB = "GB"
    US = "US"
    NL = "NL"
    DE = "DE"
    FR = "FR"
    EU = "EU"


class LegalBasisEnum(str, enum.Enum):
    CONSENT = "consent"
    CONTRACT = "contract"
    LEGAL_OBLIGATION = "legal_obligation"
    LEGITIMATE_INTEREST = "legitimate_interest"


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=255)
    hashed_password: str = Field(max_length=255)
    role: UserRoleEnum = Field(
        sa_column=Column(SAEnum(UserRoleEnum), nullable=False, default=UserRoleEnum.EMPLOYEE)
    )
    department: Optional[str] = Field(default=None, max_length=100)
    avatar_url: Optional[str] = Field(default=None, max_length=500)
    locale: LocaleEnum = Field(
        sa_column=Column(SAEnum(LocaleEnum), nullable=False, default=LocaleEnum.EN_IE)
    )
    region: RegionEnum = Field(
        sa_column=Column(SAEnum(RegionEnum), nullable=False, default=RegionEnum.IE)
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    gdpr_consent: Optional["GDPRConsent"] = Relationship(back_populates="user")
    data_retention: Optional["DataRetentionPolicy"] = Relationship(back_populates="user")


class GDPRConsent(SQLModel, table=True):
    __tablename__ = "gdpr_consents"

    user_id: str = Field(primary_key=True, foreign_key="users.id", max_length=36)
    essential: bool = Field(default=True)
    analytics: bool = Field(default=False)
    marketing: bool = Field(default=False)
    data_sharing_carpooling: bool = Field(default=False)
    consent_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None, max_length=500)

    # Relationship
    user: Optional[User] = Relationship(back_populates="gdpr_consent")


class DataRetentionPolicy(SQLModel, table=True):
    __tablename__ = "data_retention_policies"

    user_id: str = Field(primary_key=True, foreign_key="users.id", max_length=36)
    retention_years: int = Field(default=7)
    auto_delete_enabled: bool = Field(default=False)
    deletion_date: Optional[datetime] = Field(default=None)
    legal_basis: LegalBasisEnum = Field(
        sa_column=Column(SAEnum(LegalBasisEnum), nullable=False, default=LegalBasisEnum.CONTRACT)
    )

    # Relationship
    user: Optional[User] = Relationship(back_populates="data_retention")
