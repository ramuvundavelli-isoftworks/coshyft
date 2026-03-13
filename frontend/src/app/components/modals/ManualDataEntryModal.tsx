// Manual Data Entry Modal
// For manually entering emission data in Emissions Overview page

import React, { useState } from 'react';
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
import { Calendar, MapPin, Car, Users, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ManualDataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmissionEntry) => void;
}

export interface EmissionEntry {
  id?: string;
  date: string;
  location: string;
  mode: string;
  employees: number;
  distance: number;
  emissions: number;
  dataQuality: 'primary' | 'secondary' | 'estimated';
  notes?: string;
  source: string;
}

const transportModes = [
  { value: 'car-solo', label: 'Car (Solo)', factor: 0.168 },
  { value: 'car-shared', label: 'Car (Carpool)', factor: 0.084 },
  { value: 'ev', label: 'Electric Vehicle', factor: 0.053 },
  { value: 'bus', label: 'Bus', factor: 0.089 },
  { value: 'dart', label: 'DART', factor: 0.025 },
  { value: 'luas', label: 'Luas', factor: 0.025 },
  { value: 'train', label: 'Train', factor: 0.041 },
  { value: 'motorcycle', label: 'Motorcycle', factor: 0.103 },
  { value: 'bike', label: 'Bicycle', factor: 0 },
  { value: 'walk', label: 'Walking', factor: 0 },
];

const locations = [
  'HQ - Tech Park Dublin',
  'Westside Office - Galway',
  'Cork Campus',
  'Limerick Hub',
];

const dataQualityLevels = [
  { value: 'primary', label: 'Primary (Measured)', description: 'Direct measurement or verified data' },
  { value: 'secondary', label: 'Secondary (Calculated)', description: 'Calculated from activity data' },
  { value: 'estimated', label: 'Estimated (Proxy)', description: 'Industry average or proxy data' },
];

export function ManualDataEntryModal({ isOpen, onClose, onSubmit }: ManualDataEntryModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    mode: '',
    employees: '',
    distance: '',
    dataQuality: 'secondary' as 'primary' | 'secondary' | 'estimated',
    notes: '',
    source: '',
  });

  const [calculatedEmissions, setCalculatedEmissions] = useState(0);

  const handleModeChange = (mode: string) => {
    setFormData({ ...formData, mode });
    recalculateEmissions(mode, formData.employees, formData.distance);
  };

  const handleEmployeesChange = (employees: string) => {
    setFormData({ ...formData, employees });
    recalculateEmissions(formData.mode, employees, formData.distance);
  };

  const handleDistanceChange = (distance: string) => {
    setFormData({ ...formData, distance });
    recalculateEmissions(formData.mode, formData.employees, distance);
  };

  const recalculateEmissions = (mode: string, employees: string, distance: string) => {
    const selectedMode = transportModes.find(m => m.value === mode);
    const empCount = parseInt(employees) || 0;
    const dist = parseFloat(distance) || 0;

    if (selectedMode && empCount > 0 && dist > 0) {
      const emissions = selectedMode.factor * dist * empCount;
      setCalculatedEmissions(emissions);
    } else {
      setCalculatedEmissions(0);
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      location: '',
      mode: '',
      employees: '',
      distance: '',
      dataQuality: 'secondary',
      notes: '',
      source: '',
    });
    setCalculatedEmissions(0);
  };

  const handleSubmit = () => {
    if (!formData.location || !formData.mode || !formData.employees || !formData.distance) {
      toast.error('Please fill in all required fields');
      return;
    }

    const entry: EmissionEntry = {
      id: Date.now().toString(),
      date: formData.date,
      location: formData.location,
      mode: transportModes.find(m => m.value === formData.mode)?.label || formData.mode,
      employees: parseInt(formData.employees),
      distance: parseFloat(formData.distance),
      emissions: calculatedEmissions,
      dataQuality: formData.dataQuality,
      notes: formData.notes,
      source: formData.source || 'Manual Entry',
    };

    onSubmit(entry);
    resetForm();
    onClose();
    toast.success('Emission data entry created successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#00bc7d]" />
            Manual Data Entry
          </DialogTitle>
          <DialogDescription>
            Enter emission data manually for reporting and analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date */}
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
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <Label htmlFor="location">
                <MapPin className="h-4 w-4 inline mr-1" />
                Location *
              </Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transport Mode */}
            <div>
              <Label htmlFor="mode">
                <Car className="h-4 w-4 inline mr-1" />
                Transport Mode *
              </Label>
              <Select value={formData.mode} onValueChange={handleModeChange}>
                <SelectTrigger id="mode">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {transportModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label} ({mode.factor} kg/km)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Number of Employees */}
            <div>
              <Label htmlFor="employees">
                <Users className="h-4 w-4 inline mr-1" />
                Number of Employees *
              </Label>
              <Input
                id="employees"
                type="number"
                min="1"
                value={formData.employees}
                onChange={(e) => handleEmployeesChange(e.target.value)}
                placeholder="e.g., 25"
              />
            </div>

            {/* Distance */}
            <div>
              <Label htmlFor="distance">
                Distance (km) *
              </Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.distance}
                onChange={(e) => handleDistanceChange(e.target.value)}
                placeholder="e.g., 12.5"
              />
            </div>
          </div>

          {/* Calculated Emissions Display */}
          {calculatedEmissions > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-900 font-medium">Calculated Emissions</p>
                  <p className="text-xs text-blue-700 mt-1">
                    {formData.employees} employees × {formData.distance} km × emission factor
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">{calculatedEmissions.toFixed(2)}</p>
                  <p className="text-xs text-blue-700">kg CO₂e</p>
                </div>
              </div>
            </div>
          )}

          {/* Data Quality */}
          <div>
            <Label htmlFor="dataQuality">Data Quality Level *</Label>
            <Select 
              value={formData.dataQuality} 
              onValueChange={(value: 'primary' | 'secondary' | 'estimated') => 
                setFormData({ ...formData, dataQuality: value })
              }
            >
              <SelectTrigger id="dataQuality">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dataQualityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <p className="font-medium">{level.label}</p>
                      <p className="text-xs text-gray-500">{level.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Source */}
          <div>
            <Label htmlFor="source">Data Source (Optional)</Label>
            <Input
              id="source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="e.g., Survey, GPS tracking, Manual log"
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional context or notes about this data entry..."
              rows={3}
            />
          </div>

          {/* CSRD Compliance Note */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">CSRD Compliance Note</p>
                <p className="text-xs text-amber-700 mt-1">
                  Manual entries must be documented with source and quality level for audit trail compliance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.location || !formData.mode || !formData.employees || !formData.distance}
          >
            Add Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
