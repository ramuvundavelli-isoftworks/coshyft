// Template Selection Modal
// For selecting and using report templates

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { FileText, Search, Star, Clock, Eye, Copy, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: ReportTemplate) => void;
  templateType?: 'all' | 'csrd' | 'regulatory' | 'custom';
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'csrd' | 'regulatory' | 'internal' | 'custom';
  sections: string[];
  lastUsed?: string;
  usageCount: number;
  isFavorite: boolean;
  isDefault: boolean;
  createdBy: string;
  tags: string[];
}

const mockTemplates: ReportTemplate[] = [
  {
    id: 'csrd-annual',
    name: 'CSRD Annual Disclosure',
    description: 'Complete ESRS E1 Climate Change disclosure for annual reporting',
    category: 'csrd',
    sections: ['Executive Summary', 'ESRS E1-1 to E1-9', 'Scope 3 Cat 7', 'Targets', 'Actions', 'KPIs'],
    lastUsed: '2026-02-15',
    usageCount: 24,
    isFavorite: true,
    isDefault: true,
    createdBy: 'System',
    tags: ['CSRD', 'ESRS E1', 'Annual', 'Mandatory'],
  },
  {
    id: 'csrd-quarterly',
    name: 'CSRD Quarterly Update',
    description: 'Quarterly progress report for ESRS E1 requirements',
    category: 'csrd',
    sections: ['Progress Summary', 'Emissions Update', 'Initiatives Status', 'Risks'],
    lastUsed: '2026-02-10',
    usageCount: 48,
    isFavorite: true,
    isDefault: false,
    createdBy: 'System',
    tags: ['CSRD', 'Quarterly', 'Progress'],
  },
  {
    id: 'epa-submission',
    name: 'EPA Ireland Submission',
    description: 'Standard format for EPA Ireland GHG reporting',
    category: 'regulatory',
    sections: ['Organization Details', 'Scope 1-3 Emissions', 'Methodology', 'Verification'],
    lastUsed: '2026-01-20',
    usageCount: 12,
    isFavorite: false,
    isDefault: false,
    createdBy: 'System',
    tags: ['EPA', 'Regulatory', 'Ireland'],
  },
  {
    id: 'seai-annual',
    name: 'SEAI Annual Report',
    description: 'SEAI compliance report for Irish operations',
    category: 'regulatory',
    sections: ['Energy Usage', 'Transport Emissions', 'Efficiency Measures', 'Targets'],
    lastUsed: '2025-12-15',
    usageCount: 8,
    isFavorite: false,
    isDefault: false,
    createdBy: 'System',
    tags: ['SEAI', 'Energy', 'Ireland'],
  },
  {
    id: 'board-executive',
    name: 'Board Executive Summary',
    description: 'High-level summary for board meetings',
    category: 'internal',
    sections: ['Key Metrics', 'Highlights', 'Risks', 'Actions Required', 'Budget'],
    lastUsed: '2026-02-18',
    usageCount: 36,
    isFavorite: true,
    isDefault: false,
    createdBy: 'Admin',
    tags: ['Board', 'Executive', 'Summary'],
  },
  {
    id: 'monthly-ops',
    name: 'Monthly Operations Report',
    description: 'Detailed operational metrics for internal review',
    category: 'internal',
    sections: ['Participation', 'Emissions by Location', 'Mode Split', 'Initiatives', 'Budget'],
    lastUsed: '2026-02-19',
    usageCount: 156,
    isFavorite: false,
    isDefault: false,
    createdBy: 'Admin',
    tags: ['Monthly', 'Operations'],
  },
  {
    id: 'custom-stakeholder',
    name: 'Stakeholder Communication',
    description: 'Custom template for external stakeholder updates',
    category: 'custom',
    sections: ['Overview', 'Achievements', 'Future Plans', 'Contact'],
    lastUsed: '2026-01-30',
    usageCount: 6,
    isFavorite: false,
    isDefault: false,
    createdBy: 'John Smith',
    tags: ['Custom', 'Stakeholder', 'Communication'],
  },
];

const categoryColors = {
  csrd: 'bg-info-subtle text-info border-info/25',
  regulatory: 'bg-info-subtle text-info border-info/25',
  internal: 'bg-success-subtle text-success border-success/25',
  custom: 'bg-warning-subtle text-warning border-warning/25',
};

export function TemplateSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  templateType = 'all' 
}: TemplateSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(templateType);
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockTemplates);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
    ));
    toast.success('Favorite updated');
  };

  const handleSelect = (template: ReportTemplate) => {
    onSelect(template);
    toast.success(`Template "${template.name}" selected`);
    onClose();
  };

  const duplicateTemplate = (template: ReportTemplate) => {
    const newTemplate: ReportTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      category: 'custom',
      usageCount: 0,
      isFavorite: false,
      isDefault: false,
      createdBy: 'Current User',
      lastUsed: undefined,
    };
    setTemplates([...templates, newTemplate]);
    toast.success('Template duplicated');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-brand-500" />
            Select Report Template
          </DialogTitle>
          <DialogDescription>
            Choose a pre-built template or create a custom report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'csrd' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('csrd')}
              >
                CSRD
              </Button>
              <Button
                variant={selectedCategory === 'regulatory' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('regulatory')}
              >
                Regulatory
              </Button>
              <Button
                variant={selectedCategory === 'internal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('internal')}
              >
                Internal
              </Button>
              <Button
                variant={selectedCategory === 'custom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('custom')}
              >
                Custom
              </Button>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 border-2 border-border rounded-lg hover:border-brand-500 transition-all cursor-pointer"
                onClick={() => handleSelect(template)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{template.name}</h3>
                      {template.isDefault && (
                        <Badge variant="outline" className="bg-info-subtle text-info border-info/25 text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className={`text-xs ${categoryColors[template.category]}`}>
                      {template.category.toUpperCase()}
                    </Badge>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(template.id);
                    }}
                    className="text-muted-foreground hover:text-warning transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 ${template.isFavorite ? 'fill-warning text-warning' : ''}`}
                    />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>

                {/* Sections */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Sections included:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.sections.slice(0, 3).map((section, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-background-subtle">
                        {section}
                      </Badge>
                    ))}
                    {template.sections.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-background-subtle">
                        +{template.sections.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{template.lastUsed ? new Date(template.lastUsed).toLocaleDateString('en-IE') : 'Never used'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{template.usageCount} uses</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateTemplate(template);
                      }}
                      className="h-7 w-7 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Created By */}
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span>by {template.createdBy}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No templates found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-background-subtle rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{templates.length}</p>
              <p className="text-xs text-muted-foreground">Total Templates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {templates.filter(t => t.category === 'csrd').length}
              </p>
              <p className="text-xs text-muted-foreground">CSRD</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {templates.filter(t => t.isFavorite).length}
              </p>
              <p className="text-xs text-muted-foreground">Favorites</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {templates.filter(t => t.category === 'custom').length}
              </p>
              <p className="text-xs text-muted-foreground">Custom</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => toast.info('Create custom template feature coming soon')}>
            Create Custom Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
