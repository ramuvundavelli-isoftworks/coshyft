"""
Carpool Matching Service
Port of frontend carpoolMatching.ts to Python.
Haversine distance, route/time/preference scoring.
"""

import math
from typing import Optional, Dict, List, Any


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two GPS coordinates in km using Haversine formula."""
    R = 6371  # Earth's radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def time_to_minutes(time_str: str) -> int:
    """Convert HH:MM string to minutes since midnight."""
    parts = time_str.split(":")
    return int(parts[0]) * 60 + int(parts[1])


def calculate_route_score(
    user_origin_lat: float,
    user_origin_lng: float,
    user_dest_lat: float,
    user_dest_lng: float,
    ride_origin_lat: float,
    ride_origin_lng: float,
    ride_dest_lat: float,
    ride_dest_lng: float,
    flexible_radius: float = 5.0,
) -> float:
    """Score route compatibility (0-100)."""
    origin_dist = haversine_distance(user_origin_lat, user_origin_lng, ride_origin_lat, ride_origin_lng)
    dest_dist = haversine_distance(user_dest_lat, user_dest_lng, ride_dest_lat, ride_dest_lng)

    origin_score = max(0, 100 - (origin_dist / flexible_radius) * 100)
    dest_score = max(0, 100 - (dest_dist / flexible_radius) * 100)

    return (origin_score + dest_score) / 2


def calculate_time_score(
    user_time: str,
    ride_time: str,
    flexible_minutes: int = 30,
) -> float:
    """Score time compatibility (0-100)."""
    user_min = time_to_minutes(user_time)
    ride_min = time_to_minutes(ride_time)
    diff = abs(user_min - ride_min)

    if diff == 0:
        return 100
    if diff > flexible_minutes * 2:
        return 0
    return max(0, 100 - (diff / flexible_minutes) * 50)


def calculate_preference_score(
    user_prefs: Dict[str, Any],
    ride_prefs: Dict[str, Any],
) -> float:
    """Score preference compatibility (0-100)."""
    score = 0

    # Music (20 pts)
    u_music = user_prefs.get("musicPreference", "no-preference")
    r_music = ride_prefs.get("musicPreference", "no-preference")
    if u_music == "no-preference" or r_music == "no-preference":
        score += 20
    elif u_music == r_music:
        score += 20
    else:
        score += 10

    # Conversation (20 pts)
    u_conv = user_prefs.get("conversationLevel", "no-preference")
    r_conv = ride_prefs.get("conversationLevel", "no-preference")
    if u_conv == "no-preference" or r_conv == "no-preference":
        score += 20
    elif u_conv == r_conv:
        score += 20
    else:
        score += 10

    # Pets (15 pts)
    if user_prefs.get("allowsPets") == ride_prefs.get("allowsPets"):
        score += 15
    elif not user_prefs.get("allowsPets") and ride_prefs.get("allowsPets"):
        score += 0
    else:
        score += 7

    # Smoking (25 pts)
    u_smoke = user_prefs.get("allowsSmoking", False)
    r_smoke = ride_prefs.get("allowsSmoking", False)
    if not u_smoke and not r_smoke:
        score += 25
    elif u_smoke == r_smoke:
        score += 25
    elif not u_smoke and r_smoke:
        score += 0
    else:
        score += 15

    # Vehicle type (20 pts)
    u_veh = user_prefs.get("vehicleType", "any")
    r_veh = ride_prefs.get("vehicleType", "any")
    if u_veh == "any" or r_veh == "any":
        score += 20
    elif u_veh == r_veh:
        score += 20
    elif u_veh in ("electric", "hybrid") and r_veh in ("electric", "hybrid"):
        score += 15
    else:
        score += 10

    return score


def calculate_compatibility_score(
    user_origin: tuple,
    user_dest: tuple,
    user_time: str,
    ride_origin: tuple,
    ride_dest: tuple,
    ride_time: str,
    user_prefs: Dict = None,
    ride_prefs: Dict = None,
    driver_rating: Optional[float] = None,
    weights: Dict = None,
) -> Dict:
    """
    Calculate overall match score.
    Returns dict with overall score and component breakdowns.
    """
    if weights is None:
        weights = {
            "route": 0.4,
            "time": 0.3,
            "preferences": 0.2,
            "rating": 0.1,
        }

    route_score = calculate_route_score(
        user_origin[0], user_origin[1],
        user_dest[0], user_dest[1],
        ride_origin[0], ride_origin[1],
        ride_dest[0], ride_dest[1],
    )

    time_score = calculate_time_score(user_time, ride_time)

    pref_score = 80  # Default
    if user_prefs and ride_prefs:
        pref_score = calculate_preference_score(user_prefs, ride_prefs)

    rating_score = (driver_rating / 5 * 100) if driver_rating else 80

    overall = (
        route_score * weights["route"]
        + time_score * weights["time"]
        + pref_score * weights["preferences"]
        + rating_score * weights["rating"]
    )

    return {
        "overall_score": round(overall),
        "route_score": round(route_score, 1),
        "time_score": round(time_score, 1),
        "preference_score": round(pref_score, 1),
        "rating_score": round(rating_score, 1),
    }


def get_match_quality(score: int) -> Dict[str, str]:
    """Get match quality label and description."""
    if score >= 90:
        return {"label": "Excellent Match", "color": "green", "description": "Highly compatible route and preferences"}
    elif score >= 80:
        return {"label": "Great Match", "color": "green", "description": "Very good compatibility"}
    elif score >= 70:
        return {"label": "Good Match", "color": "blue", "description": "Compatible with minor differences"}
    elif score >= 60:
        return {"label": "Fair Match", "color": "yellow", "description": "Some compatibility concerns"}
    else:
        return {"label": "Low Match", "color": "red", "description": "Limited compatibility"}
