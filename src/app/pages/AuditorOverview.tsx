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
import { Shield, CheckCircle, AlertTriangle, Clock, Download, Plus, Eye, Calendar } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { doughnutChartOptions, barChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';

const auditStatusData = [
  { name: 'Verified', value: 72, color: '#10b981' },
  { name: 'In Review', value: 18, color: '#f59e0b' },
  { name: 'Issues Found', value: 8, color: '#ef4444' },
  { name: 'Pending', value: 2, color: '#9ca3af' },
];

const findingsByCategory = [
  { category: 'Baseline', findings: 3 },
  { category: 'Emissions', findings: 5 },
  { category: 'Factors', findings: 2 },
  { category: 'Risks', findings: 4 },
];

const auditItems = [
  { id: 'a1', area: 'Baseline Verification', status: 'completed', findings: 1, priority: 'medium' },
  { id: 'a2', area: 'Emissions Data Review', status: 'in-progress', findings: 3, priority: 'high' },
  { id: 'a3', area: 'Factor Validation', status: 'completed', findings: 0, priority: 'low' },
  { id: 'a4', area: 'Risk Assessment', status: 'pending', findings: 0, priority: 'medium' },
];

export default function AuditorOverview() {
  const [isViewItemDialogOpen, setIsViewItemDialogOpen] = useState(false);
  const [isAddFindingDialogOpen, setIsAddFindingDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [finding, setFinding] = useState('');

  const handleAddFinding = () => {
    toast.success('Audit finding added successfully');
    setIsAddFindingDialogOpen(false);
    setFinding('');
  };

  const handleExport = () => {
    toast.success('Exporting audit summary...');
    setIsExportDialogOpen(false);
  };

  const handleSchedule = () => {
    toast.success('Review scheduled successfully');
    setIsScheduleDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#00bc7d] to-[#009689] rounded-[14px] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['Kaisei_Decol',sans-serif] font-bold text-[42px] leading-[32px] text-white tracking-[0.0703px] mb-2">Auditor Dashboard</h1>
            <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-[#d0fae5] tracking-[-0.3125px]">
              Independent verification and audit oversight
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(true)} className="bg-white hover:bg-gray-50">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Review
            </Button>
            <Button onClick={() => setIsExportDialogOpen(true)} className="bg-black hover:bg-gray-900 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export Summary
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified Items</p>
              <p className="text-2xl font-bold text-gray-900">72</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Review</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Findings</p>
              <p className="text-2xl font-bold text-gray-900">14</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Assurance Level</p>
              <p className="text-2xl font-bold text-green-600">High</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Audit Status & Findings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold text-gray-900 mb-4">Audit Status Distribution</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Doughnut
              data={{
                labels: auditStatusData.map(d => d.name),
                datasets: [
                  {
                    data: auditStatusData.map(d => d.value),
                    backgroundColor: auditStatusData.map(d => d.color),
                    borderWidth: 0,
                  },
                ],
              }}
              options={doughnutChartOptions}
            />
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold text-gray-900 mb-4">Findings by Category</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Bar
              data={{
                labels: findingsByCategory.map(d => d.category),
                datasets: [
                  {
                    label: 'Findings',
                    data: findingsByCategory.map(d => d.findings),
                    backgroundColor: '#94a3b8',
                    borderRadius: 6,
                  },
                ],
              }}
              options={barChartOptions}
            />
          </div>
        </Card>
      </div>

      {/* Audit Items */}
      <Card className="p-6 bg-white/80 backdrop-blur-xl border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Audit Areas</h3>
          <Button variant="outline" size="sm" onClick={() => setIsAddFindingDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Finding
          </Button>
        </div>
        <div className="space-y-3">
          {auditItems.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{item.area}</h4>
                    <Badge
                      className={
                        item.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {item.status}
                    </Badge>
                    <Badge
                      className={
                        item.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : item.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {item.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Findings: {item.findings}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setIsViewItemDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* View Item Dialog */}
      <Dialog open={isViewItemDialogOpen} onOpenChange={setIsViewItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audit Item Details</DialogTitle>
            <DialogDescription>{selectedItem?.area}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedItem.status}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Priority</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedItem.priority}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Findings</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedItem.findings} issue(s) identified</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewItemDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Finding Dialog */}
      <Dialog open={isAddFindingDialogOpen} onOpenChange={setIsAddFindingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Audit Finding</DialogTitle>
            <DialogDescription>Document new audit observation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="audit-area">Audit Area *</Label>
              <Select>
                <SelectTrigger id="audit-area">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baseline">Baseline Verification</SelectItem>
                  <SelectItem value="emissions">Emissions Data Review</SelectItem>
                  <SelectItem value="factors">Factor Validation</SelectItem>
                  <SelectItem value="risks">Risk Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="severity">Severity *</Label>
              <Select>
                <SelectTrigger id="severity">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="finding">Finding Description *</Label>
              <Textarea
                id="finding"
                value={finding}
                onChange={(e) => setFinding(e.target.value)}
                placeholder="Describe the audit finding..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFindingDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFinding} disabled={!finding}>
              Add Finding
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Audit Summary</DialogTitle>
            <DialogDescription>Download comprehensive audit overview</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
            <Select defaultValue="pdf">
              <SelectTrigger id="export-format">
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

      {/* Schedule Review Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Audit Review</DialogTitle>
            <DialogDescription>Set up next audit session</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="review-area">Review Area *</Label>
              <Select>
                <SelectTrigger id="review-area">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="emissions">Emissions</SelectItem>
                  <SelectItem value="factors">Factors</SelectItem>
                  <SelectItem value="risks">Risks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="review-date">Review Date *</Label>
              <input type="date" id="review-date" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSchedule}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}