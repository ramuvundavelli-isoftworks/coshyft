import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Car, 
  Filter,
  Music,
  MessageCircle,
  PawPrint,
  Cigarette,
  Thermometer,
  Save
} from 'lucide-react';
import { AdvancedFilters, CommutePreferences } from '../../types';
import { Badge } from '../ui/badge';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AdvancedFilters, preferences: Partial<CommutePreferences>) => void;
  currentFilters?: AdvancedFilters;
  currentPreferences?: Partial<CommutePreferences>;
}

export default function AdvancedSearchModal({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  currentPreferences,
}: AdvancedSearchModalProps) {
  const [filters, setFilters] = useState<AdvancedFilters>(
    currentFilters || {
      maxDistance: 25,
      minSeats: 1,
      minRating: 0,
      vehicleTypes: [],
    }
  );

  const [preferences, setPreferences] = useState<Partial<CommutePreferences>>(
    currentPreferences || {}
  );

  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveSearch, setShowSaveSearch] = useState(false);

  const handleApply = () => {
    onApplyFilters(filters, preferences);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      maxDistance: 25,
      minSeats: 1,
      minRating: 0,
      vehicleTypes: [],
    });
    setPreferences({});
  };

  const toggleVehicleType = (type: string) => {
    const current = filters.vehicleTypes || [];
    if (current.includes(type)) {
      setFilters({
        ...filters,
        vehicleTypes: current.filter(t => t !== type),
      });
    } else {
      setFilters({
        ...filters,
        vehicleTypes: [...current, type],
      });
    }
  };

  const activeFiltersCount = 
    (filters.maxDistance !== 25 ? 1 : 0) +
    (filters.minSeats && filters.minSeats > 1 ? 1 : 0) +
    (filters.minRating && filters.minRating > 0 ? 1 : 0) +
    (filters.vehicleTypes && filters.vehicleTypes.length > 0 ? 1 : 0) +
    (filters.departureWindowStart ? 1 : 0) +
    (filters.departureWindowEnd ? 1 : 0) +
    Object.keys(preferences).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Search Filters
              </DialogTitle>
              <DialogDescription>
                Customize your ride search to find the perfect match
              </DialogDescription>
            </div>
            {activeFiltersCount > 0 && (
              <Badge variant="default" className="bg-info">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Route & Distance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground pb-2 border-b">
              <MapPin className="h-4 w-4" />
              Route Preferences
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Maximum Distance</Label>
                <span className="text-sm font-medium text-foreground">
                  {filters.maxDistance} km
                </span>
              </div>
              <Slider
                value={[filters.maxDistance || 25]}
                onValueChange={([value]) => setFilters({ ...filters, maxDistance: value })}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5 km</span>
                <span>50 km</span>
              </div>
            </div>
          </div>

          {/* Time Window */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground pb-2 border-b">
              <Clock className="h-4 w-4" />
              Departure Time Window
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeStart">Earliest</Label>
                <Input
                  id="timeStart"
                  type="time"
                  value={filters.departureWindowStart || ''}
                  onChange={(e) => setFilters({ ...filters, departureWindowStart: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="timeEnd">Latest</Label>
                <Input
                  id="timeEnd"
                  type="time"
                  value={filters.departureWindowEnd || ''}
                  onChange={(e) => setFilters({ ...filters, departureWindowEnd: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Seats & Rating */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground pb-2 border-b">
              <Users className="h-4 w-4" />
              Capacity & Rating
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minSeats">Minimum Seats Needed</Label>
                <Select
                  value={filters.minSeats?.toString() || '1'}
                  onValueChange={(value) => setFilters({ ...filters, minSeats: parseInt(value) })}
                >
                  <SelectTrigger id="minSeats">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 seat</SelectItem>
                    <SelectItem value="2">2 seats</SelectItem>
                    <SelectItem value="3">3 seats</SelectItem>
                    <SelectItem value="4">4 seats</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="minRating">Minimum Driver Rating</Label>
                <Select
                  value={filters.minRating?.toString() || '0'}
                  onValueChange={(value) => setFilters({ ...filters, minRating: parseFloat(value) })}
                >
                  <SelectTrigger id="minRating">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground pb-2 border-b">
              <Car className="h-4 w-4" />
              Vehicle Preferences
            </div>

            <div>
              <Label className="mb-3 block">Preferred Vehicle Types</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'electric', label: 'Electric', icon: '⚡' },
                  { value: 'hybrid', label: 'Hybrid', icon: '🔋' },
                  { value: 'sedan', label: 'Sedan', icon: '🚗' },
                  { value: 'suv', label: 'SUV', icon: '🚙' },
                ].map((type) => (
                  <div
                    key={type.value}
                    onClick={() => toggleVehicleType(type.value)}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      filters.vehicleTypes?.includes(type.value)
                        ? 'border-info bg-info-subtle'
                        : 'border-border hover:border-border'
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                    {filters.vehicleTypes?.includes(type.value) && (
                      <Star className="h-4 w-4 ml-auto text-info fill-current" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ride Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground pb-2 border-b">
              <MessageCircle className="h-4 w-4" />
              Ride Atmosphere Preferences
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="music">Music Preference</Label>
                <Select
                  value={preferences.musicPreference || 'no-preference'}
                  onValueChange={(value: any) => setPreferences({ ...preferences, musicPreference: value })}
                >
                  <SelectTrigger id="music">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-preference">No preference</SelectItem>
                    <SelectItem value="quiet">Quiet ride</SelectItem>
                    <SelectItem value="music">Music welcome</SelectItem>
                    <SelectItem value="podcast">Podcast friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="conversation">Conversation Level</Label>
                <Select
                  value={preferences.conversationLevel || 'no-preference'}
                  onValueChange={(value: any) => setPreferences({ ...preferences, conversationLevel: value })}
                >
                  <SelectTrigger id="conversation">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-preference">No preference</SelectItem>
                    <SelectItem value="quiet">Prefer quiet</SelectItem>
                    <SelectItem value="chatty">Happy to chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="allowsPets"
                    checked={preferences.allowsPets !== false}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, allowsPets: checked === true })
                    }
                  />
                  <Label htmlFor="allowsPets" className="flex items-center gap-2 cursor-pointer">
                    <PawPrint className="h-4 w-4" />
                    <span>Pets OK</span>
                  </Label>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Checkbox
                    id="allowsSmoking"
                    checked={preferences.allowsSmoking === true}
                    onCheckedChange={(checked) => 
                      setPreferences({ ...preferences, allowsSmoking: checked === true })
                    }
                  />
                  <Label htmlFor="allowsSmoking" className="flex items-center gap-2 cursor-pointer">
                    <Cigarette className="h-4 w-4" />
                    <span>Smoking OK</span>
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Search */}
          <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Save className="h-5 w-5 text-info" />
                <div>
                  <p className="text-sm font-medium text-info">Save this search</p>
                  <p className="text-xs text-info">Get notified when matching rides are posted</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveSearch(!showSaveSearch)}
              >
                {showSaveSearch ? 'Cancel' : 'Save'}
              </Button>
            </div>
            {showSaveSearch && (
              <div className="mt-3">
                <Input
                  placeholder="e.g., Morning commute from Oakland"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleReset}>
            Reset All
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
