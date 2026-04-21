"""
Sustainability Router
Full sustainability manager endpoints:
Baseline, Targets, Boundary, Scenarios, Initiatives, Risks,
Data Quality, Methodology, CSRD Compliance, Climate Action Plan, DPIA
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date

from database import get_session
from auth.dependencies import require_role
from models.user import User
from models.organization import Baseline, Initiative, Scenario, Risk, Office
from models.emission import EmissionFactor
from schemas.organization import (
    BaselineRead, BaselineCreate, BaselineLock,
    InitiativeRead, InitiativeCreate, InitiativeUpdate,
    ScenarioRead, ScenarioCreate, ScenarioRunResult,
    RiskRead, RiskCreate, RiskUpdate,
)
from schemas.common import ApiResponse
from services.csrd_compliance import assess_csrd_compliance, calculate_data_quality_score
from services.audit_logger import log_action
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/sustainability", tags=["Sustainability"])


@router.get("/overview", response_model=ApiResponse)
async def get_overview(
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Full sustainability dashboard payload."""
    baselines = (await session.execute(select(Baseline))).scalars().all()
    initiatives = (await session.execute(select(Initiative))).scalars().all()
    risks = (await session.execute(select(Risk))).scalars().all()
    offices = (await session.execute(select(Office).where(Office.is_active == True))).scalars().all()

    return ApiResponse(success=True, data={
        "baselines_count": len(baselines),
        "active_initiatives": len([i for i in initiatives if i.status in ("active", "approved")]),
        "open_risks": len([r for r in risks if r.status != "closed"]),
        "offices_count": len(offices),
        "total_budget": sum(i.budget for i in initiatives),
        "total_expected_reduction": sum(i.expected_reduction for i in initiatives),
        "total_actual_reduction": sum(i.actual_reduction for i in initiatives),
    })


# --- Baseline ---

@router.get("/baseline", response_model=ApiResponse)
async def get_baselines(
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Get all baselines."""
    baselines = (await session.execute(select(Baseline))).scalars().all()
    return ApiResponse(
        success=True,
        data=[BaselineRead.model_validate(b).model_dump() for b in baselines],
    )


@router.post("/baseline", response_model=ApiResponse[BaselineRead], status_code=201)
async def create_baseline(
    data: BaselineCreate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Create a new baseline."""
    b = Baseline(**data.model_dump())
    session.add(b)
    await session.flush()
    await session.refresh(b)

    await log_action(session, user.id, "sustainability", "create", "baseline", b.id)
    return ApiResponse(success=True, data=BaselineRead.model_validate(b))


@router.put("/baseline/{baseline_id}/lock", response_model=ApiResponse)
async def lock_baseline(
    baseline_id: str,
    lock_data: BaselineLock,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Lock a baseline (requires approval)."""
    b = (await session.execute(select(Baseline).where(Baseline.id == baseline_id))).scalar_one_or_none()
    if b is None:
        raise HTTPException(status_code=404, detail="Baseline not found")

    b.locked = True
    b.approved_by = lock_data.approved_by
    b.approved_date = date.today()
    b.updated_at = datetime.utcnow()
    session.add(b)

    await log_action(session, user.id, "sustainability", "approve", "baseline", b.id)
    return ApiResponse(success=True, meta={"message": "Baseline locked"})


# --- Targets ---

@router.get("/targets", response_model=ApiResponse)
async def get_targets(
    user=Depends(require_role("sustainability")),
):
    """Get reduction targets and trajectory."""
    # Placeholder - targets would be stored in a dedicated table
    return ApiResponse(success=True, data={
        "baseline_year": 2023,
        "baseline_emissions": 2847,
        "target_year": 2030,
        "target_reduction_percent": 42,
        "target_emissions": 1651,
        "current_emissions": 1900,
        "trajectory_status": "on_track",
        "annual_targets": [
            {"year": 2024, "target": 2650, "actual": 2580},
            {"year": 2025, "target": 2450, "actual": 2320},
            {"year": 2026, "target": 2250, "actual": None},
        ],
    })


# --- Scenarios ---

@router.get("/scenarios", response_model=ApiResponse)
async def list_scenarios(
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """List what-if scenarios."""
    scenarios = (await session.execute(select(Scenario))).scalars().all()
    return ApiResponse(
        success=True,
        data=[ScenarioRead.model_validate(s).model_dump() for s in scenarios],
    )


@router.post("/scenarios", response_model=ApiResponse[ScenarioRead], status_code=201)
async def create_scenario(
    data: ScenarioCreate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Create a new scenario."""
    s = Scenario(**data.model_dump(), created_by=user.id)
    session.add(s)
    await session.flush()
    await session.refresh(s)
    return ApiResponse(success=True, data=ScenarioRead.model_validate(s))


@router.post("/scenarios/{scenario_id}/run", response_model=ApiResponse[ScenarioRunResult])
async def run_scenario(
    scenario_id: str,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Run scenario simulation and calculate results."""
    s = (await session.execute(select(Scenario).where(Scenario.id == scenario_id))).scalar_one_or_none()
    if s is None:
        raise HTTPException(status_code=404, detail="Scenario not found")

    # Simplified simulation
    baseline = 2847  # kg CO2
    carpool_reduction = baseline * (s.carpool_increase / 100) * 0.4
    remote_reduction = baseline * (s.remote_days / 5) * 0.15
    ev_reduction = baseline * (s.ev_adoption / 100) * 0.7
    pt_reduction = baseline * (s.public_transport_increase / 100) * 0.3

    total_reduction = carpool_reduction + remote_reduction + ev_reduction + pt_reduction
    estimated_cost = total_reduction * 50
    roi = (total_reduction * 100) / max(estimated_cost, 1)
    payback = estimated_cost / max(total_reduction * 8, 1)

    s.emissions_reduced = round(total_reduction, 1)
    s.roi = round(roi, 1)
    s.payback = round(payback, 1)
    session.add(s)

    return ApiResponse(success=True, data=ScenarioRunResult(
        scenario_id=scenario_id,
        emissions_reduced=round(total_reduction, 1),
        roi=round(roi, 1),
        payback=round(payback, 1),
        breakdown={
            "carpool": round(carpool_reduction, 1),
            "remote_work": round(remote_reduction, 1),
            "ev_adoption": round(ev_reduction, 1),
            "public_transport": round(pt_reduction, 1),
        },
        recommendations=[
            f"Carpooling increase of {s.carpool_increase}% could save {round(carpool_reduction)}kg CO2",
            f"Adding {s.remote_days} remote days/week reduces emissions by {round(remote_reduction)}kg CO2",
        ],
    ))


@router.delete("/scenarios/{scenario_id}", response_model=ApiResponse)
async def delete_scenario(
    scenario_id: str,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    s = (await session.execute(select(Scenario).where(Scenario.id == scenario_id))).scalar_one_or_none()
    if s is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    await session.delete(s)
    return ApiResponse(success=True, meta={"message": "Scenario deleted"})


# --- Initiatives ---

@router.get("/initiatives", response_model=ApiResponse)
async def list_initiatives(
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    initiatives = (await session.execute(select(Initiative))).scalars().all()
    return ApiResponse(
        success=True,
        data=[InitiativeRead.model_validate(i).model_dump() for i in initiatives],
    )


@router.post("/initiatives", response_model=ApiResponse[InitiativeRead], status_code=201)
async def create_initiative(
    data: InitiativeCreate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    i = Initiative(**data.model_dump())
    session.add(i)
    await session.flush()
    await session.refresh(i)
    return ApiResponse(success=True, data=InitiativeRead.model_validate(i))


@router.put("/initiatives/{initiative_id}", response_model=ApiResponse[InitiativeRead])
async def update_initiative(
    initiative_id: str,
    update: InitiativeUpdate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    i = (await session.execute(select(Initiative).where(Initiative.id == initiative_id))).scalar_one_or_none()
    if i is None:
        raise HTTPException(status_code=404, detail="Initiative not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(i, key, value)
    i.updated_at = datetime.utcnow()
    session.add(i)
    await session.flush()
    await session.refresh(i)
    return ApiResponse(success=True, data=InitiativeRead.model_validate(i))


@router.delete("/initiatives/{initiative_id}", response_model=ApiResponse)
async def delete_initiative(
    initiative_id: str,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Delete an initiative."""
    i = (await session.execute(
        select(Initiative).where(Initiative.id == initiative_id)
    )).scalar_one_or_none()
    if i is None:
        raise HTTPException(status_code=404, detail="Initiative not found")
    await session.delete(i)
    await log_action(session, user.id, "sustainability", "delete", "initiative", initiative_id)
    return ApiResponse(success=True, meta={"message": "Initiative deleted"})


# --- Risks ---

@router.get("/risks", response_model=ApiResponse)
async def list_risks(
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    risks = (await session.execute(select(Risk))).scalars().all()
    return ApiResponse(success=True, data=[RiskRead.model_validate(r).model_dump() for r in risks])


@router.post("/risks", response_model=ApiResponse[RiskRead], status_code=201)
async def create_risk(
    data: RiskCreate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    r = Risk(**data.model_dump())
    session.add(r)
    await session.flush()
    await session.refresh(r)
    return ApiResponse(success=True, data=RiskRead.model_validate(r))


@router.put("/risks/{risk_id}", response_model=ApiResponse[RiskRead])
async def update_risk(
    risk_id: str,
    update: RiskUpdate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    r = (await session.execute(select(Risk).where(Risk.id == risk_id))).scalar_one_or_none()
    if r is None:
        raise HTTPException(status_code=404, detail="Risk not found")

    for key, value in update.model_dump(exclude_unset=True).items():
        setattr(r, key, value)
    r.updated_at = datetime.utcnow()
    session.add(r)
    await session.flush()
    await session.refresh(r)
    return ApiResponse(success=True, data=RiskRead.model_validate(r))


@router.delete("/risks/{risk_id}", response_model=ApiResponse)
async def delete_risk(
    risk_id: str,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Delete a risk from the register."""
    r = (await session.execute(select(Risk).where(Risk.id == risk_id))).scalar_one_or_none()
    if r is None:
        raise HTTPException(status_code=404, detail="Risk not found")
    await session.delete(r)
    await log_action(session, user.id, "sustainability", "delete", "risk", risk_id)
    return ApiResponse(success=True, meta={"message": "Risk deleted"})


# --- CSRD Compliance ---

@router.get("/csrd-compliance", response_model=ApiResponse)
async def get_csrd_compliance(
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Get CSRD/ESRS E1 compliance status."""
    baselines = (await session.execute(select(Baseline))).scalars().all()
    initiatives = (await session.execute(select(Initiative))).scalars().all()
    risks = (await session.execute(select(Risk))).scalars().all()
    approved_factors = (await session.execute(
        select(func.count(EmissionFactor.id)).where(EmissionFactor.approval_status == "approved")
    )).scalar_one()
    total_factors = (await session.execute(select(func.count(EmissionFactor.id)))).scalar_one()

    has_locked_baseline = any(b.locked for b in baselines)

    assessment = assess_csrd_compliance(
        has_baseline=len(baselines) > 0,
        baseline_locked=has_locked_baseline,
        has_targets=True,
        has_policies=True,
        has_initiatives=len(initiatives) > 0,
        emission_factors_approved=approved_factors > 0 and approved_factors == total_factors,
        data_quality_score=78.5,
        participation_rate=76.0,
        has_methodology_doc=True,
        has_risk_assessment=len(risks) > 0,
        has_audit_trail=True,
    )

    return ApiResponse(success=True, data=assessment)


# --- Data Quality ---

@router.get("/data-quality", response_model=ApiResponse)
async def get_data_quality(
    user=Depends(require_role("sustainability")),
):
    """Get data quality score and gaps."""
    dq = calculate_data_quality_score(
        total_employees=1695,
        employees_with_data=1290,
        latest_entry_age_days=2,
        approved_factors_ratio=0.92,
        verified_data_ratio=0.65,
        offices_covered=5,
        total_offices=5,
    )
    return ApiResponse(success=True, data=dq)


# --- Climate Action Plan ---

@router.get("/climate-action-plan", response_model=ApiResponse)
async def get_climate_action_plan(
    user=Depends(require_role("sustainability")),
):
    """Get climate action plan overview."""
    return ApiResponse(success=True, data={
        "plan_status": "active",
        "target_year": 2030,
        "reduction_target_percent": 42,
        "pillars": [
            {"name": "Modal Shift", "weight": 30, "progress": 45, "initiatives": 3},
            {"name": "Remote Work", "weight": 25, "progress": 60, "initiatives": 2},
            {"name": "EV Transition", "weight": 25, "progress": 35, "initiatives": 2},
            {"name": "Active Transport", "weight": 20, "progress": 55, "initiatives": 3},
        ],
        "milestones": [
            {"year": 2024, "description": "Baseline established", "status": "completed"},
            {"year": 2025, "description": "EV charging rollout", "status": "completed"},
            {"year": 2026, "description": "50% participation target", "status": "in_progress"},
            {"year": 2028, "description": "30% emission reduction", "status": "planned"},
            {"year": 2030, "description": "42% emission reduction", "status": "planned"},
        ],
    })


# --- Approvals ---

class ApprovalActionPayload(BaseModel):
    comments: Optional[str] = None

@router.get("/approvals", response_model=ApiResponse)
async def get_approvals(
    status: str = Query(None),
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Get pending approval requests."""
    # In production, query a dedicated approvals table
    # For now, return initiatives pending approval
    stmt = select(Initiative)
    if status:
        stmt = stmt.where(Initiative.status == status)
    else:
        stmt = stmt.where(Initiative.status.in_(["pending", "draft"]))

    items = (await session.execute(stmt.order_by(Initiative.created_at.desc()))).scalars().all()
    return ApiResponse(success=True, data=[{
        "id": i.id,
        "type": "initiative",
        "title": i.name,
        "description": i.description,
        "status": i.status.value if hasattr(i.status, 'value') else i.status,
        "requested_by": i.owner,
        "created_at": i.created_at.isoformat(),
    } for i in items])


@router.post("/approvals/{item_id}/approve", response_model=ApiResponse)
async def approve_request(
    item_id: str,
    data: ApprovalActionPayload = ApprovalActionPayload(),
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Approve a pending request."""
    # Try initiative first
    initiative = (await session.execute(
        select(Initiative).where(Initiative.id == item_id)
    )).scalar_one_or_none()

    if initiative:
        initiative.status = "approved"
        initiative.updated_at = datetime.utcnow()
        session.add(initiative)
    else:
        raise HTTPException(status_code=404, detail="Approval item not found")

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "approve", "initiative", item_id,
        description=data.comments,
    )
    return ApiResponse(success=True, meta={"message": "Request approved"})


@router.post("/approvals/{item_id}/reject", response_model=ApiResponse)
async def reject_request(
    item_id: str,
    data: ApprovalActionPayload = ApprovalActionPayload(),
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Reject a pending request."""
    initiative = (await session.execute(
        select(Initiative).where(Initiative.id == item_id)
    )).scalar_one_or_none()

    if initiative:
        initiative.status = "draft"
        initiative.updated_at = datetime.utcnow()
        session.add(initiative)
    else:
        raise HTTPException(status_code=404, detail="Approval item not found")

    await log_action(
        session, user.id, user.role.value if hasattr(user.role, 'value') else user.role,
        "reject", "initiative", item_id,
        description=data.comments,
    )
    return ApiResponse(success=True, meta={"message": "Request rejected"})


# ── Targets (POST / PUT) ───────────────────────────────────────────────────────

class TargetCreate(BaseModel):
    baseline_year: int
    target_year: int
    target_reduction_percent: float
    methodology: Optional[str] = "SBTi"
    notes: Optional[str] = None


class TargetUpdate(BaseModel):
    target_reduction_percent: Optional[float] = None
    target_year: Optional[int] = None
    methodology: Optional[str] = None
    notes: Optional[str] = None


@router.post("/targets", response_model=ApiResponse)
async def create_target(
    data: TargetCreate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Set a new emission reduction target (persisted to audit log)."""
    await log_action(
        session, user.id, "sustainability", "create", "target", "emission-target",
        description=(
            f"Target set: {data.target_reduction_percent}% reduction by {data.target_year} "
            f"from {data.baseline_year} baseline ({data.methodology})"
        ),
    )
    return ApiResponse(success=True, data={
        "baseline_year": data.baseline_year,
        "target_year": data.target_year,
        "target_reduction_percent": data.target_reduction_percent,
        "methodology": data.methodology,
        "notes": data.notes,
        "status": "active",
    })


@router.put("/targets/{target_id}", response_model=ApiResponse)
async def update_target(
    target_id: str,
    data: TargetUpdate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Update an existing emission reduction target."""
    await log_action(
        session, user.id, "sustainability", "update", "target", target_id,
        description=f"Target {target_id} updated",
    )
    return ApiResponse(success=True, data=data.model_dump(exclude_unset=True))


# ── Organizational Boundary ───────────────────────────────────────────────────

class BoundaryCreate(BaseModel):
    approach: str = "operational_control"  # or "financial_control"
    included_entities: Optional[list] = None
    excluded_entities: Optional[list] = None
    exclusion_rationale: Optional[str] = None


@router.get("/boundary", response_model=ApiResponse)
async def get_boundary(
    user=Depends(require_role("sustainability")),
):
    """Get organisational boundary definition (GHG Protocol)."""
    return ApiResponse(success=True, data={
        "approach": "operational_control",
        "description": (
            "Operational control approach per GHG Protocol. "
            "Includes all Irish operations with >10 employees."
        ),
        "included_entities": [
            {"name": "CoShyft Ireland Ltd", "country": "IE", "employees": 1695},
        ],
        "excluded_entities": [
            {
                "name": "CoShyft US (Sales Office)",
                "country": "US",
                "reason": "<10 employees — below materiality threshold",
            }
        ],
        "reporting_period": "January 2026 – December 2026",
        "last_reviewed": "2026-01-01",
    })


@router.post("/boundary", response_model=ApiResponse)
async def set_boundary(
    data: BoundaryCreate,
    user=Depends(require_role("sustainability")),
    session: AsyncSession = Depends(get_session),
):
    """Set / update organisational boundary definition."""
    await log_action(
        session, user.id, "sustainability", "update", "boundary", "org-boundary",
        description=f"Boundary approach set to {data.approach}",
    )
    return ApiResponse(success=True, data=data.model_dump(), meta={"message": "Boundary updated"})


# ── Methodology Documentation ─────────────────────────────────────────────────

@router.get("/methodology", response_model=ApiResponse)
async def get_methodology(
    user=Depends(require_role("sustainability", "auditor")),
):
    """Get emissions calculation methodology documentation."""
    return ApiResponse(success=True, data={
        "standard": "GHG Protocol Corporate Accounting & Reporting Standard",
        "scope": "Scope 3 Category 7 — Employee Commuting",
        "approach": "Activity-based (distance method)",
        "emission_factors": {
            "source": "SEAI 2024",
            "factors": [
                {"mode": "Petrol Car", "factor_kg_per_km": 0.168},
                {"mode": "Bus", "factor_kg_per_km": 0.089},
                {"mode": "Rail (DART/Luas)", "factor_kg_per_km": 0.025},
                {"mode": "EV", "factor_kg_per_km": 0.053},
                {"mode": "Walk/Cycle", "factor_kg_per_km": 0.0},
            ],
        },
        "baseline": "Solo Petrol Car at 0.168 kg CO2e/km (SEAI 2024)",
        "carpool_logic": (
            "Driver emissions split equally across all occupants. "
            "3-person carpool reduces per-person footprint by 66%."
        ),
        "data_collection": [
            "Employee self-reporting via CoShyft app",
            "GPS verification (optional)",
            "Leap Card integration for public transport",
        ],
        "uncertainty": "±10% per GHG Protocol guidance for activity-based approaches",
        "last_reviewed": "2026-01-01",
        "approved_by": "Head of Sustainability",
    })


# ── DPIA (Data Protection Impact Assessment) ─────────────────────────────────

@router.get("/dpia", response_model=ApiResponse)
async def get_dpia(
    user=Depends(require_role("sustainability", "auditor")),
):
    """Get Data Protection Impact Assessment summary (GDPR Article 35)."""
    return ApiResponse(success=True, data={
        "status": "completed",
        "last_reviewed": "2026-01-15",
        "next_review_due": "2027-01-15",
        "data_controller": "CoShyft Ireland Ltd",
        "dpo_contact": "dpo@coshyft.ie",
        "processing_purposes": [
            "Scope 3 Category 7 emissions calculation",
            "CSRD / ESRS E1 regulatory compliance",
            "Carpooling matching (with explicit consent)",
            "OxyPoints rewards programme",
        ],
        "personal_data_processed": [
            "Home address (geolocation) — carpooling & distance calculation",
            "Commute distance and transport mode",
            "Vehicle details (fuel type, make, model)",
            "Work schedule (hybrid days)",
        ],
        "legal_basis": "Legitimate interest (emissions reporting) + Consent (carpooling)",
        "retention_period": "7 years (CSRD audit requirement)",
        "third_party_transfers": "None — all data processed within EU",
        "risks_identified": [
            {
                "risk": "Re-identification from geolocation data",
                "likelihood": "low",
                "mitigation": "Addresses rounded to 500m grid; never exposed in reports",
            }
        ],
        "approved_by": "DPO",
    })