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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Shield, CheckCircle, AlertTriangle, Download, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner';

const assuranceItems = [
  { id: 'a1', area: 'Baseline', level: 'limited', provider: 'Ernst & Young', status: 'complete', date: '2026-02-28', findings: 0 },
  { id: 'a2', area: 'Emissions Data', level: 'reasonable', provider: 'PwC', status: 'in-progress', date: '2026-03-15', findings: 2 },
  { id: 'a3', area: 'Emission Factors', level: 'limited', provider: 'Deloitte', status: 'complete', date: '2026-01-30', findings: 1 },
  { id: 'a4', area: 'Data Quality', level: 'limited', provider: 'KPMG', status: 'planned', date: '2026-04-01', findings: 0 },
];

export default function AuditAssurance() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleExport = () => {
    toast.success('Exporting assurance documentation...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit & Assurance</h1>
          <p className="text-gray-600 mt-1">
            External assurance and audit tracking
          </p>
        </div>
        <Button onClick={() => setIsExportDialogOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assurance Items</p>
              <p className="text-2xl font-bold text-gray-900">{assuranceItems.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Complete</p>
              <p className="text-2xl font-bold text-green-600">
                {assuranceItems.filter(a => a.status === 'complete').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Findings</p>
              <p className="text-2xl font-bold text-yellow-600">
                {assuranceItems.reduce((sum, a) => sum + a.findings, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assurance Level</p>
              <p className="text-lg font-bold text-gray-900">Reasonable</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assurance Levels */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Assurance Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
            <h4 className="font-medium text-green-900 mb-2">Reasonable Assurance</h4>
            <p className="text-sm text-green-700">
              High, but not absolute, level of assurance. Auditor obtains sufficient appropriate evidence.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Limited Assurance</h4>
            <p className="text-sm text-gray-600">
              Lower level of assurance. Auditor performs limited procedures focused on inquiry and analytical review.
            </p>
          </div>
        </div>
      </Card>

      {/* Assurance Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Assurance Activities</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Area</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Findings</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assuranceItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.area}</TableCell>
                <TableCell>
                  <Badge className={
                    item.level === 'reasonable' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }>
                    {item.level}
                  </Badge>
                </TableCell>
                <TableCell>{item.provider}</TableCell>
                <TableCell>
                  <Badge className={
                    item.status === 'complete' ? 'bg-green-100 text-green-700' :
                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  {item.findings > 0 ? (
                    <Badge className="bg-yellow-100 text-yellow-700">{item.findings}</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-700">None</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {item.status === 'complete' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsReportDialogOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Standards Compliance */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Standards & Compliance</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">ISAE 3000</span>
            </div>
            <Badge className="bg-green-100 text-green-700">Compliant</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">AA1000AS</span>
            </div>
            <Badge className="bg-green-100 text-green-700">Compliant</Badge>
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">ISO 14064-3</span>
            </div>
            <Badge className="bg-green-100 text-green-700">Compliant</Badge>
          </div>
        </div>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assurance Details</DialogTitle>
            <DialogDescription>{selectedItem?.area}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Level</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedItem.level}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Provider</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedItem.provider}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedItem.status}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Date</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedItem.date}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Findings</Label>
                <p className="font-medium text-gray-900 mt-1">
                  {selectedItem.findings > 0 ? `${selectedItem.findings} finding(s)` : 'No findings'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assurance Report</DialogTitle>
            <DialogDescription>Download assurance documentation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Report includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Assurance opinion</li>
                <li>Scope of work</li>
                <li>Methodology applied</li>
                <li>Findings and observations</li>
                <li>Management responses</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success('Downloading report...');
              setIsReportDialogOpen(false);
            }}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Assurance Data</DialogTitle>
            <DialogDescription>Download comprehensive assurance documentation</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="format">Export Format *</Label>
            <Select defaultValue="pdf">
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="word">Word Document</SelectItem>
                <SelectItem value="excel">Excel Workbook</SelectItem>
              </SelectContent>
            </Select>
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
