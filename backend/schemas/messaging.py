"""
Messaging Schemas
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class ThreadCreate(BaseModel):
    type: str  # "ride", "direct", "group"
    title: str
    participant_ids: List[str]
    linked_ride_id: Optional[str] = None


class ThreadRead(BaseModel):
    id: str
    type: str
    title: str
    linked_ride_id: Optional[str] = None
    is_pinned: bool
    last_message_at: Optional[datetime] = None
    last_message_preview: Optional[str] = None
    unread_count: int = 0
    participants: List[dict] = []
    created_at: datetime

    class Config:
        from_attributes = True


class MessageSend(BaseModel):
    content: str
    type: str = "text"
    metadata: Optional[dict] = None


class MessageRead(BaseModel):
    id: str
    thread_id: str
    sender_id: str
    sender_name: str
    content: str
    type: str
    is_read: bool
    reactions: Optional[list] = None
    created_at: datetime

    class Config:
        from_attributes = True
