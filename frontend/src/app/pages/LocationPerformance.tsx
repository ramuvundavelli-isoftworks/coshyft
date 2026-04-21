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
import { Bar, Radar } from 'react-chartjs-2';
import { barChartOptions, radarChartOptions, colors } from '../utils/chartConfig';
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
          <h1 className="text-3xl font-bold text-foreground">Location Performance</h1>
          <p className="text-muted-foreground mt-1">
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
            <div className="p-2 bg-info-subtle rounded-lg">
              <Building2 className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Locations</p>
              <p className="text-2xl font-bold text-foreground">{mockLocationPerformance.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Best Performer</p>
              <p className="text-lg font-bold text-foreground">London</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <TrendingDown className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Needs Attention</p>
              <p className="text-lg font-bold text-foreground">Tokyo</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Target className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Achievement</p>
              <p className="text-2xl font-bold text-foreground">87%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Radar Comparison */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Multi-Metric Comparison</h3>
        <div style={{ height: '400px', width: '100%' }}>
          <Radar
            data={{
              labels: radarData.map(d => d.metric),
              datasets: [
                {
                  label: 'SF HQ',
                  data: radarData.map(d => d.sfHq),
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  borderColor: colors.chart.blue,
                  borderWidth: 2,
                },
                {
                  label: 'New York',
                  data: radarData.map(d => d.ny),
                  backgroundColor: 'rgba(0, 188, 125, 0.2)',
                  borderColor: colors.chart.green,
                  borderWidth: 2,
                },
                {
                  label: 'London',
                  data: radarData.map(d => d.london),
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  borderColor: colors.chart.purple,
                  borderWidth: 2,
                },
                {
                  label: 'Tokyo',
                  data: radarData.map(d => d.tokyo),
                  backgroundColor: 'rgba(148, 163, 184, 0.2)',
                  borderColor: '#94a3b8',
                  borderWidth: 2,
                },
              ],
            }}
            options={radarChartOptions}
          />
        </div>
      </Card>

      {/* Emissions by Location */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Emissions by Location</h3>
        <div style={{ height: '300px', width: '100%' }}>
          <Bar
            data={{
              labels: mockLocationPerformance.map(loc => loc.location),
              datasets: [
                {
                  label: 'Total Emissions (tCO₂e)',
                  data: mockLocationPerformance.map(loc => loc.emissions),
                  backgroundColor: colors.chart.blue,
                  borderRadius: 6,
                },
              ],
            }}
            options={barChartOptions}
          />
        </div>
      </Card>

      {/* Location Rankings */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Location Rankings</h3>
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
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{loc.location}</span>
                  </div>
                </TableCell>
                <TableCell>{loc.emissions} tCO₂e</TableCell>
                <TableCell>{loc.perEmployee} tCO₂e/FTE</TableCell>
                <TableCell>
                  <Badge className="bg-success-subtle text-success">{loc.dataQuality}%</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-success-subtle text-success">On Track</Badge>
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
                  <Label className="text-sm text-muted-foreground">Total Emissions</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{selectedLocation.emissions} tCO₂e</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Per Employee</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{selectedLocation.perEmployee} tCO₂e</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Data Quality</Label>
                  <p className="text-2xl font-bold text-success mt-1">{selectedLocation.dataQuality}%</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Participation</Label>
                  <p className="text-2xl font-bold text-info mt-1">82%</p>
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
            <p className="text-sm text-muted-foreground mt-2">
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