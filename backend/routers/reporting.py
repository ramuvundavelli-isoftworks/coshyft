"""
Reporting Router
GET  /reports, /reports/templates, /reports/{id}, /reports/{id}/download, /reports/regulatory-status
POST /reports/generate, /reports/csrd-export
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone

from database import get_session
from auth.dependencies import require_role
from models.user import User
from models.report import Report, ReportTemplate, CSRDSubmission
from schemas.report import (
    ReportGenerate, ReportRead, ReportTemplateRead,
    CSRDExportRequest, CSRDStatusRead, RegulatoryStatusRead,
)
from schemas.common import ApiResponse, PaginatedResponse

router = APIRouter(prefix="/reports", tags=["Reporting"])


@router.get("/", response_model=ApiResponse)
async def list_reports(
    report_type: str = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user=Depends(require_role("sustainability", "admin", "auditor")),
    session: AsyncSession = Depends(get_session),
):
    """List generated reports."""
    stmt = select(Report)
    if report_type:
        stmt = stmt.where(Report.report_type == report_type)

    total = (await session.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    stmt = stmt.order_by(Report.created_at.desc()).offset((page - 1) * page_size).limit(page_size)
    reports = (await session.execute(stmt)).scalars().all()

    return ApiResponse(success=True, data={
        "items": [ReportRead.model_validate(r).model_dump() for r in reports],
        "total": total,
        "page": page,
        "page_size": page_size,
    })


@router.get("/templates", response_model=ApiResponse)
async def list_templates(
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """List report templates."""
    templates = (await session.execute(select(ReportTemplate))).scalars().all()
    return ApiResponse(
        success=True,
        data=[ReportTemplateRead.model_validate(t).model_dump() for t in templates],
    )


@router.post("/generate", response_model=ApiResponse[ReportRead], status_code=201)
async def generate_report(
    data: ReportGenerate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Generate a new report."""
    report = Report(
        title=data.title,
        description=data.description,
        report_type=data.report_type,
        template_id=data.template_id,
        period_start=data.period_start,
        period_end=data.period_end,
        format=data.format,
        status="generating",
        parameters=data.parameters,
        generated_by=user.id,
    )
    session.add(report)
    await session.flush()

    # Simulate report generation (in production, this would be a background task)
    report.status = "ready"
    report.file_url = f"/reports/{report.id}/download"
    report.file_size_bytes = 1024000
    report.updated_at = datetime.now(timezone.utc)
    session.add(report)
    await session.flush()
    await session.refresh(report)

    return ApiResponse(success=True, data=ReportRead.model_validate(report))


@router.get("/{report_id}", response_model=ApiResponse[ReportRead])
async def get_report(
    report_id: str,
    user=Depends(require_role("sustainability", "auditor")),
    session: AsyncSession = Depends(get_session),
):
    """View a report."""
    report = (await session.execute(select(Report).where(Report.id == report_id))).scalar_one_or_none()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    return ApiResponse(success=True, data=ReportRead.model_validate(report))


@router.get("/{report_id}/download", response_model=ApiResponse)
async def download_report(
    report_id: str,
    user=Depends(require_role("sustainability", "auditor")),
    session: AsyncSession = Depends(get_session),
):
    """Download report file."""
    report = (await session.execute(select(Report).where(Report.id == report_id))).scalar_one_or_none()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")

    return ApiResponse(success=True, data={
        "report_id": report.id,
        "file_url": report.file_url,
        "format": report.format.value if hasattr(report.format, 'value') else report.format,
        "message": "In production, this would stream the file",
    })


@router.post("/csrd-export", response_model=ApiResponse[CSRDStatusRead])
async def export_csrd(
    data: CSRDExportRequest,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Export CSRD/ESRS E1 package."""
    # Check for existing submission
    existing = (await session.execute(
        select(CSRDSubmission).where(CSRDSubmission.reporting_year == data.reporting_year)
    )).scalar_one_or_none()

    if existing:
        existing.status = "in_progress"
        existing.updated_at = datetime.now(timezone.utc)
        session.add(existing)
        await session.flush()
        await session.refresh(existing)
        return ApiResponse(success=True, data=CSRDStatusRead.model_validate(existing))

    submission = CSRDSubmission(
        reporting_year=data.reporting_year,
        status="in_progress",
        completeness_score=78.5,
        data_quality_score=76.0,
        disclosures_completed=7,
        disclosures_total=9,
    )
    session.add(submission)
    await session.flush()
    await session.refresh(submission)

    return ApiResponse(success=True, data=CSRDStatusRead.model_validate(submission))


@router.get("/regulatory-status", response_model=ApiResponse)
async def get_regulatory_status(
    user=Depends(require_role("sustainability")),
):
    """Get regulatory filing status."""
    return ApiResponse(success=True, data=[
        RegulatoryStatusRead(
            framework="CSRD / ESRS E1",
            status="in_progress",
            deadline=datetime(2027, 6, 30, tzinfo=timezone.utc),
            completeness=78.5,
            gaps=["E1-9 Financial risk assessment incomplete", "Data quality below 80% threshold"],
            next_steps=["Complete E1-9 disclosure", "Improve data quality to 80%+", "Schedule external audit"],
        ).model_dump(),
        RegulatoryStatusRead(
            framework="EPA Climate Action Plan",
            status="compliant",
            deadline=datetime(2026, 12, 31, tzinfo=timezone.utc),
            completeness=92.0,
            gaps=["Annual reporting due Q4"],
            next_steps=["Submit annual report by December 31"],
        ).model_dump(),
    ])
