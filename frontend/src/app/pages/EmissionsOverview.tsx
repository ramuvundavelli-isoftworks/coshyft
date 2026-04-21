import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { KPICard } from '../components/KPICard';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Activity, TrendingDown, MapPin, BarChart3, Download, Eye, GitBranch, RefreshCw } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { lineChartOptions, doughnutChartOptions, colors } from '../utils/chartConfig';
import { useApi } from '../api';
import { emissionsApi } from '../api';
import { toast } from 'sonner';

export default function EmissionsOverview() {
  const [location, setLocation] = useState('all');
  const [period, setPeriod] = useState('ytd-2026');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isBreakdownDialogOpen, setIsBreakdownDialogOpen] = useState(false);
  const [isDataLineageDialogOpen, setIsDataLineageDialogOpen] = useState(false);
  const [isRecalculateDialogOpen, setIsRecalculateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // API data fetching
  const { data: summary, loading: summaryLoading } = useApi(() => emissionsApi.getSummary());
  const { data: trends } = useApi(() => emissionsApi.getTrends());
  const { data: modeSplit } = useApi(() => emissionsApi.getModeSplit());
  const { data: locations } = useApi(() => emissionsApi.getLocationPerformance());

  const emissionData: any[] = Array.isArray(trends) ? trends : [];
  const modeData: any[] = Array.isArray(modeSplit) ? modeSplit : [];
  const locationData: any[] = Array.isArray(locations) ? locations : [];

  const summaryData = summary as any;
  const totalEmissionsKg = summaryData?.total_emissions_kg ?? 0;
  const totalEmissionsTons = totalEmissionsKg > 0 ? (totalEmissionsKg / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—';
  const emissionIntensity = summaryData?.emission_intensity != null ? String(summaryData.emission_intensity) : '—';
  const dataQualityScore = summaryData?.data_quality_score != null ? String(Math.round(summaryData.data_quality_score)) : '—';
  const locationsCount = locationData.length > 0 ? String(locationData.length) : (summaryData?.locations_count != null ? String(summaryData.locations_count) : '—');

  const handleExport = () => {
    toast.success('Exporting emissions report...');
    setIsExportDialogOpen(false);
  };

  const handleRecalculate = () => {
    toast.success('Recalculating emissions - this may take a few moments');
    setIsRecalculateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emissions Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive emissions analytics with audit-grade traceability
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="sf-hq">San Francisco HQ</SelectItem>
              <SelectItem value="ny">New York Office</SelectItem>
              <SelectItem value="london">London Office</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd-2026">YTD 2026</SelectItem>
              <SelectItem value="q1-2026">Q1 2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setIsRecalculateDialogOpen(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="Total Emissions"
          value={totalEmissionsTons}
          unit="tCO₂e"
          change={summaryData?.yoy_change_percent != null ? summaryData.yoy_change_percent : undefined}
          changeLabel="vs baseline"
          icon={Activity}
          trend="down"
          status="good"
        />
        <KPICard
          title="Avg per Employee"
          value={emissionIntensity}
          unit="tCO₂e/FTE"
          icon={TrendingDown}
          trend="down"
        />
        <KPICard
          title="Data Quality"
          value={dataQualityScore}
          unit="%"
          icon={BarChart3}
          status="good"
        />
        <KPICard
          title="Locations"
          value={locationsCount}
          icon={MapPin}
        />
      </div>

      {/* Mode Distribution & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Mode Distribution</h3>
          <div style={{ height: '320px', width: '100%' }}>
            <Doughnut
              data={{
                labels: modeData.map(d => d.mode),
                datasets: [{
                  data: modeData.map(d => d.percentage),
                  backgroundColor: [
                    colors.chart.blue,
                    colors.chart.green,
                    colors.chart.orange,
                    colors.chart.red,
                    colors.chart.purple,
                  ],
                  borderWidth: 0,
                }]
              }}
              options={doughnutChartOptions}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly Emissions Trend</h3>
          <div style={{ height: '320px', width: '100%' }}>
            <Line
              data={{
                labels: emissionData.slice(0, 8).map(d => d.period ?? d.month),
                datasets: [{
                  label: 'Actual Emissions',
                  data: emissionData.slice(0, 8).map(d => d.actual ?? d.total_emissions_kg),
                  borderColor: colors.chart.blue,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fill: true,
                  borderWidth: 2,
                }]
              }}
              options={lineChartOptions}
            />
          </div>
        </Card>
      </div>

      {/* Location Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Location Performance</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedItem(locationData[0]);
              setIsBreakdownDialogOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Breakdown
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Total Emissions</TableHead>
              <TableHead>Per Employee</TableHead>
              <TableHead>Data Quality</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locationData.map((loc) => (
              <TableRow key={loc.location} className="hover:bg-background-subtle">
                <TableCell className="font-medium">{loc.location}</TableCell>
                <TableCell>{loc.emissions} tCO₂e</TableCell>
                <TableCell>{loc.perEmployee} tCO₂e/FTE</TableCell>
                <TableCell>
                  <Badge className="bg-success-subtle text-success">{loc.dataQuality}%</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-success-subtle text-success">On Track</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedItem(loc);
                      setIsDataLineageDialogOpen(true);
                    }}
                  >
                    <GitBranch className="h-4 w-4 mr-1" />
                    Lineage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
            <Select defaultValue="pdf">
              <SelectTrigger id="export-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Report</SelectItem>
                <SelectItem value="excel">Excel Workbook</SelectItem>
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

      {/* Breakdown Dialog */}
      <Dialog open={isBreakdownDialogOpen} onOpenChange={setIsBreakdownDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Emissions Breakdown</DialogTitle>
            <DialogDescription>
              Detailed breakdown by mode and category
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              {modeData.map((mode, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: [
                          colors.chart.blue,
                          colors.chart.green,
                          colors.chart.orange,
                          colors.chart.red,
                          colors.chart.purple,
                        ][idx]
                      }} 
                    />
                    <span className="font-medium">{mode.mode}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{mode.emissions} tCO₂e</p>
                    <p className="text-sm text-muted-foreground">{mode.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsBreakdownDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Lineage Dialog */}
      <Dialog open={isDataLineageDialogOpen} onOpenChange={setIsDataLineageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Lineage</DialogTitle>
            <DialogDescription>
              Audit trail for {selectedItem?.location}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <Label className="text-sm text-muted-foreground">Data Source</Label>
                <p className="font-medium mt-1">Employee Commute Log</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Label className="text-sm text-muted-foreground">Calculation Method</Label>
                <p className="font-medium mt-1">GHG Protocol</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Label className="text-sm text-muted-foreground">Emission Factors</Label>
                <p className="font-medium mt-1">DEFRA 2024</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Label className="text-sm text-muted-foreground">Last Updated</Label>
                <p className="font-medium mt-1">Feb 18, 2026 10:32 AM</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDataLineageDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recalculate Dialog */}
      <Dialog open={isRecalculateDialogOpen} onOpenChange={setIsRecalculateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recalculate Emissions</DialogTitle>
            <DialogDescription>
              Refresh all emissions calculations
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
              <p className="text-sm text-info">
                This will recalculate all emissions using the latest:
              </p>
              <ul className="text-sm text-info mt-2 space-y-1 list-disc list-inside">
                <li>Commute trip data</li>
                <li>Emission factors</li>
                <li>Calculation methodologies</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecalculateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRecalculate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Recalculate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}