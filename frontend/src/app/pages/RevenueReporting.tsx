// Revenue Commissioners Reporting Module
// Irish tax compliance reporting for TaxSaver, Bike-to-Work, and EV incentive schemes

import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  FileText,
  Download,
  Calendar,
  Euro,
  Users,
  CheckCircle,
  AlertCircle,
  Building2,
  Bike,
  Bus,
  Zap,
  Send,
  Eye,
} from 'lucide-react';
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
import { toast } from 'sonner';
import { formatCurrency, formatNumber } from '../utils/localization';

interface RevenueReport {
  id: string;
  reportType: 'taxsaver' | 'bike-to-work' | 'ev-incentive' | 'annual-summary';
  reportName: string;
  taxYear: number;
  filingPeriod: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  submittedDate?: string;
  totalValue: number;
  participantCount: number;
  revenueReference?: string;
}

interface BenefitRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  ppsNumber: string;
  benefitType: 'taxsaver' | 'bike-to-work' | 'ev-incentive';
  annualValue: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
}

const mockReports: RevenueReport[] = [
  {
    id: 'rev_2026_q1',
    reportType: 'taxsaver',
    reportName: 'TaxSaver Scheme - Q1 2026',
    taxYear: 2026,
    filingPeriod: 'Q1 2026',
    status: 'submitted',
    submittedDate: '2026-04-15',
    totalValue: 41300,
    participantCount: 182,
    revenueReference: 'TS-2026-Q1-00456789',
  },
  {
    id: 'rev_2025_annual',
    reportType: 'annual-summary',
    reportName: 'Annual Benefits Summary 2025',
    taxYear: 2025,
    filingPeriod: 'Annual 2025',
    status: 'accepted',
    submittedDate: '2026-01-31',
    totalValue: 148200,
    participantCount: 347,
    revenueReference: 'ABS-2025-00456789',
  },
  {
    id: 'rev_2026_bike',
    reportType: 'bike-to-work',
    reportName: 'Bike-to-Work Scheme - 2026',
    taxYear: 2026,
    filingPeriod: 'Jan-Feb 2026',
    status: 'draft',
    totalValue: 34200,
    participantCount: 127,
  },
  {
    id: 'rev_2025_ev',
    reportType: 'ev-incentive',
    reportName: 'EV Incentive Scheme - 2025',
    taxYear: 2025,
    filingPeriod: 'Annual 2025',
    status: 'accepted',
    submittedDate: '2026-02-10',
    totalValue: 12400,
    participantCount: 24,
    revenueReference: 'EVI-2025-00456789',
  },
];

const mockBenefits: BenefitRecord[] = [
  {
    id: 'ben_001',
    employeeId: 'EMP-2456',
    employeeName: 'Sarah Johnson',
    ppsNumber: '1234567T',
    benefitType: 'taxsaver',
    annualValue: 1500,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
  },
  {
    id: 'ben_002',
    employeeId: 'EMP-2457',
    employeeName: 'Michael O\'Brien',
    ppsNumber: '2345678W',
    benefitType: 'bike-to-work',
    annualValue: 1250,
    startDate: '2026-02-15',
    endDate: '2027-02-14',
    status: 'active',
  },
  {
    id: 'ben_003',
    employeeId: 'EMP-2458',
    employeeName: 'Emma Murphy',
    ppsNumber: '3456789A',
    benefitType: 'taxsaver',
    annualValue: 1200,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
  },
];

export default function RevenueReporting() {
  const [reports, setReports] = useState<RevenueReport[]>(mockReports);
  const [benefits, setBenefits] = useState<BenefitRecord[]>(mockBenefits);
  const [selectedReport, setSelectedReport] = useState<RevenueReport | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [generateFormData, setGenerateFormData] = useState({
    reportType: 'taxsaver' as 'taxsaver' | 'bike-to-work' | 'ev-incentive' | 'annual-summary',
    taxYear: 2026,
    filingPeriod: 'Q2 2026',
  });

  const totalSubmitted = reports.filter((r) => r.status === 'submitted' || r.status === 'accepted').length;
  const totalAccepted = reports.filter((r) => r.status === 'accepted').length;
  const totalValue2026 = reports.filter((r) => r.taxYear === 2026).reduce((sum, r) => sum + r.totalValue, 0);
  const activeBenefits = benefits.filter((b) => b.status === 'active').length;

  const handleViewReport = (report: RevenueReport) => {
    setSelectedReport(report);
    setIsViewDialogOpen(true);
  };

  const handleSubmitReport = () => {
    if (selectedReport) {
      const updated = reports.map((r) =>
        r.id === selectedReport.id
          ? {
              ...r,
              status: 'submitted' as const,
              submittedDate: new Date().toISOString().split('T')[0],
              revenueReference: `${r.reportType.toUpperCase()}-${r.taxYear}-Q${Math.floor(Math.random() * 4) + 1}-00${Math.floor(Math.random() * 900000 + 100000)}`,
            }
          : r
      );
      setReports(updated);
      setIsSubmitDialogOpen(false);
      toast.success('Report submitted to Revenue Commissioners');
    }
  };

  const handleGenerateReport = () => {
    const newReport: RevenueReport = {
      id: `rev_${Date.now()}`,
      reportType: generateFormData.reportType,
      reportName: `${getReportTypeName(generateFormData.reportType)} - ${generateFormData.filingPeriod}`,
      taxYear: generateFormData.taxYear,
      filingPeriod: generateFormData.filingPeriod,
      status: 'draft',
      totalValue: Math.floor(Math.random() * 50000 + 10000),
      participantCount: Math.floor(Math.random() * 200 + 50),
    };
    setReports([...reports, newReport]);
    setIsGenerateDialogOpen(false);
    toast.success('Revenue report generated successfully');
  };

  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'taxsaver':
        return 'TaxSaver Scheme';
      case 'bike-to-work':
        return 'Bike-to-Work Scheme';
      case 'ev-incentive':
        return 'EV Incentive Scheme';
      case 'annual-summary':
        return 'Annual Benefits Summary';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case 'taxsaver':
        return Bus;
      case 'bike-to-work':
        return Bike;
      case 'ev-incentive':
        return Zap;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Commissioners Reporting</h1>
          <p className="text-gray-600 mt-1">
            Irish tax compliance for workplace benefit schemes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button onClick={() => setIsGenerateDialogOpen(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{reports.length}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Total Reports</p>
          <p className="text-xs text-[#4a5565] mt-1">All tax years</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{totalAccepted}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Accepted by Revenue</p>
          <p className="text-xs text-green-600 mt-1">Compliant</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Euro className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">
              {formatCurrency(totalValue2026, 'EUR')}
            </span>
          </div>
          <p className="text-sm text-[#6a7282]">Total Benefit Value</p>
          <p className="text-xs text-[#4a5565] mt-1">Tax year 2026</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{activeBenefits}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Active Participants</p>
          <p className="text-xs text-[#4a5565] mt-1">Current schemes</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Revenue Reports</TabsTrigger>
          <TabsTrigger value="benefits">Benefit Records</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Guide</TabsTrigger>
        </TabsList>

        {/* Revenue Reports Tab */}
        <TabsContent value="reports" className="space-y-4 mt-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#101828] mb-4">Submitted Reports</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Tax Year</TableHead>
                  <TableHead>Filing Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Revenue Ref</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{report.reportName}</TableCell>
                    <TableCell>{report.taxYear}</TableCell>
                    <TableCell className="text-sm text-[#6a7282]">{report.filingPeriod}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                    </TableCell>
                    <TableCell>{formatNumber(report.participantCount)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(report.totalValue, 'EUR')}
                    </TableCell>
                    <TableCell className="text-xs text-[#6a7282] font-mono">
                      {report.revenueReference || '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {report.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReport(report);
                              setIsSubmitDialogOpen(true);
                            }}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Benefit Records Tab */}
        <TabsContent value="benefits" className="space-y-4 mt-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#101828] mb-4">Employee Benefit Records</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>PPS Number</TableHead>
                  <TableHead>Benefit Type</TableHead>
                  <TableHead>Annual Value</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benefits.map((benefit) => {
                  const BenefitIcon = getBenefitIcon(benefit.benefitType);
                  return (
                    <TableRow key={benefit.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{benefit.employeeName}</TableCell>
                      <TableCell className="font-mono text-sm">{benefit.ppsNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BenefitIcon className="h-4 w-4 text-[#4a5565]" />
                          <span className="text-sm">{getReportTypeName(benefit.benefitType)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(benefit.annualValue, 'EUR')}
                      </TableCell>
                      <TableCell className="text-sm text-[#6a7282]">
                        {new Date(benefit.startDate).toLocaleDateString('en-IE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {new Date(benefit.endDate).toLocaleDateString('en-IE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            benefit.status === 'active'
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }
                        >
                          {benefit.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Compliance Guide Tab */}
        <TabsContent value="compliance" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">
                TaxSaver Commuter Scheme
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Annual Limit</p>
                    <p className="text-xs text-[#6a7282]">€1,500 per employee per tax year</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Eligible Services</p>
                    <p className="text-xs text-[#6a7282]">
                      Dublin Bus, Irish Rail, Luas, Bus Éireann, Go-Ahead Ireland
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Tax Treatment</p>
                    <p className="text-xs text-[#6a7282]">
                      Exempt from income tax, USC, and PRSI
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Reporting</p>
                    <p className="text-xs text-[#6a7282]">Quarterly submissions via ROS</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">
                Bike-to-Work Scheme
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Annual Limit</p>
                    <p className="text-xs text-[#6a7282]">€1,500 per employee (€3,000 for e-bikes)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Eligible Items</p>
                    <p className="text-xs text-[#6a7282]">
                      Bicycles, e-bikes, safety equipment (helmet, lights, locks)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Repayment Period</p>
                    <p className="text-xs text-[#6a7282]">Maximum 12 months via salary sacrifice</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Tax Treatment</p>
                    <p className="text-xs text-[#6a7282]">
                      Exempt from BIK (Benefit-in-Kind) taxation
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">
                EV Incentive Scheme
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Annual Limit</p>
                    <p className="text-xs text-[#6a7282]">€10,000 per employee for EV purchase support</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Eligible Vehicles</p>
                    <p className="text-xs text-[#6a7282]">
                      Battery Electric Vehicles (BEVs), Plug-in Hybrids (PHEVs)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Home Charging</p>
                    <p className="text-xs text-[#6a7282]">Up to €600 grant for home charging point</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Reporting</p>
                    <p className="text-xs text-[#6a7282]">Annual P11D equivalent declaration</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">
                Filing Requirements
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Quarterly Deadlines</p>
                    <p className="text-xs text-[#6a7282]">
                      Q1: 15 Apr, Q2: 15 Jul, Q3: 15 Oct, Q4: 31 Jan
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Submission Method</p>
                    <p className="text-xs text-[#6a7282]">
                      Electronic filing via Revenue Online Service (ROS)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Record Retention</p>
                    <p className="text-xs text-[#6a7282]">
                      Maintain records for 6 years after end of tax year
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Compliance</p>
                    <p className="text-xs text-[#6a7282]">
                      Late submissions may incur penalties up to €4,000
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Report Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#00bc7d]" />
              {selectedReport?.reportName}
            </DialogTitle>
            <DialogDescription>
              Tax year {selectedReport?.taxYear} - {selectedReport?.filingPeriod}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Status</p>
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status}
                  </Badge>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Participants</p>
                  <p className="text-xl font-semibold text-[#101828]">
                    {formatNumber(selectedReport.participantCount)}
                  </p>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Total Value</p>
                  <p className="text-xl font-semibold text-[#101828]">
                    {formatCurrency(selectedReport.totalValue, 'EUR')}
                  </p>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Revenue Reference</p>
                  <p className="text-sm font-mono text-[#101828]">
                    {selectedReport.revenueReference || 'Not assigned'}
                  </p>
                </Card>
              </div>

              {selectedReport.submittedDate && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Submitted to Revenue</p>
                      <p className="text-sm text-green-700 mt-1">
                        Submitted on{' '}
                        {new Date(selectedReport.submittedDate).toLocaleDateString('en-IE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Report Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit to Revenue Commissioners</DialogTitle>
            <DialogDescription>
              Submit this report via Revenue Online Service (ROS)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                This will submit <strong>{selectedReport?.reportName}</strong> to the Revenue
                Commissioners for tax year <strong>{selectedReport?.taxYear}</strong>.
              </p>
            </div>
            <div className="space-y-2 text-sm text-[#4a5565]">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Report data validated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>PPS numbers verified</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Benefit calculations confirmed</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitReport}>
              <Send className="h-4 w-4 mr-2" />
              Submit to Revenue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Revenue Report</DialogTitle>
            <DialogDescription>Create a new report for Revenue Commissioners</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="report-type">Report Type *</Label>
              <Select
                value={generateFormData.reportType}
                onValueChange={(value: any) =>
                  setGenerateFormData({ ...generateFormData, reportType: value })
                }
              >
                <SelectTrigger id="report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="taxsaver">TaxSaver Scheme</SelectItem>
                  <SelectItem value="bike-to-work">Bike-to-Work Scheme</SelectItem>
                  <SelectItem value="ev-incentive">EV Incentive Scheme</SelectItem>
                  <SelectItem value="annual-summary">Annual Benefits Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tax-year">Tax Year *</Label>
                <Select
                  value={String(generateFormData.taxYear)}
                  onValueChange={(value) =>
                    setGenerateFormData({ ...generateFormData, taxYear: parseInt(value) })
                  }
                >
                  <SelectTrigger id="tax-year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filing-period">Filing Period *</Label>
                <Input
                  id="filing-period"
                  value={generateFormData.filingPeriod}
                  onChange={(e) =>
                    setGenerateFormData({ ...generateFormData, filingPeriod: e.target.value })
                  }
                  placeholder="Q1 2026"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>Generate Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
