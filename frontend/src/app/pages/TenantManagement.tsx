import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
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
import { Building2, Plus, Eye, Settings, UserCheck, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { superadminApi } from '../api';

export default function TenantManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [addForm, setAddForm] = useState({ name: '', slug: '', contact_name: '', contact_email: '', plan: 'starter' });
  const [editForm, setEditForm] = useState<Record<string, any>>({});

  const { data: tenantsData, loading, refetch } = useApi(() => superadminApi.getTenants());

  const createMutation   = useApiMutation((data: any) => superadminApi.createTenant(data));
  const updateMutation   = useApiMutation(({ id, data }: any) => superadminApi.updateTenant(id, data));
  const suspendMutation  = useApiMutation((id: string) => superadminApi.suspendTenant(id));
  const activateMutation = useApiMutation((id: string) => superadminApi.activateTenant(id));
  const deleteMutation   = useApiMutation((id: string) => superadminApi.deleteTenant(id));

  const tenants: any[] = Array.isArray(tenantsData) ? tenantsData : [];

  const handleAddTenant = async () => {
    if (!addForm.name || !addForm.slug || !addForm.contact_email || !addForm.contact_name) {
      toast.error('Please fill in all required fields');
      return;
    }
    const result = await createMutation.execute(addForm);
    if (result.success) {
      toast.success('Tenant created successfully');
      setIsAddDialogOpen(false);
      setAddForm({ name: '', slug: '', contact_name: '', contact_email: '', plan: 'starter' });
      refetch();
    } else {
      toast.error(result.error?.message || 'Failed to create tenant');
    }
  };

  const handleEditTenant = async () => {
    if (!selectedTenant) return;
    const result = await updateMutation.execute({ id: selectedTenant.id, data: editForm });
    if (result.success) {
      toast.success('Tenant updated');
      setIsEditDialogOpen(false);
      refetch();
    } else {
      toast.error(result.error?.message || 'Failed to update tenant');
    }
  };

  const handleSuspend = async () => {
    if (!selectedTenant) return;
    const result = await suspendMutation.execute(selectedTenant.id);
    if (result.success) {
      toast.success(`${selectedTenant.name} suspended`);
      setIsSuspendDialogOpen(false);
      refetch();
    } else {
      toast.error(result.error?.message || 'Failed to suspend tenant');
    }
  };

  const handleActivate = async () => {
    if (!selectedTenant) return;
    const result = await activateMutation.execute(selectedTenant.id);
    if (result.success) {
      toast.success(`${selectedTenant.name} activated`);
      setIsActivateDialogOpen(false);
      refetch();
    } else {
      toast.error(result.error?.message || 'Failed to activate tenant');
    }
  };

  const handleDelete = async (tenant: any) => {
    const result = await deleteMutation.execute(tenant.id);
    if (result.success) {
      toast.success(`${tenant.name} deactivated`);
      refetch();
    } else {
      toast.error(result.error?.message || 'Failed to deactivate tenant');
    }
  };

  const statusCounts = {
    active:    tenants.filter(t => t.status === 'active').length,
    trial:     tenants.filter(t => t.status === 'trial').length,
    suspended: tenants.filter(t => t.status === 'suspended').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
          <p className="text-gray-600 mt-1">Manage multi-tenant organisations</p>
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
            <div className="p-2 bg-blue-100 rounded-lg"><Building2 className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Total Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{tenants.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><UserCheck className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><Settings className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Trial</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.trial}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg"><Ban className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="text-sm text-gray-600">Suspended</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.suspended}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">All Tenants</h3>
        {loading ? (
          <p className="text-sm text-gray-500 py-4 text-center">Loading tenants...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organisation</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell className="text-sm text-gray-500">{tenant.slug}</TableCell>
                  <TableCell>
                    <Badge className={
                      tenant.status === 'active'      ? 'bg-green-100 text-green-700' :
                      tenant.status === 'trial'       ? 'bg-blue-100 text-blue-700' :
                      tenant.status === 'suspended'   ? 'bg-red-100 text-red-700' :
                                                        'bg-gray-100 text-gray-700'
                    }>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{(tenant.user_count ?? 0).toLocaleString()}</TableCell>
                  <TableCell><Badge className="bg-purple-100 text-purple-700">{tenant.plan}</Badge></TableCell>
                  <TableCell>{tenant.primary_region}</TableCell>
                  <TableCell className="text-sm text-gray-600">{tenant.contact_email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedTenant(tenant); setIsViewDialogOpen(true); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedTenant(tenant);
                        setEditForm({ name: tenant.name, plan: tenant.plan, contact_email: tenant.contact_email, contact_name: tenant.contact_name });
                        setIsEditDialogOpen(true);
                      }}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      {(tenant.status === 'active' || tenant.status === 'trial') && (
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedTenant(tenant); setIsSuspendDialogOpen(true); }}>
                          <Ban className="h-4 w-4 text-orange-500" />
                        </Button>
                      )}
                      {tenant.status === 'suspended' && (
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedTenant(tenant); setIsActivateDialogOpen(true); }}>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                      {tenant.status !== 'deactivated' && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(tenant)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add Tenant Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>Create a new tenant organisation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Organisation Name *</Label>
              <Input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Acme Corporation" />
            </div>
            <div>
              <Label>Slug (URL identifier) *</Label>
              <Input value={addForm.slug} onChange={e => setAddForm({ ...addForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="acme-corp" />
            </div>
            <div>
              <Label>Contact Name *</Label>
              <Input value={addForm.contact_name} onChange={e => setAddForm({ ...addForm, contact_name: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div>
              <Label>Contact Email *</Label>
              <Input type="email" value={addForm.contact_email} onChange={e => setAddForm({ ...addForm, contact_email: e.target.value })} placeholder="admin@example.com" />
            </div>
            <div>
              <Label>Plan *</Label>
              <Select value={addForm.plan} onValueChange={val => setAddForm({ ...addForm, plan: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTenant} disabled={createMutation.loading}>
              {createMutation.loading ? 'Creating...' : 'Create Tenant'}
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
              <Label>Organisation Name</Label>
              <Input value={editForm.name ?? ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Contact Name</Label>
              <Input value={editForm.contact_name ?? ''} onChange={e => setEditForm({ ...editForm, contact_name: e.target.value })} />
            </div>
            <div>
              <Label>Contact Email</Label>
              <Input type="email" value={editForm.contact_email ?? ''} onChange={e => setEditForm({ ...editForm, contact_email: e.target.value })} />
            </div>
            <div>
              <Label>Plan</Label>
              <Select value={editForm.plan ?? 'starter'} onValueChange={val => setEditForm({ ...editForm, plan: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditTenant} disabled={updateMutation.loading}>
              {updateMutation.loading ? 'Saving...' : 'Save Changes'}
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
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                {([
                  ['Slug', selectedTenant.slug],
                  ['Status', selectedTenant.status],
                  ['Plan', selectedTenant.plan],
                  ['Region', selectedTenant.primary_region],
                  ['Users', (selectedTenant.user_count ?? 0).toLocaleString()],
                  ['Offices', selectedTenant.office_count ?? 0],
                  ['Emissions (tCO₂e)', (selectedTenant.total_emissions ?? 0).toLocaleString()],
                  ['Contact', selectedTenant.contact_name],
                  ['Contact Email', selectedTenant.contact_email],
                  ['Billing Email', selectedTenant.billing_email ?? '—'],
                ] as [string, any][]).map(([k, v]) => (
                  <div key={k}>
                    <Label className="text-sm text-gray-600">{k}</Label>
                    <p className="font-medium text-gray-900 mt-1">{v}</p>
                  </div>
                ))}
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
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">
                This will suspend access for all users in this tenant. They cannot log in until reactivated.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSuspend} disabled={suspendMutation.loading}>
              <Ban className="h-4 w-4 mr-2" />
              {suspendMutation.loading ? 'Suspending...' : 'Suspend Tenant'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activate Dialog */}
      <Dialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Tenant</DialogTitle>
            <DialogDescription>Reactivate {selectedTenant?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                This will restore full platform access for all users in this tenant.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActivateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleActivate} disabled={activateMutation.loading} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              {activateMutation.loading ? 'Activating...' : 'Activate Tenant'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
