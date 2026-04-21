import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  FileText, Plus, Edit, CheckCircle, Clock, Trash2, Eye, RefreshCw, Copy,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation, adminApi } from '../api';

const STATUS_BADGE: Record<string, string> = {
  active:   'bg-success-subtle text-success',
  draft:    'bg-warning-subtle text-warning',
  archived: 'bg-muted text-muted-foreground',
};

const CATEGORY_BADGE: Record<string, string> = {
  carpool:   'bg-info-subtle text-info',
  parking:   'bg-info-subtle text-info',
  transit:   'bg-success-subtle text-success',
  incentive: 'bg-warning-subtle text-warning',
  general:   'bg-muted text-foreground',
};

const EMPTY_FORM = { title: '', description: '', category: 'general', effective_date: '' };

export default function AdminPolicies() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen,   setIsEditOpen]   = useState(false);
  const [isViewOpen,   setIsViewOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected]         = useState<any>(null);
  const [form, setForm]                 = useState(EMPTY_FORM);

  const { data, loading, refetch } = useApi(() => adminApi.getPolicies(), { deps: [] });
  const policies: any[] = Array.isArray(data) ? data : [];

  const createMutation = useApiMutation((d: any) => adminApi.createPolicy(d));
  const updateMutation = useApiMutation((d: { id: string; payload: any }) =>
    adminApi.updatePolicy(d.id, d.payload));
  const deleteMutation = useApiMutation((id: string) => adminApi.deletePolicy(id));

  const active   = policies.filter(p => p.status === 'active').length;
  const draft    = policies.filter(p => p.status === 'draft').length;
  const archived = policies.filter(p => p.status === 'archived').length;

  const handleCreate = async () => {
    if (!form.title || !form.category) return;
    const r = await createMutation.execute({
      title: form.title,
      description: form.description,
      category: form.category,
      effective_date: form.effective_date || null,
    });
    if (r.success) {
      toast.success('Policy created');
      refetch();
      setIsCreateOpen(false);
      setForm(EMPTY_FORM);
    } else {
      toast.error(r.error?.message ?? 'Failed to create policy');
    }
  };

  const handleEdit = async () => {
    if (!selected) return;
    const r = await updateMutation.execute({
      id: selected.id,
      payload: {
        title: form.title,
        description: form.description,
        effective_date: form.effective_date || null,
      },
    });
    if (r.success) {
      toast.success('Policy updated');
      refetch();
      setIsEditOpen(false);
    } else {
      toast.error(r.error?.message ?? 'Failed to update policy');
    }
  };

  const handleStatusChange = async (id: string, status: string, label: string) => {
    const r = await updateMutation.execute({ id, payload: { status } });
    if (r.success) {
      toast.success(`Policy ${label}`);
      refetch();
    } else {
      toast.error(r.error?.message ?? `Failed to ${label.toLowerCase()} policy`);
    }
  };

  const handleDuplicate = async () => {
    if (!selected) return;
    const r = await createMutation.execute({
      title: `${selected.title} (Copy)`,
      description: selected.description,
      category: selected.category,
      effective_date: selected.effective_date,
    });
    if (r.success) {
      toast.success('Policy duplicated');
      refetch();
    } else {
      toast.error(r.error?.message ?? 'Failed to duplicate');
    }
    setIsViewOpen(false);
  };

  const handleDelete = async () => {
    if (!selected) return;
    const r = await deleteMutation.execute(selected.id);
    if (r.success) {
      toast.success('Policy deleted');
      refetch();
      setIsDeleteOpen(false);
    } else {
      toast.error(r.error?.message ?? 'Failed to delete policy');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Policy Management</h1>
          <p className="text-muted-foreground mt-1">Configure and manage commute policies and guidelines</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => { setForm(EMPTY_FORM); setIsCreateOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />Create Policy
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([
          ['Total',    loading ? '—' : policies.length, 'bg-info-subtle',   FileText,     'text-info'],
          ['Active',   loading ? '—' : active,          'bg-success-subtle',  CheckCircle,  'text-success'],
          ['Draft',    loading ? '—' : draft,           'bg-warning-subtle', Clock,        'text-warning'],
          ['Archived', loading ? '—' : archived,        'bg-muted',   FileText,     'text-muted-foreground'],
        ] as any[]).map(([label, val, bg, Icon, ic]) => (
          <Card key={label} className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${bg} rounded-lg`}><Icon className={`h-5 w-5 ${ic}`} /></div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{val}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Policies List */}
      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">Loading policies...</Card>
      ) : policies.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No policies yet. Create your first policy.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {policies.map((policy: any) => (
            <Card key={policy.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{policy.title}</h3>
                    <Badge className={STATUS_BADGE[policy.status] ?? 'bg-muted'}>{policy.status}</Badge>
                    <Badge className={CATEGORY_BADGE[policy.category] ?? 'bg-muted'}>{policy.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{policy.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {policy.effective_date && (
                      <span>Effective: {new Date(policy.effective_date).toLocaleDateString()}</span>
                    )}
                    <span>Created: {new Date(policy.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => { setSelected(policy); setIsViewOpen(true); }}>
                    <Eye className="h-4 w-4 mr-1" />View
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelected(policy);
                    setForm({ title: policy.title, description: policy.description ?? '', category: policy.category, effective_date: policy.effective_date ?? '' });
                    setIsEditOpen(true);
                  }}>
                    <Edit className="h-4 w-4 mr-1" />Edit
                  </Button>
                  {policy.status === 'draft' && (
                    <Button size="sm" onClick={() => handleStatusChange(policy.id, 'active', 'published')}>
                      <CheckCircle className="h-4 w-4 mr-1" />Publish
                    </Button>
                  )}
                  {policy.status === 'active' && (
                    <Button variant="ghost" size="sm" onClick={() => handleStatusChange(policy.id, 'archived', 'archived')}>
                      Archive
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => { setSelected(policy); setIsDeleteOpen(true); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Policy</DialogTitle>
            <DialogDescription>Define a new commute policy</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Policy title" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief summary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carpool">Carpool</SelectItem>
                    <SelectItem value="parking">Parking</SelectItem>
                    <SelectItem value="transit">Public Transit</SelectItem>
                    <SelectItem value="incentive">Incentive</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Effective Date</Label>
                <Input type="date" value={form.effective_date} onChange={e => setForm({ ...form, effective_date: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.title || createMutation.loading}>
              {createMutation.loading ? 'Creating...' : 'Create Policy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>{selected?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div>
              <Label>Effective Date</Label>
              <Input type="date" value={form.effective_date} onChange={e => setForm({ ...form, effective_date: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={updateMutation.loading}>
              {updateMutation.loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>Policy details</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge className={STATUS_BADGE[selected.status] ?? ''}>{selected.status}</Badge>
                <Badge className={CATEGORY_BADGE[selected.category] ?? ''}>{selected.category}</Badge>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Description</Label>
                <p className="mt-1 text-foreground">{selected.description || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Effective Date</Label>
                  <p className="mt-1">{selected.effective_date ? new Date(selected.effective_date).toLocaleDateString() : '—'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Created</Label>
                  <p className="mt-1">{new Date(selected.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleDuplicate} disabled={createMutation.loading}>
              <Copy className="h-4 w-4 mr-2" />Duplicate
            </Button>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Policy</DialogTitle>
            <DialogDescription>Permanently delete "{selected?.title}"</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-destructive-subtle border border-destructive/25 rounded-lg text-sm text-destructive">
              This action cannot be undone.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.loading}>
              {deleteMutation.loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
