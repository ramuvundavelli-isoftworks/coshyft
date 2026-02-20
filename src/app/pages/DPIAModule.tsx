// DPIA (Data Protection Impact Assessment) Module
// GDPR Article 35 Compliance for Employee Commuting Data

import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  Lock,
  Eye,
  Download,
  Plus,
  Edit,
  Trash2,
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

interface DPIA {
  id: string;
  name: string;
  processingActivity: string;
  dateCreated: string;
  lastReview: string;
  nextReview: string;
  status: 'draft' | 'in-review' | 'approved' | 'requires-update';
  riskLevel: 'low' | 'medium' | 'high';
  dpoApproved: boolean;
  dataTypes: string[];
  legalBasis: string;
}

interface Risk {
  id: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  residualRisk: 'low' | 'medium' | 'high';
  mitigation: string;
}

const mockDPIAs: DPIA[] = [
  {
    id: 'dpia_1',
    name: 'Employee Commuting Data Collection',
    processingActivity: 'Collection and processing of employee home addresses and commute patterns',
    dateCreated: '2025-06-15',
    lastReview: '2026-01-10',
    nextReview: '2026-07-10',
    status: 'approved',
    riskLevel: 'medium',
    dpoApproved: true,
    dataTypes: ['Personal addresses', 'Travel patterns', 'Location data'],
    legalBasis: 'Legitimate interest (CSRD compliance)',
  },
  {
    id: 'dpia_2',
    name: 'Carpooling Platform - Location Sharing',
    processingActivity: 'Real-time location sharing for carpooling matching',
    dateCreated: '2025-08-20',
    lastReview: '2026-02-01',
    nextReview: '2026-08-01',
    status: 'approved',
    riskLevel: 'high',
    dpoApproved: true,
    dataTypes: ['Real-time location', 'Travel routes', 'Personal contacts'],
    legalBasis: 'Consent',
  },
  {
    id: 'dpia_3',
    name: 'TaxSaver Scheme Administration',
    processingActivity: 'Processing of employee TaxSaver ticket applications',
    dateCreated: '2025-11-10',
    lastReview: '2026-02-05',
    nextReview: '2026-08-05',
    status: 'in-review',
    riskLevel: 'low',
    dpoApproved: false,
    dataTypes: ['PPS Number', 'Travel details', 'Financial data'],
    legalBasis: 'Legal obligation (Revenue Commissioners)',
  },
  {
    id: 'dpia_4',
    name: 'Emissions Reporting to EPA',
    processingActivity: 'Aggregated emissions reporting for regulatory compliance',
    dateCreated: '2026-01-05',
    lastReview: '2026-02-15',
    nextReview: '2026-08-15',
    status: 'draft',
    riskLevel: 'low',
    dpoApproved: false,
    dataTypes: ['Aggregated emissions data', 'Company-level statistics'],
    legalBasis: 'Legal obligation (CSRD/ESRS E1)',
  },
];

const mockRisks: Risk[] = [
  {
    id: 'r1',
    description: 'Unauthorized access to employee home addresses',
    likelihood: 'low',
    impact: 'high',
    residualRisk: 'low',
    mitigation: 'Role-based access control, encryption at rest, audit logging',
  },
  {
    id: 'r2',
    description: 'Tracking of employee movements beyond work commute',
    likelihood: 'medium',
    impact: 'high',
    residualRisk: 'low',
    mitigation: 'Purpose limitation, data minimization, clear consent mechanisms',
  },
  {
    id: 'r3',
    description: 'Data breach exposing carpooling participant details',
    likelihood: 'low',
    impact: 'high',
    residualRisk: 'low',
    mitigation: 'TLS encryption, pseudonymization, breach response plan',
  },
  {
    id: 'r4',
    description: 'Excessive data retention beyond legal requirements',
    likelihood: 'medium',
    impact: 'medium',
    residualRisk: 'low',
    mitigation: 'Automated data retention policies, regular purge schedules',
  },
];

export default function DPIAModule() {
  const [dpias, setDpias] = useState<DPIA[]>(mockDPIAs);
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [selectedDPIA, setSelectedDPIA] = useState<DPIA | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isRiskDialogOpen, setIsRiskDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    processingActivity: '',
    legalBasis: '',
    riskLevel: 'medium' as 'low' | 'medium' | 'high',
  });

  const approvedCount = dpias.filter((d) => d.status === 'approved').length;
  const highRiskCount = dpias.filter((d) => d.riskLevel === 'high').length;
  const dueForReview = dpias.filter((d) => {
    const nextReview = new Date(d.nextReview);
    const today = new Date();
    const daysUntilReview = Math.ceil((nextReview.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilReview <= 30;
  }).length;

  const handleCreateDPIA = () => {
    const newDPIA: DPIA = {
      id: `dpia_${Date.now()}`,
      name: formData.name,
      processingActivity: formData.processingActivity,
      dateCreated: new Date().toISOString().split('T')[0],
      lastReview: new Date().toISOString().split('T')[0],
      nextReview: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      riskLevel: formData.riskLevel,
      dpoApproved: false,
      dataTypes: [],
      legalBasis: formData.legalBasis,
    };
    setDpias([...dpias, newDPIA]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('DPIA created successfully');
  };

  const handleViewDPIA = (dpia: DPIA) => {
    setSelectedDPIA(dpia);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      processingActivity: '',
      legalBasis: '',
      riskLevel: 'medium',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-review':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'requires-update':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Data Protection Impact Assessments
          </h1>
          <p className="text-gray-600 mt-1">GDPR Article 35 compliance for employee data processing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New DPIA
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
            <span className="text-2xl font-semibold text-[#101828]">{dpias.length}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Total DPIAs</p>
          <p className="text-xs text-[#4a5565] mt-1">Active assessments</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{approvedCount}</span>
          </div>
          <p className="text-sm text-[#6a7282]">DPO Approved</p>
          <p className="text-xs text-green-600 mt-1">Compliant</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{highRiskCount}</span>
          </div>
          <p className="text-sm text-[#6a7282]">High Risk</p>
          <p className="text-xs text-red-600 mt-1">Requires attention</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Eye className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{dueForReview}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Due for Review</p>
          <p className="text-xs text-yellow-600 mt-1">Within 30 days</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="assessments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assessments">Active DPIAs</TabsTrigger>
          <TabsTrigger value="risks">Risk Register</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Overview</TabsTrigger>
        </TabsList>

        {/* Active DPIAs Tab */}
        <TabsContent value="assessments" className="space-y-4 mt-6">
          <Card className="p-6 border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DPIA Name</TableHead>
                  <TableHead>Processing Activity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Next Review</TableHead>
                  <TableHead>DPO Approval</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dpias.map((dpia) => (
                  <TableRow key={dpia.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{dpia.name}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-[#6a7282]">
                      {dpia.processingActivity}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(dpia.status)}>{dpia.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(dpia.riskLevel)}>{dpia.riskLevel}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#6a7282]">
                      {new Date(dpia.nextReview).toLocaleDateString('en-IE')}
                    </TableCell>
                    <TableCell>
                      {dpia.dpoApproved ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDPIA(dpia)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Risk Register Tab */}
        <TabsContent value="risks" className="space-y-4 mt-6">
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#101828]">Privacy Risk Register</h3>
              <Button onClick={() => setIsRiskDialogOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Risk
              </Button>
            </div>
            <div className="space-y-3">
              {risks.map((risk) => (
                <div
                  key={risk.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#00bc7d] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-[#101828] mb-1">{risk.description}</h4>
                      <p className="text-sm text-[#6a7282]">Mitigation: {risk.mitigation}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-[#6a7282] mb-1">Likelihood</p>
                      <Badge className={getRiskColor(risk.likelihood)}>{risk.likelihood}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-[#6a7282] mb-1">Impact</p>
                      <Badge className={getRiskColor(risk.impact)}>{risk.impact}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-[#6a7282] mb-1">Residual Risk</p>
                      <Badge className={getRiskColor(risk.residualRisk)}>{risk.residualRisk}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Compliance Overview Tab */}
        <TabsContent value="compliance" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">GDPR Article 35 Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">
                      Systematic and extensive processing
                    </p>
                    <p className="text-xs text-[#6a7282]">Carpooling platform qualifies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Location data monitoring</p>
                    <p className="text-xs text-[#6a7282]">Real-time tracking for carpooling</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">DPO consultation completed</p>
                    <p className="text-xs text-[#6a7282]">All high-risk DPIAs reviewed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Data subject consultation</p>
                    <p className="text-xs text-[#6a7282]">Privacy notices provided to employees</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">Data Processing Principles</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Purpose Limitation</p>
                    <p className="text-xs text-[#6a7282]">
                      Data used only for emissions reporting and carpooling
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Data Minimization</p>
                    <p className="text-xs text-[#6a7282]">
                      Collect only essential location and route data
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Storage Limitation</p>
                    <p className="text-xs text-[#6a7282]">Auto-delete after 7 years (CSRD requirement)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#101828]">Security Measures</p>
                    <p className="text-xs text-[#6a7282]">
                      Encryption, pseudonymization, access controls
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create DPIA Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New DPIA</DialogTitle>
            <DialogDescription>
              Initiate a new Data Protection Impact Assessment for a processing activity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="dpia-name">DPIA Name *</Label>
              <Input
                id="dpia-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Employee Home Address Collection"
              />
            </div>

            <div>
              <Label htmlFor="processing">Processing Activity *</Label>
              <Textarea
                id="processing"
                value={formData.processingActivity}
                onChange={(e) => setFormData({ ...formData, processingActivity: e.target.value })}
                placeholder="Describe the data processing activity..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="legal-basis">Legal Basis *</Label>
                <Select
                  value={formData.legalBasis}
                  onValueChange={(value) => setFormData({ ...formData, legalBasis: value })}
                >
                  <SelectTrigger id="legal-basis">
                    <SelectValue placeholder="Select basis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consent">Consent</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="legal">Legal Obligation</SelectItem>
                    <SelectItem value="legitimate">Legitimate Interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="risk-level">Initial Risk Level *</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, riskLevel: value as 'low' | 'medium' | 'high' })
                  }
                >
                  <SelectTrigger id="risk-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateDPIA}
              disabled={!formData.name || !formData.processingActivity || !formData.legalBasis}
            >
              Create DPIA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View DPIA Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#00bc7d]" />
              {selectedDPIA?.name}
            </DialogTitle>
            <DialogDescription>{selectedDPIA?.processingActivity}</DialogDescription>
          </DialogHeader>
          {selectedDPIA && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Status</p>
                  <Badge className={getStatusColor(selectedDPIA.status)}>{selectedDPIA.status}</Badge>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Risk Level</p>
                  <Badge className={getRiskColor(selectedDPIA.riskLevel)}>
                    {selectedDPIA.riskLevel}
                  </Badge>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Legal Basis</p>
                  <p className="text-sm font-medium text-[#101828]">{selectedDPIA.legalBasis}</p>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">DPO Approved</p>
                  {selectedDPIA.dpoApproved ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                </Card>
              </div>

              <div>
                <p className="text-sm font-medium text-[#101828] mb-2">Data Types Processed</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDPIA.dataTypes.map((type, index) => (
                    <Badge key={index} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-[#6a7282] mb-1">Created</p>
                  <p className="font-medium text-[#101828]">
                    {new Date(selectedDPIA.dateCreated).toLocaleDateString('en-IE')}
                  </p>
                </div>
                <div>
                  <p className="text-[#6a7282] mb-1">Last Review</p>
                  <p className="font-medium text-[#101828]">
                    {new Date(selectedDPIA.lastReview).toLocaleDateString('en-IE')}
                  </p>
                </div>
                <div>
                  <p className="text-[#6a7282] mb-1">Next Review</p>
                  <p className="font-medium text-[#101828]">
                    {new Date(selectedDPIA.nextReview).toLocaleDateString('en-IE')}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export DPIA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
