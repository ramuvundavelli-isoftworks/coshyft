import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Settings, Save, Shield, Database, Bell, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function SuperAdminSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    newTenantSignup: true,
    autoBackups: true,
    backupFrequency: 6,
    dataRetention: 2555,
    enableEmailNotifications: true,
    enableSMSAlerts: false,
    maxTenantsPerPlan: 1000,
  });

  const handleSave = () => {
    toast.success('Platform settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-1">
            Global platform configuration
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* System Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          System Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-600">Temporarily disable platform access for all tenants</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">New Tenant Signup</p>
              <p className="text-sm text-gray-600">Allow new organizations to sign up</p>
            </div>
            <Switch
              checked={settings.newTenantSignup}
              onCheckedChange={(checked) => setSettings({ ...settings, newTenantSignup: checked })}
            />
          </div>

          <div className="space-y-2 py-3">
            <Label htmlFor="maxTenants">Max Tenants Per Plan</Label>
            <Input
              id="maxTenants"
              type="number"
              value={settings.maxTenantsPerPlan}
              onChange={(e) => setSettings({ ...settings, maxTenantsPerPlan: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </Card>

      {/* Database & Backup */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Database className="h-5 w-5 text-green-600" />
          Database & Backup
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Automatic Backups</p>
              <p className="text-sm text-gray-600">Enable scheduled database backups</p>
            </div>
            <Switch
              checked={settings.autoBackups}
              onCheckedChange={(checked) => setSettings({ ...settings, autoBackups: checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 py-3">
            <div className="space-y-2">
              <Label htmlFor="backupFreq">Backup Frequency (hours)</Label>
              <Input
                id="backupFreq"
                type="number"
                value={settings.backupFrequency}
                onChange={(e) => setSettings({ ...settings, backupFrequency: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retention">Data Retention (days)</Label>
              <Input
                id="retention"
                type="number"
                value={settings.dataRetention}
                onChange={(e) => setSettings({ ...settings, dataRetention: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-600" />
          System Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">System alerts via email</p>
            </div>
            <Switch
              checked={settings.enableEmailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableEmailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">SMS Alerts</p>
              <p className="text-sm text-gray-600">Critical system alerts via SMS</p>
            </div>
            <Switch
              checked={settings.enableSMSAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, enableSMSAlerts: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Security Information
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• SSL/TLS encryption enabled for all connections</p>
          <p>• AES-256 encryption for data at rest</p>
          <p>• Automated security scanning enabled</p>
          <p>• SOC 2 Type II compliant infrastructure</p>
          <p>• ISO 27001 certified data centers</p>
          <p>• Regular penetration testing (quarterly)</p>
        </div>
      </Card>
    </div>
  );
}
