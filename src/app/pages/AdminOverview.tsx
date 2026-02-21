import React from 'react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { KPICard } from '../components/KPICard';
import { BarChart3, Users, TrendingUp, MapPin, AlertTriangle, Car } from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { barChartOptions, lineChartOptions, doughnutChartOptions, colors } from '../utils/chartConfig';

const participationByDept = [
  { dept: 'Engineering', participation: 82, target: 75 },
  { dept: 'Sales', participation: 68, target: 75 },
  { dept: 'Marketing', participation: 91, target: 75 },
  { dept: 'Operations', participation: 76, target: 75 },
  { dept: 'Finance', participation: 58, target: 75 },
  { dept: 'HR', participation: 95, target: 75 },
];

const weeklyTrends = [
  { week: 'Week 1', rides: 287, users: 645 },
  { week: 'Week 2', rides: 312, users: 672 },
  { week: 'Week 3', rides: 298, users: 658 },
  { week: 'Week 4', rides: 334, users: 701 },
];

const modeAdoption = [
  { mode: 'Carpool', value: 18, color: '#3b82f6' },
  { mode: 'Public Transit', value: 22, color: '#10b981' },
  { mode: 'Bike/Walk', value: 15, color: '#22c55e' },
  { mode: 'SOV', value: 45, color: '#ef4444' },
];

export default function AdminOverview() {
  const lowParticipationDepts = participationByDept.filter(d => d.participation < d.target);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between py-4">
        {/* Left - Title */}
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-[32px] leading-[40px] text-[#101828] tracking-[0.0703px] mb-2">
            Operations Overview
          </h1>
          <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-[#6a7282] tracking-[-0.3125px]">
            Monitor participation, rides, and operational metrics
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Overall Participation"
          value="78"
          unit="%"
          change={2.4}
          changeLabel="vs last month"
          icon={Users}
          trend="up"
          status="good"
        />
        <KPICard
          title="Active Rides Today"
          value="42"
          icon={Car}
        />
        <KPICard
          title="Total Employees"
          value="3,210"
          icon={Users}
        />
        <KPICard
          title="Active Locations"
          value="4"
          icon={MapPin}
        />
      </div>

      {/* Alerts */}
      {lowParticipationDepts.length > 0 && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-yellow-900">
                {lowParticipationDepts.length} Department{lowParticipationDepts.length > 1 ? 's' : ''} Below Target
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                {lowParticipationDepts.map(d => d.dept).join(', ')} need engagement campaigns
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Participation by Department</h2>
            <Link to="/admin/participation">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar
              data={{
                labels: participationByDept.map(d => d.dept),
                datasets: [
                  {
                    label: 'Participation %',
                    data: participationByDept.map(d => d.participation),
                    backgroundColor: colors.chart.blue,
                  },
                  {
                    label: 'Target %',
                    data: participationByDept.map(d => d.target),
                    backgroundColor: colors.chart.green,
                  },
                ],
              }}
              options={barChartOptions}
            />
          </div>
        </Card>

        {/* Weekly Trends */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Activity Trends</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <Line
              data={{
                labels: weeklyTrends.map(d => d.week),
                datasets: [
                  {
                    label: 'Total Rides',
                    data: weeklyTrends.map(d => d.rides),
                    borderColor: colors.chart.blue,
                    borderWidth: 2,
                    fill: false,
                  },
                  {
                    label: 'Active Users',
                    data: weeklyTrends.map(d => d.users),
                    borderColor: colors.chart.green,
                    borderWidth: 2,
                    fill: false,
                  },
                ],
              }}
              options={lineChartOptions}
            />
          </div>
        </Card>
      </div>

      {/* Mode Adoption & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mode Adoption */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Mode Adoption</h2>
          <div style={{ height: '250px', width: '100%' }}>
            <Doughnut
              data={{
                labels: modeAdoption.map(d => d.mode),
                datasets: [
                  {
                    data: modeAdoption.map(d => d.value),
                    backgroundColor: modeAdoption.map(d => d.color),
                    borderWidth: 0,
                  },
                ],
              }}
              options={doughnutChartOptions}
            />
          </div>
          <div className="mt-4 space-y-2">
            {modeAdoption.map((mode) => (
              <div key={mode.mode} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mode.color }} />
                  <span className="text-gray-700">{mode.mode}</span>
                </div>
                <span className="font-medium text-gray-900">{mode.value}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">New Carpool Created</p>
                <p className="text-sm text-gray-500">Engineering Dept • 15 min ago</p>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Policy Updated</p>
                <p className="text-sm text-gray-500">Remote Work Guidelines • 2 hours ago</p>
              </div>
              <Badge variant="outline">Updated</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">User Enrolled</p>
                <p className="text-sm text-gray-500">Sales Dept • 3 hours ago</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Incident Reported</p>
                <p className="text-sm text-gray-500">Carpool ID #1247 • 5 hours ago</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
          </div>
          <Link to="/admin/rides">
            <Button variant="outline" className="w-full mt-4">View All Activity</Button>
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
            </div>
            <p className="text-sm text-gray-600">
              Add, edit, or suspend user accounts
            </p>
          </Card>
        </Link>
        <Link to="/admin/participation">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">
              Deep dive into participation metrics
            </p>
          </Card>
        </Link>
        <Link to="/admin/rides">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Car className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Monitor Rides</h3>
            </div>
            <p className="text-sm text-gray-600">
              Track active and completed rides
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}