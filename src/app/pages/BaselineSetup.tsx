import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
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
import { Lock, Unlock, AlertTriangle, CheckCircle, History, Building2, Plus, Edit, Calculator, Archive } from 'lucide-react';
import { mockBaseline } from '../data/mockData';
import { toast } from 'sonner';

interface Baseline {
  year: number;
  totalEmissions: number;
  scope: string[];
  boundaries: string[];
  locked: boolean;
  approvedBy?: string;
  approvedDate?: string;
  methodology?: string;
}

export default function BaselineSetup() {
  const [baselines, setBaselines] = useState<Baseline[]>([mockBaseline]);
  const [currentBaseline, setCurrentBaseline] = useState(mockBaseline);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRecalculateDialogOpen, setIsRecalculateDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);
  const [selectedBaseline, setSelectedBaseline] = useState<Baseline | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    totalEmissions: '',
    methodology: '',
    scope1: true,
    scope2: true,
    scope3: true,
    hq: true,
    offices: true,
    remote: true,
  });
  const [recalculateReason, setRecalculateReason] = useState('');

  const handleCreateBaseline = () => {
    const scope = [];
    if (formData.scope1) scope.push('Scope 1');
    if (formData.scope2) scope.push('Scope 2');
    if (formData.scope3) scope.push('Scope 3');

    const boundaries = [];
    if (formData.hq) boundaries.push('HQ');
    if (formData.offices) boundaries.push('Regional Offices');
    if (formData.remote) boundaries.push('Remote Workers');

    const newBaseline: Baseline = {
      year: parseInt(formData.year),
      totalEmissions: parseFloat(formData.totalEmissions),
      scope,
      boundaries,
      locked: false,
      methodology: formData.methodology,
    };

    setBaselines([...baselines, newBaseline]);
    setCurrentBaseline(newBaseline);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Baseline created successfully');
  };

  const handleEditBaseline = () => {
    if (selectedBaseline && !selectedBaseline.locked) {
      const updated = baselines.map(b =>
        b.year === selectedBaseline.year
          ? {
              ...b,
              totalEmissions: parseFloat(formData.totalEmissions),
              methodology: formData.methodology,
            }
          : b
      );
      setBaselines(updated);
      if (currentBaseline.year === selectedBaseline.year) {
        setCurrentBaseline({ ...currentBaseline, totalEmissions: parseFloat(formData.totalEmissions) });
      }
      setIsEditDialogOpen(false);
      toast.success('Baseline updated successfully');
    }
  };

  const handleRecalculate = () => {
    if (selectedBaseline) {
      // Simulate recalculation
      const newEmissions = parseFloat(formData.totalEmissions);
      const updated = baselines.map(b =>
        b.year === selectedBaseline.year
          ? { ...b, totalEmissions: newEmissions }
          : b
      );
      setBaselines(updated);
      if (currentBaseline.year === selectedBaseline.year) {
        setCurrentBaseline({ ...currentBaseline, totalEmissions: newEmissions });
      }
      setIsRecalculateDialogOpen(false);
      setRecalculateReason('');
      toast.success('Baseline recalculated successfully');
    }
  };

  const handleArchiveBaseline = () => {
    if (selectedBaseline) {
      const updated = baselines.filter(b => b.year !== selectedBaseline.year);
      setBaselines(updated);
      setIsArchiveDialogOpen(false);
      toast.success('Baseline archived successfully');
    }
  };

  const handleLockBaseline = () => {
    const updated = {
      ...currentBaseline,
      locked: true,
      approvedBy: 'John Doe',
      approvedDate: new Date().toISOString(),
    };
    setCurrentBaseline(updated);
    setBaselines(baselines.map(b => b.year === currentBaseline.year ? updated : b));
    setIsLockDialogOpen(false);
    toast.success('Baseline locked successfully');
  };

  const handleUnlockBaseline = () => {
    const updated = {
      ...currentBaseline,
      locked: false,
      approvedBy: undefined,
      approvedDate: undefined,
    };
    setCurrentBaseline(updated);
    setBaselines(baselines.map(b => b.year === currentBaseline.year ? updated : b));
    toast.success('Baseline unlocked');
  };

  const selectBaseline = (baseline: Baseline) => {
    setSelectedBaseline(baseline);
    setFormData({
      ...formData,
      year: baseline.year.toString(),
      totalEmissions: baseline.totalEmissions.toString(),
      methodology: baseline.methodology || '',
      scope1: baseline.scope.includes('Scope 1'),
      scope2: baseline.scope.includes('Scope 2'),
      scope3: baseline.scope.includes('Scope 3'),
      hq: baseline.boundaries.includes('HQ'),
      offices: baseline.boundaries.includes('Regional Offices'),
      remote: baseline.boundaries.includes('Remote Workers'),
    });
  };

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear().toString(),
      totalEmissions: '',
      methodology: '',
      scope1: true,
      scope2: true,
      scope3: true,
      hq: true,
      offices: true,
      remote: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Baseline Setup</h1>
          <p className="text-gray-600 mt-1">
            Define and lock organizational baseline for compliance reporting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsCompareDialogOpen(true)}>
            <History className="h-4 w-4 mr-2" />
            Compare Versions
          </Button>
          {!currentBaseline.locked ? (
            <Button onClick={() => setIsLockDialogOpen(true)}>
              <Lock className="h-4 w-4 mr-2" />
              Lock Baseline
            </Button>
          ) : (
            <Button variant="outline" onClick={handleUnlockBaseline}>
              <Unlock className="h-4 w-4 mr-2" />
              Unlock Baseline
            </Button>
          )}
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Baseline
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card className={`p-6 ${currentBaseline.locked ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-start gap-3">
          {currentBaseline.locked ? (
            <Lock className="h-5 w-5 text-green-600 mt-0.5" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className={`font-semibold mb-1 ${currentBaseline.locked ? 'text-green-900' : 'text-yellow-900'}`}>
              {currentBaseline.locked ? 'Baseline is Locked' : 'Baseline is Unlocked'}
            </h3>
            <p className={`text-sm ${currentBaseline.locked ? 'text-green-700' : 'text-yellow-700'}`}>
              {currentBaseline.locked
                ? `This baseline was approved and locked on ${new Date(currentBaseline.approvedDate!).toLocaleDateString()} by ${currentBaseline.approvedBy}. Changes require unlocking first.`
                : 'This baseline is still being edited and has not been locked for reporting yet.'}
            </p>
          </div>
        </div>
      </Card>

      {/* Baseline Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">Baseline Year</Label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-gray-900">{currentBaseline.year}</p>
                {!currentBaseline.locked && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      selectBaseline(currentBaseline);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Total Emissions</Label>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-gray-900">
                  {currentBaseline.totalEmissions.toLocaleString()} <span className="text-base font-normal text-gray-600">tCO₂e</span>
                </p>
                {!currentBaseline.locked && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      selectBaseline(currentBaseline);
                      setIsRecalculateDialogOpen(true);
                    }}
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Status</Label>
              <Badge
                variant="outline"
                className={currentBaseline.locked ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
              >
                {currentBaseline.locked ? 'Locked' : 'Unlocked'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Scope Coverage */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Scope Coverage</h3>
          <div className="space-y-3">
            {currentBaseline.scope.map((scope, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-900">{scope}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Coverage: <span className="font-medium text-gray-900">{currentBaseline.scope.length}/3 Scopes</span>
            </p>
          </div>
        </Card>

        {/* Organizational Boundaries */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Organizational Boundaries</h3>
          <div className="space-y-3">
            {currentBaseline.boundaries.map((boundary, index) => (
              <div key={index} className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <span className="text-gray-900">{boundary}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Total: <span className="font-medium text-gray-900">{currentBaseline.boundaries.length} Boundaries</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Calculation Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Calculation Methodology</h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            {currentBaseline.methodology || 'No methodology documented yet. Click Edit to add details about how this baseline was calculated.'}
          </p>
        </div>
      </Card>

      {/* All Baselines History */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Baseline History</h3>
        <div className="space-y-3">
          {baselines.map((baseline) => (
            <div key={baseline.year} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium text-gray-900">Baseline Year {baseline.year}</p>
                  <p className="text-sm text-gray-600">
                    {baseline.totalEmissions.toLocaleString()} tCO₂e • {baseline.scope.length} scopes • {baseline.boundaries.length} boundaries
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={baseline.locked ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                >
                  {baseline.locked ? 'Locked' : 'Unlocked'}
                </Badge>
                {baseline.year === currentBaseline.year && (
                  <Badge variant="default">Current</Badge>
                )}
                {!baseline.locked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedBaseline(baseline);
                      setIsArchiveDialogOpen(true);
                    }}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Baseline Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Baseline</DialogTitle>
            <DialogDescription>
              Define a new baseline year with scope and boundaries
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Baseline Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2023"
                />
              </div>
              <div>
                <Label htmlFor="emissions">Total Emissions (tCO₂e) *</Label>
                <Input
                  id="emissions"
                  type="number"
                  step="0.01"
                  value={formData.totalEmissions}
                  onChange={(e) => setFormData({ ...formData, totalEmissions: e.target.value })}
                  placeholder="2847.5"
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Scope Coverage *</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="scope1"
                    checked={formData.scope1}
                    onCheckedChange={(checked) => setFormData({ ...formData, scope1: checked as boolean })}
                  />
                  <Label htmlFor="scope1" className="cursor-pointer">Scope 1 - Direct emissions</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="scope2"
                    checked={formData.scope2}
                    onCheckedChange={(checked) => setFormData({ ...formData, scope2: checked as boolean })}
                  />
                  <Label htmlFor="scope2" className="cursor-pointer">Scope 2 - Indirect emissions (electricity)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="scope3"
                    checked={formData.scope3}
                    onCheckedChange={(checked) => setFormData({ ...formData, scope3: checked as boolean })}
                  />
                  <Label htmlFor="scope3" className="cursor-pointer">Scope 3 - Employee commuting</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Organizational Boundaries *</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="hq"
                    checked={formData.hq}
                    onCheckedChange={(checked) => setFormData({ ...formData, hq: checked as boolean })}
                  />
                  <Label htmlFor="hq" className="cursor-pointer">Headquarters</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="offices"
                    checked={formData.offices}
                    onCheckedChange={(checked) => setFormData({ ...formData, offices: checked as boolean })}
                  />
                  <Label htmlFor="offices" className="cursor-pointer">Regional Offices</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remote"
                    checked={formData.remote}
                    onCheckedChange={(checked) => setFormData({ ...formData, remote: checked as boolean })}
                  />
                  <Label htmlFor="remote" className="cursor-pointer">Remote Workers</Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="methodology">Calculation Methodology</Label>
              <Textarea
                id="methodology"
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                placeholder="Describe the calculation approach, data sources, and assumptions..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBaseline}
              disabled={!formData.year || !formData.totalEmissions}
            >
              Create Baseline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Baseline Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Baseline {selectedBaseline?.year}</DialogTitle>
            <DialogDescription>
              Update baseline emissions and methodology
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-emissions">Total Emissions (tCO₂e) *</Label>
              <Input
                id="edit-emissions"
                type="number"
                step="0.01"
                value={formData.totalEmissions}
                onChange={(e) => setFormData({ ...formData, totalEmissions: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-methodology">Calculation Methodology</Label>
              <Textarea
                id="edit-methodology"
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditBaseline}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recalculate Dialog */}
      <Dialog open={isRecalculateDialogOpen} onOpenChange={setIsRecalculateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recalculate Baseline</DialogTitle>
            <DialogDescription>
              Update baseline emissions with new calculation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Current:</strong> {selectedBaseline?.totalEmissions.toLocaleString()} tCO₂e
              </p>
            </div>
            <div>
              <Label htmlFor="recalc-emissions">New Total Emissions (tCO₂e) *</Label>
              <Input
                id="recalc-emissions"
                type="number"
                step="0.01"
                value={formData.totalEmissions}
                onChange={(e) => setFormData({ ...formData, totalEmissions: e.target.value })}
                placeholder="2847.5"
              />
            </div>
            <div>
              <Label htmlFor="recalc-reason">Reason for Recalculation *</Label>
              <Textarea
                id="recalc-reason"
                value={recalculateReason}
                onChange={(e) => setRecalculateReason(e.target.value)}
                placeholder="Explain why the baseline is being recalculated..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecalculateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRecalculate}
              disabled={!formData.totalEmissions || !recalculateReason.trim()}
            >
              Recalculate Baseline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Baseline</DialogTitle>
            <DialogDescription>
              Remove baseline year {selectedBaseline?.year} from active baselines
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This baseline will be archived and removed from active reporting. This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchiveBaseline}>
              Archive Baseline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare Dialog */}
      <Dialog open={isCompareDialogOpen} onOpenChange={setIsCompareDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Baseline Version Comparison</DialogTitle>
            <DialogDescription>
              Compare current baseline with previous versions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {baselines.map((baseline, index) => (
              <div key={baseline.year} className="grid grid-cols-4 gap-4">
                <div className={`p-4 border rounded-lg ${index === 0 ? '' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">Year</p>
                  <p className="font-bold">{baseline.year}</p>
                  {index === 0 && <Badge className="mt-2" variant="default">Current</Badge>}
                </div>
                <div className={`p-4 border rounded-lg ${index === 0 ? '' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">Emissions</p>
                  <p className="font-bold">{baseline.totalEmissions.toLocaleString()} tCO₂e</p>
                </div>
                <div className={`p-4 border rounded-lg ${index === 0 ? '' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge
                    variant="outline"
                    className={baseline.locked ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                  >
                    {baseline.locked ? 'Locked' : 'Unlocked'}
                  </Badge>
                </div>
                {index > 0 && (
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600 mb-1">vs Previous</p>
                    <p className={`font-bold ${baseline.totalEmissions < baselines[index - 1].totalEmissions ? 'text-green-600' : 'text-red-600'}`}>
                      {((baseline.totalEmissions - baselines[index - 1].totalEmissions) / baselines[index - 1].totalEmissions * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lock Baseline Dialog */}
      <Dialog open={isLockDialogOpen} onOpenChange={setIsLockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lock Baseline Year {currentBaseline.year}</DialogTitle>
            <DialogDescription>
              Locking the baseline prevents further changes and makes it official for reporting
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">Important</p>
                  <p className="text-sm text-yellow-700">
                    Once locked, this baseline will be used for all compliance calculations and reports. 
                    You'll need to unlock it first to make any changes.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Year:</span>
                <span className="font-medium">{currentBaseline.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Emissions:</span>
                <span className="font-medium">{currentBaseline.totalEmissions.toLocaleString()} tCO₂e</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Scopes:</span>
                <span className="font-medium">{currentBaseline.scope.join(', ')}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLockDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLockBaseline}>
              Lock Baseline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
