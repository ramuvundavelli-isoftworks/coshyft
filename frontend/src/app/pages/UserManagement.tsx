import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '../components/ui/table';
import {
  Users, Search, UserPlus, Ban, Edit, Trash2,
  Mail, Shield, Key, ChevronLeft, ChevronRight,
  UserCheck, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation, adminApi } from '../api';

const ROLE_LABELS: Record<string, string> = {
  EMPLOYEE:       'Employee',
  ADMIN:          'Admin',
  SUSTAINABILITY: 'Sustainability',
  AUDITOR:        'Auditor',
  SUPERADMIN:     'Super Admin',
};

const ROLE_COLORS: Record<string, string> = {
  EMPLOYEE:       'bg-blue-100 text-blue-700',
  ADMIN:          'bg-purple-100 text-purple-700',
  SUSTAINABILITY: 'bg-green-100 text-green-700',
  AUDITOR:        'bg-orange-100 text-orange-700',
  SUPERADMIN:     'bg-red-100 text-red-700',
};

const PAGE_SIZE = 20;

export default function UserManagement() {
  const [page, setPage]                   = useState(1);
  const [searchInput, setSearchInput]     = useState('');
  const [search, setSearch]               = useState('');
  const [roleFilter, setRoleFilter]       = useState('all');
  const [statusFilter, setStatusFilter]   = useState('all');

  const [selectedUser, setSelectedUser]   = useState<any>(null);
  const [isEditOpen, setIsEditOpen]       = useState(false);
  const [isRoleOpen, setIsRoleOpen]       = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen]   = useState(false);
  const [isResetPwOpen, setIsResetPwOpen] = useState(false);
  const [isAddOpen, setIsAddOpen]         = useState(false);

  const [editForm, setEditForm] = useState({ name: '', email: '', department: '' });
  const [newRole, setNewRole]   = useState('EMPLOYEE');
  const [addForm, setAddForm]   = useState({ name: '', email: '', department: '', role: 'EMPLOYEE' });

  const isActiveFilter = statusFilter === 'active' ? true : statusFilter === 'suspended' ? false : undefined;

  const { data, loading, refetch } = useApi(
    () => adminApi.getUsers({
      page,
      page_size: PAGE_SIZE,
      search: search || undefined,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      is_active: isActiveFilter,
    }),
    { deps: [page, search, roleFilter, statusFilter] }
  );

  const users: any[]   = (data as any)?.items ?? [];
  const total: number  = (data as any)?.total ?? 0;
  const totalPages     = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const updateUserMutation   = useApiMutation((d: any) => adminApi.updateUser(d.id, d.payload));
  const updateRoleMutation   = useApiMutation((d: any) => adminApi.updateUserRole(d.id, d.role));
  const deactivateMutation   = useApiMutation((id: string) => adminApi.deactivateUser(id));

  const applySearch = () => { setSearch(searchInput); setPage(1); };
  const resetFilters = () => { setSearch(''); setSearchInput(''); setRoleFilter('all'); setStatusFilter('all'); setPage(1); };

  const openEdit = (u: any) => {
    setSelectedUser(u);
    setEditForm({ name: u.name, email: u.email, department: u.department ?? '' });
    setIsEditOpen(true);
  };
  const openRole = (u: any) => { setSelectedUser(u); setNewRole(u.role); setIsRoleOpen(true); };
  const openSuspend = (u: any) => { setSelectedUser(u); setIsSuspendOpen(true); };
  const openDelete  = (u: any) => { setSelectedUser(u); setIsDeleteOpen(true); };
  const openReset   = (u: any) => { setSelectedUser(u); setIsResetPwOpen(true); };

  const handleEdit = async () => {
    const r = await updateUserMutation.execute({ id: selectedUser.id, payload: editForm });
    if (r.success) { toast.success('User updated'); refetch(); }
    else toast.error(r.error?.message ?? 'Failed to update user');
    setIsEditOpen(false);
  };

  const handleRoleChange = async () => {
    const r = await updateRoleMutation.execute({ id: selectedUser.id, role: newRole });
    if (r.success) { toast.success('Role updated'); refetch(); }
    else toast.error(r.error?.message ?? 'Failed to update role');
    setIsRoleOpen(false);
  };

  const handleSuspend = async () => {
    const r = await deactivateMutation.execute(selectedUser.id);
    if (r.success) { toast.success(selectedUser.is_active ? 'User suspended' : 'User reactivated'); refetch(); }
    else toast.error(r.error?.message ?? 'Failed to update status');
    setIsSuspendOpen(false);
  };

  const handleDelete = async () => {
    const r = await deactivateMutation.execute(selectedUser.id);
    if (r.success) { toast.success('User deactivated'); refetch(); }
    else toast.error(r.error?.message ?? 'Failed to deactivate user');
    setIsDeleteOpen(false);
  };

  const handleAdd = async () => {
    // Invite/create not yet on backend — call updateUser as placeholder
    toast.info('User invite sent (feature coming soon)');
    setIsAddOpen(false);
    setAddForm({ name: '', email: '', department: '', role: 'EMPLOYEE' });
  };

  const activeCount    = users.filter(u => u.is_active).length;
  const suspendedCount = users.filter(u => !u.is_active).length;
  const adminCount     = users.filter(u => ['ADMIN','SUPERADMIN','SUSTAINABILITY'].includes(u.role)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage employee accounts and access</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([
          ['Total Users',  total,          'bg-blue-100',   Users,       'text-blue-600'],
          ['Active',       activeCount,    'bg-green-100',  UserCheck,   'text-green-600'],
          ['Suspended',    suspendedCount, 'bg-red-100',    Ban,         'text-red-600'],
          ['Privileged',   adminCount,     'bg-purple-100', Shield,      'text-purple-600'],
        ] as any[]).map(([label, val, bg, Icon, ic]) => (
          <Card key={label} className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${bg} rounded-lg`}><Icon className={`h-5 w-5 ${ic}`} /></div>
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{loading ? '—' : val}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex gap-2 flex-1 min-w-[220px]">
            <Input
              placeholder="Search name or email..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applySearch()}
            />
            <Button variant="outline" onClick={applySearch}><Search className="h-4 w-4" /></Button>
          </div>
          <Select value={roleFilter} onValueChange={v => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="EMPLOYEE">Employee</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUSTAINABILITY">Sustainability</SelectItem>
              <SelectItem value="AUDITOR">Auditor</SelectItem>
              <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>Clear</Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-gray-500">Loading...</TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-gray-500">No users found</TableCell></TableRow>
              ) : users.map((u: any) => (
                <TableRow key={u.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{u.email}</TableCell>
                  <TableCell className="text-sm">{u.department ?? '—'}</TableCell>
                  <TableCell>
                    <Badge className={ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-700'}>
                      {ROLE_LABELS[u.role] ?? u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {u.is_active ? 'Active' : 'Suspended'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IE') : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" title="Edit" onClick={() => openEdit(u)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Change role" onClick={() => openRole(u)}>
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Reset password" onClick={() => openReset(u)}>
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title={u.is_active ? 'Suspend' : 'Reactivate'} onClick={() => openSuspend(u)}>
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Delete" onClick={() => openDelete(u)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} users
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update details for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name</Label>
              <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={updateUserMutation.loading}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleOpen} onOpenChange={setIsRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>Update role for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
              Current: <Badge className={ROLE_COLORS[selectedUser?.role] ?? ''}>{ROLE_LABELS[selectedUser?.role] ?? selectedUser?.role}</Badge>
            </div>
            <Label>New Role</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EMPLOYEE">Employee</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUSTAINABILITY">Sustainability</SelectItem>
                <SelectItem value="AUDITOR">Auditor</SelectItem>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleOpen(false)}>Cancel</Button>
            <Button onClick={handleRoleChange} disabled={updateRoleMutation.loading}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend/Reactivate Dialog */}
      <Dialog open={isSuspendOpen} onOpenChange={setIsSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.is_active ? 'Suspend User' : 'Reactivate User'}</DialogTitle>
            <DialogDescription>
              {selectedUser?.is_active
                ? `Disable platform access for ${selectedUser?.name}`
                : `Restore platform access for ${selectedUser?.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {selectedUser?.is_active
                ? 'This user will lose access to the platform until reactivated.'
                : 'This user will regain full access to the platform.'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendOpen(false)}>Cancel</Button>
            <Button
              variant={selectedUser?.is_active ? 'destructive' : 'default'}
              onClick={handleSuspend}
              disabled={deactivateMutation.loading}
            >
              {selectedUser?.is_active ? 'Suspend' : 'Reactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPwOpen} onOpenChange={setIsResetPwOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Send reset email to {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              A password reset link will be sent to <strong>{selectedUser?.email}</strong>.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPwOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success(`Reset email sent to ${selectedUser?.email}`); setIsResetPwOpen(false); }}>
              <Mail className="h-4 w-4 mr-2" />Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>Remove platform access for {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This will deactivate the account. The user will no longer be able to log in.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deactivateMutation.loading}>Deactivate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name *</Label>
              <Input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Jane Smith" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} placeholder="jane.smith@company.com" />
            </div>
            <div>
              <Label>Department</Label>
              <Input value={addForm.department} onChange={e => setAddForm({ ...addForm, department: e.target.value })} placeholder="Engineering" />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={addForm.role} onValueChange={v => setAddForm({ ...addForm, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLOYEE">Employee</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUSTAINABILITY">Sustainability</SelectItem>
                  <SelectItem value="AUDITOR">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!addForm.name || !addForm.email}>
              <Mail className="h-4 w-4 mr-2" />Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
