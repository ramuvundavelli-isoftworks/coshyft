"""
CSRD Compliance Service
ESRS E1 (Climate Change) disclosure checks for employee commuting.
Scope 3 Category 7 specific compliance validation.
"""

from typing import Dict, List, Optional
from datetime import datetime


# ESRS E1 Disclosure Requirements for Scope 3.7 Employee Commuting
ESRS_E1_DISCLOSURES = [
    {
        "id": "E1-1",
        "name": "Transition plan for climate change mitigation",
        "description": "Plan aligned with limiting global warming to 1.5C",
        "category": "strategy",
        "required": True,
    },
    {
        "id": "E1-2",
        "name": "Policies related to climate change mitigation and adaptation",
        "description": "Commuting policies and sustainable transport initiatives",
        "category": "governance",
        "required": True,
    },
    {
        "id": "E1-3",
        "name": "Actions and resources in relation to climate change policies",
        "description": "Initiatives, budgets, and resource allocation for commute emission reduction",
        "category": "governance",
        "required": True,
    },
    {
        "id": "E1-4",
        "name": "Targets related to climate change mitigation and adaptation",
        "description": "Emission reduction targets with baseline and trajectory",
        "category": "metrics",
        "required": True,
    },
    {
        "id": "E1-5",
        "name": "Energy consumption and mix",
        "description": "Transport energy consumption including fleet and commute modes",
        "category": "metrics",
        "required": True,
    },
    {
        "id": "E1-6",
        "name": "Gross Scopes 1, 2, 3 and Total GHG emissions",
        "description": "Scope 3 Category 7 employee commuting emissions with methodology",
        "category": "metrics",
        "required": True,
    },
    {
        "id": "E1-7",
        "name": "GHG removals and GHG mitigation projects financed through carbon credits",
        "description": "Any offsets or carbon credits for commuting emissions",
        "category": "metrics",
        "required": False,
    },
    {
        "id": "E1-8",
        "name": "Internal carbon pricing",
        "description": "Internal carbon price applied to commuting decisions",
        "category": "metrics",
        "required": False,
    },
    {
        "id": "E1-9",
        "name": "Anticipated financial effects from material physical and transition risks",
        "description": "Financial risks from commuting pattern changes and regulation",
        "category": "risks",
        "required": True,
    },
]

# Data quality scoring criteria
DATA_QUALITY_CRITERIA = [
    {"id": "dq-1", "name": "Data Completeness", "weight": 0.25, "description": "Percentage of employees with commute data"},
    {"id": "dq-2", "name": "Data Freshness", "weight": 0.20, "description": "Recency of commute data entries"},
    {"id": "dq-3", "name": "Methodology Consistency", "weight": 0.20, "description": "Consistent application of emission factors"},
    {"id": "dq-4", "name": "Source Reliability", "weight": 0.15, "description": "Use of approved emission factor sources"},
    {"id": "dq-5", "name": "Verification Status", "weight": 0.10, "description": "Percentage of data independently verified"},
    {"id": "dq-6", "name": "Geographic Coverage", "weight": 0.10, "description": "Coverage across all operating locations"},
]


def assess_csrd_compliance(
    has_baseline: bool = False,
    baseline_locked: bool = False,
    has_targets: bool = False,
    has_policies: bool = False,
    has_initiatives: bool = False,
    emission_factors_approved: bool = False,
    data_quality_score: float = 0,
    participation_rate: float = 0,
    has_methodology_doc: bool = False,
    has_risk_assessment: bool = False,
    has_audit_trail: bool = False,
) -> Dict:
    """
    Assess overall CSRD/ESRS E1 compliance readiness.
    Returns compliance status, score, gaps, and recommendations.
    """
    disclosures_status = []
    completed = 0

    for disclosure in ESRS_E1_DISCLOSURES:
        status = _check_disclosure_status(
            disclosure["id"],
            has_baseline=has_baseline,
            baseline_locked=baseline_locked,
            has_targets=has_targets,
            has_policies=has_policies,
            has_initiatives=has_initiatives,
            emission_factors_approved=emission_factors_approved,
            data_quality_score=data_quality_score,
            participation_rate=participation_rate,
            has_methodology_doc=has_methodology_doc,
            has_risk_assessment=has_risk_assessment,
        )
        disclosures_status.append({
            **disclosure,
            "status": status,
        })
        if status == "complete":
            completed += 1

    total = len(ESRS_E1_DISCLOSURES)
    completeness = round((completed / total) * 100, 1) if total > 0 else 0

    gaps = [d for d in disclosures_status if d["status"] != "complete" and d["required"]]
    recommendations = _generate_recommendations(
        gaps, data_quality_score, participation_rate, has_audit_trail
    )

    overall_status = "not_started"
    if completeness >= 90:
        overall_status = "ready"
    elif completeness >= 60:
        overall_status = "in_progress"
    elif completeness > 0:
        overall_status = "early_stage"

    return {
        "overall_status": overall_status,
        "completeness_score": completeness,
        "data_quality_score": data_quality_score,
        "disclosures_completed": completed,
        "disclosures_total": total,
        "disclosures": disclosures_status,
        "gaps": [{"id": g["id"], "name": g["name"], "description": g["description"]} for g in gaps],
        "recommendations": recommendations,
        "assessed_at": datetime.utcnow().isoformat(),
    }


def _check_disclosure_status(
    disclosure_id: str,
    **kwargs,
) -> str:
    """Check status of a specific ESRS E1 disclosure."""
    checks = {
        "E1-1": kwargs.get("has_targets") and kwargs.get("has_initiatives"),
        "E1-2": kwargs.get("has_policies"),
        "E1-3": kwargs.get("has_initiatives"),
        "E1-4": kwargs.get("has_targets") and kwargs.get("has_baseline") and kwargs.get("baseline_locked"),
        "E1-5": kwargs.get("participation_rate", 0) >= 50,
        "E1-6": (
            kwargs.get("has_baseline")
            and kwargs.get("emission_factors_approved")
            and kwargs.get("data_quality_score", 0) >= 75
            and kwargs.get("has_methodology_doc")
        ),
        "E1-7": True,  # Optional
        "E1-8": True,  # Optional
        "E1-9": kwargs.get("has_risk_assessment"),
    }

    if checks.get(disclosure_id, False):
        return "complete"

    # Check if partially done
    partial_checks = {
        "E1-4": kwargs.get("has_baseline") or kwargs.get("has_targets"),
        "E1-6": kwargs.get("has_baseline") or kwargs.get("emission_factors_approved"),
    }

    if partial_checks.get(disclosure_id, False):
        return "in_progress"

    return "not_started"


def _generate_recommendations(
    gaps: List[Dict],
    data_quality: float,
    participation: float,
    has_audit: bool,
) -> List[str]:
    """Generate actionable recommendations based on gaps."""
    recs = []

    if data_quality < 75:
        recs.append(f"Improve data quality score from {data_quality}% to at least 75% (CSRD minimum threshold)")

    if participation < 50:
        recs.append(f"Increase employee participation from {participation}% to at least 50% for ESRS E1-5 compliance")

    if not has_audit:
        recs.append("Establish audit trail for all emission data changes to support CSRD assurance requirements")

    for gap in gaps[:3]:
        recs.append(f"Complete ESRS {gap['id']}: {gap['name']}")

    return recs


def calculate_data_quality_score(
    total_employees: int,
    employees_with_data: int,
    latest_entry_age_days: int,
    approved_factors_ratio: float,
    verified_data_ratio: float,
    offices_covered: int,
    total_offices: int,
) -> Dict:
    """
    Calculate data quality score based on DQC criteria.
    Returns overall score and per-criteria breakdown.
    """
    completeness = min(100, (employees_with_data / max(total_employees, 1)) * 100)
    freshness = max(0, 100 - (latest_entry_age_days * 2))  # Lose 2% per day of staleness
    consistency = approved_factors_ratio * 100
    reliability = approved_factors_ratio * 100
    verification = verified_data_ratio * 100
    coverage = min(100, (offices_covered / max(total_offices, 1)) * 100)

    scores = [completeness, freshness, consistency, reliability, verification, coverage]
    weights = [c["weight"] for c in DATA_QUALITY_CRITERIA]

    overall = sum(s * w for s, w in zip(scores, weights))

    return {
        "overall_score": round(overall, 1),
        "criteria": [
            {**DATA_QUALITY_CRITERIA[i], "score": round(scores[i], 1)}
            for i in range(len(DATA_QUALITY_CRITERIA))
        ],
    }
