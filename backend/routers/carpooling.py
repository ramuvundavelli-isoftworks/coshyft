"""
Carpooling Router
POST /rides, GET /rides/find, GET /rides/my, GET /rides/{id}
PUT /rides/{id}, DELETE /rides/{id}
POST /rides/{id}/request, PUT /rides/{id}/request/{reqId}/accept|reject
POST /rides/{id}/start, POST /rides/{id}/complete
GET /rides/active
Recurring: POST/GET/PUT/DELETE /rides/recurring, pause/resume/exception
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
import uuid

from database import get_session
from auth.dependencies import get_current_user
from models.user import User
from models.carpooling import Ride, RideRequest, RecurringRideTemplate, RideException
from schemas.carpooling import (
    RideCreate, RideRead, RideUpdate, RideFindParams, RideMatchResult,
    RideRequestCreate, RideRequestRead,
    RecurringTemplateCreate, RecurringTemplateRead, RecurringTemplateUpdate,
    RideExceptionCreate, ActiveTripStatus,
)
from schemas.common import ApiResponse, PaginatedResponse
from services.carpool_matching import calculate_compatibility_score
from services.emission_calculator import calculate_carpool_co2_savings

router = APIRouter(prefix="/rides", tags=["Carpooling"])


@router.post("/", response_model=ApiResponse[RideRead], status_code=201)
async def offer_ride(
    ride_data: RideCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Offer a new ride as driver."""
    co2 = calculate_carpool_co2_savings(ride_data.distance_km, ride_data.seats_total - 1)
    share_code = str(uuid.uuid4())[:6].upper()

    ride = Ride(
        driver_id=user.id,
        origin=ride_data.origin,
        origin_lat=ride_data.origin_lat,
        origin_lng=ride_data.origin_lng,
        destination=ride_data.destination,
        destination_lat=ride_data.destination_lat,
        destination_lng=ride_data.destination_lng,
        departure_time=ride_data.departure_time,
        distance_km=ride_data.distance_km,
        seats_available=ride_data.seats_total - 1,
        seats_total=ride_data.seats_total,
        co2_saved=co2,
        vehicle_type=ride_data.vehicle_type,
        vehicle_make=ride_data.vehicle_make,
        status="scheduled",
        preferences=ride_data.preferences,
        preferences_tags=ride_data.preferences_tags,
        share_code=share_code,
    )
    session.add(ride)
    await session.flush()
    await session.refresh(ride)

    return ApiResponse(success=True, data=RideRead.model_validate(ride))


@router.get("/find", response_model=ApiResponse)
async def find_rides(
    origin_lat: float = Query(...),
    origin_lng: float = Query(...),
    destination_lat: float = Query(...),
    destination_lng: float = Query(...),
    departure_time: str = Query(None),
    max_distance_km: float = Query(None),
    min_seats: int = Query(1),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Find matching rides based on route, time, and preferences."""
    statement = select(Ride).where(
        Ride.status == "scheduled",
        Ride.seats_available >= min_seats,
        Ride.driver_id != user.id,
    )

    if max_distance_km:
        statement = statement.where(Ride.distance_km <= max_distance_km)

    result = await session.execute(statement)
    rides = result.scalars().all()

    matches = []
    for ride in rides:
        scores = calculate_compatibility_score(
            user_origin=(origin_lat, origin_lng),
            user_dest=(destination_lat, destination_lng),
            user_time=departure_time or "08:00",
            ride_origin=(ride.origin_lat, ride.origin_lng),
            ride_dest=(ride.destination_lat, ride.destination_lng),
            ride_time=ride.departure_time.strftime("%H:%M") if isinstance(ride.departure_time, datetime) else "08:00",
            user_prefs=None,
            ride_prefs=ride.preferences,
        )

        # Get driver info
        driver_stmt = select(User).where(User.id == ride.driver_id)
        driver_result = await session.execute(driver_stmt)
        driver = driver_result.scalar_one_or_none()

        ride_read = RideRead.model_validate(ride)
        ride_read.driver_name = driver.name if driver else "Unknown"

        matches.append({
            "ride": ride_read.model_dump(),
            "match_score": scores["overall_score"],
            "route_score": scores["route_score"],
            "time_score": scores["time_score"],
            "preference_score": scores["preference_score"],
        })

    matches.sort(key=lambda m: m["match_score"], reverse=True)
    return ApiResponse(success=True, data=matches)


@router.get("/my", response_model=ApiResponse)
async def get_my_rides(
    status: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get rides for current user (as driver and as passenger)."""
    # As driver
    driver_stmt = select(Ride).where(Ride.driver_id == user.id)
    if status:
        driver_stmt = driver_stmt.where(Ride.status == status)
    driver_result = await session.execute(driver_stmt)
    driver_rides = driver_result.scalars().all()

    # As passenger (accepted requests)
    passenger_stmt = select(RideRequest).where(
        RideRequest.passenger_id == user.id,
        RideRequest.status == "accepted",
    )
    passenger_result = await session.execute(passenger_stmt)
    passenger_requests = passenger_result.scalars().all()

    passenger_ride_ids = [r.ride_id for r in passenger_requests]
    passenger_rides = []
    if passenger_ride_ids:
        p_stmt = select(Ride).where(Ride.id.in_(passenger_ride_ids))
        if status:
            p_stmt = p_stmt.where(Ride.status == status)
        p_result = await session.execute(p_stmt)
        passenger_rides = p_result.scalars().all()

    all_rides = [
        {**RideRead.model_validate(r).model_dump(), "user_role": "driver"}
        for r in driver_rides
    ] + [
        {**RideRead.model_validate(r).model_dump(), "user_role": "passenger"}
        for r in passenger_rides
    ]

    return ApiResponse(success=True, data=all_rides)


@router.get("/{ride_id}", response_model=ApiResponse[RideRead])
async def get_ride(
    ride_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Get ride details."""
    ride = (await session.execute(select(Ride).where(Ride.id == ride_id))).scalar_one_or_none()
    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found")

    ride_read = RideRead.model_validate(ride)
    driver = (await session.execute(select(User).where(User.id == ride.driver_id))).scalar_one_or_none()
    ride_read.driver_name = driver.name if driver else None

    return ApiResponse(success=True, data=ride_read)


@router.put("/{ride_id}", response_model=ApiResponse[RideRead])
async def update_ride(
    ride_id: str,
    update: RideUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update ride (driver only)."""
    ride = (await session.execute(
        select(Ride).where(Ride.id == ride_id, Ride.driver_id == user.id)
    )).scalar_one_or_none()

    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found or not authorized")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(ride, key, value)
    ride.updated_at = datetime.now(timezone.utc)

    session.add(ride)
    await session.flush()
    await session.refresh(ride)

    return ApiResponse(success=True, data=RideRead.model_validate(ride))


@router.delete("/{ride_id}", response_model=ApiResponse)
async def cancel_ride(
    ride_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Cancel a ride (driver only)."""
    ride = (await session.execute(
        select(Ride).where(Ride.id == ride_id, Ride.driver_id == user.id)
    )).scalar_one_or_none()

    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found or not authorized")

    ride.status = "cancelled"
    ride.updated_at = datetime.now(timezone.utc)
    session.add(ride)

    return ApiResponse(success=True, meta={"message": "Ride cancelled"})


@router.post("/{ride_id}/request", response_model=ApiResponse[RideRequestRead], status_code=201)
async def request_ride(
    ride_id: str,
    request_data: RideRequestCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Request to join a ride as passenger."""
    ride = (await session.execute(select(Ride).where(Ride.id == ride_id))).scalar_one_or_none()
    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride.seats_available <= 0:
        raise HTTPException(status_code=400, detail="No seats available")
    if ride.driver_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot request your own ride")

    req = RideRequest(
        ride_id=ride_id,
        passenger_id=user.id,
        pickup_address=request_data.pickup_address,
        pickup_lat=request_data.pickup_lat,
        pickup_lng=request_data.pickup_lng,
        message=request_data.message,
    )
    session.add(req)
    await session.flush()
    await session.refresh(req)

    return ApiResponse(success=True, data=RideRequestRead.model_validate(req))


@router.put("/{ride_id}/request/{request_id}/accept", response_model=ApiResponse)
async def accept_request(
    ride_id: str,
    request_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Accept a passenger request (driver only)."""
    ride = (await session.execute(
        select(Ride).where(Ride.id == ride_id, Ride.driver_id == user.id)
    )).scalar_one_or_none()
    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found or not authorized")

    req = (await session.execute(
        select(RideRequest).where(RideRequest.id == request_id, RideRequest.ride_id == ride_id)
    )).scalar_one_or_none()
    if req is None:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = "accepted"
    req.responded_at = datetime.now(timezone.utc)
    ride.seats_available = max(0, ride.seats_available - 1)

    session.add(req)
    session.add(ride)

    return ApiResponse(success=True, meta={"message": "Request accepted"})


@router.put("/{ride_id}/request/{request_id}/reject", response_model=ApiResponse)
async def reject_request(
    ride_id: str,
    request_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Reject a passenger request (driver only)."""
    ride = (await session.execute(
        select(Ride).where(Ride.id == ride_id, Ride.driver_id == user.id)
    )).scalar_one_or_none()
    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found or not authorized")

    req = (await session.execute(
        select(RideRequest).where(RideRequest.id == request_id, RideRequest.ride_id == ride_id)
    )).scalar_one_or_none()
    if req is None:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = "rejected"
    req.responded_at = datetime.now(timezone.utc)
    session.add(req)

    return ApiResponse(success=True, meta={"message": "Request rejected"})


@router.post("/{ride_id}/start", response_model=ApiResponse)
async def start_ride(
    ride_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Start a ride (driver only)."""
    ride = (await session.execute(
        select(Ride).where(Ride.id == ride_id, Ride.driver_id == user.id)
    )).scalar_one_or_none()
    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found")

    ride.status = "active"
    ride.updated_at = datetime.now(timezone.utc)
    session.add(ride)

    return ApiResponse(success=True, meta={"message": "Ride started"})


@router.post("/{ride_id}/complete", response_model=ApiResponse)
async def complete_ride(
    ride_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Complete a ride. Triggers OxyPoints award."""
    ride = (await session.execute(
        select(Ride).where(Ride.id == ride_id, Ride.driver_id == user.id)
    )).scalar_one_or_none()
    if ride is None:
        raise HTTPException(status_code=404, detail="Ride not found")

    ride.status = "completed"
    ride.updated_at = datetime.now(timezone.utc)

    passengers_count = ride.seats_total - ride.seats_available - 1
    ride.co2_saved = calculate_carpool_co2_savings(ride.distance_km, max(passengers_count, 1))

    session.add(ride)

    return ApiResponse(success=True, meta={"message": "Ride completed", "co2_saved": ride.co2_saved})


# --- Recurring Templates ---

@router.post("/recurring", response_model=ApiResponse[RecurringTemplateRead], status_code=201)
async def create_recurring_template(
    template: RecurringTemplateCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create a recurring ride template."""
    t = RecurringRideTemplate(
        user_id=user.id,
        name=template.name,
        description=template.description,
        origin_address=template.origin_address,
        origin_lat=template.origin_lat,
        origin_lng=template.origin_lng,
        destination_address=template.destination_address,
        destination_lat=template.destination_lat,
        destination_lng=template.destination_lng,
        departure_time=template.departure_time,
        pattern=template.pattern,
        days_of_week=template.days_of_week,
        start_date=template.start_date,
        end_date=template.end_date,
        seats=template.seats,
        is_driver=template.is_driver,
        preferences=template.preferences,
        auto_accept=template.auto_accept,
        notification_enabled=template.notification_enabled,
    )
    session.add(t)
    await session.flush()
    await session.refresh(t)

    return ApiResponse(success=True, data=RecurringTemplateRead.model_validate(t))


@router.get("/recurring", response_model=ApiResponse)
async def list_recurring_templates(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """List user's recurring ride templates."""
    stmt = select(RecurringRideTemplate).where(RecurringRideTemplate.user_id == user.id)
    result = await session.execute(stmt)
    templates = result.scalars().all()

    return ApiResponse(
        success=True,
        data=[RecurringTemplateRead.model_validate(t).model_dump() for t in templates],
    )


@router.put("/recurring/{template_id}", response_model=ApiResponse[RecurringTemplateRead])
async def update_recurring_template(
    template_id: str,
    update: RecurringTemplateUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Update a recurring template."""
    t = (await session.execute(
        select(RecurringRideTemplate).where(
            RecurringRideTemplate.id == template_id,
            RecurringRideTemplate.user_id == user.id,
        )
    )).scalar_one_or_none()

    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(t, key, value)
    t.updated_at = datetime.now(timezone.utc)
    session.add(t)
    await session.flush()
    await session.refresh(t)

    return ApiResponse(success=True, data=RecurringTemplateRead.model_validate(t))


@router.delete("/recurring/{template_id}", response_model=ApiResponse)
async def delete_recurring_template(
    template_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Delete a recurring template."""
    t = (await session.execute(
        select(RecurringRideTemplate).where(
            RecurringRideTemplate.id == template_id,
            RecurringRideTemplate.user_id == user.id,
        )
    )).scalar_one_or_none()

    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")

    await session.delete(t)
    return ApiResponse(success=True, meta={"message": "Template deleted"})


@router.post("/recurring/{template_id}/pause", response_model=ApiResponse)
async def pause_template(
    template_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Pause a recurring template."""
    t = (await session.execute(
        select(RecurringRideTemplate).where(
            RecurringRideTemplate.id == template_id,
            RecurringRideTemplate.user_id == user.id,
        )
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")

    t.status = "paused"
    t.updated_at = datetime.now(timezone.utc)
    session.add(t)

    return ApiResponse(success=True, meta={"message": "Template paused"})


@router.post("/recurring/{template_id}/resume", response_model=ApiResponse)
async def resume_template(
    template_id: str,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Resume a paused template."""
    t = (await session.execute(
        select(RecurringRideTemplate).where(
            RecurringRideTemplate.id == template_id,
            RecurringRideTemplate.user_id == user.id,
        )
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")

    t.status = "active"
    t.updated_at = datetime.now(timezone.utc)
    session.add(t)

    return ApiResponse(success=True, meta={"message": "Template resumed"})


@router.post("/recurring/{template_id}/exception", response_model=ApiResponse, status_code=201)
async def add_exception(
    template_id: str,
    exc: RideExceptionCreate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Add a skip/modify exception to a recurring template."""
    t = (await session.execute(
        select(RecurringRideTemplate).where(
            RecurringRideTemplate.id == template_id,
            RecurringRideTemplate.user_id == user.id,
        )
    )).scalar_one_or_none()
    if t is None:
        raise HTTPException(status_code=404, detail="Template not found")

    exception = RideException(
        template_id=template_id,
        date=exc.date,
        type=exc.type,
        reason=exc.reason,
        modified_departure_time=exc.modified_departure_time,
    )
    session.add(exception)

    return ApiResponse(success=True, meta={"message": "Exception added"})
