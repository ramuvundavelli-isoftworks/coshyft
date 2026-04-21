"""
Super Admin Schemas
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr


class TenantRead(BaseModel):
    id: str
    name: str
    slug: str
    logo_url: Optional[str] = None
    primary_region: str
    status: str
    plan: str
    max_users: int
    max_offices: int
    contact_email: str
    contact_name: str
    billing_email: Optional[str] = None
    user_count: Optional[int] = None
    office_count: Optional[int] = None
    total_emissions: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TenantCreate(BaseModel):
    name: str
    slug: str
    primary_region: str = "IE"
    plan: str = "starter"
    max_users: int = 50
    max_offices: int = 5
    contact_email: EmailStr
    contact_name: str
    billing_email: Optional[str] = None


class TenantUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    plan: Optional[str] = None
    max_users: Optional[int] = None
    max_offices: Optional[int] = None
    contact_email: Optional[str] = None
    contact_name: Optional[str] = None
    billing_email: Optional[str] = None


class TenantConfigRead(BaseModel):
    tenant_id: str
    default_locale: str
    default_currency: str
    emission_factor_region: str
    oxypoints_enabled: bool
    carpooling_enabled: bool
    csrd_reporting_enabled: bool
    gdpr_strict_mode: bool
    data_retention_years: int
    custom_branding: Optional[dict] = None
    features: Optional[dict] = None
    updated_at: datetime

    class Config:
        from_attributes = True


class TenantConfigUpdate(BaseModel):
    default_locale: Optional[str] = None
    default_currency: Optional[str] = None
    emission_factor_region: Optional[str] = None
    oxypoints_enabled: Optional[bool] = None
    carpooling_enabled: Optional[bool] = None
    csrd_reporting_enabled: Optional[bool] = None
    gdpr_strict_mode: Optional[bool] = None
    data_retention_years: Optional[int] = None
    custom_branding: Optional[dict] = None
    features: Optional[dict] = None


class UserSummaryRead(BaseModel):
    id: str
    email: str
    name: str
    role: str
    department: Optional[str] = None
    tenant_id: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TenantUserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str
    role: str = "admin"
    department: Optional[str] = None


class UserRoleUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None


class AuditLogRead(BaseModel):
    id: str
    timestamp: datetime
    user_id: str
    user_role: str
    action: str
    entity_type: str
    entity_id: str
    description: Optional[str] = None
    ip_address: Optional[str] = None

    class Config:
        from_attributes = True


class SystemHealthRead(BaseModel):
    status: str  # "healthy", "degraded", "down"
    uptime_hours: float
    api_latency_ms: float
    db_latency_ms: float
    active_connections: int
    memory_usage_percent: float
    cpu_usage_percent: float
    disk_usage_percent: float
    error_rate_percent: float
    services: List[dict]
    last_checked: datetime


class UsageAnalyticsRead(BaseModel):
    total_tenants: int
    active_tenants: int
    total_users: int
    active_users_today: int
    active_users_week: int
    total_commutes_logged: int
    total_rides_completed: int
    total_co2_saved_kg: float
    total_oxypoints_awarded: int
    api_calls_today: int
    storage_used_gb: float
    revenue_monthly: float
    tenant_breakdown: List[dict]


class PlatformSettings(BaseModel):
    maintenance_mode: bool = False
    registration_enabled: bool = True
    default_plan: str = "starter"
    max_trial_days: int = 30
    global_rate_limit: int = 60
    feature_flags: Optional[dict] = None
