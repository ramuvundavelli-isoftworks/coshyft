"""
Transport Models
IrishTransportMode, IrishWorkplaceBenefit
Maps to TypeScript: IrishTransportMode, IrishWorkplaceBenefit
"""

from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum, JSON
import enum


class TransportCategoryEnum(str, enum.Enum):
    PUBLIC_TRANSPORT = "public-transport"
    ACTIVE_TRANSPORT = "active-transport"
    CAR = "car"
    CARPOOL = "carpool"
    OTHER = "other"


class BenefitCategoryEnum(str, enum.Enum):
    BIKE_TO_WORK = "bike-to-work"
    TAXSAVER = "taxsaver"
    EV_INCENTIVE = "ev-incentive"
    REMOTE_WORK = "remote-work"


class BenefitStatusEnum(str, enum.Enum):
    ACTIVE = "active"
    PROPOSED = "proposed"
    EXPIRED = "expired"


class IrishTransportMode(SQLModel, table=True):
    __tablename__ = "irish_transport_modes"

    id: str = Field(primary_key=True, max_length=20)
    mode: str = Field(max_length=100)
    operator: Optional[str] = Field(default=None, max_length=200)
    regions: Optional[list] = Field(default=None, sa_column=Column(JSON))
    emission_factor: float = Field(ge=0)
    category: TransportCategoryEnum = Field(
        sa_column=Column(SAEnum(TransportCategoryEnum), nullable=False)
    )
    tax_relief: bool = Field(default=False)
    bike_to_work_scheme: bool = Field(default=False)
    is_active: bool = Field(default=True)


class IrishWorkplaceBenefit(SQLModel, table=True):
    __tablename__ = "irish_workplace_benefits"

    id: str = Field(primary_key=True, max_length=20)
    name: str = Field(max_length=200)
    description: str = Field(max_length=1000)
    category: BenefitCategoryEnum = Field(
        sa_column=Column(SAEnum(BenefitCategoryEnum), nullable=False)
    )
    region: str = Field(default="IE", max_length=5)
    tax_relief: Optional[float] = Field(default=None)
    max_amount: Optional[float] = Field(default=None)
    eligible_modes: Optional[list] = Field(default=None, sa_column=Column(JSON))
    status: BenefitStatusEnum = Field(
        sa_column=Column(SAEnum(BenefitStatusEnum), nullable=False, default=BenefitStatusEnum.ACTIVE)
    )
    compliance_required: bool = Field(default=False)
    documentation: Optional[str] = Field(default=None, max_length=1000)
