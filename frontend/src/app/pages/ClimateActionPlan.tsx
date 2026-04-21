// Climate Action Plan Alignment Page
// Tracks alignment with Ireland's Climate Action Plan 2024

import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  BarChart3,
  Flag,
  Download,
  ArrowRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import { formatEmissions, formatPercentage } from '../utils/localization';

interface CAPTarget {
  id: string;
  sector: string;
  targetYear: number;
  targetDescription: string;
  baselineYear: number;
  targetReduction: number;
  currentProgress: number;
  status: 'on-track' | 'at-risk' | 'behind' | 'achieved';
  ourAlignment: number;
  ourContribution: number;
}

const climateTargets: CAPTarget[] = [
  {
    id: 'cap_2024_1',
    sector: 'Transport',
    targetYear: 2030,
    targetDescription: '50% reduction in transport emissions by 2030',
    baselineYear: 2018,
    targetReduction: 50,
    currentProgress: 28,
    status: 'on-track',
    ourAlignment: 32,
    ourContribution: 2847, // Our total emissions in tonnes
  },
  {
    id: 'cap_2024_2',
    sector: 'Transport - EV Adoption',
    targetYear: 2030,
    targetDescription: '945,000 electric vehicles on Irish roads by 2030',
    baselineYear: 2023,
    targetReduction: 100, // Full transition metric
    currentProgress: 18,
    status: 'at-risk',
    ourAlignment: 24,
    ourContribution: 84, // Number of EVs in our fleet
  },
  {
    id: 'cap_2024_3',
    sector: 'Active Travel',
    targetYear: 2030,
    targetDescription: '500,000 daily cycling trips by 2030',
    baselineYear: 2021,
    targetReduction: 100,
    currentProgress: 22,
    status: 'on-track',
    ourAlignment: 38,
    ourContribution: 127, // Bike-to-work participants
  },
  {
    id: 'cap_2024_4',
    sector: 'Public Transport',
    targetYear: 2030,
    targetDescription: '20% increase in public transport usage',
    baselineYear: 2019,
    targetReduction: 20,
    currentProgress: 12,
    status: 'behind',
    ourAlignment: 42,
    ourContribution: 545, // Public transport users
  },
  {
    id: 'cap_2024_5',
    sector: 'Remote Work',
    targetYear: 2030,
    targetDescription: '20% of workforce working remotely post-pandemic',
    baselineYear: 2019,
    targetReduction: 100,
    currentProgress: 45,
    status: 'on-track',
    ourAlignment: 52,
    ourContribution: 14, // Remote work policy participants
  },
];

const milestones = [
  {
    id: 'm1',
    year: 2024,
    title: 'Carbon Budget 1 Compliance',
    description: 'Meet first carbon budget period requirements',
    status: 'completed',
    ourStatus: 'achieved',
  },
  {
    id: 'm2',
    year: 2025,
    title: '25% Emissions Reduction',
    description: 'Achieve 25% reduction from baseline year',
    status: 'in-progress',
    ourStatus: 'on-track',
  },
  {
    id: 'm3',
    year: 2026,
    title: 'Enhanced Reporting Requirements',
    description: 'Full CSRD compliance for Scope 3 Category 7',
    status: 'upcoming',
    ourStatus: 'preparing',
  },
  {
    id: 'm4',
    year: 2030,
    title: '51% National Emissions Reduction',
    description: 'National target: 51% reduction by 2030 vs 2018',
    status: 'upcoming',
    ourStatus: 'planning',
  },
  {
    id: 'm5',
    year: 2050,
    title: 'Net Zero Emissions',
    description: 'Achieve climate neutrality by 2050',
    status: 'upcoming',
    ourStatus: 'planning',
  },
];

export default function ClimateActionPlan() {
  const [selectedTarget, setSelectedTarget] = useState<CAPTarget | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const overallAlignment =
    climateTargets.reduce((sum, t) => sum + t.ourAlignment, 0) / climateTargets.length;

  const onTrackCount = climateTargets.filter((t) => t.status === 'on-track').length;

  const handleViewDetails = (target: CAPTarget) => {
    setSelectedTarget(target);
    setIsDetailsDialogOpen(true);
  };

  const handleGenerateReport = () => {
    toast.success('Climate Action Plan alignment report generated');
    setIsReportDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
      case 'achieved':
        return 'bg-success-subtle text-success border-success/25';
      case 'at-risk':
        return 'bg-warning-subtle text-warning border-warning/25';
      case 'behind':
        return 'bg-destructive-subtle text-destructive border-destructive/25';
      case 'completed':
        return 'bg-info-subtle text-info border-info/25';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
      case 'achieved':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'at-risk':
      case 'behind':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Climate Action Plan Alignment</h1>
          <p className="text-muted-foreground mt-1">
            Track alignment with Ireland's Climate Action Plan 2024
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsReportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-success-subtle rounded-lg">
              <Target className="h-5 w-5 text-success" />
            </div>
            <span className="text-2xl font-semibold text-foreground">
              {formatPercentage(overallAlignment)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Alignment</p>
          <p className="text-xs text-success mt-1">CAP 2024 Targets</p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-info-subtle rounded-lg">
              <CheckCircle className="h-5 w-5 text-info" />
            </div>
            <span className="text-2xl font-semibold text-foreground">
              {onTrackCount}/{climateTargets.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Targets On Track</p>
          <p className="text-xs text-muted-foreground mt-1">National objectives</p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-info-subtle rounded-lg">
              <TrendingUp className="h-5 w-5 text-info" />
            </div>
            <span className="text-2xl font-semibold text-foreground">32%</span>
          </div>
          <p className="text-sm text-muted-foreground">Reduction Achieved</p>
          <p className="text-xs text-muted-foreground mt-1">vs 2018 baseline</p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <Calendar className="h-5 w-5 text-warning" />
            </div>
            <span className="text-2xl font-semibold text-foreground">2030</span>
          </div>
          <p className="text-sm text-muted-foreground">Target Year</p>
          <p className="text-xs text-muted-foreground mt-1">4 years remaining</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="targets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="targets">Sectoral Targets</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="contribution">Our Contribution</TabsTrigger>
        </TabsList>

        {/* Sectoral Targets Tab */}
        <TabsContent value="targets" className="space-y-4 mt-6">
          <Card className="p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Climate Action Plan 2024 - Transport Sector Targets
            </h3>
            <div className="space-y-4">
              {climateTargets.map((target) => (
                <div
                  key={target.id}
                  className="border border-border rounded-lg p-4 hover:border-brand-500 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(target)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{target.sector}</h4>
                        <Badge className={getStatusColor(target.status)}>
                          {getStatusIcon(target.status)}
                          <span className="ml-1">{target.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{target.targetDescription}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* National Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">National Progress</span>
                        <span className="text-sm font-medium text-foreground">
                          {formatPercentage(target.currentProgress)}
                        </span>
                      </div>
                      <Progress value={target.currentProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Target: {formatPercentage(target.targetReduction)} by {target.targetYear}
                      </p>
                    </div>

                    {/* Our Alignment */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Our Alignment</span>
                        <span className="text-sm font-medium text-foreground">
                          {formatPercentage(target.ourAlignment)}
                        </span>
                      </div>
                      <Progress value={target.ourAlignment} className="h-2" />
                      <p className="text-xs text-success mt-1">
                        {target.ourAlignment > target.currentProgress ? 'Ahead' : 'Behind'} of national
                        average
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4 mt-6">
          <Card className="p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">Key Milestones</h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-muted" />

              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="relative flex items-start gap-4">
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                        milestone.status === 'completed'
                          ? 'bg-success-subtle border-success'
                          : milestone.status === 'in-progress'
                          ? 'bg-info-subtle border-info'
                          : 'bg-muted border-border'
                      }`}
                    >
                      <span className="text-sm font-bold text-foreground">{milestone.year}</span>
                    </div>

                    {/* Milestone content */}
                    <div className="flex-1 pb-8">
                      <Card className="p-4 border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{milestone.status}</Badge>
                            <Badge className={getStatusColor(milestone.ourStatus)}>
                              {milestone.ourStatus}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Our Contribution Tab */}
        <TabsContent value="contribution" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Our Contribution to National Targets
              </h3>
              <div className="space-y-4">
                {climateTargets.map((target) => (
                  <div key={target.id} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{target.sector}</span>
                      <span className="text-sm font-semibold text-success">
                        {target.ourContribution.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={target.ourAlignment} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage(target.ourAlignment)} alignment with CAP 2024
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Initiatives</h3>
              <div className="space-y-3">
                <div className="p-3 bg-success-subtle border border-success/25 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">Active Travel Program</span>
                  </div>
                  <p className="text-xs text-success">
                    127 participants in Bike-to-Work scheme
                  </p>
                </div>

                <div className="p-3 bg-info-subtle border border-info/25 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-info" />
                    <span className="text-sm font-medium text-info">Public Transport</span>
                  </div>
                  <p className="text-xs text-info">545 regular public transport commuters</p>
                </div>

                <div className="p-3 bg-info-subtle border border-info/25 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-info" />
                    <span className="text-sm font-medium text-foreground">EV Transition</span>
                  </div>
                  <p className="text-xs text-info">84 EVs supported through incentives</p>
                </div>

                <div className="p-3 bg-warning-subtle border border-warning/25 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Remote Work Policy</span>
                  </div>
                  <p className="text-xs text-warning">14% of workforce working remotely</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Target Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Target className="h-6 w-6 text-brand-500" />
              {selectedTarget?.sector}
            </DialogTitle>
            <DialogDescription>{selectedTarget?.targetDescription}</DialogDescription>
          </DialogHeader>
          {selectedTarget && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Target Year</p>
                  <p className="text-2xl font-semibold text-foreground">{selectedTarget.targetYear}</p>
                </Card>
                <Card className="p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Baseline Year</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {selectedTarget.baselineYear}
                  </p>
                </Card>
                <Card className="p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Target Reduction</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {formatPercentage(selectedTarget.targetReduction)}
                  </p>
                </Card>
                <Card className="p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                  <Badge className={getStatusColor(selectedTarget.status)}>
                    {selectedTarget.status}
                  </Badge>
                </Card>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Progress Tracking</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">National Progress</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatPercentage(selectedTarget.currentProgress)}
                      </span>
                    </div>
                    <Progress value={selectedTarget.currentProgress} className="h-3" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Our Company Alignment</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatPercentage(selectedTarget.ourAlignment)}
                      </span>
                    </div>
                    <Progress value={selectedTarget.ourAlignment} className="h-3" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
                <div className="flex items-start gap-2">
                  <Flag className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-info">Our Contribution</p>
                    <p className="text-sm text-info mt-1">
                      Contributing {selectedTarget.ourContribution.toLocaleString()} units to this national
                      target through our employee commuting initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate CAP Alignment Report</DialogTitle>
            <DialogDescription>
              Create a comprehensive report on Climate Action Plan alignment
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Sectoral target progress analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BarChart3 className="h-4 w-4" />
              <span>Milestone achievement tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Company contribution metrics</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
