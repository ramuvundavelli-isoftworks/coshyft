import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { KPICard } from '../components/KPICard';
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
import {
  Building2,
  Users,
  Activity,
  TrendingUp,
  Plus,
  Eye,
  Download,
  Database,
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { superadminApi } from '../api';

export default function SuperAdminDashboard() {
  const [isViewTenantDialogOpen, setIsViewTenantDialogOpen] = useState(false);
  const [isAddTenantDialogOpen, setIsAddTenantDialogOpen] = useState(false);
  const [isSystemHealthDialogOpen, setIsSystemHealthDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [form, setForm] = useState({ name: '', slug: '', contact_email: '', contact_name: '', plan: 'starter' });

  const { data: dashboard, loading: dashLoading } = useApi(() => superadminApi.getDashboard());
  const { data: tenantsData, loading: tenantsLoading, refetch: refetchTenants } = useApi(() => superadminApi.getTenants());
  const { data: healthData } = useApi(() => superadminApi.getSystemHealth());

  const createTenantMutation = useApiMutation((data: any) => superadminApi.createTenant(data));

  const tenants: any[] = Array.isArray(tenantsData) ? tenantsData : [];

  const handleAddTenant = async () => {
    if (!form.name || !form.slug || !form.contact_email || !form.contact_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    const result = await createTenantMutation.execute(form);
    if (result.success) {
      toast.success(`Tenant "${form.name}" created successfully`);
      setIsAddTenantDialogOpen(false);
      setForm({ name: '', slug: '', contact_email: '', contact_name: '', plan: 'starter' });
      refetchTenants();
    } else {
      toast.error(result.error?.message || 'Failed to create tenant');
    }
  };

  const handleExport = () => {
    toast.success('Exporting platform analytics...');
    setIsExportDialogOpen(false);
  };

  const platformGrowthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const platformGrowthData = [8200, 9100, 10400, 11800, 12600, dashboard?.total_users ?? 13000];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between py-4">
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-[32px] leading-[40px] text-foreground tracking-[0.0703px] mb-2">
            Super Admin Dashboard
          </h1>
          <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-muted-foreground tracking-[-0.3125px]">
            Platform-wide monitoring and tenant management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsSystemHealthDialogOpen(true)}
            className="h-9 bg-card border border-[rgba(0,0,0,0.1)] hover:bg-background-subtle shadow-sm hover:shadow-md"
          >
            <Activity className="h-4 w-4 mr-2" />
            <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-5 text-foreground tracking-[-0.1504px]">
              System Health
            </span>
          </Button>
          <Button
            onClick={() => setIsAddTenantDialogOpen(true)}
            className="h-9 bg-brand-500 hover:bg-brand-500 text-white shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-5 text-white tracking-[-0.1504px]">
              Add Tenant
            </span>
          </Button>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={Building2}
          title="Active Tenants"
          value={dashLoading ? '—' : (dashboard?.total_tenants ?? 0)}
        />
        <KPICard
          icon={Users}
          title="Total Users"
          value={dashLoading ? '—' : (dashboard?.total_users ?? 0).toLocaleString()}
        />
        <KPICard
          icon={Database}
          title="Total Commutes"
          value={dashLoading ? '—' : (dashboard?.total_commutes ?? 0).toLocaleString()}
        />
        <KPICard
          icon={TrendingUp}
          title="CO₂ Saved (kg)"
          value={dashLoading ? '—' : (dashboard?.total_co2_saved_kg ?? 0).toLocaleString()}
        />
      </div>

      {/* System Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Platform User Growth</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line
              data={{
                labels: platformGrowthLabels,
                datasets: [
                  {
                    label: 'Users',
                    data: platformGrowthData,
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

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">CO₂ Saved Over Time (kg)</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line
              data={{
                labels: platformGrowthLabels,
                datasets: [
                  {
                    label: 'CO₂ Saved (kg)',
                    data: [580, 920, 1340, 2100, 3060, dashboard?.total_co2_saved_kg ?? 4250],
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

      {/* Tenants Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Tenant Overview</h3>
          <Button variant="outline" size="sm" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
        {tenantsLoading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading tenants...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Offices</TableHead>
                <TableHead>Emissions (tCO₂e)</TableHead>
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
                      tenant.status === 'active'      ? 'bg-success-subtle text-success' :
                      tenant.status === 'trial'       ? 'bg-info-subtle text-info' :
                      tenant.status === 'suspended'   ? 'bg-destructive-subtle text-destructive' :
                                                        'bg-muted text-foreground'
                    }>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{(tenant.user_count ?? 0).toLocaleString()}</TableCell>
                  <TableCell>{tenant.office_count ?? 0}</TableCell>
                  <TableCell>{(tenant.total_emissions ?? 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className="bg-info-subtle text-info">{tenant.plan}</Badge>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTenant.status}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Plan</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTenant.plan}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Total Users</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{(selectedTenant.user_count ?? 0).toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Emissions (tCO₂e)</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{(selectedTenant.total_emissions ?? 0).toLocaleString()}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Contact</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTenant.contact_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedTenant.contact_email}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Region</Label>
                  <p className="font-medium text-foreground mt-1">{selectedTenant.primary_region}</p>
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
            <DialogDescription>Onboard a new organisation onto the platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tenant-name">Organisation Name *</Label>
              <Input
                id="tenant-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Acme Corporation"
              />
            </div>
            <div>
              <Label htmlFor="tenant-slug">Slug (URL identifier) *</Label>
              <Input
                id="tenant-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="e.g., acme-corp"
              />
            </div>
            <div>
              <Label htmlFor="contact-name">Contact Name *</Label>
              <Input
                id="contact-name"
                value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                placeholder="e.g., Jane Smith"
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Contact Email *</Label>
              <Input
                id="contact-email"
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label htmlFor="plan">Plan *</Label>
              <Select value={form.plan} onValueChange={(val) => setForm({ ...form, plan: val })}>
                <SelectTrigger id="plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTenantDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddTenant}
              disabled={createTenantMutation.loading || !form.name || !form.slug || !form.contact_email || !form.contact_name}
            >
              <Plus className="h-4 w-4 mr-2" />
              {createTenantMutation.loading ? 'Creating...' : 'Create Tenant'}
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
            {(healthData?.services ?? [
              { name: 'API Server', status: 'healthy' },
              { name: 'Database', status: 'healthy' },
              { name: 'Redis Cache', status: 'healthy' },
              { name: 'Background Workers', status: 'healthy' },
            ]).map((svc: any) => (
              <div key={svc.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{svc.name}</span>
                  <Badge className={svc.status === 'healthy' ? 'bg-success-subtle text-success' : 'bg-destructive-subtle text-destructive'}>
                    {svc.status === 'healthy' ? 'Healthy' : svc.status}
                  </Badge>
                </div>
                {svc.latency_ms != null && (
                  <p className="text-sm text-muted-foreground mt-1">{svc.latency_ms}ms latency</p>
                )}
              </div>
            ))}
            {healthData && (
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-background-subtle rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">CPU</p>
                  <p className="font-bold text-foreground">{healthData.cpu_usage_percent}%</p>
                </div>
                <div className="p-3 bg-background-subtle rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Memory</p>
                  <p className="font-bold text-foreground">{healthData.memory_usage_percent}%</p>
                </div>
                <div className="p-3 bg-background-subtle rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Disk</p>
                  <p className="font-bold text-foreground">{healthData.disk_usage_percent}%</p>
                </div>
              </div>
            )}
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
