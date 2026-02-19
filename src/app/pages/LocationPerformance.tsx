import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
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
import { MapPin, Download, Eye, Target, TrendingUp, TrendingDown, Building2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { mockLocationPerformance } from '../data/mockData';
import { toast } from 'sonner';

const radarData = [
  { metric: 'Emissions', sfHq: 85, ny: 78, london: 92, tokyo: 88 },
  { metric: 'Participation', sfHq: 92, ny: 85, london: 78, tokyo: 90 },
  { metric: 'Data Quality', sfHq: 96, ny: 94, london: 89, tokyo: 91 },
  { metric: 'Mode Shift', sfHq: 88, ny: 82, london: 75, tokyo: 85 },
  { metric: 'Target Achievement', sfHq: 90, ny: 88, london: 85, tokyo: 87 },
];

export default function LocationPerformance() {
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [isSetTargetDialogOpen, setIsSetTargetDialogOpen] = useState(false);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [targetValue, setTargetValue] = useState('');

  const handleSetTarget = () => {
    toast.success(`Target set for ${selectedLocation?.location}`);
    setIsSetTargetDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting location comparison...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Location Performance</h1>
          <p className="text-gray-600 mt-1">
            Benchmark and compare emissions across office locations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsCompareDialogOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Compare Locations
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Comparison
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Locations</p>
              <p className="text-2xl font-bold text-gray-900">{mockLocationPerformance.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Performer</p>
              <p className="text-lg font-bold text-gray-900">London</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Needs Attention</p>
              <p className="text-lg font-bold text-gray-900">Tokyo</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Achievement</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Radar Comparison */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Multi-Metric Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} />
            <Radar name="SF HQ" dataKey="sfHq" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Radar name="New York" dataKey="ny" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            <Radar name="London" dataKey="london" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
            <Radar name="Tokyo" dataKey="tokyo" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Emissions by Location */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Emissions by Location</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockLocationPerformance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="location" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="emissions" fill="#3b82f6" name="Total Emissions (tCO₂e)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Location Rankings */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Location Rankings</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Total Emissions</TableHead>
              <TableHead>Per Employee</TableHead>
              <TableHead>Data Quality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLocationPerformance.map((loc, idx) => (
              <TableRow key={loc.location}>
                <TableCell className="font-bold">#{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{loc.location}</span>
                  </div>
                </TableCell>
                <TableCell>{loc.emissions} tCO₂e</TableCell>
                <TableCell>{loc.perEmployee} tCO₂e/FTE</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700">{loc.dataQuality}%</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-700">On Track</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsViewDetailsDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsSetTargetDialogOpen(true);
                      }}
                    >
                      <Target className="h-4 w-4 mr-1" />
                      Set Target
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedLocation?.location}</DialogTitle>
            <DialogDescription>Detailed performance metrics</DialogDescription>
          </DialogHeader>
          {selectedLocation && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Total Emissions</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedLocation.emissions} tCO₂e</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Per Employee</Label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedLocation.perEmployee} tCO₂e</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Data Quality</Label>
                  <p className="text-2xl font-bold text-green-600 mt-1">{selectedLocation.dataQuality}%</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-gray-600">Participation</Label>
                  <p className="text-2xl font-bold text-blue-600 mt-1">82%</p>
                </Card>
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
            <DialogTitle>Set Location Target</DialogTitle>
            <DialogDescription>
              Update emissions target for {selectedLocation?.location}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="target">Target Emissions (tCO₂e) *</Label>
            <Input
              id="target"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="Enter target"
            />
            <p className="text-sm text-gray-500 mt-2">
              Current: {selectedLocation?.emissions} tCO₂e
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSetTargetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSetTarget}>Set Target</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare Locations Dialog */}
      <Dialog open={isCompareDialogOpen} onOpenChange={setIsCompareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compare Locations</DialogTitle>
            <DialogDescription>Select locations to compare</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="location1">Location 1</Label>
              <Select defaultValue="sf-hq">
                <SelectTrigger id="location1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sf-hq">San Francisco HQ</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location2">Location 2</Label>
              <Select defaultValue="london">
                <SelectTrigger id="location2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sf-hq">San Francisco HQ</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="london">London</SelectItem>
                  <SelectItem value="tokyo">Tokyo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompareDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setIsCompareDialogOpen(false);
              toast.success('Location comparison generated');
            }}>
              Compare
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Location Comparison</DialogTitle>
            <DialogDescription>Download location performance data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
            <Select defaultValue="excel">
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel Workbook</SelectItem>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="csv">CSV Data</SelectItem>
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
