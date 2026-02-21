import React, { useState } from 'react';
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
import { mockAlerts } from '../data/mockData';
import { Alert } from '../types';
import { toast } from 'sonner';

export default function AlertCenter() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolution, setResolution] = useState('');

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolved);
  const warningAlerts = alerts.filter(a => a.severity === 'warning' && !a.resolved);
  const infoAlerts = alerts.filter(a => a.severity === 'info' && !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const markResolved = () => {
    if (selectedAlert) {
      setAlerts(alerts.map(a => a.id === selectedAlert.id ? { ...a, resolved: true } : a));
      setIsResolveDialogOpen(false);
      setResolution('');
      toast.success('Alert marked as resolved');
    }
  };

  const handleExport = () => {
    toast.success('Exporting alerts...');
    setIsExportDialogOpen(false);
  };

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const icons = {
      critical: <AlertTriangle className="h-5 w-5 text-red-600" />,
      warning: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      info: <Info className="h-5 w-5 text-blue-600" />,
    };

    const bgColors = {
      critical: 'bg-red-50 border-red-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200',
    };

    return (
      <Card className={`p-6 ${bgColors[alert.severity]}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            alert.severity === 'critical' ? 'bg-red-100' :
            alert.severity === 'warning' ? 'bg-yellow-100' :
            'bg-blue-100'
          }`}>
            {icons[alert.severity]}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <Badge className={
                    alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{alert.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-xs text-gray-500">
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
              <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
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
          <h1 className="text-3xl font-bold text-gray-900">Alert Center</h1>
          <p className="text-gray-600 mt-1">Centralized system alerts and notifications</p>
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
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">{criticalAlerts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Warning</p>
              <p className="text-2xl font-bold text-yellow-600">{warningAlerts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Info className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Info</p>
              <p className="text-2xl font-bold text-blue-600">{infoAlerts.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</p>
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
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No critical alerts</p>
            </Card>
          ) : (
            criticalAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
          )}
        </TabsContent>

        <TabsContent value="warning" className="space-y-3 mt-4">
          {warningAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No warning alerts</p>
            </Card>
          ) : (
            warningAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
          )}
        </TabsContent>

        <TabsContent value="info" className="space-y-3 mt-4">
          {infoAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No info alerts</p>
            </Card>
          ) : (
            infoAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-3 mt-4">
          {resolvedAlerts.length === 0 ? (
            <Card className="p-8 text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No resolved alerts</p>
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
                <Label className="text-sm text-gray-600">Severity</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedAlert.severity}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Description</Label>
                <p className="text-gray-900 mt-1">{selectedAlert.description}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Category</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedAlert.category}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Source</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedAlert.source}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Timestamp</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedAlert.timestamp.toLocaleString()}</p>
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
            <Button onClick={markResolved}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark Resolved
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