"""
Audit Models
AuditLog, GDPRAuditLog, EvidenceItem
Maps to TypeScript: GDPRAuditLog
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum, JSON
import enum


class AuditActionEnum(str, enum.Enum):
    VIEW = "view"
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    EXPORT = "export"
    APPROVE = "approve"
    REJECT = "reject"
    CONSENT_GIVEN = "consent_given"
    CONSENT_WITHDRAWN = "consent_withdrawn"
    LOGIN = "login"
    LOGOUT = "logout"


class EntityTypeEnum(str, enum.Enum):
    EMISSION_FACTOR = "emission_factor"
    BASELINE = "baseline"
    COMMUTE_ENTRY = "commute_entry"
    PERSONAL_DATA = "personal_data"
    REPORT = "report"
    USER_PROFILE = "user_profile"
    RIDE = "ride"
    INITIATIVE = "initiative"
    POLICY = "policy"
    SCENARIO = "scenario"
    RISK = "risk"
    EVIDENCE = "evidence"


class EvidenceStatusEnum(str, enum.Enum):
    UPLOADED = "uploaded"
    UNDER_REVIEW = "under_review"
    VERIFIED = "verified"
    REJECTED = "rejected"


class AuditLog(SQLModel, table=True):
    """General audit log for all system actions."""

    __tablename__ = "audit_logs"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    user_role: str = Field(max_length=20)
    action: AuditActionEnum = Field(
        sa_column=Column(SAEnum(AuditActionEnum), nullable=False)
    )
    entity_type: EntityTypeEnum = Field(
        sa_column=Column(SAEnum(EntityTypeEnum), nullable=False)
    )
    entity_id: str = Field(max_length=36)
    description: Optional[str] = Field(default=None, max_length=500)
    changes: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    ip_address: Optional[str] = Field(default=None, max_length=45)
    user_agent: Optional[str] = Field(default=None, max_length=500)


class GDPRAuditLog(SQLModel, table=True):
    """GDPR-specific audit log with legal basis tracking."""

    __tablename__ = "gdpr_audit_logs"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), index=True)
    user_id: str = Field(foreign_key="users.id", index=True, max_length=36)
    user_role: str = Field(max_length=20)
    action: AuditActionEnum = Field(
        sa_column=Column(SAEnum(AuditActionEnum), nullable=False)
    )
    entity_type: EntityTypeEnum = Field(
        sa_column=Column(SAEnum(EntityTypeEnum), nullable=False)
    )
    entity_id: str = Field(max_length=36)
    changes: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    ip_address: Optional[str] = Field(default=None, max_length=45)
    gdpr_basis: Optional[str] = Field(default=None, max_length=30)
    data_retention_date: Optional[datetime] = Field(default=None)
    region: Optional[str] = Field(default=None, max_length=5)


class EvidenceItem(SQLModel, table=True):
    """Evidence documents for auditor review."""

    __tablename__ = "evidence_items"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    title: str = Field(max_length=300)
    description: Optional[str] = Field(default=None, max_length=1000)
    file_name: str = Field(max_length=300)
    file_url: str = Field(max_length=1000)
    file_size_bytes: int = Field(default=0)
    mime_type: str = Field(max_length=100)
    category: str = Field(max_length=50)
    linked_entity_type: Optional[EntityTypeEnum] = Field(
        sa_column=Column(SAEnum(EntityTypeEnum), nullable=True)
    )
    linked_entity_id: Optional[str] = Field(default=None, max_length=36)
    status: EvidenceStatusEnum = Field(
        sa_column=Column(SAEnum(EvidenceStatusEnum), nullable=False, default=EvidenceStatusEnum.UPLOADED)
    )
    uploaded_by: str = Field(foreign_key="users.id", max_length=36)
    verified_by: Optional[str] = Field(default=None, foreign_key="users.id", max_length=36)
    verified_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FindingSeverityEnum(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class FindingStatusEnum(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class AuditFinding(SQLModel, table=True):
    """Audit findings recorded during reviews."""

    __tablename__ = "audit_findings"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    area: str = Field(max_length=100)
    description: str = Field(max_length=2000)
    severity: FindingSeverityEnum = Field(
        sa_column=Column(SAEnum(FindingSeverityEnum), nullable=False, default=FindingSeverityEnum.MEDIUM)
    )
    status: FindingStatusEnum = Field(
        sa_column=Column(SAEnum(FindingStatusEnum), nullable=False, default=FindingStatusEnum.OPEN)
    )
    linked_entity_type: Optional[str] = Field(default=None, max_length=50)
    linked_entity_id: Optional[str] = Field(default=None, max_length=36)
    resolution: Optional[str] = Field(default=None, max_length=2000)
    created_by: str = Field(foreign_key="users.id", max_length=36)
    assigned_to: Optional[str] = Field(default=None, foreign_key="users.id", max_length=36)
    resolved_at: Optional[datetime] = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AuditNote(SQLModel, table=True):
    """Audit notes and observations made during reviews."""

    __tablename__ = "audit_notes"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    area: str = Field(max_length=100)
    note: str = Field(max_length=4000)
    note_type: str = Field(default="observation", max_length=50)  # observation, clarification, comment
    linked_entity_type: Optional[str] = Field(default=None, max_length=50)
    linked_entity_id: Optional[str] = Field(default=None, max_length=36)
    created_by: str = Field(foreign_key="users.id", max_length=36)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))