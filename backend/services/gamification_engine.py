"""
Gamification Engine Service
Port of frontend gamification.ts to Python.
OxyPoints, levels, tiers, achievements, leaderboards.
"""

from typing import List, Dict, Optional, Tuple

# Level thresholds (points required)
LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 1500, 2500, 4000, 6000, 8500,
    12000, 16000, 20000, 25000, 30000, 40000, 50000, 65000, 80000, 100000,
]

# Tier thresholds
TIER_THRESHOLDS = {
    "bronze": 0,
    "silver": 500,
    "gold": 2000,
    "platinum": 5000,
    "diamond": 10000,
}

# Achievement definitions
ACHIEVEMENT_DEFINITIONS = [
    {"id": "ach-first-ride", "name": "First Steps", "description": "Complete your first carpool ride", "icon": "car", "category": "rides", "requirement": 1, "points": 50, "rarity": "common"},
    {"id": "ach-10-rides", "name": "Regular Rider", "description": "Complete 10 carpool rides", "icon": "target", "category": "rides", "requirement": 10, "points": 100, "rarity": "common"},
    {"id": "ach-50-rides", "name": "Carpool Champion", "description": "Complete 50 carpool rides", "icon": "trophy", "category": "rides", "requirement": 50, "points": 500, "rarity": "rare"},
    {"id": "ach-100-rides", "name": "Century Club", "description": "Complete 100 carpool rides", "icon": "100", "category": "rides", "requirement": 100, "points": 1000, "rarity": "epic"},
    {"id": "ach-500-rides", "name": "Legendary Commuter", "description": "Complete 500 carpool rides", "icon": "crown", "category": "rides", "requirement": 500, "points": 5000, "rarity": "legendary"},
    {"id": "ach-50kg-co2", "name": "Carbon Cutter", "description": "Save 50 kg of CO2", "icon": "leaf", "category": "co2", "requirement": 50, "points": 200, "rarity": "common"},
    {"id": "ach-250kg-co2", "name": "Eco Warrior", "description": "Save 250 kg of CO2", "icon": "tree", "category": "co2", "requirement": 250, "points": 750, "rarity": "rare"},
    {"id": "ach-1000kg-co2", "name": "Planet Protector", "description": "Save 1,000 kg of CO2", "icon": "globe", "category": "co2", "requirement": 1000, "points": 2500, "rarity": "epic"},
    {"id": "ach-5000kg-co2", "name": "Climate Hero", "description": "Save 5,000 kg of CO2", "icon": "hero", "category": "co2", "requirement": 5000, "points": 10000, "rarity": "legendary"},
    {"id": "ach-7-day-streak", "name": "Week Warrior", "description": "Maintain a 7-day carpool streak", "icon": "fire", "category": "streak", "requirement": 7, "points": 150, "rarity": "common"},
    {"id": "ach-30-day-streak", "name": "Monthly Master", "description": "Maintain a 30-day carpool streak", "icon": "zap", "category": "streak", "requirement": 30, "points": 500, "rarity": "rare"},
    {"id": "ach-100-day-streak", "name": "Unstoppable", "description": "Maintain a 100-day carpool streak", "icon": "star", "category": "streak", "requirement": 100, "points": 2000, "rarity": "epic"},
    {"id": "ach-first-share", "name": "Social Butterfly", "description": "Share your first ride", "icon": "share", "category": "social", "requirement": 1, "points": 75, "rarity": "common"},
    {"id": "ach-10-referrals", "name": "Community Builder", "description": "Refer 10 friends to join", "icon": "users", "category": "social", "requirement": 10, "points": 1000, "rarity": "rare"},
    {"id": "ach-early-adopter", "name": "Early Adopter", "description": "Join in the first month", "icon": "badge", "category": "special", "requirement": 1, "points": 500, "rarity": "rare"},
]


def calculate_level(points: int) -> Tuple[int, int]:
    """
    Calculate user level from total points.
    Returns (level, points_to_next_level).
    """
    level = 1
    for i, threshold in enumerate(LEVEL_THRESHOLDS):
        if points >= threshold:
            level = i + 1
        else:
            break

    next_threshold = (
        LEVEL_THRESHOLDS[level]
        if level < len(LEVEL_THRESHOLDS)
        else LEVEL_THRESHOLDS[-1]
    )
    points_to_next = max(0, next_threshold - points)

    return level, points_to_next


def calculate_tier(points: int) -> str:
    """Calculate user tier from total points."""
    if points >= TIER_THRESHOLDS["diamond"]:
        return "diamond"
    elif points >= TIER_THRESHOLDS["platinum"]:
        return "platinum"
    elif points >= TIER_THRESHOLDS["gold"]:
        return "gold"
    elif points >= TIER_THRESHOLDS["silver"]:
        return "silver"
    return "bronze"


def check_achievement_unlocks(
    total_rides: int,
    total_co2_saved: float,
    longest_streak: int,
    existing_unlocked_ids: List[str],
) -> List[Dict]:
    """
    Check which achievements should be newly unlocked.
    Returns list of newly unlocked achievement definitions.
    """
    newly_unlocked = []

    for ach in ACHIEVEMENT_DEFINITIONS:
        if ach["id"] in existing_unlocked_ids:
            continue

        progress = 0
        if ach["category"] == "rides":
            progress = total_rides
        elif ach["category"] == "co2":
            progress = total_co2_saved
        elif ach["category"] == "streak":
            progress = longest_streak

        if progress >= ach["requirement"]:
            newly_unlocked.append({**ach, "progress": progress})

    return newly_unlocked


def get_tier_color(tier: str) -> str:
    """Get CSS classes for tier badge."""
    colors = {
        "bronze": "bg-orange-100 text-orange-700 border-orange-300",
        "silver": "bg-gray-100 text-gray-700 border-gray-300",
        "gold": "bg-yellow-100 text-yellow-700 border-yellow-300",
        "platinum": "bg-blue-100 text-blue-700 border-blue-300",
        "diamond": "bg-purple-100 text-purple-700 border-purple-300",
    }
    return colors.get(tier, "")


def get_rarity_multiplier(rarity: str) -> float:
    """Get point multiplier for achievement rarity."""
    multipliers = {
        "common": 1.0,
        "rare": 1.5,
        "epic": 2.0,
        "legendary": 3.0,
    }
    return multipliers.get(rarity, 1.0)
