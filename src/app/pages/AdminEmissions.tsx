import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
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
  TrendingDown,
  Download,
  Building2,
  Users,
  Calendar,
  Filter,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { lineChartOptions, barChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';

const departmentEmissions = [
  { name: 'Engineering', emissions: 245.3, perEmployee: 0.42, target: 0.45, status: 'on-track' },
  { name: 'Sales', emissions: 156.8, perEmployee: 0.49, target: 0.45, status: 'at-risk' },
  { name: 'Marketing', emissions: 78.2, perEmployee: 0.43, target: 0.45, status: 'on-track' },
  { name: 'Operations', emissions: 198.5, perEmployee: 0.47, target: 0.45, status: 'at-risk' },
  { name: 'Finance', emissions: 68.9, perEmployee: 0.49, target: 0.45, status: 'at-risk' },
  { name: 'HR', emissions: 42.6, perEmployee: 0.45, target: 0.45, status: 'on-track' },
];

const monthlyTrend = [
  { month: 'Sep', emissions: 875, target: 850, perEmployee: 0.53 },
  { month: 'Oct', emissions: 842, target: 850, perEmployee: 0.51 },
  { month: 'Nov', emissions: 815, target: 850, perEmployee: 0.49 },
  { month: 'Dec', emissions: 798, target: 850, perEmployee: 0.48 },
  { month: 'Jan', emissions: 782, target: 850, perEmployee: 0.47 },
  { month: 'Feb', emissions: 790, target: 850, perEmployee: 0.48 },
];

const locationBreakdown = [
  { name: 'HQ - Tech Park', emissions: 458.3, color: '#3b82f6' },
  { name: 'Downtown', emissions: 245.7, color: '#10b981' },
  { name: 'East Campus', emissions: 198.4, color: '#f59e0b' },
  { name: 'London', emissions: 142.6, color: '#8b5cf6' },
];

export default function AdminEmissions() {
  const [periodFilter, setPeriodFilter] = useState('month');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [exportFormat, setExportFormat] = useState('pdf');

  const totalEmissions = departmentEmissions.reduce((sum, d) => sum + d.emissions, 0);
  const avgPerEmployee = 0.46;

  const handleExport = () => {
    toast.success(`Exporting emissions data as ${exportFormat.toUpperCase()}`);
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emissions Analytics</h1>
          <p className="text-gray-600 mt-1">
            Track and analyze emissions across departments and locations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Emissions</p>
              <p className="text-2xl font-bold text-gray-900">{totalEmissions.toFixed(1)} kg</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Per Employee</p>
              <p className="text-2xl font-bold text-gray-900">{avgPerEmployee.toFixed(2)} kg</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Reduction</p>
              <p className="text-2xl font-bold text-green-600">-12%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900">{locationBreakdown.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Period Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Emissions Trend */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Emissions Trend</h3>
        <div style={{ height: '350px', width: '100%' }}>
          <Line
            data={{
              labels: monthlyTrend.map((data) => data.month),
              datasets: [
                {
                  label: 'Target',
                  data: monthlyTrend.map((data) => data.target),
                  borderColor: '#ef4444',
                  borderWidth: 2,
                  fill: false,
                  borderDash: [5, 5],
                },
                {
                  label: 'Actual Emissions',
                  data: monthlyTrend.map((data) => data.emissions),
                  borderColor: '#3b82f6',
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
            options={lineChartOptions}
          />
        </div>
      </Card>

      {/* Department Emissions & Location Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Department Emissions</h3>
          <div style={{ height: '320px', width: '100%' }}>
            <Bar
              data={{
                labels: departmentEmissions.map((data) => data.name),
                datasets: [
                  {
                    label: 'Emissions (kg)',
                    data: departmentEmissions.map((data) => data.emissions),
                    backgroundColor: '#3b82f6',
                  },
                ],
              }}
              options={barChartOptions}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Location Breakdown</h3>
          <div className="space-y-3">
            {locationBreakdown.map((loc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: loc.color }} />
                  <span className="font-medium text-gray-900">{loc.name}</span>
                </div>
                <span className="font-bold text-gray-900">{loc.emissions} kg</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Department Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Department Performance</h3>
        <div className="space-y-2">
          {departmentEmissions.map((dept, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{dept.name}</h4>
                    {dept.status === 'on-track' ? (
                      <Badge className="bg-green-100 text-green-700">On Track</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        At Risk
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Total: {dept.emissions} kg</span>
                    <span>•</span>
                    <span>Per Employee: {dept.perEmployee} kg</span>
                    <span>•</span>
                    <span>Target: {dept.target} kg</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDept(dept);
                  setIsViewDetailsDialogOpen(true);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Emissions Report</DialogTitle>
            <DialogDescription>
              Download comprehensive emissions analytics
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Report Format *</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
              <p className="text-sm text-gray-900 font-medium mb-2">Report Includes:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Total emissions by department</li>
                <li>Per-employee emissions breakdown</li>
                <li>Location-based analysis</li>
                <li>Monthly trend data</li>
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

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDept?.name} Department</DialogTitle>
            <DialogDescription>
              Detailed emissions breakdown
            </DialogDescription>
          </DialogHeader>
          {selectedDept && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Total Emissions</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedDept.emissions} kg</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Per Employee</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedDept.perEmployee} kg</p>
                </Card>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Target</Label>
                <p className="font-medium text-gray-900 mt-1">{selectedDept.target} kg per employee</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Status</Label>
                <div className="mt-1">
                  {selectedDept.status === 'on-track' ? (
                    <Badge className="bg-green-100 text-green-700">On Track</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-700">At Risk</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Customize emissions data view
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <Select defaultValue="month">
                <SelectTrigger id="date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select defaultValue="all">
                <SelectTrigger id="department">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select defaultValue="all">
                <SelectTrigger id="location">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="hq">HQ - Tech Park</SelectItem>
                  <SelectItem value="downtown">Downtown</SelectItem>
                  <SelectItem value="east">East Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>
              Reset
            </Button>
            <Button onClick={() => {
              setIsFilterDialogOpen(false);
              toast.success('Filters applied');
            }}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}