import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Calendar, CheckCircle, FileText, Download, Shield, Plus, Eye, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useApiMutation } from '../api';
import { auditorApi } from '../api';

const baselineInfo = {
  year: '2026',
  totalEmissions: 2850,
  methodology: 'Operational Control',
  dataQuality: 92,
  approvalDate: '2026-02-01',
  approvedBy: 'Board of Directors',
  verificationStatus: 'Verified',
  scope: 'All operational locations',
};

const baselineComponents = [
  { id: 'b1', category: 'HQ - Tech Park', emissions: 1245, employees: 1240, verified: true },
  { id: 'b2', category: 'Downtown Office', emissions: 682, employees: 680, verified: true },
  { id: 'b3', category: 'East Campus', emissions: 518, employees: 520, verified: true },
  { id: 'b4', category: 'London Office', emissions: 405, employees: 380, verified: false },
];

export default function AuditorBaselineReview() {
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [isClarificationDialogOpen, setIsClarificationDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [note, setNote] = useState('');

  // API mutations
  const addNoteMutation = useApiMutation((data: { area: string; note: string }) =>
    auditorApi.addAuditNote(data)
  );
  const requestClarificationMutation = useApiMutation((data: { area: string }) =>
    auditorApi.requestClarification(data)
  );
  const approveBaselineMutation = useApiMutation((area: string) =>
    auditorApi.approveReviewArea(area)
  );

  const handleAddNote = async () => {
    const result = await addNoteMutation.execute({
      area: 'baseline',
      note,
    });

    if (result.success) {
      toast.success('Audit note added successfully');
    } else {
      toast.error(result.error?.message || 'Failed to add note');
    }
    setIsAddNoteDialogOpen(false);
    setNote('');
  };

  const handleRequestClarification = async () => {
    const result = await requestClarificationMutation.execute({
      area: 'baseline',
    });

    if (result.success) {
      toast.success('Clarification request sent');
    } else {
      toast.error(result.error?.message || 'Failed to send clarification request');
    }
    setIsClarificationDialogOpen(false);
  };

  const handleApprove = async () => {
    const result = await approveBaselineMutation.execute('baseline');

    if (result.success) {
      toast.success('Baseline approved');
    } else {
      toast.error(result.error?.message || 'Failed to approve baseline');
    }
    setIsApproveDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting audit trail...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Baseline Review</h1>
          <p className="text-gray-600 mt-1">Verify baseline integrity and methodology</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Audit Trail
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Baseline Year</p>
              <p className="text-2xl font-bold text-gray-900">{baselineInfo.year}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Data Quality</p>
              <p className="text-2xl font-bold text-gray-900">{baselineInfo.dataQuality}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-bold text-green-600">{baselineInfo.verificationStatus}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Emissions</p>
              <p className="text-xl font-bold text-gray-900">{baselineInfo.totalEmissions} tCO₂e</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Baseline Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Baseline Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Methodology</Label>
            <p className="font-medium text-gray-900 mt-1">{baselineInfo.methodology}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Scope</Label>
            <p className="font-medium text-gray-900 mt-1">{baselineInfo.scope}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Approval Date</Label>
            <p className="font-medium text-gray-900 mt-1">{baselineInfo.approvalDate}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Approved By</Label>
            <p className="font-medium text-gray-900 mt-1">{baselineInfo.approvedBy}</p>
          </div>
        </div>
      </Card>

      {/* Baseline Components */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Baseline Components</h3>
          <Button variant="outline" size="sm" onClick={() => setIsApproveDialogOpen(true)}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve Baseline
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Emissions (tCO₂e)</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Per Employee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {baselineComponents.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.category}</TableCell>
                <TableCell>{item.emissions}</TableCell>
                <TableCell>{item.employees}</TableCell>
                <TableCell>{(item.emissions / item.employees).toFixed(2)}</TableCell>
                <TableCell>
                  {item.verified ? (
                    <Badge className="bg-green-100 text-green-700">Verified</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsViewDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsClarificationDialogOpen(true);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Clarify
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Baseline Component Details</DialogTitle>
            <DialogDescription>{selectedItem?.category}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Total Emissions</Label>
                    <p className="font-medium text-gray-900 mt-1">{selectedItem.emissions} tCO₂e</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Employees</Label>
                    <p className="font-medium text-gray-900 mt-1">{selectedItem.employees}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Verification Status</Label>
                  <p className="font-medium text-gray-900 mt-1">
                    {selectedItem.verified ? 'Verified' : 'Pending Verification'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Audit Note</DialogTitle>
            <DialogDescription>Document observations for baseline review</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="note">Audit Note *</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter audit observations..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNote} disabled={!note || addNoteMutation.loading}>
              {addNoteMutation.loading ? 'Adding...' : 'Add Note'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Clarification Dialog */}
      <Dialog open={isClarificationDialogOpen} onOpenChange={setIsClarificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Clarification</DialogTitle>
            <DialogDescription>
              Request additional information for {selectedItem?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="clarification">Clarification Request *</Label>
            <Textarea
              id="clarification"
              placeholder="Describe what information is needed..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClarificationDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestClarification} disabled={requestClarificationMutation.loading}>
              <MessageCircle className="h-4 w-4 mr-2" />
              {requestClarificationMutation.loading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Baseline Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Baseline</DialogTitle>
            <DialogDescription>Provide audit approval for baseline</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="text-sm text-green-900">
                <strong>Baseline Year:</strong> {baselineInfo.year}
              </p>
              <p className="text-sm text-green-900">
                <strong>Total Emissions:</strong> {baselineInfo.totalEmissions} tCO₂e
              </p>
              <p className="text-sm text-green-900">
                <strong>Data Quality:</strong> {baselineInfo.dataQuality}%
              </p>
            </div>
            <Label htmlFor="approval-comment">Approval Comment (optional)</Label>
            <Textarea
              id="approval-comment"
              placeholder="Add approval comments..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove} disabled={approveBaselineMutation.loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {approveBaselineMutation.loading ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Audit Trail</DialogTitle>
            <DialogDescription>Download baseline audit documentation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Baseline methodology documentation</li>
                <li>Component-level verification</li>
                <li>Audit notes and observations</li>
                <li>Approval records</li>
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