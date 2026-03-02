"""
Organization Schemas
Office, Baseline, Initiative, Scenario, Risk, Policy
"""

from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, Field


# --- Office ---

class OfficeRead(BaseModel):
    id: str
    name: str
    city: str
    country: str
    region: str
    address: Optional[str] = None
    employee_count: int
    participation_rate: float
    total_emissions: float
    emission_intensity: float
    public_transport_access: Optional[str] = None
    parking_spaces: int
    bike_parking: int
    ev_chargers: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class OfficeUpdate(BaseModel):
    name: Optional[str] = None
    employee_count: Optional[int] = None
    parking_spaces: Optional[int] = None
    bike_parking: Optional[int] = None
    ev_chargers: Optional[int] = None
    public_transport_access: Optional[str] = None


# --- Baseline ---

class BaselineRead(BaseModel):
    id: str
    year: int
    emissions: float
    offices: Optional[List[str]] = None
    legal_entities: Optional[List[str]] = None
    data_source: str
    emission_factor_version: str
    locked: bool
    approved_by: Optional[str] = None
    approved_date: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BaselineCreate(BaseModel):
    year: int
    emissions: float
    offices: Optional[List[str]] = None
    legal_entities: Optional[List[str]] = None
    data_source: str
    emission_factor_version: str


class BaselineLock(BaseModel):
    approved_by: str
    comments: Optional[str] = None


# --- Initiative ---

class InitiativeRead(BaseModel):
    id: str
    name: str
    owner: str
    budget: float
    expected_reduction: float
    actual_reduction: float
    status: str
    start_date: date
    end_date: date
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class InitiativeCreate(BaseModel):
    name: str
    owner: str
    budget: float = Field(ge=0)
    expected_reduction: float = Field(ge=0)
    start_date: date
    end_date: date
    description: Optional[str] = None


class InitiativeUpdate(BaseModel):
    name: Optional[str] = None
    owner: Optional[str] = None
    budget: Optional[float] = Field(default=None, ge=0)
    expected_reduction: Optional[float] = None
    actual_reduction: Optional[float] = None
    status: Optional[str] = None
    description: Optional[str] = None


# --- Scenario ---

class ScenarioRead(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    carpool_increase: float
    remote_days: float
    ev_adoption: float
    public_transport_increase: float
    emissions_reduced: float
    roi: float
    payback: float
    parameters: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ScenarioCreate(BaseModel):
    name: str
    description: Optional[str] = None
    carpool_increase: float = Field(default=0, ge=0)
    remote_days: float = Field(default=0, ge=0)
    ev_adoption: float = Field(default=0, ge=0, le=100)
    public_transport_increase: float = Field(default=0, ge=0)


class ScenarioRunResult(BaseModel):
    scenario_id: str
    emissions_reduced: float
    roi: float
    payback: float
    breakdown: dict
    recommendations: List[str]


# --- Risk ---

class RiskRead(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    likelihood: str
    impact: str
    financial_exposure: float
    owner: str
    status: str
    linked_initiative_id: Optional[str] = None
    mitigation_plan: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RiskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    likelihood: str
    impact: str
    financial_exposure: float = Field(ge=0)
    owner: str
    linked_initiative_id: Optional[str] = None
    mitigation_plan: Optional[str] = None


class RiskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    likelihood: Optional[str] = None
    impact: Optional[str] = None
    financial_exposure: Optional[float] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    mitigation_plan: Optional[str] = None


# --- Policy ---

class PolicyRead(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    category: str
    status: str
    effective_date: Optional[date] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PolicyCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    effective_date: Optional[date] = None


class PolicyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    effective_date: Optional[date] = None
