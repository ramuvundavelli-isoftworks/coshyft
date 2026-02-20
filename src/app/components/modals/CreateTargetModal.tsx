// Create Target Modal
// For setting reduction targets in Targets & Trajectory page

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
import { Calendar, TrendingDown, Target as TargetIcon, AlertCircle, CheckCircle, Percent } from 'lucide-react';
import { toast } from 'sonner';

interface CreateTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TargetData) => void;
  baselineYear?: number;
  baselineEmissions?: number;
}

export interface TargetData {
  id?: string;
  targetName: string;
  baselineYear: number;
  targetYear: number;
  reductionPercentage: number;
  targetEmissions: number;
  targetType: 'absolute' | 'intensity' | 'sbti';
  scope: 'scope-1' | 'scope-2' | 'scope-3' | 'total';
  alignment: string;
  status: 'draft' | 'active' | 'achieved';
  notes?: string;
  createdAt?: string;
}

const targetTypes = [
  { 
    value: 'absolute', 
    label: 'Absolute Reduction', 
    description: 'Reduce total emissions by a specific percentage',
    example: 'Reduce by 50% by 2030'
  },
  { 
    value: 'intensity', 
    label: 'Intensity Reduction', 
    description: 'Reduce emissions per unit of activity',
    example: 'Reduce tCO₂e per employee by 40%'
  },
  { 
    value: 'sbti', 
    label: 'Science-Based Target', 
    description: 'Aligned with 1.5°C climate science',
    example: 'SBTi validated pathway'
  },
];

const scopeOptions = [
  { value: 'scope-1', label: 'Scope 1 Only', description: 'Direct emissions' },
  { value: 'scope-2', label: 'Scope 2 Only', description: 'Indirect energy emissions' },
  { value: 'scope-3', label: 'Scope 3 Only', description: 'Value chain emissions (Cat 7)' },
  { value: 'total', label: 'Total (Scope 1+2+3)', description: 'All emissions' },
];

const alignmentOptions = [
  'Paris Agreement (1.5°C)',
  'EU Climate Law (55% by 2030)',
  'Ireland Climate Action Plan',
  'Science Based Targets Initiative (SBTi)',
  'Net Zero by 2050',
  'Custom Target',
];

export function CreateTargetModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  baselineYear = 2024,
  baselineEmissions = 0
}: CreateTargetModalProps) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    targetName: '',
    baselineYear: baselineYear,
    targetYear: 2030,
    reductionPercentage: 50,
    targetType: 'absolute' as 'absolute' | 'intensity' | 'sbti',
    scope: 'scope-3' as 'scope-1' | 'scope-2' | 'scope-3' | 'total',
    alignment: '',
    notes: '',
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const calculateTargetEmissions = () => {
    if (baselineEmissions === 0) return 0;
    return baselineEmissions * (1 - formData.reductionPercentage / 100);
  };

  const calculateAnnualReduction = () => {
    const years = formData.targetYear - formData.baselineYear;
    if (years <= 0) return 0;
    return formData.reductionPercentage / years;
  };

  const validateForm = () => {
    const newWarnings: string[] = [];

    // Check target year
    if (formData.targetYear <= formData.baselineYear) {
      newWarnings.push('Target year must be after baseline year.');
      setWarnings(newWarnings);
      return false;
    }

    const yearsDiff = formData.targetYear - formData.baselineYear;
    if (yearsDiff > 30) {
      newWarnings.push('Target year is more than 30 years from baseline. Consider interim targets.');
    }

    // Check reduction percentage
    if (formData.reductionPercentage < 10) {
      newWarnings.push('Reduction target below 10% may not align with climate science.');
    }

    if (formData.reductionPercentage > 90) {
      newWarnings.push('Reduction target above 90% is very ambitious. Ensure feasibility.');
    }

    // Check annual reduction rate
    const annualRate = calculateAnnualReduction();
    if (annualRate > 10) {
      newWarnings.push(`Annual reduction of ${annualRate.toFixed(1)}% is very aggressive. Consider feasibility.`);
    }

    // SBTi alignment check
    if (formData.targetType === 'sbti' && formData.reductionPercentage < 42) {
      newWarnings.push('SBTi targets typically require at least 42% reduction (Scope 1+2) by 2030.');
    }

    setWarnings(newWarnings);
    return true;
  };

  const resetForm = () => {
    setFormData({
      targetName: '',
      baselineYear: baselineYear,
      targetYear: 2030,
      reductionPercentage: 50,
      targetType: 'absolute',
      scope: 'scope-3',
      alignment: '',
      notes: '',
    });
    setWarnings([]);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please correct the validation errors');
      return;
    }

    if (!formData.targetName || !formData.alignment) {
      toast.error('Please provide target name and alignment');
      return;
    }

    const target: TargetData = {
      id: Date.now().toString(),
      targetName: formData.targetName,
      baselineYear: formData.baselineYear,
      targetYear: formData.targetYear,
      reductionPercentage: formData.reductionPercentage,
      targetEmissions: calculateTargetEmissions(),
      targetType: formData.targetType,
      scope: formData.scope,
      alignment: formData.alignment,
      status: 'active',
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    onSubmit(target);
    resetForm();
    onClose();
    toast.success('Reduction target created successfully');
  };

  const targetEmissions = calculateTargetEmissions();
  const annualReduction = calculateAnnualReduction();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 text-[#00bc7d]" />
            Create Reduction Target
          </DialogTitle>
          <DialogDescription>
            Set ambitious, science-aligned emission reduction targets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Target Name */}
          <div>
            <Label htmlFor="targetName">
              <TargetIcon className="h-4 w-4 inline mr-1" />
              Target Name *
            </Label>
            <Input
              id="targetName"
              value={formData.targetName}
              onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
              placeholder="e.g., 2030 Scope 3 Reduction Target"
            />
          </div>

          {/* Years */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baselineYear">
                <Calendar className="h-4 w-4 inline mr-1" />
                Baseline Year
              </Label>
              <Input
                id="baselineYear"
                type="number"
                value={formData.baselineYear}
                onChange={(e) => setFormData({ ...formData, baselineYear: parseInt(e.target.value) })}
                disabled
              />
            </div>

            <div>
              <Label htmlFor="targetYear">
                <Calendar className="h-4 w-4 inline mr-1" />
                Target Year *
              </Label>
              <Select 
                value={String(formData.targetYear)} 
                onValueChange={(value) => setFormData({ ...formData, targetYear: parseInt(value) })}
              >
                <SelectTrigger id="targetYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => currentYear + i + 1).map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Target Type */}
          <div>
            <Label htmlFor="targetType">Target Type *</Label>
            <Select 
              value={formData.targetType} 
              onValueChange={(value: 'absolute' | 'intensity' | 'sbti') => 
                setFormData({ ...formData, targetType: value })
              }
            >
              <SelectTrigger id="targetType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {targetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="py-1">
                      <p className="font-medium">{type.label}</p>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scope */}
          <div>
            <Label htmlFor="scope">Emissions Scope *</Label>
            <Select 
              value={formData.scope} 
              onValueChange={(value: 'scope-1' | 'scope-2' | 'scope-3' | 'total') => 
                setFormData({ ...formData, scope: value })
              }
            >
              <SelectTrigger id="scope">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scopeOptions.map((scope) => (
                  <SelectItem key={scope.value} value={scope.value}>
                    <div className="py-1">
                      <p className="font-medium">{scope.label}</p>
                      <p className="text-xs text-gray-500">{scope.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reduction Percentage */}
          <div>
            <Label htmlFor="reductionPercentage">
              <Percent className="h-4 w-4 inline mr-1" />
              Reduction Target: {formData.reductionPercentage}%
            </Label>
            <input
              id="reductionPercentage"
              type="range"
              min="10"
              max="100"
              step="5"
              value={formData.reductionPercentage}
              onChange={(e) => setFormData({ ...formData, reductionPercentage: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Target Calculation Display */}
          {baselineEmissions > 0 && (
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Baseline ({formData.baselineYear})</p>
                  <p className="text-xl font-bold text-gray-900">{baselineEmissions.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">tCO₂e</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Target ({formData.targetYear})</p>
                  <p className="text-xl font-bold text-green-600">{targetEmissions.toFixed(1)}</p>
                  <p className="text-xs text-gray-500">tCO₂e</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Annual Reduction</p>
                  <p className="text-xl font-bold text-blue-600">{annualReduction.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">per year</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-green-200">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <p className="text-sm text-green-900">
                  <strong>{(baselineEmissions - targetEmissions).toFixed(1)} tCO₂e</strong> reduction needed
                </p>
              </div>
            </div>
          )}

          {/* Alignment */}
          <div>
            <Label htmlFor="alignment">Climate Alignment *</Label>
            <Select value={formData.alignment} onValueChange={(value) => setFormData({ ...formData, alignment: value })}>
              <SelectTrigger id="alignment">
                <SelectValue placeholder="Select alignment framework" />
              </SelectTrigger>
              <SelectContent>
                {alignmentOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Implementation Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Document key strategies, initiatives, or assumptions for achieving this target..."
              rows={3}
            />
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((warning, idx) => (
                <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-800">{warning}</p>
                </div>
              ))}
            </div>
          )}

          {/* SBTi Info */}
          {formData.targetType === 'sbti' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Science-Based Target Guidelines</p>
                  <ul className="text-xs text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                    <li>Scope 1+2: Minimum 42% reduction by 2030 (1.5°C pathway)</li>
                    <li>Scope 3: Minimum 25% reduction if &gt;40% of total emissions</li>
                    <li>Long-term: Net-zero by 2050 maximum</li>
                    <li>Targets require SBTi validation for official recognition</li>
                  </ul>
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
            disabled={!formData.targetName || !formData.alignment}
          >
            Create Target
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
