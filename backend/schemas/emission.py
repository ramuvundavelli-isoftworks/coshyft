"""
Emission Schemas
"""

from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, Field


class EmissionFactorRead(BaseModel):
    id: str
    mode: str
    kg_co2_per_km: float
    source: str
    version: str
    region: str
    effective_date: date
    approval_status: str
    methodology: Optional[str] = None
    scope_category: Optional[str] = None
    grid_intensity: Optional[float] = None
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EmissionFactorCreate(BaseModel):
    id: str = Field(max_length=20)
    mode: str
    kg_co2_per_km: float = Field(ge=0)
    source: str
    version: str
    region: str = "IE"
    effective_date: date
    methodology: Optional[str] = None
    scope_category: str = "3.7"
    grid_intensity: Optional[float] = None


class EmissionFactorUpdate(BaseModel):
    mode: Optional[str] = None
    kg_co2_per_km: Optional[float] = Field(default=None, ge=0)
    source: Optional[str] = None
    version: Optional[str] = None
    methodology: Optional[str] = None
    grid_intensity: Optional[float] = None


class EmissionFactorApproval(BaseModel):
    approved: bool
    comments: Optional[str] = None


class EmissionSummary(BaseModel):
    total_emissions_kg: float
    total_emissions_previous_period: float
    yoy_change_percent: float
    emission_intensity: float
    total_commutes: int
    participation_rate: float
    data_quality_score: float
    target_emissions_kg: Optional[float] = None
    gap_to_target: Optional[float] = None


class EmissionTrend(BaseModel):
    period: str
    actual: float
    forecast: Optional[float] = None
    target: Optional[float] = None


class ModeDistribution(BaseModel):
    mode: str
    percentage: float
    emissions: float
    commute_count: int
    color: str


class LocationEmissionPerformance(BaseModel):
    office_id: str
    name: str
    city: str
    country: str
    region: str
    employee_count: int
    participation_rate: float
    total_emissions: float
    emission_intensity: float
    trend: List[float]
    public_transport_access: Optional[str] = None

    class Config:
        from_attributes = True
