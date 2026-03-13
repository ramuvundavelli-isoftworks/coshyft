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
import { TrendingDown, Download, AlertCircle, Calendar, BarChart3 } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { lineChartOptions, barChartOptions, colors } from '../utils/chartConfig';
import { toast } from 'sonner';

const trendData = [
  { month: 'Jan', actual: 245, forecast: 240, lowerBound: 230, upperBound: 250 },
  { month: 'Feb', actual: 238, forecast: 235, lowerBound: 225, upperBound: 245 },
  { month: 'Mar', actual: 252, forecast: 245, lowerBound: 235, upperBound: 255 },
  { month: 'Apr', actual: 241, forecast: 240, lowerBound: 230, upperBound: 250 },
  { month: 'May', actual: 235, forecast: 235, lowerBound: 225, upperBound: 245 },
  { month: 'Jun', actual: null, forecast: 230, lowerBound: 220, upperBound: 240 },
  { month: 'Jul', actual: null, forecast: 228, lowerBound: 218, upperBound: 238 },
  { month: 'Aug', actual: null, forecast: 225, lowerBound: 215, upperBound: 235 },
];

const yoyData = [
  { month: 'Jan', current: 245, previous: 268 },
  { month: 'Feb', current: 238, previous: 262 },
  { month: 'Mar', current: 252, previous: 275 },
  { month: 'Apr', current: 241, previous: 265 },
];

export default function EmissionsTrends() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isForecastDialogOpen, setIsForecastDialogOpen] = useState(false);
  const [isAnomalyDialogOpen, setIsAnomalyDialogOpen] = useState(false);
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

  const handleExport = () => {
    toast.success('Exporting trend analysis...');
    setIsExportDialogOpen(false);
  };

  const handleConfigureForecast = () => {
    toast.success('Forecast configuration updated');
    setIsForecastDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emissions Trends</h1>
          <p className="text-gray-600 mt-1">
            Historical analysis with forecasting and anomaly detection
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsForecastDialogOpen(true)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Configure Forecast
          </Button>
          <Button onClick={() => setIsExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Trend Direction</p>
              <p className="text-2xl font-bold text-green-600">Decreasing</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">YoY Change</p>
              <p className="text-2xl font-bold text-green-600">-9.2%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Forecast Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">92%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Anomalies</p>
              <p className="text-2xl font-bold text-yellow-600">2</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Trend with Forecast */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Historical Trend & Forecast</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnomalyDialogOpen(true)}
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            View Anomalies
          </Button>
        </div>
        <div style={{ height: '350px', width: '100%' }}>
          <Line
            data={{
              labels: trendData.map(d => d.month),
              datasets: [
                {
                  label: 'Actual',
                  data: trendData.map(d => d.actual),
                  borderColor: colors.chart.blue,
                  borderWidth: 2,
                  fill: false,
                },
                {
                  label: 'Forecast',
                  data: trendData.map(d => d.forecast),
                  borderColor: colors.chart.purple,
                  borderWidth: 2,
                  borderDash: [5, 5],
                  fill: false,
                },
                {
                  label: 'Lower Bound',
                  data: trendData.map(d => d.lowerBound),
                  borderColor: '#d1d5db',
                  borderWidth: 1,
                  fill: false,
                },
                {
                  label: 'Upper Bound',
                  data: trendData.map(d => d.upperBound),
                  borderColor: '#d1d5db',
                  borderWidth: 1,
                  fill: false,
                },
              ],
            }}
            options={lineChartOptions}
          />
        </div>
      </Card>

      {/* YoY Comparison */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Year-over-Year Comparison</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCompareDialogOpen(true)}
          >
            Compare Periods
          </Button>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <Bar
            data={{
              labels: yoyData.map(d => d.month),
              datasets: [
                {
                  label: '2025',
                  data: yoyData.map(d => d.previous),
                  backgroundColor: '#9ca3af',
                },
                {
                  label: '2026',
                  data: yoyData.map(d => d.current),
                  backgroundColor: colors.chart.blue,
                },
              ],
            }}
            options={barChartOptions}
          />
        </div>
      </Card>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Trend Analysis</DialogTitle>
            <DialogDescription>Download historical trend data and forecasts</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format *</Label>
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

      {/* Configure Forecast Dialog */}
      <Dialog open={isForecastDialogOpen} onOpenChange={setIsForecastDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Forecast</DialogTitle>
            <DialogDescription>Adjust forecasting parameters</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="forecast-months">Forecast Horizon (months)</Label>
              <Select defaultValue="3">
                <SelectTrigger id="forecast-months">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="confidence">Confidence Interval</Label>
              <Select defaultValue="95">
                <SelectTrigger id="confidence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsForecastDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfigureForecast}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Anomalies Dialog */}
      <Dialog open={isAnomalyDialogOpen} onOpenChange={setIsAnomalyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detected Anomalies</DialogTitle>
            <DialogDescription>Unusual patterns in emissions data</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">March 2026 Spike</p>
                    <p className="text-sm text-yellow-700">Emissions 5% higher than forecast</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Seasonal Pattern Change</p>
                    <p className="text-sm text-yellow-700">Unexpected variation detected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsAnomalyDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare Periods Dialog */}
      <Dialog open={isCompareDialogOpen} onOpenChange={setIsCompareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compare Periods</DialogTitle>
            <DialogDescription>Compare emissions across time periods</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="period1">Period 1</Label>
              <Select defaultValue="2026">
                <SelectTrigger id="period1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="period2">Period 2</Label>
              <Select defaultValue="2025">
                <SelectTrigger id="period2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompareDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setIsCompareDialogOpen(false);
              toast.success('Period comparison generated');
            }}>
              Generate Comparison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}