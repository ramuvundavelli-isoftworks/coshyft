"""
CoShyft Seed Script
Run: python seed.py
Seeds realistic tenants, users, offices, and audit logs.
"""

import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from datetime import datetime, timedelta
from database import init_db, async_session
from models.tenant import Tenant, TenantConfig, TenantStatusEnum, TenantPlanEnum
from models.user import User, UserRoleEnum, LocaleEnum, RegionEnum
from models.organization import Office, PublicTransportAccessEnum
from models.audit import AuditLog, AuditActionEnum, EntityTypeEnum
from auth.passwords import hash_password


def utc(days_ago=0):
    return datetime.utcnow() - timedelta(days=days_ago)


TENANTS = [
    {
        "id": "t-acme-001",
        "name": "Acme Corporation",
        "slug": "acme-corp",
        "primary_region": "IE",
        "status": TenantStatusEnum.ACTIVE,
        "plan": TenantPlanEnum.ENTERPRISE,
        "max_users": 5000,
        "max_offices": 50,
        "contact_email": "admin@acme.com",
        "contact_name": "James O'Brien",
        "billing_email": "billing@acme.com",
        "created_at": utc(365),
        "updated_at": utc(30),
    },
    {
        "id": "t-techcorp-002",
        "name": "TechCorp Ireland",
        "slug": "techcorp-ie",
        "primary_region": "IE",
        "status": TenantStatusEnum.ACTIVE,
        "plan": TenantPlanEnum.PROFESSIONAL,
        "max_users": 500,
        "max_offices": 10,
        "contact_email": "admin@techcorp.ie",
        "contact_name": "Sarah Murphy",
        "billing_email": "billing@techcorp.ie",
        "created_at": utc(200),
        "updated_at": utc(15),
    },
    {
        "id": "t-greenco-003",
        "name": "GreenCo Energy",
        "slug": "greenco-energy",
        "primary_region": "GB",
        "status": TenantStatusEnum.ACTIVE,
        "plan": TenantPlanEnum.PROFESSIONAL,
        "max_users": 300,
        "max_offices": 8,
        "contact_email": "admin@greenco.co.uk",
        "contact_name": "Emma Clarke",
        "billing_email": "finance@greenco.co.uk",
        "created_at": utc(120),
        "updated_at": utc(10),
    },
    {
        "id": "t-startup-004",
        "name": "StartupXYZ Ltd",
        "slug": "startupxyz",
        "primary_region": "IE",
        "status": TenantStatusEnum.TRIAL,
        "plan": TenantPlanEnum.STARTER,
        "max_users": 50,
        "max_offices": 2,
        "contact_email": "hello@startupxyz.io",
        "contact_name": "Conor Walsh",
        "billing_email": None,
        "created_at": utc(14),
        "updated_at": utc(1),
    },
]

TENANT_CONFIGS = [
    {"tenant_id": "t-acme-001",    "default_locale": "en-IE", "default_currency": "EUR", "emission_factor_region": "IE",  "oxypoints_enabled": True,  "carpooling_enabled": True,  "csrd_reporting_enabled": True,  "gdpr_strict_mode": True,  "data_retention_years": 7},
    {"tenant_id": "t-techcorp-002","default_locale": "en-IE", "default_currency": "EUR", "emission_factor_region": "IE",  "oxypoints_enabled": True,  "carpooling_enabled": True,  "csrd_reporting_enabled": True,  "gdpr_strict_mode": True,  "data_retention_years": 5},
    {"tenant_id": "t-greenco-003", "default_locale": "en-GB", "default_currency": "GBP", "emission_factor_region": "GB",  "oxypoints_enabled": True,  "carpooling_enabled": False, "csrd_reporting_enabled": True,  "gdpr_strict_mode": True,  "data_retention_years": 7},
    {"tenant_id": "t-startup-004", "default_locale": "en-IE", "default_currency": "EUR", "emission_factor_region": "IE",  "oxypoints_enabled": False, "carpooling_enabled": False, "csrd_reporting_enabled": False, "gdpr_strict_mode": False, "data_retention_years": 3},
]

USERS = [
    # ── Superadmin (no tenant) ──────────────────────────────────────────────
    {"id": "u-super-001", "email": "superadmin@coshyft.io", "name": "Platform Admin",         "role": UserRoleEnum.SUPERADMIN,      "tenant_id": None,            "department": None,             "created_at": utc(400)},

    # ── Acme Corporation ───────────────────────────────────────────────────
    {"id": "u-acme-admin-001", "email": "james.obrien@acme.com",      "name": "James O'Brien",       "role": UserRoleEnum.ADMIN,           "tenant_id": "t-acme-001",    "department": "Operations",     "created_at": utc(360)},
    {"id": "u-acme-sus-001",   "email": "aoife.kelly@acme.com",        "name": "Aoife Kelly",         "role": UserRoleEnum.SUSTAINABILITY,   "tenant_id": "t-acme-001",    "department": "Sustainability", "created_at": utc(340)},
    {"id": "u-acme-aud-001",   "email": "declan.ryan@acme.com",        "name": "Declan Ryan",         "role": UserRoleEnum.AUDITOR,          "tenant_id": "t-acme-001",    "department": "Finance",        "created_at": utc(300)},
    {"id": "u-acme-emp-001",   "email": "ciara.brennan@acme.com",      "name": "Ciara Brennan",       "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-acme-001",    "department": "Engineering",    "created_at": utc(280)},
    {"id": "u-acme-emp-002",   "email": "liam.doyle@acme.com",         "name": "Liam Doyle",          "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-acme-001",    "department": "Marketing",      "created_at": utc(260)},
    {"id": "u-acme-emp-003",   "email": "niamh.fitzgerald@acme.com",   "name": "Niamh Fitzgerald",    "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-acme-001",    "department": "HR",             "created_at": utc(240)},
    {"id": "u-acme-emp-004",   "email": "sean.gallagher@acme.com",     "name": "Seán Gallagher",      "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-acme-001",    "department": "Sales",          "created_at": utc(220)},
    {"id": "u-acme-emp-005",   "email": "emer.hayes@acme.com",         "name": "Emer Hayes",          "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-acme-001",    "department": "Engineering",    "created_at": utc(200)},

    # ── TechCorp Ireland ───────────────────────────────────────────────────
    {"id": "u-tc-admin-001",   "email": "sarah.murphy@techcorp.ie",    "name": "Sarah Murphy",        "role": UserRoleEnum.ADMIN,           "tenant_id": "t-techcorp-002","department": "IT",             "created_at": utc(195)},
    {"id": "u-tc-sus-001",     "email": "patrick.connolly@techcorp.ie","name": "Patrick Connolly",    "role": UserRoleEnum.SUSTAINABILITY,   "tenant_id": "t-techcorp-002","department": "Sustainability", "created_at": utc(185)},
    {"id": "u-tc-emp-001",     "email": "fiona.lynch@techcorp.ie",     "name": "Fiona Lynch",         "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-techcorp-002","department": "Development",    "created_at": utc(175)},
    {"id": "u-tc-emp-002",     "email": "michael.byrne@techcorp.ie",   "name": "Michael Byrne",       "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-techcorp-002","department": "QA",             "created_at": utc(160)},
    {"id": "u-tc-emp-003",     "email": "orla.sullivan@techcorp.ie",   "name": "Orla Sullivan",       "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-techcorp-002","department": "Product",        "created_at": utc(140)},

    # ── GreenCo Energy ─────────────────────────────────────────────────────
    {"id": "u-gc-admin-001",   "email": "emma.clarke@greenco.co.uk",   "name": "Emma Clarke",         "role": UserRoleEnum.ADMIN,           "tenant_id": "t-greenco-003", "department": "Operations",     "created_at": utc(115)},
    {"id": "u-gc-sus-001",     "email": "oliver.smith@greenco.co.uk",  "name": "Oliver Smith",        "role": UserRoleEnum.SUSTAINABILITY,   "tenant_id": "t-greenco-003", "department": "ESG",            "created_at": utc(110)},
    {"id": "u-gc-emp-001",     "email": "jessica.jones@greenco.co.uk", "name": "Jessica Jones",       "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-greenco-003", "department": "Engineering",    "created_at": utc(100)},
    {"id": "u-gc-emp-002",     "email": "tom.williams@greenco.co.uk",  "name": "Tom Williams",        "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-greenco-003", "department": "Field Ops",      "created_at": utc(90)},

    # ── StartupXYZ ─────────────────────────────────────────────────────────
    {"id": "u-sx-admin-001",   "email": "conor.walsh@startupxyz.io",   "name": "Conor Walsh",         "role": UserRoleEnum.ADMIN,           "tenant_id": "t-startup-004", "department": "Founding Team",  "created_at": utc(13)},
    {"id": "u-sx-emp-001",     "email": "roisin.power@startupxyz.io",  "name": "Róisín Power",        "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-startup-004", "department": "Engineering",    "created_at": utc(12)},
    {"id": "u-sx-emp-002",     "email": "cian.nolan@startupxyz.io",    "name": "Cian Nolan",          "role": UserRoleEnum.EMPLOYEE,         "tenant_id": "t-startup-004", "department": "Design",         "created_at": utc(10)},
]

OFFICES = [
    # Acme
    {"id": "o-acme-dub",  "tenant_id": "t-acme-001",    "name": "Acme Dublin HQ",         "city": "Dublin",       "country": "Ireland",        "region": "IE", "lat": 53.3498, "lng": -6.2603, "employee_count": 1200, "participation_rate": 68.4, "total_emissions": 485.2, "emission_intensity": 0.40, "public_transport_access": PublicTransportAccessEnum.EXCELLENT, "parking_spaces": 350, "bike_parking": 80, "ev_chargers": 24},
    {"id": "o-acme-cork", "tenant_id": "t-acme-001",    "name": "Acme Cork Office",        "city": "Cork",         "country": "Ireland",        "region": "IE", "lat": 51.8985, "lng": -8.4756, "employee_count": 480,  "participation_rate": 61.0, "total_emissions": 198.6, "emission_intensity": 0.41, "public_transport_access": PublicTransportAccessEnum.GOOD,      "parking_spaces": 140, "bike_parking": 30, "ev_chargers": 8},
    {"id": "o-acme-gal",  "tenant_id": "t-acme-001",    "name": "Acme Galway Campus",      "city": "Galway",       "country": "Ireland",        "region": "IE", "lat": 53.2707, "lng": -9.0568, "employee_count": 320,  "participation_rate": 54.2, "total_emissions": 142.8, "emission_intensity": 0.45, "public_transport_access": PublicTransportAccessEnum.MODERATE,  "parking_spaces": 120, "bike_parking": 40, "ev_chargers": 6},

    # TechCorp
    {"id": "o-tc-dub",   "tenant_id": "t-techcorp-002", "name": "TechCorp Dublin",         "city": "Dublin",       "country": "Ireland",        "region": "IE", "lat": 53.3418, "lng": -6.2658, "employee_count": 280,  "participation_rate": 72.1, "total_emissions": 98.4,  "emission_intensity": 0.35, "public_transport_access": PublicTransportAccessEnum.EXCELLENT, "parking_spaces": 80,  "bike_parking": 50, "ev_chargers": 12},
    {"id": "o-tc-lim",   "tenant_id": "t-techcorp-002", "name": "TechCorp Limerick",       "city": "Limerick",     "country": "Ireland",        "region": "IE", "lat": 52.6638, "lng": -8.6267, "employee_count": 95,   "participation_rate": 58.9, "total_emissions": 41.2,  "emission_intensity": 0.43, "public_transport_access": PublicTransportAccessEnum.MODERATE,  "parking_spaces": 60,  "bike_parking": 20, "ev_chargers": 4},

    # GreenCo
    {"id": "o-gc-lon",   "tenant_id": "t-greenco-003",  "name": "GreenCo London HQ",       "city": "London",       "country": "United Kingdom", "region": "GB", "lat": 51.5074, "lng": -0.1278, "employee_count": 190,  "participation_rate": 66.3, "total_emissions": 74.5,  "emission_intensity": 0.39, "public_transport_access": PublicTransportAccessEnum.EXCELLENT, "parking_spaces": 40,  "bike_parking": 60, "ev_chargers": 10},
    {"id": "o-gc-man",   "tenant_id": "t-greenco-003",  "name": "GreenCo Manchester",      "city": "Manchester",   "country": "United Kingdom", "region": "GB", "lat": 53.4808, "lng": -2.2426, "employee_count": 85,   "participation_rate": 59.4, "total_emissions": 36.8,  "emission_intensity": 0.43, "public_transport_access": PublicTransportAccessEnum.GOOD,      "parking_spaces": 55,  "bike_parking": 20, "ev_chargers": 4},

    # StartupXYZ
    {"id": "o-sx-dub",   "tenant_id": "t-startup-004",  "name": "StartupXYZ Dublin",       "city": "Dublin",       "country": "Ireland",        "region": "IE", "lat": 53.3379, "lng": -6.2592, "employee_count": 22,   "participation_rate": 81.8, "total_emissions": 6.2,   "emission_intensity": 0.28, "public_transport_access": PublicTransportAccessEnum.GOOD,      "parking_spaces": 10,  "bike_parking": 15, "ev_chargers": 2},
]

AUDIT_LOGS = [
    {"user_id": "u-super-001",    "user_role": "superadmin",    "action": AuditActionEnum.CREATE, "entity_type": EntityTypeEnum.USER_PROFILE,  "entity_id": "t-acme-001",    "description": "Tenant 'Acme Corporation' created",              "ip_address": "185.12.44.201"},
    {"user_id": "u-super-001",    "user_role": "superadmin",    "action": AuditActionEnum.CREATE, "entity_type": EntityTypeEnum.USER_PROFILE,  "entity_id": "t-techcorp-002","description": "Tenant 'TechCorp Ireland' created",              "ip_address": "185.12.44.201"},
    {"user_id": "u-super-001",    "user_role": "superadmin",    "action": AuditActionEnum.CREATE, "entity_type": EntityTypeEnum.USER_PROFILE,  "entity_id": "t-greenco-003", "description": "Tenant 'GreenCo Energy' created",                "ip_address": "185.12.44.201"},
    {"user_id": "u-super-001",    "user_role": "superadmin",    "action": AuditActionEnum.CREATE, "entity_type": EntityTypeEnum.USER_PROFILE,  "entity_id": "t-startup-004", "description": "Tenant 'StartupXYZ Ltd' created (trial)",        "ip_address": "185.12.44.201"},
    {"user_id": "u-acme-admin-001","user_role": "admin",         "action": AuditActionEnum.CREATE, "entity_type": EntityTypeEnum.USER_PROFILE,  "entity_id": "u-acme-emp-001","description": "User 'Ciara Brennan' onboarded",                 "ip_address": "212.17.88.42"},
    {"user_id": "u-acme-sus-001", "user_role": "sustainability", "action": AuditActionEnum.UPDATE, "entity_type": EntityTypeEnum.BASELINE,      "entity_id": "baseline-2024", "description": "Baseline 2024 updated with revised emission data","ip_address": "212.17.88.42"},
    {"user_id": "u-acme-aud-001", "user_role": "auditor",        "action": AuditActionEnum.VIEW,   "entity_type": EntityTypeEnum.REPORT,        "entity_id": "report-q4-2024","description": "Q4 2024 CSRD report accessed for review",        "ip_address": "89.101.22.14"},
    {"user_id": "u-tc-sus-001",   "user_role": "sustainability", "action": AuditActionEnum.CREATE, "entity_type": EntityTypeEnum.COMMUTE_ENTRY, "entity_id": "policy-irt-001","description": "Remote work policy published",                   "ip_address": "93.184.10.22"},
    {"user_id": "u-gc-admin-001", "user_role": "admin",          "action": AuditActionEnum.UPDATE, "entity_type": EntityTypeEnum.USER_PROFILE,  "entity_id": "u-gc-emp-001",  "description": "User profile updated: department changed",       "ip_address": "176.32.14.8"},
    {"user_id": "u-super-001",    "user_role": "superadmin",    "action": AuditActionEnum.UPDATE, "entity_type": EntityTypeEnum.USER_PROFILE,  "entity_id": "t-acme-001",    "description": "Tenant plan upgraded to enterprise",             "ip_address": "185.12.44.201"},
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
        print("Seeding tenants...")
        for td in TENANTS:
            t = Tenant(**td)
            session.add(t)

        await session.flush()

        print("Seeding tenant configs...")
        for cd in TENANT_CONFIGS:
            c = TenantConfig(**cd, updated_at=datetime.utcnow())
            session.add(c)

        print("Seeding users...")
        pw = hash_password("Password123!")
        for ud in USERS:
            u = User(
                id=ud["id"],
                email=ud["email"],
                name=ud["name"],
                hashed_password=pw,
                role=ud["role"],
                tenant_id=ud["tenant_id"],
                department=ud["department"],
                locale=LocaleEnum.EN_IE,
                region=RegionEnum.IE,
                is_active=True,
                created_at=ud["created_at"],
                updated_at=ud["created_at"],
            )
            session.add(u)

        await session.flush()

        print("Seeding offices...")
        for od in OFFICES:
            o = Office(
                id=od["id"],
                tenant_id=od["tenant_id"],
                name=od["name"],
                city=od["city"],
                country=od["country"],
                region=od["region"],
                lat=od["lat"],
                lng=od["lng"],
                employee_count=od["employee_count"],
                participation_rate=od["participation_rate"],
                total_emissions=od["total_emissions"],
                emission_intensity=od["emission_intensity"],
                public_transport_access=od["public_transport_access"],
                parking_spaces=od["parking_spaces"],
                bike_parking=od["bike_parking"],
                ev_chargers=od["ev_chargers"],
                is_active=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            session.add(o)

        await session.flush()

        print("Seeding audit logs...")
        base_time = utc(30)
        for i, ald in enumerate(AUDIT_LOGS):
            log = AuditLog(
                user_id=ald["user_id"],
                user_role=ald["user_role"],
                action=ald["action"],
                entity_type=ald["entity_type"],
                entity_id=ald["entity_id"],
                description=ald["description"],
                ip_address=ald["ip_address"],
                timestamp=base_time - timedelta(hours=i * 8),
            )
            session.add(log)

        await session.commit()

    print("\nSeed complete! Credentials for all users:")
    print("  Password: Password123!")
    print("\n  Key accounts:")
    print("  superadmin@coshyft.io  — SUPERADMIN (no tenant)")
    print("  james.obrien@acme.com  — ADMIN      (Acme Corp)")
    print("  aoife.kelly@acme.com   — SUSTAINABILITY (Acme Corp)")
    print("  declan.ryan@acme.com   — AUDITOR    (Acme Corp)")
    print("  ciara.brennan@acme.com — EMPLOYEE   (Acme Corp)")


if __name__ == "__main__":
    asyncio.run(seed())
