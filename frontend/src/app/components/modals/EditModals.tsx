// Edit Modals Collection
// Modals for editing existing records across the platform

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Edit, MapPin, Building2, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// ======================
// EDIT LOCATION MODAL
// ======================

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: LocationEditData) => void;
  location: LocationEditData | null;
}

export interface LocationEditData {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  parkingSpaces: number;
  status: 'active' | 'inactive';
  notes?: string;
}

export function EditLocationModal({ isOpen, onClose, onUpdate, location }: EditLocationModalProps) {
  const [formData, setFormData] = useState<LocationEditData>({
    id: '',
    name: '',
    address: '',
    city: '',
    country: 'Ireland',
    capacity: 0,
    parkingSpaces: 0,
    status: 'active',
    notes: '',
  });

  useEffect(() => {
    if (location) {
      setFormData(location);
    }
  }, [location]);

  const handleSubmit = () => {
    if (!formData.name || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    onUpdate(formData);
    toast.success('Location updated successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-brand-500" />
            Edit Location
          </DialogTitle>
          <DialogDescription>
            Update location details and configuration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">
              <Building2 className="h-4 w-4 inline mr-1" />
              Location Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="address">
              <MapPin className="h-4 w-4 inline mr-1" />
              Address *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Employee Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="parking">Parking Spaces</Label>
              <Input
                id="parking"
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v: 'active' | 'inactive') => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Additional notes about this location..."
            />
          </div>

          <div className="p-3 bg-warning-subtle border border-warning/25 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-warning">
                Changes will affect all users assigned to this location. Deactivating will prevent new assignments.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======================
// EDIT COMMUTE PROFILE MODAL
// ======================

interface EditCommuteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: CommuteProfileData) => void;
  profile: CommuteProfileData | null;
}

export interface CommuteProfileData {
  id: string;
  homeAddress: string;
  homeCity: string;
  workLocation: string;
  defaultMode: string;
  flexibleHours: boolean;
  availableForCarpool: boolean;
  preferences: {
    musicPreference: string;
    smokingAllowed: boolean;
    petsAllowed: boolean;
    maxDetour: number;
  };
}

export function EditCommuteProfileModal({ isOpen, onClose, onUpdate, profile }: EditCommuteProfileModalProps) {
  const [formData, setFormData] = useState<CommuteProfileData>({
    id: '',
    homeAddress: '',
    homeCity: '',
    workLocation: '',
    defaultMode: '',
    flexibleHours: false,
    availableForCarpool: false,
    preferences: {
      musicPreference: 'any',
      smokingAllowed: false,
      petsAllowed: false,
      maxDetour: 5,
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSubmit = () => {
    if (!formData.homeAddress || !formData.workLocation) {
      toast.error('Please fill in home address and work location');
      return;
    }

    onUpdate(formData);
    toast.success('Commute profile updated successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-brand-500" />
            Edit Commute Profile
          </DialogTitle>
          <DialogDescription>
            Update your commute preferences and details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Home Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Home Location</h3>
            <div>
              <Label htmlFor="homeAddress">Home Address *</Label>
              <Input
                id="homeAddress"
                value={formData.homeAddress}
                onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
                placeholder="123 Main Street"
              />
            </div>
            <div>
              <Label htmlFor="homeCity">City *</Label>
              <Input
                id="homeCity"
                value={formData.homeCity}
                onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })}
                placeholder="Dublin"
              />
            </div>
          </div>

          {/* Work Details */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-foreground">Work Details</h3>
            <div>
              <Label htmlFor="workLocation">Primary Work Location *</Label>
              <Select 
                value={formData.workLocation} 
                onValueChange={(v) => setFormData({ ...formData, workLocation: v })}
              >
                <SelectTrigger id="workLocation">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hq-dublin">HQ - Tech Park Dublin</SelectItem>
                  <SelectItem value="galway">Westside Office - Galway</SelectItem>
                  <SelectItem value="cork">Cork Campus</SelectItem>
                  <SelectItem value="limerick">Limerick Hub</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultMode">Default Transport Mode</Label>
              <Select 
                value={formData.defaultMode} 
                onValueChange={(v) => setFormData({ ...formData, defaultMode: v })}
              >
                <SelectTrigger id="defaultMode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drive">Drive (Solo)</SelectItem>
                  <SelectItem value="carpool">Carpool</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="dart">DART</SelectItem>
                  <SelectItem value="luas">Luas</SelectItem>
                  <SelectItem value="bike">Bicycle</SelectItem>
                  <SelectItem value="walk">Walk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Carpool Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold text-foreground">Carpool Settings</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="flexibleHours"
                  checked={formData.flexibleHours}
                  onChange={(e) => setFormData({ ...formData, flexibleHours: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="flexibleHours" className="text-sm text-foreground cursor-pointer">
                  I have flexible working hours
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="availableForCarpool"
                  checked={formData.availableForCarpool}
                  onChange={(e) => setFormData({ ...formData, availableForCarpool: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="availableForCarpool" className="text-sm text-foreground cursor-pointer">
                  Available for carpooling
                </label>
              </div>
            </div>

            {formData.availableForCarpool && (
              <div className="p-4 bg-background-subtle rounded-lg space-y-4">
                <div>
                  <Label htmlFor="musicPreference">Music Preference</Label>
                  <Select 
                    value={formData.preferences.musicPreference} 
                    onValueChange={(v) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, musicPreference: v }
                    })}
                  >
                    <SelectTrigger id="musicPreference">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any / No Preference</SelectItem>
                      <SelectItem value="quiet">Prefer Quiet</SelectItem>
                      <SelectItem value="radio">Radio / News</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="podcasts">Podcasts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maxDetour">Max Detour (km)</Label>
                  <Input
                    id="maxDetour"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.preferences.maxDetour}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, maxDetour: parseInt(e.target.value) || 5 }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="smokingAllowed"
                      checked={formData.preferences.smokingAllowed}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        preferences: { ...formData.preferences, smokingAllowed: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <label htmlFor="smokingAllowed" className="text-sm text-foreground cursor-pointer">
                      Smoking allowed
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="petsAllowed"
                      checked={formData.preferences.petsAllowed}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        preferences: { ...formData.preferences, petsAllowed: e.target.checked }
                      })}
                      className="rounded"
                    />
                    <label htmlFor="petsAllowed" className="text-sm text-foreground cursor-pointer">
                      Pets allowed
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            Save Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======================
// EDIT RIDE MODAL
// ======================

interface EditRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: RideEditData) => void;
  ride: RideEditData | null;
}

export interface RideEditData {
  id: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  availableSeats: number;
  notes?: string;
  status: 'scheduled' | 'cancelled' | 'completed';
}

export function EditRideModal({ isOpen, onClose, onUpdate, ride }: EditRideModalProps) {
  const [formData, setFormData] = useState<RideEditData>({
    id: '',
    date: '',
    time: '',
    origin: '',
    destination: '',
    availableSeats: 1,
    notes: '',
    status: 'scheduled',
  });

  useEffect(() => {
    if (ride) {
      setFormData(ride);
    }
  }, [ride]);

  const handleSubmit = () => {
    if (!formData.date || !formData.time || !formData.origin || !formData.destination) {
      toast.error('Please fill in all required fields');
      return;
    }

    onUpdate(formData);
    toast.success('Ride updated successfully');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-brand-500" />
            Edit Ride
          </DialogTitle>
          <DialogDescription>
            Update ride details and availability
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="origin">Origin *</Label>
            <Input
              id="origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="seats">Available Seats</Label>
            <Select 
              value={String(formData.availableSeats)} 
              onValueChange={(v) => setFormData({ ...formData, availableSeats: parseInt(v) })}
            >
              <SelectTrigger id="seats">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(n => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Additional details for riders..."
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v: any) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
