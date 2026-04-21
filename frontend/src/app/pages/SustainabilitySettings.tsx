import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Settings, Save, Building2, Calendar, Database, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export default function SustainabilitySettings() {
  const [settings, setSettings] = useState({
    companyName: 'TechCorp Inc.',
    reportingYear: '2026',
    baselineYear: '2026',
    targetYear: '2030',
    emissionFactorSet: 'DEFRA 2026',
    consolidationApproach: 'Operational Control',
    autoCalculation: true,
    notifyDataQuality: true,
    notifyTargetProgress: true,
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure platform settings and preferences
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Organization Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-info" />
          Organization Settings
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consolidation">Consolidation Approach</Label>
              <Input
                id="consolidation"
                value={settings.consolidationApproach}
                onChange={(e) => setSettings({ ...settings, consolidationApproach: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Reporting Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-info" />
          Reporting Periods
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportingYear">Reporting Year</Label>
            <Input
              id="reportingYear"
              value={settings.reportingYear}
              onChange={(e) => setSettings({ ...settings, reportingYear: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baselineYear">Baseline Year</Label>
            <Input
              id="baselineYear"
              value={settings.baselineYear}
              onChange={(e) => setSettings({ ...settings, baselineYear: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetYear">Target Year</Label>
            <Input
              id="targetYear"
              value={settings.targetYear}
              onChange={(e) => setSettings({ ...settings, targetYear: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Data Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Database className="h-5 w-5 text-success" />
          Data & Calculations
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emissionFactor">Emission Factor Set</Label>
            <Input
              id="emissionFactor"
              value={settings.emissionFactorSet}
              onChange={(e) => setSettings({ ...settings, emissionFactorSet: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <p className="font-medium text-foreground">Automatic Calculation</p>
              <p className="text-sm text-muted-foreground">Recalculate emissions daily</p>
            </div>
            <Switch
              checked={settings.autoCalculation}
              onCheckedChange={(checked) => setSettings({ ...settings, autoCalculation: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 text-warning" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">Data Quality Alerts</p>
              <p className="text-sm text-muted-foreground">Notify when data quality falls below threshold</p>
            </div>
            <Switch
              checked={settings.notifyDataQuality}
              onCheckedChange={(checked) => setSettings({ ...settings, notifyDataQuality: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-t">
            <div>
              <p className="font-medium text-foreground">Target Progress Updates</p>
              <p className="text-sm text-muted-foreground">Monthly updates on target achievement</p>
            </div>
            <Switch
              checked={settings.notifyTargetProgress}
              onCheckedChange={(checked) => setSettings({ ...settings, notifyTargetProgress: checked })}
            />
          </div>
        </div>
      </Card>

      {/* Language Settings */}
      <LanguageSwitcher />
    </div>
  );
}