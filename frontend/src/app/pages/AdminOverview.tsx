import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { KPICard } from '../components/KPICard';
import {
  Users, Car, MapPin, BarChart3, AlertTriangle, Leaf,
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { doughnutChartOptions, colors } from '../utils/chartConfig';
import { useApi, adminApi } from '../api';

export default function AdminOverview() {
  const { data: overview, loading } = useApi(() => adminApi.getOverview());
  const { data: participation } = useApi(() => adminApi.getParticipation());
  const { data: locations } = useApi(() => adminApi.getLocations());

  const depts: any[] = Array.isArray(participation) ? participation : [];
  const locationList: any[] = Array.isArray(locations) ? locations : [];
  const lowDepts = depts.filter(d => d.participation_rate < 75);

  const modeColors = [colors.chart.blue, colors.chart.green, '#22c55e', '#ef4444'];
  // Mode adoption from overview if available, otherwise placeholder
  const modeData = [
    { mode: 'Carpool', value: 18 },
    { mode: 'Public Transit', value: 22 },
    { mode: 'Bike / Walk', value: 15 },
    { mode: 'SOV', value: 45 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="py-4">
        <h1 className="font-bold text-[32px] text-[#101828] tracking-[0.07px]">Operations Overview</h1>
        <p className="text-[16px] text-[#6a7282] mt-1">Monitor participation, rides, and operational metrics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overall Participation"
          value={loading ? '—' : String(overview?.participation_rate ?? '—')}
          unit="%"
          icon={Users}
          trend="up"
          status="good"
        />
        <KPICard
          title="Active Rides"
          value={loading ? '—' : String(overview?.active_rides ?? '—')}
          icon={Car}
        />
        <KPICard
          title="Total Employees"
          value={loading ? '—' : String((overview?.total_users ?? 0).toLocaleString())}
          icon={Users}
        />
        <KPICard
          title="Active Locations"
          value={loading ? '—' : String(locationList.length || '—')}
          icon={MapPin}
        />
      </div>

      {/* Low participation alert */}
      {lowDepts.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-900">
                {lowDepts.length} Department{lowDepts.length > 1 ? 's' : ''} Below 75% Target
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {lowDepts.map(d => d.department).join(', ')} — consider sending engagement reminders
              </p>
            </div>
            <Link to="/admin/participation">
              <Button size="sm" variant="outline">View Details</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participation by Department */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Participation by Department</h2>
            <Link to="/admin/participation">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {depts.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No department data yet</p>
          ) : (
            <div className="space-y-3">
              {depts.slice(0, 6).map((d: any) => (
                <div key={d.department} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-28 shrink-0 truncate">{d.department}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${d.participation_rate >= 75 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.min(d.participation_rate, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {d.participation_rate}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Summary stats */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Summary</h2>
          <div className="space-y-3">
            {([
              ['Total Commutes Logged', (overview?.total_commutes_logged ?? 0).toLocaleString()],
              ['Active Users', (overview?.active_users ?? 0).toLocaleString()],
              ['Total Rides', (overview?.total_rides ?? 0).toLocaleString()],
              ['CO₂ Saved (kg)', (overview?.total_co2_saved_kg ?? 0).toLocaleString()],
              ['Total Emissions (kg)', (overview?.total_emissions_kg ?? 0).toLocaleString()],
            ] as [string, any][]).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm text-gray-700">{label}</span>
                <Badge className="bg-gray-100 text-gray-800">
                  {loading ? '—' : value}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Mode Adoption & Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Mode Adoption</h2>
          <div style={{ height: '220px', width: '100%' }}>
            <Doughnut
              data={{
                labels: modeData.map(d => d.mode),
                datasets: [{
                  data: modeData.map(d => d.value),
                  backgroundColor: modeColors,
                  borderWidth: 0,
                }],
              }}
              options={doughnutChartOptions}
            />
          </div>
          <div className="mt-4 space-y-2">
            {modeData.map((m, i) => (
              <div key={m.mode} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: modeColors[i] }} />
                  <span className="text-gray-700">{m.mode}</span>
                </div>
                <span className="font-medium text-gray-900">{m.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Locations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Office Locations</h2>
            <Link to="/admin/locations">
              <Button variant="ghost" size="sm">Manage</Button>
            </Link>
          </div>
          {locationList.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No locations added yet</p>
          ) : (
            <div className="space-y-3">
              {locationList.slice(0, 5).map((loc: any) => (
                <div key={loc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-50 rounded">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{loc.name}</p>
                      <p className="text-xs text-gray-500">{loc.city}, {loc.country}</p>
                    </div>
                  </div>
                  <Badge className={loc.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                    {loc.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg"><Users className="h-6 w-6 text-blue-600" /></div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
            </div>
            <p className="text-sm text-gray-600">Add, edit, or suspend user accounts</p>
          </Card>
        </Link>
        <Link to="/admin/participation">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-lg"><BarChart3 className="h-6 w-6 text-green-600" /></div>
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">Deep dive into participation metrics</p>
          </Card>
        </Link>
        <Link to="/admin/rides">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 rounded-lg"><Car className="h-6 w-6 text-purple-600" /></div>
              <h3 className="font-semibold text-gray-900">Monitor Rides</h3>
            </div>
            <p className="text-sm text-gray-600">Track active and completed rides</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
