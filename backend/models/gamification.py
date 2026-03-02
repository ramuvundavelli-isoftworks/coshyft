"""
Gamification Models
OxyPointsLedger, UserAchievement, UserBadge, Challenge, ChallengeParticipant
Maps to TypeScript: UserProfile, Achievement, Badge, Challenge
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum
import enum


class PointsReasonEnum(str, enum.Enum):
    RIDE = "ride"
    ACHIEVEMENT = "achievement"
    CHALLENGE = "challenge"
    REFERRAL = "referral"
    REDEMPTION = "redemption"
    STREAK_BONUS = "streak_bonus"
    FIRST_RIDE_OF_DAY = "first_ride_of_day"
    SHARE = "share"
    RATE = "rate"
    ADMIN_ADJUSTMENT = "admin_adjustment"


class AchievementCategoryEnum(str, enum.Enum):
    RIDES = "rides"
    CO2 = "co2"
    SOCIAL = "social"
    STREAK = "streak"
    SPECIAL = "special"


class AchievementRarityEnum(str, enum.Enum):
    COMMON = "common"
    RARE = "rare"
    EPIC = "epic"
    LEGENDARY = "legendary"


class UserTierEnum(str, enum.Enum):
    BRONZE = "bronze"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"
    DIAMOND = "diamond"


class ChallengeTypeEnum(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    SPECIAL = "special"


class ChallengeStatusEnum(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    EXPIRED = "expired"


class OxyPointsLedger(SQLModel, table=True):
    """Immutable append-only ledger for OxyPoints transactions."""

    __tablename__ = "oxypoints_ledger"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    points: int  # Can be negative for redemptions
    reason: PointsReasonEnum = Field(
        sa_column=Column(SAEnum(PointsReasonEnum), nullable=False)
    )
    description: Optional[str] = Field(default=None, max_length=300)
    reference_id: Optional[str] = Field(default=None, max_length=36)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)


class UserAchievement(SQLModel, table=True):
    """Tracks which achievements each user has unlocked."""

    __tablename__ = "user_achievements"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    achievement_id: str = Field(max_length=50)
    name: str = Field(max_length=200)
    description: str = Field(max_length=500)
    icon: str = Field(max_length=10)
    category: AchievementCategoryEnum = Field(
        sa_column=Column(SAEnum(AchievementCategoryEnum), nullable=False)
    )
    rarity: AchievementRarityEnum = Field(
        sa_column=Column(SAEnum(AchievementRarityEnum), nullable=False)
    )
    requirement: int
    progress: int = Field(default=0)
    is_unlocked: bool = Field(default=False)
    points_awarded: int = Field(default=0)
    unlocked_at: Optional[datetime] = Field(default=None)


class UserBadge(SQLModel, table=True):
    """Badges earned by users."""

    __tablename__ = "user_badges"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    name: str = Field(max_length=100)
    description: str = Field(max_length=300)
    icon: str = Field(max_length=10)
    color: str = Field(max_length=20)
    earned_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Challenge(SQLModel, table=True):
    """Platform-wide challenges users can join."""

    __tablename__ = "challenges"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    name: str = Field(max_length=200)
    description: str = Field(max_length=500)
    type: ChallengeTypeEnum = Field(
        sa_column=Column(SAEnum(ChallengeTypeEnum), nullable=False)
    )
    start_date: datetime
    end_date: datetime
    goal: int
    reward_points: int = Field(default=0)
    reward_badge: Optional[str] = Field(default=None, max_length=100)
    status: ChallengeStatusEnum = Field(
        sa_column=Column(SAEnum(ChallengeStatusEnum), nullable=False, default=ChallengeStatusEnum.ACTIVE)
    )
    participant_count: int = Field(default=0)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ChallengeParticipant(SQLModel, table=True):
    """Tracks user participation in challenges."""

    __tablename__ = "challenge_participants"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    challenge_id: str = Field(foreign_key="challenges.id", index=True, max_length=36)
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    progress: int = Field(default=0)
    completed: bool = Field(default=False)
    completed_at: Optional[datetime] = Field(default=None)
    joined_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
