import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Eye, Download } from 'lucide-react';
import { Alert } from '../types';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { alertsApi } from '../api';

export default function AlertCenter() {
  const { data: apiAlerts } = useApi(() => alertsApi.getAlerts({ resolved: undefined }));
  const loadedAlerts = (apiAlerts as any)?.items ?? [];
  const [alerts, setAlerts] = useState(loadedAlerts);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolution, setResolution] = useState('');

  // API mutations
  const resolveAlertMutation = useApiMutation((data: { alertId: string; notes?: string }) =>
    alertsApi.resolveAlert(data.alertId, data.notes)
  );

  // Sync when API data arrives
  useEffect(() => {
    if ((apiAlerts as any)?.items) {
      setAlerts((apiAlerts as any).items);
    }
  }, [apiAlerts]);

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
  const warningAlerts = alerts.filter(a => a.severity === 'warning' && !a.resolved);
  const infoAlerts = alerts.filter(a => a.severity === 'info' && !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const markResolved = async () => {
    if (selectedAlert) {
      // Optimistic update
      setAlerts(alerts.map(a => a.id === selectedAlert.id ? { ...a, resolved: true } : a));
      setIsResolveDialogOpen(false);
      const resolutionNotes = resolution;
      setResolution('');

      const result = await resolveAlertMutation.execute({
        alertId: selectedAlert.id,
        notes: resolutionNotes || undefined,
      });

      if (result.success) {
        toast.success('Alert marked as resolved');
      } else {
        toast.error(result.error?.message || 'Failed to resolve alert');
      }
    }
  };

  const handleExport = () => {
    toast.success('Exporting alerts...');
    setIsExportDialogOpen(false);
  };

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const icons = {
      critical: <AlertTriangle className="h-5 w-5 text-destructive" />,
      warning: <AlertCircle className="h-5 w-5 text-warning" />,
      info: <Info className="h-5 w-5 text-info" />,
    };

    const bgColors = {
      critical: 'bg-destructive-subtle border-destructive/25',
      warning: 'bg-warning-subtle border-warning/25',
      info: 'bg-info-subtle border-info/25',
    };

    return (
      <Card className={`p-6 ${bgColors[alert.severity]}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            alert.severity === 'critical' ? 'bg-destructive-subtle' :
            alert.severity === 'warning' ? 'bg-warning-subtle' :
            'bg-info-subtle'
          }`}>
            {icons[alert.severity]}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{alert.title}</h3>
                  <Badge className={
                    alert.severity === 'critical' ? 'bg-destructive-subtle text-destructive' :
                    alert.severity === 'warning' ? 'bg-warning-subtle text-warning' :
                    'bg-info-subtle text-info'
                  }>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{alert.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-xs text-muted-foreground">
                {alert.timestamp.toLocaleString()}
              </span>
              {alert.linkedEntity && (
                <Badge variant="outline" className="text-xs">
                  {alert.linkedEntity}
                </Badge>
              )}
            </div>
            {!alert.resolved && (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedAlert(alert);
                    setIsResolveDialogOpen(true);
                  }}
                >
                  Mark Resolved
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedAlert(alert);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            )}
            {alert.resolved && (
              <div className="flex items-center gap-2 mt-4 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                <span>Resolved</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alert Center</h1>
          <p className="text-muted-foreground mt-1">Centralized system alerts and notifications</p>
        </div>
        <Button onClick={() => setIsExportDialogOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export Alerts
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive-subtle rounded-lg">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-destructive">{criticalAlerts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Warning</p>
              <p className="text-2xl font-bold text-warning">{warningAlerts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Info className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Info</p>
              <p className="text-2xl font-bold text-info">{infoAlerts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold text-success">{resolvedAlerts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Tabs defaultValue="critical" className="w-full">
        <TabsList>
          <TabsTrigger value="critical">
            Critical ({criticalAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="warning">
            Warning ({warningAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="info">
            Info ({infoAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({resolvedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="critical" className="space-y-3 mt-4">
          {criticalAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-muted-foreground">No critical alerts</p>
            </Card>
          ) : (
            criticalAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
          )}
        </TabsContent>

        <TabsContent value="warning" className="space-y-3 mt-4">
          {warningAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-muted-foreground">No warning alerts</p>
            </Card>
          ) : (
            warningAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-3 mt-4">
          {infoAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
              <p className="text-muted-foreground">No info alerts</p>
            </Card>
          ) : (
            infoAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-3 mt-4">
          {resolvedAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No resolved alerts</p>
            </Card>
          ) : (
            resolvedAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
          )}
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>{selectedAlert?.title}</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4 space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Severity</Label>
                <p className="font-medium text-foreground mt-1">{selectedAlert.severity}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <p className="text-foreground mt-1">{selectedAlert.description}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Category</Label>
                <p className="font-medium text-foreground mt-1">{selectedAlert.category}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Source</Label>
                <p className="font-medium text-foreground mt-1">{selectedAlert.source}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Timestamp</Label>
                <p className="font-medium text-foreground mt-1">{selectedAlert.timestamp.toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Alert</DialogTitle>
            <DialogDescription>Mark {selectedAlert?.title} as resolved</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="resolution">Resolution Notes (optional)</Label>
            <Textarea
              id="resolution"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Enter resolution details..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>Cancel</Button>
            <Button onClick={markResolved} disabled={resolveAlertMutation.loading}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {resolveAlertMutation.loading ? 'Resolving...' : 'Mark Resolved'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Alerts</DialogTitle>
            <DialogDescription>Download alert data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-filter">Filter *</Label>
            <Select defaultValue="all">
              <SelectTrigger id="export-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="unresolved">Unresolved Only</SelectItem>
                <SelectItem value="resolved">Resolved Only</SelectItem>
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