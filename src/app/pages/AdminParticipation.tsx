import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
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
import { Users, TrendingUp, TrendingDown, AlertTriangle, Download, Filter, Search, Target, Building2, Mail, Eye, MessageCircle } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { lineChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';
import { useApi, useApiMutation } from '../api';
import { adminApi } from '../api';

interface Department {
  id: string;
  name: string;
  employees: number;
  enrolled: number;
  active: number;
  participation: number;
  target: number;
  trend: string;
  avgTripsPerWeek: number;
}

const mockDepartments: Department[] = [
  { id: 'dept1', name: 'Engineering', employees: 580, enrolled: 485, active: 412, participation: 71, target: 75, trend: '+5%', avgTripsPerWeek: 3.8 },
  { id: 'dept2', name: 'Sales', employees: 320, enrolled: 298, active: 276, participation: 86, target: 75, trend: '+8%', avgTripsPerWeek: 4.2 },
  { id: 'dept3', name: 'Marketing', employees: 180, enrolled: 162, active: 135, participation: 75, target: 75, trend: '+3%', avgTripsPerWeek: 3.5 },
  { id: 'dept4', name: 'Operations', employees: 420, enrolled: 357, active: 298, participation: 71, target: 75, trend: '+2%', avgTripsPerWeek: 3.9 },
  { id: 'dept5', name: 'Finance', employees: 140, enrolled: 126, active: 98, participation: 70, target: 75, trend: '-1%', avgTripsPerWeek: 3.2 },
  { id: 'dept6', name: 'HR', employees: 95, enrolled: 89, active: 82, participation: 86, target: 75, trend: '+4%', avgTripsPerWeek: 4.5 },
];

const trendData = [
  { month: 'Aug', participation: 62 },
  { month: 'Sep', participation: 65 },
  { month: 'Oct', participation: 68 },
  { month: 'Nov', participation: 71 },
  { month: 'Dec', participation: 73 },
  { month: 'Jan', participation: 75 },
  { month: 'Feb', participation: 76 },
];

export default function AdminParticipation() {
  const [departments] = useState<Department[]>(mockDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isSetTargetDialogOpen, setIsSetTargetDialogOpen] = useState(false);
  const [isSendReminderDialogOpen, setIsSendReminderDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [targetValue, setTargetValue] = useState('75');
  const [reminderMessage, setReminderMessage] = useState('');

  const filteredDepts = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEmployees = departments.reduce((sum, d) => sum + d.employees, 0);
  const totalEnrolled = departments.reduce((sum, d) => sum + d.enrolled, 0);
  const totalActive = departments.reduce((sum, d) => sum + d.active, 0);
  const avgParticipation = Math.round(departments.reduce((sum, d) => sum + d.participation, 0) / departments.length);

  const setTargetMutation = useApiMutation((data: { department: string; targetPercent: number }) =>
    adminApi.setParticipationTarget(data.department, data.targetPercent)
  );
  const sendReminderMutation = useApiMutation((data: { department: string; message: string }) =>
    adminApi.sendParticipationReminder(data.department, data.message)
  );

  const handleSetTarget = async () => {
    if (selectedDept) {
      const result = await setTargetMutation.execute({
        department: selectedDept.name,
        targetPercent: parseInt(targetValue),
      });

      if (result.success) {
        toast.success(`Target set to ${targetValue}% for ${selectedDept.name}`);
      } else {
        toast.error(result.error?.message || 'Failed to set target');
      }
    }
    setIsSetTargetDialogOpen(false);
  };

  const handleSendReminder = async () => {
    if (selectedDept) {
      const result = await sendReminderMutation.execute({
        department: selectedDept.name,
        message: reminderMessage,
      });

      if (result.success) {
        toast.success(`Reminder sent to ${selectedDept.name} department`);
      } else {
        toast.error(result.error?.message || 'Failed to send reminder');
      }
    }
    setIsSendReminderDialogOpen(false);
    setReminderMessage('');
  };

  const handleExport = () => {
    toast.success('Exporting participation data...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Participation Tracking</h1>
          <p className="text-gray-600 mt-1">
            Monitor employee engagement and department participation
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
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Enrolled</p>
              <p className="text-2xl font-bold text-gray-900">{totalEnrolled}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active This Month</p>
              <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Target className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Participation</p>
              <p className="text-2xl font-bold text-gray-900">{avgParticipation}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Participation Trend</h3>
        <div style={{ height: '250px', width: '100%' }}>
          <Line
            data={{
              labels: trendData.map(data => data.month),
              datasets: [
                {
                  label: 'Participation %',
                  data: trendData.map(data => data.participation),
                  borderColor: colors.chart.green,
                  backgroundColor: 'rgba(0, 188, 125, 0.1)',
                  borderWidth: 2,
                  fill: true,
                },
              ],
            }}
            options={lineChartOptions}
          />
        </div>
      </Card>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Department List */}
      <div className="space-y-3">
        {filteredDepts.map((dept) => (
          <Card key={dept.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                    {dept.participation >= dept.target ? (
                      <Badge className="bg-green-100 text-green-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        On Target
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Below Target
                      </Badge>
                    )}
                    <span className="text-sm text-gray-600">{dept.trend} this month</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Employees</p>
                      <p className="font-medium text-gray-900">{dept.employees}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Enrolled</p>
                      <p className="font-medium text-gray-900">{dept.enrolled}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Active</p>
                      <p className="font-medium text-gray-900">{dept.active}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Participation</p>
                      <p className="font-medium text-green-600">{dept.participation}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDept(dept);
                    setIsViewDetailsDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDept(dept);
                    setTargetValue(dept.target.toString());
                    setIsSetTargetDialogOpen(true);
                  }}
                >
                  <Target className="h-4 w-4 mr-1" />
                  Set Target
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDept(dept);
                    setIsSendReminderDialogOpen(true);
                  }}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Remind
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDept?.name} Department</DialogTitle>
            <DialogDescription>
              Detailed participation metrics
            </DialogDescription>
          </DialogHeader>
          {selectedDept && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Total Employees</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedDept.employees}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Enrolled</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedDept.enrolled}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Active This Month</Label>
                  <p className="text-2xl font-bold text-green-600 mt-1">{selectedDept.active}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Participation Rate</Label>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{selectedDept.participation}%</p>
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Target</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedDept.target}%</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Trend</Label>
                  <p className="font-medium text-gray-900 mt-1">{selectedDept.trend}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Avg Trips Per Week</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedDept.avgTripsPerWeek} trips</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Target Dialog */}
      <Dialog open={isSetTargetDialogOpen} onOpenChange={setIsSetTargetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Participation Target</DialogTitle>
            <DialogDescription>
              Update target for {selectedDept?.name} department
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                <strong>Current:</strong> {selectedDept?.participation}%
              </p>
              <p className="text-sm text-blue-900 mt-1">
                <strong>Current Target:</strong> {selectedDept?.target}%
              </p>
            </div>
            <Label htmlFor="target">New Target (%) *</Label>
            <Input
              id="target"
              type="number"
              min="0"
              max="100"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="75"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSetTargetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetTarget} disabled={setTargetMutation.loading}>
              {setTargetMutation.loading ? 'Setting...' : 'Set Target'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={isSendReminderDialogOpen} onOpenChange={setIsSendReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Participation Reminder</DialogTitle>
            <DialogDescription>
              Encourage {selectedDept?.name} employees to log commutes
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="message">Reminder Message (optional)</Label>
            <Textarea
              id="message"
              value={reminderMessage}
              onChange={(e) => setReminderMessage(e.target.value)}
              placeholder="Custom message to include in the reminder email..."
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-2">
              A standard reminder will be sent if no custom message is provided
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReminder} disabled={sendReminderMutation.loading}>
              <Mail className="h-4 w-4 mr-2" />
              {sendReminderMutation.loading ? 'Sending...' : 'Send Reminder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Participation Report</DialogTitle>
            <DialogDescription>
              Download comprehensive participation data
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Report Includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Department-level participation metrics</li>
                <li>Enrollment and active user counts</li>
                <li>Trend analysis</li>
                <li>Target achievement status</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}