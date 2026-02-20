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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

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
    'complete': 'bg-green-100 text-green-700 border-green-200',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'not-started': 'bg-gray-100 text-gray-700 border-gray-200',
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
          <h2 className="text-2xl font-semibold text-[#101828] mb-1" style={{ fontFamily: 'Kaisei Decol, serif' }}>
            CSRD/ESRS E1 Compliance
          </h2>
          <p className="text-sm text-[#6a7282]">
            Corporate Sustainability Reporting Directive - Scope 3 Category 7
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-[#00bc7d] to-[#009689] text-white border-none px-4 py-2 text-sm">
          🇪🇺 EU Regulation 2022/2464
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{overallCompleteness}%</span>
          </div>
          <p className="text-sm text-[#6a7282]">Overall Compliance</p>
          <p className="text-xs text-[#4a5565] mt-1">
            {completedRequirements} of {totalRequirements} requirements
          </p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{completedRequirements}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Requirements Complete</p>
          <p className="text-xs text-green-600 mt-1">+2 this month</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">
              {csrdRequirements.filter(r => r.status === 'in-progress').length}
            </span>
          </div>
          <p className="text-sm text-[#6a7282]">In Progress</p>
          <p className="text-xs text-[#4a5565] mt-1">Target: Jun 2026</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">92%</span>
          </div>
          <p className="text-sm text-[#6a7282]">Data Quality Score</p>
          <p className="text-xs text-green-600 mt-1">+5% vs last quarter</p>
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
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#101828]">ESRS E1 Requirements Tracker</h3>
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
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#00bc7d] transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(requirement)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <StatusIcon className="h-5 w-5 text-[#4a5565]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-[#101828]">{requirement.category}</span>
                          <Badge variant="outline" className="text-xs">
                            {requirement.esrsReference}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#6a7282]">{requirement.requirement}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-[#4a5565]">
                            Assigned to: {requirement.assignedTo}
                          </span>
                          <span className="text-xs text-[#4a5565]">
                            Due: {formatDate(new Date(requirement.dueDate))}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#6a7282]">Progress</span>
                          <span className="font-medium text-[#101828]">{requirement.completeness}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#00bc7d] to-[#009689] transition-all"
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
            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">Double Materiality Matrix</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={materialityTopics}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="topic" tick={{ fontSize: 12, fill: '#6a7282' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Radar
                    name="Impact Materiality"
                    dataKey="impactMateriality"
                    stroke="#00bc7d"
                    fill="#00bc7d"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Financial Materiality"
                    dataKey="financialMateriality"
                    stroke="#009689"
                    fill="#009689"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">Material Topics Assessment</h3>
              <div className="space-y-4">
                {materialityTopics.map((topic, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#101828]">{topic.topic}</span>
                      <Badge
                        className={
                          topic.overallMateriality === 'high'
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : topic.overallMateriality === 'medium'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }
                      >
                        {topic.overallMateriality.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#6a7282] mb-3">{topic.esrsRequirement}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-[#6a7282] mb-1">Impact Materiality</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#00bc7d]"
                              style={{ width: `${topic.impactMateriality}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-[#101828]">
                            {topic.impactMateriality}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6a7282] mb-1">Financial Materiality</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#009689]"
                              style={{ width: `${topic.financialMateriality}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-[#101828]">
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
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#101828]">
                Scope 3 Category 7 - Emissions vs CSRD Targets
              </h3>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                <Target className="h-3 w-3 mr-1" />
                56% reduction by 2030
              </Badge>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={emissionsVsTargets}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#6a7282' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6a7282' }} label={{ value: 'tonnes CO₂e', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#101828"
                  strokeWidth={2}
                  name="Actual Emissions"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#6a7282"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Business as Usual"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="csrdTarget"
                  stroke="#00bc7d"
                  strokeWidth={2}
                  name="CSRD Aligned Target"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-[#101828]">2026 Performance</span>
                </div>
                <p className="text-2xl font-semibold text-[#101828]">
                  {formatEmissions(2180)}
                </p>
                <p className="text-xs text-green-600 mt-1">7% below CSRD target</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-[#00bc7d]" />
                  <span className="text-sm font-medium text-[#101828]">2030 Target</span>
                </div>
                <p className="text-2xl font-semibold text-[#101828]">
                  {formatEmissions(1254)}
                </p>
                <p className="text-xs text-[#6a7282] mt-1">56% reduction vs 2023</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-[#101828]">Carbon Budget</span>
                </div>
                <p className="text-2xl font-semibold text-[#101828]">
                  {formatCurrency(2450000, 'EUR')}
                </p>
                <p className="text-xs text-[#6a7282] mt-1">Investment required</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#101828] mb-4">Compliance Progress Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6a7282' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6a7282' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="completed" fill="#00bc7d" name="Completed" radius={[8, 8, 0, 0]} />
                <Bar dataKey="planned" fill="#009689" name="Planned" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#101828] mb-4">Key Milestones</h3>
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
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {item.status === 'complete' && (
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                    {item.status === 'in-progress' && (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    {item.status === 'not-started' && (
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#101828]">{item.milestone}</p>
                    <p className="text-sm text-[#6a7282]">Target: {formatDate(new Date(item.date))}</p>
                  </div>
                  <Badge
                    className={
                      item.status === 'complete'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : item.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
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
                <Label className="text-sm font-medium text-[#101828]">Requirement</Label>
                <p className="text-sm text-[#6a7282] mt-1">{selectedRequirement.requirement}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-[#101828]">Status</Label>
                  <Badge className={`${statusColors[selectedRequirement.status]} mt-1`}>
                    {selectedRequirement.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#101828]">Completeness</Label>
                  <p className="text-sm text-[#6a7282] mt-1">{selectedRequirement.completeness}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-[#101828]">Assigned To</Label>
                  <p className="text-sm text-[#6a7282] mt-1">{selectedRequirement.assignedTo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#101828]">Due Date</Label>
                  <p className="text-sm text-[#6a7282] mt-1">
                    {formatDate(new Date(selectedRequirement.dueDate))}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">ESRS Reference</p>
                    <p className="text-sm text-blue-700 mt-1">
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