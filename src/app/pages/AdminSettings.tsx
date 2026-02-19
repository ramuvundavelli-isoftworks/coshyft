import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
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
import { Settings, Save, Bell, Users, Database, Shield, RefreshCw, Download, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    autoApproveDrivers: false,
    requireBackgroundCheck: true,
    maxPassengersPerRide: 4,
    minDriverRating: 4.0,
    notifyNewRides: true,
    notifyLowParticipation: true,
    dataRetentionDays: 730,
    requireTripVerification: true,
  });

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setSettings({
      autoApproveDrivers: false,
      requireBackgroundCheck: true,
      maxPassengersPerRide: 4,
      minDriverRating: 4.0,
      notifyNewRides: true,
      notifyLowParticipation: true,
      dataRetentionDays: 730,
      requireTripVerification: true,
    });
    setIsResetDialogOpen(false);
    toast.success('Settings reset to defaults');
  };

  const handleExport = () => {
    toast.success(`Exporting settings as ${exportFormat.toUpperCase()}`);
    setIsExportDialogOpen(false);
  };

  const handleImport = () => {
    toast.success('Settings imported successfully');
    setIsImportDialogOpen(false);
  };

  const handleBackup = () => {
    toast.success('Database backup initiated');
    setIsBackupDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure platform settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Driver & Ride Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          Driver & Ride Management
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Auto-approve Driver Applications</p>
              <p className="text-sm text-gray-600">Automatically approve new driver registrations</p>
            </div>
            <Switch
              checked={settings.autoApproveDrivers}
              onCheckedChange={(checked) => setSettings({ ...settings, autoApproveDrivers: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Require Background Check</p>
              <p className="text-sm text-gray-600">Mandate background verification for all drivers</p>
            </div>
            <Switch
              checked={settings.requireBackgroundCheck}
              onCheckedChange={(checked) => setSettings({ ...settings, requireBackgroundCheck: checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="maxPassengers">Max Passengers Per Ride</Label>
              <Input
                id="maxPassengers"
                type="number"
                value={settings.maxPassengersPerRide}
                onChange={(e) => setSettings({ ...settings, maxPassengersPerRide: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minRating">Min Driver Rating (Required)</Label>
              <Input
                id="minRating"
                type="number"
                step="0.1"
                value={settings.minDriverRating}
                onChange={(e) => setSettings({ ...settings, minDriverRating: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-600" />
          Admin Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Notify on New Ride Postings</p>
              <p className="text-sm text-gray-600">Get alerts when drivers post new rides</p>
            </div>
            <Switch
              checked={settings.notifyNewRides}
              onCheckedChange={(checked) => setSettings({ ...settings, notifyNewRides: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Low Participation Alerts</p>
              <p className="text-sm text-gray-600">Alert when department participation drops below threshold</p>
            </div>
            <Switch
              checked={settings.notifyLowParticipation}
              onCheckedChange={(checked) => setSettings({ ...settings, notifyLowParticipation: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Data & Security */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Database className="h-5 w-5 text-green-600" />
          Data & Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Require Trip Verification</p>
              <p className="text-sm text-gray-600">Employees must verify commute data</p>
            </div>
            <Switch
              checked={settings.requireTripVerification}
              onCheckedChange={(checked) => setSettings({ ...settings, requireTripVerification: checked })}
            />
          </div>

          <div className="space-y-2 py-3">
            <Label htmlFor="retention">Data Retention Period (days)</Label>
            <Input
              id="retention"
              type="number"
              value={settings.dataRetentionDays}
              onChange={(e) => setSettings({ ...settings, dataRetentionDays: parseInt(e.target.value) })}
            />
            <p className="text-xs text-gray-500">How long to retain trip and user data</p>
          </div>

          <div className="pt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsBackupDialogOpen(true)}
            >
              <Database className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Settings
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700"
              onClick={() => setIsResetDialogOpen(true)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </div>
      </Card>

      {/* Reset Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Settings to Defaults</DialogTitle>
            <DialogDescription>
              This will restore all settings to their default values
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  All custom configuration will be lost. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Settings</DialogTitle>
            <DialogDescription>
              Download current configuration
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Settings</DialogTitle>
            <DialogDescription>
              Upload configuration file
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your settings file here
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Supported formats: JSON, YAML, XML
              </p>
              <Button variant="outline">Choose File</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Import Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Dialog */}
      <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Database Backup</DialogTitle>
            <DialogDescription>
              Create a backup of all system data
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                <strong>Backup includes:</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>All user accounts and profiles</li>
                <li>Trip history and commute data</li>
                <li>Policies and settings</li>
                <li>Emissions calculations</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              The backup will be encrypted and stored securely. You'll receive a download link via email.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBackup}>
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
