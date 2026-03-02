"""
Report Generator Service
Assembles CSRD/ESRS E1 reports and custom emission reports.
"""

from datetime import datetime
from typing import Dict, List, Optional


def generate_emissions_report(
    tenant_name: str,
    reporting_year: int,
    total_emissions: float,
    baseline_emissions: float,
    baseline_year: int,
    offices: List[Dict],
    mode_distribution: List[Dict],
    initiatives: List[Dict],
    emission_factors: List[Dict],
    data_quality_score: float,
) -> Dict:
    """Generate a structured emissions report."""
    yoy_change = round(
        ((total_emissions - baseline_emissions) / baseline_emissions * 100) if baseline_emissions else 0,
        1,
    )

    return {
        "title": f"{tenant_name} - Employee Commuting Emissions Report {reporting_year}",
        "generated_at": datetime.utcnow().isoformat(),
        "reporting_period": f"FY{reporting_year}",
        "scope": "Scope 3 Category 7 - Employee Commuting",
        "framework": "GHG Protocol / CSRD ESRS E1",
        "summary": {
            "total_emissions_tco2e": round(total_emissions / 1000, 2),
            "baseline_emissions_tco2e": round(baseline_emissions / 1000, 2),
            "baseline_year": baseline_year,
            "yoy_change_percent": yoy_change,
            "data_quality_score": data_quality_score,
        },
        "sections": [
            {
                "id": "methodology",
                "title": "Methodology",
                "content": {
                    "approach": "Activity-based (distance-based method)",
                    "scope_category": "3.7 Employee Commuting",
                    "emission_factor_sources": list(set(ef.get("source", "") for ef in emission_factors)),
                    "data_collection": "Employee self-reporting + GPS verification + Leap Card integration",
                    "calculation": "Emissions = Distance (km) x Emission Factor (kg CO2/km)",
                },
            },
            {
                "id": "location_breakdown",
                "title": "Emissions by Location",
                "data": offices,
            },
            {
                "id": "mode_breakdown",
                "title": "Transport Mode Distribution",
                "data": mode_distribution,
            },
            {
                "id": "initiatives",
                "title": "Reduction Initiatives",
                "data": initiatives,
            },
            {
                "id": "emission_factors",
                "title": "Emission Factors Used",
                "data": [
                    {
                        "mode": ef.get("mode"),
                        "factor": ef.get("kg_co2_per_km"),
                        "source": ef.get("source"),
                        "region": ef.get("region"),
                    }
                    for ef in emission_factors
                ],
            },
        ],
    }


def generate_csrd_export(
    tenant_name: str,
    reporting_year: int,
    compliance_assessment: Dict,
    emissions_report: Dict,
    baseline: Dict,
    targets: List[Dict],
    risks: List[Dict],
    evidence_items: List[Dict],
) -> Dict:
    """Generate CSRD/ESRS E1 export package structure."""
    return {
        "metadata": {
            "framework": "CSRD / ESRS E1 - Climate Change",
            "reporting_entity": tenant_name,
            "reporting_year": reporting_year,
            "generated_at": datetime.utcnow().isoformat(),
            "format_version": "1.0",
        },
        "compliance_status": compliance_assessment,
        "disclosures": {
            "E1-1_transition_plan": {
                "status": _get_disclosure_status(compliance_assessment, "E1-1"),
                "targets": targets,
            },
            "E1-4_targets": {
                "status": _get_disclosure_status(compliance_assessment, "E1-4"),
                "baseline": baseline,
                "targets": targets,
            },
            "E1-6_ghg_emissions": {
                "status": _get_disclosure_status(compliance_assessment, "E1-6"),
                "scope3_category7": emissions_report.get("summary", {}),
                "methodology": emissions_report.get("sections", [{}])[0].get("content", {}),
            },
            "E1-9_financial_risks": {
                "status": _get_disclosure_status(compliance_assessment, "E1-9"),
                "risks": risks,
            },
        },
        "supporting_evidence": [
            {
                "id": e.get("id"),
                "title": e.get("title"),
                "category": e.get("category"),
                "status": e.get("status"),
            }
            for e in evidence_items
        ],
    }


def _get_disclosure_status(assessment: Dict, disclosure_id: str) -> str:
    """Extract status of a specific disclosure from compliance assessment."""
    for d in assessment.get("disclosures", []):
        if d.get("id") == disclosure_id:
            return d.get("status", "not_started")
    return "not_started"
