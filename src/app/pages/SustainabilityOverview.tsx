import React, { useState } from 'react';
import { Link } from 'react-router';
import { KPICard } from '../components/KPICard';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
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
import {
  Activity,
  TrendingDown,
  Users,
  Database,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Zap,
  Download,
  Eye,
  Play,
} from 'lucide-react';
import { mockAlerts, mockInitiatives } from '../data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { toast } from 'sonner';

const targetGapData = [
  { month: 'Jan', actual: 245, target: 230 },
  { month: 'Feb', actual: 238, target: 225 },
  { month: 'Mar', actual: 252, target: 235 },
  { month: 'Apr', actual: 241, target: 230 },
  { month: 'May', actual: 235, target: 225 },
  { month: 'Jun', actual: 229, target: 220 },
  { month: 'Jul', actual: 233, target: 218 },
  { month: 'Aug', actual: 227, target: 215 },
];

export default function SustainabilityOverview() {
  const [period, setPeriod] = useState('ytd-2026');
  const [isSimulationDialogOpen, setIsSimulationDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isAlertDetailsDialogOpen, setIsAlertDetailsDialogOpen] = useState(false);
  const [isInitiativeDetailsDialogOpen, setIsInitiativeDetailsDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [selectedInitiative, setSelectedInitiative] = useState<any>(null);

  const criticalAlerts = mockAlerts.filter(a => !a.resolved && a.severity === 'critical');
  const activeInitiatives = mockInitiatives.filter(i => i.status === 'active');

  const handleRunSimulation = () => {
    toast.success('Simulation started - results will be available in 2-3 minutes');
    setIsSimulationDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting sustainability dashboard...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sustainability Overview</h1>
          <p className="text-gray-600 mt-1">
            Executive control center for Scope 3 Category 7 compliance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd-2026">YTD 2026</SelectItem>
              <SelectItem value="q1-2026">Q1 2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsSimulationDialogOpen(true)}>
            <Zap className="h-4 w-4 mr-2" />
            Run Simulation
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Emissions"
          value="1,850"
          unit="tCO₂e"
          change={-5.2}
          changeLabel="vs baseline"
          icon={Activity}
          trend="down"
          status="good"
        />
        <KPICard
          title="Emissions Intensity"
          value="0.42"
          unit="tCO₂e/FTE"
          change={-3.8}
          changeLabel="vs baseline"
          icon={TrendingDown}
          trend="down"
        />
        <KPICard
          title="Reduction vs Baseline"
          value="35"
          unit="%"
          icon={Target}
          status="good"
        />
        <KPICard
          title="Participation Rate"
          value="76"
          unit="%"
          change={8.5}
          icon={Users}
          trend="up"
          status="good"
        />
        <KPICard
          title="Data Quality"
          value="94"
          unit="%"
          icon={Database}
          status="good"
        />
        <KPICard
          title="Active Initiatives"
          value={activeInitiatives.length.toString()}
          icon={CheckCircle}
          status="good"
        />
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Critical Alerts Require Attention</h3>
              <div className="space-y-2">
                {criticalAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAlert(alert);
                        setIsAlertDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Target Gap Analysis */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Target vs Actual Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={targetGapData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target" />
            <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Active Initiatives & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Active Initiatives</h3>
            <Link to="/initiatives">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {activeInitiatives.slice(0, 5).map((initiative) => (
              <div key={initiative.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{initiative.name}</h4>
                  <Badge className="bg-blue-100 text-blue-700">{initiative.status}</Badge>
                </div>
                <Progress value={initiative.completion} className="mb-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{initiative.completion}% Complete</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedInitiative(initiative);
                      setIsInitiativeDetailsDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Compliance Status</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Data Quality</span>
                <Badge className="bg-green-100 text-green-700">Excellent</Badge>
              </div>
              <Progress value={94} className="mb-2" />
              <p className="text-sm text-gray-600">94% of data meets quality standards</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Reporting Readiness</span>
                <Badge className="bg-green-100 text-green-700">Ready</Badge>
              </div>
              <Progress value={100} className="mb-2" />
              <p className="text-sm text-gray-600">All frameworks up to date</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">Audit Preparedness</span>
                <Badge className="bg-yellow-100 text-yellow-700">In Progress</Badge>
              </div>
              <Progress value={78} className="mb-2" />
              <p className="text-sm text-gray-600">Evidence collection ongoing</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Simulation Dialog */}
      <Dialog open={isSimulationDialogOpen} onOpenChange={setIsSimulationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Emissions Simulation</DialogTitle>
            <DialogDescription>
              Model impact of different scenarios on emissions targets
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="scenario">Simulation Scenario *</Label>
            <Select defaultValue="baseline">
              <SelectTrigger id="scenario">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baseline">Baseline Scenario</SelectItem>
                <SelectItem value="aggressive">Aggressive Reduction</SelectItem>
                <SelectItem value="moderate">Moderate Reduction</SelectItem>
                <SelectItem value="custom">Custom Scenario</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Simulation will analyze projected emissions through 2030
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSimulationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRunSimulation}>
              <Play className="h-4 w-4 mr-2" />
              Run Simulation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Dashboard</DialogTitle>
            <DialogDescription>
              Download comprehensive sustainability overview
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
            <Select defaultValue="pdf">
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="excel">Excel Workbook</SelectItem>
                <SelectItem value="pptx">PowerPoint Presentation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Details Dialog */}
      <Dialog open={isAlertDetailsDialogOpen} onOpenChange={setIsAlertDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
            <DialogDescription>
              Critical alert requiring attention
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="py-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900">{selectedAlert.title}</h4>
                    <p className="text-sm text-red-700 mt-1">{selectedAlert.description}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm text-gray-600">Severity</Label>
                  <p className="font-medium text-gray-900">{selectedAlert.severity}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Category</Label>
                  <p className="font-medium text-gray-900">{selectedAlert.category}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Source</Label>
                  <p className="font-medium text-gray-900">{selectedAlert.source}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAlertDetailsDialogOpen(false)}>
              Close
            </Button>
            <Button>Resolve Alert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Initiative Details Dialog */}
      <Dialog open={isInitiativeDetailsDialogOpen} onOpenChange={setIsInitiativeDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Initiative Details</DialogTitle>
            <DialogDescription>
              {selectedInitiative?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedInitiative && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <Badge className="bg-blue-100 text-blue-700 mt-1">{selectedInitiative.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Completion</Label>
                  <Progress value={selectedInitiative.completion} className="mt-2" />
                  <p className="text-sm text-gray-600 mt-1">{selectedInitiative.completion}%</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Impact</Label>
                  <p className="font-medium text-gray-900">{selectedInitiative.impact || 'High'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInitiativeDetailsDialogOpen(false)}>
              Close
            </Button>
            <Link to="/initiatives">
              <Button>View Full Details</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
