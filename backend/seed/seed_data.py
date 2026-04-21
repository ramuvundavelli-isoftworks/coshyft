"""
Seed Data — Phase 2
Run AFTER seed.py to add commutes, transport modes, emission factors,
gamification, rides, messages, alerts, initiatives, baselines, and risks.

Usage:
    python seed.py              # creates tenants/users/offices
    python -m seed.seed_data    # adds domain data on top
"""

import asyncio
import uuid
from datetime import date, datetime, timedelta

from database import engine, async_session, init_db
from models.commute import CommuteEntry, CommuteProfile
from models.emission import EmissionFactor
from models.transport import IrishTransportMode, IrishWorkplaceBenefit
from models.organization import Baseline, Initiative, Scenario, Risk
from models.carpooling import Ride, RideRequest, RecurringRideTemplate
from models.gamification import OxyPointsLedger, UserAchievement, UserBadge, Challenge, ChallengeParticipant
from models.messaging import MessageThread, Message, ThreadParticipant
from models.alert import Alert
from models.report import ReportTemplate


# IDs from seed.py (root seed)
TENANT_IE = "t-acme-001"
USER_ADMIN = "u-acme-admin-001"
USER_SUS = "u-acme-sus-001"
USER_AUDITOR = "u-acme-aud-001"
USER_EMP1 = "u-acme-emp-001"   # Ciara Brennan, Engineering
USER_EMP2 = "u-acme-emp-002"   # Liam Doyle, Marketing
USER_EMP3 = "u-acme-emp-003"   # Niamh Fitzgerald, HR
USER_EMP4 = "u-acme-emp-004"   # Seán Gallagher, Sales
USER_EMP5 = "u-acme-emp-005"   # Emer Hayes, Engineering


async def seed():
    """Seed domain data on top of base seed."""
    # Do NOT call init_db() here — tables already exist from seed.py

    today = date.today()
    now = datetime.utcnow()

    async with async_session() as session:

        # ── Irish Transport Modes ────────────────────────────────────────────
        transport_modes = [
            ("ie_t1",  "Dublin Bus",             "Dublin Bus / Go-Ahead Ireland", 0.082, "public-transport", True,  False),
            ("ie_t2",  "Bus Eireann",             "Bus Eireann",                   0.085, "public-transport", True,  False),
            ("ie_t3",  "Go-Ahead Ireland",        "Go-Ahead Ireland",              0.082, "public-transport", True,  False),
            ("ie_t4",  "Irish Rail (Intercity)",  "Iarnrod Eireann",               0.041, "public-transport", True,  False),
            ("ie_t5",  "DART",                    "Irish Rail",                    0.035, "public-transport", True,  False),
            ("ie_t6",  "Luas Red Line",           "Transdev",                      0.038, "public-transport", True,  False),
            ("ie_t7",  "Luas Green Line",         "Transdev",                      0.038, "public-transport", True,  False),
            ("ie_t8",  "Dublin Bikes",            "JCDecaux",                      0.0,   "active-transport", False, False),
            ("ie_t9",  "Personal Bicycle",        None,                            0.0,   "active-transport", False, True),
            ("ie_t10", "E-Bike",                  None,                            0.008, "active-transport", False, True),
            ("ie_t11", "E-Scooter",               None,                            0.015, "active-transport", False, False),
            ("ie_t12", "Walking",                 None,                            0.0,   "active-transport", False, False),
            ("ie_t13", "Petrol Car - Solo",       None,                            0.189, "car",              False, False),
            ("ie_t14", "Diesel Car - Solo",       None,                            0.168, "car",              False, False),
            ("ie_t15", "Hybrid Car - Solo",       None,                            0.112, "car",              False, False),
            ("ie_t16", "Electric Vehicle - Solo", None,                            0.053, "car",              False, False),
            ("ie_t17", "Carpool (2 people)",      None,                            0.095, "carpool",          False, False),
            ("ie_t18", "Carpool (3+ people)",     None,                            0.063, "carpool",          False, False),
            ("ie_t19", "Motorcycle",              None,                            0.113, "other",            False, False),
            ("ie_t20", "Work from Home",          None,                            0.0,   "other",            False, False),
        ]
        for tid, mode, operator, ef, cat, tax, bike in transport_modes:
            session.add(IrishTransportMode(
                id=tid, mode=mode, operator=operator, emission_factor=ef,
                category=cat, tax_relief=tax, bike_to_work_scheme=bike,
                regions=["All"],
            ))

        # ── Irish Workplace Benefits ─────────────────────────────────────────
        benefits = [
            ("ie_b1", "Bike-to-Work Scheme",              "bike-to-work",  0.52, 1500),
            ("ie_b2", "Bike-to-Work Scheme (E-Bikes)",    "bike-to-work",  0.52, 3000),
            ("ie_b3", "TaxSaver Commuter Ticket Scheme",  "taxsaver",      0.52, None),
            ("ie_b4", "Electric Vehicle BIK Relief",      "ev-incentive",  1.0,  50000),
            ("ie_b5", "Remote Working Daily Allowance",   "remote-work",   1.0,  3.2),
        ]
        for bid, name, cat, relief, max_amt in benefits:
            session.add(IrishWorkplaceBenefit(
                id=bid, name=name, description=f"{name} — Irish government scheme",
                category=cat, region="IE", tax_relief=relief, max_amount=max_amt,
                status="active", compliance_required=(cat != "remote-work"),
            ))

        # ── Emission Factors ─────────────────────────────────────────────────
        ef_rows = [
            ("ef_ie_1",  "Petrol Car (Ireland)",              0.189, "EPA Ireland 2025",      "v3.0", "IE"),
            ("ef_ie_2",  "Diesel Car (Ireland)",              0.168, "EPA Ireland 2025",      "v3.0", "IE"),
            ("ef_ie_3",  "Electric Vehicle (Ireland Grid)",   0.053, "SEAI/EPA Ireland 2025", "v3.0", "IE"),
            ("ef_ie_4",  "Hybrid Car (Ireland)",              0.112, "EPA Ireland 2025",      "v3.0", "IE"),
            ("ef_ie_5",  "Dublin Bus",                        0.082, "NTA Ireland 2025",      "v2.0", "IE"),
            ("ef_ie_6",  "Bus Eireann",                       0.085, "NTA Ireland 2025",      "v2.0", "IE"),
            ("ef_ie_7",  "Irish Rail",                        0.041, "Iarnrod Eireann 2025",  "v2.0", "IE"),
            ("ef_ie_8",  "DART",                              0.035, "Irish Rail 2025",       "v2.0", "IE"),
            ("ef_ie_9",  "Luas (Tram)",                       0.038, "Transdev/NTA 2025",     "v1.0", "IE"),
            ("ef_ie_10", "Bicycle",                           0.0,   "EPA Ireland 2025",      "v3.0", "IE"),
            ("ef_ie_11", "E-Bike",                            0.008, "SEAI 2025",             "v1.0", "IE"),
            ("ef_ie_12", "Walking",                           0.0,   "EPA Ireland 2025",      "v3.0", "IE"),
            ("ef_ie_13", "Motorcycle (Ireland)",              0.113, "EPA Ireland 2025",      "v3.0", "IE"),
            ("ef_ie_14", "Work from Home",                    0.0,   "EPA Ireland 2025",      "v3.0", "IE"),
            ("ef_gb_1",  "Petrol Car (UK)",                   0.192, "DEFRA 2025",            "v2.1", "GB"),
            ("ef_gb_2",  "Diesel Car (UK)",                   0.171, "DEFRA 2025",            "v2.1", "GB"),
            ("ef_gb_3",  "Electric Vehicle (UK)",             0.047, "DEFRA 2025",            "v2.1", "GB"),
            ("ef_gb_4",  "Bus (UK)",                          0.089, "DEFRA 2025",            "v2.1", "GB"),
            ("ef_gb_5",  "Rail (UK)",                         0.035, "DEFRA 2025",            "v2.1", "GB"),
        ]
        for fid, mode, factor, source, version, region in ef_rows:
            session.add(EmissionFactor(
                id=fid, mode=mode, kg_co2_per_km=factor, source=source,
                version=version, region=region, effective_date=date(2025, 1, 1),
                approval_status="approved", scope_category="3.7",
            ))

        # ── Commute Profiles ─────────────────────────────────────────────────
        profiles = [
            CommuteProfile(
                user_id=USER_EMP1,
                default_origin_address="14 Clontarf Road, Dublin 3",
                default_origin_lat=53.3619, default_origin_lng=-6.2099,
                default_destination_address="Acme Dublin HQ, Grand Canal Dock",
                default_destination_lat=53.3395, default_destination_lng=-6.2316,
                default_transport_mode_id="ie_t5",
                default_distance_km=11.2,
                work_days_per_week=5, remote_days_per_week=1,
            ),
            CommuteProfile(
                user_id=USER_EMP2,
                default_origin_address="22 Ranelagh Village, Dublin 6",
                default_origin_lat=53.3235, default_origin_lng=-6.2599,
                default_destination_address="Acme Dublin HQ, Grand Canal Dock",
                default_destination_lat=53.3395, default_destination_lng=-6.2316,
                default_transport_mode_id="ie_t9",
                default_distance_km=4.5,
                work_days_per_week=4, remote_days_per_week=1,
            ),
            CommuteProfile(
                user_id=USER_EMP3,
                default_origin_address="8 Stillorgan Road, Blackrock, Co. Dublin",
                default_origin_lat=53.3034, default_origin_lng=-6.1791,
                default_destination_address="Acme Dublin HQ, Grand Canal Dock",
                default_destination_lat=53.3395, default_destination_lng=-6.2316,
                default_transport_mode_id="ie_t13",
                default_distance_km=14.8,
                work_days_per_week=5, remote_days_per_week=0,
            ),
        ]
        for p in profiles:
            session.add(p)

        # ── Commute Entries (8 months of history) ────────────────────────────
        commute_entries = []

        # emp1: DART + carpool + WFH
        emp1_patterns = [
            ("ie_t5",  "DART",             0.035, 11.2),
            ("ie_t5",  "DART",             0.035, 11.2),
            ("ie_t17", "Carpool (2 pax)",  0.095, 11.2),
            ("ie_t1",  "Dublin Bus",       0.082, 11.2),
            ("ie_t20", "Work from Home",   0.0,   0.0),
        ]
        for days_back in range(240, 0, -1):
            d = today - timedelta(days=days_back)
            if d.weekday() >= 5:
                continue
            pat = emp1_patterns[days_back % len(emp1_patterns)]
            tid, tlabel, ef, dist = pat
            emissions = round(dist * ef, 4)
            carpool_pass = 2 if tid == "ie_t17" else None
            oxypoints = max(0, round((0.189 * dist - emissions) * 10)) if dist > 0 else 5
            commute_entries.append(CommuteEntry(
                user_id=USER_EMP1, commute_date=d,
                transport_mode_id=tid, transport_mode_label=tlabel,
                distance_km=dist, duration_minutes=25 if dist > 0 else 0,
                origin_address="14 Clontarf Road, Dublin 3",
                destination_address="Acme Dublin HQ",
                emissions_kg_co2=emissions, emission_factor_id=tid,
                emission_factor_value=ef, is_return_trip=True,
                carpool_passengers=carpool_pass, oxypoints_earned=oxypoints,
                verification_method="manual",
            ))

        # emp2: cyclist
        emp2_patterns = [
            ("ie_t9",  "Personal Bicycle", 0.0,   4.5),
            ("ie_t9",  "Personal Bicycle", 0.0,   4.5),
            ("ie_t9",  "Personal Bicycle", 0.0,   4.5),
            ("ie_t1",  "Dublin Bus",       0.082, 4.5),
            ("ie_t20", "Work from Home",   0.0,   0.0),
        ]
        for days_back in range(180, 0, -1):
            d = today - timedelta(days=days_back)
            if d.weekday() >= 5:
                continue
            pat = emp2_patterns[days_back % len(emp2_patterns)]
            tid, tlabel, ef, dist = pat
            emissions = round(dist * ef, 4)
            oxypoints = max(0, round((0.189 * dist - emissions) * 10)) if dist > 0 else 5
            commute_entries.append(CommuteEntry(
                user_id=USER_EMP2, commute_date=d,
                transport_mode_id=tid, transport_mode_label=tlabel,
                distance_km=dist, duration_minutes=18 if dist > 0 else 0,
                emissions_kg_co2=emissions, emission_factor_id=tid,
                emission_factor_value=ef, is_return_trip=True,
                oxypoints_earned=oxypoints, verification_method="manual",
            ))

        # emp3: car driver
        emp3_patterns = [
            ("ie_t13", "Petrol Car - Solo",  0.189, 14.8),
            ("ie_t13", "Petrol Car - Solo",  0.189, 14.8),
            ("ie_t17", "Carpool (2 pax)",    0.095, 14.8),
            ("ie_t13", "Petrol Car - Solo",  0.189, 14.8),
            ("ie_t20", "Work from Home",     0.0,   0.0),
        ]
        for days_back in range(120, 0, -1):
            d = today - timedelta(days=days_back)
            if d.weekday() >= 5:
                continue
            pat = emp3_patterns[days_back % len(emp3_patterns)]
            tid, tlabel, ef, dist = pat
            emissions = round(dist * ef, 4)
            carpool_pass = 2 if tid == "ie_t17" else None
            oxypoints = max(0, round((0.189 * dist - emissions) * 10)) if dist > 0 else 0
            commute_entries.append(CommuteEntry(
                user_id=USER_EMP3, commute_date=d,
                transport_mode_id=tid, transport_mode_label=tlabel,
                distance_km=dist, duration_minutes=35 if dist > 0 else 0,
                emissions_kg_co2=emissions, emission_factor_id=tid,
                emission_factor_value=ef, is_return_trip=True,
                carpool_passengers=carpool_pass, oxypoints_earned=oxypoints,
                verification_method="manual",
            ))

        # emp4: electric vehicle
        emp4_patterns = [
            ("ie_t16", "Electric Vehicle - Solo", 0.053, 22.0),
            ("ie_t16", "Electric Vehicle - Solo", 0.053, 22.0),
            ("ie_t17", "Carpool (2 pax)",         0.095, 22.0),
            ("ie_t16", "Electric Vehicle - Solo", 0.053, 22.0),
            ("ie_t16", "Electric Vehicle - Solo", 0.053, 22.0),
        ]
        for days_back in range(90, 0, -1):
            d = today - timedelta(days=days_back)
            if d.weekday() >= 5:
                continue
            pat = emp4_patterns[days_back % len(emp4_patterns)]
            tid, tlabel, ef, dist = pat
            emissions = round(dist * ef, 4)
            carpool_pass = 2 if tid == "ie_t17" else None
            oxypoints = max(0, round((0.189 * dist - emissions) * 10))
            commute_entries.append(CommuteEntry(
                user_id=USER_EMP4, commute_date=d,
                transport_mode_id=tid, transport_mode_label=tlabel,
                distance_km=dist, duration_minutes=45,
                emissions_kg_co2=emissions, emission_factor_id=tid,
                emission_factor_value=ef, is_return_trip=True,
                carpool_passengers=carpool_pass, oxypoints_earned=oxypoints,
                verification_method="manual",
            ))

        for ce in commute_entries:
            session.add(ce)

        # ── Baseline ─────────────────────────────────────────────────────────
        session.add(Baseline(
            id="baseline-2023",
            tenant_id=TENANT_IE,
            year=2023,
            emissions=2847,
            offices=["Acme Dublin HQ", "Acme Cork Office", "Acme Galway Campus"],
            legal_entities=["Acme Corp Ireland Ltd"],
            data_source="HR System + Annual Survey",
            emission_factor_version="EPA Ireland 2023 v2.5",
            locked=True,
            approved_by="CFO & Head of Sustainability",
            approved_date=date(2024, 3, 15),
        ))

        # ── Initiatives ───────────────────────────────────────────────────────
        initiatives = [
            ("init-001", "EV Charging Infrastructure",   "Facilities",   465000, 85,  42,  "active",   date(2026, 1,  1), date(2026, 12, 31)),
            ("init-002", "Enhanced Survey Program",       "HR",           69750,  0,   0,   "approved", date(2026, 3,  1), date(2026, 12, 31)),
            ("init-003", "Carpool Incentive Program",     "Sustainability",111600,120,  98,  "active",   date(2025, 9,  1), date(2026, 8,  31)),
            ("init-004", "Bike-to-Work Scheme (Ireland)", "HR Ireland",   45000,  15,  8,   "active",   date(2026, 1,  1), date(2026, 12, 31)),
            ("init-005", "TaxSaver Commuter Scheme",      "HR Ireland",   28000,  22,  12,  "active",   date(2026, 1,  1), date(2026, 12, 31)),
        ]
        for iid, name, owner, budget, expected, actual, status, start, end in initiatives:
            session.add(Initiative(
                id=iid, tenant_id=TENANT_IE, name=name, owner=owner,
                budget=budget, expected_reduction=expected, actual_reduction=actual,
                status=status, start_date=start, end_date=end,
            ))

        # ── Risks ─────────────────────────────────────────────────────────────
        risks = [
            ("risk-001", "Data Quality Below 75% Threshold", "high",   "high",   250000, "Data Governance Team", "mitigating"),
            ("risk-002", "Target Trajectory Misalignment",   "medium", "high",   500000, "Sustainability Team",  "open"),
            ("risk-003", "Emission Factor Update Impact",    "low",    "medium", 100000, "Methodology Team",     "closed"),
        ]
        for rid, title, likelihood, impact, exposure, owner, status in risks:
            session.add(Risk(
                id=rid, tenant_id=TENANT_IE, title=title,
                likelihood=likelihood, impact=impact, financial_exposure=exposure,
                owner=owner, status=status,
            ))

        # ── Scenarios ─────────────────────────────────────────────────────────
        scenarios = [
            ("scen-001", "Aggressive EV Transition", 5,  1, 40, 387, 2.4, 3.2),
            ("scen-002", "Hybrid Work Focus",         10, 2, 15, 512, 4.8, 1.8),
            ("scen-003", "Public Transit Subsidy",    8,  0, 20, 298, 3.2, 2.5),
        ]
        for sid, name, carpool, remote, ev, reduced, roi, payback in scenarios:
            session.add(Scenario(
                id=sid, tenant_id=TENANT_IE, name=name,
                carpool_increase=carpool, remote_days=remote, ev_adoption=ev,
                emissions_reduced=reduced, roi=roi, payback=payback,
                created_by=USER_SUS,
            ))

        # ── Alerts ───────────────────────────────────────────────────────────
        alert_rows = [
            ("critical", "Data Quality Below Threshold",    "Q4 data quality dropped to 68% — below 75% CSRD threshold", "Data Quality",    "sustainability,admin"),
            ("critical", "Target Trajectory Risk",          "Current trajectory shows 12% gap vs 2030 reduction target",  "Targets",         "sustainability"),
            ("warning",  "Pending Factor Approval",         "Metro Bus emission factor v2.1 awaiting auditor approval",   "Emission Factors","sustainability,auditor"),
            ("warning",  "Initiative Budget Overrun",        "Carpool Incentive Program at 85% budget — 3 months remain", "Initiatives",     "admin,sustainability"),
            ("info",     "Monthly Report Ready",             "April 2026 CSRD compliance report is ready for review",     "Reporting",       "sustainability,auditor"),
            ("info",     "New Employee Onboarded",           "5 new employees added — commute data needed",               "Users",           "admin"),
        ]
        for severity, title, desc, entity, roles in alert_rows:
            session.add(Alert(
                tenant_id=TENANT_IE, severity=severity, title=title,
                description=desc, linked_entity=entity, target_roles=roles,
            ))

        # ── Report Templates ─────────────────────────────────────────────────
        templates = [
            ("CSRD/ESRS E1 Report",        "csrd",       True),
            ("Monthly Emissions Summary",   "emissions",  True),
            ("Annual Compliance Report",    "compliance", True),
            ("Transport Mode Analysis",     "custom",     False),
        ]
        for name, rtype, is_system in templates:
            session.add(ReportTemplate(
                name=name, description=f"Standard {name} template",
                report_type=rtype, is_system=is_system,
            ))

        # ── Rides ─────────────────────────────────────────────────────────────
        ride_tomorrow = today + timedelta(days=1)
        ride_d2 = today + timedelta(days=2)
        ride_d3 = today + timedelta(days=3)
        ride_yesterday = today - timedelta(days=1)

        def dt(d: date, h: int, m: int) -> datetime:
            return datetime(d.year, d.month, d.day, h, m)

        rides = [
            Ride(id="ride-001", driver_id=USER_EMP1,
                 origin="14 Clontarf Road, Dublin 3", origin_lat=53.3619, origin_lng=-6.2099,
                 destination="Acme Dublin HQ", destination_lat=53.3395, destination_lng=-6.2316,
                 departure_time=dt(ride_tomorrow, 8, 30),
                 seats_available=2, seats_total=3, status="scheduled",
                 vehicle_type="sedan", vehicle_make="Toyota Camry",
                 distance_km=11.2, co2_saved=round((0.189 - 0.095) * 11.2 * 2, 2)),
            Ride(id="ride-002", driver_id=USER_EMP3,
                 origin="8 Stillorgan Road, Blackrock", origin_lat=53.3034, origin_lng=-6.1791,
                 destination="Acme Dublin HQ", destination_lat=53.3395, destination_lng=-6.2316,
                 departure_time=dt(ride_d2, 8, 15),
                 seats_available=2, seats_total=2, status="scheduled",
                 vehicle_type="sedan", vehicle_make="Volkswagen Golf",
                 distance_km=14.8, co2_saved=round(0.189 * 14.8 * 0.5, 2)),
            Ride(id="ride-003", driver_id=USER_EMP4,
                 origin="55 Lucan Village, Co Dublin", origin_lat=53.3597, origin_lng=-6.4486,
                 destination="Acme Dublin HQ", destination_lat=53.3395, destination_lng=-6.2316,
                 departure_time=dt(ride_d3, 7, 45),
                 seats_available=3, seats_total=4, status="scheduled",
                 vehicle_type="electric", vehicle_make="Tesla Model 3",
                 distance_km=22.0, co2_saved=round(0.189 * 22.0 * 0.75, 2)),
            Ride(id="ride-004", driver_id=USER_EMP1,
                 origin="14 Clontarf Road, Dublin 3", origin_lat=53.3619, origin_lng=-6.2099,
                 destination="Acme Dublin HQ", destination_lat=53.3395, destination_lng=-6.2316,
                 departure_time=dt(ride_yesterday, 8, 30),
                 seats_available=0, seats_total=3, status="completed",
                 vehicle_type="sedan", vehicle_make="Toyota Camry",
                 distance_km=11.2, co2_saved=round((0.189 - 0.095) * 11.2 * 2, 2)),
        ]
        for r in rides:
            session.add(r)

        # Ride request — emp2 requested ride-001
        session.add(RideRequest(
            id="req-001", ride_id="ride-001", passenger_id=USER_EMP2,
            status="accepted",
            pickup_address="Ranelagh Village, Dublin 6",
            message="Morning commute to Grand Canal — happy to stop at Ranelagh",
        ))

        # Recurring template
        session.add(RecurringRideTemplate(
            id="tmpl-001",
            user_id=USER_EMP1,
            name="Daily Clontarf → HQ",
            description="Mon–Fri DART-route carpool to Grand Canal Dock",
            origin_address="14 Clontarf Road, Dublin 3",
            origin_lat=53.3619, origin_lng=-6.2099,
            destination_address="Acme Dublin HQ, Grand Canal Dock",
            destination_lat=53.3395, destination_lng=-6.2316,
            departure_time="08:30",
            days_of_week=[0, 1, 2, 3, 4],
            seats=3,
            pattern="weekly",
            status="active",
            is_driver=True,
            start_date=today,
        ))

        # ── Gamification ─────────────────────────────────────────────────────
        # OxyPoints ledger
        pts_entries = [
            (USER_EMP1, 150, "ride",         "DART carpool bonus"),
            (USER_EMP1, 200, "ride",         "Carpool ride bonus"),
            (USER_EMP1, 500, "achievement",  "First 100 km green commute"),
            (USER_EMP1, 100, "streak_bonus", "5-day green streak"),
            (USER_EMP2, 300, "ride",         "Cycling streak bonus"),
            (USER_EMP2, 250, "achievement",  "Zero-emission week award"),
            (USER_EMP3, 50,  "ride",         "Carpool participation"),
            (USER_EMP4, 400, "ride",         "EV commuter bonus"),
        ]
        for uid, pts, reason, desc in pts_entries:
            session.add(OxyPointsLedger(user_id=uid, points=pts, reason=reason, description=desc))

        # Achievements
        achievements = [
            (USER_EMP1, "ach-green-100",  "Green Commuter",    "100 km of green transport",     "🌿", "co2",    "rare",      100, 100, True,  200),
            (USER_EMP1, "ach-streak-5",   "5-Day Streak",      "5 consecutive green commutes",  "🔥", "streak", "common",    5,   5,   True,  100),
            (USER_EMP1, "ach-first-ride", "First Ride",        "Logged your first commute",     "🚀", "rides",  "common",    1,   1,   True,  50),
            (USER_EMP2, "ach-cyclist",    "Cycling Champion",  "50 cycling commutes completed", "🚲", "co2",    "epic",      50,  50,  True,  500),
            (USER_EMP2, "ach-first-ride", "First Ride",        "Logged your first commute",     "🚀", "rides",  "common",    1,   1,   True,  50),
            (USER_EMP4, "ach-ev-hero",    "EV Hero",           "30 EV commutes logged",         "⚡", "co2",    "rare",      30,  30,  True,  300),
        ]
        for uid, aid, name, desc, icon, cat, rarity, req, prog, unlocked, pts in achievements:
            session.add(UserAchievement(
                user_id=uid, achievement_id=aid, name=name, description=desc,
                icon=icon, category=cat, rarity=rarity, requirement=req,
                progress=prog, is_unlocked=unlocked, points_awarded=pts,
                unlocked_at=now if unlocked else None,
            ))

        # Badges
        badges = [
            (USER_EMP1, "Green Commuter",  "Consistent eco-friendly traveller",  "🌿", "green"),
            (USER_EMP1, "Carpool Hero",    "10+ carpool rides completed",        "🚗", "blue"),
            (USER_EMP2, "Zero Hero",       "Full week of zero-emission commutes", "⚡", "yellow"),
            (USER_EMP2, "Cyclist Pro",     "Daily cycling commuter",             "🚲", "green"),
            (USER_EMP4, "EV Pioneer",      "Early EV adopter on the platform",   "🔋", "purple"),
        ]
        for uid, name, desc, icon, color in badges:
            session.add(UserBadge(user_id=uid, name=name, description=desc, icon=icon, color=color))

        # Challenges
        c1_id = str(uuid.uuid4())
        c2_id = str(uuid.uuid4())
        session.add(Challenge(
            id=c1_id, tenant_id=TENANT_IE,
            name="Green April Challenge",
            description="Log 20 green commutes during April 2026",
            type="monthly",
            start_date=now.replace(month=4, day=1, hour=0, minute=0, second=0),
            end_date=now.replace(month=4, day=30, hour=23, minute=59, second=59),
            goal=20, reward_points=500, reward_badge="April Green", status="active",
            participant_count=3,
        ))
        session.add(Challenge(
            id=c2_id, tenant_id=TENANT_IE,
            name="Bike Week Sprint",
            description="Cycle to work every day this week",
            type="weekly",
            start_date=now - timedelta(days=2),
            end_date=now + timedelta(days=5),
            goal=5, reward_points=250, status="active",
            participant_count=2,
        ))
        for uid, prog in [(USER_EMP1, 12), (USER_EMP2, 18), (USER_EMP4, 7)]:
            session.add(ChallengeParticipant(challenge_id=c1_id, user_id=uid, progress=prog))
        for uid, prog in [(USER_EMP2, 3), (USER_EMP1, 2)]:
            session.add(ChallengeParticipant(challenge_id=c2_id, user_id=uid, progress=prog))

        # ── Messaging ────────────────────────────────────────────────────────
        t1_id = str(uuid.uuid4())
        t2_id = str(uuid.uuid4())
        t3_id = str(uuid.uuid4())

        threads = [
            MessageThread(id=t1_id, type="ride", title="Clontarf → HQ Morning Ride",
                          linked_ride_id="ride-001", is_pinned=True,
                          last_message_preview="Great, see you at 8:30! 👋",
                          last_message_at=now - timedelta(hours=2)),
            MessageThread(id=t2_id, type="group", title="Green April Challenge Team",
                          is_pinned=False,
                          last_message_preview="Keep it up — almost at 20! 🌿",
                          last_message_at=now - timedelta(hours=5)),
            MessageThread(id=t3_id, type="direct", title="EV Charging Rota",
                          is_pinned=False,
                          last_message_preview="Bay 3 is free from 10am tomorrow",
                          last_message_at=now - timedelta(hours=12)),
        ]
        for t in threads:
            session.add(t)

        participants = [
            (t1_id, [USER_EMP1, USER_EMP2]),
            (t2_id, [USER_EMP1, USER_EMP2, USER_EMP4, USER_SUS]),
            (t3_id, [USER_EMP3, USER_EMP4]),
        ]
        for tid, uids in participants:
            for uid in uids:
                session.add(ThreadParticipant(thread_id=tid, user_id=uid))

        msgs = [
            (t1_id, USER_EMP1, "Hey Liam, are you joining the carpool tomorrow?",            4),
            (t1_id, USER_EMP2, "Yes! Can you swing by Ranelagh?",                            3),
            (t1_id, USER_EMP1, "Great, see you at 8:30! 👋",                                2),
            (t2_id, USER_SUS,  "Fantastic progress on the Green April challenge, everyone!", 6),
            (t2_id, USER_EMP2, "18 commutes in — so close!",                                5.5),
            (t2_id, USER_EMP1, "Keep it up — almost at 20! 🌿",                             5),
            (t3_id, USER_EMP4, "Who has Bay 3 booked for tomorrow?",                         13),
            (t3_id, USER_EMP3, "Bay 3 is free from 10am tomorrow",                          12),
        ]
        for tid, uid, content, hrs_ago in msgs:
            session.add(Message(
                thread_id=tid, sender_id=uid, content=content, type="text",
                created_at=now - timedelta(hours=hrs_ago),
            ))

        await session.commit()
        print("✅ Domain data seeded successfully!")
        print(f"   Commute entries: {len(commute_entries)}")
        print(f"   Rides: 4  |  Recurring templates: 1")
        print(f"   Transport modes: {len(transport_modes)}  |  Emission factors: {len(ef_rows)}")
        print(f"   Alerts: {len(alert_rows)}  |  Initiatives: {len(initiatives)}")
        print(f"   Challenges: 2  |  Message threads: 3")


if __name__ == "__main__":
    asyncio.run(seed())
