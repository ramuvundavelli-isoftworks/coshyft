"""
Emission Calculator Service
SEAI 2024 / EPA Ireland / DEFRA emission factor calculations.
Handles Scope 3 Category 7 (Employee Commuting) per GHG Protocol.
"""

import math
from typing import Optional, Dict, Tuple

# SEAI 2024 / EPA Ireland Emission Factors (kg CO2 per km)
IRISH_EMISSION_FACTORS: Dict[str, float] = {
    "ie_t1": 0.082,   # Dublin Bus
    "ie_t2": 0.085,   # Bus Eireann
    "ie_t3": 0.082,   # Go-Ahead Ireland
    "ie_t4": 0.041,   # Irish Rail (Intercity)
    "ie_t5": 0.035,   # DART
    "ie_t6": 0.038,   # Luas Red Line
    "ie_t7": 0.038,   # Luas Green Line
    "ie_t8": 0.0,     # Dublin Bikes
    "ie_t9": 0.0,     # Personal Bicycle
    "ie_t10": 0.008,  # E-Bike
    "ie_t11": 0.015,  # E-Scooter
    "ie_t12": 0.0,    # Walking
    "ie_t13": 0.189,  # Petrol Car - Solo
    "ie_t14": 0.168,  # Diesel Car - Solo
    "ie_t15": 0.112,  # Hybrid Car - Solo
    "ie_t16": 0.053,  # Electric Vehicle - Solo
    "ie_t17": 0.095,  # Carpool (2 people)
    "ie_t18": 0.063,  # Carpool (3+ people)
    "ie_t19": 0.113,  # Motorcycle
    "ie_t20": 0.0,    # Work from Home
}

# DEFRA 2025 UK Emission Factors
UK_EMISSION_FACTORS: Dict[str, float] = {
    "petrol_car": 0.192,
    "diesel_car": 0.171,
    "ev_uk": 0.047,
    "bus_uk": 0.089,
    "rail_uk": 0.035,
    "metro_uk": 0.028,
}

# Average solo car emission factor (used for CO2 savings comparison)
AVG_SOLO_CAR_IE = 0.178  # Average of petrol (0.189) and diesel (0.168) in Ireland

# Irish grid carbon intensity (g CO2/kWh) - SEAI 2024
IRELAND_GRID_INTENSITY = 310
UK_GRID_INTENSITY = 220

# OxyPoints configuration
OXYPOINTS_CONFIG = {
    "carpool_driver": 15,
    "carpool_passenger": 10,
    "public_transport": 8,
    "bicycle": 12,
    "e_bike": 10,
    "walking": 15,
    "wfh": 5,
    "default": 5,
    "streak_bonus_per_day": 2,
    "max_streak_bonus": 14,  # 7 days * 2
}


def get_emission_factor(
    transport_mode_id: str,
    region: str = "IE",
    carpool_passengers: Optional[int] = None,
) -> Tuple[float, str]:
    """
    Get emission factor for a transport mode.
    Returns (kg_co2_per_km, source_description).
    """
    if region == "IE":
        factor = IRISH_EMISSION_FACTORS.get(transport_mode_id)
        if factor is not None:
            # Adjust for carpool passengers if applicable
            if transport_mode_id in ("ie_t13", "ie_t14", "ie_t15", "ie_t16") and carpool_passengers:
                factor = factor / (carpool_passengers + 1)
            return (factor, "SEAI/EPA Ireland 2025")
    elif region == "GB":
        factor = UK_EMISSION_FACTORS.get(transport_mode_id)
        if factor is not None:
            return (factor, "DEFRA 2025")

    # Fallback
    return (IRISH_EMISSION_FACTORS.get(transport_mode_id, 0.178), "Default Factor")


def calculate_emissions(
    transport_mode_id: str,
    distance_km: float,
    region: str = "IE",
    carpool_passengers: Optional[int] = None,
) -> Dict:
    """
    Calculate emissions for a commute.
    Returns dict with emissions, factor used, source, oxypoints, and CO2 saved vs car.
    """
    factor, source = get_emission_factor(transport_mode_id, region, carpool_passengers)
    emissions = round(distance_km * factor, 4)

    # CO2 saved compared to solo driving
    solo_emissions = distance_km * AVG_SOLO_CAR_IE
    co2_saved = round(max(0, solo_emissions - emissions), 4)

    # OxyPoints calculation
    oxypoints = calculate_oxypoints(transport_mode_id, carpool_passengers)

    return {
        "emissions_kg_co2": emissions,
        "emission_factor_used": factor,
        "emission_factor_source": source,
        "co2_saved_vs_car": co2_saved,
        "oxypoints": oxypoints,
    }


def calculate_oxypoints(
    transport_mode_id: str,
    carpool_passengers: Optional[int] = None,
    streak: int = 0,
) -> int:
    """Calculate OxyPoints for a commute entry."""
    base_points = OXYPOINTS_CONFIG["default"]

    # Categorize mode
    if transport_mode_id in ("ie_t17", "ie_t18"):
        base_points = OXYPOINTS_CONFIG["carpool_passenger"]
    elif transport_mode_id in ("ie_t13", "ie_t14", "ie_t15", "ie_t16") and carpool_passengers:
        base_points = OXYPOINTS_CONFIG["carpool_driver"]
        if carpool_passengers >= 3:
            base_points += 5
    elif transport_mode_id in ("ie_t1", "ie_t2", "ie_t3", "ie_t4", "ie_t5", "ie_t6", "ie_t7"):
        base_points = OXYPOINTS_CONFIG["public_transport"]
    elif transport_mode_id in ("ie_t8", "ie_t9"):
        base_points = OXYPOINTS_CONFIG["bicycle"]
    elif transport_mode_id == "ie_t10":
        base_points = OXYPOINTS_CONFIG["e_bike"]
    elif transport_mode_id == "ie_t12":
        base_points = OXYPOINTS_CONFIG["walking"]
    elif transport_mode_id == "ie_t20":
        base_points = OXYPOINTS_CONFIG["wfh"]

    # Streak bonus
    streak_bonus = min(streak, 7) * OXYPOINTS_CONFIG["streak_bonus_per_day"]

    return base_points + streak_bonus


def calculate_carpool_co2_savings(
    distance_km: float,
    passengers: int = 1,
    vehicle_factor: float = AVG_SOLO_CAR_IE,
) -> float:
    """Calculate CO2 saved by carpooling vs everyone driving solo."""
    solo_total = distance_km * vehicle_factor * (passengers + 1)
    carpool_total = distance_km * vehicle_factor
    return round(solo_total - carpool_total, 2)
