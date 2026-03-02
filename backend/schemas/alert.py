"""
Alert Schemas
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class AlertRead(BaseModel):
    id: str
    severity: str
    title: str
    description: str
    timestamp: datetime
    resolved: bool
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    dismissed: bool
    linked_entity: Optional[str] = None
    linked_entity_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AlertResolve(BaseModel):
    resolution_notes: Optional[str] = None


class AlertStats(BaseModel):
    total: int
    critical: int
    warning: int
    info: int
    unresolved: int
    resolved_today: int
