import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
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
  Plus,
  Edit,
  CheckCircle,
  Clock,
  Users,
  Download,
  Copy,
  Trash2,
  Eye,
  AlertTriangle,
  History,
} from 'lucide-react';
import { toast } from 'sonner';

interface Policy {
  id: string;
  name: string;
  description: string;
  category: 'carpool' | 'parking' | 'transit' | 'incentive' | 'general';
  status: 'active' | 'draft' | 'archived';
  effectiveDate: string;
  lastModified: string;
  appliesTo: string;
  content?: string;
}

const mockPolicies: Policy[] = [
  {
    id: 'pol1',
    name: 'Carpool Matching & Coordination Policy',
    description: 'Guidelines for carpool formation, driver requirements, passenger responsibilities, and ride-sharing protocols.',
    category: 'carpool',
    status: 'active',
    effectiveDate: '2026-01-01',
    lastModified: '2026-01-15',
    appliesTo: 'All Employees',
    content: 'Full policy content here...',
  },
  {
    id: 'pol2',
    name: 'Parking Priority for Carpools',
    description: 'Designated parking spots for carpool vehicles with 3+ occupants. Premium spots near building entrances.',
    category: 'parking',
    status: 'active',
    effectiveDate: '2026-01-01',
    lastModified: '2025-12-20',
    appliesTo: 'All Locations',
  },
  {
    id: 'pol3',
    name: 'Public Transit Subsidy Program',
    description: '50% reimbursement for monthly public transit passes. Maximum $150/month per employee.',
    category: 'transit',
    status: 'active',
    effectiveDate: '2026-01-01',
    lastModified: '2025-12-15',
    appliesTo: 'All Employees',
  },
  {
    id: 'pol4',
    name: 'Green Commute Rewards Program',
    description: 'Point-based reward system for sustainable commuting. 10 points per carpool trip, 15 for public transit, 20 for bike/walk.',
    category: 'incentive',
    status: 'active',
    effectiveDate: '2026-02-01',
    lastModified: '2026-01-28',
    appliesTo: 'All Employees',
  },
  {
    id: 'pol5',
    name: 'Flexible Work Hours for Carpoolers',
    description: 'Extended arrival window (7am-10am) for employees participating in carpools to accommodate shared schedules.',
    category: 'general',
    status: 'draft',
    effectiveDate: '2026-03-01',
    lastModified: '2026-02-10',
    appliesTo: 'Non-Customer Facing Roles',
  },
];

export default function AdminPolicies() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isVersionHistoryDialogOpen, setIsVersionHistoryDialogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general' as const,
    effectiveDate: '',
    appliesTo: 'All Employees',
    content: '',
  });

  const handleCreatePolicy = () => {
    const newPolicy: Policy = {
      id: `pol-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      status: 'draft',
      effectiveDate: formData.effectiveDate,
      lastModified: new Date().toISOString().split('T')[0],
      appliesTo: formData.appliesTo,
      content: formData.content,
    };
    setPolicies([...policies, newPolicy]);
    setIsCreateDialogOpen(false);
    resetForm();
    toast.success('Policy created successfully');
  };

  const handleEditPolicy = () => {
    if (selectedPolicy) {
      const updated = policies.map(p =>
        p.id === selectedPolicy.id
          ? {
              ...p,
              name: formData.name,
              description: formData.description,
              category: formData.category,
              effectiveDate: formData.effectiveDate,
              appliesTo: formData.appliesTo,
              content: formData.content,
              lastModified: new Date().toISOString().split('T')[0],
            }
          : p
      );
      setPolicies(updated);
      setIsEditDialogOpen(false);
      toast.success('Policy updated successfully');
    }
  };

  const handleDuplicatePolicy = () => {
    if (selectedPolicy) {
      const newPolicy: Policy = {
        ...selectedPolicy,
        id: `pol-${Date.now()}`,
        name: `${selectedPolicy.name} (Copy)`,
        status: 'draft',
        lastModified: new Date().toISOString().split('T')[0],
      };
      setPolicies([...policies, newPolicy]);
      setIsDuplicateDialogOpen(false);
      toast.success('Policy duplicated successfully');
    }
  };

  const handleArchivePolicy = () => {
    if (selectedPolicy) {
      const updated = policies.map(p =>
        p.id === selectedPolicy.id ? { ...p, status: 'archived' as const } : p
      );
      setPolicies(updated);
      setIsArchiveDialogOpen(false);
      toast.success('Policy archived');
    }
  };

  const handlePublishPolicy = () => {
    if (selectedPolicy) {
      const updated = policies.map(p =>
        p.id === selectedPolicy.id ? { ...p, status: 'active' as const } : p
      );
      setPolicies(updated);
      setIsPublishDialogOpen(false);
      toast.success('Policy published and now active');
    }
  };

  const selectPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      category: policy.category,
      effectiveDate: policy.effectiveDate,
      appliesTo: policy.appliesTo,
      content: policy.content || '',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      effectiveDate: '',
      appliesTo: 'All Employees',
      content: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-700">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-700">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      carpool: 'bg-blue-100 text-blue-700',
      parking: 'bg-purple-100 text-purple-700',
      transit: 'bg-green-100 text-green-700',
      incentive: 'bg-yellow-100 text-yellow-700',
      general: 'bg-gray-100 text-gray-700',
    };
    return <Badge className={colors[category]}>{category}</Badge>;
  };

  const activePolicies = policies.filter(p => p.status === 'active').length;
  const draftPolicies = policies.filter(p => p.status === 'draft').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600 mt-1">
            Configure and manage commute policies and guidelines
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Policies
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Policies</p>
              <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activePolicies}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-900">{draftPolicies}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Applies To</p>
              <p className="text-2xl font-bold text-gray-900">All</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Policies List */}
      <div className="space-y-3">
        {policies.map((policy) => (
          <Card key={policy.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{policy.name}</h3>
                  {getStatusBadge(policy.status)}
                  {getCategoryBadge(policy.category)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Effective: {new Date(policy.effectiveDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Modified: {new Date(policy.lastModified).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Applies to: {policy.appliesTo}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPolicy(policy);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    selectPolicy(policy);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPolicy(policy);
                    setIsDuplicateDialogOpen(true);
                  }}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Duplicate
                </Button>
                {policy.status === 'draft' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedPolicy(policy);
                      setIsPublishDialogOpen(true);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Publish
                  </Button>
                )}
                {policy.status === 'active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPolicy(policy);
                      setIsArchiveDialogOpen(true);
                    }}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Policy Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Policy</DialogTitle>
            <DialogDescription>
              Define a new commute policy or guideline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label htmlFor="name">Policy Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Carpool Parking Priority Policy"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief summary of the policy"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carpool">Carpool</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                    <SelectItem value="transit">Public Transit</SelectItem>
                    <SelectItem value="incentive">Incentive Program</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="effectiveDate">Effective Date *</Label>
                <Input
                  id="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="appliesTo">Applies To *</Label>
              <Select
                value={formData.appliesTo}
                onValueChange={(value) => setFormData({ ...formData, appliesTo: value })}
              >
                <SelectTrigger id="appliesTo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Employees">All Employees</SelectItem>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  <SelectItem value="San Francisco HQ">San Francisco HQ</SelectItem>
                  <SelectItem value="Non-Customer Facing Roles">Non-Customer Facing Roles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Policy Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full policy details, requirements, and guidelines..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePolicy}
              disabled={!formData.name || !formData.description || !formData.effectiveDate || !formData.content}
            >
              Create Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Policy Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>
              Update policy details for "{selectedPolicy?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label htmlFor="edit-name">Policy Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carpool">Carpool</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                    <SelectItem value="transit">Public Transit</SelectItem>
                    <SelectItem value="incentive">Incentive Program</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-effectiveDate">Effective Date *</Label>
                <Input
                  id="edit-effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-appliesTo">Applies To *</Label>
              <Select
                value={formData.appliesTo}
                onValueChange={(value) => setFormData({ ...formData, appliesTo: value })}
              >
                <SelectTrigger id="edit-appliesTo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Employees">All Employees</SelectItem>
                  <SelectItem value="All Locations">All Locations</SelectItem>
                  <SelectItem value="San Francisco HQ">San Francisco HQ</SelectItem>
                  <SelectItem value="Non-Customer Facing Roles">Non-Customer Facing Roles</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-content">Policy Content *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPolicy}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Policy Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedPolicy?.name}</DialogTitle>
            <DialogDescription>
              Full policy details and content
            </DialogDescription>
          </DialogHeader>
          {selectedPolicy && (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedPolicy.status)}
                {getCategoryBadge(selectedPolicy.category)}
              </div>
              <div>
                <Label className="text-sm text-gray-600">Description</Label>
                <p className="text-gray-900 mt-1">{selectedPolicy.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Effective Date</Label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedPolicy.effectiveDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Last Modified</Label>
                  <p className="text-gray-900 mt-1">
                    {new Date(selectedPolicy.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Applies To</Label>
                <p className="text-gray-900 mt-1">{selectedPolicy.appliesTo}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Policy Content</Label>
                <div className="p-4 bg-gray-50 rounded-lg mt-2">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedPolicy.content || 'No content available'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsViewDialogOpen(false);
                setIsVersionHistoryDialogOpen(true);
              }}
            >
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Dialog */}
      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Policy</DialogTitle>
            <DialogDescription>
              Create a copy of "{selectedPolicy?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This will create a draft copy of the policy that you can then modify and publish.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDuplicateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDuplicatePolicy}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Policy</DialogTitle>
            <DialogDescription>
              Archive "{selectedPolicy?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                This policy will be archived and no longer visible to employees. You can restore it later if needed.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleArchivePolicy}>
              Archive Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Policy</DialogTitle>
            <DialogDescription>
              Make "{selectedPolicy?.name}" active and visible to employees
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                <strong>Effective Date:</strong> {selectedPolicy && new Date(selectedPolicy.effectiveDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-blue-900 mt-1">
                <strong>Applies To:</strong> {selectedPolicy?.appliesTo}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              This policy will become active and visible to all applicable employees.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPublishDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePublishPolicy}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Publish Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={isVersionHistoryDialogOpen} onOpenChange={setIsVersionHistoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              Previous versions of "{selectedPolicy?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge>Current Version</Badge>
                  <span className="text-sm text-gray-600">
                    {selectedPolicy && new Date(selectedPolicy.lastModified).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Latest published version</p>
              </div>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Version 1.0</span>
                  <span className="text-sm text-gray-600">Jan 15, 2026</span>
                </div>
                <p className="text-sm text-gray-600">Initial version</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsVersionHistoryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
