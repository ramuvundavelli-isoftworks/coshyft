import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Settings, Save, Shield, Bell, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { superadminApi } from '../api';

const DEFAULT_SETTINGS = {
  maintenance_mode: false,
  registration_enabled: true,
  default_plan: 'starter',
  max_trial_days: 30,
  global_rate_limit: 60,
  feature_flags: {} as Record<string, any>,
};

export default function SuperAdminSettings() {
  const { data: remoteSettings, loading } = useApi(() => superadminApi.getSettings());
  const updateMutation = useApiMutation((data: any) => superadminApi.updateSettings(data));

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    if (remoteSettings) {
      setSettings({
        maintenance_mode:    remoteSettings.maintenance_mode    ?? false,
        registration_enabled:remoteSettings.registration_enabled?? true,
        default_plan:        remoteSettings.default_plan        ?? 'starter',
        max_trial_days:      remoteSettings.max_trial_days      ?? 30,
        global_rate_limit:   remoteSettings.global_rate_limit   ?? 60,
        feature_flags:       remoteSettings.feature_flags       ?? {},
      });
    }
  }, [remoteSettings]);

  const handleSave = async () => {
    const result = await updateMutation.execute(settings);
    if (result.success) {
      toast.success('Platform settings saved successfully');
    } else {
      toast.error(result.error?.message || 'Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Global platform configuration</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.loading}>
          <Save className="h-4 w-4 mr-2" />
          {updateMutation.loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* System Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Activity className="h-5 w-5 text-info" />
          System Settings
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-foreground">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Temporarily disable platform access for all tenants</p>
            </div>
            <Switch
              checked={settings.maintenance_mode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenance_mode: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-foreground">New Tenant Registration</p>
              <p className="text-sm text-muted-foreground">Allow new organisations to sign up</p>
            </div>
            <Switch
              checked={settings.registration_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, registration_enabled: checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Label htmlFor="default-plan">Default Plan for New Tenants</Label>
              <Input
                id="default-plan"
                value={settings.default_plan}
                onChange={(e) => setSettings({ ...settings, default_plan: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trial-days">Max Trial Duration (days)</Label>
              <Input
                id="trial-days"
                type="number"
                value={settings.max_trial_days}
                onChange={(e) => setSettings({ ...settings, max_trial_days: parseInt(e.target.value) || 30 })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* API & Rate Limits */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Settings className="h-5 w-5 text-success" />
          API & Rate Limits
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rate-limit">Global Rate Limit (requests/minute per user)</Label>
            <Input
              id="rate-limit"
              type="number"
              value={settings.global_rate_limit}
              onChange={(e) => setSettings({ ...settings, global_rate_limit: parseInt(e.target.value) || 60 })}
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">Applied to all API endpoints across all tenants</p>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 text-info" />
          System Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-foreground">Email Alerts for Critical Events</p>
              <p className="text-sm text-muted-foreground">Notify platform admins on errors and threshold breaches</p>
            </div>
            <Switch
              checked={settings.feature_flags?.email_alerts ?? true}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, feature_flags: { ...settings.feature_flags, email_alerts: checked } })
              }
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">New Tenant Onboarding Notifications</p>
              <p className="text-sm text-muted-foreground">Alert superadmins when a new tenant signs up</p>
            </div>
            <Switch
              checked={settings.feature_flags?.tenant_signup_alerts ?? true}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, feature_flags: { ...settings.feature_flags, tenant_signup_alerts: checked } })
              }
            />
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 bg-background-subtle">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-info" />
          Security Information
        </h3>
        <div className="space-y-2 text-sm text-foreground">
          <p>• SSL/TLS encryption enabled for all connections</p>
          <p>• AES-256 encryption for data at rest</p>
          <p>• Automated security scanning enabled</p>
          <p>• GDPR compliant data handling enforced per tenant</p>
          <p>• JWT access tokens expire every 15 minutes</p>
          <p>• Refresh tokens expire after 7 days</p>
        </div>
      </Card>
    </div>
  );
}
