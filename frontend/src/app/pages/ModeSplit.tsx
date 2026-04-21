import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Car, Bus, Bike, TrendingUp, Download, Eye, Target, ArrowRightLeft } from 'lucide-react';
import { Doughnut, Line } from 'react-chartjs-2';
import { doughnutChartOptions, lineChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';
import { useApi, emissionsApi } from '../api';

// Brand-aligned colors: green for sustainable, muted for SOV
const MODE_COLORS = {
  carpool: colors.chart.green,
  publicTransit: colors.chart.emerald,
  bike: '#22c55e',
  singleOccupancy: '#94a3b8', // Muted gray (not red)
};

const modeShiftTrend = [
  { month: 'Jan', singleOccupancy: 45, carpool: 25, publicTransit: 20, bike: 10 },
  { month: 'Feb', singleOccupancy: 42, carpool: 27, publicTransit: 21, bike: 10 },
  { month: 'Mar', singleOccupancy: 40, carpool: 28, publicTransit: 22, bike: 10 },
  { month: 'Apr', singleOccupancy: 38, carpool: 30, publicTransit: 22, bike: 10 },
  { month: 'May', singleOccupancy: 35, carpool: 32, publicTransit: 23, bike: 10 },
];

const modeDetails = [
  { mode: 'Single Occupancy Vehicle', emissions: 245.8, trips: 3420, avgPerTrip: 0.072, target: 200, icon: Car },
  { mode: 'Carpool', emissions: 98.4, trips: 2150, avgPerTrip: 0.046, target: 120, icon: Car },
  { mode: 'Public Transit', emissions: 52.6, trips: 1890, avgPerTrip: 0.028, target: 60, icon: Bus },
  { mode: 'Bike/Walk', emissions: 0, trips: 840, avgPerTrip: 0, target: 0, icon: Bike },
];

export default function ModeSplit() {
  const { data: modeSplitResponse } = useApi(() => emissionsApi.getModeSplit());
  const [apiModes, setApiModes] = useState<any[]>([]);

  useEffect(() => {
    const data = Array.isArray(modeSplitResponse) ? modeSplitResponse : (modeSplitResponse as any)?.data;
    if (Array.isArray(data)) setApiModes(data);
  }, [modeSplitResponse]);

  const [isViewModeDialogOpen, setIsViewModeDialogOpen] = useState(false);
  const [isShiftAnalysisDialogOpen, setIsShiftAnalysisDialogOpen] = useState(false);
  const [isSetTargetDialogOpen, setIsSetTargetDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<any>(null);
  const [targetValue, setTargetValue] = useState('');

  const handleSetTarget = () => {
    toast.success(`Target set for ${selectedMode?.mode}`);
    setIsSetTargetDialogOpen(false);
  };

  const handleExport = () => {
    toast.success('Exporting mode split data...');
    setIsExportDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mode Split Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Commute mode distribution and shift analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsShiftAnalysisDialogOpen(true)}>
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Shift Analysis
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Car className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SOV Rate</p>
              <p className="text-2xl font-bold text-foreground">35%</p>
              <p className="text-xs text-success">↓ 10% vs baseline</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-subtle rounded-lg">
              <Car className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Carpool Rate</p>
              <p className="text-2xl font-bold text-foreground">32%</p>
              <p className="text-xs text-success">↑ 7% vs baseline</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-info-subtle rounded-lg">
              <Bus className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transit Rate</p>
              <p className="text-2xl font-bold text-foreground">23%</p>
              <p className="text-xs text-success">↑ 3% vs baseline</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-subtle rounded-lg">
              <Bike className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Transport</p>
              <p className="text-2xl font-bold text-foreground">10%</p>
              <p className="text-xs text-muted-foreground">No change</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Mode Distribution & Mode Shift Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Current Mode Distribution</h3>
          <div style={{ height: '300px', width: '100%' }}>
            {apiModes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No mode data available</div>
            ) : (
              <Doughnut
                data={{
                  labels: apiModes.map((d: any) => d.mode),
                  datasets: [
                    {
                      data: apiModes.map((d: any) => d.percentage ?? d.value),
                      backgroundColor: apiModes.map((_: any, i: number) => Object.values(MODE_COLORS)[i % 4]),
                      borderWidth: 0,
                    },
                  ],
                }}
                options={doughnutChartOptions}
              />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Mode Shift Trend</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <Line
              data={{
                labels: modeShiftTrend.map(d => d.month),
                datasets: [
                  {
                    label: 'SOV',
                    data: modeShiftTrend.map(d => d.singleOccupancy),
                    borderColor: MODE_COLORS.singleOccupancy,
                    borderWidth: 2,
                    fill: false,
                  },
                  {
                    label: 'Carpool',
                    data: modeShiftTrend.map(d => d.carpool),
                    borderColor: MODE_COLORS.carpool,
                    borderWidth: 2,
                    fill: false,
                  },
                  {
                    label: 'Transit',
                    data: modeShiftTrend.map(d => d.publicTransit),
                    borderColor: MODE_COLORS.publicTransit,
                    borderWidth: 2,
                    fill: false,
                  },
                  {
                    label: 'Bike/Walk',
                    data: modeShiftTrend.map(d => d.bike),
                    borderColor: MODE_COLORS.bike,
                    borderWidth: 2,
                    fill: false,
                  },
                ],
              }}
              options={lineChartOptions}
            />
          </div>
        </Card>
      </div>

      {/* Mode Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Mode Performance Details</h3>
        <div className="space-y-3">
          {modeDetails.map((mode, idx) => {
            const Icon = mode.icon;
            const isOnTrack = mode.emissions <= mode.target;
            return (
              <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-muted rounded-lg">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground">{mode.mode}</h4>
                        {isOnTrack ? (
                          <Badge className="bg-success-subtle text-success">On Track</Badge>
                        ) : (
                          <Badge className="bg-warning-subtle text-warning">Needs Improvement</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Emissions</p>
                          <p className="font-medium text-foreground">{mode.emissions} tCO₂e</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Trips</p>
                          <p className="font-medium text-foreground">{mode.trips}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg per Trip</p>
                          <p className="font-medium text-foreground">{mode.avgPerTrip} kg</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-medium text-foreground">{mode.target} tCO₂e</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMode(mode);
                        setIsViewModeDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMode(mode);
                        setTargetValue(mode.target.toString());
                        setIsSetTargetDialogOpen(true);
                      }}
                    >
                      <Target className="h-4 w-4 mr-1" />
                      Set Target
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* View Mode Details Dialog */}
      <Dialog open={isViewModeDialogOpen} onOpenChange={setIsViewModeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMode?.mode}</DialogTitle>
            <DialogDescription>Detailed mode analytics</DialogDescription>
          </DialogHeader>
          {selectedMode && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Total Emissions</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{selectedMode.emissions} tCO₂e</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Total Trips</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{selectedMode.trips}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Avg per Trip</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{selectedMode.avgPerTrip} kg</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-sm text-muted-foreground">Target</Label>
                  <p className="text-2xl font-bold text-info mt-1">{selectedMode.target} tCO₂e</p>
                </Card>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModeDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mode Shift Analysis Dialog */}
      <Dialog open={isShiftAnalysisDialogOpen} onOpenChange={setIsShiftAnalysisDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mode Shift Analysis</DialogTitle>
            <DialogDescription>Analyze potential emissions reductions from mode shift</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
                <h4 className="font-semibold text-info mb-2">Shift Scenario: 10% SOV → Carpool</h4>
                <p className="text-sm text-info">
                  <strong>Potential Reduction:</strong> 24.6 tCO₂e annually
                </p>
                <p className="text-sm text-info">
                  <strong>Impact:</strong> 10% total emissions reduction
                </p>
              </div>
              <div className="p-4 bg-success-subtle border border-success/25 rounded-lg">
                <h4 className="font-semibold text-success mb-2">Shift Scenario: 5% SOV → Public Transit</h4>
                <p className="text-sm text-success">
                  <strong>Potential Reduction:</strong> 10.8 tCO₂e annually
                </p>
                <p className="text-sm text-success">
                  <strong>Impact:</strong> 4.4% total emissions reduction
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsShiftAnalysisDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Target Dialog */}
      <Dialog open={isSetTargetDialogOpen} onOpenChange={setIsSetTargetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Mode Target</DialogTitle>
            <DialogDescription>
              Update emissions target for {selectedMode?.mode}
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
              Current: {selectedMode?.emissions} tCO₂e
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSetTargetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSetTarget}>Set Target</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Mode Split Data</DialogTitle>
            <DialogDescription>Download mode distribution analytics</DialogDescription>
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