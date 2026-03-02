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
import { Activity, Download, Eye, Flag, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { auditorApi, emissionsApi } from '../api';

const emissionsSamples = [
  { id: 'e1', month: 'Jan 2026', emissions: 245, trips: 3420, quality: 96, verified: true },
  { id: 'e2', month: 'Feb 2026', emissions: 238, trips: 3380, quality: 94, verified: true },
  { id: 'e3', month: 'Mar 2026', emissions: 252, trips: 3510, quality: 92, verified: false },
  { id: 'e4', month: 'Apr 2026', emissions: 241, trips: 3450, quality: 95, verified: true },
];

export default function AuditorEmissionsReview() {
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isFlagIssueDialogOpen, setIsFlagIssueDialogOpen] = useState(false);
  const [isRequestEvidenceDialogOpen, setIsRequestEvidenceDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<any>(null);

  // API mutations
  const flagIssueMutation = useApiMutation((data: { sample_id: string }) =>
    auditorApi.flagIssue(data)
  );
  const requestEvidenceMutation = useApiMutation((data: { sample_id: string }) =>
    auditorApi.requestEvidence(data)
  );
  const approveEmissionsMutation = useApiMutation((area: string) =>
    auditorApi.approveReviewArea(area)
  );

  const handleFlagIssue = async () => {
    if (selectedSample) {
      const result = await flagIssueMutation.execute({
        sample_id: selectedSample.id,
      });

      if (result.success) {
        toast.success('Issue flagged for review');
      } else {
        toast.error(result.error?.message || 'Failed to flag issue');
      }
    }
    setIsFlagIssueDialogOpen(false);
  };

  const handleRequestEvidence = async () => {
    if (selectedSample) {
      const result = await requestEvidenceMutation.execute({
        sample_id: selectedSample.id,
      });

      if (result.success) {
        toast.success('Evidence request sent');
      } else {
        toast.error(result.error?.message || 'Failed to request evidence');
      }
    }
    setIsRequestEvidenceDialogOpen(false);
  };

  const handleApprove = async () => {
    const result = await approveEmissionsMutation.execute('emissions');

    if (result.success) {
      toast.success('Emissions data approved');
    } else {
      toast.error(result.error?.message || 'Failed to approve emissions data');
    }
    setIsApproveDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting review documentation...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emissions Review</h1>
          <p className="text-gray-600 mt-1">Sample-based testing and verification</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsApproveDialogOpen(true)}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Sample
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Review
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Samples Tested</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified</p>
              <p className="text-2xl font-bold text-green-600">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Issues Found</p>
              <p className="text-2xl font-bold text-yellow-600">1</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Data Quality</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sample Review */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Emissions Samples</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Period</TableHead>
              <TableHead>Emissions (tCO₂e)</TableHead>
              <TableHead>Total Trips</TableHead>
              <TableHead>Data Quality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emissionsSamples.map((sample) => (
              <TableRow key={sample.id}>
                <TableCell className="font-medium">{sample.month}</TableCell>
                <TableCell>{sample.emissions}</TableCell>
                <TableCell>{sample.trips}</TableCell>
                <TableCell>
                  <Badge className={sample.quality >= 95 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                    {sample.quality}%
                  </Badge>
                </TableCell>
                <TableCell>
                  {sample.verified ? (
                    <Badge className="bg-green-100 text-green-700">Verified</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700">In Review</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSample(sample);
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
                        setSelectedSample(sample);
                        setIsFlagIssueDialogOpen(true);
                      }}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      Flag
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Dialogs */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sample Details</DialogTitle>
            <DialogDescription>{selectedSample?.month}</DialogDescription>
          </DialogHeader>
          {selectedSample && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Emissions</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedSample.emissions} tCO₂e</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Total Trips</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedSample.trips}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Data Quality</Label>
                  <p className="text-2xl font-bold text-green-600 mt-1">{selectedSample.quality}%</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Status</Label>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    {selectedSample.verified ? 'Verified' : 'In Review'}
                  </p>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestEvidenceDialogOpen(true)}>
              Request Evidence
            </Button>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isFlagIssueDialogOpen} onOpenChange={setIsFlagIssueDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Issue</DialogTitle>
            <DialogDescription>Document data quality concern</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="issue">Issue Description *</Label>
            <Textarea
              id="issue"
              placeholder="Describe the issue found..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFlagIssueDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleFlagIssue} disabled={flagIssueMutation.loading}>
              <Flag className="h-4 w-4 mr-2" />
              {flagIssueMutation.loading ? 'Flagging...' : 'Flag Issue'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRequestEvidenceDialogOpen} onOpenChange={setIsRequestEvidenceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Evidence</DialogTitle>
            <DialogDescription>Request supporting documentation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="evidence-request">Evidence Request *</Label>
            <Textarea
              id="evidence-request"
              placeholder="Specify what evidence is needed..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestEvidenceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestEvidence} disabled={requestEvidenceMutation.loading}>
              <FileText className="h-4 w-4 mr-2" />
              {requestEvidenceMutation.loading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Emissions Sample</DialogTitle>
            <DialogDescription>Provide audit approval</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="approval">Approval Comments (optional)</Label>
            <Textarea
              id="approval"
              placeholder="Add approval comments..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove} disabled={approveEmissionsMutation.loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {approveEmissionsMutation.loading ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Review</DialogTitle>
            <DialogDescription>Download emissions review documentation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Sample testing results</li>
                <li>Data quality assessment</li>
                <li>Flagged issues</li>
                <li>Verification status</li>
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