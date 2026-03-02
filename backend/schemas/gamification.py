"""
Gamification Schemas
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class OxyPointsBalance(BaseModel):
    user_id: str
    total_points: int
    level: int
    points_to_next_level: int
    tier: str
    streak: int
    longest_streak: int
    total_co2_saved: float
    total_rides: int
    rank: int


class OxyPointsTransaction(BaseModel):
    id: str
    points: int
    reason: str
    description: Optional[str] = None
    reference_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AchievementRead(BaseModel):
    id: str
    achievement_id: str
    name: str
    description: str
    icon: str
    category: str
    rarity: str
    requirement: int
    progress: int
    is_unlocked: bool
    points_awarded: int
    unlocked_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BadgeRead(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    color: str
    earned_at: datetime

    class Config:
        from_attributes = True


class ChallengeRead(BaseModel):
    id: str
    name: str
    description: str
    type: str
    start_date: datetime
    end_date: datetime
    goal: int
    reward_points: int
    reward_badge: Optional[str] = None
    status: str
    participant_count: int
    user_progress: Optional[int] = None
    user_completed: Optional[bool] = None

    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    name: str
    avatar: Optional[str] = None
    score: int
    change: int
    badge: Optional[str] = None
    tier: str


class LeaderboardRead(BaseModel):
    type: str  # "points", "co2", "rides", "streak"
    period: str  # "daily", "weekly", "monthly", "all-time"
    entries: List[LeaderboardEntry]
    user_rank: Optional[int] = None


class RedeemRequest(BaseModel):
    points: int
    reward_type: str
    reward_id: Optional[str] = None
    notes: Optional[str] = None
