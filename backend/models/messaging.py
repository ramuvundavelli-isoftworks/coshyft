"""
Messaging Models
MessageThread, Message, ThreadParticipant
"""

import uuid
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum, JSON
import enum


class ThreadTypeEnum(str, enum.Enum):
    RIDE = "ride"
    DIRECT = "direct"
    GROUP = "group"


class MessageTypeEnum(str, enum.Enum):
    TEXT = "text"
    SYSTEM = "system"
    LOCATION = "location"
    IMAGE = "image"


class MessageThread(SQLModel, table=True):
    __tablename__ = "message_threads"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    type: ThreadTypeEnum = Field(
        sa_column=Column(SAEnum(ThreadTypeEnum), nullable=False)
    )
    title: str = Field(max_length=200)
    linked_ride_id: Optional[str] = Field(default=None, foreign_key="rides.id", max_length=36)
    is_pinned: bool = Field(default=False)
    last_message_at: Optional[datetime] = Field(default=None)
    last_message_preview: Optional[str] = Field(default=None, max_length=200)
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    updated_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class ThreadParticipant(SQLModel, table=True):
    __tablename__ = "thread_participants"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    thread_id: str = Field(foreign_key="message_threads.id", index=True, max_length=36)
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    role: Optional[str] = Field(default=None, max_length=20)  # "driver", "passenger", etc.
    is_online: bool = Field(default=False)
    last_seen: Optional[datetime] = Field(default=None)
    unread_count: int = Field(default=0)
    joined_at: datetime = Field(default_factory=lambda: datetime.utcnow())


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    thread_id: str = Field(foreign_key="message_threads.id", index=True, max_length=36)
    sender_id: str = Field(foreign_key="users.id", max_length=36)
    sender_name: str = Field(max_length=200)
    content: str = Field(max_length=2000)
    type: MessageTypeEnum = Field(
        sa_column=Column(SAEnum(MessageTypeEnum), nullable=False, default=MessageTypeEnum.TEXT)
    )
    is_read: bool = Field(default=False)
    reactions: Optional[list] = Field(default=None, sa_column=Column(JSON))
    message_metadata: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
