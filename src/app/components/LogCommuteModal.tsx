import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  Bike, 
  Home, 
  Footprints, 
  Zap, 
  Train, 
  Car, 
  Users, 
  AlertCircle,
  Info,
  Calendar,
  MapPin,
  Navigation,
  User,
  Hash,
  TrendingDown,
  CheckCircle,
  FileText,
  Database,
  Clock
} from 'lucide-react';
import { cn } from './ui/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

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
    licensePlate?: string;
  };
  route?: {
    start: string;
    end: string;
  };
  factor: {
    value: number;
    source: string;
    version: string;
    lastUpdated: string;
  };
  savedEmissions?: number;
  createdAt?: string;
}

const transportModes = {
  zero: [
    { 
      id: 'remote', 
      name: 'Work from Home', 
      icon: Home, 
      emissions: 0, 
      unit: 'kg',
      description: 'No commute today',
      factor: { value: 0, source: 'N/A', version: '1.0', lastUpdated: '2026-01-01' }
    },
    { 
      id: 'walking', 
      name: 'Walking', 
      icon: Footprints, 
      emissions: 0, 
      unit: 'kg',
      description: 'Active commute',
      factor: { value: 0, source: 'N/A', version: '1.0', lastUpdated: '2026-01-01' }
    },
    { 
      id: 'cycling', 
      name: 'Cycling', 
      icon: Bike, 
      emissions: 0, 
      unit: 'kg',
      description: 'Active commute',
      factor: { value: 0, source: 'N/A', version: '1.0', lastUpdated: '2026-01-01' }
    },
  ],
  low: [
    { 
      id: 'ebike', 
      name: 'E-Bike', 
      icon: Zap, 
      emissions: 0.005, 
      emissionRange: '~0 kg', 
      unit: 'kg/km',
      description: 'Electric bicycle',
      factor: { value: 0.005, source: 'SEAI 2024', version: '2.1', lastUpdated: '2024-06-15' }
    },
    { 
      id: 'dart', 
      name: 'DART', 
      icon: Train, 
      emissions: 0.025, 
      emissionRange: 'Low', 
      unit: 'kg/km',
      description: 'Electric rail',
      factor: { value: 0.025, source: 'SEAI 2024', version: '2.1', lastUpdated: '2024-06-15' }
    },
    { 
      id: 'luas', 
      name: 'Luas', 
      icon: Train, 
      emissions: 0.025, 
      emissionRange: 'Low', 
      unit: 'kg/km',
      description: 'Light rail',
      factor: { value: 0.025, source: 'SEAI 2024', version: '2.1', lastUpdated: '2024-06-15' }
    },
    { 
      id: 'ev', 
      name: 'Electric Car', 
      icon: Car, 
      emissions: 0.053, 
      emissionRange: 'Low', 
      unit: 'kg/km',
      description: 'Battery electric vehicle',
      factor: { value: 0.053, source: 'SEAI 2024', version: '2.1', lastUpdated: '2024-06-15' }
    },
  ],
  medium: [
    { 
      id: 'carpool', 
      name: 'Carpool (Shared)', 
      icon: Users, 
      emissions: 0.084, 
      emissionRange: '~50% saved', 
      unit: 'kg/km',
      description: 'Multiple passengers',
      factor: { value: 0.168, source: 'SEAI 2024', version: '2.1', lastUpdated: '2024-06-15' },
      requiresCarpool: true
    },
    { 
      id: 'petrol-car', 
      name: 'Petrol Car (Solo)', 
      icon: Car, 
      emissions: 0.168, 
      emissionRange: 'Solo', 
      unit: 'kg/km',
      description: 'Single occupancy',
      factor: { value: 0.168, source: 'SEAI 2024', version: '2.1', lastUpdated: '2024-06-15' }
    },
    { 
      id: 'motorcycle', 
      name: 'Motorcycle', 
      icon: Bike, 
      emissions: 0.103, 
      unit: 'kg/km',
      description: 'Two-wheeler',
      factor: { value: 0.103, source: 'SEAI 2024', version: '2.1', lastUpdated: '2024-06-15' }
    },
  ],
};

const officeLocations = [
  { id: 'hq', name: 'HQ - Tech Park Dublin', address: 'Tech Park, Dublin 18' },
  { id: 'west', name: 'Westside Office', address: 'Galway Business Park' },
  { id: 'cork', name: 'Cork Campus', address: 'Little Island, Cork' },
];

export function LogCommuteModal({ isOpen, onClose, onSubmit, existingEntries = [] }: LogCommuteModalProps) {
  const [step, setStep] = useState<'mode' | 'details' | 'distance' | 'carpool' | 'preview'>('mode');
  const [selectedMode, setSelectedMode] = useState<any>(null);
  const [commuteDate, setCommuteDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [officeLocation, setOfficeLocation] = useState<string>('hq');
  const [distance, setDistance] = useState<string>('');
  const [distanceMethod, setDistanceMethod] = useState<'auto' | 'manual'>('manual');
  const [routeStart, setRouteStart] = useState<string>('');
  const [routeEnd, setRouteEnd] = useState<string>('');
  const [carpoolPassengers, setCarpoolPassengers] = useState<number>(2);
  const [carpoolRole, setCarpoolRole] = useState<'driver' | 'passenger'>('driver');
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [showTransparency, setShowTransparency] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  if (!isOpen) return null;

  const resetForm = () => {
    setStep('mode');
    setSelectedMode(null);
    setCommuteDate(new Date().toISOString().split('T')[0]);
    setOfficeLocation('hq');
    setDistance('');
    setDistanceMethod('manual');
    setRouteStart('');
    setRouteEnd('');
    setCarpoolPassengers(2);
    setCarpoolRole('driver');
    setLicensePlate('');
    setShowTransparency(false);
    setWarnings([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeSelect = (mode: any) => {
    setSelectedMode(mode);
    setWarnings([]);
    
    if (mode.emissions === 0 && mode.id === 'remote') {
      // Remote work - skip to preview
      setDistance('0');
      setStep('preview');
    } else if (mode.emissions === 0) {
      // Walking/Cycling - need basic details
      setStep('details');
    } else {
      // All other modes
      setStep('details');
    }
  };

  const validateDetails = () => {
    const newWarnings: string[] = [];
    
    // Check for duplicate entry
    const existingEntry = existingEntries.find(e => e.date === commuteDate);
    if (existingEntry) {
      newWarnings.push(`You already logged a commute for ${commuteDate}. This will replace it.`);
    }
    
    // Check if date is in future
    const selectedDate = new Date(commuteDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      newWarnings.push('Date cannot be in the future.');
      return false;
    }
    
    setWarnings(newWarnings);
    return true;
  };

  const handleDetailsNext = () => {
    if (!validateDetails()) return;
    
    if (selectedMode.id === 'remote' || selectedMode.emissions === 0) {
      setDistance('0');
      setStep('preview');
    } else {
      setStep('distance');
    }
  };

  const validateDistance = () => {
    const newWarnings: string[] = [];
    const dist = parseFloat(distance);
    
    if (isNaN(dist) || dist <= 0) {
      newWarnings.push('Distance must be greater than zero.');
      setWarnings(newWarnings);
      return false;
    }
    
    // Check for unusual distance (3x average)
    const averageDistance = 15; // Mock average
    if (dist > averageDistance * 3) {
      newWarnings.push(`Distance is ${(dist / averageDistance).toFixed(1)}× your usual average. Please verify.`);
    }
    
    setWarnings(newWarnings);
    return true;
  };

  const handleDistanceNext = () => {
    if (!validateDistance()) return;
    
    if (selectedMode.requiresCarpool) {
      setStep('carpool');
    } else {
      setStep('preview');
    }
  };

  const calculateDistance = () => {
    // Mock calculation - in real app, use Google Maps API
    const mockDistance = 12.5;
    setDistance(mockDistance.toString());
  };

  const calculateEmissions = () => {
    const dist = parseFloat(distance) || 0;
    let totalEmissions = selectedMode.emissions * dist;
    let savedEmissions = 0;
    
    if (selectedMode.requiresCarpool && carpoolPassengers > 1) {
      // Calculate savings
      const soloEmissions = selectedMode.factor.value * dist;
      const sharedEmissions = soloEmissions / (carpoolPassengers + (carpoolRole === 'driver' ? 1 : 0));
      totalEmissions = sharedEmissions;
      savedEmissions = soloEmissions - sharedEmissions;
    }
    
    return { totalEmissions, savedEmissions };
  };

  const handleSubmit = () => {
    const { totalEmissions, savedEmissions } = calculateEmissions();
    
    const entry: CommuteEntry = {
      id: Date.now().toString(),
      date: commuteDate,
      officeLocation: officeLocations.find(l => l.id === officeLocation)?.name || '',
      mode: selectedMode.name,
      distance: parseFloat(distance) || 0,
      emissions: totalEmissions,
      savedEmissions: savedEmissions > 0 ? savedEmissions : undefined,
      dataType: distanceMethod === 'auto' ? 'primary' : 'manual',
      factor: selectedMode.factor,
      createdAt: new Date().toISOString(),
    };
    
    if (selectedMode.requiresCarpool) {
      entry.carpoolDetails = {
        passengers: carpoolPassengers,
        role: carpoolRole,
        licensePlate: licensePlate || undefined,
      };
    }
    
    if (routeStart && routeEnd) {
      entry.route = {
        start: routeStart,
        end: routeEnd,
      };
    }
    
    onSubmit(entry);
    handleClose();
  };

  const renderModeSelection = () => (
    <div className="space-y-6">
      {/* Zero Emissions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <h3 className="font-semibold text-gray-900">Zero Emissions</h3>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
            0 kg CO₂
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">These transport modes produce no direct CO₂ emissions during your commute.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {transportModes.zero.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{mode.name}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">0 kg</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Low Emissions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          <h3 className="font-semibold text-gray-900">Low Emissions</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
            0.005-0.053 kg/km
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Electric and public transport options with minimal carbon footprint per kilometer.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {transportModes.low.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{mode.name}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {mode.emissionRange || `${mode.emissions} kg/km`}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Medium Emissions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
          <h3 className="font-semibold text-gray-900">Medium Emissions</h3>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
            0.084-0.168 kg/km
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Fossil fuel vehicles. Consider carpooling to reduce emissions per person.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {transportModes.medium.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{mode.name}</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      {mode.emissionRange || `${mode.emissions} kg/km`}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Date
        </label>
        <input
          type="date"
          value={commuteDate}
          onChange={(e) => setCommuteDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MapPin className="h-4 w-4 inline mr-1" />
          Office Location
        </label>
        <select
          value={officeLocation}
          onChange={(e) => setOfficeLocation(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          {officeLocations.map(loc => (
            <option key={loc.id} value={loc.id}>
              {loc.name} - {loc.address}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>Selected Mode:</strong> {selectedMode?.name}
        </p>
        <p className="text-xs text-blue-700 mt-1">
          {selectedMode?.description}
        </p>
      </div>

      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, idx) => (
            <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">{warning}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep('mode')}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleDetailsNext}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderDistance = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Distance & Route</h3>
        <p className="text-sm text-gray-600">
          How far did you travel today?
        </p>
      </div>

      {/* Distance Method Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => setDistanceMethod('manual')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
            distanceMethod === 'manual'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setDistanceMethod('auto')}
          className={cn(
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors',
            distanceMethod === 'auto'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          Auto-Calculate
        </button>
      </div>

      {distanceMethod === 'manual' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance (km)
          </label>
          <input
            type="number"
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="e.g., 12.5"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            autoFocus
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Address
            </label>
            <input
              type="text"
              value={routeStart}
              onChange={(e) => setRouteStart(e.target.value)}
              placeholder="e.g., 123 Main Street, Dublin"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Address
            </label>
            <input
              type="text"
              value={routeEnd}
              onChange={(e) => setRouteEnd(e.target.value)}
              placeholder="e.g., Tech Park, Dublin 18"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <Button 
            onClick={calculateDistance}
            variant="outline"
            className="w-full"
            disabled={!routeStart || !routeEnd}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Calculate Route Distance
          </Button>
          {distance && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                <strong>Calculated Distance:</strong> {distance} km
              </p>
            </div>
          )}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((warning, idx) => (
            <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">{warning}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep('details')}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleDistanceNext}
          disabled={!distance || parseFloat(distance) <= 0}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderCarpool = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Carpool Details</h3>
        <p className="text-sm text-gray-600">
          Help us calculate accurate shared emissions
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <User className="h-4 w-4 inline mr-1" />
          Your Role
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCarpoolRole('driver')}
            className={cn(
              'p-4 border-2 rounded-lg transition-all',
              carpoolRole === 'driver'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <Car className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="font-medium text-sm">Driver</p>
          </button>
          <button
            onClick={() => setCarpoolRole('passenger')}
            className={cn(
              'p-4 border-2 rounded-lg transition-all',
              carpoolRole === 'passenger'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <Users className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <p className="font-medium text-sm">Passenger</p>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Hash className="h-4 w-4 inline mr-1" />
          Number of Passengers {carpoolRole === 'driver' ? '(excluding you)' : '(including you)'}
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={carpoolPassengers}
          onChange={(e) => setCarpoolPassengers(parseInt(e.target.value))}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Total people in vehicle: {carpoolPassengers + (carpoolRole === 'driver' ? 1 : 0)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          License Plate (Optional)
        </label>
        <input
          type="text"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
          placeholder="e.g., 241-D-12345"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {(() => {
        const { savedEmissions } = calculateEmissions();
        return savedEmissions > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <p className="font-semibold text-green-900">Great job!</p>
            </div>
            <p className="text-sm text-green-800">
              You saved <strong>{savedEmissions.toFixed(2)} kg CO₂</strong> by carpooling today!
            </p>
          </div>
        );
      })()}

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep('distance')}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={() => setStep('preview')}
          className="flex-1"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderPreview = () => {
    const { totalEmissions, savedEmissions } = calculateEmissions();
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Your Commute</h3>
          <p className="text-sm text-gray-600">
            Verify the details before submitting
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Emissions</p>
              <p className="text-4xl font-bold text-gray-900">
                {totalEmissions.toFixed(2)} <span className="text-xl text-gray-600">kg CO₂</span>
              </p>
            </div>
            {savedEmissions > 0 && (
              <div className="text-right">
                <p className="text-sm text-green-600 mb-1">Saved</p>
                <p className="text-2xl font-bold text-green-600">
                  {savedEmissions.toFixed(2)} <span className="text-sm">kg</span>
                </p>
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-200">
            <div>
              <p className="text-xs text-gray-600 mb-1">Date</p>
              <p className="text-sm font-medium text-gray-900">{commuteDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Mode</p>
              <p className="text-sm font-medium text-gray-900">{selectedMode?.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Distance</p>
              <p className="text-sm font-medium text-gray-900">{distance} km</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Data Type</p>
              <Badge variant="outline" className="bg-white text-blue-700 border-blue-300">
                {distanceMethod === 'auto' ? 'Primary' : 'Manual'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Calculation Details */}
        <div className="p-4 bg-gray-50 border rounded-lg">
          <button
            onClick={() => setShowTransparency(!showTransparency)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">View Calculation Details</span>
            </div>
            <span className="text-gray-400">{showTransparency ? '−' : '+'}</span>
          </button>
          
          {showTransparency && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Formula:</span>
                <span className="font-mono text-gray-900">
                  {distance} km × {selectedMode.emissions} kg/km
                  {selectedMode.requiresCarpool && ` ÷ ${carpoolPassengers + (carpoolRole === 'driver' ? 1 : 0)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Emission Factor:</span>
                <span className="font-medium text-gray-900">{selectedMode.emissions} kg/km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Factor Source:</span>
                <span className="font-medium text-gray-900">{selectedMode.factor.source}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium text-gray-900">{selectedMode.factor.version}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium text-gray-900">{selectedMode.factor.lastUpdated}</span>
              </div>
            </div>
          )}
        </div>

        {/* Scope 3 Notice */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 mb-1">
              Scope 3 Category 7 – Employee Commuting
            </p>
            <p className="text-xs text-blue-700">
              This data contributes to your organization's CSRD/ESRS E1 compliance reporting and will be included in the annual sustainability audit.
            </p>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="space-y-2">
            {warnings.map((warning, idx) => (
              <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">{warning}</p>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setStep(selectedMode.requiresCarpool ? 'carpool' : 'distance')}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Submit Commute
          </Button>
        </div>
      </div>
    );
  };

  const getStepTitle = () => {
    switch (step) {
      case 'mode': return 'Select Transport Mode';
      case 'details': return 'Commute Details';
      case 'distance': return 'Distance & Route';
      case 'carpool': return 'Carpool Details';
      case 'preview': return 'Review & Submit';
      default: return 'Log Commute';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Car className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{getStepTitle()}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {step === 'mode' && 'Choose how you commuted today'}
                {step === 'details' && 'When and where did you commute?'}
                {step === 'distance' && 'How far did you travel?'}
                {step === 'carpool' && 'Share details about your carpool'}
                {step === 'preview' && 'Verify your commute details'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between text-xs">
            <span className={cn('font-medium', step === 'mode' && 'text-green-600')}>
              1. Mode
            </span>
            <span className={cn('font-medium', step === 'details' && 'text-green-600')}>
              2. Details
            </span>
            {selectedMode?.emissions > 0 && (
              <span className={cn('font-medium', step === 'distance' && 'text-green-600')}>
                3. Distance
              </span>
            )}
            {selectedMode?.requiresCarpool && (
              <span className={cn('font-medium', step === 'carpool' && 'text-green-600')}>
                4. Carpool
              </span>
            )}
            <span className={cn('font-medium', step === 'preview' && 'text-green-600')}>
              {selectedMode?.requiresCarpool ? '5' : selectedMode?.emissions > 0 ? '4' : '3'}. Preview
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'mode' && renderModeSelection()}
          {step === 'details' && renderDetails()}
          {step === 'distance' && renderDistance()}
          {step === 'carpool' && renderCarpool()}
          {step === 'preview' && renderPreview()}
        </div>
      </Card>
    </div>
  );
}
