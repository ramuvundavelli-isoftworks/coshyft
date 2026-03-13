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
          <h1 className="text-3xl font-bold text-gray-900">Methodology</h1>
          <p className="text-gray-600 mt-1">
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Standards</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sections Complete</p>
              <p className="text-2xl font-bold text-gray-900">4/5</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Primary Standard</p>
              <p className="text-lg font-bold text-gray-900">GHG Protocol</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-lg font-bold text-gray-900">Feb 18, 2026</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Applied Methodologies */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Applied Methodologies</h3>
        <div className="space-y-3">
          {methodologies.map((method) => (
            <div key={method.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{method.name}</h4>
                    <Badge className={
                      method.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }>
                      {method.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                  <p className="text-xs text-gray-500">Version: {method.version}</p>
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
        <h3 className="font-semibold text-gray-900 mb-4">Documentation Sections</h3>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{section.title}</h4>
                    <Badge className={
                      section.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }>
                      {section.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">Last updated: {section.lastUpdated}</p>
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
        <h3 className="font-semibold text-gray-900 mb-4">Key Accounting Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Relevance</h4>
            <p className="text-sm text-blue-700">
              Ensure the GHG inventory appropriately reflects emissions and serves decision-making needs
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Completeness</h4>
            <p className="text-sm text-green-700">
              Account for and report all GHG emission sources within the chosen boundaries
            </p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Consistency</h4>
            <p className="text-sm text-purple-700">
              Use consistent methodologies to allow meaningful comparisons over time
            </p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Transparency</h4>
            <p className="text-sm text-yellow-700">
              Address all relevant issues factually and coherently based on clear audit trail
            </p>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Accuracy</h4>
            <p className="text-sm text-red-700">
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
                <Label className="text-sm text-gray-600">Version</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedMethod.version}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Status</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedMethod.status}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Description</Label>
                <p className="text-gray-900 mt-1">{selectedMethod.description}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Application</Label>
                <p className="text-sm text-gray-600 mt-1">
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
            <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Export includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
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
