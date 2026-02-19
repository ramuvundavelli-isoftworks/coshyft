import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
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
import {
  FileText,
  Download,
  Plus,
  Calendar,
  TrendingDown,
  Building2,
  CheckCircle,
  Clock,
  FileDown,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';

const mockReports = [
  {
    id: 'rep1',
    name: 'Q4 2026 CSRD Disclosure - Scope 3 Cat 7',
    type: 'CSRD',
    status: 'draft',
    period: 'Q4 2026',
    createdBy: 'Sarah Chen',
    lastModified: '2026-02-18',
    emissions: 715.2,
  },
  {
    id: 'rep2',
    name: '2026 Annual GHG Report',
    type: 'GHG Protocol',
    status: 'final',
    period: '2026',
    createdBy: 'Mike Johnson',
    lastModified: '2026-02-15',
    emissions: 2850,
  },
  {
    id: 'rep3',
    name: 'CDP Climate Change Response 2026',
    type: 'CDP',
    status: 'submitted',
    period: '2026',
    createdBy: 'Lisa Wong',
    lastModified: '2026-02-10',
    emissions: 2850,
  },
];

const templates = [
  { id: 't1', name: 'CSRD ESRS E1 - Employee Commuting', framework: 'CSRD' },
  { id: 't2', name: 'GHG Protocol Corporate Standard', framework: 'GHG Protocol' },
  { id: 't3', name: 'CDP Climate Change Questionnaire', framework: 'CDP' },
  { id: 't4', name: 'ISO 14064-1 Inventory Report', framework: 'ISO' },
  { id: 't5', name: 'TCFD Disclosure', framework: 'TCFD' },
];

export default function ReportBuilder() {
  const [reports, setReports] = useState(mockReports);
  const [typeFilter, setTypeFilter] = useState('all');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    framework: 'CSRD',
    startDate: '',
    endDate: '',
    sections: {
      executiveSummary: true,
      methodology: true,
      emissions: true,
      trends: true,
      initiatives: true,
      targets: true,
      assurance: false,
    },
    format: 'pdf',
    includeCharts: true,
    includeDataTables: true,
  });

  const filteredReports = reports.filter(r => 
    typeFilter === 'all' || r.type === typeFilter
  );

  const handleGenerateReport = () => {
    const sections = Object.entries(formData.sections)
      .filter(([, included]) => included)
      .map(([name]) => name);

    const newReport = {
      id: `rep-${Date.now()}`,
      name: formData.name,
      type: formData.framework,
      status: 'draft',
      period: `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`,
      createdBy: 'Current User',
      lastModified: new Date().toISOString().split('T')[0],
      emissions: 2847,
    };

    setReports([newReport, ...reports]);
    setIsGenerateDialogOpen(false);
    resetForm();
    toast.success('Report generated successfully');
  };

  const handleExport = () => {
    if (selectedReport) {
      // Simulate export
      toast.success(`Exporting ${selectedReport.name} as ${formData.format.toUpperCase()}`);
      setIsExportDialogOpen(false);
    }
  };

  const handleSchedule = () => {
    if (selectedReport) {
      toast.success('Report scheduled successfully');
      setIsScheduleDialogOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      framework: 'CSRD',
      startDate: '',
      endDate: '',
      sections: {
        executiveSummary: true,
        methodology: true,
        emissions: true,
        trends: true,
        initiatives: true,
        targets: true,
        assurance: false,
      },
      format: 'pdf',
      includeCharts: true,
      includeDataTables: true,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-700">Draft</Badge>;
      case 'final':
        return <Badge className="bg-green-100 text-green-700">Final</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700">Submitted</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Builder</h1>
          <p className="text-gray-600 mt-1">
            Generate compliance reports (CSRD, GRI, CDP, TCFD)
          </p>
        </div>
        <Button onClick={() => setIsGenerateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Draft Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Final Reports</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'final').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'submitted').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => {
                setFormData({ ...formData, framework: template.framework, name: template.name });
                setIsGenerateDialogOpen(true);
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <Badge variant="outline">{template.framework}</Badge>
              </div>
              <p className="font-medium text-gray-900 text-sm">{template.name}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Reports List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Generated Reports</h3>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frameworks</SelectItem>
              <SelectItem value="CSRD">CSRD</SelectItem>
              <SelectItem value="GHG Protocol">GHG Protocol</SelectItem>
              <SelectItem value="CDP">CDP</SelectItem>
              <SelectItem value="ISO">ISO</SelectItem>
              <SelectItem value="TCFD">TCFD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-start gap-4 flex-1">
                <FileText className="h-5 w-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{report.name}</p>
                    {getStatusBadge(report.status)}
                    <Badge variant="outline" className="text-xs">{report.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      {report.emissions.toLocaleString()} tCO₂e
                    </span>
                    <span>Modified: {new Date(report.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedReport(report);
                    setIsExportDialogOpen(true);
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedReport(report);
                    setIsScheduleDialogOpen(true);
                  }}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Generate Compliance Report</DialogTitle>
            <DialogDescription>
              Configure report parameters and select included sections
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="report-name">Report Name *</Label>
              <Input
                id="report-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Q1 2026 CSRD Disclosure"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="framework">Reporting Framework *</Label>
                <Select
                  value={formData.framework}
                  onValueChange={(value) => setFormData({ ...formData, framework: value })}
                >
                  <SelectTrigger id="framework">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSRD">CSRD / ESRS E1</SelectItem>
                    <SelectItem value="GHG Protocol">GHG Protocol</SelectItem>
                    <SelectItem value="CDP">CDP Climate</SelectItem>
                    <SelectItem value="ISO">ISO 14064-1</SelectItem>
                    <SelectItem value="TCFD">TCFD</SelectItem>
                    <SelectItem value="GRI">GRI Standards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="format">Export Format *</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => setFormData({ ...formData, format: value })}
                >
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="word">Word</SelectItem>
                    <SelectItem value="json">JSON (API)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date *</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Report Sections *</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="exec-summary"
                    checked={formData.sections.executiveSummary}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        sections: { ...formData.sections, executiveSummary: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="exec-summary" className="cursor-pointer">Executive Summary</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="methodology"
                    checked={formData.sections.methodology}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        sections: { ...formData.sections, methodology: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="methodology" className="cursor-pointer">Methodology</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="emissions"
                    checked={formData.sections.emissions}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        sections: { ...formData.sections, emissions: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="emissions" className="cursor-pointer">Emissions Data</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="trends"
                    checked={formData.sections.trends}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        sections: { ...formData.sections, trends: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="trends" className="cursor-pointer">Trends & Analysis</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="initiatives"
                    checked={formData.sections.initiatives}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        sections: { ...formData.sections, initiatives: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="initiatives" className="cursor-pointer">Reduction Initiatives</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="targets"
                    checked={formData.sections.targets}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        sections: { ...formData.sections, targets: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="targets" className="cursor-pointer">Targets & Progress</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="assurance"
                    checked={formData.sections.assurance}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        sections: { ...formData.sections, assurance: checked as boolean },
                      })
                    }
                  />
                  <Label htmlFor="assurance" className="cursor-pointer">Assurance Statement</Label>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="charts"
                  checked={formData.includeCharts}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeCharts: checked as boolean })}
                />
                <Label htmlFor="charts" className="cursor-pointer">Include Charts & Visualizations</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="tables"
                  checked={formData.includeDataTables}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeDataTables: checked as boolean })}
                />
                <Label htmlFor="tables" className="cursor-pointer">Include Data Tables</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={!formData.name || !formData.startDate || !formData.endDate}
            >
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Report</DialogTitle>
            <DialogDescription>
              Choose format and export options for "{selectedReport?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="export-format">Export Format *</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => setFormData({ ...formData, format: value })}
              >
                <SelectTrigger id="export-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="word">Word Document</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                  <SelectItem value="csv">CSV Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="export-charts"
                  checked={formData.includeCharts}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeCharts: checked as boolean })}
                />
                <Label htmlFor="export-charts" className="cursor-pointer">Include Charts</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="export-tables"
                  checked={formData.includeDataTables}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeDataTables: checked as boolean })}
                />
                <Label htmlFor="export-tables" className="cursor-pointer">Include Data Tables</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Report Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Automated Report</DialogTitle>
            <DialogDescription>
              Set up recurring report generation for "{selectedReport?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="frequency">Frequency *</Label>
              <Select defaultValue="monthly">
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="recipients">Email Recipients *</Label>
              <Input
                id="recipients"
                placeholder="email@example.com, email2@example.com"
              />
            </div>
            <div>
              <Label htmlFor="next-run">Next Run Date *</Label>
              <Input id="next-run" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule}>
              Schedule Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
