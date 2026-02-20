import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Target,
  Plus,
  Edit,
  Copy,
  Trash2,
  TrendingDown,
  Calendar,
  Download,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
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
import { toast } from 'sonner';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, colors } from '../utils/chartConfig';

interface TargetScenario {
  id: string;
  name: string;
  description: string;
  baselineYear: number;
  baselineEmissions: number;
  targetYear: number;
  reductionPercent: number;
  targetEmissions: number;
  status: 'active' | 'draft' | 'archived';
  createdDate: string;
  isDefault: boolean;
}

const mockScenarios: TargetScenario[] = [
  {
    id: 's1',
    name: 'Board-Approved 2030 Target',
    description: '30% reduction by 2030 aligned with SBTi pathway',
    baselineYear: 2026,
    baselineEmissions: 2850,
    targetYear: 2030,
    reductionPercent: 30,
    targetEmissions: 1995,
    status: 'active',
    createdDate: '2026-02-01',
    isDefault: true,
  },
  {
    id: 's2',
    name: 'Ambitious 2028 Scenario',
    description: '40% reduction by 2028 - requires significant intervention',
    baselineYear: 2026,
    baselineEmissions: 2850,
    targetYear: 2028,
    reductionPercent: 40,
    targetEmissions: 1710,
    status: 'draft',
    createdDate: '2026-02-10',
    isDefault: false,
  },
];

const trajectoryData = [
  { year: 2026, actual: 2850, target: 2850, ambitious: 2850 },
  { year: 2027, actual: 2720, target: 2636, ambitious: 2280 },
  { year: 2028, actual: null, target: 2423, ambitious: 1710 },
  { year: 2029, actual: null, target: 2209, ambitious: 1710 },
  { year: 2030, actual: null, target: 1995, ambitious: 1710 },
];

export default function TargetsTrajectory() {
  const [scenarios, setScenarios] = useState<TargetScenario[]>(mockScenarios);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<TargetScenario | null>(null);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    baselineYear: 2026,
    baselineEmissions: 2850,
    targetYear: 2030,
    reductionPercent: 30,
    status: 'draft' as 'active' | 'draft',
  });

  const handleCreateScenario = () => {
    const targetEmissions = newScenario.baselineEmissions * (1 - newScenario.reductionPercent / 100);
    const scenario: TargetScenario = {
      id: `s${scenarios.length + 1}`,
      ...newScenario,
      targetEmissions,
      createdDate: new Date().toISOString().split('T')[0],
      isDefault: false,
    };
    setScenarios([...scenarios, scenario]);
    setIsCreateDialogOpen(false);
    setNewScenario({
      name: '',
      description: '',
      baselineYear: 2026,
      baselineEmissions: 2850,
      targetYear: 2030,
      reductionPercent: 30,
      status: 'draft',
    });
    toast.success('Target scenario created successfully');
  };

  const handleEditScenario = () => {
    if (!selectedScenario) return;
    const targetEmissions = newScenario.baselineEmissions * (1 - newScenario.reductionPercent / 100);
    const updated = scenarios.map(s =>
      s.id === selectedScenario.id
        ? { ...s, ...newScenario, targetEmissions }
        : s
    );
    setScenarios(updated);
    setIsEditDialogOpen(false);
    setSelectedScenario(null);
    toast.success('Target scenario updated successfully');
  };

  const handleDuplicateScenario = (scenario: TargetScenario) => {
    const duplicate: TargetScenario = {
      ...scenario,
      id: `s${scenarios.length + 1}`,
      name: `${scenario.name} (Copy)`,
      status: 'draft',
      isDefault: false,
      createdDate: new Date().toISOString().split('T')[0],
    };
    setScenarios([...scenarios, duplicate]);
    toast.success('Target scenario duplicated successfully');
  };

  const handleDeleteScenario = () => {
    if (!selectedScenario) return;
    if (selectedScenario.isDefault) {
      toast.error('Cannot delete the default scenario');
      return;
    }
    setScenarios(scenarios.filter(s => s.id !== selectedScenario.id));
    setIsDeleteDialogOpen(false);
    setSelectedScenario(null);
    toast.success('Target scenario deleted successfully');
  };

  const handleSetDefault = (scenario: TargetScenario) => {
    const updated = scenarios.map(s => ({
      ...s,
      isDefault: s.id === scenario.id,
      status: s.id === scenario.id ? 'active' as const : s.status,
    }));
    setScenarios(updated);
    toast.success(`"${scenario.name}" set as default scenario`);
  };

  const openEditDialog = (scenario: TargetScenario) => {
    setSelectedScenario(scenario);
    setNewScenario({
      name: scenario.name,
      description: scenario.description,
      baselineYear: scenario.baselineYear,
      baselineEmissions: scenario.baselineEmissions,
      targetYear: scenario.targetYear,
      reductionPercent: scenario.reductionPercent,
      status: scenario.status,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (scenario: TargetScenario) => {
    setSelectedScenario(scenario);
    setIsDeleteDialogOpen(true);
  };

  const activeScenario = scenarios.find(s => s.isDefault) || scenarios[0];
  const currentYear = 2026;
  const yearsToTarget = activeScenario.targetYear - currentYear;
  const currentEmissions = 2850;
  const progressPercent = ((activeScenario.baselineEmissions - currentEmissions) / (activeScenario.baselineEmissions - activeScenario.targetEmissions)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Targets & Trajectory</h1>
          <p className="text-gray-600 mt-1">
            Set emission reduction targets and track progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Scenario
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Target Year</p>
          <p className="text-3xl font-bold text-gray-900">{activeScenario.targetYear}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Reduction Target</p>
          <p className="text-3xl font-bold text-green-600">{activeScenario.reductionPercent}%</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Target Emissions</p>
          <p className="text-3xl font-bold text-purple-600">{activeScenario.targetEmissions.toFixed(0)}</p>
          <p className="text-xs text-gray-500 mt-2">tCO₂e by {activeScenario.targetYear}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Years Remaining</p>
          <p className="text-3xl font-bold text-orange-600">{yearsToTarget}</p>
        </Card>
      </div>

      {/* Progress Tracker */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress to Target</h2>
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Current: {currentEmissions} tCO₂e</span>
            <span>Target: {activeScenario.targetEmissions.toFixed(0)} tCO₂e</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                progressPercent >= 100 ? 'bg-green-600' : progressPercent >= 50 ? 'bg-blue-600' : 'bg-orange-600'
              }`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {progressPercent.toFixed(1)}% progress • {(activeScenario.baselineEmissions - currentEmissions).toFixed(0)} tCO₂e reduced
          </p>
        </div>
        {progressPercent < 25 && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">Behind Schedule</p>
                <p className="text-sm text-orange-700">
                  Current trajectory will not meet {activeScenario.targetYear} target. Additional initiatives required.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Trajectory Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Emission Trajectory</h2>
        <div style={{ height: '350px', width: '100%' }}>
          <Line
            data={{
              labels: trajectoryData.map(d => d.year),
              datasets: [
                {
                  label: 'Actual',
                  data: trajectoryData.map(d => d.actual),
                  borderColor: colors.chart.blue,
                  borderWidth: 3,
                  fill: false,
                },
                {
                  label: 'Target Path',
                  data: trajectoryData.map(d => d.target),
                  borderColor: colors.chart.green,
                  borderWidth: 2,
                  borderDash: [5, 5],
                  fill: false,
                },
                {
                  label: 'Ambitious Scenario',
                  data: trajectoryData.map(d => d.ambitious),
                  borderColor: colors.chart.purple,
                  borderWidth: 2,
                  borderDash: [5, 5],
                  fill: false,
                },
              ],
            }}
            options={lineChartOptions}
          />
        </div>
      </Card>

      {/* Scenario Management */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Target Scenarios</h2>
        <div className="space-y-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-5 border rounded-lg ${scenario.isDefault ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
                    {scenario.isDefault && (
                      <Badge className="bg-blue-600 text-white">Default</Badge>
                    )}
                    <Badge className={
                      scenario.status === 'active' ? 'bg-green-100 text-green-700' :
                      scenario.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }>
                      {scenario.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{scenario.description}</p>
                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Baseline</p>
                      <p className="font-semibold text-gray-900">{scenario.baselineYear}: {scenario.baselineEmissions} tCO₂e</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target Year</p>
                      <p className="font-semibold text-gray-900">{scenario.targetYear}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Reduction</p>
                      <p className="font-semibold text-green-600">{scenario.reductionPercent}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target</p>
                      <p className="font-semibold text-gray-900">{scenario.targetEmissions.toFixed(0)} tCO₂e</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-semibold text-gray-900">{new Date(scenario.createdDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!scenario.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(scenario)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(scenario)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateScenario(scenario)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Duplicate
                  </Button>
                  {!scenario.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(scenario)}
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Scenario Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Target Scenario</DialogTitle>
            <DialogDescription>
              Define a new emission reduction target scenario
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Scenario Name *</Label>
              <Input
                id="name"
                value={newScenario.name}
                onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
                placeholder="e.g., 2030 SBTi-Aligned Target"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newScenario.description}
                onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                placeholder="Describe the scenario and assumptions..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baselineYear">Baseline Year *</Label>
                <Input
                  id="baselineYear"
                  type="number"
                  value={newScenario.baselineYear}
                  onChange={(e) => setNewScenario({ ...newScenario, baselineYear: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="baselineEmissions">Baseline Emissions (tCO₂e) *</Label>
                <Input
                  id="baselineEmissions"
                  type="number"
                  value={newScenario.baselineEmissions}
                  onChange={(e) => setNewScenario({ ...newScenario, baselineEmissions: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetYear">Target Year *</Label>
                <Input
                  id="targetYear"
                  type="number"
                  value={newScenario.targetYear}
                  onChange={(e) => setNewScenario({ ...newScenario, targetYear: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reductionPercent">Reduction Target (%) *</Label>
                <Input
                  id="reductionPercent"
                  type="number"
                  value={newScenario.reductionPercent}
                  onChange={(e) => setNewScenario({ ...newScenario, reductionPercent: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Calculated Target:</strong> {(newScenario.baselineEmissions * (1 - newScenario.reductionPercent / 100)).toFixed(0)} tCO₂e by {newScenario.targetYear}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Annual reduction required: {((newScenario.baselineEmissions * newScenario.reductionPercent / 100) / (newScenario.targetYear - newScenario.baselineYear)).toFixed(0)} tCO₂e/year
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={newScenario.status}
                onValueChange={(value: any) => setNewScenario({ ...newScenario, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateScenario}
              disabled={!newScenario.name || !newScenario.description}
            >
              Create Scenario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Scenario Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Target Scenario</DialogTitle>
            <DialogDescription>
              Modify the target scenario parameters
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Scenario Name *</Label>
              <Input
                id="edit-name"
                value={newScenario.name}
                onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={newScenario.description}
                onChange={(e) => setNewScenario({ ...newScenario, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-targetYear">Target Year *</Label>
                <Input
                  id="edit-targetYear"
                  type="number"
                  value={newScenario.targetYear}
                  onChange={(e) => setNewScenario({ ...newScenario, targetYear: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-reductionPercent">Reduction Target (%) *</Label>
                <Input
                  id="edit-reductionPercent"
                  type="number"
                  value={newScenario.reductionPercent}
                  onChange={(e) => setNewScenario({ ...newScenario, reductionPercent: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditScenario}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Target Scenario</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedScenario?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteScenario}>
              Delete Scenario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}