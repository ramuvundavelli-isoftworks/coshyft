"""
Tenant Models (Super Admin multi-tenancy)
Tenant, TenantConfig
"""

import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum, JSON
import enum


class TenantStatusEnum(str, enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    TRIAL = "trial"
    DEACTIVATED = "deactivated"


class TenantPlanEnum(str, enum.Enum):
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class Tenant(SQLModel, table=True):
    __tablename__ = "tenants"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    name: str = Field(max_length=200, unique=True)
    slug: str = Field(max_length=50, unique=True)
    logo_url: Optional[str] = Field(default=None, max_length=500)
    primary_region: str = Field(default="IE", max_length=5)
    status: TenantStatusEnum = Field(
        sa_column=Column(SAEnum(TenantStatusEnum), nullable=False, default=TenantStatusEnum.TRIAL)
    )
    plan: TenantPlanEnum = Field(
        sa_column=Column(SAEnum(TenantPlanEnum), nullable=False, default=TenantPlanEnum.STARTER)
    )
    max_users: int = Field(default=50)
    max_offices: int = Field(default=5)
    contact_email: str = Field(max_length=255)
    contact_name: str = Field(max_length=200)
    billing_email: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class TenantConfig(SQLModel, table=True):
    __tablename__ = "tenant_configs"

    tenant_id: str = Field(primary_key=True, foreign_key="tenants.id", max_length=36)
    default_locale: str = Field(default="en-IE", max_length=10)
    default_currency: str = Field(default="EUR", max_length=5)
    emission_factor_region: str = Field(default="IE", max_length=5)
    oxypoints_enabled: bool = Field(default=True)
    carpooling_enabled: bool = Field(default=True)
    csrd_reporting_enabled: bool = Field(default=True)
    gdpr_strict_mode: bool = Field(default=True)
    data_retention_years: int = Field(default=7)
    custom_branding: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    features: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())
