"""
CoShyft Full Seed Script
Run: python seed_full.py

Drops and recreates schema, then seeds ALL tables with realistic sample data
for every dashboard role: employee, admin, sustainability, auditor, superadmin.
"""

import asyncio
import sys
import os
import uuid

sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta, date
from database import init_db, async_session
from models.tenant import Tenant, TenantConfig, TenantStatusEnum, TenantPlanEnum
from models.user import User, UserRoleEnum, LocaleEnum, RegionEnum, GDPRConsent, DataRetentionPolicy
from models.organization import (
    Office, Baseline, Initiative, Scenario, Risk, Policy,
    PublicTransportAccessEnum, InitiativeStatusEnum,
    RiskLikelihoodEnum, RiskImpactEnum, RiskStatusEnum, PolicyStatusEnum,
)
from models.audit import (
    AuditLog, AuditActionEnum, EntityTypeEnum,
    GDPRAuditLog, EvidenceItem, EvidenceStatusEnum,
    AuditFinding, FindingSeverityEnum, FindingStatusEnum, AuditNote,
)
from models.alert import Alert, AlertSeverityEnum
from models.carpooling import (
    Ride, RideRequest, RecurringRideTemplate,
    RideStatusEnum, RideRequestStatusEnum, VehicleTypeEnum,
    RecurringPatternEnum, TemplateStatusEnum,
)
from models.commute import CommuteEntry, CommuteProfile, VerificationMethodEnum
from models.emission import EmissionFactor, EmissionRecord, ApprovalStatusEnum, RegionEnum as EmissionRegionEnum
from models.gamification import (
    OxyPointsLedger, UserAchievement, UserBadge, Challenge, ChallengeParticipant,
    PointsReasonEnum, AchievementCategoryEnum, AchievementRarityEnum,
    ChallengeTypeEnum, ChallengeStatusEnum,
)
from models.messaging import MessageThread, ThreadParticipant, Message, ThreadTypeEnum, MessageTypeEnum
from models.report import Report, ReportTemplate, CSRDSubmission, ReportStatusEnum, ReportFormatEnum, CSRDStatusEnum
from models.transport import IrishTransportMode, IrishWorkplaceBenefit, TransportCategoryEnum, BenefitCategoryEnum, BenefitStatusEnum
from auth.passwords import hash_password


def uid(): return str(uuid.uuid4())
def utc(days_ago=0, hours_ago=0): return datetime.utcnow() - timedelta(days=days_ago, hours=hours_ago)
def d(days_ago=0): return (date.today() - timedelta(days=days_ago))


# ── IDs ─────────────────────────────────────────────────────────────────────
T_ACME    = "t-acme-001"
T_TC      = "t-techcorp-002"
T_GC      = "t-greenco-003"
T_SX      = "t-startup-004"

U_SUPER       = "u-super-001"
U_ACME_ADMIN  = "u-acme-admin-001"
U_ACME_SUS    = "u-acme-sus-001"
U_ACME_AUD    = "u-acme-aud-001"
U_ACME_EMP1   = "u-acme-emp-001"
U_ACME_EMP2   = "u-acme-emp-002"
U_ACME_EMP3   = "u-acme-emp-003"
U_ACME_EMP4   = "u-acme-emp-004"
U_ACME_EMP5   = "u-acme-emp-005"
U_TC_ADMIN    = "u-tc-admin-001"
U_TC_SUS      = "u-tc-sus-001"
U_TC_EMP1     = "u-tc-emp-001"
U_TC_EMP2     = "u-tc-emp-002"
U_TC_EMP3     = "u-tc-emp-003"
U_GC_ADMIN    = "u-gc-admin-001"
U_GC_SUS      = "u-gc-sus-001"
U_GC_EMP1     = "u-gc-emp-001"
U_GC_EMP2     = "u-gc-emp-002"
U_SX_ADMIN    = "u-sx-admin-001"
U_SX_EMP1     = "u-sx-emp-001"
U_SX_EMP2     = "u-sx-emp-002"

O_ACME_DUB  = "o-acme-dub"
O_ACME_CORK = "o-acme-cork"
O_ACME_GAL  = "o-acme-gal"
O_TC_DUB    = "o-tc-dub"
O_TC_LIM    = "o-tc-lim"
O_GC_LON    = "o-gc-lon"
O_GC_MAN    = "o-gc-man"
O_SX_DUB    = "o-sx-dub"

PW = hash_password("Password123!")


# ── 1. TENANTS ────────────────────────────────────────────────────────────────
TENANTS = [
    {"id": T_ACME, "name": "Acme Corporation", "slug": "acme-corp", "primary_region": "IE",
     "status": TenantStatusEnum.ACTIVE, "plan": TenantPlanEnum.ENTERPRISE,
     "max_users": 5000, "max_offices": 50,
     "contact_email": "admin@acme.com", "contact_name": "James O'Brien",
     "billing_email": "billing@acme.com", "created_at": utc(365), "updated_at": utc(30)},
    {"id": T_TC, "name": "TechCorp Ireland", "slug": "techcorp-ie", "primary_region": "IE",
     "status": TenantStatusEnum.ACTIVE, "plan": TenantPlanEnum.PROFESSIONAL,
     "max_users": 500, "max_offices": 10,
     "contact_email": "admin@techcorp.ie", "contact_name": "Sarah Murphy",
     "billing_email": "billing@techcorp.ie", "created_at": utc(200), "updated_at": utc(15)},
    {"id": T_GC, "name": "GreenCo Energy", "slug": "greenco-energy", "primary_region": "GB",
     "status": TenantStatusEnum.ACTIVE, "plan": TenantPlanEnum.PROFESSIONAL,
     "max_users": 300, "max_offices": 8,
     "contact_email": "admin@greenco.co.uk", "contact_name": "Emma Clarke",
     "billing_email": "finance@greenco.co.uk", "created_at": utc(120), "updated_at": utc(10)},
    {"id": T_SX, "name": "StartupXYZ Ltd", "slug": "startupxyz", "primary_region": "IE",
     "status": TenantStatusEnum.TRIAL, "plan": TenantPlanEnum.STARTER,
     "max_users": 50, "max_offices": 2,
     "contact_email": "hello@startupxyz.io", "contact_name": "Conor Walsh",
     "billing_email": None, "created_at": utc(14), "updated_at": utc(1)},
]

TENANT_CONFIGS = [
    {"tenant_id": T_ACME, "default_locale": "en-IE", "default_currency": "EUR",
     "emission_factor_region": "IE", "oxypoints_enabled": True, "carpooling_enabled": True,
     "csrd_reporting_enabled": True, "gdpr_strict_mode": True, "data_retention_years": 7},
    {"tenant_id": T_TC, "default_locale": "en-IE", "default_currency": "EUR",
     "emission_factor_region": "IE", "oxypoints_enabled": True, "carpooling_enabled": True,
     "csrd_reporting_enabled": True, "gdpr_strict_mode": True, "data_retention_years": 5},
    {"tenant_id": T_GC, "default_locale": "en-GB", "default_currency": "GBP",
     "emission_factor_region": "GB", "oxypoints_enabled": True, "carpooling_enabled": False,
     "csrd_reporting_enabled": True, "gdpr_strict_mode": True, "data_retention_years": 7},
    {"tenant_id": T_SX, "default_locale": "en-IE", "default_currency": "EUR",
     "emission_factor_region": "IE", "oxypoints_enabled": False, "carpooling_enabled": False,
     "csrd_reporting_enabled": False, "gdpr_strict_mode": False, "data_retention_years": 3},
]


# ── 2. USERS ──────────────────────────────────────────────────────────────────
USERS_DATA = [
    {"id": U_SUPER,      "email": "superadmin@coshyft.io",          "name": "Platform Admin",      "role": UserRoleEnum.SUPERADMIN,    "tenant_id": None,  "department": None,             "created_at": utc(400)},
    {"id": U_ACME_ADMIN, "email": "james.obrien@acme.com",          "name": "James O'Brien",       "role": UserRoleEnum.ADMIN,         "tenant_id": T_ACME,"department": "Operations",     "created_at": utc(360)},
    {"id": U_ACME_SUS,   "email": "aoife.kelly@acme.com",           "name": "Aoife Kelly",         "role": UserRoleEnum.SUSTAINABILITY, "tenant_id": T_ACME,"department": "Sustainability", "created_at": utc(340)},
    {"id": U_ACME_AUD,   "email": "declan.ryan@acme.com",           "name": "Declan Ryan",         "role": UserRoleEnum.AUDITOR,       "tenant_id": T_ACME,"department": "Finance",        "created_at": utc(300)},
    {"id": U_ACME_EMP1,  "email": "ciara.brennan@acme.com",         "name": "Ciara Brennan",       "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_ACME,"department": "Engineering",    "created_at": utc(280)},
    {"id": U_ACME_EMP2,  "email": "liam.doyle@acme.com",            "name": "Liam Doyle",          "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_ACME,"department": "Marketing",      "created_at": utc(260)},
    {"id": U_ACME_EMP3,  "email": "niamh.fitzgerald@acme.com",      "name": "Niamh Fitzgerald",    "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_ACME,"department": "HR",             "created_at": utc(240)},
    {"id": U_ACME_EMP4,  "email": "sean.gallagher@acme.com",        "name": "Seán Gallagher",      "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_ACME,"department": "Sales",          "created_at": utc(220)},
    {"id": U_ACME_EMP5,  "email": "emer.hayes@acme.com",            "name": "Emer Hayes",          "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_ACME,"department": "Engineering",    "created_at": utc(200)},
    {"id": U_TC_ADMIN,   "email": "sarah.murphy@techcorp.ie",       "name": "Sarah Murphy",        "role": UserRoleEnum.ADMIN,         "tenant_id": T_TC,  "department": "IT",             "created_at": utc(195)},
    {"id": U_TC_SUS,     "email": "patrick.connolly@techcorp.ie",   "name": "Patrick Connolly",    "role": UserRoleEnum.SUSTAINABILITY, "tenant_id": T_TC,  "department": "Sustainability", "created_at": utc(185)},
    {"id": U_TC_EMP1,    "email": "fiona.lynch@techcorp.ie",        "name": "Fiona Lynch",         "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_TC,  "department": "Development",    "created_at": utc(175)},
    {"id": U_TC_EMP2,    "email": "michael.byrne@techcorp.ie",      "name": "Michael Byrne",       "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_TC,  "department": "QA",             "created_at": utc(160)},
    {"id": U_TC_EMP3,    "email": "orla.sullivan@techcorp.ie",      "name": "Orla Sullivan",       "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_TC,  "department": "Product",        "created_at": utc(140)},
    {"id": U_GC_ADMIN,   "email": "emma.clarke@greenco.co.uk",      "name": "Emma Clarke",         "role": UserRoleEnum.ADMIN,         "tenant_id": T_GC,  "department": "Operations",     "created_at": utc(115)},
    {"id": U_GC_SUS,     "email": "oliver.smith@greenco.co.uk",     "name": "Oliver Smith",        "role": UserRoleEnum.SUSTAINABILITY, "tenant_id": T_GC,  "department": "ESG",            "created_at": utc(110)},
    {"id": U_GC_EMP1,    "email": "jessica.jones@greenco.co.uk",    "name": "Jessica Jones",       "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_GC,  "department": "Engineering",    "created_at": utc(100)},
    {"id": U_GC_EMP2,    "email": "tom.williams@greenco.co.uk",     "name": "Tom Williams",        "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_GC,  "department": "Field Ops",      "created_at": utc(90)},
    {"id": U_SX_ADMIN,   "email": "conor.walsh@startupxyz.io",      "name": "Conor Walsh",         "role": UserRoleEnum.ADMIN,         "tenant_id": T_SX,  "department": "Founding Team",  "created_at": utc(13)},
    {"id": U_SX_EMP1,    "email": "roisin.power@startupxyz.io",     "name": "Róisín Power",        "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_SX,  "department": "Engineering",    "created_at": utc(12)},
    {"id": U_SX_EMP2,    "email": "cian.nolan@startupxyz.io",       "name": "Cian Nolan",          "role": UserRoleEnum.EMPLOYEE,      "tenant_id": T_SX,  "department": "Design",         "created_at": utc(10)},
]


# ── 3. OFFICES ────────────────────────────────────────────────────────────────
OFFICES_DATA = [
    {"id": O_ACME_DUB,  "tenant_id": T_ACME, "name": "Acme Dublin HQ",       "city": "Dublin",     "country": "Ireland",        "region": "IE", "lat": 53.3498, "lng": -6.2603, "employee_count": 1200, "participation_rate": 68.4, "total_emissions": 485.2, "emission_intensity": 0.40, "public_transport_access": PublicTransportAccessEnum.EXCELLENT, "parking_spaces": 350, "bike_parking": 80, "ev_chargers": 24},
    {"id": O_ACME_CORK, "tenant_id": T_ACME, "name": "Acme Cork Office",      "city": "Cork",       "country": "Ireland",        "region": "IE", "lat": 51.8985, "lng": -8.4756, "employee_count": 480,  "participation_rate": 61.0, "total_emissions": 198.6, "emission_intensity": 0.41, "public_transport_access": PublicTransportAccessEnum.GOOD,      "parking_spaces": 140, "bike_parking": 30, "ev_chargers": 8},
    {"id": O_ACME_GAL,  "tenant_id": T_ACME, "name": "Acme Galway Campus",    "city": "Galway",     "country": "Ireland",        "region": "IE", "lat": 53.2707, "lng": -9.0568, "employee_count": 320,  "participation_rate": 54.2, "total_emissions": 142.8, "emission_intensity": 0.45, "public_transport_access": PublicTransportAccessEnum.MODERATE,  "parking_spaces": 120, "bike_parking": 40, "ev_chargers": 6},
    {"id": O_TC_DUB,    "tenant_id": T_TC,   "name": "TechCorp Dublin",       "city": "Dublin",     "country": "Ireland",        "region": "IE", "lat": 53.3418, "lng": -6.2658, "employee_count": 280,  "participation_rate": 72.1, "total_emissions": 98.4,  "emission_intensity": 0.35, "public_transport_access": PublicTransportAccessEnum.EXCELLENT, "parking_spaces": 80,  "bike_parking": 50, "ev_chargers": 12},
    {"id": O_TC_LIM,    "tenant_id": T_TC,   "name": "TechCorp Limerick",     "city": "Limerick",   "country": "Ireland",        "region": "IE", "lat": 52.6638, "lng": -8.6267, "employee_count": 95,   "participation_rate": 58.9, "total_emissions": 41.2,  "emission_intensity": 0.43, "public_transport_access": PublicTransportAccessEnum.MODERATE,  "parking_spaces": 60,  "bike_parking": 20, "ev_chargers": 4},
    {"id": O_GC_LON,    "tenant_id": T_GC,   "name": "GreenCo London HQ",     "city": "London",     "country": "United Kingdom", "region": "GB", "lat": 51.5074, "lng": -0.1278, "employee_count": 190,  "participation_rate": 66.3, "total_emissions": 74.5,  "emission_intensity": 0.39, "public_transport_access": PublicTransportAccessEnum.EXCELLENT, "parking_spaces": 40,  "bike_parking": 60, "ev_chargers": 10},
    {"id": O_GC_MAN,    "tenant_id": T_GC,   "name": "GreenCo Manchester",    "city": "Manchester", "country": "United Kingdom", "region": "GB", "lat": 53.4808, "lng": -2.2426, "employee_count": 85,   "participation_rate": 59.4, "total_emissions": 36.8,  "emission_intensity": 0.43, "public_transport_access": PublicTransportAccessEnum.GOOD,      "parking_spaces": 55,  "bike_parking": 20, "ev_chargers": 4},
    {"id": O_SX_DUB,    "tenant_id": T_SX,   "name": "StartupXYZ Dublin",     "city": "Dublin",     "country": "Ireland",        "region": "IE", "lat": 53.3379, "lng": -6.2592, "employee_count": 22,   "participation_rate": 81.8, "total_emissions": 6.2,   "emission_intensity": 0.28, "public_transport_access": PublicTransportAccessEnum.GOOD,      "parking_spaces": 10,  "bike_parking": 15, "ev_chargers": 2},
]


async def seed():
    print("Dropping existing tables...")
    from database import engine
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.execute(text("DROP SCHEMA public CASCADE"))
        await conn.execute(text("CREATE SCHEMA public"))

    print("Initialising database tables...")
    await init_db()

    async with async_session() as session:

        # ── Tenants ────────────────────────────────────────────────────────
        print("Seeding tenants...")
        for td in TENANTS:
            session.add(Tenant(**td))
        await session.flush()

        for cd in TENANT_CONFIGS:
            session.add(TenantConfig(**cd, updated_at=datetime.utcnow()))
        await session.flush()

        # ── Users ──────────────────────────────────────────────────────────
        print("Seeding users...")
        for ud in USERS_DATA:
            session.add(User(
                id=ud["id"], email=ud["email"], name=ud["name"],
                hashed_password=PW, role=ud["role"],
                tenant_id=ud["tenant_id"], department=ud["department"],
                locale=LocaleEnum.EN_IE, region=RegionEnum.IE,
                is_active=True, created_at=ud["created_at"], updated_at=ud["created_at"],
            ))
        await session.flush()

        # ── Offices ────────────────────────────────────────────────────────
        print("Seeding offices...")
        for od in OFFICES_DATA:
            session.add(Office(
                id=od["id"], tenant_id=od["tenant_id"], name=od["name"],
                city=od["city"], country=od["country"], region=od["region"],
                lat=od["lat"], lng=od["lng"],
                employee_count=od["employee_count"],
                participation_rate=od["participation_rate"],
                total_emissions=od["total_emissions"],
                emission_intensity=od["emission_intensity"],
                public_transport_access=od["public_transport_access"],
                parking_spaces=od["parking_spaces"],
                bike_parking=od["bike_parking"],
                ev_chargers=od["ev_chargers"],
                is_active=True, created_at=datetime.utcnow(), updated_at=datetime.utcnow(),
            ))
        await session.flush()

        # ── GDPR Consent & Data Retention ─────────────────────────────────
        print("Seeding GDPR consent...")
        for u in USERS_DATA:
            session.add(GDPRConsent(
                user_id=u["id"], essential=True, analytics=True,
                marketing=False, data_sharing_carpooling=True,
                consent_date=u["created_at"], ip_address="192.168.1.1",
            ))
        await session.flush()

        # ── Irish Transport Modes ──────────────────────────────────────────
        print("Seeding Irish transport modes...")
        transport_modes = [
            {"id": "tm-car-petrol",   "mode": "Car (Petrol)",          "operator": None,              "emission_factor": 0.171, "category": TransportCategoryEnum.CAR,              "tax_relief": False, "bike_to_work_scheme": False},
            {"id": "tm-car-diesel",   "mode": "Car (Diesel)",          "operator": None,              "emission_factor": 0.162, "category": TransportCategoryEnum.CAR,              "tax_relief": False, "bike_to_work_scheme": False},
            {"id": "tm-car-electric", "mode": "Car (Electric)",        "operator": None,              "emission_factor": 0.053, "category": TransportCategoryEnum.CAR,              "tax_relief": True,  "bike_to_work_scheme": False},
            {"id": "tm-car-hybrid",   "mode": "Car (Hybrid)",          "operator": None,              "emission_factor": 0.106, "category": TransportCategoryEnum.CAR,              "tax_relief": True,  "bike_to_work_scheme": False},
            {"id": "tm-carpool-2",    "mode": "Carpool (2 passengers)","operator": None,              "emission_factor": 0.086, "category": TransportCategoryEnum.CARPOOL,          "tax_relief": False, "bike_to_work_scheme": False},
            {"id": "tm-carpool-3",    "mode": "Carpool (3 passengers)","operator": None,              "emission_factor": 0.057, "category": TransportCategoryEnum.CARPOOL,          "tax_relief": False, "bike_to_work_scheme": False},
            {"id": "tm-dart",         "mode": "DART",                  "operator": "Irish Rail",      "emission_factor": 0.041, "category": TransportCategoryEnum.PUBLIC_TRANSPORT,  "tax_relief": True,  "bike_to_work_scheme": False},
            {"id": "tm-luas",         "mode": "Luas",                  "operator": "Transdev",        "emission_factor": 0.038, "category": TransportCategoryEnum.PUBLIC_TRANSPORT,  "tax_relief": True,  "bike_to_work_scheme": False},
            {"id": "tm-dublin-bus",   "mode": "Dublin Bus",            "operator": "Dublin Bus",      "emission_factor": 0.089, "category": TransportCategoryEnum.PUBLIC_TRANSPORT,  "tax_relief": True,  "bike_to_work_scheme": False},
            {"id": "tm-bus-eireann",  "mode": "Bus Éireann",           "operator": "Bus Éireann",     "emission_factor": 0.079, "category": TransportCategoryEnum.PUBLIC_TRANSPORT,  "tax_relief": True,  "bike_to_work_scheme": False},
            {"id": "tm-commuter-rail","mode": "Commuter Rail",         "operator": "Irish Rail",      "emission_factor": 0.048, "category": TransportCategoryEnum.PUBLIC_TRANSPORT,  "tax_relief": True,  "bike_to_work_scheme": False},
            {"id": "tm-bicycle",      "mode": "Bicycle",               "operator": None,              "emission_factor": 0.000, "category": TransportCategoryEnum.ACTIVE_TRANSPORT,  "tax_relief": False, "bike_to_work_scheme": True},
            {"id": "tm-walking",      "mode": "Walking",               "operator": None,              "emission_factor": 0.000, "category": TransportCategoryEnum.ACTIVE_TRANSPORT,  "tax_relief": False, "bike_to_work_scheme": False},
            {"id": "tm-motorcycle",   "mode": "Motorcycle",            "operator": None,              "emission_factor": 0.114, "category": TransportCategoryEnum.OTHER,             "tax_relief": False, "bike_to_work_scheme": False},
        ]
        for tm in transport_modes:
            session.add(IrishTransportMode(
                id=tm["id"], mode=tm["mode"], operator=tm["operator"],
                emission_factor=tm["emission_factor"],
                category=tm["category"], tax_relief=tm["tax_relief"],
                bike_to_work_scheme=tm["bike_to_work_scheme"],
                regions=["IE"], is_active=True,
            ))
        await session.flush()

        # ── Irish Workplace Benefits ───────────────────────────────────────
        print("Seeding workplace benefits...")
        benefits = [
            {"id": "wb-bike-001", "name": "Bike to Work Scheme",       "description": "Tax relief on bicycle and equipment purchase up to €1,250 (€1,500 for e-bikes)",          "category": BenefitCategoryEnum.BIKE_TO_WORK, "region": "IE", "tax_relief": 40.0, "max_amount": 1500.0,  "eligible_modes": ["tm-bicycle"],                                   "status": BenefitStatusEnum.ACTIVE, "compliance_required": False},
            {"id": "wb-tax-001",  "name": "TaxSaver Commuter Ticket",  "description": "Tax-free public transport tickets saving up to 52% on annual ticket cost",                 "category": BenefitCategoryEnum.TAXSAVER,     "region": "IE", "tax_relief": 52.0, "max_amount": None,    "eligible_modes": ["tm-dart", "tm-luas", "tm-dublin-bus", "tm-commuter-rail"], "status": BenefitStatusEnum.ACTIVE, "compliance_required": False},
            {"id": "wb-ev-001",   "name": "EV Home Charger Grant",     "description": "SEAI grant of up to €300 for home EV charger installation",                               "category": BenefitCategoryEnum.EV_INCENTIVE, "region": "IE", "tax_relief": 0.0,  "max_amount": 300.0,   "eligible_modes": ["tm-car-electric"],                               "status": BenefitStatusEnum.ACTIVE, "compliance_required": False},
            {"id": "wb-remote-001","name": "Remote Work Relief",       "description": "30% tax relief on home office costs for remote working days",                              "category": BenefitCategoryEnum.REMOTE_WORK,  "region": "IE", "tax_relief": 30.0, "max_amount": None,    "eligible_modes": [],                                                "status": BenefitStatusEnum.ACTIVE, "compliance_required": True},
        ]
        for b in benefits:
            session.add(IrishWorkplaceBenefit(
                id=b["id"], name=b["name"], description=b["description"],
                category=b["category"], region=b["region"],
                tax_relief=b["tax_relief"], max_amount=b["max_amount"],
                eligible_modes=b["eligible_modes"], status=b["status"],
                compliance_required=b["compliance_required"],
            ))
        await session.flush()

        # ── Emission Factors ───────────────────────────────────────────────
        print("Seeding emission factors...")
        ef_data = [
            {"id": "ef-car-p-ie",  "mode": "Car (Petrol)",           "kg_co2_per_km": 0.171, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7"},
            {"id": "ef-car-d-ie",  "mode": "Car (Diesel)",           "kg_co2_per_km": 0.162, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7"},
            {"id": "ef-car-e-ie",  "mode": "Car (Electric)",         "kg_co2_per_km": 0.053, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7", "grid_intensity": 315.0},
            {"id": "ef-car-h-ie",  "mode": "Car (Hybrid)",           "kg_co2_per_km": 0.106, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7"},
            {"id": "ef-cp2-ie",    "mode": "Carpool (2 pax)",        "kg_co2_per_km": 0.086, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7"},
            {"id": "ef-dart-ie",   "mode": "DART",                   "kg_co2_per_km": 0.041, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7"},
            {"id": "ef-luas-ie",   "mode": "Luas",                   "kg_co2_per_km": 0.038, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7"},
            {"id": "ef-bus-ie",    "mode": "Dublin Bus",             "kg_co2_per_km": 0.089, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7"},
            {"id": "ef-rail-ie",   "mode": "Commuter Rail",          "kg_co2_per_km": 0.048, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "GHG Protocol Scope 3 Category 7", "scope_category": "3.7"},
            {"id": "ef-bike-ie",   "mode": "Bicycle",                "kg_co2_per_km": 0.000, "source": "SEAI 2024", "version": "2024.1", "region": EmissionRegionEnum.IE, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "Zero emission active transport",  "scope_category": "3.7"},
            {"id": "ef-car-p-gb",  "mode": "Car (Petrol)",           "kg_co2_per_km": 0.180, "source": "DEFRA 2024","version": "2024.1", "region": EmissionRegionEnum.GB, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "DEFRA GHG Conversion Factors 2024", "scope_category": "3.7"},
            {"id": "ef-tube-gb",   "mode": "London Underground",     "kg_co2_per_km": 0.028, "source": "DEFRA 2024","version": "2024.1", "region": EmissionRegionEnum.GB, "effective_date": date(2024, 1, 1), "approval_status": ApprovalStatusEnum.APPROVED, "methodology": "DEFRA GHG Conversion Factors 2024", "scope_category": "3.7"},
        ]
        for ef in ef_data:
            session.add(EmissionFactor(
                id=ef["id"], mode=ef["mode"], kg_co2_per_km=ef["kg_co2_per_km"],
                source=ef["source"], version=ef["version"], region=ef["region"],
                effective_date=ef["effective_date"], approval_status=ef["approval_status"],
                methodology=ef.get("methodology"), scope_category=ef.get("scope_category", "3.7"),
                grid_intensity=ef.get("grid_intensity"), approved_by=U_ACME_SUS,
                approved_at=utc(30),
            ))
        await session.flush()

        # ── Commute Profiles ───────────────────────────────────────────────
        print("Seeding commute profiles...")
        commute_profiles = [
            {"user_id": U_ACME_EMP1, "origin": "14 Griffith Avenue, Dublin 9", "origin_lat": 53.3736, "origin_lng": -6.2521, "dest": "Acme Dublin HQ, D2", "dest_lat": 53.3498, "dest_lng": -6.2603, "mode_id": "tm-dart",       "dist": 8.2,  "work_days": 5, "remote_days": 1},
            {"user_id": U_ACME_EMP2, "origin": "42 Rathgar Road, Dublin 6",   "origin_lat": 53.3187, "origin_lng": -6.2762, "dest": "Acme Dublin HQ, D2", "dest_lat": 53.3498, "dest_lng": -6.2603, "mode_id": "tm-luas",       "dist": 5.4,  "work_days": 5, "remote_days": 0},
            {"user_id": U_ACME_EMP3, "origin": "8 Blackrock Road, Cork",      "origin_lat": 51.9001, "origin_lng": -8.4521, "dest": "Acme Cork Office",   "dest_lat": 51.8985, "dest_lng": -8.4756, "mode_id": "tm-bicycle",    "dist": 3.1,  "work_days": 5, "remote_days": 2},
            {"user_id": U_ACME_EMP4, "origin": "3 Merchant's Quay, Dublin 8", "origin_lat": 53.3441, "origin_lng": -6.2729, "dest": "Acme Dublin HQ, D2", "dest_lat": 53.3498, "dest_lng": -6.2603, "mode_id": "tm-walking",    "dist": 1.8,  "work_days": 4, "remote_days": 1},
            {"user_id": U_ACME_EMP5, "origin": "21 Salthill Road, Galway",    "origin_lat": 53.2635, "origin_lng": -9.0850, "dest": "Acme Galway Campus", "dest_lat": 53.2707, "dest_lng": -9.0568, "mode_id": "tm-car-petrol", "dist": 6.2,  "work_days": 5, "remote_days": 0},
            {"user_id": U_TC_EMP1,   "origin": "55 Clontarf Road, Dublin 3",  "origin_lat": 53.3637, "origin_lng": -6.2066, "dest": "TechCorp Dublin",    "dest_lat": 53.3418, "dest_lng": -6.2658, "mode_id": "tm-dublin-bus", "dist": 6.8,  "work_days": 4, "remote_days": 1},
            {"user_id": U_TC_EMP2,   "origin": "12 O'Connell Ave, Limerick",  "origin_lat": 52.6652, "origin_lng": -8.6298, "dest": "TechCorp Limerick",  "dest_lat": 52.6638, "dest_lng": -8.6267, "mode_id": "tm-walking",    "dist": 0.8,  "work_days": 5, "remote_days": 0},
            {"user_id": U_GC_EMP1,   "origin": "78 Clapham Road, London",     "origin_lat": 51.4665, "origin_lng": -0.1220, "dest": "GreenCo London HQ",  "dest_lat": 51.5074, "dest_lng": -0.1278, "mode_id": "tm-tube-gb",    "dist": 4.6,  "work_days": 5, "remote_days": 2},
        ]
        for cp in commute_profiles:
            session.add(CommuteProfile(
                user_id=cp["user_id"],
                default_origin_address=cp["origin"],
                default_origin_lat=cp["origin_lat"], default_origin_lng=cp["origin_lng"],
                default_destination_address=cp["dest"],
                default_destination_lat=cp["dest_lat"], default_destination_lng=cp["dest_lng"],
                default_transport_mode_id=cp["mode_id"],
                default_distance_km=cp["dist"],
                work_days_per_week=cp["work_days"],
                remote_days_per_week=cp["remote_days"],
                preferences={"musicPreference": "no-preference", "conversationLevel": "chatty",
                             "allowsPets": False, "allowsSmoking": False, "vehicleType": "any",
                             "temperaturePreference": "no-preference", "flexibleTiming": True, "flexibleRadius": 5},
            ))
        await session.flush()

        # ── Commute Entries (90 days of history) ──────────────────────────
        print("Seeding commute entries...")
        mode_ef_map = {
            "tm-dart":       ("ef-dart-ie", "DART",             0.041),
            "tm-luas":       ("ef-luas-ie", "Luas",             0.038),
            "tm-bicycle":    ("ef-bike-ie", "Bicycle",          0.000),
            "tm-walking":    ("ef-bike-ie", "Walking",          0.000),
            "tm-car-petrol": ("ef-car-p-ie","Car (Petrol)",     0.171),
            "tm-dublin-bus": ("ef-bus-ie",  "Dublin Bus",       0.089),
            "tm-tube-gb":    ("ef-tube-gb", "London Underground",0.028),
            "tm-car-electric":("ef-car-e-ie","Car (Electric)",  0.053),
        }
        employee_commutes = [
            (U_ACME_EMP1, "tm-dart",       8.2,  35, 5),
            (U_ACME_EMP2, "tm-luas",       5.4,  22, 5),
            (U_ACME_EMP3, "tm-bicycle",    3.1,  18, 3),
            (U_ACME_EMP4, "tm-walking",    1.8,  12, 4),
            (U_ACME_EMP5, "tm-car-petrol", 6.2,  28, 5),
            (U_TC_EMP1,   "tm-dublin-bus", 6.8,  30, 4),
            (U_TC_EMP2,   "tm-walking",    0.8,   8, 5),
            (U_GC_EMP1,   "tm-tube-gb",    4.6,  20, 3),
        ]
        for (user_id, mode_id, dist, dur, days_per_wk) in employee_commutes:
            ef_id, label, ef_val = mode_ef_map[mode_id]
            for day_offset in range(90):
                dt = d(90 - day_offset)
                if dt.weekday() >= 5:
                    continue  # skip weekends
                # Some remote days
                if days_per_wk < 5 and dt.weekday() == 4:
                    continue
                emissions = round(dist * ef_val, 4)
                pts = max(10, int(50 - emissions * 100))
                session.add(CommuteEntry(
                    user_id=user_id, commute_date=dt,
                    transport_mode_id=mode_id, transport_mode_label=label,
                    distance_km=dist, duration_minutes=dur,
                    emissions_kg_co2=emissions, emission_factor_id=ef_id,
                    emission_factor_value=ef_val, is_return_trip=True,
                    oxypoints_earned=pts,
                    verification_method=VerificationMethodEnum.GPS,
                ))
        await session.flush()

        # ── OxyPoints Ledger ───────────────────────────────────────────────
        print("Seeding OxyPoints ledger...")
        oxypoints_entries = [
            (U_ACME_EMP1, 450,  PointsReasonEnum.RIDE,         "90 days of DART commutes",          utc(90)),
            (U_ACME_EMP1, 100,  PointsReasonEnum.ACHIEVEMENT,  "First green commute achievement",    utc(85)),
            (U_ACME_EMP1, 50,   PointsReasonEnum.STREAK_BONUS, "7-day commute streak bonus",         utc(60)),
            (U_ACME_EMP1, 200,  PointsReasonEnum.CHALLENGE,    "April Eco Challenge completed",      utc(20)),
            (U_ACME_EMP1, -150, PointsReasonEnum.REDEMPTION,   "Redeemed for coffee voucher",        utc(10)),
            (U_ACME_EMP2, 320,  PointsReasonEnum.RIDE,         "Luas commute streak",               utc(90)),
            (U_ACME_EMP2, 75,   PointsReasonEnum.ACHIEVEMENT,  "Low-emission champion badge",        utc(40)),
            (U_ACME_EMP3, 600,  PointsReasonEnum.RIDE,         "Cycling commute bonus",             utc(90)),
            (U_ACME_EMP3, 200,  PointsReasonEnum.ACHIEVEMENT,  "Zero-emission streak achievement",  utc(50)),
            (U_ACME_EMP3, 100,  PointsReasonEnum.REFERRAL,     "Referred Liam to carpooling",       utc(30)),
            (U_ACME_EMP4, 280,  PointsReasonEnum.RIDE,         "Walking commute log",               utc(90)),
            (U_ACME_EMP5, 150,  PointsReasonEnum.RIDE,         "Car commute base points",           utc(90)),
            (U_TC_EMP1,   380,  PointsReasonEnum.RIDE,         "Bus commute log",                   utc(90)),
            (U_TC_EMP1,   50,   PointsReasonEnum.FIRST_RIDE_OF_DAY, "First ride bonus",             utc(45)),
        ]
        for (user_id, pts, reason, desc, ts) in oxypoints_entries:
            session.add(OxyPointsLedger(
                user_id=user_id, points=pts, reason=reason, description=desc, created_at=ts,
            ))
        await session.flush()

        # ── User Achievements ──────────────────────────────────────────────
        print("Seeding achievements...")
        achievements = [
            (U_ACME_EMP1, "ach-green-commuter",  "Green Commuter",     "Completed 30 low-emission commutes",     "🌿", AchievementCategoryEnum.CO2,    AchievementRarityEnum.COMMON,    30,  30,  True,  100, utc(60)),
            (U_ACME_EMP1, "ach-streak-7",        "Week Warrior",       "7-day commute streak",                   "🔥", AchievementCategoryEnum.STREAK, AchievementRarityEnum.COMMON,    7,   7,   True,  50,  utc(55)),
            (U_ACME_EMP1, "ach-first-ride",      "First Steps",        "Logged your first commute",              "🚶", AchievementCategoryEnum.RIDES,  AchievementRarityEnum.COMMON,    1,   1,   True,  10,  utc(90)),
            (U_ACME_EMP1, "ach-carpool-hero",    "Carpool Hero",       "Shared 10 rides with colleagues",        "🚗", AchievementCategoryEnum.SOCIAL, AchievementRarityEnum.RARE,      10,  6,   False, 150, None),
            (U_ACME_EMP2, "ach-first-ride",      "First Steps",        "Logged your first commute",              "🚶", AchievementCategoryEnum.RIDES,  AchievementRarityEnum.COMMON,    1,   1,   True,  10,  utc(88)),
            (U_ACME_EMP2, "ach-low-carbon",      "Low Carbon Legend",  "Saved 50kg CO₂ vs solo car",             "🏆", AchievementCategoryEnum.CO2,    AchievementRarityEnum.RARE,      50,  38,  False, 200, None),
            (U_ACME_EMP3, "ach-zero-emission",   "Zero Emission Star", "30 days of zero-emission commutes",      "⭐", AchievementCategoryEnum.CO2,    AchievementRarityEnum.EPIC,      30,  30,  True,  300, utc(45)),
            (U_ACME_EMP3, "ach-cyclist-pro",     "Cyclist Pro",        "Cycled 200km total",                     "🚴", AchievementCategoryEnum.RIDES,  AchievementRarityEnum.RARE,      200, 200, True,  150, utc(30)),
            (U_ACME_EMP3, "ach-first-ride",      "First Steps",        "Logged your first commute",              "🚶", AchievementCategoryEnum.RIDES,  AchievementRarityEnum.COMMON,    1,   1,   True,  10,  utc(89)),
            (U_ACME_EMP4, "ach-first-ride",      "First Steps",        "Logged your first commute",              "🚶", AchievementCategoryEnum.RIDES,  AchievementRarityEnum.COMMON,    1,   1,   True,  10,  utc(87)),
            (U_ACME_EMP4, "ach-walker",          "City Walker",        "Walked 100km to work",                   "👟", AchievementCategoryEnum.RIDES,  AchievementRarityEnum.COMMON,    100, 82,  False, 75,  None),
        ]
        for (uid_, ach_id, name, desc, icon, cat, rarity, req, prog, unlocked, pts, unlocked_at) in achievements:
            session.add(UserAchievement(
                user_id=uid_, achievement_id=ach_id, name=name, description=desc, icon=icon,
                category=cat, rarity=rarity, requirement=req, progress=prog,
                is_unlocked=unlocked, points_awarded=pts, unlocked_at=unlocked_at,
            ))

        # ── User Badges ────────────────────────────────────────────────────
        badges = [
            (U_ACME_EMP1, "Green Commuter",   "Consistent low-emission travel",  "🌿", "#22c55e", utc(60)),
            (U_ACME_EMP1, "Streak Master",    "Maintained a 7-day streak",       "🔥", "#f97316", utc(55)),
            (U_ACME_EMP3, "Zero Hero",        "30 days of zero emissions",       "⭐", "#a855f7", utc(45)),
            (U_ACME_EMP3, "Cycling Champion", "Cycled 200km to work",            "🚴", "#3b82f6", utc(30)),
        ]
        for (uid_, name, desc, icon, color, earned_at) in badges:
            session.add(UserBadge(user_id=uid_, name=name, description=desc, icon=icon, color=color, earned_at=earned_at))
        await session.flush()

        # ── Challenges ─────────────────────────────────────────────────────
        print("Seeding challenges...")
        ch1_id = uid()
        ch2_id = uid()
        ch3_id = uid()
        challenges = [
            Challenge(id=ch1_id, tenant_id=T_ACME, name="April Eco Challenge",        description="Log 20 low-emission commutes this month to earn bonus OxyPoints",         type=ChallengeTypeEnum.MONTHLY, start_date=utc(30), end_date=utc(-1),  goal=20, reward_points=200, reward_badge="Eco April Badge",  status=ChallengeStatusEnum.ACTIVE,    participant_count=47),
            Challenge(id=ch2_id, tenant_id=T_ACME, name="Carpool May",                description="Share at least 5 rides with colleagues during May",                       type=ChallengeTypeEnum.MONTHLY, start_date=utc(5),  end_date=utc(-25), goal=5,  reward_points=150, reward_badge="Carpool Badge",     status=ChallengeStatusEnum.ACTIVE,    participant_count=31),
            Challenge(id=ch3_id, tenant_id=T_ACME, name="Zero Emission Week",         description="Achieve zero-emission commutes every day this week",                      type=ChallengeTypeEnum.WEEKLY,  start_date=utc(2),  end_date=utc(-5),  goal=5,  reward_points=100, reward_badge=None,                status=ChallengeStatusEnum.ACTIVE,    participant_count=18),
            Challenge(id=uid(),  tenant_id=T_TC,   name="TechCorp Green March",       description="50 team green commutes in March",                                         type=ChallengeTypeEnum.MONTHLY, start_date=utc(60), end_date=utc(30),  goal=50, reward_points=300, reward_badge="Team Green Badge",  status=ChallengeStatusEnum.COMPLETED, participant_count=22),
        ]
        for ch in challenges:
            session.add(ch)
        await session.flush()

        cp_entries = [
            (ch1_id, U_ACME_EMP1, 20, True,  utc(1)),
            (ch1_id, U_ACME_EMP2, 14, False, None),
            (ch1_id, U_ACME_EMP3, 20, True,  utc(3)),
            (ch2_id, U_ACME_EMP1, 3,  False, None),
            (ch3_id, U_ACME_EMP3, 5,  True,  utc(1)),
        ]
        for (ch_id, uid_, prog, done, done_at) in cp_entries:
            session.add(ChallengeParticipant(challenge_id=ch_id, user_id=uid_, progress=prog, completed=done, completed_at=done_at, joined_at=utc(25)))
        await session.flush()

        # ── Recurring Ride Templates ───────────────────────────────────────
        print("Seeding recurring ride templates...")
        tmpl1_id = uid()
        tmpl2_id = uid()
        session.add(RecurringRideTemplate(
            id=tmpl1_id, user_id=U_ACME_EMP1,
            name="Daily DART + Walk",
            description="Take DART from Griffith Ave to Connolly, walk to office",
            origin_address="Griffith Avenue DART Stop, Dublin 9",
            origin_lat=53.3736, origin_lng=-6.2521,
            destination_address="Acme Dublin HQ, Dublin 2",
            destination_lat=53.3498, destination_lng=-6.2603,
            departure_time="08:15", pattern=RecurringPatternEnum.WEEKLY,
            days_of_week=[0, 1, 2, 3, 4], start_date=d(90),
            seats=1, is_driver=False, auto_accept=False, notification_enabled=True,
            status=TemplateStatusEnum.ACTIVE,
            total_rides_generated=62, total_rides_completed=58,
            total_co2_saved=47.6, average_passengers=1.0,
        ))
        session.add(RecurringRideTemplate(
            id=tmpl2_id, user_id=U_ACME_EMP5,
            name="Galway Carpool Mon/Wed/Fri",
            description="Offering carpool from Salthill to Acme Galway campus",
            origin_address="Salthill Road, Galway",
            origin_lat=53.2635, origin_lng=-9.0850,
            destination_address="Acme Galway Campus, Galway",
            destination_lat=53.2707, destination_lng=-9.0568,
            departure_time="08:30", pattern=RecurringPatternEnum.WEEKLY,
            days_of_week=[0, 2, 4], start_date=d(60),
            seats=3, is_driver=True, auto_accept=True, notification_enabled=True,
            status=TemplateStatusEnum.ACTIVE,
            total_rides_generated=26, total_rides_completed=24,
            total_co2_saved=39.2, average_passengers=2.4,
        ))
        await session.flush()

        # ── Rides (Carpooling) ─────────────────────────────────────────────
        print("Seeding rides...")
        ride1_id = uid(); ride2_id = uid(); ride3_id = uid()
        ride4_id = uid(); ride5_id = uid()
        rides = [
            Ride(id=ride1_id, driver_id=U_ACME_EMP5,
                 origin="Salthill Road, Galway", origin_lat=53.2635, origin_lng=-9.0850,
                 destination="Acme Galway Campus", destination_lat=53.2707, destination_lng=-9.0568,
                 departure_time=utc(-1, -8), distance_km=6.2, seats_available=1, seats_total=3,
                 co2_saved=2.12, vehicle_type=VehicleTypeEnum.SEDAN, vehicle_make="Toyota Corolla",
                 status=RideStatusEnum.COMPLETED, is_recurring=True, recurring_template_id=tmpl2_id,
                 share_code="ACGAL01",
                 preferences={"musicPreference": "music", "conversationLevel": "chatty", "allowsPets": False, "allowsSmoking": False}),
            Ride(id=ride2_id, driver_id=U_ACME_EMP5,
                 origin="Salthill Road, Galway", origin_lat=53.2635, origin_lng=-9.0850,
                 destination="Acme Galway Campus", destination_lat=53.2707, destination_lng=-9.0568,
                 departure_time=utc(0, -8), distance_km=6.2, seats_available=2, seats_total=3,
                 co2_saved=0.0, vehicle_type=VehicleTypeEnum.SEDAN, vehicle_make="Toyota Corolla",
                 status=RideStatusEnum.SCHEDULED, is_recurring=True, recurring_template_id=tmpl2_id,
                 share_code="ACGAL02",
                 preferences={"musicPreference": "music", "conversationLevel": "chatty", "allowsPets": False, "allowsSmoking": False}),
            Ride(id=ride3_id, driver_id=U_ACME_EMP2,
                 origin="Rathgar Road, Dublin 6", origin_lat=53.3187, origin_lng=-6.2762,
                 destination="Acme Dublin HQ", destination_lat=53.3498, destination_lng=-6.2603,
                 departure_time=utc(0, -7), distance_km=5.4, seats_available=1, seats_total=2,
                 co2_saved=0.0, vehicle_type=VehicleTypeEnum.ELECTRIC, vehicle_make="Nissan Leaf",
                 status=RideStatusEnum.SCHEDULED, is_recurring=False,
                 share_code="ACDUB01",
                 preferences={"musicPreference": "quiet", "conversationLevel": "no-preference", "allowsPets": False, "allowsSmoking": False}),
            Ride(id=ride4_id, driver_id=U_TC_EMP2,
                 origin="O'Connell Ave, Limerick", origin_lat=52.6652, origin_lng=-8.6298,
                 destination="TechCorp Limerick", destination_lat=52.6638, destination_lng=-8.6267,
                 departure_time=utc(-2, -8), distance_km=0.9, seats_available=0, seats_total=2,
                 co2_saved=0.31, vehicle_type=VehicleTypeEnum.HYBRID, vehicle_make="Toyota Prius",
                 status=RideStatusEnum.COMPLETED, is_recurring=False,
                 share_code="TCLIM01",
                 preferences={"allowsPets": False, "allowsSmoking": False}),
            Ride(id=ride5_id, driver_id=U_ACME_EMP1,
                 origin="Griffith Ave, Dublin 9", origin_lat=53.3736, origin_lng=-6.2521,
                 destination="Acme Dublin HQ", destination_lat=53.3498, destination_lng=-6.2603,
                 departure_time=utc(-1, -8), distance_km=8.2, seats_available=2, seats_total=3,
                 co2_saved=0.0, vehicle_type=VehicleTypeEnum.SEDAN, vehicle_make="VW Golf",
                 status=RideStatusEnum.SCHEDULED, is_recurring=False,
                 share_code="ACDUB02",
                 preferences={"musicPreference": "podcast", "conversationLevel": "chatty", "allowsPets": False, "allowsSmoking": False}),
        ]
        for r in rides:
            session.add(r)
        await session.flush()

        # ── Ride Requests ──────────────────────────────────────────────────
        ride_requests = [
            RideRequest(ride_id=ride1_id, passenger_id=U_ACME_EMP3, status=RideRequestStatusEnum.ACCEPTED,
                        pickup_address="Bóthar na Trá, Galway", pickup_lat=53.2647, pickup_lng=-9.0741,
                        message="Can you pick me up near the beach road?", requested_at=utc(3), responded_at=utc(3, -1)),
            RideRequest(ride_id=ride1_id, passenger_id=U_ACME_EMP4, status=RideRequestStatusEnum.ACCEPTED,
                        pickup_address="Sea Road, Galway",           pickup_lat=53.2669, pickup_lng=-9.0631,
                        message="I'm near the sea road junction",     requested_at=utc(3), responded_at=utc(3, -1)),
            RideRequest(ride_id=ride2_id, passenger_id=U_ACME_EMP3, status=RideRequestStatusEnum.PENDING,
                        pickup_address="Bóthar na Trá, Galway", pickup_lat=53.2647, pickup_lng=-9.0741,
                        message="Same pickup as yesterday please",    requested_at=utc(0, 2)),
            RideRequest(ride_id=ride3_id, passenger_id=U_ACME_EMP1, status=RideRequestStatusEnum.PENDING,
                        pickup_address="Rathmines Road, Dublin 6",   pickup_lat=53.3218, pickup_lng=-6.2684,
                        message="Heading to HQ — any chance of a lift?", requested_at=utc(0, 1)),
            RideRequest(ride_id=ride4_id, passenger_id=U_TC_EMP3,   status=RideRequestStatusEnum.ACCEPTED,
                        pickup_address="Henry Street, Limerick",     pickup_lat=52.6659, pickup_lng=-8.6308,
                        message="See you at the usual spot",          requested_at=utc(3), responded_at=utc(2, 22)),
        ]
        for rr in ride_requests:
            session.add(rr)
        await session.flush()

        # ── Messages ───────────────────────────────────────────────────────
        print("Seeding messages...")
        thread1_id = uid(); thread2_id = uid()
        session.add(MessageThread(id=thread1_id, type=ThreadTypeEnum.RIDE, title="Galway Carpool — Today",
                                   linked_ride_id=ride2_id, last_message_at=utc(0, 2),
                                   last_message_preview="See you at the usual stop!"))
        session.add(MessageThread(id=thread2_id, type=ThreadTypeEnum.DIRECT, title="Ciara & Liam",
                                   last_message_at=utc(1), last_message_preview="Want to share tomorrow?"))
        await session.flush()

        for (uid_, role_, online) in [(U_ACME_EMP5, "driver", True), (U_ACME_EMP3, "passenger", False)]:
            session.add(ThreadParticipant(thread_id=thread1_id, user_id=uid_, role=role_,
                                          is_online=online, last_seen=utc(0, 1), unread_count=0 if online else 1,
                                          joined_at=utc(5)))
        for (uid_, role_) in [(U_ACME_EMP1, "member"), (U_ACME_EMP2, "member")]:
            session.add(ThreadParticipant(thread_id=thread2_id, user_id=uid_, role=role_,
                                          is_online=False, last_seen=utc(1), unread_count=1, joined_at=utc(10)))
        await session.flush()

        msg_data = [
            (thread1_id, U_ACME_EMP3, "Niamh Fitzgerald", "Are you driving today?",                MessageTypeEnum.TEXT, utc(0, 4)),
            (thread1_id, U_ACME_EMP5, "Emer Hayes",       "Yes! Leaving Salthill at 8:30 sharp",   MessageTypeEnum.TEXT, utc(0, 3)),
            (thread1_id, U_ACME_EMP3, "Niamh Fitzgerald", "See you at the usual stop! 🚗",         MessageTypeEnum.TEXT, utc(0, 2)),
            (thread2_id, U_ACME_EMP1, "Ciara Brennan",    "Hey Liam, want to share a ride tomorrow?", MessageTypeEnum.TEXT, utc(1, 2)),
            (thread2_id, U_ACME_EMP2, "Liam Doyle",       "Sure! I can swing by Rathmines at 8am", MessageTypeEnum.TEXT, utc(1, 1)),
        ]
        for (th_id, sender_id, sender_name, content, msg_type, ts) in msg_data:
            session.add(Message(thread_id=th_id, sender_id=sender_id, sender_name=sender_name,
                                content=content, type=msg_type, is_read=True,
                                created_at=ts))
        await session.flush()

        # ── Emission Records (monthly aggregates) ──────────────────────────
        print("Seeding emission records...")
        monthly_em = [
            (T_ACME, O_ACME_DUB, "2025-05", 520.8, 182400, 4820, 1200),
            (T_ACME, O_ACME_DUB, "2025-06", 498.3, 175200, 4650, 1200),
            (T_ACME, O_ACME_DUB, "2025-07", 472.1, 166800, 4410, 1200),
            (T_ACME, O_ACME_DUB, "2025-08", 461.5, 163200, 4320, 1200),
            (T_ACME, O_ACME_DUB, "2025-09", 489.2, 171600, 4560, 1200),
            (T_ACME, O_ACME_DUB, "2025-10", 501.7, 175800, 4680, 1200),
            (T_ACME, O_ACME_DUB, "2025-11", 485.2, 170400, 4520, 1200),
            (T_ACME, O_ACME_DUB, "2025-12", 453.4, 159600, 4200, 1200),
            (T_ACME, O_ACME_DUB, "2026-01", 441.8, 155400, 4100, 1200),
            (T_ACME, O_ACME_DUB, "2026-02", 435.6, 153000, 4020, 1200),
            (T_ACME, O_ACME_DUB, "2026-03", 428.4, 150600, 3980, 1200),
            (T_ACME, O_ACME_DUB, "2026-04", 412.1, 144600, 3820, 1200),
            (T_ACME, O_ACME_CORK,"2025-05", 212.5,  74400, 1970,  480),
            (T_ACME, O_ACME_CORK,"2026-04", 187.3,  65400, 1730,  480),
            (T_ACME, O_ACME_GAL, "2025-05", 158.4,  55200, 1460,  320),
            (T_ACME, O_ACME_GAL, "2026-04", 138.6,  48600, 1280,  320),
            (T_TC,   O_TC_DUB,   "2025-05", 108.2,  37800, 1010,  280),
            (T_TC,   O_TC_DUB,   "2026-04",  92.4,  32400,  860,  280),
            (T_GC,   O_GC_LON,   "2025-05",  81.6,  28200,  760,  190),
            (T_GC,   O_GC_LON,   "2026-04",  68.9,  24000,  640,  190),
        ]
        for (t_id, o_id, period, em, dist, commutes, emp) in monthly_em:
            session.add(EmissionRecord(
                tenant_id=t_id, office_id=o_id, period=period, period_type="monthly",
                total_emissions_kg=em * 1000, total_distance_km=dist,
                total_commutes=commutes, employee_count=emp,
                intensity_per_employee=round((em * 1000) / emp, 2),
                forecast_emissions_kg=em * 1000 * 0.95,
                target_emissions_kg=em * 1000 * 0.80,
            ))
        await session.flush()

        # ── Baselines ──────────────────────────────────────────────────────
        print("Seeding baselines...")
        baselines = [
            (T_ACME, 2022, 1240.5, "Historical transport records + SEAI data", True,  U_ACME_SUS, utc(180)),
            (T_ACME, 2023, 1185.2, "Fleet survey + commute diary study",        True,  U_ACME_SUS, utc(90)),
            (T_ACME, 2024, 1098.4, "GPS-verified commute data via CoShyft",     False, None,        None),
            (T_TC,   2022,  412.8, "TechCorp employee survey 2022",             True,  U_TC_SUS,   utc(150)),
            (T_TC,   2023,  389.1, "Enhanced GPS tracking programme",           True,  U_TC_SUS,   utc(60)),
            (T_GC,   2022,  298.3, "GreenCo UK fleet and commute records",      True,  U_GC_SUS,   utc(120)),
        ]
        for (t_id, yr, em, src, locked, approved_by, approved_date) in baselines:
            session.add(Baseline(
                id=uid(), tenant_id=t_id, year=yr, emissions=em,
                offices=[O_ACME_DUB, O_ACME_CORK, O_ACME_GAL] if t_id == T_ACME else [O_TC_DUB],
                legal_entities=[t_id], data_source=src,
                emission_factor_version="2024.1", locked=locked,
                approved_by=approved_by, approved_date=approved_date,
            ))
        await session.flush()

        # ── Initiatives ────────────────────────────────────────────────────
        print("Seeding initiatives...")
        initiatives = [
            (T_ACME, "EV Fleet Transition Programme",    "Aoife Kelly",  450000, 180.0,  92.4,  InitiativeStatusEnum.ACTIVE,    d(180), d(-180), "Replace 40% of employee cars with EVs by end of 2026"),
            (T_ACME, "Bike to Work Expansion",           "Aoife Kelly",   85000,  95.0,  68.1,  InitiativeStatusEnum.ACTIVE,    d(120), d(-90),  "Subsidise 200 bike purchases and install secure parking"),
            (T_ACME, "TaxSaver Public Transport Scheme", "James O'Brien", 32000, 120.0, 110.0,  InitiativeStatusEnum.COMPLETED, d(365), d(90),   "Corporate TaxSaver ticket scheme for all Dublin employees"),
            (T_ACME, "Remote Work Policy Update",        "Aoife Kelly",   12000,  85.0,  41.0,  InitiativeStatusEnum.ACTIVE,    d(60),  d(-120), "Formalise 2-day remote work allowance to reduce commuting"),
            (T_ACME, "Carpool Incentive Programme",      "James O'Brien", 24000,  60.0,  18.5,  InitiativeStatusEnum.ACTIVE,    d(30),  d(-240), "OxyPoints bonus for verified carpooling"),
            (T_ACME, "Galway Campus Shuttle Bus",        "Aoife Kelly",  160000, 200.0,   0.0,  InitiativeStatusEnum.PENDING,   d(-60), d(-365), "Dedicated campus shuttle from Galway city centre"),
            (T_TC,   "Green Commute Champions",          "Patrick Connolly", 18000, 45.0, 28.3, InitiativeStatusEnum.ACTIVE,   d(90),  d(-90),  "Monthly award for greenest commute department"),
            (T_GC,   "London Cycle to Work",             "Oliver Smith",  55000,  88.0,  52.1,  InitiativeStatusEnum.ACTIVE,    d(150), d(-150), "Expand Cycle to Work scheme with e-bike subsidy"),
        ]
        for (t_id, name, owner, budget, exp_red, act_red, status, start, end, desc) in initiatives:
            session.add(Initiative(
                id=uid(), tenant_id=t_id, name=name, owner=owner, budget=budget,
                expected_reduction=exp_red, actual_reduction=act_red, status=status,
                start_date=start, end_date=end, description=desc,
            ))
        await session.flush()

        # ── Scenarios ──────────────────────────────────────────────────────
        print("Seeding scenarios...")
        scenarios = [
            (T_ACME, "EV + Carpool Optimistic", "60% EV adoption, carpool rate doubled, 3 remote days",   0.40, 3, 0.60, 0.20, 420.0, 3.2, 4.1, U_ACME_SUS),
            (T_ACME, "Public Transport Push",   "Subsidised TaxSaver + bus routes extended",               0.10, 2, 0.15, 0.35, 285.0, 2.1, 5.8, U_ACME_SUS),
            (T_ACME, "Remote First Model",      "4 days remote, only core staff in office",               0.05, 4, 0.10, 0.10, 510.0, 4.8, 2.9, U_ACME_SUS),
            (T_TC,   "Hybrid Fleet 2026",       "50% hybrid fleet + enhanced bus subsidy",                0.20, 2, 0.50, 0.25, 142.0, 1.8, 3.5, U_TC_SUS),
        ]
        for (t_id, name, desc, cp, remote, ev, pt, em_red, roi, payback, creator) in scenarios:
            session.add(Scenario(
                id=uid(), tenant_id=t_id, name=name, description=desc,
                carpool_increase=cp, remote_days=remote, ev_adoption=ev,
                public_transport_increase=pt, emissions_reduced=em_red,
                roi=roi, payback=payback, created_by=creator,
                parameters={"baseline_year": 2023, "projection_year": 2026},
            ))
        await session.flush()

        # ── Risks ──────────────────────────────────────────────────────────
        print("Seeding risks...")
        risks = [
            (T_ACME, "CSRD Non-Compliance Penalty",    "Failure to meet CSRD/ESRS E1 reporting deadlines may result in regulatory fines up to €500,000",              RiskLikelihoodEnum.MEDIUM, RiskImpactEnum.HIGH,   500000.0, "Aoife Kelly",  RiskStatusEnum.MITIGATING, "Engage external auditor; accelerate CoShyft data capture"),
            (T_ACME, "Data Quality Below Threshold",   "Commute data coverage below 70% will fail SEAI verification standards",                                       RiskLikelihoodEnum.LOW,    RiskImpactEnum.HIGH,   150000.0, "Aoife Kelly",  RiskStatusEnum.MITIGATING, "Mandatory GPS verification for all commute logs"),
            (T_ACME, "EV Charging Infrastructure Gap", "Insufficient EV chargers may slow adoption and fail to meet fleet transition targets",                         RiskLikelihoodEnum.HIGH,   RiskImpactEnum.MEDIUM,  80000.0, "James O'Brien",RiskStatusEnum.OPEN,       "Tender for 30 additional EV chargers across 3 offices"),
            (T_ACME, "Employee Participation Decline", "Participation below 60% threatens CSRD Category 7 reporting completeness",                                    RiskLikelihoodEnum.LOW,    RiskImpactEnum.MEDIUM,  40000.0, "James O'Brien",RiskStatusEnum.OPEN,       "Launch OxyPoints incentive campaign Q2"),
            (T_ACME, "Emission Factor Version Change", "SEAI may update 2025 emission factors; retroactive recalculations needed",                                    RiskLikelihoodEnum.MEDIUM, RiskImpactEnum.LOW,     10000.0, "Aoife Kelly",  RiskStatusEnum.OPEN,       "Version-controlled factors; auto-recalc pipeline"),
            (T_TC,   "CSRD Readiness Gap",             "TechCorp lacks baseline data prior to 2022 which is required for ESRS E1 comparatives",                      RiskLikelihoodEnum.HIGH,   RiskImpactEnum.HIGH,   200000.0, "Patrick Connolly", RiskStatusEnum.MITIGATING, "Commission retrospective employee transport survey"),
            (T_GC,   "DEFRA Factor Update Risk",       "UK DEFRA annual factor updates may require retroactive adjustment of GreenCo emissions inventory",            RiskLikelihoodEnum.MEDIUM, RiskImpactEnum.MEDIUM,  35000.0, "Oliver Smith", RiskStatusEnum.OPEN,       "Quarterly factor review process; automated alerts"),
        ]
        for (t_id, title, desc, likelihood, impact, exposure, owner, status, mitigation) in risks:
            session.add(Risk(
                id=uid(), tenant_id=t_id, title=title, description=desc,
                likelihood=likelihood, impact=impact, financial_exposure=exposure,
                owner=owner, status=status, mitigation_plan=mitigation,
            ))
        await session.flush()

        # ── Policies ───────────────────────────────────────────────────────
        print("Seeding policies...")
        policies = [
            (T_ACME, "Sustainable Commuting Policy",    "corporate",     PolicyStatusEnum.ACTIVE,   d(180), U_ACME_ADMIN, "All employees encouraged to use public transport, cycling or carpooling. OxyPoints awarded for green commutes."),
            (T_ACME, "Remote Work Policy 2024",         "workplace",     PolicyStatusEnum.ACTIVE,   d(90),  U_ACME_ADMIN, "Employees may work remotely up to 2 days per week with manager approval. Remote days reduce commuting emissions."),
            (T_ACME, "EV Charging Usage Policy",        "facilities",    PolicyStatusEnum.ACTIVE,   d(60),  U_ACME_ADMIN, "EV charging reserved for registered employee EVs. Maximum 8-hour charge limit per session."),
            (T_ACME, "Data Privacy — Commute Tracking", "gdpr",          PolicyStatusEnum.ACTIVE,   d(45),  U_ACME_ADMIN, "GPS commute data is anonymised for reporting. Individual routes are never shared with managers without consent."),
            (T_ACME, "Car Sharing Liability Policy",    "legal",         PolicyStatusEnum.DRAFT,    None,   U_ACME_ADMIN, "Draft policy defining liability, insurance requirements, and eligibility for corporate carpool scheme."),
            (T_TC,   "Green Transport Allowance",       "corporate",     PolicyStatusEnum.ACTIVE,   d(120), U_TC_ADMIN,   "TechCorp will subsidise 50% of TaxSaver commuter tickets for all full-time Dublin employees."),
            (T_GC,   "Cycle to Work Scheme Policy",     "workplace",     PolicyStatusEnum.ACTIVE,   d(90),  U_GC_ADMIN,   "GreenCo UK Cycle to Work scheme covers bicycles and e-bikes up to £1,500. Salary sacrifice arrangement."),
        ]
        for (t_id, title, category, status, eff_date, creator, desc) in policies:
            session.add(Policy(
                id=uid(), tenant_id=t_id, title=title, description=desc,
                category=category, status=status, effective_date=eff_date, created_by=creator,
            ))
        await session.flush()

        # ── Alerts ─────────────────────────────────────────────────────────
        print("Seeding alerts...")
        alerts = [
            (T_ACME, AlertSeverityEnum.CRITICAL, "CSRD Q1 Report Overdue",          "Q1 2026 CSRD emissions report has not been submitted. Deadline was 2026-04-15. Regulatory risk is HIGH.",          "sustainability,admin", utc(7)),
            (T_ACME, AlertSeverityEnum.CRITICAL, "Data Coverage Below 65%",          "Acme Galway office commute data coverage is 61%. SEAI minimum is 70%. Immediate action required.",                 "sustainability",       utc(5)),
            (T_ACME, AlertSeverityEnum.WARNING,  "Emission Spike — Cork Office",     "Cork office emissions increased 18% in April vs March. Investigate cause and apply corrective action.",             "sustainability,admin", utc(3)),
            (T_ACME, AlertSeverityEnum.WARNING,  "EV Charger Utilisation at 94%",   "Dublin HQ EV chargers at near capacity. Consider installing additional units before summer.",                        "admin",                utc(2)),
            (T_ACME, AlertSeverityEnum.WARNING,  "Participation Rate Dropping",      "Acme Galway participation rate fell from 58% to 54% this month. Review incentives.",                                "admin,sustainability", utc(1)),
            (T_ACME, AlertSeverityEnum.INFO,     "New Emission Factors Available",   "SEAI has published updated 2025 emission factors. Review and approve in Data Governance → Emission Factors.",       "sustainability",       utc(0, 4)),
            (T_ACME, AlertSeverityEnum.INFO,     "Carpool Challenge Ending Soon",    "The April Eco Challenge ends in 3 days. 47 participants, 34 have met their target.",                                "employee,admin",       utc(0, 2)),
            (T_TC,   AlertSeverityEnum.WARNING,  "Baseline Data Missing Pre-2022",   "TechCorp ESRS E1 reporting requires 2021 baseline. No data on record. Risk of CSRD non-compliance.",               "sustainability",       utc(4)),
            (T_GC,   AlertSeverityEnum.INFO,     "DEFRA 2025 Factors Released",      "DEFRA has published 2025 emission conversion factors. Update required before June 2026 reporting.",                  "sustainability",       utc(1)),
        ]
        for (t_id, severity, title, desc, roles, ts) in alerts:
            session.add(Alert(tenant_id=t_id, severity=severity, title=title, description=desc,
                              target_roles=roles, timestamp=ts, resolved=False, dismissed=False,
                              linked_entity="report", linked_entity_id=t_id))
        await session.flush()

        # ── Evidence Items ─────────────────────────────────────────────────
        print("Seeding evidence items...")
        evidence_items = [
            (T_ACME, "Acme 2023 Commute Survey Report",      "Annual commute survey conducted across all Acme offices, 1,480 respondents",  "acme_commute_survey_2023.pdf",   "application/pdf",  2841600, "survey",     EvidenceStatusEnum.VERIFIED, U_ACME_SUS, U_ACME_AUD, utc(80)),
            (T_ACME, "SEAI 2024 Emission Factors Reference", "Official SEAI 2024 emission factor publication used as basis for calculations", "seai_factors_2024.pdf",          "application/pdf",  1228800, "methodology",EvidenceStatusEnum.VERIFIED, U_ACME_SUS, U_ACME_AUD, utc(60)),
            (T_ACME, "Dublin Office GPS Data Export Q1 2026","Anonymised GPS commute data export for Dublin HQ, Q1 2026, 4,820 entries",    "dublin_gps_q1_2026.xlsx",        "application/xlsx", 3145728, "raw_data",   EvidenceStatusEnum.VERIFIED, U_ACME_SUS, U_ACME_AUD, utc(30)),
            (T_ACME, "EV Fleet Transition Progress Report",  "Quarterly progress report on EV fleet transition initiative as of Q1 2026",    "ev_fleet_progress_q1_2026.pdf",  "application/pdf",  1843200, "initiative", EvidenceStatusEnum.UNDER_REVIEW, U_ACME_SUS, None, utc(10)),
            (T_ACME, "Bike to Work Scheme Invoices",         "Bundle of 87 bike purchase invoices submitted under the Bike to Work Scheme",   "bike_invoices_2025.pdf",         "application/pdf",   921600, "policy",     EvidenceStatusEnum.VERIFIED, U_ACME_ADMIN,U_ACME_AUD, utc(45)),
            (T_ACME, "Cork Office Emission Anomaly Report",  "Investigation report on the 18% emission spike in Cork office April 2026",      "cork_anomaly_apr_2026.docx",     "application/docx",  512000, "audit",      EvidenceStatusEnum.UPLOADED, U_ACME_SUS, None, utc(2)),
            (T_TC,   "TechCorp 2023 Baseline Estimate",      "Retrospective baseline estimate for TechCorp Ireland using transport survey",    "techcorp_baseline_est_2023.pdf", "application/pdf",  1024000, "baseline",   EvidenceStatusEnum.UNDER_REVIEW, U_TC_SUS, None, utc(20)),
        ]
        for (t_id, title, desc, fname, mime, fsize, cat, status, uploader, verifier, ts) in evidence_items:
            session.add(EvidenceItem(
                id=uid(), tenant_id=t_id, title=title, description=desc,
                file_name=fname, file_url=f"https://storage.coshyft.io/{t_id}/{fname}",
                file_size_bytes=fsize, mime_type=mime, category=cat,
                status=status, uploaded_by=uploader,
                verified_by=verifier, verified_at=ts if verifier else None,
                linked_entity_type=EntityTypeEnum.ADMIN_SETTINGS, linked_entity_id=t_id,
            ))
        await session.flush()

        # ── Audit Findings ─────────────────────────────────────────────────
        print("Seeding audit findings...")
        findings = [
            (T_ACME, "Galway Office Data Gap",           "Commute data coverage for Galway is only 61%, below the 70% SEAI minimum. 124 employees have not logged any commutes in Q1 2026.",          FindingSeverityEnum.HIGH,   FindingStatusEnum.IN_PROGRESS, "commute_data", U_ACME_AUD, U_ACME_SUS, "Mandate GPS app use for all Galway employees; set completion deadline"),
            (T_ACME, "Missing 2021 Pre-Baseline Data",   "No commute data exists prior to the 2022 baseline year. ESRS E1 requires 3 years of comparative data for full compliance.",                 FindingSeverityEnum.CRITICAL,FindingStatusEnum.OPEN,        "baseline",     U_ACME_AUD, U_ACME_SUS, None),
            (T_ACME, "Emission Factor Version Mismatch", "Cork office Q3 2025 records used SEAI 2023 factors instead of 2024. Recalculation will affect 198.6 tCO₂e.",                                FindingSeverityEnum.MEDIUM, FindingStatusEnum.RESOLVED,    "emission_factors", U_ACME_AUD, U_ACME_SUS, "Recalculation completed 2026-03-15. Corrected records confirmed."),
            (T_ACME, "Car Park Badge Data Not Integrated","Car park access badge data has not been integrated with commute logs. Opportunity to automate car commute verification.",                   FindingSeverityEnum.LOW,    FindingStatusEnum.OPEN,        "data_quality", U_ACME_AUD, U_ACME_ADMIN,"None"),
            (T_TC,   "No Auditor Access Controls",       "TechCorp sustainability module lacks read-only auditor role separation. Admin credentials being shared with external auditor.",              FindingSeverityEnum.HIGH,   FindingStatusEnum.RESOLVED,    "access_control",U_ACME_AUD, U_TC_ADMIN, "Separate auditor account created 2026-02-01. Access controls confirmed."),
        ]
        for (t_id, area, desc, severity, status, entity_type, created_by, assigned_to, resolution) in findings:
            session.add(AuditFinding(
                id=uid(), tenant_id=t_id, area=area, description=desc,
                severity=severity, status=status,
                linked_entity_type=entity_type, linked_entity_id=t_id,
                resolution=resolution, created_by=created_by, assigned_to=assigned_to,
            ))
        await session.flush()

        # ── Audit Notes ────────────────────────────────────────────────────
        audit_notes = [
            (T_ACME, "emission_factors", "SEAI confirmed that 2024 factors are final and will not be revised mid-year. Safe to use for FY2025 reporting.", "observation", U_ACME_AUD),
            (T_ACME, "baseline",         "Management confirmed they have archived paper commute diaries from 2021 — these can be digitised as supplementary evidence.", "clarification", U_ACME_AUD),
            (T_ACME, "csrd_compliance",  "ESRS E1-5 disclosure partially complete. Targets section needs CEO sign-off before audit sign-off.", "comment", U_ACME_AUD),
            (T_TC,   "data_quality",     "TechCorp HR provided a headcount breakdown by office for 2022–2024. This enables denominator correction for intensity calculations.", "observation", U_ACME_AUD),
        ]
        for (t_id, area, note, note_type, created_by) in audit_notes:
            session.add(AuditNote(id=uid(), tenant_id=t_id, area=area, note=note, note_type=note_type, created_by=created_by))
        await session.flush()

        # ── Report Templates ───────────────────────────────────────────────
        print("Seeding report templates...")
        rpt_template_id = uid()
        csrd_template_id = uid()
        session.add(ReportTemplate(
            id=rpt_template_id, name="CSRD ESRS E1 — Employee Commuting",
            description="Full CSRD/ESRS E1 disclosure template for Category 7 employee commuting emissions",
            report_type="csrd",
            sections=["executive_summary", "methodology", "baseline", "emissions_inventory", "targets", "initiatives", "data_quality"],
            default_parameters={"scope": "category_7", "standard": "ESRS_E1", "region": "IE"},
            is_system=True,
        ))
        session.add(ReportTemplate(
            id=csrd_template_id, name="Quarterly Emissions Dashboard",
            description="Standard quarterly emissions performance report with trend analysis",
            report_type="emissions",
            sections=["kpi_summary", "monthly_trends", "mode_split", "office_performance", "alerts"],
            default_parameters={"frequency": "quarterly", "region": "IE"},
            is_system=True,
        ))
        await session.flush()

        # ── Reports ────────────────────────────────────────────────────────
        print("Seeding reports...")
        rpt1_id = uid(); rpt2_id = uid(); rpt3_id = uid()
        reports = [
            Report(id=rpt1_id, tenant_id=T_ACME, title="Acme CSRD Annual Report 2025",
                   description="Full CSRD ESRS E1 disclosure for FY2025 employee commuting",
                   report_type="csrd", template_id=rpt_template_id,
                   period_start=utc(365), period_end=utc(1),
                   format=ReportFormatEnum.PDF, status=ReportStatusEnum.APPROVED,
                   file_url="https://storage.coshyft.io/t-acme-001/reports/csrd_2025.pdf",
                   file_size_bytes=4194304,
                   parameters={"year": 2025, "scope": "category_7"},
                   generated_by=U_ACME_SUS, approved_by=U_ACME_ADMIN,
                   created_at=utc(30), updated_at=utc(25)),
            Report(id=rpt2_id, tenant_id=T_ACME, title="Q1 2026 Emissions Dashboard",
                   description="Quarterly emissions performance report — Q1 2026",
                   report_type="emissions", template_id=csrd_template_id,
                   period_start=utc(90), period_end=utc(1),
                   format=ReportFormatEnum.EXCEL, status=ReportStatusEnum.READY,
                   file_url="https://storage.coshyft.io/t-acme-001/reports/q1_2026_dashboard.xlsx",
                   file_size_bytes=1048576,
                   parameters={"quarter": "Q1", "year": 2026},
                   generated_by=U_ACME_SUS, approved_by=None,
                   created_at=utc(10), updated_at=utc(10)),
            Report(id=rpt3_id, tenant_id=T_TC, title="TechCorp Q1 2026 Emissions",
                   description="Quarterly report for TechCorp Ireland",
                   report_type="emissions", template_id=csrd_template_id,
                   period_start=utc(90), period_end=utc(1),
                   format=ReportFormatEnum.PDF, status=ReportStatusEnum.DRAFT,
                   parameters={"quarter": "Q1", "year": 2026},
                   generated_by=U_TC_SUS, approved_by=None,
                   created_at=utc(5), updated_at=utc(5)),
        ]
        for r in reports:
            session.add(r)
        await session.flush()

        # ── CSRD Submissions ───────────────────────────────────────────────
        print("Seeding CSRD submissions...")
        csrd_submissions = [
            (T_ACME, 2024, CSRDStatusEnum.UNDER_REVIEW, 0.87, 0.91, 18, 21, rpt1_id, None, None),
            (T_ACME, 2025, CSRDStatusEnum.IN_PROGRESS,  0.42, 0.68,  9, 21, None, None, None),
            (T_TC,   2024, CSRDStatusEnum.IN_PROGRESS,  0.35, 0.55,  7, 21, None, None, None),
            (T_GC,   2024, CSRDStatusEnum.NOT_STARTED,  0.0,  0.0,   0, 21, None, None, None),
        ]
        for (t_id, yr, status, comp, quality, done, total, rpt_id, sub_at, sub_by) in csrd_submissions:
            session.add(CSRDSubmission(
                tenant_id=t_id, reporting_year=yr, status=status,
                completeness_score=comp, data_quality_score=quality,
                disclosures_completed=done, disclosures_total=total,
                report_id=rpt_id, submitted_at=sub_at, submitted_by=sub_by,
                esrs_e1_data={
                    "scope_3_cat7_tco2e": 1098.4 if t_id == T_ACME else 389.1,
                    "baseline_year": 2022, "target_year": 2030,
                    "reduction_target_pct": 42.0, "intensity_metric": "tCO2e_per_employee",
                    "data_quality": "high" if quality > 0.8 else "medium",
                    "verification_method": "third_party_limited_assurance" if done > 15 else "internal",
                },
            ))
        await session.flush()

        # ── Audit Logs ─────────────────────────────────────────────────────
        print("Seeding audit logs...")
        audit_log_entries = [
            (U_SUPER,      "superadmin",    AuditActionEnum.CREATE, EntityTypeEnum.USER_PROFILE,  T_ACME,        "Tenant 'Acme Corporation' onboarded",           "185.12.44.201", utc(365)),
            (U_SUPER,      "superadmin",    AuditActionEnum.CREATE, EntityTypeEnum.USER_PROFILE,  T_TC,          "Tenant 'TechCorp Ireland' onboarded",            "185.12.44.201", utc(200)),
            (U_SUPER,      "superadmin",    AuditActionEnum.CREATE, EntityTypeEnum.USER_PROFILE,  T_GC,          "Tenant 'GreenCo Energy' onboarded",              "185.12.44.201", utc(120)),
            (U_SUPER,      "superadmin",    AuditActionEnum.CREATE, EntityTypeEnum.USER_PROFILE,  T_SX,          "Tenant 'StartupXYZ Ltd' created (trial)",        "185.12.44.201", utc(14)),
            (U_SUPER,      "superadmin",    AuditActionEnum.UPDATE, EntityTypeEnum.USER_PROFILE,  T_ACME,        "Acme plan upgraded to Enterprise",               "185.12.44.201", utc(90)),
            (U_ACME_SUS,   "sustainability",AuditActionEnum.CREATE, EntityTypeEnum.BASELINE,      "baseline-2022","Baseline 2022 locked and approved",             "212.17.88.42",  utc(180)),
            (U_ACME_SUS,   "sustainability",AuditActionEnum.CREATE, EntityTypeEnum.BASELINE,      "baseline-2023","Baseline 2023 locked and approved",             "212.17.88.42",  utc(90)),
            (U_ACME_SUS,   "sustainability",AuditActionEnum.UPDATE, EntityTypeEnum.EMISSION_FACTOR,"ef-car-p-ie", "Approved SEAI 2024 petrol emission factor",      "212.17.88.42",  utc(30)),
            (U_ACME_SUS,   "sustainability",AuditActionEnum.EXPORT, EntityTypeEnum.REPORT,        rpt1_id,       "Exported CSRD 2025 report to PDF",               "212.17.88.42",  utc(25)),
            (U_ACME_AUD,   "auditor",       AuditActionEnum.VIEW,   EntityTypeEnum.REPORT,        rpt1_id,       "Auditor reviewed CSRD 2025 annual report",       "89.101.22.14",  utc(20)),
            (U_ACME_AUD,   "auditor",       AuditActionEnum.APPROVE,EntityTypeEnum.BASELINE,      "baseline-2023","Auditor approved 2023 emissions baseline",       "89.101.22.14",  utc(18)),
            (U_ACME_ADMIN, "admin",         AuditActionEnum.CREATE, EntityTypeEnum.USER_PROFILE,  U_ACME_EMP1,   "Employee 'Ciara Brennan' onboarded",             "212.17.88.42",  utc(280)),
            (U_ACME_ADMIN, "admin",         AuditActionEnum.UPDATE, EntityTypeEnum.POLICY,        "policy-remote","Remote Work Policy 2024 published",              "212.17.88.42",  utc(90)),
            (U_ACME_EMP1,  "employee",      AuditActionEnum.CREATE, EntityTypeEnum.COMMUTE_ENTRY, "entry-001",   "Commute logged: DART Dublin — 8.2km",            "88.99.121.44",  utc(1)),
            (U_TC_SUS,     "sustainability",AuditActionEnum.CREATE, EntityTypeEnum.BASELINE,      "tc-baseline", "TechCorp 2022 baseline estimated and submitted",  "93.184.10.22",  utc(150)),
            (U_GC_ADMIN,   "admin",         AuditActionEnum.UPDATE, EntityTypeEnum.USER_PROFILE,  U_GC_EMP1,     "User profile updated: department changed",        "176.32.14.8",   utc(40)),
        ]
        for (uid_, role_, action, entity_type, entity_id, desc, ip, ts) in audit_log_entries:
            session.add(AuditLog(
                user_id=uid_, user_role=role_, action=action, entity_type=entity_type,
                entity_id=entity_id, description=desc, ip_address=ip, timestamp=ts,
            ))

        # ── GDPR Audit Logs ────────────────────────────────────────────────
        gdpr_entries = [
            (U_ACME_EMP1, "employee", "consent_given", "personal_data", U_ACME_EMP1, "consent", "IE", utc(280)),
            (U_ACME_EMP2, "employee", "consent_given", "personal_data", U_ACME_EMP2, "consent", "IE", utc(260)),
            (U_ACME_EMP3, "employee", "export",        "personal_data", U_ACME_EMP3, "consent", "IE", utc(30)),
            (U_ACME_SUS,  "sustainability","export",   "personal_data", T_ACME,      "legitimate_interest","IE", utc(15)),
        ]
        for (uid_, role_, action, entity_type, entity_id, basis, region, ts) in gdpr_entries:
            session.add(GDPRAuditLog(
                user_id=uid_, user_role=role_, action=action, entity_type=entity_type,
                entity_id=entity_id, gdpr_basis=basis, region=region, timestamp=ts,
                description=f"GDPR {action} event for {entity_type}",
            ))
        await session.flush()

        await session.commit()

    print("\n[OK] Full seed complete!")
    print("   Password for all accounts: Password123!")
    print("\n   Key accounts:")
    print("   superadmin@coshyft.io      — SUPERADMIN  (no tenant)")
    print("   james.obrien@acme.com      — ADMIN       (Acme Corp)")
    print("   aoife.kelly@acme.com       — SUSTAINABILITY (Acme Corp)")
    print("   declan.ryan@acme.com       — AUDITOR     (Acme Corp)")
    print("   ciara.brennan@acme.com     — EMPLOYEE    (Acme Corp)")
    print("\n   Additional accounts:")
    print("   sarah.murphy@techcorp.ie   — ADMIN       (TechCorp Ireland)")
    print("   patrick.connolly@techcorp.ie — SUSTAINABILITY (TechCorp Ireland)")
    print("   fiona.lynch@techcorp.ie    — EMPLOYEE    (TechCorp Ireland)")
    print("   emma.clarke@greenco.co.uk  — ADMIN       (GreenCo Energy)")
    print("   oliver.smith@greenco.co.uk — SUSTAINABILITY (GreenCo Energy)")


if __name__ == "__main__":
    asyncio.run(seed())
