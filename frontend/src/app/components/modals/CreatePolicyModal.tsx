// Create Policy Modal
// For creating workplace commuting policies in Admin Policies page

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
import { FileCheck, Calendar, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PolicyData) => void;
}

export interface PolicyData {
  id?: string;
  policyName: string;
  policyType: string;
  description: string;
  effectiveDate: string;
  expiryDate?: string;
  applicableTo: string[];
  locations: string[];
  mandatoryCompliance: boolean;
  allowExceptions: boolean;
  status: 'draft' | 'active' | 'archived';
  approvedBy?: string;
  createdAt?: string;
}

const policyTypes = [
  { value: 'carpool', label: 'Carpooling Policy', description: 'Rules for shared commuting' },
  { value: 'remote', label: 'Remote Work Policy', description: 'Work from home guidelines' },
  { value: 'bike', label: 'Cycle to Work Policy', description: 'Bicycle commuting incentives' },
  { value: 'transit', label: 'Public Transport Policy', description: 'Transit pass programs' },
  { value: 'parking', label: 'Parking Policy', description: 'Parking allocation rules' },
  { value: 'ev', label: 'EV Charging Policy', description: 'Electric vehicle support' },
  { value: 'general', label: 'General Commute Policy', description: 'Overall commuting guidelines' },
];

const employeeGroups = [
  'All Employees',
  'Full-Time Staff',
  'Part-Time Staff',
  'Contractors',
  'Management',
  'New Hires',
];

const locationOptions = [
  'All Locations',
  'HQ - Tech Park Dublin',
  'Westside Office - Galway',
  'Cork Campus',
  'Limerick Hub',
];

export function CreatePolicyModal({ isOpen, onClose, onSubmit }: CreatePolicyModalProps) {
  const [formData, setFormData] = useState({
    policyName: '',
    policyType: '',
    description: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    applicableTo: [] as string[],
    locations: [] as string[],
    mandatoryCompliance: false,
    allowExceptions: true,
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const toggleApplicableTo = (group: string) => {
    setFormData({
      ...formData,
      applicableTo: formData.applicableTo.includes(group)
        ? formData.applicableTo.filter(g => g !== group)
        : [...formData.applicableTo, group],
    });
  };

  const toggleLocation = (location: string) => {
    setFormData({
      ...formData,
      locations: formData.locations.includes(location)
        ? formData.locations.filter(l => l !== location)
        : [...formData.locations, location],
    });
  };

  const validateForm = () => {
    const newWarnings: string[] = [];

    // Check effective date
    const effectiveDate = new Date(formData.effectiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (effectiveDate < today) {
      newWarnings.push('Effective date is in the past. Policy will be active immediately.');
    }

    // Check expiry date
    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      if (expiryDate <= effectiveDate) {
        newWarnings.push('Expiry date must be after effective date.');
        setWarnings(newWarnings);
        return false;
      }
    }

    // Check applicability
    if (formData.applicableTo.length === 0) {
      newWarnings.push('Please select at least one employee group.');
      setWarnings(newWarnings);
      return false;
    }

    if (formData.locations.length === 0) {
      newWarnings.push('Please select at least one location.');
      setWarnings(newWarnings);
      return false;
    }

    // Mandatory compliance warning
    if (formData.mandatoryCompliance && !formData.allowExceptions) {
      newWarnings.push('Mandatory compliance without exceptions requires management approval.');
    }

    setWarnings(newWarnings);
    return true;
  };

  const resetForm = () => {
    setFormData({
      policyName: '',
      policyType: '',
      description: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      applicableTo: [],
      locations: [],
      mandatoryCompliance: false,
      allowExceptions: true,
    });
    setWarnings([]);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please correct the validation errors');
      return;
    }

    if (!formData.policyName || !formData.policyType || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const policy: PolicyData = {
      id: Date.now().toString(),
      policyName: formData.policyName,
      policyType: policyTypes.find(t => t.value === formData.policyType)?.label || formData.policyType,
      description: formData.description,
      effectiveDate: formData.effectiveDate,
      expiryDate: formData.expiryDate || undefined,
      applicableTo: formData.applicableTo,
      locations: formData.locations,
      mandatoryCompliance: formData.mandatoryCompliance,
      allowExceptions: formData.allowExceptions,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    onSubmit(policy);
    resetForm();
    onClose();
    toast.success('Policy created successfully');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-brand-500" />
            Create Commuting Policy
          </DialogTitle>
          <DialogDescription>
            Define policies to guide employee commuting behavior
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Policy Name */}
          <div>
            <Label htmlFor="policyName">
              Policy Name *
            </Label>
            <Input
              id="policyName"
              value={formData.policyName}
              onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
              placeholder="e.g., 2026 Carpooling Incentive Policy"
            />
          </div>

          {/* Policy Type */}
          <div>
            <Label htmlFor="policyType">Policy Type *</Label>
            <Select value={formData.policyType} onValueChange={(value) => setFormData({ ...formData, policyType: value })}>
              <SelectTrigger id="policyType">
                <SelectValue placeholder="Select policy type" />
              </SelectTrigger>
              <SelectContent>
                {policyTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="py-1">
                      <p className="font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Policy Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the policy objectives, rules, and benefits..."
              rows={4}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="effectiveDate">
                <Calendar className="h-4 w-4 inline mr-1" />
                Effective Date *
              </Label>
              <Input
                id="effectiveDate"
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="expiryDate">
                <Calendar className="h-4 w-4 inline mr-1" />
                Expiry Date (Optional)
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                min={formData.effectiveDate}
              />
            </div>
          </div>

          {/* Applicable To */}
          <div>
            <Label>
              <Users className="h-4 w-4 inline mr-1" />
              Applicable To *
            </Label>
            <div className="mt-2 space-y-2">
              {employeeGroups.map((group) => (
                <div key={group} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`group-${group}`}
                    checked={formData.applicableTo.includes(group)}
                    onChange={() => toggleApplicableTo(group)}
                    className="rounded"
                  />
                  <label htmlFor={`group-${group}`} className="text-sm text-foreground cursor-pointer">
                    {group}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <Label>Applicable Locations *</Label>
            <div className="mt-2 space-y-2">
              {locationOptions.map((location) => (
                <div key={location} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`location-${location}`}
                    checked={formData.locations.includes(location)}
                    onChange={() => toggleLocation(location)}
                    className="rounded"
                  />
                  <label htmlFor={`location-${location}`} className="text-sm text-foreground cursor-pointer">
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Settings */}
          <div className="space-y-3 p-4 bg-background-subtle rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Mandatory Compliance</p>
                <p className="text-xs text-muted-foreground">Employees must comply with this policy</p>
              </div>
              <Switch
                checked={formData.mandatoryCompliance}
                onCheckedChange={(checked) => setFormData({ ...formData, mandatoryCompliance: checked })}
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Allow Exceptions</p>
                <p className="text-xs text-muted-foreground">Permit case-by-case exceptions</p>
              </div>
              <Switch
                checked={formData.allowExceptions}
                onCheckedChange={(checked) => setFormData({ ...formData, allowExceptions: checked })}
              />
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((warning, idx) => (
                <div key={idx} className="p-3 bg-warning-subtle border border-warning/25 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-warning">{warning}</p>
                </div>
              ))}
            </div>
          )}

          {/* Policy Summary */}
          <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-info">Policy Summary</p>
                <div className="mt-2 space-y-1 text-xs text-info">
                  <p>• Applies to: {formData.applicableTo.length} employee group(s)</p>
                  <p>• Locations: {formData.locations.length} location(s)</p>
                  <p>• Compliance: {formData.mandatoryCompliance ? 'Mandatory' : 'Optional'}</p>
                  <p>• Status: Will be created as draft for review</p>
                </div>
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
            disabled={
              !formData.policyName || 
              !formData.policyType || 
              !formData.description ||
              formData.applicableTo.length === 0 ||
              formData.locations.length === 0
            }
          >
            Create Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
