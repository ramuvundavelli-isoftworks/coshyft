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
import { Activity, Server, Database, Zap, CheckCircle, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';

const uptimeData = [
  { time: '00:00', uptime: 100, response: 120 },
  { time: '04:00', uptime: 100, response: 115 },
  { time: '08:00', uptime: 99.9, response: 135 },
  { time: '12:00', uptime: 100, response: 142 },
  { time: '16:00', uptime: 100, response: 128 },
  { time: '20:00', uptime: 100, response: 118 },
];

const resourceData = [
  { time: '00:00', cpu: 45, memory: 62, storage: 78 },
  { time: '04:00', cpu: 38, memory: 58, storage: 78 },
  { time: '08:00', cpu: 72, memory: 71, storage: 79 },
  { time: '12:00', cpu: 85, memory: 78, storage: 79 },
  { time: '16:00', cpu: 68, memory: 72, storage: 80 },
  { time: '20:00', cpu: 52, memory: 65, storage: 80 },
];

export default function SystemHealth() {
  const [isRefreshDialogOpen, setIsRefreshDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleRefresh = () => {
    toast.success('System metrics refreshed');
    setIsRefreshDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting system health report...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">Real-time platform monitoring and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsRefreshDialogOpen(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
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
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <p className="text-lg font-bold text-green-600">Operational</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold text-gray-900">128ms</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Incidents</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
          </div>
        </Card>
      </div>

      {/* System Uptime & Response Time */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">System Uptime & Response Time (Last 24h)</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <Line
            data={{
              labels: uptimeData.map(d => d.time),
              datasets: [
                {
                  label: 'Uptime %',
                  data: uptimeData.map(d => d.uptime),
                  borderColor: colors.chart.green,
                  borderWidth: 2,
                  fill: false,
                  yAxisID: 'y',
                },
                {
                  label: 'Response (ms)',
                  data: uptimeData.map(d => d.response),
                  borderColor: colors.chart.blue,
                  borderWidth: 2,
                  fill: false,
                  yAxisID: 'y1',
                },
              ],
            }}
            options={{
              ...lineChartOptions,
              scales: {
                ...lineChartOptions.scales,
                y: {
                  ...lineChartOptions.scales?.y,
                  type: 'linear',
                  position: 'left',
                  min: 99,
                  max: 100,
                },
                y1: {
                  type: 'linear',
                  position: 'right',
                  grid: {
                    drawOnChartArea: false,
                  },
                  ticks: {
                    font: {
                      family: 'Inter',
                      size: 11,
                    },
                    color: colors.text.tertiary,
                  },
                },
              },
            }}
          />
        </div>
      </Card>

      {/* Resource Usage */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Resource Usage (Last 24h)</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <Line
            data={{
              labels: resourceData.map(d => d.time),
              datasets: [
                {
                  label: 'CPU %',
                  data: resourceData.map(d => d.cpu),
                  borderColor: colors.chart.blue,
                  borderWidth: 2,
                  fill: false,
                },
                {
                  label: 'Memory %',
                  data: resourceData.map(d => d.memory),
                  borderColor: colors.chart.green,
                  borderWidth: 2,
                  fill: false,
                },
                {
                  label: 'Storage %',
                  data: resourceData.map(d => d.storage),
                  borderColor: '#94a3b8',
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
            options={lineChartOptions}
          />
        </div>
      </Card>

      {/* Service Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Service Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">API Server</span>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Database</span>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Cache</span>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">Storage</span>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Healthy
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Events</h3>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex items-start gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">System Update Completed</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-start gap-2 mb-1">
                <Activity className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Backup Completed</p>
                  <p className="text-xs text-gray-600">5 hours ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="flex items-start gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Security Scan Passed</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Refresh Dialog */}
      <Dialog open={isRefreshDialogOpen} onOpenChange={setIsRefreshDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refresh System Metrics</DialogTitle>
            <DialogDescription>Update all system health data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This will refresh all system metrics and service statuses.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefreshDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export System Health Report</DialogTitle>
            <DialogDescription>Download comprehensive system metrics</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Report includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>System uptime metrics</li>
                <li>Response time analysis</li>
                <li>Resource usage data</li>
                <li>Service health status</li>
                <li>Recent events log</li>
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