// EU Regulatory Reporting Component
// Phase 2: Europe & Ireland Alignment - European Compliance Reporting

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  FileText,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Shield,
  Globe,
  Info,
} from 'lucide-react';
import { formatDate, formatCurrency, formatEmissions } from '../utils/localization';
import { toast } from 'sonner';

interface EUReport {
  id: string;
  reportType: string;
  framework: string;
  period: string;
  dueDate: string;
  status: 'draft' | 'in-review' | 'submitted' | 'approved';
  submittedDate?: string;
  submittedBy?: string;
  approvedBy?: string;
  scope3Cat7Emissions: number;
  dataQuality: number;
  completeness: number;
}

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  jurisdiction: string;
  mandatory: boolean;
  deadline: string;
  status: 'compliant' | 'in-progress' | 'at-risk';
}

const euReports: EUReport[] = [
  {
    id: 'csrd_2026_h1',
    reportType: 'CSRD Sustainability Report',
    framework: 'EU CSRD (Directive 2022/2464)',
    period: 'H1 2026',
    dueDate: '2026-07-31',
    status: 'in-review',
    submittedDate: '2026-07-15',
    submittedBy: 'Emma Richardson',
    scope3Cat7Emissions: 2180,
    dataQuality: 94,
    completeness: 98,
  },
  {
    id: 'esrs_e1_2026_q2',
    reportType: 'ESRS E1 Climate Change Report',
    framework: 'ESRS E1 (Climate Change)',
    period: 'Q2 2026',
    dueDate: '2026-07-15',
    status: 'submitted',
    submittedDate: '2026-07-10',
    submittedBy: 'Michael Chen',
    approvedBy: 'Sarah Anderson',
    scope3Cat7Emissions: 1098,
    dataQuality: 96,
    completeness: 100,
  },
  {
    id: 'ie_epa_2026_q2',
    reportType: 'Irish EPA Emissions Report',
    framework: 'EPA Ireland Guidelines',
    period: 'Q2 2026',
    dueDate: '2026-07-20',
    status: 'approved',
    submittedDate: '2026-07-08',
    submittedBy: 'Emma Richardson',
    approvedBy: 'Irish EPA',
    scope3Cat7Emissions: 845,
    dataQuality: 98,
    completeness: 100,
  },
  {
    id: 'csrd_2025_fy',
    reportType: 'CSRD Annual Sustainability Statement',
    framework: 'EU CSRD (Directive 2022/2464)',
    period: 'FY 2025',
    dueDate: '2026-03-31',
    status: 'approved',
    submittedDate: '2026-03-25',
    submittedBy: 'Michael Chen',
    approvedBy: 'Board of Directors',
    scope3Cat7Emissions: 2420,
    dataQuality: 92,
    completeness: 100,
  },
];

const complianceFrameworks: ComplianceFramework[] = [
  {
    id: 'csrd',
    name: 'Corporate Sustainability Reporting Directive (CSRD)',
    description: 'EU Directive 2022/2464 - Mandatory sustainability reporting for large companies',
    jurisdiction: 'European Union',
    mandatory: true,
    deadline: '2026-12-31',
    status: 'in-progress',
  },
  {
    id: 'esrs',
    name: 'European Sustainability Reporting Standards (ESRS)',
    description: 'Technical standards for CSRD implementation, including ESRS E1 for climate',
    jurisdiction: 'European Union',
    mandatory: true,
    deadline: '2026-12-31',
    status: 'in-progress',
  },
  {
    id: 'eu_taxonomy',
    name: 'EU Taxonomy Regulation',
    description: 'Classification system for environmentally sustainable economic activities',
    jurisdiction: 'European Union',
    mandatory: true,
    deadline: 'Ongoing',
    status: 'compliant',
  },
  {
    id: 'ie_epa',
    name: 'Irish EPA Environmental Reporting',
    description: 'Irish Environmental Protection Agency emission reporting requirements',
    jurisdiction: 'Ireland',
    mandatory: true,
    deadline: 'Quarterly',
    status: 'compliant',
  },
  {
    id: 'ghg_protocol',
    name: 'GHG Protocol Scope 3 Standard',
    description: 'Global standard for accounting and reporting Scope 3 emissions',
    jurisdiction: 'Global (Applied in EU/IE)',
    mandatory: false,
    deadline: 'Voluntary',
    status: 'compliant',
  },
];

export default function EURegulatoryReporting() {
  const [selectedReport, setSelectedReport] = useState<EUReport | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const [generateForm, setGenerateForm] = useState({
    reportType: '',
    period: '',
    includeAssurance: false,
  });

  const handleViewReport = (report: EUReport) => {
    setSelectedReport(report);
    setIsReportDialogOpen(true);
  };

  const handleDownloadReport = (report: EUReport) => {
    toast.success(`Downloading ${report.reportType} for ${report.period}`);
  };

  const handleGenerateReport = () => {
    toast.success('Report generation initiated - this may take a few minutes');
    setIsGenerateDialogOpen(false);
    setGenerateForm({ reportType: '', period: '', includeAssurance: false });
  };

  const handleSubmitReport = () => {
    if (selectedReport) {
      toast.success(`${selectedReport.reportType} submitted successfully`);
      setIsSubmitDialogOpen(false);
    }
  };

  const statusColors = {
    draft: 'bg-muted text-foreground border-border',
    'in-review': 'bg-info-subtle text-info border-info/25',
    submitted: 'bg-warning-subtle text-warning border-warning/25',
    approved: 'bg-success-subtle text-success border-success/25',
  };

  const statusIcons = {
    draft: FileText,
    'in-review': Clock,
    submitted: Send,
    approved: CheckCircle,
  };

  const frameworkStatusColors = {
    compliant: 'bg-success-subtle text-success border-success/25',
    'in-progress': 'bg-info-subtle text-info border-info/25',
    'at-risk': 'bg-destructive-subtle text-destructive border-destructive/25',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1" style={{ fontFamily: 'Kaisei Decol, serif' }}>
            EU Regulatory Reporting
          </h2>
          <p className="text-sm text-muted-foreground">
            European and Irish compliance reporting for Scope 3 Category 7 emissions
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:opacity-90"
          onClick={() => setIsGenerateDialogOpen(true)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-success-subtle rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <span className="text-2xl font-semibold text-foreground">
              {euReports.filter(r => r.status === 'approved').length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Approved Reports</p>
          <p className="text-xs text-success mt-1">100% on-time submission</p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <span className="text-2xl font-semibold text-foreground">
              {euReports.filter(r => r.status === 'in-review' || r.status === 'submitted').length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-xs text-muted-foreground mt-1">On track for deadlines</p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Shield className="h-5 w-5 text-info" />
            </div>
            <span className="text-2xl font-semibold text-foreground">96%</span>
          </div>
          <p className="text-sm text-muted-foreground">Avg Data Quality</p>
          <p className="text-xs text-success mt-1">Audit-ready standard</p>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <Globe className="h-5 w-5 text-warning" />
            </div>
            <span className="text-2xl font-semibold text-foreground">
              {complianceFrameworks.filter(f => f.status === 'compliant').length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Frameworks Compliant</p>
          <p className="text-xs text-muted-foreground mt-1">of {complianceFrameworks.length} total</p>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Reports</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Type</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Emissions</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {euReports.map((report) => {
              const StatusIcon = statusIcons[report.status];
              return (
                <TableRow key={report.id} className="cursor-pointer hover:bg-background-subtle">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{report.reportType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {report.framework}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.period}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(new Date(report.dueDate))}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {formatEmissions(report.scope3Cat7Emissions)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden w-16">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-600"
                          style={{ width: `${report.dataQuality}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{report.dataQuality}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[report.status]}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {report.status === 'in-review' ? 'In Review' : report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReport(report)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Compliance Frameworks */}
      <Card className="p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Compliance Frameworks</h3>
        <div className="space-y-3">
          {complianceFrameworks.map((framework) => (
            <div
              key={framework.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2 bg-muted rounded-lg">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{framework.name}</span>
                    {framework.mandatory && (
                      <Badge variant="outline" className="text-xs bg-destructive-subtle text-destructive border-destructive/25">
                        Mandatory
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{framework.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3 inline mr-1" />
                      {framework.jurisdiction}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Deadline: {framework.deadline}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className={frameworkStatusColors[framework.status]}>
                {framework.status === 'in-progress' && 'In Progress'}
                {framework.status === 'compliant' && 'Compliant'}
                {framework.status === 'at-risk' && 'At Risk'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Report Details Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedReport?.reportType}</DialogTitle>
            <DialogDescription>{selectedReport?.framework}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Reporting Period</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReport.period}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-foreground">Due Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(new Date(selectedReport.dueDate))}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Scope 3 Cat 7 Emissions</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatEmissions(selectedReport.scope3Cat7Emissions)}
                  </p>
                </Card>
                <Card className="p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Data Quality Score</p>
                  <p className="text-xl font-semibold text-foreground">{selectedReport.dataQuality}%</p>
                </Card>
                <Card className="p-4 border border-border">
                  <p className="text-sm text-muted-foreground mb-1">Completeness</p>
                  <p className="text-xl font-semibold text-foreground">{selectedReport.completeness}%</p>
                </Card>
              </div>

              {selectedReport.submittedDate && (
                <div>
                  <Label className="text-sm font-medium text-foreground">Submission Details</Label>
                  <div className="mt-2 p-3 bg-background-subtle rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Submitted on {formatDate(new Date(selectedReport.submittedDate))} by{' '}
                      {selectedReport.submittedBy}
                    </p>
                    {selectedReport.approvedBy && (
                      <p className="text-sm text-success mt-1">
                        ✓ Approved by {selectedReport.approvedBy}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDownloadReport(selectedReport)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {selectedReport.status === 'draft' && (
                  <Button
                    className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white"
                    onClick={() => setIsSubmitDialogOpen(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Report
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>
              Create a new EU/Irish regulatory compliance report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={generateForm.reportType}
                onValueChange={(value) => setGenerateForm({ ...generateForm, reportType: value })}
              >
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csrd">CSRD Sustainability Report</SelectItem>
                  <SelectItem value="esrs_e1">ESRS E1 Climate Change Report</SelectItem>
                  <SelectItem value="ie_epa">Irish EPA Emissions Report</SelectItem>
                  <SelectItem value="ghg_protocol">GHG Protocol Scope 3 Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="period">Reporting Period</Label>
              <Select
                value={generateForm.period}
                onValueChange={(value) => setGenerateForm({ ...generateForm, period: value })}
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="q3_2026">Q3 2026</SelectItem>
                  <SelectItem value="h2_2026">H2 2026</SelectItem>
                  <SelectItem value="fy_2026">FY 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeAssurance"
                checked={generateForm.includeAssurance}
                onChange={(e) =>
                  setGenerateForm({ ...generateForm, includeAssurance: e.target.checked })
                }
                className="rounded border-border"
              />
              <Label htmlFor="includeAssurance" className="cursor-pointer">
                Include limited assurance statement
              </Label>
            </div>

            <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-info">Report Generation</p>
                  <p className="text-sm text-info mt-1">
                    The report will be generated based on current data and aligned with the selected regulatory
                    framework requirements. This process typically takes 2-3 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-brand-500 to-brand-600 text-white"
              onClick={handleGenerateReport}
              disabled={!generateForm.reportType || !generateForm.period}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Report Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Report</DialogTitle>
            <DialogDescription>
              Confirm submission of {selectedReport?.reportType}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-warning-subtle border border-warning/25 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-warning">Important</p>
                  <p className="text-sm text-warning mt-1">
                    Once submitted, this report will be locked and sent to the regulatory authorities.
                    Please ensure all data is accurate and complete before submitting.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-brand-500 to-brand-600 text-white"
              onClick={handleSubmitReport}
            >
              <Send className="h-4 w-4 mr-2" />
              Confirm Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
