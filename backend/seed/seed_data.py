"""
Seed Data
Ports all mock data from the frontend for development/demo purposes.
Run: python -m seed.seed_data
"""

import asyncio
from datetime import date, datetime, timezone

from database import engine, async_session, init_db
from auth.passwords import hash_password
from models.user import User
from models.emission import EmissionFactor
from models.organization import Office, Baseline, Initiative, Scenario, Risk
from models.transport import IrishTransportMode, IrishWorkplaceBenefit
from models.alert import Alert
from models.tenant import Tenant, TenantConfig
from models.report import ReportTemplate


async def seed():
    """Seed the database with demo data."""
    await init_db()

    async with async_session() as session:
        # --- Tenant ---
        tenant = Tenant(
            id="tenant-001",
            name="CoShift Demo Corp",
            slug="coshift-demo",
            primary_region="IE",
            status="active",
            plan="enterprise",
            max_users=2000,
            max_offices=10,
            contact_email="admin@coshiftdemo.ie",
            contact_name="Platform Admin",
        )
        session.add(tenant)
        session.add(TenantConfig(tenant_id="tenant-001"))

        # --- Users (5 roles) ---
        users = [
            User(id="user-emp-001", email="john.employee@company.ie", name="John Employee",
                 hashed_password=hash_password("password123"), role="employee",
                 department="Engineering", tenant_id="tenant-001"),
            User(id="user-sus-001", email="sarah.mitchell@company.ie", name="Sarah Mitchell",
                 hashed_password=hash_password("password123"), role="sustainability",
                 department="Sustainability", tenant_id="tenant-001"),
            User(id="user-adm-001", email="admin@company.ie", name="Admin User",
                 hashed_password=hash_password("password123"), role="admin",
                 department="Operations", tenant_id="tenant-001"),
            User(id="user-aud-001", email="auditor@auditfirm.ie", name="External Auditor",
                 hashed_password=hash_password("password123"), role="auditor",
                 department="Audit Firm", tenant_id="tenant-001"),
            User(id="user-sa-001", email="superadmin@coshift.ie", name="Super Admin",
                 hashed_password=hash_password("password123"), role="superadmin",
                 department="Platform", tenant_id="tenant-001"),
        ]
        for u in users:
            session.add(u)

        # --- Offices ---
        offices = [
            Office(id="off-001", name="Dublin HQ (IFSC)", city="Dublin", country="Ireland", region="IE",
                   employee_count=450, participation_rate=81, total_emissions=187.3, emission_intensity=0.416,
                   public_transport_access="Excellent", parking_spaces=50, bike_parking=120, ev_chargers=24,
                   tenant_id="tenant-001"),
            Office(id="off-002", name="Cork Office", city="Cork", country="Ireland", region="IE",
                   employee_count=180, participation_rate=73, total_emissions=98.6, emission_intensity=0.548,
                   public_transport_access="Good", parking_spaces=85, bike_parking=40, ev_chargers=8,
                   tenant_id="tenant-001"),
            Office(id="off-003", name="Galway Office", city="Galway", country="Ireland", region="IE",
                   employee_count=95, participation_rate=68, total_emissions=58.9, emission_intensity=0.620,
                   public_transport_access="Moderate", parking_spaces=60, bike_parking=30, ev_chargers=4,
                   tenant_id="tenant-001"),
            Office(id="off-004", name="London Office", city="London", country="United Kingdom", region="GB",
                   employee_count=650, participation_rate=71, total_emissions=298, emission_intensity=0.46,
                   public_transport_access="Excellent", parking_spaces=35, bike_parking=95, ev_chargers=18,
                   tenant_id="tenant-001"),
            Office(id="off-005", name="Amsterdam Office", city="Amsterdam", country="Netherlands", region="NL",
                   employee_count=320, participation_rate=89, total_emissions=84.8, emission_intensity=0.265,
                   public_transport_access="Excellent", parking_spaces=20, bike_parking=200, ev_chargers=12,
                   tenant_id="tenant-001"),
        ]
        for o in offices:
            session.add(o)

        # --- Emission Factors (Irish EPA + UK DEFRA) ---
        ie_factors = [
            ("ef_ie_1", "Petrol Car (Ireland)", 0.189, "EPA Ireland 2025", "v3.0", "IE"),
            ("ef_ie_2", "Diesel Car (Ireland)", 0.168, "EPA Ireland 2025", "v3.0", "IE"),
            ("ef_ie_3", "Electric Vehicle (Ireland Grid)", 0.053, "SEAI/EPA Ireland 2025", "v3.0", "IE"),
            ("ef_ie_4", "Hybrid Car (Ireland)", 0.112, "EPA Ireland 2025", "v3.0", "IE"),
            ("ef_ie_5", "Dublin Bus", 0.082, "NTA Ireland 2025", "v2.0", "IE"),
            ("ef_ie_6", "Bus Eireann", 0.085, "NTA Ireland 2025", "v2.0", "IE"),
            ("ef_ie_7", "Irish Rail", 0.041, "Iarnrod Eireann 2025", "v2.0", "IE"),
            ("ef_ie_8", "DART", 0.035, "Irish Rail 2025", "v2.0", "IE"),
            ("ef_ie_9", "Luas (Tram)", 0.038, "Transdev/NTA 2025", "v1.0", "IE"),
            ("ef_ie_10", "Bicycle", 0.0, "EPA Ireland 2025", "v3.0", "IE"),
            ("ef_ie_11", "E-Bike", 0.008, "SEAI 2025", "v1.0", "IE"),
            ("ef_ie_12", "Walking", 0.0, "EPA Ireland 2025", "v3.0", "IE"),
            ("ef_ie_13", "Motorcycle (Ireland)", 0.113, "EPA Ireland 2025", "v3.0", "IE"),
            ("ef_ie_14", "Work from Home", 0.0, "EPA Ireland 2025", "v3.0", "IE"),
            ("ef1", "Petrol Car", 0.192, "DEFRA 2025", "v2.1", "GB"),
            ("ef2", "Diesel Car", 0.171, "DEFRA 2025", "v2.1", "GB"),
            ("ef3", "Electric Vehicle (UK)", 0.047, "DEFRA 2025", "v2.1", "GB"),
            ("ef4", "Bus", 0.089, "DEFRA 2025", "v2.1", "GB"),
            ("ef5", "Rail", 0.035, "DEFRA 2025", "v2.1", "GB"),
        ]
        for fid, mode, factor, source, version, region in ie_factors:
            session.add(EmissionFactor(
                id=fid, mode=mode, kg_co2_per_km=factor, source=source,
                version=version, region=region, effective_date=date(2025, 1, 1),
                approval_status="approved", scope_category="3.7",
            ))

        # --- Irish Transport Modes ---
        transport_modes = [
            ("ie_t1", "Dublin Bus", "Dublin Bus / Go-Ahead Ireland", 0.082, "public-transport", True, False),
            ("ie_t2", "Bus Eireann", "Bus Eireann", 0.085, "public-transport", True, False),
            ("ie_t3", "Go-Ahead Ireland", "Go-Ahead Ireland", 0.082, "public-transport", True, False),
            ("ie_t4", "Irish Rail (Intercity)", "Iarnrod Eireann", 0.041, "public-transport", True, False),
            ("ie_t5", "DART", "Irish Rail", 0.035, "public-transport", True, False),
            ("ie_t6", "Luas Red Line", "Transdev", 0.038, "public-transport", True, False),
            ("ie_t7", "Luas Green Line", "Transdev", 0.038, "public-transport", True, False),
            ("ie_t8", "Dublin Bikes", "JCDecaux", 0.0, "active-transport", False, False),
            ("ie_t9", "Personal Bicycle", None, 0.0, "active-transport", False, True),
            ("ie_t10", "E-Bike", None, 0.008, "active-transport", False, True),
            ("ie_t11", "E-Scooter", None, 0.015, "active-transport", False, False),
            ("ie_t12", "Walking", None, 0.0, "active-transport", False, False),
            ("ie_t13", "Petrol Car - Solo", None, 0.189, "car", False, False),
            ("ie_t14", "Diesel Car - Solo", None, 0.168, "car", False, False),
            ("ie_t15", "Hybrid Car - Solo", None, 0.112, "car", False, False),
            ("ie_t16", "Electric Vehicle - Solo", None, 0.053, "car", False, False),
            ("ie_t17", "Carpool (2 people)", None, 0.095, "carpool", False, False),
            ("ie_t18", "Carpool (3+ people)", None, 0.063, "carpool", False, False),
            ("ie_t19", "Motorcycle", None, 0.113, "other", False, False),
            ("ie_t20", "Work from Home", None, 0.0, "other", False, False),
        ]
        for tid, mode, operator, ef, cat, tax, bike in transport_modes:
            session.add(IrishTransportMode(
                id=tid, mode=mode, operator=operator, emission_factor=ef,
                category=cat, tax_relief=tax, bike_to_work_scheme=bike,
                regions=["All"],
            ))

        # --- Irish Workplace Benefits ---
        benefits = [
            ("ie_b1", "Bike-to-Work Scheme", "bike-to-work", 0.52, 1500),
            ("ie_b2", "Bike-to-Work Scheme (E-Bikes)", "bike-to-work", 0.52, 3000),
            ("ie_b3", "TaxSaver Commuter Ticket Scheme", "taxsaver", 0.52, None),
            ("ie_b4", "Electric Vehicle BIK Relief", "ev-incentive", 1.0, 50000),
            ("ie_b5", "Remote Working Daily Allowance", "remote-work", 1.0, 3.2),
        ]
        for bid, name, cat, relief, max_amt in benefits:
            session.add(IrishWorkplaceBenefit(
                id=bid, name=name, description=f"{name} - Irish government scheme",
                category=cat, region="IE", tax_relief=relief, max_amount=max_amt,
                status="active", compliance_required=(cat != "remote-work"),
            ))

        # --- Baseline ---
        session.add(Baseline(
            id="baseline-001", tenant_id="tenant-001", year=2023, emissions=2847,
            offices=["Dublin HQ (IFSC)", "Cork Office", "Galway Office", "London Office", "Amsterdam Office"],
            legal_entities=["Corp Ireland Ltd", "Corp UK Ltd", "Corp EU B.V."],
            data_source="HR System + Survey",
            emission_factor_version="EPA Ireland 2023 v2.5 / DEFRA 2023 v1.8",
            locked=True, approved_by="CFO & Head of Sustainability",
            approved_date=date(2024, 3, 15),
        ))

        # --- Initiatives ---
        initiatives = [
            ("init-001", "EV Charging Infrastructure", "Facilities", 465000, 85, 42, "active", date(2026, 1, 1), date(2026, 12, 31)),
            ("init-002", "Enhanced Survey Program", "HR", 69750, 0, 0, "approved", date(2026, 3, 1), date(2026, 12, 31)),
            ("init-003", "Carpool Incentive Program", "Sustainability", 111600, 120, 98, "active", date(2025, 9, 1), date(2026, 8, 31)),
            ("init-004", "Bike-to-Work Scheme (Ireland)", "HR Ireland", 45000, 15, 8, "active", date(2026, 1, 1), date(2026, 12, 31)),
            ("init-005", "TaxSaver Commuter Scheme", "HR Ireland", 28000, 22, 12, "active", date(2026, 1, 1), date(2026, 12, 31)),
        ]
        for iid, name, owner, budget, expected, actual, status, start, end in initiatives:
            session.add(Initiative(
                id=iid, tenant_id="tenant-001", name=name, owner=owner,
                budget=budget, expected_reduction=expected, actual_reduction=actual,
                status=status, start_date=start, end_date=end,
            ))

        # --- Risks ---
        risks = [
            ("risk-001", "Data Quality Below 75% Threshold", "high", "high", 250000, "Data Governance Team", "mitigating"),
            ("risk-002", "Target Trajectory Misalignment", "medium", "high", 500000, "Sustainability Team", "open"),
            ("risk-003", "Emission Factor Update Impact", "low", "medium", 100000, "Methodology Team", "closed"),
        ]
        for rid, title, likelihood, impact, exposure, owner, status in risks:
            session.add(Risk(
                id=rid, tenant_id="tenant-001", title=title,
                likelihood=likelihood, impact=impact, financial_exposure=exposure,
                owner=owner, status=status,
            ))

        # --- Scenarios ---
        scenarios = [
            ("scen-001", "Aggressive EV Transition", 5, 1, 40, 387, 2.4, 3.2),
            ("scen-002", "Hybrid Work Focus", 10, 2, 15, 512, 4.8, 1.8),
            ("scen-003", "Public Transit Subsidy", 8, 0, 20, 298, 3.2, 2.5),
        ]
        for sid, name, carpool, remote, ev, reduced, roi, payback in scenarios:
            session.add(Scenario(
                id=sid, tenant_id="tenant-001", name=name,
                carpool_increase=carpool, remote_days=remote, ev_adoption=ev,
                emissions_reduced=reduced, roi=roi, payback=payback,
                created_by="user-sus-001",
            ))

        # --- Alerts ---
        alerts = [
            ("critical", "Data Quality Below Threshold", "Q4 data quality dropped to 68%", "Data Quality"),
            ("critical", "Target Trajectory Risk", "Current trajectory shows 12% gap vs 2030 target", "Targets"),
            ("warning", "Pending Factor Approval", "Metro emission factor awaiting approval", "Emission Factors"),
            ("warning", "Initiative Budget Overrun", "Carpool Incentive Program 85% budget spent", "Initiatives"),
            ("info", "Monthly Report Ready", "January compliance report available for review", "Reporting"),
        ]
        for severity, title, desc, entity in alerts:
            session.add(Alert(
                tenant_id="tenant-001", severity=severity, title=title,
                description=desc, linked_entity=entity,
            ))

        # --- Report Templates ---
        templates = [
            ("CSRD/ESRS E1 Report", "csrd", True),
            ("Monthly Emissions Summary", "emissions", True),
            ("Annual Compliance Report", "compliance", True),
            ("Transport Mode Analysis", "custom", False),
        ]
        for name, rtype, is_system in templates:
            session.add(ReportTemplate(
                name=name, description=f"Standard {name} template",
                report_type=rtype, is_system=is_system,
            ))

        await session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
