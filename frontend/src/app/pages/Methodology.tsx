import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { BookOpen, Download, Eye, Edit, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const methodologies = [
  { id: 'm1', name: 'GHG Protocol Corporate Standard', version: '2023', status: 'active', description: 'Greenhouse Gas Protocol for corporate accounting' },
  { id: 'm2', name: 'ISO 14064-1', version: '2018', status: 'active', description: 'Specification with guidance at org level for GHG inventories' },
  { id: 'm3', name: 'CSRD/ESRS E1', version: '2024', status: 'active', description: 'Corporate Sustainability Reporting Directive' },
  { id: 'm4', name: 'Science Based Targets', version: '2023', status: 'reference', description: 'SBTi methodology for target setting' },
];

const sections = [
  { id: 's1', title: 'Organizational Boundaries', status: 'complete', lastUpdated: '2026-02-01' },
  { id: 's2', title: 'Operational Boundaries', status: 'complete', lastUpdated: '2026-02-01' },
  { id: 's3', title: 'Emission Factors', status: 'complete', lastUpdated: '2026-02-15' },
  { id: 's4', title: 'Calculation Methods', status: 'complete', lastUpdated: '2026-02-10' },
  { id: 's5', title: 'Data Quality', status: 'review', lastUpdated: '2026-02-18' },
];

export default function Methodology() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<any>(null);

  const handleExport = () => {
    toast.success('Exporting methodology documentation...');
    setIsExportDialogOpen(false);
  };

  const handleSaveSection = () => {
    toast.success('Section updated successfully');
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Methodology</h1>
          <p className="text-muted-foreground mt-1">
            Emissions calculation methodology and standards
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Documentation
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <BookOpen className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Standards</p>
              <p className="text-2xl font-bold text-foreground">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sections Complete</p>
              <p className="text-2xl font-bold text-foreground">4/5</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <BookOpen className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Primary Standard</p>
              <p className="text-lg font-bold text-foreground">GHG Protocol</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <BookOpen className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-lg font-bold text-foreground">Feb 18, 2026</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Applied Methodologies */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Applied Methodologies</h3>
        <div className="space-y-3">
          {methodologies.map((method) => (
            <div key={method.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">{method.name}</h4>
                    <Badge className={
                      method.status === 'active' ? 'bg-success-subtle text-success' : 'bg-muted text-foreground'
                    }>
                      {method.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                  <p className="text-xs text-muted-foreground">Version: {method.version}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMethod(method);
                    setIsViewDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Documentation Sections */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Documentation Sections</h3>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-foreground">{section.title}</h4>
                    <Badge className={
                      section.status === 'complete' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
                    }>
                      {section.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Last updated: {section.lastUpdated}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSection(section);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Key Principles */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Key Accounting Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
            <h4 className="font-medium text-info mb-2">Relevance</h4>
            <p className="text-sm text-info">
              Ensure the GHG inventory appropriately reflects emissions and serves decision-making needs
            </p>
          </div>
          <div className="p-4 bg-success-subtle border border-success/25 rounded-lg">
            <h4 className="font-medium text-success mb-2">Completeness</h4>
            <p className="text-sm text-success">
              Account for and report all GHG emission sources within the chosen boundaries
            </p>
          </div>
          <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Consistency</h4>
            <p className="text-sm text-info">
              Use consistent methodologies to allow meaningful comparisons over time
            </p>
          </div>
          <div className="p-4 bg-warning-subtle border border-warning/25 rounded-lg">
            <h4 className="font-medium text-warning mb-2">Transparency</h4>
            <p className="text-sm text-warning">
              Address all relevant issues factually and coherently based on clear audit trail
            </p>
          </div>
          <div className="p-4 bg-destructive-subtle border border-destructive/25 rounded-lg">
            <h4 className="font-medium text-destructive mb-2">Accuracy</h4>
            <p className="text-sm text-destructive">
              Ensure emissions quantifications are systematically neither over nor under actual emissions
            </p>
          </div>
        </div>
      </Card>

      {/* View Method Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Methodology Details</DialogTitle>
            <DialogDescription>{selectedMethod?.name}</DialogDescription>
          </DialogHeader>
          {selectedMethod && (
            <div className="py-4 space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Version</Label>
                <p className="font-medium text-foreground mt-1">{selectedMethod.version}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Status</Label>
                <p className="font-medium text-foreground mt-1">{selectedMethod.status}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Description</Label>
                <p className="text-foreground mt-1">{selectedMethod.description}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Application</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  This methodology is applied to all Scope 3 Category 7 employee commuting calculations
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogDescription>{selectedSection?.title}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="content">Section Content *</Label>
            <Textarea
              id="content"
              placeholder="Enter section documentation..."
              rows={6}
              defaultValue="Documentation content goes here..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSection}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Methodology</DialogTitle>
            <DialogDescription>Download complete methodology documentation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="format">Export Format *</Label>
            <Select defaultValue="pdf">
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="word">Word Document</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 p-4 bg-background-subtle border rounded-lg">
              <p className="text-sm text-foreground font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Applied methodologies</li>
                <li>All documentation sections</li>
                <li>Accounting principles</li>
                <li>Version history</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
