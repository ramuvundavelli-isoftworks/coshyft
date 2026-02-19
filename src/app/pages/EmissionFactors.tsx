import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
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
import { Plus, Edit, AlertTriangle, TrendingUp, Archive, FileText, CheckCircle, XCircle } from 'lucide-react';
import { mockEmissionFactors } from '../data/mockData';
import { EmissionFactor } from '../types';
import { toast } from 'sonner';

export default function EmissionFactors() {
  const [factors, setFactors] = useState<EmissionFactor[]>(mockEmissionFactors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState<EmissionFactor | null>(null);
  const [formData, setFormData] = useState({
    mode: '',
    factor: '',
    source: '',
    version: '',
    effectiveDate: '',
    methodology: '',
  });
  const [rejectReason, setRejectReason] = useState('');

  const pendingFactors = factors.filter(f => f.approvalStatus === 'pending');
  const activeFactors = factors.filter(f => f.approvalStatus === 'approved' && f.status === 'active');

  const handleAddFactor = () => {
    const newFactor: EmissionFactor = {
      id: `factor-${Date.now()}`,
      mode: formData.mode,
      factor: parseFloat(formData.factor),
      source: formData.source,
      version: formData.version,
      effectiveDate: formData.effectiveDate,
      status: 'active',
      approvalStatus: 'pending',
      lastUpdated: new Date().toISOString(),
    };
    setFactors([...factors, newFactor]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success('Emission factor submitted for approval');
  };

  const handleEditFactor = () => {
    if (selectedFactor) {
      const updated = factors.map(f =>
        f.id === selectedFactor.id
          ? {
              ...f,
              mode: formData.mode,
              factor: parseFloat(formData.factor),
              source: formData.source,
              methodology: formData.methodology,
              lastUpdated: new Date().toISOString(),
            }
          : f
      );
      setFactors(updated);
      setIsEditDialogOpen(false);
      toast.success('Emission factor updated successfully');
    }
  };

  const handleCreateVersion = () => {
    if (selectedFactor) {
      const newVersion: EmissionFactor = {
        ...selectedFactor,
        id: `factor-${Date.now()}`,
        version: formData.version,
        factor: parseFloat(formData.factor),
        effectiveDate: formData.effectiveDate,
        approvalStatus: 'pending',
        lastUpdated: new Date().toISOString(),
      };
      setFactors([...factors, newVersion]);
      setIsVersionDialogOpen(false);
      resetForm();
      toast.success('New version created and submitted for approval');
    }
  };

  const handleArchiveFactor = () => {
    if (selectedFactor) {
      const updated = factors.map(f =>
        f.id === selectedFactor.id ? { ...f, status: 'archived' } : f
      );
      setFactors(updated);
      setIsArchiveDialogOpen(false);
      toast.success('Emission factor archived');
    }
  };

  const handleApproveFactor = () => {
    if (selectedFactor) {
      const updated = factors.map(f =>
        f.id === selectedFactor.id ? { ...f, approvalStatus: 'approved', status: 'active' } : f
      );
      setFactors(updated);
      setIsApproveDialogOpen(false);
      toast.success('Emission factor approved');
    }
  };

  const handleRejectFactor = () => {
    if (selectedFactor) {
      const updated = factors.map(f =>
        f.id === selectedFactor.id ? { ...f, approvalStatus: 'rejected' } : f
      );
      setFactors(updated);
      setIsRejectDialogOpen(false);
      setRejectReason('');
      toast.success('Emission factor rejected');
    }
  };

  const selectFactor = (factor: EmissionFactor) => {
    setSelectedFactor(factor);
    setFormData({
      mode: factor.mode,
      factor: factor.factor.toString(),
      source: factor.source,
      version: factor.version,
      effectiveDate: factor.effectiveDate,
      methodology: '',
    });
  };

  const resetForm = () => {
    setFormData({
      mode: '',
      factor: '',
      source: '',
      version: '',
      effectiveDate: '',
      methodology: '',
    });
    setSelectedFactor(null);
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700 border-green-200',
    archived: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const approvalColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emission Factor Governance</h1>
          <p className="text-gray-600 mt-1">
            Manage and approve emission factors with full version control
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Factor Version
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Factors</p>
              <p className="text-2xl font-bold text-gray-900">{activeFactors.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingFactors.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Versions</p>
              <p className="text-2xl font-bold text-gray-900">{factors.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Recent Updates</p>
              <p className="text-2xl font-bold text-gray-900">
                {factors.filter(f => {
                  const diff = Date.now() - new Date(f.lastUpdated).getTime();
                  return diff < 7 * 24 * 60 * 60 * 1000; // 7 days
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals Alert */}
      {pendingFactors.length > 0 && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 mb-2">
                {pendingFactors.length} Factor{pendingFactors.length > 1 ? 's' : ''} Awaiting Approval
              </h3>
              <div className="space-y-2">
                {pendingFactors.map(factor => (
                  <div key={factor.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{factor.mode}</p>
                      <p className="text-sm text-gray-600">
                        {factor.factor} kgCO₂/km • Version {factor.version} • {factor.source}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => {
                          selectFactor(factor);
                          setIsApproveDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedFactor(factor);
                          setIsRejectDialogOpen(true);
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Factors Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Emission Factors</h2>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">Export</Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transport Mode</TableHead>
              <TableHead className="text-right">Factor (kgCO₂/km)</TableHead>
              <TableHead>Data Source</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factors.map((factor) => (
              <TableRow key={factor.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{factor.mode}</TableCell>
                <TableCell className="text-right font-semibold">{factor.factor.toFixed(3)}</TableCell>
                <TableCell className="text-sm text-gray-600">{factor.source}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">{factor.version}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(factor.effectiveDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(factor.lastUpdated).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[factor.status]}>
                    {factor.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={approvalColors[factor.approvalStatus]}>
                    {factor.approvalStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        selectFactor(factor);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        selectFactor(factor);
                        setIsVersionDialogOpen(true);
                      }}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    {factor.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedFactor(factor);
                          setIsArchiveDialogOpen(true);
                        }}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Factor Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Emission Factor</DialogTitle>
            <DialogDescription>
              Create a new emission factor version for approval
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mode">Transport Mode *</Label>
                <Input
                  id="mode"
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                  placeholder="e.g., Electric Vehicle"
                />
              </div>
              <div>
                <Label htmlFor="factor">Emission Factor (kgCO₂/km) *</Label>
                <Input
                  id="factor"
                  type="number"
                  step="0.001"
                  value={formData.factor}
                  onChange={(e) => setFormData({ ...formData, factor: e.target.value })}
                  placeholder="0.047"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="source">Data Source *</Label>
                <Input
                  id="source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., DEFRA 2025"
                />
              </div>
              <div>
                <Label htmlFor="version">Version ID *</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="v2.1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="effective">Effective Date *</Label>
              <Input
                id="effective"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="methodology">Methodology / Notes</Label>
              <Textarea
                id="methodology"
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                placeholder="Describe the calculation methodology and assumptions..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddFactor}
              disabled={!formData.mode || !formData.factor || !formData.source || !formData.version || !formData.effectiveDate}
            >
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Factor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Emission Factor</DialogTitle>
            <DialogDescription>
              Update the emission factor details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-mode">Transport Mode *</Label>
                <Input
                  id="edit-mode"
                  value={formData.mode}
                  onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-factor">Emission Factor (kgCO₂/km) *</Label>
                <Input
                  id="edit-factor"
                  type="number"
                  step="0.001"
                  value={formData.factor}
                  onChange={(e) => setFormData({ ...formData, factor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-source">Data Source *</Label>
              <Input
                id="edit-source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-methodology">Methodology / Notes</Label>
              <Textarea
                id="edit-methodology"
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditFactor}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Version Dialog */}
      <Dialog open={isVersionDialogOpen} onOpenChange={setIsVersionDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              Create a new version of this emission factor
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Current:</strong> {selectedFactor?.mode} • {selectedFactor?.factor} kgCO₂/km • Version {selectedFactor?.version}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="new-version">New Version ID *</Label>
                <Input
                  id="new-version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="v2.2"
                />
              </div>
              <div>
                <Label htmlFor="new-factor">New Emission Factor (kgCO₂/km) *</Label>
                <Input
                  id="new-factor"
                  type="number"
                  step="0.001"
                  value={formData.factor}
                  onChange={(e) => setFormData({ ...formData, factor: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="new-effective">Effective Date *</Label>
              <Input
                id="new-effective"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="version-notes">Version Notes *</Label>
              <Textarea
                id="version-notes"
                value={formData.methodology}
                onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                placeholder="Describe what changed in this version..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVersionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVersion}>
              Create Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Emission Factor</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive "{selectedFactor?.mode} - {selectedFactor?.version}"?
              This will prevent it from being used in future calculations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleArchiveFactor}>
              Archive Factor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Emission Factor</DialogTitle>
            <DialogDescription>
              Approve "{selectedFactor?.mode} - {selectedFactor?.version}" for use in calculations?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-gray-600">Mode:</span>
                <span className="font-medium">{selectedFactor?.mode}</span>
                <span className="text-gray-600">Factor:</span>
                <span className="font-medium">{selectedFactor?.factor} kgCO₂/km</span>
                <span className="text-gray-600">Source:</span>
                <span className="font-medium">{selectedFactor?.source}</span>
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">{selectedFactor?.version}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveFactor}>
              Approve Factor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Emission Factor</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this emission factor
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-reason">Rejection Reason *</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why this factor is being rejected..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectFactor}
              disabled={!rejectReason.trim()}
            >
              Reject Factor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
