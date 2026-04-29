import {
  LayoutDashboard,
  Activity,
  Target,
  TrendingDown,
  Database,
  AlertTriangle,
  CheckSquare,
  Shield,
  FileText,
  TrendingUp,
  Bell,
  Settings,
  Users,
  MapPin,
  FileCheck,
  BarChart3,
  Car,
  Award,
  User,
  Building2,
  Zap,
  Plug,
  Gift,
  Train,
  Globe,
  Flag,
  CreditCard,
  Euro,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: any;
  badge?: string;
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export function getNavigationForRole(role: Role): NavSection[] {
  switch (role) {
    case 'employee':
      return [
        {
          items: [
            { label: 'Dashboard', path: '/employee', icon: LayoutDashboard },
          ],
        },
        {
          title: 'Commute',
          items: [
            { label: 'Commute Profile', path: '/employee/profile', icon: User },
            { label: 'Offer Ride', path: '/employee/offer-ride', icon: Car },
            { label: 'Find Ride', path: '/employee/find-ride', icon: Car },
            { label: 'Active Trip', path: '/employee/active-trip', icon: Activity },
            { label: 'My Trips', path: '/employee/trips', icon: MapPin },
          ],
        },
        {
          title: 'Personal',
          items: [
            { label: 'My Impact', path: '/employee/impact', icon: TrendingDown },
            { label: 'Rewards', path: '/employee/rewards', icon: Award },
          ],
        },
        {
          items: [
            { label: 'Settings', path: '/employee/settings', icon: Settings },
          ],
        },
      ];

    case 'admin':
      return [
        {
          items: [
            { label: 'Overview', path: '/admin', icon: LayoutDashboard },
          ],
        },
        {
          title: 'Operations',
          items: [
            { label: 'Participation Analytics', path: '/admin/participation', icon: BarChart3 },
            { label: 'Emissions Analytics', path: '/admin/emissions', icon: Activity },
            { label: 'Ride Operations', path: '/admin/rides', icon: Car },
          ],
        },
        {
          title: 'Management',
          items: [
            { label: 'Users', path: '/admin/users', icon: Users },
            { label: 'Locations', path: '/admin/locations', icon: MapPin },
            { label: 'Policies', path: '/admin/policies', icon: FileCheck },
            { label: 'Workplace Benefits', path: '/admin/workplace-benefits', icon: Gift },
          ],
        },
        {
          items: [
            { label: 'Settings', path: '/admin/settings', icon: Settings },
          ],
        },
      ];

    case 'sustainability':
      return [
        {
          items: [
            { label: 'Overview', path: '/', icon: LayoutDashboard },
          ],
        },
        {
          title: 'Emissions Intelligence',
          items: [
            { label: 'Emissions Overview', path: '/emissions', icon: Activity },
            { label: 'Trends & Forecast', path: '/emissions/trends', icon: TrendingUp },
            { label: 'Mode Distribution', path: '/emissions/modes', icon: BarChart3 },
            { label: 'Location Performance', path: '/emissions/locations', icon: MapPin },
            { label: 'Public Transport', path: '/transport-analytics', icon: Train },
          ],
        },
        {
          title: 'Baseline & Targets',
          items: [
            { label: 'Baseline Setup', path: '/baseline', icon: Target },
            { label: 'Targets & Trajectory', path: '/targets', icon: TrendingDown },
            { label: 'Organizational Boundary', path: '/boundary', icon: Building2 },
          ],
        },
        {
          title: 'Reduction Planning',
          items: [
            { label: 'Scenario Modeling', path: '/scenarios', icon: Zap },
            { label: 'Initiative Tracker', path: '/initiatives', icon: CheckSquare },
          ],
        },
        {
          title: 'Data Governance',
          items: [
            { label: 'Data Quality', path: '/data-quality', icon: Database },
            { label: 'Emission Factors', path: '/emission-factors', icon: FileText },
            { label: 'Methodology', path: '/methodology', icon: FileCheck },
          ],
        },
        {
          title: 'Risk & Compliance',
          items: [
            { label: 'Risk Management', path: '/risks', icon: AlertTriangle },
            { label: 'Approvals', path: '/approvals', icon: CheckSquare, badge: '3' },
            { label: 'Audit & Assurance', path: '/audit', icon: Shield },
            { label: 'CSRD/ESRS E1', path: '/csrd-compliance', icon: FileCheck },
            { label: 'Climate Action Plan', path: '/climate-action-plan', icon: Flag },
            { label: 'DPIA (GDPR)', path: '/dpia', icon: Shield },
            { label: 'Regulatory Reporting', path: '/regulatory-reporting', icon: Globe },
            { label: 'Revenue Reporting', path: '/revenue-reporting', icon: Euro },
          ],
        },
        {
          title: 'Reporting',
          items: [
            { label: 'Report Builder', path: '/reports', icon: FileText },
            { label: 'Benchmarking', path: '/benchmarking', icon: TrendingUp },
          ],
        },
        {
          items: [
            { label: 'Alert Center', path: '/alerts', icon: Bell, badge: '4' },
          ],
        },
        {
          items: [
            { label: 'Settings', path: '/settings', icon: Settings },
          ],
        },
      ];

    case 'auditor':
      return [
        {
          items: [
            { label: 'Overview', path: '/auditor', icon: LayoutDashboard },
          ],
        },
        {
          title: 'Review',
          items: [
            { label: 'Emissions Overview', path: '/auditor/emissions', icon: Activity },
            { label: 'Baseline & Targets', path: '/auditor/baseline', icon: Target },
            { label: 'Emission Factors', path: '/auditor/factors', icon: FileText },
            { label: 'Risk Register', path: '/auditor/risks', icon: AlertTriangle },
          ],
        },
        {
          title: 'Evidence',
          items: [
            { label: 'Audit Trail', path: '/auditor/trail', icon: Shield },
            { label: 'Evidence Repository', path: '/auditor/evidence', icon: Database },
            { label: 'Report Archive', path: '/auditor/reports', icon: FileCheck },
          ],
        },
      ];

    case 'superadmin':
      return [
        {
          items: [
            { label: 'Dashboard', path: '/superadmin', icon: LayoutDashboard },
          ],
        },
        {
          title: 'Platform',
          items: [
            { label: 'Tenant Management', path: '/superadmin/tenants', icon: Building2 },
            { label: 'Usage Analytics', path: '/superadmin/usage', icon: BarChart3 },
            { label: 'System Health', path: '/superadmin/health', icon: Activity },
            { label: 'Audit Log', path: '/superadmin/audit-log', icon: Shield },
          ],
        },
        {
          items: [
            { label: 'Settings', path: '/superadmin/settings', icon: Settings },
          ],
        },
      ];

    default:
      return [];
  }
}