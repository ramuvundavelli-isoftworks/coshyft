"""
Carpooling Schemas
"""

from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, Field


class CancelBody(BaseModel):
    reason: str
    note: Optional[str] = None


class RejectBody(BaseModel):
    reason: Optional[str] = None
    note: Optional[str] = None


class RideCreate(BaseModel):
    origin: str
    origin_lat: float = 53.3498   # Default: Dublin city centre
    origin_lng: float = -6.2603
    destination: str
    destination_lat: float = 53.3389  # Default: Dublin Docklands
    destination_lng: float = -6.2572
    departure_time: datetime
    distance_km: float = Field(default=10.0, ge=0)
    seats_total: int = Field(default=4, ge=1)
    vehicle_type: str = "sedan"
    vehicle_make: Optional[str] = None
    preferences: Optional[dict] = None
    preferences_tags: Optional[List[str]] = None


class RideRead(BaseModel):
    id: str
    driver_id: str
    driver_name: Optional[str] = None
    origin: str
    origin_lat: float
    origin_lng: float
    destination: str
    destination_lat: float
    destination_lng: float
    departure_time: datetime
    distance_km: float
    seats_available: int
    seats_total: int
    co2_saved: float
    vehicle_type: str
    vehicle_make: Optional[str] = None
    status: str
    is_recurring: bool
    preferences_tags: Optional[List[str]] = None
    share_code: Optional[str] = None
    cancellation_reason: Optional[str] = None
    cancellation_note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RideUpdate(BaseModel):
    departure_time: Optional[datetime] = None
    seats_total: Optional[int] = Field(default=None, ge=1)
    vehicle_type: Optional[str] = None
    vehicle_make: Optional[str] = None
    preferences: Optional[dict] = None


class RideMatchResult(BaseModel):
    ride: RideRead
    match_score: int
    route_score: float
    time_score: float
    preference_score: float
    driver_rating: Optional[float] = None
    driver_total_trips: Optional[int] = None
    verified_driver: bool = False
    trust_score: Optional[int] = None


class RideRequestCreate(BaseModel):
    pickup_address: Optional[str] = None
    pickup_lat: Optional[float] = None
    pickup_lng: Optional[float] = None
    message: Optional[str] = None


class RideRequestRead(BaseModel):
    id: str
    ride_id: str
    passenger_id: str
    passenger_name: Optional[str] = None
    status: str
    pickup_address: Optional[str] = None
    message: Optional[str] = None
    requested_at: datetime
    cancellation_reason: Optional[str] = None
    cancellation_note: Optional[str] = None
    rejection_reason: Optional[str] = None
    rejection_note: Optional[str] = None

    class Config:
        from_attributes = True


class RideFindParams(BaseModel):
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    departure_time: Optional[str] = None
    max_distance_km: Optional[float] = None
    min_seats: int = 1
    vehicle_types: Optional[List[str]] = None
    min_rating: Optional[float] = None


class RecurringTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    origin_address: str
    origin_lat: float
    origin_lng: float
    destination_address: str
    destination_lat: float
    destination_lng: float
    departure_time: str  # HH:MM
    pattern: str = "weekly"
    days_of_week: Optional[List[str]] = None
    start_date: date
    end_date: Optional[date] = None
    seats: int = Field(default=1, ge=1)
    is_driver: bool = True
    preferences: Optional[dict] = None
    auto_accept: bool = False
    notification_enabled: bool = True


class RecurringTemplateRead(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    origin_address: str
    destination_address: str
    departure_time: str
    pattern: str
    days_of_week: Optional[List[str]] = None
    start_date: date
    end_date: Optional[date] = None
    seats: int
    is_driver: bool
    auto_accept: bool
    notification_enabled: bool
    status: str
    total_rides_generated: int
    total_rides_completed: int
    total_co2_saved: float
    average_passengers: float
    created_at: datetime

    class Config:
        from_attributes = True


class RecurringTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    departure_time: Optional[str] = None
    days_of_week: Optional[List[str]] = None
    end_date: Optional[date] = None
    seats: Optional[int] = Field(default=None, ge=1)
    preferences: Optional[dict] = None
    auto_accept: Optional[bool] = None
    notification_enabled: Optional[bool] = None


class RideExceptionCreate(BaseModel):
    date: date
    type: str  # "skip" or "modify"
    reason: Optional[str] = None
    modified_departure_time: Optional[str] = None


class ActiveTripStatus(BaseModel):
    ride_id: str
    status: str
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    estimated_arrival: Optional[datetime] = None
    distance_remaining_km: Optional[float] = None
    duration_remaining_minutes: Optional[int] = None
    completion_percentage: float = 0
    passengers: List[dict] = []
    share_code: Optional[str] = None
