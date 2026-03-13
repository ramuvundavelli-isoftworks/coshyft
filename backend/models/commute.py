"""
Commute Models
CommuteEntry: individual logged commutes
CommuteProfile: user commute preferences and defaults
"""

import uuid
from datetime import datetime, date
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum, JSON
import enum


class VerificationMethodEnum(str, enum.Enum):
    MANUAL = "manual"
    GPS = "gps"
    LEAP_CARD = "leap_card"
    SURVEY = "survey"


class CommuteEntry(SQLModel, table=True):
    __tablename__ = "commute_entries"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    # date: date = Field(index=True)
    commute_date: date = Field(index=True)
    transport_mode_id: str = Field(max_length=20)
    transport_mode_label: str = Field(max_length=100)
    distance_km: float = Field(ge=0)
    duration_minutes: Optional[int] = Field(default=None, ge=0)
    origin_address: Optional[str] = Field(default=None, max_length=500)
    destination_address: Optional[str] = Field(default=None, max_length=500)
    origin_lat: Optional[float] = Field(default=None)
    origin_lng: Optional[float] = Field(default=None)
    destination_lat: Optional[float] = Field(default=None)
    destination_lng: Optional[float] = Field(default=None)
    emissions_kg_co2: float = Field(ge=0)
    emission_factor_id: Optional[str] = Field(default=None, max_length=20)
    emission_factor_value: float = Field(ge=0)
    is_return_trip: bool = Field(default=False)
    carpool_passengers: Optional[int] = Field(default=None, ge=0)
    oxypoints_earned: int = Field(default=0, ge=0)
    verification_method: VerificationMethodEnum = Field(
        sa_column=Column(
            SAEnum(VerificationMethodEnum),
            nullable=False,
            default=VerificationMethodEnum.MANUAL,
        )
    )
    notes: Optional[str] = Field(default=None, max_length=500)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class CommuteProfile(SQLModel, table=True):
    __tablename__ = "commute_profiles"

    user_id: str = Field(primary_key=True, foreign_key="users.id", max_length=36)
    default_origin_address: Optional[str] = Field(default=None, max_length=500)
    default_origin_lat: Optional[float] = Field(default=None)
    default_origin_lng: Optional[float] = Field(default=None)
    default_destination_address: Optional[str] = Field(default=None, max_length=500)
    default_destination_lat: Optional[float] = Field(default=None)
    default_destination_lng: Optional[float] = Field(default=None)
    default_transport_mode_id: Optional[str] = Field(default=None, max_length=20)
    default_distance_km: Optional[float] = Field(default=None)
    work_days_per_week: int = Field(default=5)
    remote_days_per_week: int = Field(default=0)
    preferences: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())
