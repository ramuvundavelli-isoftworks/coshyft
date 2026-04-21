import { useState } from 'react';
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
import { Doughnut } from 'react-chartjs-2';
import { doughnutChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';
import { useApi } from '../api';
import { superadminApi } from '../api';

export default function UsageAnalytics() {
  const [period, setPeriod] = useState('month');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const { data: usage, loading } = useApi(() => superadminApi.getUsage());

  const handleExport = () => {
    toast.success('Exporting usage analytics...');
    setIsExportDialogOpen(false);
  };

  const tenantBreakdown: any[] = usage?.tenant_breakdown ?? [];
  const topTenants = tenantBreakdown.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usage Analytics</h1>
          <p className="text-muted-foreground mt-1">Platform usage and user activity metrics</p>
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

      {loading ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Loading analytics...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info-subtle rounded-lg"><Users className="h-5 w-5 text-info" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{(usage?.total_users ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{usage?.active_tenants ?? 0} active tenants</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success-subtle rounded-lg"><Activity className="h-5 w-5 text-success" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Commutes Logged</p>
                  <p className="text-2xl font-bold text-foreground">{(usage?.total_commutes_logged ?? 0).toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info-subtle rounded-lg"><TrendingUp className="h-5 w-5 text-info" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Rides Completed</p>
                  <p className="text-2xl font-bold text-foreground">{(usage?.total_rides_completed ?? 0).toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning-subtle rounded-lg"><BarChart3 className="h-5 w-5 text-warning" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">CO₂ Saved (kg)</p>
                  <p className="text-2xl font-bold text-foreground">{(usage?.total_co2_saved_kg ?? 0).toLocaleString()}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tenant Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Activity by Tenant</h3>
              {topTenants.length > 0 ? (
                <div style={{ height: '300px', width: '100%' }}>
                  <Doughnut
                    data={{
                      labels: topTenants.map((t: any) => t.name),
                      datasets: [{
                        data: topTenants.map((t: any) => t.user_count),
                        backgroundColor: [
                          colors.chart.green,
                          colors.chart.blue,
                          colors.chart.purple,
                          '#f59e0b',
                          '#94a3b8',
                        ],
                        borderWidth: 0,
                      }],
                    }}
                    options={doughnutChartOptions}
                  />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">No tenant data available</p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Tenant User Breakdown</h3>
              <div className="space-y-3">
                {topTenants.map((t: any, idx: number) => (
                  <div key={t.tenant_id ?? idx} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.plan} · {t.status}</p>
                    </div>
                    <Badge className="bg-info-subtle text-info">{(t.user_count ?? 0).toLocaleString()} users</Badge>
                  </div>
                ))}
                {topTenants.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No tenants yet</p>
                )}
              </div>
            </Card>
          </div>

          {/* Platform Totals */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Platform Totals</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {([
                ['Total Tenants',     usage?.total_tenants ?? 0],
                ['Active Tenants',    usage?.active_tenants ?? 0],
                ['Oxypoints Awarded', (usage?.total_oxypoints_awarded ?? 0).toLocaleString()],
                ['Storage Used (GB)', (usage?.storage_used_gb ?? 0).toFixed(2)],
              ] as [string, any][]).map(([label, value]) => (
                <div key={label} className="p-4 bg-background-subtle rounded-lg">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold text-foreground mt-1">{value}</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Usage Analytics</DialogTitle>
            <DialogDescription>Download platform usage data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-background-subtle border rounded-lg">
              <p className="text-sm text-foreground font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Total users, commutes, rides per tenant</li>
                <li>CO₂ savings and oxypoints totals</li>
                <li>Tenant plan and status breakdown</li>
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
