"""
Commute Schemas
"""

from typing import Optional, List
from datetime import date as DateType, datetime
from pydantic import BaseModel, Field, ConfigDict


class CommuteEntryCreate(BaseModel):
    date: DateType
    transport_mode_id: str
    distance_km: float = Field(ge=0)
    duration_minutes: Optional[int] = Field(default=None, ge=0)
    origin_address: Optional[str] = None
    destination_address: Optional[str] = None
    origin_lat: Optional[float] = None
    origin_lng: Optional[float] = None
    destination_lat: Optional[float] = None
    destination_lng: Optional[float] = None
    is_return_trip: bool = False
    carpool_passengers: Optional[int] = Field(default=None, ge=0)
    verification_method: str = "manual"
    notes: Optional[str] = None


class CommuteEntryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    user_id: str
    date: DateType = Field(validation_alias='commute_date')
    transport_mode_id: str
    transport_mode_label: str
    distance_km: float
    duration_minutes: Optional[int] = None
    origin_address: Optional[str] = None
    destination_address: Optional[str] = None
    emissions_kg_co2: float
    emission_factor_id: Optional[str] = None
    emission_factor_value: float
    is_return_trip: bool
    carpool_passengers: Optional[int] = None
    oxypoints_earned: int
    verification_method: str
    notes: Optional[str] = None
    created_at: datetime


class CommuteEntryUpdate(BaseModel):
    transport_mode_id: Optional[str] = None
    distance_km: Optional[float] = Field(default=None, ge=0)
    duration_minutes: Optional[int] = Field(default=None, ge=0)
    origin_address: Optional[str] = None
    destination_address: Optional[str] = None
    is_return_trip: Optional[bool] = None
    carpool_passengers: Optional[int] = None
    notes: Optional[str] = None


class CommuteStats(BaseModel):
    total_commutes: int
    total_distance_km: float
    total_emissions_kg: float
    total_oxypoints: int
    avg_daily_distance: float
    avg_daily_emissions: float
    modal_split: List[dict]
    monthly_trend: List[dict]
    streak: int
    co2_saved_vs_car: float


class EmissionCalculationRequest(BaseModel):
    transport_mode_id: str
    distance_km: float = Field(ge=0)
    carpool_passengers: Optional[int] = Field(default=None, ge=0)
    region: str = "IE"


class EmissionCalculationResponse(BaseModel):
    emissions_kg_co2: float
    emission_factor_used: float
    emission_factor_source: str
    oxypoints_estimate: int
    co2_saved_vs_car: float


class CommuteHistoryFilter(BaseModel):
    start_date: Optional[DateType] = None
    end_date: Optional[DateType] = None
    transport_mode_id: Optional[str] = None
    min_distance: Optional[float] = None
    max_distance: Optional[float] = None


class CommuteProfileRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    default_origin_address: Optional[str] = None
    default_origin_lat: Optional[float] = None
    default_origin_lng: Optional[float] = None
    default_destination_address: Optional[str] = None
    default_destination_lat: Optional[float] = None
    default_destination_lng: Optional[float] = None
    default_transport_mode_id: Optional[str] = None
    default_distance_km: Optional[float] = None
    work_days_per_week: int = 5
    remote_days_per_week: int = 0
    preferences: Optional[dict] = None
    updated_at: datetime


class CommuteProfileUpdate(BaseModel):
    default_origin_address: Optional[str] = None
    default_origin_lat: Optional[float] = None
    default_origin_lng: Optional[float] = None
    default_destination_address: Optional[str] = None
    default_destination_lat: Optional[float] = None
    default_destination_lng: Optional[float] = None
    default_transport_mode_id: Optional[str] = None
    default_distance_km: Optional[float] = Field(default=None, ge=0)
    work_days_per_week: Optional[int] = Field(default=None, ge=1, le=7)
    remote_days_per_week: Optional[int] = Field(default=None, ge=0, le=7)
    preferences: Optional[dict] = None


class MonthlyCommuteStats(BaseModel):
    month: int
    month_name: str
    total_commutes: int
    total_distance_km: float
    total_emissions_kg: float
    total_oxypoints: int
    co2_saved_vs_car: float
