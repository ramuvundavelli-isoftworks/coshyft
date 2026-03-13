"""
Carpooling Models
Ride, RideRequest, RecurringRideTemplate, RideException
Maps to TypeScript: Ride, ExtendedRide, RecurringRideTemplate
"""

import uuid
from datetime import datetime, date, time
from typing import Optional, List
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum, JSON
import enum


class RideStatusEnum(str, enum.Enum):
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class RideRequestStatusEnum(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class VehicleTypeEnum(str, enum.Enum):
    SEDAN = "sedan"
    SUV = "suv"
    ELECTRIC = "electric"
    HYBRID = "hybrid"
    ANY = "any"


class RecurringPatternEnum(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"


class TemplateStatusEnum(str, enum.Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    EXPIRED = "expired"


class ExceptionTypeEnum(str, enum.Enum):
    SKIP = "skip"
    MODIFY = "modify"


class Ride(SQLModel, table=True):
    __tablename__ = "rides"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    driver_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    origin: str = Field(max_length=500)
    origin_lat: float
    origin_lng: float
    destination: str = Field(max_length=500)
    destination_lat: float
    destination_lng: float
    departure_time: datetime
    distance_km: float = Field(ge=0)
    seats_available: int = Field(ge=0)
    seats_total: int = Field(ge=1)
    co2_saved: float = Field(default=0, ge=0)
    vehicle_type: VehicleTypeEnum = Field(
        sa_column=Column(SAEnum(VehicleTypeEnum), nullable=False, default=VehicleTypeEnum.SEDAN)
    )
    vehicle_make: Optional[str] = Field(default=None, max_length=100)
    status: RideStatusEnum = Field(
        sa_column=Column(SAEnum(RideStatusEnum), nullable=False, default=RideStatusEnum.SCHEDULED)
    )
    is_recurring: bool = Field(default=False)
    recurring_template_id: Optional[str] = Field(
        default=None, foreign_key="recurring_ride_templates.id", max_length=36
    )
    preferences: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    preferences_tags: Optional[list] = Field(default=None, sa_column=Column(JSON))
    share_code: Optional[str] = Field(default=None, max_length=10)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class RideRequest(SQLModel, table=True):
    __tablename__ = "ride_requests"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    ride_id: str = Field(foreign_key="rides.id", index=True, max_length=36)
    passenger_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    status: RideRequestStatusEnum = Field(
        sa_column=Column(
            SAEnum(RideRequestStatusEnum),
            nullable=False,
            default=RideRequestStatusEnum.PENDING,
        )
    )
    pickup_address: Optional[str] = Field(default=None, max_length=500)
    pickup_lat: Optional[float] = Field(default=None)
    pickup_lng: Optional[float] = Field(default=None)
    message: Optional[str] = Field(default=None, max_length=300)
    requested_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    responded_at: Optional[datetime] = Field(default=None)


class RecurringRideTemplate(SQLModel, table=True):
    __tablename__ = "recurring_ride_templates"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    name: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    origin_address: str = Field(max_length=500)
    origin_lat: float
    origin_lng: float
    destination_address: str = Field(max_length=500)
    destination_lat: float
    destination_lng: float
    departure_time: str = Field(max_length=5)  # HH:MM format
    pattern: RecurringPatternEnum = Field(
        sa_column=Column(SAEnum(RecurringPatternEnum), nullable=False, default=RecurringPatternEnum.WEEKLY)
    )
    days_of_week: Optional[list] = Field(default=None, sa_column=Column(JSON))
    start_date: date
    end_date: Optional[date] = Field(default=None)
    seats: int = Field(default=1, ge=1)
    is_driver: bool = Field(default=True)
    preferences: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    auto_accept: bool = Field(default=False)
    notification_enabled: bool = Field(default=True)
    status: TemplateStatusEnum = Field(
        sa_column=Column(SAEnum(TemplateStatusEnum), nullable=False, default=TemplateStatusEnum.ACTIVE)
    )
    total_rides_generated: int = Field(default=0)
    total_rides_completed: int = Field(default=0)
    total_co2_saved: float = Field(default=0)
    average_passengers: float = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class RideException(SQLModel, table=True):
    __tablename__ = "ride_exceptions"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    template_id: str = Field(foreign_key="recurring_ride_templates.id", index=True, max_length=36)
    date: date
    type: ExceptionTypeEnum = Field(
        sa_column=Column(SAEnum(ExceptionTypeEnum), nullable=False)
    )
    reason: Optional[str] = Field(default=None, max_length=300)
    modified_departure_time: Optional[str] = Field(default=None, max_length=5)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
