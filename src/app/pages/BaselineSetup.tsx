import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
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
import { Lock, Unlock, AlertTriangle, CheckCircle, History, Building2, Plus, Edit, Calculator } from 'lucide-react';
import { mockBaseline } from '../data/mockData';
import { Baseline } from '../types';
import { toast } from 'sonner';

export default function BaselineSetup() {
  const [baselines, setBaselines] = useState<Baseline[]>([mockBaseline]);
  const [currentBaseline, setCurrentBaseline] = useState(mockBaseline);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRecalculateDialogOpen, setIsRecalculateDialogOpen] = useState(false);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [isLockDialogOpen, setIsLockDialogOpen] = useState(false);
  const [selectedBaseline, setSelectedBaseline] = useState<Baseline | null>(null);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    emissions: '',
    dataSource: '',
    emissionFactorVersion: '',
  });
  const [recalculateReason, setRecalculateReason] = useState('');

  const handleCreateBaseline = () => {
    const newBaseline: Baseline = {
      year: parseInt(formData.year),
      emissions: parseFloat(formData.emissions),
      offices: [],
      legalEntities: [],
      dataSource: formData.dataSource,
      emissionFactorVersion: formData.emissionFactorVersion,
      locked: false,
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
              emissions: parseFloat(formData.emissions),
              dataSource: formData.dataSource,
              emissionFactorVersion: formData.emissionFactorVersion,
            }
          : b
      );
      setBaselines(updated);
      if (currentBaseline.year === selectedBaseline.year) {
        setCurrentBaseline({ 
          ...currentBaseline, 
          emissions: parseFloat(formData.emissions),
          dataSource: formData.dataSource,
          emissionFactorVersion: formData.emissionFactorVersion,
        });
      }
      setIsEditDialogOpen(false);
      toast.success('Baseline updated successfully');
    }
  };

  const handleRecalculate = () => {
    if (selectedBaseline) {
      const newEmissions = parseFloat(formData.emissions);
      const updated = baselines.map(b =>
        b.year === selectedBaseline.year
          ? { ...b, emissions: newEmissions }
          : b
      );
      setBaselines(updated);
      if (currentBaseline.year === selectedBaseline.year) {
        setCurrentBaseline({ ...currentBaseline, emissions: newEmissions });
      }
      setIsRecalculateDialogOpen(false);
      setRecalculateReason('');
      toast.success('Baseline recalculated successfully');
    }
  };

  const handleLockBaseline = () => {
    const updated = {
      ...currentBaseline,
      locked: true,
      approvedBy: 'John Doe',
      approvedDate: new Date().toISOString().split('T')[0],
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
      year: baseline.year.toString(),
      emissions: baseline.emissions.toString(),
      dataSource: baseline.dataSource || '',
      emissionFactorVersion: baseline.emissionFactorVersion || '',
    });
  };

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear().toString(),
      emissions: '',
      dataSource: '',
      emissionFactorVersion: '',
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
                ? `This baseline was approved and locked on ${currentBaseline.approvedDate} by ${currentBaseline.approvedBy}. Changes require unlocking first.`
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
                  {currentBaseline.emissions.toLocaleString()} <span className="text-base font-normal text-gray-600">tCO₂e</span>
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

        {/* Data Sources */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Data Sources</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-gray-600">Primary Source</Label>
              <p className="text-sm font-medium text-gray-900 mt-1">{currentBaseline.dataSource}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Emission Factor Version</Label>
              <p className="text-sm font-medium text-gray-900 mt-1">{currentBaseline.emissionFactorVersion}</p>
            </div>
          </div>
        </Card>

        {/* Organizational Boundaries */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Organizational Coverage</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-gray-600">Offices</Label>
              <div className="mt-2 space-y-2">
                {currentBaseline.offices.map((office, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-900">{office}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t">
              <Label className="text-sm text-gray-600">Legal Entities</Label>
              <div className="mt-2 space-y-2">
                {currentBaseline.legalEntities.map((entity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-900">{entity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

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
                    {baseline.emissions.toLocaleString()} tCO₂e • {baseline.offices.length} offices • {baseline.legalEntities.length} entities
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
              Define a new baseline year with emissions data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                  value={formData.emissions}
                  onChange={(e) => setFormData({ ...formData, emissions: e.target.value })}
                  placeholder="2847"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="dataSource">Data Source *</Label>
              <Input
                id="dataSource"
                value={formData.dataSource}
                onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                placeholder="e.g., HR System + Survey"
              />
            </div>

            <div>
              <Label htmlFor="emissionFactorVersion">Emission Factor Version *</Label>
              <Input
                id="emissionFactorVersion"
                value={formData.emissionFactorVersion}
                onChange={(e) => setFormData({ ...formData, emissionFactorVersion: e.target.value })}
                placeholder="e.g., DEFRA 2023 v1.8"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBaseline}
              disabled={!formData.year || !formData.emissions || !formData.dataSource || !formData.emissionFactorVersion}
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
              Update baseline emissions and data sources
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-emissions">Total Emissions (tCO₂e) *</Label>
              <Input
                id="edit-emissions"
                type="number"
                step="0.01"
                value={formData.emissions}
                onChange={(e) => setFormData({ ...formData, emissions: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-dataSource">Data Source *</Label>
              <Input
                id="edit-dataSource"
                value={formData.dataSource}
                onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-emissionFactorVersion">Emission Factor Version *</Label>
              <Input
                id="edit-emissionFactorVersion"
                value={formData.emissionFactorVersion}
                onChange={(e) => setFormData({ ...formData, emissionFactorVersion: e.target.value })}
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
                <strong>Current:</strong> {selectedBaseline?.emissions.toLocaleString()} tCO₂e
              </p>
            </div>
            <div>
              <Label htmlFor="recalc-emissions">New Total Emissions (tCO₂e) *</Label>
              <Input
                id="recalc-emissions"
                type="number"
                step="0.01"
                value={formData.emissions}
                onChange={(e) => setFormData({ ...formData, emissions: e.target.value })}
                placeholder="2847"
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
              disabled={!formData.emissions || !recalculateReason.trim()}
            >
              Recalculate Baseline
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
                  {baseline.year === currentBaseline.year && <Badge className="mt-2" variant="default">Current</Badge>}
                </div>
                <div className={`p-4 border rounded-lg ${index === 0 ? '' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">Emissions</p>
                  <p className="font-bold">{baseline.emissions.toLocaleString()} tCO₂e</p>
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
                    <p className={`font-bold ${baseline.emissions < baselines[index - 1].emissions ? 'text-green-600' : 'text-red-600'}`}>
                      {((baseline.emissions - baselines[index - 1].emissions) / baselines[index - 1].emissions * 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsCompareDialogOpen(false)}>Close</Button>
          </DialogFooter>
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
                <span className="font-medium">{currentBaseline.emissions.toLocaleString()} tCO₂e</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Data Source:</span>
                <span className="font-medium">{currentBaseline.dataSource}</span>
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
