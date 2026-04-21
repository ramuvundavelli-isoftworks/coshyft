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
import { Database, Download, Eye, MessageCircle, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useApiMutation } from '../api';
import { auditorApi } from '../api';

const factors = [
  { id: 'f1', name: 'Gasoline - Passenger Car', value: 0.172, unit: 'kg CO₂e/km', source: 'DEFRA 2024', locked: true, verified: true },
  { id: 'f2', name: 'Diesel - Passenger Car', value: 0.168, unit: 'kg CO₂e/km', source: 'DEFRA 2024', locked: true, verified: true },
  { id: 'f3', name: 'Public Bus', value: 0.028, unit: 'kg CO₂e/km', source: 'DEFRA 2024', locked: false, verified: false },
  { id: 'f4', name: 'Electric Vehicle', value: 0.047, unit: 'kg CO₂e/km', source: 'DEFRA 2024', locked: true, verified: true },
];

export default function AuditorFactorsReview() {
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isAddCommentDialogOpen, setIsAddCommentDialogOpen] = useState(false);
  const [isRequestDocsDialogOpen, setIsRequestDocsDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<any>(null);

  // API mutations
  const addCommentMutation = useApiMutation((data: { factorId: string; comment: string }) =>
    auditorApi.addFactorComment(data.factorId, data.comment)
  );
  const requestDocsMutation = useApiMutation((factorId: string) =>
    auditorApi.requestFactorDocs(factorId)
  );
  const approveFactorMutation = useApiMutation((factorId: string) =>
    auditorApi.approveFactor(factorId)
  );

  const handleAddComment = async () => {
    if (selectedFactor) {
      const result = await addCommentMutation.execute({
        factorId: selectedFactor.id,
        comment: 'Audit comment', // Would use form state in production
      });

      if (result.success) {
        toast.success('Comment added successfully');
      } else {
        toast.error(result.error?.message || 'Failed to add comment');
      }
    }
    setIsAddCommentDialogOpen(false);
  };

  const handleRequestDocs = async () => {
    if (selectedFactor) {
      const result = await requestDocsMutation.execute(selectedFactor.id);

      if (result.success) {
        toast.success('Documentation request sent');
      } else {
        toast.error(result.error?.message || 'Failed to send documentation request');
      }
    }
    setIsRequestDocsDialogOpen(false);
  };

  const handleApproveFactor = async () => {
    if (selectedFactor) {
      const result = await approveFactorMutation.execute(selectedFactor.id);

      if (result.success) {
        toast.success('Emission factor approved');
      } else {
        toast.error(result.error?.message || 'Failed to approve factor');
      }
    }
    setIsApproveDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Factors Review</h1>
          <p className="text-muted-foreground mt-1">Emission factor verification and validation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsAddCommentDialogOpen(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Review
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Database className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Factors</p>
              <p className="text-2xl font-bold text-foreground">{factors.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-success">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Lock className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Locked</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <Database className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data Source</p>
              <p className="text-lg font-bold text-foreground">DEFRA 2024</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Factors Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Emission Factors</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factor Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Lock Status</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factors.map((factor) => (
              <TableRow key={factor.id}>
                <TableCell className="font-medium">{factor.name}</TableCell>
                <TableCell>{factor.value}</TableCell>
                <TableCell>{factor.unit}</TableCell>
                <TableCell>{factor.source}</TableCell>
                <TableCell>
                  {factor.locked ? (
                    <Badge className="bg-info-subtle text-info">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked
                    </Badge>
                  ) : (
                    <Badge className="bg-muted text-foreground">Unlocked</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {factor.verified ? (
                    <Badge className="bg-success-subtle text-success">Verified</Badge>
                  ) : (
                    <Badge className="bg-warning-subtle text-warning">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFactor(factor);
                        setIsViewDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedFactor(factor);
                        setIsApproveDialogOpen(true);
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
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
            <DialogTitle>Factor Details</DialogTitle>
            <DialogDescription>{selectedFactor?.name}</DialogDescription>
          </DialogHeader>
          {selectedFactor && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Value</Label>
                  <p className="font-medium text-foreground mt-1">{selectedFactor.value}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Unit</Label>
                  <p className="font-medium text-foreground mt-1">{selectedFactor.unit}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Source</Label>
                <p className="font-medium text-foreground mt-1">{selectedFactor.source}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Lock Status</Label>
                  <p className="font-medium text-foreground mt-1">{selectedFactor.locked ? 'Locked' : 'Unlocked'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Verification</Label>
                  <p className="font-medium text-foreground mt-1">{selectedFactor.verified ? 'Verified' : 'Pending'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDocsDialogOpen(true)}>
              Request Documentation
            </Button>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddCommentDialogOpen} onOpenChange={setIsAddCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Audit Comment</DialogTitle>
            <DialogDescription>Document factor review observations</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="comment">Comment *</Label>
            <Textarea
              id="comment"
              placeholder="Add audit observations..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCommentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddComment} disabled={addCommentMutation.loading}>
              {addCommentMutation.loading ? 'Adding...' : 'Add Comment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRequestDocsDialogOpen} onOpenChange={setIsRequestDocsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Documentation</DialogTitle>
            <DialogDescription>Request source documentation for factor</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="doc-request">Documentation Request *</Label>
            <Textarea
              id="doc-request"
              placeholder="Specify required documentation..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestDocsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestDocs} disabled={requestDocsMutation.loading}>
              {requestDocsMutation.loading ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Factor</DialogTitle>
            <DialogDescription>
              Provide audit approval for {selectedFactor?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-success-subtle border border-success/25 rounded-lg mb-4">
              <p className="text-sm text-success">
                <strong>Factor:</strong> {selectedFactor?.name}
              </p>
              <p className="text-sm text-success">
                <strong>Value:</strong> {selectedFactor?.value} {selectedFactor?.unit}
              </p>
              <p className="text-sm text-success">
                <strong>Source:</strong> {selectedFactor?.source}
              </p>
            </div>
            <Label htmlFor="approval-comment">Approval Comments (optional)</Label>
            <Textarea
              id="approval-comment"
              placeholder="Add approval comments..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApproveFactor} disabled={approveFactorMutation.loading}>
              <CheckCircle className="h-4 w-4 mr-2" />
              {approveFactorMutation.loading ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}