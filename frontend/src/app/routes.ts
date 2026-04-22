import { createBrowserRouter } from 'react-router';
import RootLayout from './components/RootLayout';
import {
  SustainabilityGuard,
  EmployeeGuard,
  AdminGuard,
  AuditorGuard,
  SuperAdminGuard,
} from './components/RoleGuard';
import Login from './pages/Login';
import SustainabilityOverview from './pages/SustainabilityOverview';
import EmissionsOverview from './pages/EmissionsOverview';
import EmissionsTrends from './pages/EmissionsTrends';
import ModeSplit from './pages/ModeSplit';
import LocationPerformance from './pages/LocationPerformance';
import BaselineSetup from './pages/BaselineSetup';
import TargetsTrajectory from './pages/TargetsTrajectory';
import OrganizationalBoundary from './pages/OrganizationalBoundary';
import RiskManagement from './pages/RiskManagement';
import DataQuality from './pages/DataQuality';
import Methodology from './pages/Methodology';
import Approvals from './pages/Approvals';
import AuditAssurance from './pages/AuditAssurance';
import ReportBuilder from './pages/ReportBuilder';
import Benchmarking from './pages/Benchmarking';
import SustainabilitySettings from './pages/SustainabilitySettings';
import EmployeeDashboard from './pages/EmployeeDashboard';
import CommuteProfile from './pages/CommuteProfile';
import OfferRide from './pages/OfferRide';
import FindRide from './pages/FindRide';
import ActiveTrip from './pages/ActiveTrip';
import MyTrips from './pages/MyTrips';
import MyImpact from './pages/MyImpact';
import EmployeeRewards from './pages/EmployeeRewards';
import EmployeeSettings from './pages/EmployeeSettings';
import RecurringRides from './pages/RecurringRides';
import RewardsAchievements from './pages/RewardsAchievements';
import Messages from './pages/Messages';
import AlertCenter from './pages/AlertCenter';
import AdminOverview from './pages/AdminOverview';
import AdminParticipation from './pages/AdminParticipation';
import AdminEmissions from './pages/AdminEmissions';
import RideOperations from './pages/RideOperations';
import AdminLocations from './pages/AdminLocations';
import AdminPolicies from './pages/AdminPolicies';
import AdminSettings from './pages/AdminSettings';
import UserManagement from './pages/UserManagement';
import AdminWorkplaceBenefits from './pages/AdminWorkplaceBenefits';
import AuditorOverview from './pages/AuditorOverview';
import AuditorEmissionsReview from './pages/AuditorEmissionsReview';
import AuditorBaselineReview from './pages/AuditorBaselineReview';
import AuditorFactorsReview from './pages/AuditorFactorsReview';
import AuditorRisksReview from './pages/AuditorRisksReview';
import AuditTrail from './pages/AuditTrail';
import EvidenceRepository from './pages/EvidenceRepository';
import AuditorReports from './pages/AuditorReports';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import TenantManagement from './pages/TenantManagement';
import UsageAnalytics from './pages/UsageAnalytics';
import SystemHealth from './pages/SystemHealth';
import SuperAdminSettings from './pages/SuperAdminSettings';
import SuperAdminAuditLog from './pages/SuperAdminAuditLog';
import PlaceholderPage from './pages/PlaceholderPage';
import NotFoundPage from './pages/NotFoundPage';
import ServerErrorPage from './pages/ServerErrorPage';
import LogCommuteDemo from './pages/LogCommuteDemo';
import ChartJSExample from './pages/ChartJSExample';
import CSRDCompliance from './pages/CSRDCompliance';
import RegulatoryReporting from './pages/RegulatoryReporting';
import RevenueReporting from './pages/RevenueReporting';
import ScenarioModeling from './pages/ScenarioModeling';
import InitiativeTracker from './pages/InitiativeTracker';
import EmissionFactors from './pages/EmissionFactors';
import TransportAnalytics from './pages/TransportAnalytics';
import ClimateActionPlan from './pages/ClimateActionPlan';
import DPIAModule from './pages/DPIAModule';
import UnauthorizedPage from './pages/UnauthorizedPage';

export const router = createBrowserRouter([
  // Login Route (outside RootLayout)
  { path: '/login', Component: Login },
  // Demo Route (outside RootLayout for clean display)
  { path: '/demo/log-commute', Component: LogCommuteDemo },
  // Standalone error pages (outside RootLayout so they render even if auth fails)
  { path: '/500', Component: ServerErrorPage },
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: ServerErrorPage,
    children: [
      // Unauthorized page (accessible to all authenticated users)
      { path: 'unauthorized', Component: UnauthorizedPage },

      // ── Sustainability Manager Routes (default landing) ──────────────
      // Guarded: sustainability + superadmin roles
      {
        Component: SustainabilityGuard,
        children: [
          { index: true, Component: SustainabilityOverview },
          { path: 'emissions', Component: EmissionsOverview },
          { path: 'emissions/trends', Component: EmissionsTrends },
          { path: 'emissions/modes', Component: ModeSplit },
          { path: 'emissions/locations', Component: LocationPerformance },
          { path: 'transport-analytics', Component: TransportAnalytics },
          { path: 'baseline', Component: BaselineSetup },
          { path: 'targets', Component: TargetsTrajectory },
          { path: 'boundary', Component: OrganizationalBoundary },
          { path: 'scenarios', Component: ScenarioModeling },
          { path: 'initiatives', Component: InitiativeTracker },
          { path: 'data-quality', Component: DataQuality },
          { path: 'emission-factors', Component: EmissionFactors },
          { path: 'methodology', Component: Methodology },
          { path: 'risks', Component: RiskManagement },
          { path: 'approvals', Component: Approvals },
          { path: 'audit', Component: AuditAssurance },
          { path: 'csrd-compliance', Component: CSRDCompliance },
          { path: 'regulatory-reporting', Component: RegulatoryReporting },
          { path: 'revenue-reporting', Component: RevenueReporting },
          { path: 'climate-action-plan', Component: ClimateActionPlan },
          { path: 'dpia', Component: DPIAModule },
          { path: 'reports', Component: ReportBuilder },
          { path: 'benchmarking', Component: Benchmarking },
          { path: 'alerts', Component: AlertCenter },
          { path: 'settings', Component: SustainabilitySettings },
        ],
      },

      // Developer/Testing Routes (accessible to all authenticated users)
      { path: 'chartjs-examples', Component: ChartJSExample },

      // ── Employee Routes ──────────────────────────────────────────────
      // Guarded: employee, sustainability, admin, superadmin
      {
        Component: EmployeeGuard,
        children: [
          { path: 'employee', Component: EmployeeDashboard },
          { path: 'employee/profile', Component: CommuteProfile },
          { path: 'employee/offer-ride', Component: OfferRide },
          { path: 'employee/find-ride', Component: FindRide },
          { path: 'employee/active-trip', Component: ActiveTrip },
          { path: 'employee/trips', Component: MyTrips },
          { path: 'employee/impact', Component: MyImpact },
          { path: 'employee/rewards', Component: EmployeeRewards },
          { path: 'employee/settings', Component: EmployeeSettings },
          { path: 'employee/recurring-rides', Component: RecurringRides },
          { path: 'employee/rewards-achievements', Component: RewardsAchievements },
          { path: 'employee/messages', Component: Messages },
        ],
      },

      // ── Admin Routes ─────────────────────────────────────────────────
      // Guarded: admin + superadmin
      {
        Component: AdminGuard,
        children: [
          { path: 'admin', Component: AdminOverview },
          { path: 'admin/participation', Component: AdminParticipation },
          { path: 'admin/emissions', Component: AdminEmissions },
          { path: 'admin/rides', Component: RideOperations },
          { path: 'admin/users', Component: UserManagement },
          { path: 'admin/locations', Component: AdminLocations },
          { path: 'admin/policies', Component: AdminPolicies },
          { path: 'admin/workplace-benefits', Component: AdminWorkplaceBenefits },
          { path: 'admin/settings', Component: AdminSettings },
        ],
      },

      // ── Auditor Routes ───────────────────────────────────────────────
      // Guarded: auditor + superadmin
      {
        Component: AuditorGuard,
        children: [
          { path: 'auditor', Component: AuditorOverview },
          { path: 'auditor/emissions', Component: AuditorEmissionsReview },
          { path: 'auditor/baseline', Component: AuditorBaselineReview },
          { path: 'auditor/factors', Component: AuditorFactorsReview },
          { path: 'auditor/risks', Component: AuditorRisksReview },
          { path: 'auditor/trail', Component: AuditTrail },
          { path: 'auditor/evidence', Component: EvidenceRepository },
          { path: 'auditor/reports', Component: AuditorReports },
        ],
      },

      // ── Super Admin Routes ───────────────────────────────────────────
      // Guarded: superadmin only
      {
        Component: SuperAdminGuard,
        children: [
          { path: 'superadmin', Component: SuperAdminDashboard },
          { path: 'superadmin/tenants', Component: TenantManagement },
          { path: 'superadmin/usage', Component: UsageAnalytics },
          { path: 'superadmin/health', Component: SystemHealth },
          { path: 'superadmin/audit-log', Component: SuperAdminAuditLog },
          { path: 'superadmin/settings', Component: SuperAdminSettings },
        ],
      },

      // 404 — unknown routes inside the authenticated shell
      { path: '*', Component: NotFoundPage },
    ],
  },
]);