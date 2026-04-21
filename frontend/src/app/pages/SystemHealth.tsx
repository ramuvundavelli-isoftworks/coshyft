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
import { Activity, Server, Database, Zap, CheckCircle, Download, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';
import { useApi } from '../api';
import { superadminApi } from '../api';

const RESOURCE_LABELS = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
const CPU_DATA     = [28, 22, 68, 82, 64, 38];
const MEMORY_DATA  = [58, 55, 71, 76, 70, 63];
const STORAGE_DATA = [41, 41, 41, 42, 42, 42];

export default function SystemHealth() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const { data: health, loading, refetch } = useApi(() => superadminApi.getSystemHealth());

  const handleRefresh = async () => {
    await refetch();
    toast.success('System metrics refreshed');
  };

  const handleExport = () => {
    toast.success('Exporting system health report...');
    setIsExportDialogOpen(false);
  };

  const services: any[] = health?.services ?? [];
  const overallStatus = health?.status ?? 'healthy';

  const statusColor = overallStatus === 'healthy'  ? 'text-success' :
                      overallStatus === 'degraded' ? 'text-warning' : 'text-destructive';
  const statusLabel = overallStatus === 'healthy'  ? 'Operational' :
                      overallStatus === 'degraded' ? 'Degraded' : 'Down';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Health</h1>
          <p className="text-muted-foreground mt-1">Real-time platform monitoring and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg"><CheckCircle className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-sm text-muted-foreground">System Status</p>
              <p className={`text-lg font-bold ${statusColor}`}>{loading ? '—' : statusLabel}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg"><Activity className="h-5 w-5 text-info" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Uptime (hours)</p>
              <p className="text-2xl font-bold text-foreground">{loading ? '—' : (health?.uptime_hours ?? '—')}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg"><Zap className="h-5 w-5 text-info" /></div>
            <div>
              <p className="text-sm text-muted-foreground">API Latency</p>
              <p className="text-2xl font-bold text-foreground">{loading ? '—' : `${health?.api_latency_ms ?? '—'}ms`}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg"><Database className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-sm text-muted-foreground">DB Latency</p>
              <p className="text-2xl font-bold text-foreground">{loading ? '—' : `${health?.db_latency_ms ?? '—'}ms`}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Resource Usage Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Resource Usage — Last 24h</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <Line
            data={{
              labels: RESOURCE_LABELS,
              datasets: [
                { label: 'CPU %',     data: CPU_DATA,     borderColor: colors.chart.blue,  borderWidth: 2, fill: false },
                { label: 'Memory %',  data: MEMORY_DATA,  borderColor: colors.chart.green, borderWidth: 2, fill: false },
                { label: 'Storage %', data: STORAGE_DATA, borderColor: '#94a3b8',          borderWidth: 2, fill: false },
              ],
            }}
            options={lineChartOptions}
          />
        </div>
      </Card>

      {/* Service Status & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Service Status</h3>
          <div className="space-y-3">
            {services.length > 0 ? services.map((svc: any) => (
              <div key={svc.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <span className="font-medium text-foreground">{svc.name}</span>
                    {svc.latency_ms != null && (
                      <p className="text-xs text-muted-foreground">{svc.latency_ms}ms</p>
                    )}
                  </div>
                </div>
                <Badge className={svc.status === 'healthy' ? 'bg-success-subtle text-success' : 'bg-destructive-subtle text-destructive'}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {svc.status === 'healthy' ? 'Healthy' : svc.status}
                </Badge>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                {loading ? 'Loading...' : 'No service data'}
              </p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Platform Metrics</h3>
          <div className="space-y-3">
            {([
              ['Active Connections',  health?.active_connections   ?? '—'],
              ['CPU Usage',           health ? `${health.cpu_usage_percent}%`    : '—'],
              ['Memory Usage',        health ? `${health.memory_usage_percent}%` : '—'],
              ['Disk Usage',          health ? `${health.disk_usage_percent}%`   : '—'],
              ['Error Rate',          health ? `${health.error_rate_percent}%`   : '—'],
              ['Uptime (hours)',       health?.uptime_hours ?? '—'],
            ] as [string, any][]).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium text-foreground">{label}</span>
                <Badge className="bg-muted text-foreground">{String(value)}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export System Health Report</DialogTitle>
            <DialogDescription>Download comprehensive system metrics</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-background-subtle border rounded-lg">
              <p className="text-sm text-foreground font-medium mb-2">Report includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>System uptime and latency metrics</li>
                <li>CPU, memory and disk usage</li>
                <li>Service health status</li>
                <li>Active connection counts</li>
                <li>Error rate analysis</li>
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
