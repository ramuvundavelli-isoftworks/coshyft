// Redesigned Log Commute Modal
// Simplified, modern UX with smart defaults and faster workflow

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Bike,
  Home,
  Footprints,
  Zap,
  Train,
  Car,
  Users,
  Calendar,
  MapPin,
  TrendingDown,
  CheckCircle,
  Info,
  Bus
} from 'lucide-react';
import { toast } from 'sonner';

interface LogCommuteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (commuteData: CommuteEntry) => void;
  existingEntries?: CommuteEntry[];
}

export interface CommuteEntry {
  id?: string;
  date: string;
  officeLocation: string;
  mode: string;
  distance: number;
  emissions: number;
  dataType: 'primary' | 'manual' | 'estimated';
  carpoolDetails?: {
    passengers: number;
    role: 'driver' | 'passenger';
  };
  factor: {
    value: number;
    source: string;
  };
  savedEmissions?: number;
  createdAt?: string;
}

interface TransportMode {
  id: string;
  name: string;
  icon: any;
  emissions: number;
  color: string;
  description: string;
  factor: { value: number; source: string };
  requiresCarpool?: boolean;
}

const transportModes: TransportMode[] = [
  {
    id: 'remote',
    name: 'Work from Home',
    icon: Home,
    emissions: 0,
    color: 'bg-success-subtle text-success border-success/40',
    description: 'No commute',
    factor: { value: 0, source: 'N/A' },
  },
  {
    id: 'walking',
    name: 'Walking',
    icon: Footprints,
    emissions: 0,
    color: 'bg-success-subtle text-success border-success/40',
    description: 'Active travel',
    factor: { value: 0, source: 'N/A' },
  },
  {
    id: 'cycling',
    name: 'Bicycle',
    icon: Bike,
    emissions: 0,
    color: 'bg-success-subtle text-success border-success/40',
    description: 'Active travel',
    factor: { value: 0, source: 'N/A' },
  },
  {
    id: 'ebike',
    name: 'E-Bike',
    icon: Zap,
    emissions: 0.005,
    color: 'bg-success-subtle text-success border-success/40',
    description: 'Electric bicycle',
    factor: { value: 0.005, source: 'SEAI 2024' },
  },
  {
    id: 'dart',
    name: 'DART',
    icon: Train,
    emissions: 0.025,
    color: 'bg-info-subtle text-info border-info/40',
    description: 'Electric rail',
    factor: { value: 0.025, source: 'SEAI 2024' },
  },
  {
    id: 'luas',
    name: 'Luas',
    icon: Train,
    emissions: 0.025,
    color: 'bg-info-subtle text-info border-info/40',
    description: 'Tram',
    factor: { value: 0.025, source: 'SEAI 2024' },
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: Bus,
    emissions: 0.089,
    color: 'bg-info-subtle text-info border-info/40',
    description: 'Public bus',
    factor: { value: 0.089, source: 'SEAI 2024' },
  },
  {
    id: 'ev',
    name: 'Electric Car',
    icon: Car,
    emissions: 0.053,
    color: 'bg-success-subtle text-success border-success/40',
    description: 'Battery EV',
    factor: { value: 0.053, source: 'SEAI 2024' },
  },
  {
    id: 'carpool',
    name: 'Carpool',
    icon: Users,
    emissions: 0.084,
    color: 'bg-info-subtle text-info border-info/40',
    description: 'Shared ride',
    factor: { value: 0.084, source: 'SEAI 2024' },
    requiresCarpool: true,
  },
  {
    id: 'petrol-car',
    name: 'Drive Solo',
    icon: Car,
    emissions: 0.168,
    color: 'bg-warning-subtle text-warning border-warning/40',
    description: 'Petrol car',
    factor: { value: 0.168, source: 'SEAI 2024' },
  },
];

const officeLocations = [
  { id: 'hq', name: 'HQ - Tech Park Dublin', address: 'Dublin 18' },
  { id: 'galway', name: 'Westside Office - Galway', address: 'Galway Business Park' },
  { id: 'cork', name: 'Cork Campus', address: 'Little Island, Cork' },
  { id: 'limerick', name: 'Limerick Hub', address: 'Limerick City' },
];

export function LogCommuteModal({ isOpen, onClose, onSubmit }: LogCommuteModalProps) {
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null);
  const [commuteDate, setCommuteDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [officeLocation, setOfficeLocation] = useState<string>('hq');
  const [distance, setDistance] = useState<string>('');
  const [carpoolPassengers, setCarpoolPassengers] = useState<number>(2);
  const [carpoolRole, setCarpoolRole] = useState<'driver' | 'passenger'>('driver');

  const calculateEmissions = () => {
    if (!selectedMode || !distance) return 0;
    const dist = parseFloat(distance);
    if (selectedMode.requiresCarpool && carpoolRole === 'driver') {
      // Split emissions among passengers
      return (selectedMode.factor.value * dist * 2) / carpoolPassengers;
    }
    return selectedMode.emissions * dist * 2; // Round trip
  };

  const calculateSavedEmissions = () => {
    if (!selectedMode || !distance) return 0;
    const dist = parseFloat(distance);
    const baselineEmissions = 0.168 * dist * 2; // Solo petrol car baseline
    const actualEmissions = calculateEmissions();
    return Math.max(0, baselineEmissions - actualEmissions);
  };

  const resetForm = () => {
    setSelectedMode(null);
    setCommuteDate(new Date().toISOString().split('T')[0]);
    setOfficeLocation('hq');
    setDistance('');
    setCarpoolPassengers(2);
    setCarpoolRole('driver');
  };

  const handleSubmit = () => {
    if (!selectedMode || !distance) {
      toast.error('Please select transport mode and enter distance');
      return;
    }

    const dist = parseFloat(distance);
    if (dist <= 0 || dist > 200) {
      toast.error('Distance must be between 0 and 200 km');
      return;
    }

    const entry: CommuteEntry = {
      id: Date.now().toString(),
      date: commuteDate,
      officeLocation: officeLocations.find(l => l.id === officeLocation)?.name || officeLocation,
      mode: selectedMode.name,
      distance: dist,
      emissions: calculateEmissions(),
      dataType: 'manual',
      factor: selectedMode.factor,
      savedEmissions: calculateSavedEmissions(),
      createdAt: new Date().toISOString(),
    };

    if (selectedMode.requiresCarpool) {
      entry.carpoolDetails = {
        passengers: carpoolPassengers,
        role: carpoolRole,
      };
    }

    onSubmit(entry);
    toast.success('Commute logged successfully!');
    resetForm();
    onClose();
  };

  const emissions = calculateEmissions();
  const savedEmissions = calculateSavedEmissions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-brand-500" />
            Log Your Commute
          </DialogTitle>
          <DialogDescription>
            Track today's journey and see your environmental impact
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={commuteDate}
                onChange={(e) => setCommuteDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="location">
                <MapPin className="h-4 w-4 inline mr-1" />
                Office Location
              </Label>
              <Select value={officeLocation} onValueChange={setOfficeLocation}>
                <SelectTrigger id="location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {officeLocations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transport Mode Selection */}
          <div>
            <Label className="mb-3 block">How did you commute today?</Label>
            <div className="grid grid-cols-3 gap-3">
              {transportModes.map((mode) => {
                const Icon = mode.icon;
                const isSelected = selectedMode?.id === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode)}
                    className={`p-4 border-2 rounded-lg transition-all text-left ${
                      isSelected
                        ? 'border-brand-500 bg-success-subtle shadow-md scale-105'
                        : 'border-border hover:border-border hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-500 text-white' : mode.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${isSelected ? 'text-brand-500' : 'text-foreground'}`}>
                          {mode.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{mode.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-xs ${mode.color}`}>
                      {mode.emissions === 0 ? 'Zero emissions' : `${mode.emissions} kg/km`}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Distance Input */}
          {selectedMode && (
            <div>
              <Label htmlFor="distance">
                One-way Distance (km) *
              </Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g., 15.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll calculate round-trip emissions automatically
              </p>
            </div>
          )}

          {/* Carpool Details */}
          {selectedMode?.requiresCarpool && (
            <div className="p-4 bg-info-subtle border border-info/25 rounded-lg space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-info" />
                <p className="font-medium text-foreground">Carpool Details</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Your Role</Label>
                  <Select value={carpoolRole} onValueChange={(v: 'driver' | 'passenger') => setCarpoolRole(v)}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="passenger">Passenger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {carpoolRole === 'driver' && (
                  <div>
                    <Label htmlFor="passengers">Total Passengers (including you)</Label>
                    <Select 
                      value={String(carpoolPassengers)} 
                      onValueChange={(v) => setCarpoolPassengers(parseInt(v))}
                    >
                      <SelectTrigger id="passengers">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5].map(n => (
                          <SelectItem key={n} value={String(n)}>{n} people</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 p-3 bg-card rounded-lg">
                <Info className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
                <p className="text-xs text-info">
                  {carpoolRole === 'driver' 
                    ? `Emissions are split among ${carpoolPassengers} passengers`
                    : 'As a passenger, you share the vehicle emissions'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Impact Preview */}
          {selectedMode && distance && parseFloat(distance) > 0 && (
            <div className="p-4 bg-gradient-to-br from-success-subtle to-success-subtle border-2 border-success/25 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-success" />
                <p className="font-semibold text-success">Your Impact Today</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-success mb-1">Round Trip</p>
                  <p className="text-2xl font-bold text-success">
                    {(parseFloat(distance) * 2).toFixed(1)}
                  </p>
                  <p className="text-xs text-success">km</p>
                </div>

                <div>
                  <p className="text-xs text-success mb-1">Emissions</p>
                  <p className="text-2xl font-bold text-success">
                    {emissions.toFixed(2)}
                  </p>
                  <p className="text-xs text-success">kg CO₂e</p>
                </div>

                <div>
                  <p className="text-xs text-success mb-1">Saved vs. Solo Drive</p>
                  <p className="text-2xl font-bold text-success">
                    {savedEmissions.toFixed(2)}
                  </p>
                  <p className="text-xs text-success">kg CO₂e</p>
                </div>
              </div>

              {savedEmissions > 0 && (
                <div className="mt-3 pt-3 border-t border-success/25">
                  <p className="text-sm text-success flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    <strong>Great choice!</strong> You reduced emissions by {((savedEmissions / (0.168 * parseFloat(distance) * 2)) * 100).toFixed(0)}% today
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Emission Factor Transparency */}
          {selectedMode && (
            <div className="p-3 bg-info-subtle border border-info/25 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-info font-medium">Emission Factor</p>
                  <p className="text-xs text-info mt-1">
                    Using {selectedMode.factor.value} kg CO₂e/km from {selectedMode.factor.source}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedMode || !distance || parseFloat(distance) <= 0}
          >
            Log Commute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
