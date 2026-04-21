// Create Tenant Modal
// For creating new tenant organizations in SuperAdmin Tenant Management

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
import { Building2, Users, Mail, Phone, MapPin, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';

interface CreateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantData) => void;
}

export interface TenantData {
  id?: string;
  companyName: string;
  subdomain: string;
  industry: string;
  size: string;
  country: string;
  city: string;
  adminEmail: string;
  adminName: string;
  phone?: string;
  billingPlan: 'starter' | 'professional' | 'enterprise';
  maxUsers: number;
  features: string[];
  status: 'active' | 'trial' | 'suspended';
  trialEndsAt?: string;
  createdAt?: string;
}

const industries = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Professional Services',
  'Energy & Utilities',
  'Transportation',
  'Government',
  'Education',
  'Other',
];

const companySizes = [
  { value: '1-50', label: '1-50 employees', maxUsers: 50 },
  { value: '51-200', label: '51-200 employees', maxUsers: 200 },
  { value: '201-500', label: '201-500 employees', maxUsers: 500 },
  { value: '501-1000', label: '501-1,000 employees', maxUsers: 1000 },
  { value: '1001-5000', label: '1,001-5,000 employees', maxUsers: 5000 },
  { value: '5001+', label: '5,001+ employees', maxUsers: 10000 },
];

const billingPlans = [
  { 
    value: 'starter', 
    label: 'Starter', 
    description: 'Basic features for small teams',
    price: '€49/month',
    features: ['Up to 50 users', 'Basic reporting', 'Email support']
  },
  { 
    value: 'professional', 
    label: 'Professional', 
    description: 'Advanced features for growing companies',
    price: '€199/month',
    features: ['Up to 500 users', 'Advanced analytics', 'Priority support', 'Custom integrations']
  },
  { 
    value: 'enterprise', 
    label: 'Enterprise', 
    description: 'Full platform for large organizations',
    price: 'Custom pricing',
    features: ['Unlimited users', 'White-label', 'Dedicated support', 'SLA guarantee', 'Custom development']
  },
];

const enterpriseFeatures = [
  'CSRD/ESRS E1 Reporting',
  'Advanced Analytics',
  'Multi-location Support',
  'Custom Integrations',
  'API Access',
  'SSO/SAML',
  'Audit Trail',
  'Data Export',
];

export function CreateTenantModal({ isOpen, onClose, onSubmit }: CreateTenantModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    subdomain: '',
    industry: '',
    size: '',
    country: 'Ireland',
    city: '',
    adminEmail: '',
    adminName: '',
    phone: '',
    billingPlan: 'professional' as 'starter' | 'professional' | 'enterprise',
    features: [] as string[],
    startAsTrial: true,
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const generateSubdomain = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 30);
  };

  const handleCompanyNameChange = (name: string) => {
    setFormData({
      ...formData,
      companyName: name,
      subdomain: generateSubdomain(name),
    });
  };

  const toggleFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.includes(feature)
        ? formData.features.filter(f => f !== feature)
        : [...formData.features, feature],
    });
  };

  const validateForm = () => {
    const newWarnings: string[] = [];

    // Validate subdomain
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(formData.subdomain)) {
      newWarnings.push('Subdomain can only contain lowercase letters, numbers, and hyphens.');
      setWarnings(newWarnings);
      return false;
    }

    if (formData.subdomain.length < 3) {
      newWarnings.push('Subdomain must be at least 3 characters long.');
      setWarnings(newWarnings);
      return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.adminEmail)) {
      newWarnings.push('Please enter a valid email address.');
      setWarnings(newWarnings);
      return false;
    }

    // Validate phone (optional)
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newWarnings.push('Please enter a valid phone number.');
    }

    setWarnings(newWarnings);
    return true;
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      subdomain: '',
      industry: '',
      size: '',
      country: 'Ireland',
      city: '',
      adminEmail: '',
      adminName: '',
      phone: '',
      billingPlan: 'professional',
      features: [],
      startAsTrial: true,
    });
    setWarnings([]);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Please correct the validation errors');
      return;
    }

    if (!formData.companyName || !formData.subdomain || !formData.industry || 
        !formData.size || !formData.adminEmail || !formData.adminName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const sizeOption = companySizes.find(s => s.value === formData.size);
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    const tenant: TenantData = {
      id: Date.now().toString(),
      companyName: formData.companyName,
      subdomain: formData.subdomain,
      industry: formData.industry,
      size: formData.size,
      country: formData.country,
      city: formData.city,
      adminEmail: formData.adminEmail,
      adminName: formData.adminName,
      phone: formData.phone || undefined,
      billingPlan: formData.billingPlan,
      maxUsers: sizeOption?.maxUsers || 500,
      features: formData.features.length > 0 ? formData.features : 
        billingPlans.find(p => p.value === formData.billingPlan)?.features || [],
      status: formData.startAsTrial ? 'trial' : 'active',
      trialEndsAt: formData.startAsTrial ? trialEndDate.toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    onSubmit(tenant);
    resetForm();
    onClose();
    toast.success(`Tenant "${formData.companyName}" created successfully`);
  };

  const selectedPlan = billingPlans.find(p => p.value === formData.billingPlan);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-brand-500" />
            Create New Tenant
          </DialogTitle>
          <DialogDescription>
            Set up a new organization on the enwayu platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Company Information</h3>
            
            <div>
              <Label htmlFor="companyName">
                <Building2 className="h-4 w-4 inline mr-1" />
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleCompanyNameChange(e.target.value)}
                placeholder="e.g., Acme Corporation"
              />
            </div>

            <div>
              <Label htmlFor="subdomain">
                Subdomain *
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })}
                  placeholder="acme-corp"
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">.enwayu.io</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                URL: https://{formData.subdomain || 'your-company'}.enwayu.io
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="size">
                  <Users className="h-4 w-4 inline mr-1" />
                  Company Size *
                </Label>
                <Select value={formData.size} onValueChange={(value) => setFormData({ ...formData, size: value })}>
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Country *
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g., Dublin"
                />
              </div>
            </div>
          </div>

          {/* Admin Contact */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground">Administrator Contact</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="adminName">Admin Name *</Label>
                <Input
                  id="adminName"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  placeholder="John Smith"
                />
              </div>

              <div>
                <Label htmlFor="adminEmail">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Admin Email *
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  placeholder="john@acmecorp.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+353 1 234 5678"
              />
            </div>
          </div>

          {/* Billing Plan */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground">
              <CreditCard className="h-4 w-4 inline mr-1" />
              Billing Plan
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {billingPlans.map((plan) => (
                <button
                  key={plan.value}
                  onClick={() => setFormData({ ...formData, billingPlan: plan.value as any })}
                  className={`p-4 border-2 rounded-lg transition-all text-left ${
                    formData.billingPlan === plan.value
                      ? 'border-brand-500 bg-success-subtle'
                      : 'border-border hover:border-border'
                  }`}
                >
                  <p className="font-semibold text-foreground">{plan.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                  <p className="text-sm font-medium text-brand-500 mt-2">{plan.price}</p>
                </button>
              ))}
            </div>

            {selectedPlan && (
              <div className="p-3 bg-info-subtle border border-info/25 rounded-lg">
                <p className="text-sm font-medium text-info mb-2">Included Features:</p>
                <ul className="text-xs text-info space-y-1 ml-4 list-disc">
                  {selectedPlan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Enterprise Features */}
          {formData.billingPlan === 'enterprise' && (
            <div className="space-y-3">
              <Label>Additional Enterprise Features</Label>
              <div className="grid grid-cols-2 gap-2">
                {enterpriseFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`feature-${feature}`}
                      checked={formData.features.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      className="rounded"
                    />
                    <label htmlFor={`feature-${feature}`} className="text-sm text-foreground cursor-pointer">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trial Option */}
          <div className="flex items-center justify-between p-4 bg-background-subtle rounded-lg border border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Start with 30-day trial</p>
              <p className="text-xs text-muted-foreground">Free access for 30 days, then convert to paid plan</p>
            </div>
            <Switch
              checked={formData.startAsTrial}
              onCheckedChange={(checked) => setFormData({ ...formData, startAsTrial: checked })}
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

          {/* Summary */}
          <div className="p-4 bg-success-subtle border border-success/25 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-success">Tenant Setup Summary</p>
                <div className="mt-2 space-y-1 text-xs text-success">
                  <p>• Subdomain: {formData.subdomain || 'not-set'}.enwayu.io</p>
                  <p>• Plan: {selectedPlan?.label} ({selectedPlan?.price})</p>
                  <p>• Status: {formData.startAsTrial ? 'Trial (30 days)' : 'Active'}</p>
                  <p>• Admin will receive setup email at: {formData.adminEmail || 'not-set'}</p>
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
              !formData.companyName || 
              !formData.subdomain || 
              !formData.industry ||
              !formData.size ||
              !formData.city ||
              !formData.adminEmail ||
              !formData.adminName
            }
          >
            Create Tenant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
