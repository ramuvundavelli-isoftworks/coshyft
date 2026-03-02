"""
Report Models
Report, ReportTemplate, CSRDSubmission
"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Enum as SAEnum, JSON
import enum


class ReportStatusEnum(str, enum.Enum):
    DRAFT = "draft"
    GENERATING = "generating"
    READY = "ready"
    APPROVED = "approved"
    SUBMITTED = "submitted"
    FAILED = "failed"


class ReportFormatEnum(str, enum.Enum):
    PDF = "pdf"
    EXCEL = "excel"
    CSV = "csv"
    JSON = "json"
    XBRL = "xbrl"


class CSRDStatusEnum(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    SUBMITTED = "submitted"


class Report(SQLModel, table=True):
    __tablename__ = "reports"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    title: str = Field(max_length=300)
    description: Optional[str] = Field(default=None, max_length=1000)
    report_type: str = Field(max_length=50)  # "emissions", "compliance", "csrd", "custom"
    template_id: Optional[str] = Field(default=None, max_length=36)
    period_start: Optional[datetime] = Field(default=None)
    period_end: Optional[datetime] = Field(default=None)
    format: ReportFormatEnum = Field(
        sa_column=Column(SAEnum(ReportFormatEnum), nullable=False, default=ReportFormatEnum.PDF)
    )
    status: ReportStatusEnum = Field(
        sa_column=Column(SAEnum(ReportStatusEnum), nullable=False, default=ReportStatusEnum.DRAFT)
    )
    file_url: Optional[str] = Field(default=None, max_length=1000)
    file_size_bytes: Optional[int] = Field(default=None)
    parameters: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    generated_by: str = Field(foreign_key="users.id", max_length=36)
    approved_by: Optional[str] = Field(default=None, max_length=36)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ReportTemplate(SQLModel, table=True):
    __tablename__ = "report_templates"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    name: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=500)
    report_type: str = Field(max_length=50)
    sections: Optional[list] = Field(default=None, sa_column=Column(JSON))
    default_parameters: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    is_system: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CSRDSubmission(SQLModel, table=True):
    __tablename__ = "csrd_submissions"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        max_length=36,
    )
    tenant_id: Optional[str] = Field(default=None, foreign_key="tenants.id", max_length=36)
    reporting_year: int
    status: CSRDStatusEnum = Field(
        sa_column=Column(SAEnum(CSRDStatusEnum), nullable=False, default=CSRDStatusEnum.NOT_STARTED)
    )
    esrs_e1_data: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    completeness_score: float = Field(default=0)
    data_quality_score: float = Field(default=0)
    disclosures_completed: int = Field(default=0)
    disclosures_total: int = Field(default=0)
    report_id: Optional[str] = Field(default=None, foreign_key="reports.id", max_length=36)
    submitted_at: Optional[datetime] = Field(default=None)
    submitted_by: Optional[str] = Field(default=None, foreign_key="users.id", max_length=36)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
