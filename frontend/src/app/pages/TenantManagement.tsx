import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
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
import { Building2, Plus, Eye, Settings, UserCheck, Ban, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { superadminApi } from '../api';

export default function TenantManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAddAdminDialogOpen, setIsAddAdminDialogOpen] = useState(false);
  const [isToggleConfirmOpen, setIsToggleConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [addForm, setAddForm] = useState({ name: '', slug: '', contact_name: '', contact_email: '', plan: 'starter' });
  const [editForm, setEditForm] = useState<Record<string, any>>({});
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', role: 'admin', department: '' });

  const { data: tenantsData, loading, refetch } = useApi(() => superadminApi.getTenants());

  const createMutation      = useApiMutation((data: any) => superadminApi.createTenant(data));
  const createAdminMutation = useApiMutation(({ tenantId, data }: any) => superadminApi.createTenantUser(tenantId, data));
  const updateMutation      = useApiMutation(({ id, data }: any) => superadminApi.updateTenant(id, data));
  const suspendMutation     = useApiMutation((id: string) => superadminApi.suspendTenant(id));
  const activateMutation    = useApiMutation((id: string) => superadminApi.activateTenant(id));
  const deleteMutation      = useApiMutation((id: string) => superadminApi.deleteTenant(id));

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

  const handleToggleStatus = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsToggleConfirmOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!selectedTenant) return;
    const isActive = selectedTenant.status === 'active' || selectedTenant.status === 'trial';
    const result = isActive
      ? await suspendMutation.execute(selectedTenant.id)
      : await activateMutation.execute(selectedTenant.id);
    if (result.success) {
      toast.success(`${selectedTenant.name} ${isActive ? 'suspended' : 'activated'}`);
      setIsToggleConfirmOpen(false);
      refetch();
    } else {
      toast.error(result.error?.message || 'Failed to update status');
    }
  };

  const handleAddAdmin = async () => {
    if (!selectedTenant) return;
    if (!adminForm.name || !adminForm.email || !adminForm.password) {
      toast.error('Name, email, and password are required');
      return;
    }
    const result = await createAdminMutation.execute({
      tenantId: selectedTenant.id,
      data: {
        name: adminForm.name,
        email: adminForm.email,
        password: adminForm.password,
        role: adminForm.role,
        department: adminForm.department || undefined,
      },
    });
    if (result.success) {
      toast.success(`Admin user created for ${selectedTenant.name}`);
      setIsAddAdminDialogOpen(false);
      setAdminForm({ name: '', email: '', password: '', role: 'admin', department: '' });
      refetch();
    } else {
      toast.error(result.error?.message || 'Failed to create admin user');
    }
  };

  const handleDelete = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTenant) return;
    const result = await deleteMutation.execute(selectedTenant.id);
    if (result.success) {
      toast.success(`${selectedTenant.name} deactivated`);
      setIsDeleteConfirmOpen(false);
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
          <h1 className="text-3xl font-bold text-foreground">Tenant Management</h1>
          <p className="text-muted-foreground mt-1">Manage multi-tenant organisations</p>
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
            <div className="p-2 bg-info-subtle rounded-lg"><Building2 className="h-5 w-5 text-info" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tenants</p>
              <p className="text-2xl font-bold text-foreground">{tenants.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg"><UserCheck className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-success">{statusCounts.active}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg"><Settings className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Trial</p>
              <p className="text-2xl font-bold text-warning">{statusCounts.trial}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive-subtle rounded-lg"><Ban className="h-5 w-5 text-destructive" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Suspended</p>
              <p className="text-2xl font-bold text-destructive">{statusCounts.suspended}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">All Tenants</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading tenants...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organisation</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
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
                  <TableCell className="text-sm text-muted-foreground">{tenant.slug}</TableCell>
                  <TableCell>
                    <Badge className={
                      tenant.status === 'active'      ? 'bg-success-subtle text-success' :
                      tenant.status === 'trial'       ? 'bg-info-subtle text-info' :
                      tenant.status === 'suspended'   ? 'bg-destructive-subtle text-destructive' :
                                                        'bg-muted text-foreground'
                    }>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={tenant.status === 'active' || tenant.status === 'trial'}
                      disabled={tenant.status === 'deactivated' || suspendMutation.loading || activateMutation.loading}
                      onCheckedChange={() => handleToggleStatus(tenant)}
                    />
                  </TableCell>
                  <TableCell>{(tenant.user_count ?? 0).toLocaleString()}</TableCell>
                  <TableCell><Badge className="bg-info-subtle text-info">{tenant.plan}</Badge></TableCell>
                  <TableCell>{tenant.primary_region}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tenant.contact_email}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedTenant(tenant); setIsViewDialogOpen(true); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Add Admin User" onClick={() => { setSelectedTenant(tenant); setIsAddAdminDialogOpen(true); }}>
                        <UserPlus className="h-4 w-4 text-info" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedTenant(tenant);
                        setEditForm({ name: tenant.name, plan: tenant.plan, contact_email: tenant.contact_email, contact_name: tenant.contact_name });
                        setIsEditDialogOpen(true);
                      }}>
                        <Settings className="h-4 w-4" />
                      </Button>
                      {tenant.status !== 'deactivated' && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(tenant)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
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
                    <Label className="text-sm text-muted-foreground">{k}</Label>
                    <p className="font-medium text-foreground mt-1">{v}</p>
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

      {/* Add Admin Dialog */}
      <Dialog open={isAddAdminDialogOpen} onOpenChange={setIsAddAdminDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Admin User</DialogTitle>
            <DialogDescription>Create a corporate admin for {selectedTenant?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name *</Label>
              <Input value={adminForm.name} onChange={e => setAdminForm({ ...adminForm, name: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={adminForm.email} onChange={e => setAdminForm({ ...adminForm, email: e.target.value })} placeholder="admin@company.com" />
            </div>
            <div>
              <Label>Password *</Label>
              <Input type="password" value={adminForm.password} onChange={e => setAdminForm({ ...adminForm, password: e.target.value })} placeholder="Min 8 characters" />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={adminForm.role} onValueChange={val => setAdminForm({ ...adminForm, role: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="sustainability">Sustainability Manager</SelectItem>
                  <SelectItem value="auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Input value={adminForm.department} onChange={e => setAdminForm({ ...adminForm, department: e.target.value })} placeholder="Operations (optional)" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAdminDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAdmin} disabled={createAdminMutation.loading}>
              <UserPlus className="h-4 w-4 mr-2" />
              {createAdminMutation.loading ? 'Creating...' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Confirmation */}
      <Dialog open={isToggleConfirmOpen} onOpenChange={setIsToggleConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTenant?.status === 'active' || selectedTenant?.status === 'trial'
                ? 'Suspend Tenant'
                : 'Activate Tenant'}
            </DialogTitle>
            <DialogDescription>{selectedTenant?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {(selectedTenant?.status === 'active' || selectedTenant?.status === 'trial') ? (
              <div className="p-4 bg-warning-subtle border border-warning/25 rounded-lg">
                <p className="text-sm text-warning">
                  Suspending this tenant will block all users from logging in until reactivated.
                  Are you sure you want to suspend <strong>{selectedTenant?.name}</strong>?
                </p>
              </div>
            ) : (
              <div className="p-4 bg-success-subtle border border-success/25 rounded-lg">
                <p className="text-sm text-success">
                  This will restore full platform access for all users in <strong>{selectedTenant?.name}</strong>.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsToggleConfirmOpen(false)}>Cancel</Button>
            <Button
              onClick={confirmToggleStatus}
              disabled={suspendMutation.loading || activateMutation.loading}
              className={
                (selectedTenant?.status === 'active' || selectedTenant?.status === 'trial')
                  ? 'bg-warning hover:bg-warning text-white'
                  : 'bg-success hover:bg-success text-white'
              }
            >
              {suspendMutation.loading || activateMutation.loading
                ? 'Updating...'
                : (selectedTenant?.status === 'active' || selectedTenant?.status === 'trial')
                  ? 'Yes, Suspend'
                  : 'Yes, Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Tenant</DialogTitle>
            <DialogDescription>{selectedTenant?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-destructive-subtle border border-destructive/25 rounded-lg">
              <p className="text-sm text-destructive">
                This will permanently deactivate <strong>{selectedTenant?.name}</strong>.
                All users will lose access and this action cannot be easily reversed.
                Are you sure?
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.loading}>
              {deleteMutation.loading ? 'Deactivating...' : 'Yes, Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
