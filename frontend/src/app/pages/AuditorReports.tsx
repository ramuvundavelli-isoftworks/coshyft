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
import { useApi, auditorApi } from '../api';

interface AuditReport {
  id: string;
  name: string;
  type: string;
  status: 'draft' | 'review' | 'signed' | 'distributed';
  date: string;
  findings: number;
}

export default function AuditorReports() {
  const { data: reportsResponse, refetch: refetchReports } = useApi(() => auditorApi.getAuditReports());
  const apiReports: AuditReport[] = ((reportsResponse as any)?.data || []).map((r: any) => ({
    id: r.id,
    name: r.title,
    type: r.report_type || 'audit',
    status: r.status === 'ready' ? 'signed' : r.status || 'draft',
    date: r.created_at?.split('T')[0] || '',
    findings: r.parameters?.findings_count || 0,
  }));
  const [auditReports, setAuditReports] = useState<AuditReport[]>([]);
  React.useEffect(() => {
    if (apiReports.length > 0) setAuditReports(apiReports);
  }, [reportsResponse]);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [isSignOffDialogOpen, setIsSignOffDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('');

  const handleGenerateReport = async () => {
    const result = await auditorApi.createAuditReport({
      title: reportName,
      reporting_year: new Date().getFullYear(),
      overall_opinion: 'limited_assurance',
    });
    if (result.success) {
      refetchReports();
      setIsGenerateDialogOpen(false);
      setReportName('');
      setReportType('');
      toast.success('Audit report generated');
    } else {
      toast.error(result.error?.message || 'Failed to generate report');
    }
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
          <h1 className="text-3xl font-bold text-foreground">Audit Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and manage audit reports</p>
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
            <div className="p-2 bg-info-subtle rounded-lg">
              <FileText className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reports</p>
              <p className="text-2xl font-bold text-foreground">{auditReports.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <PenTool className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Draft</p>
              <p className="text-2xl font-bold text-warning">
                {auditReports.filter(r => r.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Signed Off</p>
              <p className="text-2xl font-bold text-success">
                {auditReports.filter(r => r.status === 'signed').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <FileText className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distributed</p>
              <p className="text-2xl font-bold text-foreground">
                {auditReports.filter(r => r.status === 'distributed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Audit Reports</h3>
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
                        ? 'bg-info-subtle text-info'
                        : report.status === 'signed'
                        ? 'bg-success-subtle text-success'
                        : report.status === 'review'
                        ? 'bg-info-subtle text-info'
                        : 'bg-muted text-foreground'
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
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <p className="font-medium text-foreground mt-1">{selectedReport.type}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <p className="font-medium text-foreground mt-1">{selectedReport.date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Findings</Label>
                  <p className="font-medium text-foreground mt-1">{selectedReport.findings}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p className="font-medium text-foreground mt-1">{selectedReport.status}</p>
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
            <div className="p-4 bg-info-subtle border border-info/25 rounded-lg mb-4">
              <p className="text-sm text-info">
                <strong>Report:</strong> {selectedReport?.name}
              </p>
              <p className="text-sm text-info">
                <strong>Findings:</strong> {selectedReport?.findings}
              </p>
              <p className="text-sm text-info mt-2">
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
            <div className="mt-4 p-4 bg-background-subtle border rounded-lg">
              <p className="text-sm text-foreground font-medium mb-2">Report includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
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
