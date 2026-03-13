"""
Emission Models
EmissionFactor: SEAI/EPA/DEFRA emission factors per transport mode
EmissionRecord: aggregated emission records for reporting
"""

import uuid
from datetime import datetime, date
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum
import enum


class ApprovalStatusEnum(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class RegionEnum(str, enum.Enum):
    IE = "IE"
    GB = "GB"
    US = "US"
    NL = "NL"
    DE = "DE"
    FR = "FR"
    EU = "EU"


class EmissionFactor(SQLModel, table=True):
    __tablename__ = "emission_factors"

    id: str = Field(primary_key=True, max_length=20)
    mode: str = Field(max_length=100)
    kg_co2_per_km: float = Field(ge=0)
    source: str = Field(max_length=200)
    version: str = Field(max_length=20)
    region: RegionEnum = Field(
        sa_column=Column(SAEnum(RegionEnum), nullable=False, default=RegionEnum.IE)
    )
    effective_date: date
    approval_status: ApprovalStatusEnum = Field(
        sa_column=Column(
            SAEnum(ApprovalStatusEnum),
            nullable=False,
            default=ApprovalStatusEnum.DRAFT,
        )
    )
    methodology: Optional[str] = Field(default=None, max_length=500)
    scope_category: Optional[str] = Field(default="3.7", max_length=10)
    grid_intensity: Optional[float] = Field(default=None)
    approved_by: Optional[str] = Field(default=None, foreign_key="users.id", max_length=36)
    approved_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class EmissionRecord(SQLModel, table=True):
    """Aggregated emission records for reporting periods."""

    __tablename__ = "emission_records"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    office_id: Optional[str] = Field(default=None, foreign_key="offices.id", max_length=36)
    period: str = Field(max_length=20)  # e.g., "2026-01", "2026-Q1"
    period_type: str = Field(max_length=10)  # "monthly", "quarterly", "annual"
    total_emissions_kg: float = Field(default=0)
    total_distance_km: float = Field(default=0)
    total_commutes: int = Field(default=0)
    employee_count: int = Field(default=0)
    intensity_per_employee: float = Field(default=0)
    forecast_emissions_kg: Optional[float] = Field(default=None)
    target_emissions_kg: Optional[float] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
