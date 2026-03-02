"""
Report Schemas
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class ReportGenerate(BaseModel):
    title: str
    description: Optional[str] = None
    report_type: str  # "emissions", "compliance", "csrd", "custom"
    template_id: Optional[str] = None
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    format: str = "pdf"
    parameters: Optional[dict] = None


class ReportRead(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    report_type: str
    period_start: Optional[datetime] = None
    period_end: Optional[datetime] = None
    format: str
    status: str
    file_url: Optional[str] = None
    file_size_bytes: Optional[int] = None
    generated_by: str
    approved_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReportTemplateRead(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    report_type: str
    sections: Optional[list] = None
    is_system: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CSRDExportRequest(BaseModel):
    reporting_year: int
    format: str = "xbrl"
    include_evidence: bool = True


class CSRDStatusRead(BaseModel):
    id: str
    reporting_year: int
    status: str
    completeness_score: float
    data_quality_score: float
    disclosures_completed: int
    disclosures_total: int
    submitted_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RegulatoryStatusRead(BaseModel):
    framework: str
    status: str
    deadline: Optional[datetime] = None
    completeness: float
    gaps: List[str]
    next_steps: List[str]
