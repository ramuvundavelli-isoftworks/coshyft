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
  MapPin, Plus, Edit, Users, Building2, TrendingDown, Trash2, Eye, RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, useApiMutation, adminApi } from '../api';

export default function AdminLocations() {
  const [isAddOpen, setIsAddOpen]     = useState(false);
  const [isEditOpen, setIsEditOpen]   = useState(false);
  const [isViewOpen, setIsViewOpen]   = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected]       = useState<any>(null);
  const [addForm, setAddForm]         = useState({ name: '', address: '', city: '', country: 'Ireland' });
  const [editForm, setEditForm]       = useState({ name: '', employee_count: 0 });

  const { data, loading, refetch } = useApi(() => adminApi.getLocations(), { deps: [] });
  const locations: any[] = Array.isArray(data) ? data : [];

  const createMutation = useApiMutation((d: any) => adminApi.createLocation(d));
  const updateMutation = useApiMutation((d: { id: string; payload: any }) =>
    adminApi.updateLocation(d.id, d.payload));
  const deleteMutation = useApiMutation((id: string) => adminApi.deleteLocation(id));

  const totalEmployees = locations.reduce((s, l) => s + (l.employee_count ?? 0), 0);
  const totalEmissions = locations.reduce((s, l) => s + (l.total_emissions ?? 0), 0);
  const avgParticipation = locations.length
    ? locations.reduce((s, l) => s + (l.participation_rate ?? 0), 0) / locations.length
    : 0;

  const handleAdd = async () => {
    if (!addForm.name || !addForm.city || !addForm.country) return;
    const r = await createMutation.execute({ ...addForm, region: 'IE' });
    if (r.success) {
      toast.success('Location added');
      refetch();
      setIsAddOpen(false);
      setAddForm({ name: '', address: '', city: '', country: 'Ireland' });
    } else {
      toast.error(r.error?.message ?? 'Failed to add location');
    }
  };

  const handleEdit = async () => {
    if (!selected) return;
    const r = await updateMutation.execute({ id: selected.id, payload: editForm });
    if (r.success) {
      toast.success('Location updated');
      refetch();
      setIsEditOpen(false);
    } else {
      toast.error(r.error?.message ?? 'Failed to update location');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    const r = await deleteMutation.execute(selected.id);
    if (r.success) {
      toast.success('Location deactivated');
      refetch();
      setIsDeleteOpen(false);
    } else {
      toast.error(r.error?.message ?? 'Failed to deactivate location');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Location Management</h1>
          <p className="text-muted-foreground mt-1">Manage office locations and facilities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Location
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([
          ['Locations',          loading ? '—' : locations.length,                  'bg-info-subtle',   Building2,    'text-info'],
          ['Total Employees',    loading ? '—' : totalEmployees,                    'bg-success-subtle',  Users,        'text-success'],
          ['Avg Participation',  loading ? '—' : `${avgParticipation.toFixed(1)}%`, 'bg-info-subtle', MapPin,       'text-info'],
          ['Total Emissions',    loading ? '—' : `${totalEmissions.toFixed(1)} kg`, 'bg-destructive-subtle',    TrendingDown, 'text-destructive'],
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

      {/* Locations List */}
      {loading ? (
        <Card className="p-12 text-center text-muted-foreground">Loading locations...</Card>
      ) : locations.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No locations yet. Add your first office location.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {locations.map((loc: any) => (
            <Card key={loc.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-info-subtle rounded-lg">
                    <Building2 className="h-6 w-6 text-info" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{loc.name}</h3>
                      <Badge className={loc.is_active ? 'bg-success-subtle text-success' : 'bg-muted text-muted-foreground'}>
                        {loc.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {[loc.address, loc.city, loc.country].filter(Boolean).join(', ')}
                    </p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Employees</p>
                        <p className="font-semibold">{loc.employee_count}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Participation</p>
                        <p className="font-semibold">{loc.participation_rate?.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Emissions</p>
                        <p className="font-semibold">{loc.total_emissions?.toFixed(1)} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Intensity</p>
                        <p className="font-semibold">{loc.emission_intensity?.toFixed(2)} kg/emp</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm" onClick={() => { setSelected(loc); setIsViewOpen(true); }}>
                    <Eye className="h-4 w-4 mr-1" />View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelected(loc);
                    setEditForm({ name: loc.name, employee_count: loc.employee_count });
                    setIsEditOpen(true);
                  }}>
                    <Edit className="h-4 w-4 mr-1" />Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setSelected(loc); setIsDeleteOpen(true); }}>
                    <Trash2 className="h-4 w-4 mr-1" />Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>Create a new office location</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Location Name *</Label>
              <Input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g., Dublin HQ" />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={addForm.address} onChange={e => setAddForm({ ...addForm, address: e.target.value })} placeholder="123 Main Street" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City *</Label>
                <Input value={addForm.city} onChange={e => setAddForm({ ...addForm, city: e.target.value })} placeholder="Dublin" />
              </div>
              <div>
                <Label>Country *</Label>
                <Input value={addForm.country} onChange={e => setAddForm({ ...addForm, country: e.target.value })} placeholder="Ireland" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!addForm.name || !addForm.city || !addForm.country || createMutation.loading}>
              {createMutation.loading ? 'Adding...' : 'Add Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update {selected?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Location Name</Label>
              <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Employee Count</Label>
              <Input type="number" min={0} value={editForm.employee_count}
                onChange={e => setEditForm({ ...editForm, employee_count: parseInt(e.target.value) || 0 })} />
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              {[selected?.address, selected?.city, selected?.country].filter(Boolean).join(', ')}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                {([
                  ['Employees',    selected.employee_count],
                  ['Participation', `${selected.participation_rate?.toFixed(1)}%`],
                  ['Total Emissions', `${selected.total_emissions?.toFixed(1)} kg`],
                  ['Intensity',    `${selected.emission_intensity?.toFixed(2)} kg/emp`],
                  ['Parking Spaces', selected.parking_spaces],
                  ['Bike Parking', selected.bike_parking],
                  ['EV Chargers',  selected.ev_chargers],
                  ['Region',       selected.region],
                ] as [string, any][]).map(([k, v]) => (
                  <Card key={k} className="p-3">
                    <Label className="text-xs text-muted-foreground">{k}</Label>
                    <p className="font-semibold mt-1">{v}</p>
                  </Card>
                ))}
              </div>
              {selected.public_transport_access && (
                <div>
                  <Label className="text-xs text-muted-foreground">Public Transport Access</Label>
                  <p className="font-medium mt-1 capitalize">{selected.public_transport_access}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Location</DialogTitle>
            <DialogDescription>Remove {selected?.name} from active locations</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-destructive-subtle border border-destructive/25 rounded-lg">
              <p className="text-sm text-destructive">
                This will deactivate the location. It won't be visible in reports, but historical data is preserved.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.loading}>
              {deleteMutation.loading ? 'Deactivating...' : 'Deactivate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
