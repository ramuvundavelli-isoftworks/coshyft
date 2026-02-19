import { createBrowserRouter } from 'react-router';
import RootLayout from './components/RootLayout';
import Login from './pages/Login';
import SustainabilityOverview from './pages/SustainabilityOverview';
import EmissionsOverview from './pages/EmissionsOverview';
import EmissionsTrends from './pages/EmissionsTrends';
import ModeSplit from './pages/ModeSplit';
import LocationPerformance from './pages/LocationPerformance';
import EmissionFactors from './pages/EmissionFactors';
import ScenarioModeling from './pages/ScenarioModeling';
import InitiativeTracker from './pages/InitiativeTracker';
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
import PlaceholderPage from './pages/PlaceholderPage';
import LogCommuteDemo from './pages/LogCommuteDemo';

export const router = createBrowserRouter([
  // Login Route (outside RootLayout)
  { path: '/login', Component: Login },
  // Demo Route (outside RootLayout for clean display)
  { path: '/demo/log-commute', Component: LogCommuteDemo },
  {
    path: '/',
    Component: RootLayout,
    children: [
      // Sustainability Manager Routes (default)
      { index: true, Component: SustainabilityOverview },
      { path: 'emissions', Component: EmissionsOverview },
      { path: 'emissions/trends', Component: EmissionsTrends },
      { path: 'emissions/modes', Component: ModeSplit },
      { path: 'emissions/locations', Component: LocationPerformance },
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
      { path: 'reports', Component: ReportBuilder },
      { path: 'benchmarking', Component: Benchmarking },
      { path: 'alerts', Component: AlertCenter },
      { path: 'settings', Component: SustainabilitySettings },
      
      // Employee Routes
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
      
      // Admin Routes
      { path: 'admin', Component: AdminOverview },
      { path: 'admin/participation', Component: AdminParticipation },
      { path: 'admin/emissions', Component: AdminEmissions },
      { path: 'admin/rides', Component: RideOperations },
      { path: 'admin/users', Component: UserManagement },
      { path: 'admin/locations', Component: AdminLocations },
      { path: 'admin/policies', Component: AdminPolicies },
      { path: 'admin/settings', Component: AdminSettings },
      
      // Auditor Routes
      { path: 'auditor', Component: AuditorOverview },
      { path: 'auditor/emissions', Component: AuditorEmissionsReview },
      { path: 'auditor/baseline', Component: AuditorBaselineReview },
      { path: 'auditor/factors', Component: AuditorFactorsReview },
      { path: 'auditor/risks', Component: AuditorRisksReview },
      { path: 'auditor/trail', Component: AuditTrail },
      { path: 'auditor/evidence', Component: EvidenceRepository },
      { path: 'auditor/reports', Component: AuditorReports },
      
      // Super Admin Routes
      { path: 'superadmin', Component: SuperAdminDashboard },
      { path: 'superadmin/tenants', Component: TenantManagement },
      { path: 'superadmin/usage', Component: UsageAnalytics },
      { path: 'superadmin/health', Component: SystemHealth },
      { path: 'superadmin/settings', Component: SuperAdminSettings },
      
      // 404
      { path: '*', Component: PlaceholderPage },
    ],
  },
]);