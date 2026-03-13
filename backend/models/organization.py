"""
Organization Models
Office, Baseline, Initiative, Scenario, Risk, Policy
Maps to TypeScript: LocationPerformance, Baseline, Initiative, Scenario, Risk
"""

import uuid
from datetime import datetime, date
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum, JSON
import enum


class PublicTransportAccessEnum(str, enum.Enum):
    EXCELLENT = "Excellent"
    GOOD = "Good"
    MODERATE = "Moderate"
    LIMITED = "Limited"


class InitiativeStatusEnum(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    ACTIVE = "active"
    COMPLETED = "completed"


class RiskLikelihoodEnum(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RiskImpactEnum(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class RiskStatusEnum(str, enum.Enum):
    OPEN = "open"
    MITIGATING = "mitigating"
    CLOSED = "closed"


class PolicyStatusEnum(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"


class Office(SQLModel, table=True):
    __tablename__ = "offices"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    name: str = Field(max_length=200)
    city: str = Field(max_length=100)
    country: str = Field(max_length=100)
    region: str = Field(max_length=5)
    address: Optional[str] = Field(default=None, max_length=500)
    lat: Optional[float] = Field(default=None)
    lng: Optional[float] = Field(default=None)
    employee_count: int = Field(default=0)
    participation_rate: float = Field(default=0)
    total_emissions: float = Field(default=0)
    emission_intensity: float = Field(default=0)
    public_transport_access: Optional[PublicTransportAccessEnum] = Field(
        sa_column=Column(SAEnum(PublicTransportAccessEnum), nullable=True)
    )
    parking_spaces: int = Field(default=0)
    bike_parking: int = Field(default=0)
    ev_chargers: int = Field(default=0)
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class Baseline(SQLModel, table=True):
    __tablename__ = "baselines"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    year: int
    emissions: float
    offices: Optional[list] = Field(default=None, sa_column=Column(JSON))
    legal_entities: Optional[list] = Field(default=None, sa_column=Column(JSON))
    data_source: str = Field(max_length=200)
    emission_factor_version: str = Field(max_length=200)
    locked: bool = Field(default=False)
    approved_by: Optional[str] = Field(default=None, max_length=200)
    approved_date: Optional[date] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class Initiative(SQLModel, table=True):
    __tablename__ = "initiatives"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    name: str = Field(max_length=200)
    owner: str = Field(max_length=200)
    budget: float = Field(default=0)
    expected_reduction: float = Field(default=0)
    actual_reduction: float = Field(default=0)
    status: InitiativeStatusEnum = Field(
        sa_column=Column(SAEnum(InitiativeStatusEnum), nullable=False, default=InitiativeStatusEnum.DRAFT)
    )
    start_date: date
    end_date: date
    description: Optional[str] = Field(default=None, max_length=1000)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class Scenario(SQLModel, table=True):
    __tablename__ = "scenarios"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    name: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    carpool_increase: float = Field(default=0)
    remote_days: float = Field(default=0)
    ev_adoption: float = Field(default=0)
    public_transport_increase: float = Field(default=0)
    emissions_reduced: float = Field(default=0)
    roi: float = Field(default=0)
    payback: float = Field(default=0)
    parameters: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    created_by: Optional[str] = Field(default=None, foreign_key="users.id", max_length=36)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class Risk(SQLModel, table=True):
    __tablename__ = "risks"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    title: str = Field(max_length=300)
    description: Optional[str] = Field(default=None, max_length=1000)
    likelihood: RiskLikelihoodEnum = Field(
        sa_column=Column(SAEnum(RiskLikelihoodEnum), nullable=False)
    )
    impact: RiskImpactEnum = Field(
        sa_column=Column(SAEnum(RiskImpactEnum), nullable=False)
    )
    financial_exposure: float = Field(default=0)
    owner: str = Field(max_length=200)
    status: RiskStatusEnum = Field(
        sa_column=Column(SAEnum(RiskStatusEnum), nullable=False, default=RiskStatusEnum.OPEN)
    )
    linked_initiative_id: Optional[str] = Field(default=None, max_length=36)
    mitigation_plan: Optional[str] = Field(default=None, max_length=2000)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class Policy(SQLModel, table=True):
    __tablename__ = "policies"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    title: str = Field(max_length=300)
    description: Optional[str] = Field(default=None, max_length=2000)
    category: str = Field(max_length=50)
    status: PolicyStatusEnum = Field(
        sa_column=Column(SAEnum(PolicyStatusEnum), nullable=False, default=PolicyStatusEnum.DRAFT)
    )
    effective_date: Optional[date] = Field(default=None)
    created_by: Optional[str] = Field(default=None, foreign_key="users.id", max_length=36)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())
