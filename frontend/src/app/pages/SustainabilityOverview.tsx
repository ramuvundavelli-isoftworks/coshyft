import React, { useState } from 'react';
import { Link } from 'react-router';
import { KPICard } from '../components/KPICard';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
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
  FileCheck,
  Globe,
  Train,
} from 'lucide-react';
import { mockAlerts, mockInitiatives } from '../data/mockData';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';
import { useApi } from '../api';
import { sustainabilityApi, alertsApi } from '../api';

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
      <div className="flex items-start justify-between py-4">
        {/* Left - Title */}
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-[32px] leading-[40px] text-foreground tracking-[0.0703px] mb-2">
            Sustainability Overview
          </h1>
          <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-muted-foreground tracking-[-0.3125px]">
            Executive control center for Scope 3 Category 7 compliance
          </p>
        </div>

        {/* Right - Action Buttons */}
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px] h-9 bg-card border border-[rgba(0,0,0,0.1)] shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd-2026">YTD 2026</SelectItem>
              <SelectItem value="q1-2026">Q1 2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => setIsExportDialogOpen(true)} 
            className="h-9 bg-card border border-[rgba(0,0,0,0.1)] hover:bg-background-subtle shadow-sm hover:shadow-md"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-5 text-foreground tracking-[-0.1504px]">
              Export
            </span>
          </Button>
          <Button 
            onClick={() => setIsSimulationDialogOpen(true)} 
            className="h-9 bg-brand-500 hover:bg-brand-500 text-white shadow-md hover:shadow-lg"
          >
            <Zap className="h-4 w-4 mr-2" />
            <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-5 text-white tracking-[-0.1504px]">
              Run Simulation
            </span>
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Card className="p-6 border-destructive/25 bg-destructive-subtle">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-destructive mb-2">Critical Alerts Require Attention</h3>
              <div className="space-y-2">
                {criticalAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 bg-card backdrop-blur-md rounded-[14px] border border-border-subtle/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <div>
                      <p className="font-medium text-foreground">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
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
        <h3 className="font-semibold text-foreground mb-4">Target vs Actual Performance</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <Line
            data={{
              labels: targetGapData.map(d => d.month),
              datasets: [
                {
                  label: 'Target',
                  data: targetGapData.map(d => d.target),
                  borderColor: colors.chart.red,
                  borderWidth: 2,
                  borderDash: [5, 5],
                  fill: false,
                },
                {
                  label: 'Actual',
                  data: targetGapData.map(d => d.actual),
                  borderColor: colors.chart.blue,
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
            options={lineChartOptions}
          />
        </div>
      </Card>

      {/* Quick Links to Compliance & Transport Analytics */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Compliance & Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/csrd-compliance">
            <div className="p-5 border-2 border-border rounded-lg hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-success-subtle to-success-subtle rounded-lg group-hover:scale-110 transition-transform">
                  <FileCheck className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">CSRD/ESRS E1</h4>
                  <p className="text-sm text-muted-foreground">Compliance Dashboard</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Track CSRD requirements, materiality assessments, and compliance progress</p>
              <div className="flex items-center gap-2 mt-3 text-brand-500 text-sm font-medium">
                View Dashboard <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link to="/regulatory-reporting">
            <div className="p-5 border-2 border-border rounded-lg hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-info-subtle to-info-subtle rounded-lg group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6 text-info" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Regulatory Reporting</h4>
                  <p className="text-sm text-muted-foreground">Reporting & Submissions</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Manage regulatory reports, submissions, and compliance frameworks</p>
              <div className="flex items-center gap-2 mt-3 text-brand-500 text-sm font-medium">
                View Reports <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <Link to="/transport-analytics">
            <div className="p-5 border-2 border-border rounded-lg hover:border-brand-500 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-info-subtle to-primary-subtle rounded-lg group-hover:scale-110 transition-transform">
                  <Train className="h-6 w-6 text-info" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Public Transport</h4>
                  <p className="text-sm text-muted-foreground">Transport Analytics</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Analyze commuting patterns across public transport networks and modes</p>
              <div className="flex items-center gap-2 mt-3 text-brand-500 text-sm font-medium">
                View Analytics <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Active Initiatives & Compliance Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Active Initiatives</h3>
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
                  <h4 className="font-medium text-foreground">{initiative.name}</h4>
                  <Badge className="bg-info-subtle text-info">{initiative.status}</Badge>
                </div>
                <Progress value={initiative.completion} className="mb-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{initiative.completion}% Complete</span>
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
          <h3 className="font-semibold text-foreground mb-4">Compliance Status</h3>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Data Quality</span>
                <Badge className="bg-success-subtle text-success">Excellent</Badge>
              </div>
              <Progress value={94} className="mb-2" />
              <p className="text-sm text-muted-foreground">94% of data meets quality standards</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Reporting Readiness</span>
                <Badge className="bg-success-subtle text-success">Ready</Badge>
              </div>
              <Progress value={100} className="mb-2" />
              <p className="text-sm text-muted-foreground">All frameworks up to date</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Audit Preparedness</span>
                <Badge className="bg-warning-subtle text-warning">In Progress</Badge>
              </div>
              <Progress value={78} className="mb-2" />
              <p className="text-sm text-muted-foreground">Evidence collection ongoing</p>
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
            <p className="text-sm text-muted-foreground mt-2">
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
              <div className="p-4 bg-destructive-subtle border border-destructive/25 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-destructive">{selectedAlert.title}</h4>
                    <p className="text-sm text-destructive mt-1">{selectedAlert.description}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm text-muted-foreground">Severity</Label>
                  <p className="font-medium text-foreground">{selectedAlert.severity}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <p className="font-medium text-foreground">{selectedAlert.category}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Source</Label>
                  <p className="font-medium text-foreground">{selectedAlert.source}</p>
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
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Badge className="bg-info-subtle text-info mt-1">{selectedInitiative.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Completion</Label>
                  <Progress value={selectedInitiative.completion} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">{selectedInitiative.completion}%</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Impact</Label>
                  <p className="font-medium text-foreground">{selectedInitiative.impact || 'High'}</p>
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