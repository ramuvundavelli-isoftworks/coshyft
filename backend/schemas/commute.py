"""
Commute Schemas
"""

from typing import Optional, List
from datetime import date, datetime
from pydantic import BaseModel, Field


class CommuteEntryCreate(BaseModel):
    date: date
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
    id: str
    user_id: str
    date: date
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

    class Config:
        from_attributes = True


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
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    transport_mode_id: Optional[str] = None
    min_distance: Optional[float] = None
    max_distance: Optional[float] = None
