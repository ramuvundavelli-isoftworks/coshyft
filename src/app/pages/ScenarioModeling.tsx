import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
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
import { Plus, Play, Eye, Download, Copy, TrendingDown, Target } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

interface Scenario {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'completed';
  reduction: number;
  targetYear: number;
}

const mockScenarios: Scenario[] = [
  { id: 's1', name: 'Baseline', description: 'Current trajectory', status: 'completed', reduction: 0, targetYear: 2030 },
  { id: 's2', name: 'Aggressive Mode Shift', description: '30% SOV reduction', status: 'completed', reduction: 35, targetYear: 2030 },
  { id: 's3', name: 'Moderate Improvements', description: '15% overall reduction', status: 'completed', reduction: 15, targetYear: 2030 },
];

const comparisonData = [
  { year: 2026, baseline: 1850, aggressive: 1850, moderate: 1850 },
  { year: 2027, baseline: 1820, aggressive: 1550, moderate: 1700 },
  { year: 2028, baseline: 1790, aggressive: 1350, moderate: 1580 },
  { year: 2029, baseline: 1760, aggressive: 1200, moderate: 1470 },
  { year: 2030, baseline: 1730, aggressive: 1150, moderate: 1380 },
];

export default function ScenarioModeling() {
  const [scenarios, setScenarios] = useState<Scenario[]>(mockScenarios);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', targetYear: '2030' });

  const handleCreateScenario = () => {
    const newScenario: Scenario = {
      id: `s-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      status: 'draft',
      reduction: 0,
      targetYear: parseInt(formData.targetYear),
    };
    setScenarios([...scenarios, newScenario]);
    setIsCreateDialogOpen(false);
    setFormData({ name: '', description: '', targetYear: '2030' });
    toast.success('Scenario created successfully');
  };

  const handleEditScenario = () => {
    if (selectedScenario) {
      const updated = scenarios.map(s =>
        s.id === selectedScenario.id
          ? { ...s, name: formData.name, description: formData.description, targetYear: parseInt(formData.targetYear) }
          : s
      );
      setScenarios(updated);
      setIsEditDialogOpen(false);
      toast.success('Scenario updated successfully');
    }
  };

  const handleRunModel = () => {
    toast.success('Scenario model running - results will be available in 2-3 minutes');
    setIsRunDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting scenario results...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scenario Modeling</h1>
          <p className="text-gray-600 mt-1">
            What-if analysis and emissions projections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsCompareDialogOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Compare Scenarios
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Scenario
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Scenarios</p>
              <p className="text-2xl font-bold text-gray-900">{scenarios.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Scenario</p>
              <p className="text-lg font-bold text-green-600">-35%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Play className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-bold text-gray-900">3 Completed</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Target className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Target Year</p>
              <p className="text-2xl font-bold text-gray-900">2030</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Scenario Comparison Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Scenario Projections</h3>
          <Button variant="outline" size="sm" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-1" />
            Export Results
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="baseline" stroke="#9ca3af" strokeWidth={2} name="Baseline" />
            <Line type="monotone" dataKey="aggressive" stroke="#10b981" strokeWidth={2} name="Aggressive" />
            <Line type="monotone" dataKey="moderate" stroke="#3b82f6" strokeWidth={2} name="Moderate" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Scenarios List */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Defined Scenarios</h3>
        <div className="space-y-3">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    <Badge
                      className={
                        scenario.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : scenario.status === 'running'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {scenario.status}
                    </Badge>
                    {scenario.reduction > 0 && (
                      <Badge className="bg-green-100 text-green-700">
                        -{scenario.reduction}% emissions
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                  <p className="text-xs text-gray-500">Target Year: {scenario.targetYear}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setIsRunDialogOpen(true);
                    }}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run Model
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedScenario(scenario);
                      setFormData({
                        name: scenario.name,
                        description: scenario.description,
                        targetYear: scenario.targetYear.toString(),
                      });
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const duplicate = { ...scenario, id: `s-${Date.now()}`, name: `${scenario.name} (Copy)` };
                      setScenarios([...scenarios, duplicate]);
                      toast.success('Scenario duplicated');
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Duplicate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Scenario Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Scenario</DialogTitle>
            <DialogDescription>Define a new emissions scenario for modeling</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Scenario Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Aggressive Reduction"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe scenario assumptions..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="targetYear">Target Year *</Label>
              <Select value={formData.targetYear} onValueChange={(val) => setFormData({ ...formData, targetYear: val })}>
                <SelectTrigger id="targetYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2028">2028</SelectItem>
                  <SelectItem value="2029">2029</SelectItem>
                  <SelectItem value="2030">2030</SelectItem>
                  <SelectItem value="2035">2035</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateScenario} disabled={!formData.name}>
              Create Scenario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Scenario Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Scenario</DialogTitle>
            <DialogDescription>Update scenario details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Scenario Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-targetYear">Target Year *</Label>
              <Select value={formData.targetYear} onValueChange={(val) => setFormData({ ...formData, targetYear: val })}>
                <SelectTrigger id="edit-targetYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2028">2028</SelectItem>
                  <SelectItem value="2029">2029</SelectItem>
                  <SelectItem value="2030">2030</SelectItem>
                  <SelectItem value="2035">2035</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditScenario}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Model Dialog */}
      <Dialog open={isRunDialogOpen} onOpenChange={setIsRunDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Scenario Model</DialogTitle>
            <DialogDescription>
              Execute emissions modeling for {selectedScenario?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Scenario:</strong> {selectedScenario?.name}
              </p>
              <p className="text-sm text-blue-900 mb-2">
                <strong>Target Year:</strong> {selectedScenario?.targetYear}
              </p>
              <p className="text-sm text-blue-700 mt-3">
                Model will calculate emissions projections based on scenario assumptions. Results typically available in 2-3 minutes.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRunDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRunModel}>
              <Play className="h-4 w-4 mr-2" />
              Run Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare Scenarios Dialog */}
      <Dialog open={isCompareDialogOpen} onOpenChange={setIsCompareDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Compare Scenarios</DialogTitle>
            <DialogDescription>Side-by-side scenario comparison</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Baseline', reduction: 0, emissions2030: 1730 },
                { name: 'Moderate', reduction: 15, emissions2030: 1380 },
                { name: 'Aggressive', reduction: 35, emissions2030: 1150 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="emissions2030" fill="#3b82f6" name="2030 Emissions (tCO₂e)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsCompareDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Scenario Results</DialogTitle>
            <DialogDescription>Download modeling results and projections</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
            <Select defaultValue="excel">
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel Workbook</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
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
