import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Users, Activity, TrendingUp, Download, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const userActivityData = [
  { month: 'Jan', logins: 8420, actions: 45200 },
  { month: 'Feb', logins: 8950, actions: 48100 },
  { month: 'Mar', logins: 9340, actions: 51300 },
  { month: 'Apr', logins: 9720, actions: 53800 },
];

const featureUsageData = [
  { feature: 'Emissions Tracking', usage: 92 },
  { feature: 'Ride Matching', usage: 78 },
  { feature: 'Reports', usage: 85 },
  { feature: 'Analytics', usage: 68 },
  { feature: 'Risk Management', usage: 54 },
];

const tenantActivityData = [
  { name: 'Acme Corp', value: 35 },
  { name: 'TechCorp', value: 25 },
  { name: 'Global Industries', value: 30 },
  { name: 'Others', value: 10 },
];

export default function UsageAnalytics() {
  const [period, setPeriod] = useState('month');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleExport = () => {
    toast.success('Exporting usage analytics...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usage Analytics</h1>
          <p className="text-gray-600 mt-1">Platform usage and user activity metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">13,300</p>
              <p className="text-xs text-green-600">↑ 8.5% vs last month</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Actions</p>
              <p className="text-2xl font-bold text-gray-900">53.8K</p>
              <p className="text-xs text-green-600">↑ 4.9% vs last month</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Session Time</p>
              <p className="text-2xl font-bold text-gray-900">18m</p>
              <p className="text-xs text-green-600">↑ 2m vs last month</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Feature Adoption</p>
              <p className="text-2xl font-bold text-gray-900">75%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* User Activity Trend */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">User Activity Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userActivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={2} name="Logins" />
            <Line type="monotone" dataKey="actions" stroke="#10b981" strokeWidth={2} name="Actions" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Feature Usage & Tenant Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Feature Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureUsageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="feature" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="usage" fill="#3b82f6" name="Usage %" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Activity by Tenant</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={tenantActivityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {tenantActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Top User Actions</h3>
        <div className="space-y-3">
          {[
            { action: 'View Emissions Dashboard', count: 12450 },
            { action: 'Log Commute Trip', count: 9820 },
            { action: 'Generate Report', count: 7630 },
            { action: 'Update Profile', count: 5420 },
            { action: 'Search Ride Match', count: 4210 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-medium text-gray-900">{item.action}</span>
              <Badge className="bg-blue-100 text-blue-700">{item.count.toLocaleString()} actions</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Usage Analytics</DialogTitle>
            <DialogDescription>Download platform usage data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>User activity metrics</li>
                <li>Feature usage statistics</li>
                <li>Tenant activity breakdown</li>
                <li>Top actions analysis</li>
                <li>Session data</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
