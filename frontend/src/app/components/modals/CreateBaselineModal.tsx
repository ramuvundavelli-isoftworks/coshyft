// Create Baseline Modal
// For setting up baseline year and emissions in Baseline Setup page

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
import { Calendar, Target, Building2, FileText, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface CreateBaselineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BaselineData) => void;
}

export interface BaselineData {
  id?: string;
  baselineYear: number;
  totalEmissions: number;
  methodology: string;
  boundary: string;
  dataQuality: number;
  verificationStatus: 'pending' | 'verified' | 'audited';
  notes?: string;
  createdBy: string;
  createdAt?: string;
}

const methodologies = [
  { value: 'ghg-protocol', label: 'GHG Protocol - Corporate Standard', description: 'Industry standard for corporate emissions' },
  { value: 'iso-14064', label: 'ISO 14064-1:2018', description: 'International standard for GHG quantification' },
  { value: 'csrd-esrs', label: 'CSRD/ESRS E1', description: 'EU Corporate Sustainability Reporting Directive' },
  { value: 'sbti', label: 'Science Based Targets Initiative', description: 'Aligned with climate science' },
];

const boundaryOptions = [
  { value: 'operational', label: 'Operational Control', description: 'All operations under direct control' },
  { value: 'financial', label: 'Financial Control', description: 'Based on financial ownership' },
  { value: 'equity', label: 'Equity Share', description: 'Proportional to equity share' },
];

const verificationLevels = [
  { value: 'pending', label: 'Pending Verification', icon: AlertCircle, color: 'orange' },
  { value: 'verified', label: 'Internally Verified', icon: CheckCircle, color: 'blue' },
  { value: 'audited', label: 'Third-Party Audited', icon: Target, color: 'green' },
];

export function CreateBaselineModal({ isOpen, onClose, onSubmit }: CreateBaselineModalProps) {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    baselineYear: currentYear - 1,
    totalEmissions: '',
    methodology: '',
    boundary: '',
    dataQuality: 75,
    verificationStatus: 'pending' as 'pending' | 'verified' | 'audited',
    notes: '',
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const validateForm = () => {
    const newWarnings: string[] = [];

    // Check baseline year
    if (formData.baselineYear > currentYear - 1) {
      newWarnings.push('Baseline year should typically be a prior completed year.');
    }

    if (formData.baselineYear < currentYear - 10) {
      newWarnings.push('Baseline year is more than 10 years old. Consider updating to a more recent year.');
    }

    // Check emissions value
    const emissions = parseFloat(formData.totalEmissions);
    if (isNaN(emissions) || emissions <= 0) {
      newWarnings.push('Total emissions must be a positive number.');
      setWarnings(newWarnings);
      return false;
    }

    // Check data quality
    if (formData.dataQuality < 50) {
      newWarnings.push('Data quality below 50% may not meet CSRD/ESRS E1 requirements.');
    }

    setWarnings(newWarnings);
    return true;
  };

  const resetForm = () => {
    setFormData({
      baselineYear: currentYear - 1,
      totalEmissions: '',
      methodology: '',
      boundary: '',
      dataQuality: 75,
      verificationStatus: 'pending',
      notes: '',
    });
    setWarnings([]);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please correct the validation errors');
      return;
    }

    if (!formData.methodology || !formData.boundary) {
      toast.error('Please select methodology and boundary approach');
      return;
    }

    const baseline: BaselineData = {
      id: Date.now().toString(),
      baselineYear: formData.baselineYear,
      totalEmissions: parseFloat(formData.totalEmissions),
      methodology: methodologies.find(m => m.value === formData.methodology)?.label || formData.methodology,
      boundary: boundaryOptions.find(b => b.value === formData.boundary)?.label || formData.boundary,
      dataQuality: formData.dataQuality,
      verificationStatus: formData.verificationStatus,
      notes: formData.notes,
      createdBy: 'Current User', // Would come from auth context
      createdAt: new Date().toISOString(),
    };

    onSubmit(baseline);
    resetForm();
    onClose();
    toast.success(`Baseline for ${formData.baselineYear} created successfully`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-brand-500" />
            Create Baseline Year
          </DialogTitle>
          <DialogDescription>
            Establish your baseline year emissions for target setting and progress tracking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Baseline Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baselineYear">
                <Calendar className="h-4 w-4 inline mr-1" />
                Baseline Year *
              </Label>
              <Select 
                value={String(formData.baselineYear)} 
                onValueChange={(value) => setFormData({ ...formData, baselineYear: parseInt(value) })}
              >
                <SelectTrigger id="baselineYear">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => currentYear - i - 1).map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalEmissions">
                <TrendingUp className="h-4 w-4 inline mr-1" />
                Total Emissions (tCO₂e) *
              </Label>
              <Input
                id="totalEmissions"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalEmissions}
                onChange={(e) => setFormData({ ...formData, totalEmissions: e.target.value })}
                placeholder="e.g., 452.75"
              />
            </div>
          </div>

          {/* Methodology */}
          <div>
            <Label htmlFor="methodology">
              <FileText className="h-4 w-4 inline mr-1" />
              Calculation Methodology *
            </Label>
            <Select value={formData.methodology} onValueChange={(value) => setFormData({ ...formData, methodology: value })}>
              <SelectTrigger id="methodology">
                <SelectValue placeholder="Select methodology standard" />
              </SelectTrigger>
              <SelectContent>
                {methodologies.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="py-1">
                      <p className="font-medium">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Boundary */}
          <div>
            <Label htmlFor="boundary">
              <Building2 className="h-4 w-4 inline mr-1" />
              Organizational Boundary *
            </Label>
            <Select value={formData.boundary} onValueChange={(value) => setFormData({ ...formData, boundary: value })}>
              <SelectTrigger id="boundary">
                <SelectValue placeholder="Select consolidation approach" />
              </SelectTrigger>
              <SelectContent>
                {boundaryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="py-1">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data Quality */}
          <div>
            <Label htmlFor="dataQuality">
              Data Quality Score: {formData.dataQuality}%
            </Label>
            <input
              id="dataQuality"
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.dataQuality}
              onChange={(e) => setFormData({ ...formData, dataQuality: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor (0%)</span>
              <span>Fair (50%)</span>
              <span>Good (75%)</span>
              <span>Excellent (100%)</span>
            </div>
            <div className="mt-2">
              {formData.dataQuality >= 75 && (
                <Badge className="bg-success-subtle text-success border-success/25">
                  Meets CSRD standards
                </Badge>
              )}
              {formData.dataQuality >= 50 && formData.dataQuality < 75 && (
                <Badge className="bg-warning-subtle text-warning border-warning/25">
                  Acceptable quality
                </Badge>
              )}
              {formData.dataQuality < 50 && (
                <Badge className="bg-destructive-subtle text-destructive border-destructive/25">
                  Below standards
                </Badge>
              )}
            </div>
          </div>

          {/* Verification Status */}
          <div>
            <Label htmlFor="verificationStatus">Verification Status</Label>
            <Select 
              value={formData.verificationStatus} 
              onValueChange={(value: 'pending' | 'verified' | 'audited') => 
                setFormData({ ...formData, verificationStatus: value })
              }
            >
              <SelectTrigger id="verificationStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {verificationLevels.map((level) => {
                  const Icon = level.icon;
                  return (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 text-${level.color}-600`} />
                        <span>{level.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes & Assumptions (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Document key assumptions, exclusions, or data sources used in baseline calculation..."
              rows={3}
            />
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

          {/* CSRD Info */}
          <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-info">CSRD/ESRS E1 Requirements</p>
                <ul className="text-xs text-info mt-2 space-y-1 ml-4 list-disc">
                  <li>Baseline must be established for target setting (ESRS E1-4)</li>
                  <li>Document methodology and assumptions (ESRS E1-6)</li>
                  <li>Data quality score ≥ 75% recommended for compliance</li>
                  <li>Third-party verification required for limited assurance</li>
                </ul>
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
            disabled={!formData.totalEmissions || !formData.methodology || !formData.boundary}
          >
            Create Baseline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
