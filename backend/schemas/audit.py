"""
Audit Schemas
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class AuditLogRead(BaseModel):
    id: str
    timestamp: datetime
    user_id: str
    user_role: str
    action: str
    entity_type: str
    entity_id: str
    description: Optional[str] = None
    changes: Optional[dict] = None
    ip_address: Optional[str] = None

    class Config:
        from_attributes = True


class GDPRAuditLogRead(BaseModel):
    id: str
    timestamp: datetime
    user_id: str
    user_role: str
    action: str
    entity_type: str
    entity_id: str
    changes: Optional[dict] = None
    ip_address: Optional[str] = None
    gdpr_basis: Optional[str] = None
    data_retention_date: Optional[datetime] = None
    region: Optional[str] = None

    class Config:
        from_attributes = True


class AuditTrailFilter(BaseModel):
    user_id: Optional[str] = None
    action: Optional[str] = None
    entity_type: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class EvidenceUpload(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    linked_entity_type: Optional[str] = None
    linked_entity_id: Optional[str] = None


class EvidenceRead(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    file_name: str
    file_url: str
    file_size_bytes: int
    mime_type: str
    category: str
    linked_entity_type: Optional[str] = None
    linked_entity_id: Optional[str] = None
    status: str
    uploaded_by: str
    verified_by: Optional[str] = None
    verified_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AuditReviewSubmit(BaseModel):
    entity_type: str
    entity_id: str
    finding: str  # "compliant", "non_compliant", "observation"
    comments: str
    severity: Optional[str] = None  # "low", "medium", "high"
    recommendations: Optional[List[str]] = None


class AuditorOverview(BaseModel):
    total_findings: int
    critical_findings: int
    open_reviews: int
    completed_reviews: int
    evidence_items: int
    verified_evidence: int
    compliance_score: float
    last_audit_date: Optional[datetime] = None
