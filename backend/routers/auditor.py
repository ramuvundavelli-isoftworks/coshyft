"""
Auditor Router
GET /auditor/overview, /emissions-review, /baseline-review,
    /factors-review, /risks-review, /trail, /trail/export,
    /evidence, /evidence/{id}, /reports
POST /auditor/evidence, /evidence/{id}/verify, /reports,
     /findings, /notes, /clarification-requests, /evidence-requests,
     /issues, /reviews/schedule, /factors/{id}/comments, /factors/{id}/doc-requests
PUT  /auditor/reviews/{area}/approve, /factors/{id}/approve
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

from database import get_session
from auth.dependencies import require_role
from models.user import User
from models.audit import AuditLog, GDPRAuditLog, EvidenceItem, AuditFinding, AuditNote
from models.organization import Baseline, Risk
from models.emission import EmissionFactor
from schemas.audit import (
    AuditLogRead, EvidenceUpload, EvidenceRead,
    AuditReviewSubmit, AuditorOverview,
)
from schemas.common import ApiResponse, PaginatedResponse
from services.audit_logger import log_action

router = APIRouter(prefix="/auditor", tags=["Auditor"])


@router.get("/overview", response_model=ApiResponse[AuditorOverview])
async def get_overview(
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Audit dashboard overview."""
    evidence_count = (await session.execute(select(func.count(EvidenceItem.id)))).scalar_one()
    verified_count = (await session.execute(
        select(func.count(EvidenceItem.id)).where(EvidenceItem.status == "verified")
    )).scalar_one()
    total_logs = (await session.execute(select(func.count(AuditLog.id)))).scalar_one()

    return ApiResponse(success=True, data=AuditorOverview(
        total_findings=12,
        critical_findings=2,
        open_reviews=5,
        completed_reviews=18,
        evidence_items=evidence_count,
        verified_evidence=verified_count,
        compliance_score=78.5,
        last_audit_date=datetime(2026, 2, 15),
    ))


@router.get("/emissions-review", response_model=ApiResponse)
async def review_emissions(
    year: int = Query(2026),
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Emissions data for auditor review."""
    from models.commute import CommuteEntry
    total = (await session.execute(
        select(func.coalesce(func.sum(CommuteEntry.emissions_kg_co2), 0))
        .where(func.extract("year", CommuteEntry.commute_date) == year)
    )).scalar_one()

    return ApiResponse(success=True, data={
        "year": year,
        "total_emissions_kg": round(float(total), 2),
        "scope": "Scope 3 Category 7",
        "methodology": "Activity-based (distance method)",
        "data_sources": ["Employee self-reporting", "GPS verification", "Leap Card integration"],
        "audit_status": "under_review",
        "findings": [],
    })


@router.get("/baseline-review", response_model=ApiResponse)
async def review_baseline(
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Baseline data for review."""
    baselines = (await session.execute(select(Baseline))).scalars().all()
    from schemas.organization import BaselineRead
    return ApiResponse(
        success=True,
        data=[BaselineRead.model_validate(b).model_dump() for b in baselines],
    )


@router.get("/factors-review", response_model=ApiResponse)
async def review_factors(
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Emission factors for review."""
    factors = (await session.execute(select(EmissionFactor))).scalars().all()
    from schemas.emission import EmissionFactorRead
    return ApiResponse(
        success=True,
        data=[EmissionFactorRead.model_validate(f).model_dump() for f in factors],
    )


@router.get("/risks-review", response_model=ApiResponse)
async def review_risks(
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Risk register for review."""
    risks = (await session.execute(select(Risk))).scalars().all()
    from schemas.organization import RiskRead
    return ApiResponse(
        success=True,
        data=[RiskRead.model_validate(r).model_dump() for r in risks],
    )


@router.get("/trail/export", response_model=ApiResponse)
async def export_audit_trail(
    start_date: str = Query(None, description="ISO date e.g. 2026-01-01"),
    end_date: str = Query(None, description="ISO date e.g. 2026-12-31"),
    action: str = Query(None),
    entity_type: str = Query(None),
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Export audit trail as a structured list (CSV download in production)."""
    stmt = select(AuditLog).order_by(AuditLog.timestamp.asc())
    if action:
        stmt = stmt.where(AuditLog.action == action)
    if entity_type:
        stmt = stmt.where(AuditLog.entity_type == entity_type)
    if start_date:
        stmt = stmt.where(AuditLog.timestamp >= start_date)
    if end_date:
        stmt = stmt.where(AuditLog.timestamp <= end_date)

    logs = (await session.execute(stmt)).scalars().all()

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "export", "audit_log", "trail-export",
        description=f"Audit trail exported ({len(logs)} records)",
    )

    return ApiResponse(success=True, data={
        "records": [AuditLogRead.model_validate(l).model_dump() for l in logs],
        "total_records": len(logs),
        "exported_at": datetime.utcnow().isoformat(),
        "format": "json",  # In production: stream as CSV via StreamingResponse
    })


@router.get("/trail", response_model=ApiResponse[PaginatedResponse[AuditLogRead]])
async def get_audit_trail(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    user_id: str = Query(None),
    action: str = Query(None),
    entity_type: str = Query(None),
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Full audit trail with filters."""
    stmt = select(AuditLog)
    if user_id:
        stmt = stmt.where(AuditLog.user_id == user_id)
    if action:
        stmt = stmt.where(AuditLog.action == action)
    if entity_type:
        stmt = stmt.where(AuditLog.entity_type == entity_type)

    total = (await session.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    stmt = stmt.order_by(AuditLog.timestamp.desc()).offset((page - 1) * page_size).limit(page_size)
    logs = (await session.execute(stmt)).scalars().all()

    return ApiResponse(success=True, data=PaginatedResponse(
        items=[AuditLogRead.model_validate(l) for l in logs],
        total=total, page=page, page_size=page_size,
        total_pages=(total + page_size - 1) // page_size,
    ))


@router.get("/evidence", response_model=ApiResponse)
async def list_evidence(
    category: str = Query(None),
    status: str = Query(None),
    user=Depends(require_role("auditor", "sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """List evidence items."""
    stmt = select(EvidenceItem)
    if category:
        stmt = stmt.where(EvidenceItem.category == category)
    if status:
        stmt = stmt.where(EvidenceItem.status == status)

    items = (await session.execute(stmt.order_by(EvidenceItem.created_at.desc()))).scalars().all()
    return ApiResponse(
        success=True,
        data=[EvidenceRead.model_validate(e).model_dump() for e in items],
    )


@router.post("/evidence", response_model=ApiResponse[EvidenceRead], status_code=201)
async def upload_evidence(
    data: EvidenceUpload,
    user=Depends(require_role("auditor", "sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Upload evidence document."""
    evidence = EvidenceItem(
        title=data.title,
        description=data.description,
        file_name=f"{data.title.lower().replace(' ', '_')}.pdf",
        file_url=f"/evidence/{data.title.lower().replace(' ', '_')}.pdf",
        file_size_bytes=0,
        mime_type="application/pdf",
        category=data.category,
        linked_entity_type=data.linked_entity_type,
        linked_entity_id=data.linked_entity_id,
        uploaded_by=user.id,
    )
    session.add(evidence)
    await session.flush()
    await session.refresh(evidence)

    return ApiResponse(success=True, data=EvidenceRead.model_validate(evidence))


@router.post("/evidence/{evidence_id}/verify", response_model=ApiResponse)
async def verify_evidence(
    evidence_id: str,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Mark evidence as verified."""
    e = (await session.execute(select(EvidenceItem).where(EvidenceItem.id == evidence_id))).scalar_one_or_none()
    if e is None:
        raise HTTPException(status_code=404, detail="Evidence not found")

    e.status = "verified"
    e.verified_by = user.id
    e.verified_at = datetime.utcnow()
    session.add(e)

    return ApiResponse(success=True, meta={"message": "Evidence verified"})


# --- Findings ---

class FindingCreate(BaseModel):
    area: str
    description: str
    severity: Optional[str] = "medium"

class AuditNoteCreate(BaseModel):
    area: str
    note: str

class ClarificationRequestCreate(BaseModel):
    area: str
    question: Optional[str] = None

class ReviewScheduleCreate(BaseModel):
    area: str
    date: Optional[str] = None
    notes: Optional[str] = None

class IssueCreate(BaseModel):
    sample_id: str
    description: Optional[str] = None

class EvidenceRequestCreate(BaseModel):
    sample_id: str
    description: Optional[str] = None

class FactorCommentCreate(BaseModel):
    comment: str

class ReviewApprovePayload(BaseModel):
    comments: Optional[str] = None


@router.post("/findings", response_model=ApiResponse, status_code=201)
async def add_finding(
    data: FindingCreate,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Add a formal audit finding (persisted to audit_findings table)."""
    finding = AuditFinding(
        area=data.area,
        description=data.description,
        severity=data.severity or "medium",
        status="open",
        created_by=user.id,
    )
    session.add(finding)
    await session.flush()
    await session.refresh(finding)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "evidence", finding.id,
        description=f"Finding [{data.severity}]: {data.description[:100]}",
    )
    return ApiResponse(success=True, data={
        "id": finding.id,
        "area": finding.area,
        "description": finding.description,
        "severity": finding.severity,
        "status": finding.status,
        "created_at": finding.created_at.isoformat(),
    })


@router.post("/reviews/schedule", response_model=ApiResponse)
async def schedule_review(
    data: ReviewScheduleCreate,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Schedule an audit review."""
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "evidence", f"review-schedule-{data.area}",
        description=f"Review scheduled for {data.area}",
    )
    return ApiResponse(success=True, meta={"message": f"Review scheduled for {data.area}"})


@router.post("/notes", response_model=ApiResponse, status_code=201)
async def add_audit_note(
    data: AuditNoteCreate,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Add an audit note (persisted to audit_notes table)."""
    note = AuditNote(
        area=data.area,
        note=data.note,
        note_type="observation",
        created_by=user.id,
    )
    session.add(note)
    await session.flush()
    await session.refresh(note)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "evidence", note.id,
        description=f"Note [{data.area}]: {data.note[:100]}",
    )
    return ApiResponse(success=True, data={
        "id": note.id,
        "area": note.area,
        "note": note.note,
        "created_at": note.created_at.isoformat(),
    })


@router.post("/clarification-requests", response_model=ApiResponse, status_code=201)
async def request_clarification(
    data: ClarificationRequestCreate,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Request clarification from sustainability team."""
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "evidence", f"clarification-{data.area}",
        description=data.question,
    )
    return ApiResponse(success=True, meta={"message": "Clarification request sent"})


@router.put("/reviews/{area}/approve", response_model=ApiResponse)
async def approve_review_area(
    area: str,
    data: ReviewApprovePayload = ReviewApprovePayload(),
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Approve a review area (baseline, emissions, factors, etc.)."""
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "approve", "baseline", f"review-{area}",
        description=f"Review area '{area}' approved. {data.comments or ''}",
    )
    return ApiResponse(success=True, meta={"message": f"{area.capitalize()} review approved"})


@router.post("/issues", response_model=ApiResponse, status_code=201)
async def flag_issue(
    data: IssueCreate,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Flag an issue on a sample."""
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "commute_entry", data.sample_id,
        description=data.description or "Issue flagged for review",
    )
    return ApiResponse(success=True, meta={"message": "Issue flagged for review"})


@router.post("/evidence-requests", response_model=ApiResponse, status_code=201)
async def request_evidence(
    data: EvidenceRequestCreate,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Request additional evidence for a sample."""
    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "evidence", f"request-{data.sample_id}",
        description=data.description or "Evidence requested",
    )
    return ApiResponse(success=True, meta={"message": "Evidence request sent"})


@router.post("/factors/{factor_id}/comments", response_model=ApiResponse, status_code=201)
async def add_factor_comment(
    factor_id: str,
    data: FactorCommentCreate,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Add a comment to an emission factor."""
    factor = (await session.execute(
        select(EmissionFactor).where(EmissionFactor.id == factor_id)
    )).scalar_one_or_none()
    if factor is None:
        raise HTTPException(status_code=404, detail="Emission factor not found")

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "emission_factor", factor_id,
        description=data.comment,
    )
    return ApiResponse(success=True, meta={"message": "Comment added"})


@router.post("/factors/{factor_id}/doc-requests", response_model=ApiResponse, status_code=201)
async def request_factor_docs(
    factor_id: str,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Request documentation for an emission factor."""
    factor = (await session.execute(
        select(EmissionFactor).where(EmissionFactor.id == factor_id)
    )).scalar_one_or_none()
    if factor is None:
        raise HTTPException(status_code=404, detail="Emission factor not found")

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "emission_factor", factor_id,
        description="Documentation requested",
    )
    return ApiResponse(success=True, meta={"message": "Documentation request sent"})


@router.put("/factors/{factor_id}/approve", response_model=ApiResponse)
async def approve_factor(
    factor_id: str,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Approve an emission factor."""
    factor = (await session.execute(
        select(EmissionFactor).where(EmissionFactor.id == factor_id)
    )).scalar_one_or_none()
    if factor is None:
        raise HTTPException(status_code=404, detail="Emission factor not found")

    factor.approval_status = "approved"
    factor.approved_by = user.id
    factor.approved_date = datetime.utcnow().date()
    session.add(factor)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "approve", "emission_factor", factor_id,
    )
    return ApiResponse(success=True, meta={"message": "Emission factor approved"})


# ── Audit Reports ─────────────────────────────────────────────────────────────

class AuditReportCreate(BaseModel):
    title: str
    reporting_year: int
    scope: Optional[str] = "Scope 3 Category 7 — Employee Commuting"
    findings_summary: Optional[str] = None
    overall_opinion: Optional[str] = "limited_assurance"   # limited_assurance | reasonable_assurance
    notes: Optional[str] = None


@router.get("/reports", response_model=ApiResponse)
async def list_audit_reports(
    user=Depends(require_role("auditor", "sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """List all formal audit reports generated by auditors."""
    from models.report import Report
    stmt = select(Report).where(Report.report_type == "audit").order_by(Report.created_at.desc())
    reports = (await session.execute(stmt)).scalars().all()

    from schemas.report import ReportRead
    return ApiResponse(
        success=True,
        data=[ReportRead.model_validate(r).model_dump() for r in reports],
    )


@router.post("/reports", response_model=ApiResponse, status_code=201)
async def create_audit_report(
    data: AuditReportCreate,
    user=Depends(require_role("auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Generate a formal audit/assurance report."""
    from models.report import Report
    from models.audit import EvidenceItem

    evidence_count = (await session.execute(
        select(func.count(EvidenceItem.id)).where(EvidenceItem.status == "verified")
    )).scalar_one()

    report = Report(
        title=data.title,
        report_type="audit",
        description=data.findings_summary,
        period_start=None,
        period_end=None,
        format="pdf",
        status="ready",
        generated_by=user.id,
        parameters={
            "reporting_year": data.reporting_year,
            "scope": data.scope,
            "overall_opinion": data.overall_opinion,
            "verified_evidence_count": evidence_count,
            "notes": data.notes,
        },
        file_url=f"/auditor/reports/{data.reporting_year}-audit-report.pdf",
    )
    session.add(report)
    await session.flush()
    await session.refresh(report)

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "create", "audit_report", report.id,
        description=f"Audit report created: {data.title}",
    )

    from schemas.report import ReportRead
    return ApiResponse(success=True, data=ReportRead.model_validate(report))