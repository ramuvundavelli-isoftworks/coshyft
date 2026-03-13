import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { FileText, Plus, Download, Eye, MessageCircle, CheckCircle, PenTool } from 'lucide-react';
import { toast } from 'sonner';

interface AuditReport {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'review' | 'signed' | 'distributed';
  date: string;
  findings: number;
}

const reports: AuditReport[] = [
  { id: 'ar1', name: 'Q1 2026 Audit Report', type: 'Quarterly', status: 'signed', date: '2026-04-15', findings: 3 },
  { id: 'ar2', name: 'Baseline Verification Report', type: 'Baseline', status: 'distributed', date: '2026-02-28', findings: 1 },
  { id: 'ar3', name: 'Mid-Year Review 2026', type: 'Mid-Year', status: 'review', date: '2026-07-01', findings: 5 },
  { id: 'ar4', name: 'Factor Validation Report', type: 'Factors', status: 'draft', date: '2026-08-10', findings: 2 },
];

export default function AuditorReports() {
  const [auditReports, setAuditReports] = useState<AuditReport[]>(reports);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isSignOffDialogOpen, setIsSignOffDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');

  const handleGenerateReport = () => {
    const newReport: AuditReport = {
      id: `ar-${Date.now()}`,
      name: reportName,
      type: reportType,
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      findings: 0,
    };
    setAuditReports([...auditReports, newReport]);
    setIsGenerateDialogOpen(false);
    setReportName('');
    setReportType('');
    toast.success('Audit report generated');
  };

  const handleAddResponse = () => {
    toast.success('Management response added');
    setIsResponseDialogOpen(false);
  };

  const handleSignOff = () => {
    if (selectedReport) {
      const updated = auditReports.map(r =>
        r.id === selectedReport.id ? { ...r, status: 'signed' as const } : r
      );
      setAuditReports(updated);
      setIsSignOffDialogOpen(false);
      toast.success('Report signed off successfully');
    }
  };

  const handleExport = () => {
    toast.success('Exporting final audit report...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Reports</h1>
          <p className="text-gray-600 mt-1">Generate and manage audit reports</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsResponseDialogOpen(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Response
          </Button>
          <Button onClick={() => setIsGenerateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{auditReports.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <PenTool className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Draft</p>
              <p className="text-2xl font-bold text-yellow-600">
                {auditReports.filter(r => r.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Signed Off</p>
              <p className="text-2xl font-bold text-green-600">
                {auditReports.filter(r => r.status === 'signed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Distributed</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditReports.filter(r => r.status === 'distributed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Audit Reports</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Findings</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.name}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.findings}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      report.status === 'distributed'
                        ? 'bg-purple-100 text-purple-700'
                        : report.status === 'signed'
                        ? 'bg-green-100 text-green-700'
                        : report.status === 'review'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setIsViewDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {report.status === 'review' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report);
                          setIsSignOffDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Sign Off
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report);
                        setIsExportDialogOpen(true);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Audit Report</DialogTitle>
            <DialogDescription>Create new audit report</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="report-name">Report Name *</Label>
              <Input
                id="report-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g., Q2 2026 Audit Report"
              />
            </div>
            <div>
              <Label htmlFor="report-type">Report Type *</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="mid-year">Mid-Year</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="factors">Factors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerateReport} disabled={!reportName || !reportType}>
              <Plus className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>{selectedReport?.name}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Type</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedReport.type}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Date</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedReport.date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Findings</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedReport.findings}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedReport.status}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Management Response Dialog */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Management Response</DialogTitle>
            <DialogDescription>Document management's response to findings</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="response">Management Response *</Label>
            <Textarea
              id="response"
              placeholder="Enter management's response to audit findings..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddResponse}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Add Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sign Off Dialog */}
      <Dialog open={isSignOffDialogOpen} onOpenChange={setIsSignOffDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign Off Report</DialogTitle>
            <DialogDescription>Provide final audit sign-off for {selectedReport?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                <strong>Report:</strong> {selectedReport?.name}
              </p>
              <p className="text-sm text-blue-900">
                <strong>Findings:</strong> {selectedReport?.findings}
              </p>
              <p className="text-sm text-blue-700 mt-2">
                By signing off, you confirm this report is complete and accurate.
              </p>
            </div>
            <Label htmlFor="signoff-comments">Sign-off Comments *</Label>
            <Textarea
              id="signoff-comments"
              placeholder="Add final comments..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSignOffDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSignOff}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Sign Off
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Final Report</DialogTitle>
            <DialogDescription>Download {selectedReport?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
            <Select defaultValue="pdf">
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="word">Word Document</SelectItem>
                <SelectItem value="excel">Excel Workbook</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Report includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Executive summary</li>
                <li>Audit findings</li>
                <li>Management responses</li>
                <li>Sign-off documentation</li>
              </ul>
            </div>
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
