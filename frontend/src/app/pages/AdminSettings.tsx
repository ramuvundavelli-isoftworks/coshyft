import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Save, Database, RefreshCw, Download, AlertTriangle, Zap, Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation, adminApi } from '../api';

interface AdminSettingsForm {
  company_name: string;
  default_region: string;
  emission_factor_source: string;
  data_retention_days: number;
  enable_carpooling: boolean;
  enable_gamification: boolean;
  oxypoints_multiplier: number;
}

const DEFAULTS: AdminSettingsForm = {
  company_name: '',
  default_region: 'IE',
  emission_factor_source: 'SEAI 2024',
  data_retention_days: 365,
  enable_carpooling: true,
  enable_gamification: true,
  oxypoints_multiplier: 1.0,
};

export default function AdminSettings() {
  const [form, setForm]           = useState<AdminSettingsForm>(DEFAULTS);
  const [isDirty, setIsDirty]     = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const { data: serverSettings, loading } = useApi(
    () => adminApi.getSettings(),
    { deps: [] },
  );

  // Populate form once backend data loads
  useEffect(() => {
    if (serverSettings) {
      setForm({
        company_name:          serverSettings.company_name          ?? DEFAULTS.company_name,
        default_region:        serverSettings.default_region        ?? DEFAULTS.default_region,
        emission_factor_source: serverSettings.emission_factor_source ?? DEFAULTS.emission_factor_source,
        data_retention_days:   serverSettings.data_retention_days   ?? DEFAULTS.data_retention_days,
        enable_carpooling:     serverSettings.enable_carpooling     ?? DEFAULTS.enable_carpooling,
        enable_gamification:   serverSettings.enable_gamification   ?? DEFAULTS.enable_gamification,
        oxypoints_multiplier:  serverSettings.oxypoints_multiplier  ?? DEFAULTS.oxypoints_multiplier,
      });
      setIsDirty(false);
    }
  }, [serverSettings]);

  const set = (key: keyof AdminSettingsForm, val: any) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setIsDirty(true);
  };

  const saveMutation = useApiMutation((data: any) => adminApi.updateSettings(data));

  const handleSave = async () => {
    const result = await saveMutation.execute(form);
    if (result.success) {
      toast.success('Settings saved successfully');
      setIsDirty(false);
    } else {
      toast.error(result.error?.message ?? 'Failed to save settings');
    }
  };

  const handleReset = () => {
    setForm(DEFAULTS);
    setIsDirty(true);
    setIsResetOpen(false);
    toast.success('Settings reset to defaults — click Save to apply');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground mt-1">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => toast.info('Export not yet implemented')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveMutation.loading || !isDirty || loading}
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">Loading settings...</Card>
      ) : (
        <>
          {/* General */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-info" />
              General
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={form.company_name}
                  onChange={e => set('company_name', e.target.value)}
                  placeholder="e.g. CoShift Ireland"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default_region">Default Region</Label>
                <Select value={form.default_region} onValueChange={v => set('default_region', v)}>
                  <SelectTrigger id="default_region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IE">Ireland (IE)</SelectItem>
                    <SelectItem value="GB">United Kingdom (GB)</SelectItem>
                    <SelectItem value="EU">European Union (EU)</SelectItem>
                    <SelectItem value="US">United States (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="emission_factor_source">Emission Factor Source</Label>
                <Select value={form.emission_factor_source} onValueChange={v => set('emission_factor_source', v)}>
                  <SelectTrigger id="emission_factor_source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEAI 2024">SEAI 2024</SelectItem>
                    <SelectItem value="SEAI 2023">SEAI 2023</SelectItem>
                    <SelectItem value="DEFRA 2024">DEFRA 2024</SelectItem>
                    <SelectItem value="EPA 2024">EPA 2024</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Used for all commute CO₂ calculations</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_retention_days">Data Retention (days)</Label>
                <Input
                  id="data_retention_days"
                  type="number"
                  min={30}
                  max={3650}
                  value={form.data_retention_days}
                  onChange={e => set('data_retention_days', parseInt(e.target.value) || 365)}
                />
                <p className="text-xs text-muted-foreground">How long trip and commute records are kept</p>
              </div>
            </div>
          </Card>

          {/* Platform Features */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-info" />
              Platform Features
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-foreground">Enable Carpooling</p>
                  <p className="text-sm text-muted-foreground">Allow employees to offer and request rides</p>
                </div>
                <Switch
                  checked={form.enable_carpooling}
                  onCheckedChange={v => set('enable_carpooling', v)}
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="font-medium text-foreground">Enable Gamification</p>
                  <p className="text-sm text-muted-foreground">Award OxyPoints for green commutes</p>
                </div>
                <Switch
                  checked={form.enable_gamification}
                  onCheckedChange={v => set('enable_gamification', v)}
                />
              </div>
              {form.enable_gamification && (
                <div className="py-3 space-y-2">
                  <Label htmlFor="oxypoints_multiplier">OxyPoints Multiplier</Label>
                  <Input
                    id="oxypoints_multiplier"
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={10}
                    value={form.oxypoints_multiplier}
                    onChange={e => set('oxypoints_multiplier', parseFloat(e.target.value) || 1)}
                    className="w-40"
                  />
                  <p className="text-xs text-muted-foreground">
                    Multiplies all OxyPoints earned (1.0 = normal, 2.0 = double points)
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Danger zone */}
          <Card className="p-6 border-destructive/15">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              System
            </h2>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive hover:border-destructive/40"
                onClick={() => setIsResetOpen(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* Reset Dialog */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset to Defaults</DialogTitle>
            <DialogDescription>Restore all settings to their default values</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-warning-subtle border border-warning/25 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 shrink-0" />
              <p className="text-sm text-warning">
                This resets the form to defaults. You still need to click <strong>Save Changes</strong> to apply them.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReset}>Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
