import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
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
import { Building2, Plus, Eye, Trash2, Settings, UserCheck, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { superadminApi } from '../api';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'trial';
  users: number;
  plan: string;
  created: string;
  admin: string;
}

const mockTenants: Tenant[] = [
  { id: 't1', name: 'Acme Corporation', domain: 'acme.example.com', status: 'active', users: 4250, plan: 'Enterprise', created: '2025-01-15', admin: 'admin@acme.com' },
  { id: 't2', name: 'TechCorp Inc', domain: 'techcorp.example.com', status: 'active', users: 2100, plan: 'Professional', created: '2025-03-22', admin: 'admin@techcorp.com' },
  { id: 't3', name: 'Global Industries', domain: 'global.example.com', status: 'active', users: 6800, plan: 'Enterprise', created: '2024-11-08', admin: 'admin@global.com' },
  { id: 't4', name: 'StartupXYZ', domain: 'startup.example.com', status: 'trial', users: 150, plan: 'Trial', created: '2026-02-10', admin: 'admin@startup.com' },
];

export default function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({ name: '', domain: '', adminEmail: '', plan: 'trial' });

  // API mutations
  const createTenantMutation = useApiMutation((data: any) => superadminApi.createTenant(data));
  const suspendTenantMutation = useApiMutation((tenantId: string) => superadminApi.suspendTenant(tenantId));

  const handleAddTenant = async () => {
    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      name: formData.name,
      domain: formData.domain,
      status: 'trial',
      users: 0,
      plan: formData.plan,
      created: new Date().toISOString().split('T')[0],
      admin: formData.adminEmail,
    };
    setTenants([...tenants, newTenant]);
    setIsAddDialogOpen(false);
    setFormData({ name: '', domain: '', adminEmail: '', plan: 'trial' });

    const result = await createTenantMutation.execute({
      name: formData.name,
      domain: formData.domain,
      admin_email: formData.adminEmail,
      plan: formData.plan,
    });

    if (result.success) {
      toast.success('Tenant created successfully');
    } else {
      toast.error(result.error?.message || 'Failed to create tenant');
    }
  };

  const handleSuspendTenant = async () => {
    if (selectedTenant) {
      const updated = tenants.map(t =>
        t.id === selectedTenant.id ? { ...t, status: 'suspended' as const } : t
      );
      setTenants(updated);
      setIsSuspendDialogOpen(false);

      const result = await suspendTenantMutation.execute(selectedTenant.id);

      if (result.success) {
        toast.success('Tenant suspended');
      } else {
        toast.error(result.error?.message || 'Failed to suspend tenant');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-gray-600 mt-1">Manage multi-tenant organizations</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{tenants.filter(t => t.status === 'active').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Settings className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Trial</p>
              <p className="text-2xl font-bold text-yellow-600">{tenants.filter(t => t.status === 'trial').length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-red-600">{tenants.filter(t => t.status === 'suspended').length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">All Tenants</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Created</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{tenant.domain}</TableCell>
                <TableCell>
                  <Badge className={
                    tenant.status === 'active' ? 'bg-green-100 text-green-700' :
                    tenant.status === 'trial' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }>
                    {tenant.status}
                  </Badge>
                </TableCell>
                <TableCell>{tenant.users.toLocaleString()}</TableCell>
                <TableCell><Badge className="bg-purple-100 text-purple-700">{tenant.plan}</Badge></TableCell>
                <TableCell>{tenant.created}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTenant(tenant);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTenant(tenant);
                        setFormData({ name: tenant.name, domain: tenant.domain, adminEmail: tenant.admin, plan: tenant.plan.toLowerCase() });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {tenant.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setIsSuspendDialogOpen(true);
                        }}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add Tenant Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>Create a new tenant organization</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Acme Corporation"
              />
            </div>
            <div>
              <Label htmlFor="domain">Domain *</Label>
              <Input
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="acme.example.com"
              />
            </div>
            <div>
              <Label htmlFor="adminEmail">Admin Email *</Label>
              <Input
                id="adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                placeholder="admin@acme.com"
              />
            </div>
            <div>
              <Label htmlFor="plan">Plan *</Label>
              <Select value={formData.plan} onValueChange={(val) => setFormData({ ...formData, plan: val })}>
                <SelectTrigger id="plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTenant} disabled={!formData.name || !formData.domain || !formData.adminEmail}>
              Create Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>Update tenant details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Organization Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-domain">Domain *</Label>
              <Input
                id="edit-domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-plan">Plan *</Label>
              <Select value={formData.plan} onValueChange={(val) => setFormData({ ...formData, plan: val })}>
                <SelectTrigger id="edit-plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success('Tenant updated');
              setIsEditDialogOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
            <DialogDescription>{selectedTenant?.name}</DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Domain</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTenant.domain}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTenant.status}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Users</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTenant.users.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Plan</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTenant.plan}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Admin</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTenant.admin}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Created</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedTenant.created}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Tenant</DialogTitle>
            <DialogDescription>Suspend {selectedTenant?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-sm text-red-900">
                This will suspend access for all users in this tenant. Users will not be able to log in.
              </p>
            </div>
            <Label htmlFor="reason">Suspension Reason *</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for suspension..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSuspendTenant}>
              <Ban className="h-4 w-4 mr-2" />
              Suspend Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}