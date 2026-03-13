import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  MapPin,
  Plus,
  Edit,
  Users,
  Building2,
  TrendingDown,
  CheckCircle,
  Trash2,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApiMutation } from '../api';
import { adminApi } from '../api';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  employees: number;
  enrolled: number;
  active: number;
  emissions: number;
  status: 'active' | 'inactive';
}

const mockLocations: Location[] = [
  { id: 'loc1', name: 'HQ - Tech Park', address: '123 Innovation Drive', city: 'San Francisco', country: 'USA', employees: 1240, enrolled: 1048, active: 967, emissions: 458.3, status: 'active' },
  { id: 'loc2', name: 'Downtown Office', address: '456 Market Street', city: 'San Francisco', country: 'USA', employees: 680, enrolled: 612, active: 571, emissions: 245.7, status: 'active' },
  { id: 'loc3', name: 'East Campus', address: '789 Tech Boulevard', city: 'San Jose', country: 'USA', employees: 520, enrolled: 494, active: 473, emissions: 198.4, status: 'active' },
];

export default function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
  });

  // API mutations
  const createLocationMutation = useApiMutation((data: any) =>
    adminApi.createLocation(data)
  );
  const updateLocationMutation = useApiMutation((data: { id: string; payload: any }) =>
    adminApi.updateLocation(data.id, data.payload)
  );
  const deleteLocationMutation = useApiMutation((id: string) =>
    adminApi.deleteLocation(id)
  );

  const handleAddLocation = async () => {
    const newLocation: Location = {
      id: `loc-${Date.now()}`,
      name: formData.name,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      employees: 0,
      enrolled: 0,
      active: 0,
      emissions: 0,
      status: 'active',
    };
    // Optimistic update
    setLocations([...locations, newLocation]);
    setIsAddDialogOpen(false);
    resetForm();

    const result = await createLocationMutation.execute({
      name: formData.name,
      address: formData.address,
      city: formData.city,
      country: formData.country,
    });

    if (result.success) {
      toast.success('Location added successfully');
    } else {
      toast.error(result.error?.message || 'Failed to add location (saved locally)');
    }
  };

  const handleEditLocation = async () => {
    if (selectedLocation) {
      const updated = locations.map(l =>
        l.id === selectedLocation.id
          ? { ...l, name: formData.name, address: formData.address, city: formData.city, country: formData.country }
          : l
      );
      // Optimistic update
      setLocations(updated);
      setIsEditDialogOpen(false);

      const result = await updateLocationMutation.execute({
        id: selectedLocation.id,
        payload: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          country: formData.country,
        },
      });

      if (result.success) {
        toast.success('Location updated successfully');
      } else {
        toast.error(result.error?.message || 'Failed to update location');
      }
    }
  };

  const handleDeleteLocation = async () => {
    if (selectedLocation) {
      const previousLocations = [...locations];
      // Optimistic update
      setLocations(locations.filter(l => l.id !== selectedLocation.id));
      setIsDeleteDialogOpen(false);

      const result = await deleteLocationMutation.execute(selectedLocation.id);

      if (result.success) {
        toast.success('Location deleted successfully');
      } else {
        // Rollback on failure
        setLocations(previousLocations);
        toast.error(result.error?.message || 'Failed to delete location');
      }
    }
  };

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      city: location.city,
      country: location.country,
    });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', city: '', country: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600 mt-1">Manage office locations and facilities</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
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
              <p className="text-sm text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{locations.reduce((sum, l) => sum + l.employees, 0)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{locations.reduce((sum, l) => sum + l.enrolled, 0)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Emissions</p>
              <p className="text-2xl font-bold text-gray-900">{locations.reduce((sum, l) => sum + l.emissions, 0).toFixed(1)} kg</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Locations List */}
      <div className="space-y-3">
        {locations.map((location) => (
          <Card key={location.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    {location.address}, {location.city}, {location.country}
                  </p>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Employees</p>
                      <p className="font-medium text-gray-900">{location.employees}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Enrolled</p>
                      <p className="font-medium text-gray-900">{location.enrolled}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Active</p>
                      <p className="font-medium text-green-600">{location.active}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Emissions</p>
                      <p className="font-medium text-gray-900">{location.emissions} kg</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedLocation(location);
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
                    selectLocation(location);
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
                    setSelectedLocation(location);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Location Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>Create a new office location</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Downtown Office"
              />
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="USA"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddLocation} disabled={!formData.name || !formData.address || !formData.city || !formData.country || createLocationMutation.loading}>
              {createLocationMutation.loading ? 'Adding...' : 'Add Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update location details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Location Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-country">Country *</Label>
                <Input
                  id="edit-country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditLocation} disabled={updateLocationMutation.loading}>
              {updateLocationMutation.loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Location Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLocation?.name}</DialogTitle>
            <DialogDescription>Location details and metrics</DialogDescription>
          </DialogHeader>
          {selectedLocation && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-sm text-gray-600">Address</Label>
                <p className="text-gray-900 mt-1">
                  {selectedLocation.address}, {selectedLocation.city}, {selectedLocation.country}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Employees</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedLocation.employees}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Enrolled</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedLocation.enrolled}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Active</Label>
                  <p className="text-2xl font-bold text-green-600 mt-1">{selectedLocation.active}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Emissions</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedLocation.emissions} kg</p>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Location Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>Permanently remove {selectedLocation?.name}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. All data associated with this location will be permanently deleted.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteLocation} disabled={deleteLocationMutation.loading}>
              {deleteLocationMutation.loading ? 'Deleting...' : 'Delete Location'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}