import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Shield, Server, Users, AlertTriangle, TrendingUp, Database, Activity, Download, Eye, Plus, Settings } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';

const tenants = [
  { id: 't1', name: 'Acme Corporation', status: 'active', users: 4250, emissions: 1850, plan: 'enterprise' },
  { id: 't2', name: 'TechCorp Inc', status: 'active', users: 2100, emissions: 920, plan: 'professional' },
  { id: 't3', name: 'Global Industries', status: 'active', users: 6800, emissions: 3200, plan: 'enterprise' },
  { id: 't4', name: 'StartupXYZ', status: 'trial', users: 150, emissions: 65, plan: 'trial' },
];

const systemMetrics = [
  { month: 'Jan', uptime: 99.9, users: 12000, emissions: 5200 },
  { month: 'Feb', uptime: 99.95, users: 12500, emissions: 5400 },
  { month: 'Mar', uptime: 99.8, users: 13000, emissions: 5600 },
  { month: 'Apr', uptime: 99.92, users: 13300, emissions: 5800 },
];

export default function SuperAdminDashboard() {
  const [isViewTenantDialogOpen, setIsViewTenantDialogOpen] = useState(false);
  const [isAddTenantDialogOpen, setIsAddTenantDialogOpen] = useState(false);
  const [isSystemHealthDialogOpen, setIsSystemHealthDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [tenantName, setTenantName] = useState('');

  const totalUsers = tenants.reduce((sum, t) => sum + t.users, 0);
  const totalEmissions = tenants.reduce((sum, t) => sum + t.emissions, 0);

  const handleAddTenant = () => {
    toast.success(`Tenant "${tenantName}" created successfully`);
    setIsAddTenantDialogOpen(false);
    setTenantName('');
  };

  const handleExport = () => {
    toast.success('Exporting platform analytics...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#00bc7d] to-[#009689] rounded-[14px] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Kaisei_Decol',sans-serif] font-bold text-[42px] leading-[32px] text-white tracking-[0.0703px] mb-2">Super Admin Dashboard</h1>
            <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-[#d0fae5] tracking-[-0.3125px]">
              Platform-wide monitoring and tenant management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setIsSystemHealthDialogOpen(true)} className="bg-white hover:bg-gray-50">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </Button>
            <Button onClick={() => setIsAddTenantDialogOpen(true)} className="bg-black hover:bg-gray-900 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{tenants.filter(t => t.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Emissions</p>
              <p className="text-xl font-bold text-gray-900">{totalEmissions.toLocaleString()} tCO₂e</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">System Uptime</p>
              <p className="text-2xl font-bold text-green-600">99.9%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold text-gray-900 mb-4">Platform Growth</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line
              data={{
                labels: systemMetrics.map(d => d.month),
                datasets: [
                  {
                    label: 'Users',
                    data: systemMetrics.map(d => d.users),
                    borderColor: colors.chart.blue,
                    borderWidth: 2,
                    fill: false,
                  },
                ],
              }}
              options={lineChartOptions}
            />
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold text-gray-900 mb-4">System Uptime</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line
              data={{
                labels: systemMetrics.map(d => d.month),
                datasets: [
                  {
                    label: 'Uptime %',
                    data: systemMetrics.map(d => d.uptime),
                    borderColor: colors.chart.green,
                    borderWidth: 2,
                    fill: false,
                  },
                ],
              }}
              options={{
                ...lineChartOptions,
                scales: {
                  ...lineChartOptions.scales,
                  y: {
                    ...lineChartOptions.scales?.y,
                    min: 99,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Tenant Overview</h3>
          <Button variant="outline" size="sm" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Emissions</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell>
                  <Badge className={
                    tenant.status === 'active' ? 'bg-green-100 text-green-700' :
                    tenant.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell>{tenant.users.toLocaleString()}</TableCell>
                <TableCell>{tenant.emissions.toLocaleString()} tCO₂e</TableCell>
                <TableCell>
                  <Badge className="bg-purple-100 text-purple-700">{tenant.plan}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTenant(tenant);
                        setIsViewTenantDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Tenant Dialog */}
      <Dialog open={isViewTenantDialogOpen} onOpenChange={setIsViewTenantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
            <DialogDescription>{selectedTenant?.name}</DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Status</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTenant.status}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Plan</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTenant.plan}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Total Users</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedTenant.users.toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Emissions</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedTenant.emissions.toLocaleString()}</p>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewTenantDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tenant Dialog */}
      <Dialog open={isAddTenantDialogOpen} onOpenChange={setIsAddTenantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>Create a new tenant organization</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tenant-name">Tenant Name *</Label>
              <Input
                id="tenant-name"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="e.g., Acme Corporation"
              />
            </div>
            <div>
              <Label htmlFor="plan">Plan *</Label>
              <Select defaultValue="trial">
                <SelectTrigger id="plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="admin-email">Admin Email *</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTenantDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTenant} disabled={!tenantName}>
              <Plus className="h-4 w-4 mr-2" />
              Create Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* System Health Dialog */}
      <Dialog open={isSystemHealthDialogOpen} onOpenChange={setIsSystemHealthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>System Health</DialogTitle>
            <DialogDescription>Current platform status</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">API Status</span>
                <Badge className="bg-green-100 text-green-700">Operational</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Database</span>
                <Badge className="bg-green-100 text-green-700">Healthy</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Storage</span>
                <Badge className="bg-green-100 text-green-700">78% Available</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Response Time</span>
                <Badge className="bg-green-100 text-green-700">124ms avg</Badge>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSystemHealthDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Platform Analytics</DialogTitle>
            <DialogDescription>Download system-wide data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
            <Select defaultValue="excel">
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel Workbook</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
              </SelectContent>
            </Select>
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