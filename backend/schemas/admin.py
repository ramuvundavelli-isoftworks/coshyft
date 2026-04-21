"""
Admin Schemas
Request/response models for the Admin router.
"""

from typing import Optional
from pydantic import BaseModel


class AdminSettingsRead(BaseModel):
    company_name: str
    default_region: str
    emission_factor_source: str
    data_retention_days: int
    enable_carpooling: bool
    enable_gamification: bool
    oxypoints_multiplier: float


class AdminSettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    default_region: Optional[str] = None
    emission_factor_source: Optional[str] = None
    data_retention_days: Optional[int] = None
    enable_carpooling: Optional[bool] = None
    enable_gamification: Optional[bool] = None
    oxypoints_multiplier: Optional[float] = None


class ParticipationTargetCreate(BaseModel):
    department: str
    target_percent: float


class ParticipationReminderCreate(BaseModel):
    department: str
    message: Optional[str] = None


class BenefitEnableUpdate(BaseModel):
    enabled: bool = True
