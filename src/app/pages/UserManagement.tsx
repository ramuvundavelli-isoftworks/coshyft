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
import { Users, Search, UserPlus, Ban, Edit, Trash2, Mail, Shield, Key, Upload, Download, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { adminApi } from '../api';

interface User {
  id: string;
  name: string;
  email: string;
  dept: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
  office?: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@company.com', dept: 'Engineering', role: 'Employee', status: 'active', lastActive: '2026-02-18', office: 'San Francisco HQ' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@company.com', dept: 'Marketing', role: 'Employee', status: 'active', lastActive: '2026-02-18', office: 'San Francisco HQ' },
  { id: '3', name: 'Mike Chen', email: 'mike.chen@company.com', dept: 'Sales', role: 'Employee', status: 'active', lastActive: '2026-02-17', office: 'New York Office' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@company.com', dept: 'HR', role: 'Corporate Admin', status: 'active', lastActive: '2026-02-18', office: 'San Francisco HQ' },
  { id: '5', name: 'Robert Wilson', email: 'robert.w@company.com', dept: 'Finance', role: 'Sustainability Manager', status: 'active', lastActive: '2026-02-18', office: 'San Francisco HQ' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa.a@company.com', dept: 'Operations', role: 'Employee', status: 'suspended', lastActive: '2026-01-15', office: 'London Office' },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [isRoleChangeDialogOpen, setIsRoleChangeDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dept: '',
    role: 'Employee',
    office: 'San Francisco HQ',
  });

  // API mutations
  const updateUserMutation = useApiMutation((data: { userId: string; payload: any }) =>
    adminApi.updateUser(data.userId, data.payload)
  );
  const updateRoleMutation = useApiMutation((data: { userId: string; role: string }) =>
    adminApi.updateUserRole(data.userId, data.role)
  );
  const deactivateUserMutation = useApiMutation((data: { userId: string }) =>
    adminApi.deactivateUser(data.userId)
  );

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async () => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      dept: formData.dept,
      role: formData.role,
      office: formData.office,
      status: 'pending',
      lastActive: new Date().toISOString().split('T')[0],
    };

    // Optimistic local update + API call
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    resetForm();

    const result = await updateUserMutation.execute({
      userId: newUser.id,
      payload: { name: formData.name, email: formData.email, department: formData.dept, role: formData.role },
    });

    if (result.success) {
      toast.success('User added successfully');
    } else {
      toast.error(result.error?.message || 'Failed to add user (changes saved locally)');
    }
  };

  const handleEditUser = async () => {
    if (selectedUser) {
      const updated = users.map(u =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              dept: formData.dept,
              office: formData.office,
            }
          : u
      );
      setUsers(updated);
      setIsEditDialogOpen(false);

      const result = await updateUserMutation.execute({
        userId: selectedUser.id,
        payload: { name: formData.name, email: formData.email, department: formData.dept },
      });

      if (result.success) {
        toast.success('User updated successfully');
      } else {
        toast.error(result.error?.message || 'Failed to update user');
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);

      const result = await deactivateUserMutation.execute({ userId: selectedUser.id });

      if (result.success) {
        toast.success('User deleted successfully');
      } else {
        toast.error(result.error?.message || 'Failed to delete user');
      }
    }
  };

  const handleSuspendUser = async () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === 'suspended' ? 'active' : 'suspended';
      const updated = users.map(u =>
        u.id === selectedUser.id
          ? { ...u, status: newStatus as 'active' | 'suspended' | 'pending' }
          : u
      );
      setUsers(updated);
      setIsSuspendDialogOpen(false);

      const result = await deactivateUserMutation.execute({ userId: selectedUser.id });

      if (result.success) {
        toast.success(selectedUser.status === 'suspended' ? 'User reactivated' : 'User suspended');
      } else {
        toast.error(result.error?.message || 'Failed to update user status');
      }
    }
  };

  const handleChangeRole = async () => {
    if (selectedUser) {
      const updated = users.map(u =>
        u.id === selectedUser.id ? { ...u, role: formData.role } : u
      );
      setUsers(updated);
      setIsRoleChangeDialogOpen(false);

      const result = await updateRoleMutation.execute({
        userId: selectedUser.id,
        role: formData.role,
      });

      if (result.success) {
        toast.success('User role updated');
      } else {
        toast.error(result.error?.message || 'Failed to update role');
      }
    }
  };

  const handleResetPassword = () => {
    if (selectedUser) {
      toast.success(`Password reset email sent to ${selectedUser.email}`);
      setIsResetPasswordDialogOpen(false);
    }
  };

  const handleBulkImport = () => {
    toast.success('Users imported successfully');
    setIsBulkImportDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting user list...');
  };

  const selectUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      dept: user.dept,
      role: user.role,
      office: user.office || 'San Francisco HQ',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      dept: '',
      role: 'Employee',
      office: 'San Francisco HQ',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700">Suspended</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'Employee': 'bg-blue-100 text-blue-700',
      'Corporate Admin': 'bg-purple-100 text-purple-700',
      'Sustainability Manager': 'bg-green-100 text-green-700',
      'Auditor': 'bg-orange-100 text-orange-700',
      'Super Admin': 'bg-red-100 text-red-700',
    };
    return <Badge className={colors[role] || 'bg-gray-100 text-gray-700'}>{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage employee accounts and access
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsBulkImportDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Users
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'active').length}
              </p>
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
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.status === 'suspended').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role.includes('Admin') || u.role.includes('Manager')).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Employee">Employee</SelectItem>
              <SelectItem value="Corporate Admin">Corporate Admin</SelectItem>
              <SelectItem value="Sustainability Manager">Sustainability Manager</SelectItem>
              <SelectItem value="Auditor">Auditor</SelectItem>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                <TableCell>{user.dept}</TableCell>
                <TableCell className="text-sm text-gray-600">{user.office}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(user.lastActive).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        selectUser(user);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        selectUser(user);
                        setIsRoleChangeDialogOpen(true);
                      }}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsResetPasswordDialogOpen(true);
                      }}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsSuspendDialogOpen(true);
                      }}
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account and send invitation email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.smith@company.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dept">Department *</Label>
                <Input
                  id="dept"
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                  placeholder="Engineering"
                />
              </div>
              <div>
                <Label htmlFor="office">Office Location *</Label>
                <Select
                  value={formData.office}
                  onValueChange={(value) => setFormData({ ...formData, office: value })}
                >
                  <SelectTrigger id="office">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="San Francisco HQ">San Francisco HQ</SelectItem>
                    <SelectItem value="New York Office">New York Office</SelectItem>
                    <SelectItem value="London Office">London Office</SelectItem>
                    <SelectItem value="Tokyo Office">Tokyo Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="role">User Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="Corporate Admin">Corporate Admin</SelectItem>
                  <SelectItem value="Sustainability Manager">Sustainability Manager</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={!formData.name || !formData.email || !formData.dept}
            >
              <Mail className="h-4 w-4 mr-2" />
              Add User & Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-dept">Department *</Label>
                <Input
                  id="edit-dept"
                  value={formData.dept}
                  onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-office">Office Location *</Label>
                <Select
                  value={formData.office}
                  onValueChange={(value) => setFormData({ ...formData, office: value })}
                >
                  <SelectTrigger id="edit-office">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="San Francisco HQ">San Francisco HQ</SelectItem>
                    <SelectItem value="New York Office">New York Office</SelectItem>
                    <SelectItem value="London Office">London Office</SelectItem>
                    <SelectItem value="Tokyo Office">Tokyo Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={isRoleChangeDialogOpen} onOpenChange={setIsRoleChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update role for {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                <strong>Current Role:</strong> {getRoleBadge(selectedUser?.role || '')}
              </p>
            </div>
            <Label htmlFor="new-role">New Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger id="new-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Employee">Employee</SelectItem>
                <SelectItem value="Corporate Admin">Corporate Admin</SelectItem>
                <SelectItem value="Sustainability Manager">Sustainability Manager</SelectItem>
                <SelectItem value="Auditor">Auditor</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleChangeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeRole}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend/Reactivate Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === 'suspended' ? 'Reactivate User' : 'Suspend User'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === 'suspended'
                ? `Restore access for ${selectedUser?.name}`
                : `Temporarily disable access for ${selectedUser?.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              {selectedUser?.status === 'suspended'
                ? 'This user will regain access to the platform and can log commute data.'
                : 'This user will lose access to the platform until reactivated.'}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedUser?.status === 'suspended' ? 'default' : 'destructive'}
              onClick={handleSuspendUser}
            >
              {selectedUser?.status === 'suspended' ? 'Reactivate User' : 'Suspend User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send password reset email to {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              An email will be sent to <strong>{selectedUser?.email}</strong> with instructions to reset their password.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              <Mail className="h-4 w-4 mr-2" />
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Permanently remove {selectedUser?.name} from the system
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. All user data and trip history will be permanently deleted.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={isBulkImportDialogOpen} onOpenChange={setIsBulkImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import Users</DialogTitle>
            <DialogDescription>
              Upload CSV file with user information
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop your CSV file here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Required columns: Name, Email, Department, Office, Role
              </p>
              <Button variant="outline">
                Choose File
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkImport}>
              Import Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}