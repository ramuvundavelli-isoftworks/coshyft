# CoShift Platform - Complete Screen Documentation

## Executive Summary

CoShift (formerly REOXY) is an enterprise-grade Scope 3 Category 7 – Employee Commuting Intelligence & Compliance Platform designed specifically for Irish operations. The platform provides audit-grade, CSRD/ESRS E1 compliant, board-ready reporting with comprehensive governance features. It serves five distinct user roles with specialized interfaces and permissions, utilizing "OxyPoints" as a rewards currency to drive sustainable commuting behaviors.

The platform is designed to meet the rigorous standards of the EU Corporate Sustainability Reporting Directive (CSRD), specifically the ESRS E1 Climate Change standard, requiring granular data collection, double materiality assessment, and auditable emissions reporting.

---

## Platform Architecture Overview

### User Roles & Access Levels

1.  **Sustainability Manager** - Strategic oversight, reporting, compliance, scenario modeling.
2.  **Employee** - Daily commuting, carpooling, rewards tracking, impact visualization.
3.  **Admin** - Operational management, user administration, policy enforcement, facility management.
4.  **Auditor** - Independent verification, compliance review, evidence validation, audit trail.
5.  **Super Admin** - Multi-tenant management, system health, platform administration (SaaS provider view).

### Data Flow & Relationships

```mermaid
graph TD
    Employee[Employee App] -->|Logs Commute/Carpool| CommuteDB[(Commute Database)]
    CommuteDB -->|Aggregates| EmissionsEngine[Emissions Calculation Engine]
    EmissionsEngine -->|Uses| Factors[Emission Factors (EPA/SEAI)]
    EmissionsEngine -->|Generates| Reports[Compliance Reports]
    
    Admin[Admin Dashboard] -->|Manages| Policies[Commute Policies]
    Policies -->|Influences| Employee
    
    Auditor[Auditor Portal] -->|Verifies| Evidence[Audit Trail & Evidence]
    Reports -->|Submitted to| Board[Board/Regulators]
```

---

# PART 1: SUSTAINABILITY MANAGER SCREENS

## 1. Sustainability Overview Dashboard (`/`)

### Purpose & Context
**Why Created:** To provide executive-level visibility into the organization's employee commuting carbon footprint, regulatory compliance status, and sustainability performance at a glance. It serves as the "Command Center" for the Head of Sustainability.

**User Persona:**
*   **Name:** Sarah O'Connor, Head of Sustainability
*   **Goals:** Achieve net-zero targets, ensure CSRD compliance, present board-ready reports.
*   **Pain Points:** Fragmented data sources, lack of real-time visibility, difficulty in tracking progress against science-based targets.

### Screen Capabilities
**What Users Can Do:**
1.  View real-time Scope 3 Category 7 emissions (tCO2e) with period-over-period comparison.
2.  Monitor compliance status across CSRD, ESRS E1, and GHG Protocol.
3.  Track progress toward emission reduction targets (e.g., "42% reduction by 2030").
4.  Analyze emission trends over time (monthly/yearly).
5.  Review data quality scores and audit readiness.

**CRUD Operations:**
*   **Read:** Aggregated emissions data, compliance status, KPIs.
*   **Update:** Mark alerts as read/resolved.
*   **Navigate:** Drill down into specific modules (Emissions, Analytics, Reporting).

**Real-time Examples:**
*   "Emissions updated 15 mins ago following batch upload of Dublin office swipe card data."
*   "Alert: 3 new gaps identified in Data Quality for Cork facility."

**Demo Narrative for Investors:**
"This dashboard is what the Head of Sustainability sees every morning. Instead of spreadsheets, they get a real-time pulse on their Scope 3 emissions. Notice the 'Compliance Status' widget—this green checkmark for ESRS E1 isn't just a static icon; it's dynamically calculated based on the completion of 45 specific data points required by the EU directive."

---

## 2. Emissions Overview (`/emissions`)

### Purpose & Context
**Why Created:** To provide detailed, granular analysis of employee commuting emissions across multiple dimensions (time, location, mode, employee segments).

**User Persona:** Sarah O'Connor (Sustainability Manager) & Environmental Analysts.

### Screen Capabilities
**What Users Can Do:**
1.  View total emissions with month-over-month and year-over-year comparisons.
2.  Analyze emissions by transport mode (Car, Bus, Rail, Bike, Walk, Remote).
3.  Compare location performance (e.g., HQ vs. Regional Hubs).
4.  Review employee segment emissions (e.g., by Department or Seniority).
5.  Filter data by date range, location, and department.

**Data Relationships:**
*   Fetches aggregated data from `employee_commute_logs`.
*   Joins with `emission_factors` to calculate CO2e.

**Demo Narrative:**
"Here we break down the high-level numbers. Investors love this 'Mode Split' chart because it instantly shows where the problem lies. Usually, single-occupancy vehicles account for 80% of emissions. We visualize this clearly so Sarah knows exactly where to target her initiatives."

---

## 3. Emissions Trends (`/emissions/trends`)

### Purpose & Context
**Why Created:** To analyze temporal patterns, identify seasonality, and forecast future emissions trajectories.

### Screen Capabilities
**What Users Can Do:**
1.  View emissions trends over customizable time periods.
2.  Compare current year vs. baseline vs. target trajectory.
3.  Analyze seasonal patterns (e.g., lower emissions in summer/December).
4.  Generate trend forecasts based on historical data using linear regression or moving averages.

**How Purpose is Achieved:**
Uses Chart.js line charts with multiple datasets to overlay current performance against the "ideal" path to Net Zero.

---

## 4. Mode Split Analysis (`/emissions/modes`)

### Purpose & Context
**Why Created:** To understand the transportation mix and identify opportunities for modal shift to lower-carbon options (e.g., shifting drivers to public transport).

### Screen Capabilities
**What Users Can Do:**
1.  View current mode split by transport mode (pie/donut charts).
2.  Compare mode split across locations (stacked bar charts).
3.  Analyze mode split trends over time (stream graphs).
4.  Calculate potential emission savings from modal shift scenarios.

**Demo Narrative:**
"This screen answers the question: 'How do our people actually get to work?' By tracking the shift from 75% driving to 60% driving over 12 months, we can prove the ROI of our incentive programs."

---

## 5. Location Performance (`/emissions/locations`)

### Purpose & Context
**Why Created:** To compare emission performance across multiple office locations and identify high-performing sites versus those needing intervention.

### Screen Capabilities
**What Users Can Do:**
1.  View emission metrics for each office location (Dublin HQ, Cork, Galway).
2.  Compare locations on total emissions, per-employee intensity, and mode split.
3.  View location-specific initiatives and their impact.
4.  Export location scorecards for facility managers.

---

## 6. Transport Analytics (`/transport-analytics`)

### Purpose & Context
**Why Created:** To provide advanced analytical capabilities for deep-dive transportation pattern analysis, often used for infrastructure planning.

### Screen Capabilities
**What Users Can Do:**
1.  Analyze origin-destination patterns (heatmaps).
2.  Identify optimal carpool matching opportunities based on geospatial clustering.
3.  Predict future demand for transport services (e.g., shuttle bus requirements).

**Data Relationships:**
*   Uses anonymized geospatial data from `employee_addresses` and `office_locations`.
*   Calculates Euclidean or road-network distances.

---

## 7. Baseline Setup (`/baseline`)

### Purpose & Context
**Why Created:** To establish a scientifically robust, auditable baseline against which all future emission reductions are measured. This is a "set and forget" screen but critical for compliance.

### Screen Capabilities
**What Users Can Do:**
1.  Select baseline year (e.g., 2023) and reporting period.
2.  Define organizational boundary (operational control vs. financial control).
3.  Import historical commute data via CSV/Excel.
4.  Select emission factor sources (EPA 2023, DEFRA 2023).

**Demo Narrative:**
"Every climate journey starts with a baseline. CoShift locks this data down. Once approved by an auditor, this baseline becomes immutable, ensuring the integrity of all future reduction claims."

---

## 8. Targets & Trajectory (`/targets`)

### Purpose & Context
**Why Created:** To set science-based emission reduction targets (SBTi) and monitor progress against a defined trajectory.

### Screen Capabilities
**What Users Can Do:**
1.  Set emission reduction targets (e.g., 50% by 2030).
2.  Choose target methodology (SBTi aligned, CSRD/ESRS E1).
3.  Visualize reduction trajectory (linear vs. exponential).
4.  Track actual performance vs. planned trajectory (the "gap analysis").

---

## 9. Organizational Boundary (`/boundary`)

### Purpose & Context
**Why Created:** To define the scope of emission reporting in accordance with GHG Protocol and CSRD requirements.

### Screen Capabilities
**What Users Can Do:**
1.  Define operational and financial control boundaries.
2.  Select included/excluded legal entities and subsidiaries.
3.  Document exclusions with justifications (e.g., "US Sales Office excluded - <10 employees").

---

## 10. Risk Management (`/risks`)

### Purpose & Context
**Why Created:** To identify, assess, and mitigate risks related to employee commuting emissions and sustainability performance (climate transition risks).

### Screen Capabilities
**What Users Can Do:**
1.  Identify and catalog commuting-related risks (e.g., "Fuel price volatility", "Carbon tax increase").
2.  Assess risk likelihood and impact (Heatmap).
3.  Assign risk owners and mitigation strategies.

---

## 11. Data Quality (`/data-quality`)

### Purpose & Context
**Why Created:** To monitor, assess, and improve the quality of emissions data to ensure audit-grade accuracy.

### Screen Capabilities
**What Users Can Do:**
1.  View overall data quality score (e.g., "A- Grade").
2.  Break down data quality by dimensions (Completeness, Accuracy, Timeliness).
3.  Identify specific data quality issues (e.g., "15% of employees have undefined commute modes").

**Demo Narrative:**
"Garbage in, garbage out. That's the biggest risk in ESG reporting. CoShift automatically scores data quality. If it drops below a 'B', the system flags it, preventing the release of inaccurate reports."

---

## 12. CSRD Compliance (`/csrd-compliance`)

### Purpose & Context
**Why Created:** To ensure full compliance with the EU Corporate Sustainability Reporting Directive (CSRD) and ESRS E1 standard.

### Screen Capabilities
**What Users Can Do:**
1.  View CSRD/ESRS E1 compliance status dashboard.
2.  Track completion of required disclosure elements (e.g., E1-1, E1-6).
3.  Complete double materiality assessment workflows.
4.  Export XBRL-tagged data for regulatory submission.

**Data Relationships:**
*   Maps internal data points to specific ESRS E1 disclosure requirements.

---

## 13. Regulatory Reporting (`/regulatory-reporting`)

### Purpose & Context
**Why Created:** To generate regulatory-compliant reports for various Irish and EU authorities beyond just CSRD (e.g., Irish NTA).

### Screen Capabilities
**What Users Can Do:**
1.  View calendar of regulatory reporting deadlines.
2.  Generate reports for specific authorities (EPA Ireland, SEAI).
3.  Map CoShift data to authority-specific formats.

---

# PART 2: EMPLOYEE SCREENS

## 1. Employee Dashboard (`/employee`)

### Purpose & Context
**Why Created:** To serve as the daily hub for employees to manage their commute, view their impact, and access quick actions. It drives engagement.

**User Persona:**
*   **Name:** Alex Chen, Software Engineer.
*   **Goals:** Save money on commute, find carpool partners, earn rewards.

### Screen Capabilities
**What Users Can Do:**
1.  **View KPI Cards:** Total Commutes, CO2 Saved, Carpool Rides, Active Streaks.
2.  **Quick Actions:** "Log Commute", "Offer Ride", "Find Ride".
3.  **Today's Ride Status:** View details of the current day's commute (e.g., "Carpooling with Sarah - 8:30 AM").
4.  **Commute Calendar:** A visual heatmap of commute history (Green = Sustainable, Grey = Single Occupancy).
5.  **Carbon Impact Widget:** Visual progress bar towards monthly green goals.

**Real-time Examples:**
*   "Good morning, Alex! You have a carpool scheduled for 08:30 AM."
*   "You've saved 142.5kg of CO2 this month!"

**Demo Narrative:**
"This isn't just a data entry form; it's a lifestyle app. It looks and feels like a consumer app like Uber or Strava. We use gamification—streaks, badges, and points—to make sustainable commuting addictive."

---

## 2. Commute Profile (`/employee/profile`)

### Purpose & Context
**Why Created:** To store user preferences, home address, and vehicle details necessary for accurate calculations and carpool matching.

### Screen Capabilities
**What Users Can Do:**
1.  Set Home and Work locations (geocoded).
2.  Define default commute preferences (e.g., "I usually drive", "I'm open to carpooling").
3.  Add vehicle details (Make, Model, Year, Fuel Type) for accurate emission factors.
4.  Set working days/schedule (Hybrid work patterns).

---

## 3. Offer Ride (`/employee/offer-ride`)

### Purpose & Context
**Why Created:** To allow employees with vehicles to offer rides to colleagues, reducing single-occupancy trips.

### Screen Capabilities
**What Users Can Do:**
1.  Post a ride offer: Origin, Destination, Date, Time, Detour willingness.
2.  Set recurring offers (e.g., "Every Mon, Wed, Fri").
3.  View suggested matches based on proximity.

**CRUD Operations:**
*   **Create:** New Ride Offer.
*   **Read:** Existing offers.
*   **Update:** Edit time/route.
*   **Delete:** Cancel offer.

---

## 4. Find Ride (`/employee/find-ride`)

### Purpose & Context
**Why Created:** To help employees find carpool opportunities for their specific route.

### Screen Capabilities
**What Users Can Do:**
1.  Search for rides by date and time.
2.  Filter by driver gender, department, or detour flexibility.
3.  Request to join a ride.
4.  View driver profiles and ratings.

---

## 5. Active Trip (`/employee/active-trip`)

### Purpose & Context
**Why Created:** To track a live carpool trip for verification and safety.

### Screen Capabilities
**What Users Can Do:**
1.  "Start Trip" and "End Trip" buttons.
2.  View live route map.
3.  See passenger list and pickup status.
4.  SOS / Emergency contact button.

---

## 6. Rewards & Achievements (`/employee/rewards`)

### Purpose & Context
**Why Created:** To manage the "OxyPoints" gamification system, incentivizing behavior change.

### Screen Capabilities
**What Users Can Do:**
1.  View OxyPoints balance.
2.  Browse the Rewards Marketplace (Vouchers, Charity donations, Company perks).
3.  Redeem points.
4.  View earned badges (e.g., "Super Cyclist", "Carpool Champion").

---

# PART 3: ADMIN SCREENS

## 1. Admin Overview (`/admin`)

### Purpose & Context
**Why Created:** Operational oversight for the Facilities/HR Manager responsible for day-to-day program management.

**User Persona:**
*   **Name:** Mike Ross, Facilities Manager.
*   **Goals:** Manage parking capacity, ensure policy adoption, handle user issues.

### Screen Capabilities
**What Users Can Do:**
1.  Monitor daily participation rates.
2.  View parking utilization stats.
3.  Manage "Flagged" trips or user reports.

---

## 2. User Management (`/admin/users`)

### Purpose & Context
**Why Created:** To manage employee accounts, roles, and status.

### Screen Capabilities
**What Users Can Do:**
1.  Add/Edit/Deactivate users.
2.  Assign roles (Sustainability Manager, Auditor, etc.).
3.  Bulk import users via CSV.
4.  Reset passwords/Send invites.

---

## 3. Ride Operations (`/admin/rides`)

### Purpose & Context
**Why Created:** To oversee the carpooling system, resolve disputes, and ensure safety.

### Screen Capabilities
**What Users Can Do:**
1.  View all active/scheduled/completed rides.
2.  Investigate cancelled rides.
3.  Handle user reports/complaints.

---

## 4. Workplace Benefits (`/admin/workplace-benefits`)

### Purpose & Context
**Why Created:** To manage the incentives and benefits catalog (Bike-to-Work scheme, Public Transport tickets).

### Screen Capabilities
**What Users Can Do:**
1.  Manage the Rewards Marketplace inventory.
2.  Track redemption history.
3.  Configure "Boost" days (e.g., "Double points for cycling in May").

---

# PART 4: AUDITOR SCREENS

## 1. Auditor Overview (`/auditor`)

### Purpose & Context
**Why Created:** A read-only, evidence-based view for external verifiers (e.g., Big 4 firms) to validate the company's non-financial reporting.

**User Persona:**
*   **Name:** James Auditor, KPMG/PwC.
*   **Goals:** Verify data accuracy, trace evidence, issue assurance statement.

### Screen Capabilities
**What Users Can Do:**
1.  View "Assurance Readiness" status.
2.  Access organized "Evidence Lockers".
3.  Track open audit queries.

---

## 2. Evidence Repository (`/auditor/evidence`)

### Purpose & Context
**Why Created:** To provide a centralized, immutable store of all supporting documentation for emissions claims.

### Screen Capabilities
**What Users Can Do:**
1.  View uploaded evidence (utility bills, transport provider reports).
2.  Trace data points back to source documents.
3.  Download evidence packages for offline review.

---

## 3. Audit Trail (`/auditor/trail`)

### Purpose & Context
**Why Created:** To provide a chronological record of all data changes, ensuring data integrity.

### Screen Capabilities
**What Users Can Do:**
1.  Search logs for specific data points.
2.  See "Who changed What, When, and Why".
3.  Verify that no data was tampered with after the reporting period closed.

---

# PART 5: SUPER ADMIN SCREENS

## 1. Super Admin Dashboard (`/superadmin`)

### Purpose & Context
**Why Created:** For the SaaS provider (CoShift Operations) to manage multiple client tenants.

### Screen Capabilities
**What Users Can Do:**
1.  View all client tenants and their health status.
2.  Monitor total platform usage (API calls, Storage).
3.  Manage global system settings.

## 2. Tenant Management (`/superadmin/tenants`)

### Purpose & Context
**Why Created:** To provision and manage client environments.

### Screen Capabilities
**What Users Can Do:**
1.  Create new client tenants.
2.  Configure tenant-specific feature flags.
3.  Manage subscription tiers and billing cycles.

---

# DEEP DIVE: LOGIC & CALCULATIONS

## Commute Calculation Logic
The platform uses a rigorous calculation engine to determine CO2e savings vs. a baseline.

1.  **Baseline Definition:** The baseline is defined as a "Solo Petrol Car", emitting **0.168 kg CO2e/km** (Source: SEAI 2024).
2.  **Savings Formula:** `Saved Emissions = (Baseline Factor - Actual Mode Factor) * Distance * 2 (Round Trip)`
3.  **Carpool Logic:** When a user logs a carpool:
    *   **Driver:** Emissions are split: `(Vehicle Factor * Distance * 2) / Passenger Count`.
    *   **Passenger:** Assigned an equal share of the vehicle's emissions.
    *   **Result:** A 3-person carpool reduces individual carbon footprint by 66% compared to driving alone.

## Emission Factors (Source: SEAI 2024)
*   **Bus:** 0.089 kg/km
*   **Rail (DART/Luas):** 0.025 kg/km
*   **EV:** 0.053 kg/km
*   **Petrol Car:** 0.168 kg/km
*   **Walking/Cycling:** 0.0 kg/km

This logic ensures that every "OxyPoint" earned correlates directly to a verified kg of carbon avoided.

# Summary of Value Proposition

This documentation reflects CoShift's status as a specialized, compliance-driven platform. Unlike generic HR tools, every screen in CoShift is built with the "Audit Trail" in mind, ensuring that when an organization claims a 20% reduction in Scope 3 emissions, they can prove it down to the individual km.
