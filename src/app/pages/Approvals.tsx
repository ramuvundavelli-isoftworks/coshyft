import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
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
import { CheckSquare, Clock, User, Download, Eye, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Approval {
  id: string;
  title: string;
  type: 'baseline' | 'target' | 'factor' | 'methodology' | 'report';
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

const mockApprovals: Approval[] = [
  { id: 'a1', title: 'FY2026 Baseline Approval', type: 'baseline', requestedBy: 'John Smith', requestDate: '2026-02-15', status: 'pending', priority: 'high', description: 'Baseline for FY2026 ready for approval' },
  { id: 'a2', title: '2030 Reduction Target', type: 'target', requestedBy: 'Sarah Johnson', requestDate: '2026-02-10', status: 'approved', priority: 'high', description: '30% reduction target by 2030' },
  { id: 'a3', title: 'Updated EV Emission Factor', type: 'factor', requestedBy: 'Mike Chen', requestDate: '2026-02-12', status: 'pending', priority: 'medium', description: 'DEFRA 2024 EV factor update' },
  { id: 'a4', title: 'Q4 Compliance Report', type: 'report', requestedBy: 'Emily Davis', requestDate: '2026-02-08', status: 'approved', priority: 'high', description: 'Q4 2025 CSRD compliance report' },
  { id: 'a5', title: 'Methodology Update', type: 'methodology', requestedBy: 'David Wilson', requestDate: '2026-02-14', status: 'rejected', priority: 'low', description: 'Proposed methodology changes' },
];

export default function Approvals() {
  const [approvals, setApprovals] = useState<Approval[]>(mockApprovals);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [comments, setComments] = useState('');

  const handleApprove = () => {
    if (selectedApproval) {
      const updated = approvals.map(a =>
        a.id === selectedApproval.id ? { ...a, status: 'approved' as const } : a
      );
      setApprovals(updated);
      setIsApproveDialogOpen(false);
      setComments('');
      toast.success('Request approved successfully');
    }
  };

  const handleReject = () => {
    if (selectedApproval) {
      const updated = approvals.map(a =>
        a.id === selectedApproval.id ? { ...a, status: 'rejected' as const } : a
      );
      setApprovals(updated);
      setIsRejectDialogOpen(false);
      setComments('');
      toast.success('Request rejected');
    }
  };

  const handleExport = () => {
    toast.success('Exporting approvals...');
    setIsExportDialogOpen(false);
  };

  const filteredApprovals = approvals.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
          <p className="text-gray-600 mt-1">Manage approval requests and workflows</p>
        </div>
        <Button onClick={() => setIsExportDialogOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{approvals.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search approvals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Approvals Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Approval Requests</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApprovals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell className="font-medium">{approval.title}</TableCell>
                <TableCell>
                  <Badge className="bg-gray-100 text-gray-700">{approval.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {approval.requestedBy}
                  </div>
                </TableCell>
                <TableCell>{approval.requestDate}</TableCell>
                <TableCell>
                  <Badge className={
                    approval.priority === 'high' ? 'bg-red-100 text-red-700' :
                    approval.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {approval.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={
                    approval.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    approval.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {approval.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedApproval(approval);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {approval.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedApproval(approval);
                            setIsApproveDialogOpen(true);
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                          Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedApproval(approval);
                            setIsRejectDialogOpen(true);
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-1 text-red-600" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approval Details</DialogTitle>
            <DialogDescription>{selectedApproval?.title}</DialogDescription>
          </DialogHeader>
          {selectedApproval && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Type</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedApproval.type}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedApproval.status}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Priority</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedApproval.priority}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Request Date</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedApproval.requestDate}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Requested By</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedApproval.requestedBy}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Description</Label>
                <p className="text-gray-900 mt-1">{selectedApproval.description}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Request</DialogTitle>
            <DialogDescription>Approve {selectedApproval?.title}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <p className="text-sm text-green-900">
                <strong>Request:</strong> {selectedApproval?.title}
              </p>
              <p className="text-sm text-green-900">
                <strong>Type:</strong> {selectedApproval?.type}
              </p>
            </div>
            <Label htmlFor="approve-comments">Approval Comments (optional)</Label>
            <Textarea
              id="approve-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add approval comments..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Reject {selectedApproval?.title}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-900">
                This will reject the approval request. Please provide a reason.
              </p>
            </div>
            <Label htmlFor="reject-comments">Rejection Reason *</Label>
            <Textarea
              id="reject-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!comments}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Approvals</DialogTitle>
            <DialogDescription>Download approval records</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-filter">Filter *</Label>
            <Select defaultValue="all">
              <SelectTrigger id="export-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approvals</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
                <SelectItem value="approved">Approved Only</SelectItem>
                <SelectItem value="rejected">Rejected Only</SelectItem>
              </SelectContent>
            </Select>
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
