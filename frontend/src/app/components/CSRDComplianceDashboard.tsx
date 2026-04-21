// CSRD/ESRS E1 Compliance Dashboard Component
// Phase 2: Europe & Ireland Alignment - Enhanced Dashboards & Compliance Reporting

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Target,
  Calendar,
  Building2,
  Users,
  BarChart3,
  Shield,
  Euro,
  Info,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { formatCurrency, formatEmissions, formatPercentage, formatDate } from '../utils/localization';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { lineChartOptions, barChartOptions, radarChartOptions, colors } from '../utils/chartConfig';

interface CSRDRequirement {
  id: string;
  category: string;
  requirement: string;
  esrsReference: string;
  status: 'complete' | 'in-progress' | 'not-started';
  completeness: number;
  dueDate: string;
  assignedTo: string;
}

interface MaterialityAssessment {
  topic: string;
  impactMateriality: number;
  financialMateriality: number;
  overallMateriality: 'high' | 'medium' | 'low';
  esrsRequirement: string;
}

const csrdRequirements: CSRDRequirement[] = [
  {
    id: 'esrs-e1-1',
    category: 'Transition Plan',
    requirement: 'Climate change transition plan including Scope 3 Category 7',
    esrsReference: 'ESRS E1-1',
    status: 'in-progress',
    completeness: 75,
    dueDate: '2026-06-30',
    assignedTo: 'Sustainability Team',
  },
  {
    id: 'esrs-e1-4',
    category: 'GHG Emissions',
    requirement: 'Scope 3 Category 7 - Employee Commuting Emissions',
    esrsReference: 'ESRS E1-4',
    status: 'complete',
    completeness: 100,
    dueDate: '2026-03-31',
    assignedTo: 'Emma Richardson',
  },
  {
    id: 'esrs-e1-5',
    category: 'Energy',
    requirement: 'Energy consumption related to commuting initiatives',
    esrsReference: 'ESRS E1-5',
    status: 'complete',
    completeness: 100,
    dueDate: '2026-03-31',
    assignedTo: 'Sustainability Team',
  },
  {
    id: 'esrs-e1-6',
    category: 'Targets',
    requirement: 'GHG emission reduction targets (Scope 3 Cat 7)',
    esrsReference: 'ESRS E1-6',
    status: 'complete',
    completeness: 100,
    dueDate: '2026-04-30',
    assignedTo: 'Michael Chen',
  },
  {
    id: 'esrs-2-sbm-3',
    category: 'Material Impacts',
    requirement: 'Material impacts, risks and opportunities assessment',
    esrsReference: 'ESRS 2 SBM-3',
    status: 'in-progress',
    completeness: 60,
    dueDate: '2026-05-31',
    assignedTo: 'Auditor Team',
  },
  {
    id: 'esrs-e1-9',
    category: 'Verification',
    requirement: 'Limited assurance on GHG emissions data',
    esrsReference: 'ESRS E1-9',
    status: 'in-progress',
    completeness: 40,
    dueDate: '2026-07-31',
    assignedTo: 'External Auditor',
  },
];

const materialityTopics: MaterialityAssessment[] = [
  {
    topic: 'Employee Commuting Emissions',
    impactMateriality: 85,
    financialMateriality: 70,
    overallMateriality: 'high',
    esrsRequirement: 'ESRS E1-4',
  },
  {
    topic: 'Climate Transition Costs',
    impactMateriality: 75,
    financialMateriality: 80,
    overallMateriality: 'high',
    esrsRequirement: 'ESRS E1-1',
  },
  {
    topic: 'Sustainable Mobility Infrastructure',
    impactMateriality: 70,
    financialMateriality: 60,
    overallMateriality: 'high',
    esrsRequirement: 'ESRS E1-5',
  },
  {
    topic: 'Employee Wellbeing & Remote Work',
    impactMateriality: 65,
    financialMateriality: 55,
    overallMateriality: 'medium',
    esrsRequirement: 'ESRS S1',
  },
];

const complianceTimeline = [
  { month: 'Jan 2026', completed: 8, planned: 2 },
  { month: 'Feb 2026', completed: 12, planned: 4 },
  { month: 'Mar 2026', completed: 15, planned: 3 },
  { month: 'Apr 2026', completed: 18, planned: 5 },
  { month: 'May 2026', completed: 20, planned: 6 },
  { month: 'Jun 2026', completed: 21, planned: 8 },
];

const emissionsVsTargets = [
  { year: '2023', actual: 2850, target: 2850, csrdTarget: 2850 },
  { year: '2024', actual: 2680, target: 2706, csrdTarget: 2706 },
  { year: '2025', actual: 2420, target: 2563, csrdTarget: 2535 },
  { year: '2026', actual: 2180, target: 2419, csrdTarget: 2336 },
  { year: '2027', target: 2276, csrdTarget: 2109 },
  { year: '2028', target: 2132, csrdTarget: 1853 },
  { year: '2029', target: 1989, csrdTarget: 1568 },
  { year: '2030', target: 1710, csrdTarget: 1254 },
];

export default function CSRDComplianceDashboard() {
  const [selectedRequirement, setSelectedRequirement] = useState<CSRDRequirement | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const handleViewDetails = (requirement: CSRDRequirement) => {
    setSelectedRequirement(requirement);
    setIsDetailDialogOpen(true);
  };

  const completedRequirements = csrdRequirements.filter(r => r.status === 'complete').length;
  const totalRequirements = csrdRequirements.length;
  const overallCompleteness = Math.round((completedRequirements / totalRequirements) * 100);

  const statusColors = {
    'complete': 'bg-success-subtle text-success border-success/25',
    'in-progress': 'bg-info-subtle text-info border-info/25',
    'not-started': 'bg-muted text-foreground border-border',
  };

  const statusIcons = {
    'complete': CheckCircle,
    'in-progress': BarChart3,
    'not-started': AlertTriangle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1" style={{ fontFamily: 'Kaisei Decol, serif' }}>
            CSRD/ESRS E1 Compliance
          </h2>
          <p className="text-sm text-muted-foreground">
            Corporate Sustainability Reporting Directive - Scope 3 Category 7
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-brand-500 to-brand-600 text-white border-none px-4 py-2 text-sm">
          🇪🇺 EU Regulation 2022/2464
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-success-subtle rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <span className="text-2xl font-semibold text-foreground">{overallCompleteness}%</span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Compliance</p>
          <p className="text-xs text-muted-foreground mt-1">
            {completedRequirements} of {totalRequirements} requirements
          </p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-info-subtle rounded-lg">
              <FileText className="h-5 w-5 text-info" />
            </div>
            <span className="text-2xl font-semibold text-foreground">{completedRequirements}</span>
          </div>
          <p className="text-sm text-muted-foreground">Requirements Complete</p>
          <p className="text-xs text-success mt-1">+2 this month</p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <Calendar className="h-5 w-5 text-warning" />
            </div>
            <span className="text-2xl font-semibold text-foreground">
              {csrdRequirements.filter(r => r.status === 'in-progress').length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">In Progress</p>
          <p className="text-xs text-muted-foreground mt-1">Target: Jun 2026</p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Shield className="h-5 w-5 text-info" />
            </div>
            <span className="text-2xl font-semibold text-foreground">92%</span>
          </div>
          <p className="text-sm text-muted-foreground">Data Quality Score</p>
          <p className="text-xs text-success mt-1">+5% vs last quarter</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="requirements" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="materiality">Materiality</TabsTrigger>
          <TabsTrigger value="targets">Targets & Progress</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="space-y-4">
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">ESRS E1 Requirements Tracker</h3>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="space-y-3">
              {csrdRequirements.map((requirement) => {
                const StatusIcon = statusIcons[requirement.status];
                return (
                  <div
                    key={requirement.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-brand-500 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(requirement)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-muted rounded-lg">
                        <StatusIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{requirement.category}</span>
                          <Badge variant="outline" className="text-xs">
                            {requirement.esrsReference}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{requirement.requirement}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            Assigned to: {requirement.assignedTo}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Due: {formatDate(new Date(requirement.dueDate))}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{requirement.completeness}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all"
                            style={{ width: `${requirement.completeness}%` }}
                          />
                        </div>
                      </div>
                      <Badge className={statusColors[requirement.status]}>
                        {requirement.status === 'complete' && 'Complete'}
                        {requirement.status === 'in-progress' && 'In Progress'}
                        {requirement.status === 'not-started' && 'Not Started'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Materiality Assessment Tab */}
        <TabsContent value="materiality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Double Materiality Matrix</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <Radar
                  data={{
                    labels: materialityTopics.map(t => t.topic),
                    datasets: [
                      {
                        label: 'Impact Materiality',
                        data: materialityTopics.map(t => t.impactMateriality),
                        backgroundColor: 'rgba(0, 188, 125, 0.2)',
                        borderColor: '#00bc7d',
                        borderWidth: 2,
                      },
                      {
                        label: 'Financial Materiality',
                        data: materialityTopics.map(t => t.financialMateriality),
                        backgroundColor: 'rgba(0, 150, 137, 0.2)',
                        borderColor: '#009689',
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={radarChartOptions}
                />
              </div>
            </Card>

            <Card className="p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Material Topics Assessment</h3>
              <div className="space-y-4">
                {materialityTopics.map((topic, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{topic.topic}</span>
                      <Badge
                        className={
                          topic.overallMateriality === 'high'
                            ? 'bg-destructive-subtle text-destructive border-destructive/25'
                            : topic.overallMateriality === 'medium'
                            ? 'bg-warning-subtle text-warning border-warning/25'
                            : 'bg-muted text-foreground border-border'
                        }
                      >
                        {topic.overallMateriality.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{topic.esrsRequirement}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Impact Materiality</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-500"
                              style={{ width: `${topic.impactMateriality}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            {topic.impactMateriality}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Financial Materiality</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-600"
                              style={{ width: `${topic.financialMateriality}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground">
                            {topic.financialMateriality}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Targets & Progress Tab */}
        <TabsContent value="targets" className="space-y-4">
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Scope 3 Category 7 - Emissions vs CSRD Targets
              </h3>
              <Badge className="bg-info-subtle text-info border-info/25">
                <Target className="h-3 w-3 mr-1" />
                56% reduction by 2030
              </Badge>
            </div>

            <div style={{ height: '400px', width: '100%' }}>
              <Line
                data={{
                  labels: emissionsVsTargets.map(d => d.year),
                  datasets: [
                    {
                      label: 'Actual Emissions',
                      data: emissionsVsTargets.map(d => d.actual),
                      borderColor: '#101828',
                      borderWidth: 2,
                      fill: false,
                    },
                    {
                      label: 'Business as Usual',
                      data: emissionsVsTargets.map(d => d.target),
                      borderColor: '#6a7282',
                      borderWidth: 2,
                      borderDash: [5, 5],
                      fill: false,
                    },
                    {
                      label: 'CSRD Aligned Target',
                      data: emissionsVsTargets.map(d => d.csrdTarget),
                      borderColor: '#00bc7d',
                      borderWidth: 2,
                      fill: false,
                    },
                  ],
                }}
                options={lineChartOptions}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-background-subtle rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-foreground">2026 Performance</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {formatEmissions(2180)}
                </p>
                <p className="text-xs text-success mt-1">7% below CSRD target</p>
              </div>

              <div className="p-4 bg-background-subtle rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-brand-500" />
                  <span className="text-sm font-medium text-foreground">2030 Target</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {formatEmissions(1254)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">56% reduction vs 2023</p>
              </div>

              <div className="p-4 bg-background-subtle rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-4 w-4 text-info" />
                  <span className="text-sm font-medium text-foreground">Carbon Budget</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">
                  {formatCurrency(2450000, 'EUR')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Investment required</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Progress Timeline</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <Bar
                data={{
                  labels: complianceTimeline.map(d => d.month),
                  datasets: [
                    {
                      label: 'Completed',
                      data: complianceTimeline.map(d => d.completed),
                      backgroundColor: '#00bc7d',
                      borderRadius: 6,
                    },
                    {
                      label: 'Planned',
                      data: complianceTimeline.map(d => d.planned),
                      backgroundColor: '#009689',
                      borderRadius: 6,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Key Milestones</h3>
            <div className="space-y-4">
              {[
                { date: '2026-03-31', milestone: 'Q1 2026 CSRD Data Collection Complete', status: 'complete' },
                { date: '2026-04-30', milestone: 'GHG Target Setting Complete (ESRS E1-6)', status: 'complete' },
                { date: '2026-05-31', milestone: 'Materiality Assessment Review', status: 'in-progress' },
                { date: '2026-06-30', milestone: 'Transition Plan Finalization', status: 'in-progress' },
                { date: '2026-07-31', milestone: 'Limited Assurance Audit', status: 'not-started' },
                { date: '2026-12-31', milestone: 'FY2026 CSRD Sustainability Report', status: 'not-started' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {item.status === 'complete' && (
                      <div className="w-10 h-10 bg-success-subtle rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-success" />
                      </div>
                    )}
                    {item.status === 'in-progress' && (
                      <div className="w-10 h-10 bg-info-subtle rounded-full flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-info" />
                      </div>
                    )}
                    {item.status === 'not-started' && (
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.milestone}</p>
                    <p className="text-sm text-muted-foreground">Target: {formatDate(new Date(item.date))}</p>
                  </div>
                  <Badge
                    className={
                      item.status === 'complete'
                        ? 'bg-success-subtle text-success border-success/25'
                        : item.status === 'in-progress'
                        ? 'bg-info-subtle text-info border-info/25'
                        : 'bg-muted text-foreground border-border'
                    }
                  >
                    {item.status === 'complete' && 'Complete'}
                    {item.status === 'in-progress' && 'In Progress'}
                    {item.status === 'not-started' && 'Planned'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Requirement Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedRequirement?.category}
            </DialogTitle>
            <DialogDescription>
              {selectedRequirement?.esrsReference} - Detailed Information
            </DialogDescription>
          </DialogHeader>
          {selectedRequirement && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-sm font-medium text-foreground">Requirement</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedRequirement.requirement}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Status</Label>
                  <Badge className={`${statusColors[selectedRequirement.status]} mt-1`}>
                    {selectedRequirement.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Completeness</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRequirement.completeness}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Assigned To</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedRequirement.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Due Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(new Date(selectedRequirement.dueDate))}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-info">ESRS Reference</p>
                    <p className="text-sm text-info mt-1">
                      This requirement aligns with {selectedRequirement.esrsReference} of the European Sustainability
                      Reporting Standards (ESRS) under the Corporate Sustainability Reporting Directive (CSRD).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}