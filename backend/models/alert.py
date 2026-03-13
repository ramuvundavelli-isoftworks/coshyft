"""
Alert Model
Maps to TypeScript: Alert
"""

import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum
import enum


class AlertSeverityEnum(str, enum.Enum):
    CRITICAL = "critical"
    WARNING = "warning"
    INFO = "info"


class Alert(SQLModel, table=True):
    __tablename__ = "alerts"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    severity: AlertSeverityEnum = Field(
        sa_column=Column(SAEnum(AlertSeverityEnum), nullable=False)
    )
    title: str = Field(max_length=300)
    description: str = Field(max_length=1000)
    timestamp: datetime = Field(default_factory=lambda: datetime.utcnow(), index=True)
    resolved: bool = Field(default=False)
    resolved_by: Optional[str] = Field(default=None, foreign_key="users.id", max_length=36)
    resolved_at: Optional[datetime] = Field(default=None)
    dismissed: bool = Field(default=False)
    linked_entity: Optional[str] = Field(default=None, max_length=100)
    linked_entity_id: Optional[str] = Field(default=None, max_length=36)
    target_roles: Optional[str] = Field(default=None, max_length=200)  # Comma-separated roles
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
