import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  TrendingDown, Download, Building2, Users, Eye, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { lineChartOptions, barChartOptions } from '../utils/chartConfig';
import { toast } from 'sonner';
import { useApi, emissionsApi } from '../api';

const EMISSION_TARGET_PER_EMPLOYEE = 0.45;

export default function AdminEmissions() {
  const [year, setYear]               = useState(2026);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [isViewOpen, setIsViewOpen]   = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data: summary, loading: loadingSummary, refetch: refetchSummary } =
    useApi(() => emissionsApi.getSummary(year), { deps: [year] });

  const { data: trends, loading: loadingTrends } =
    useApi(() => emissionsApi.getTrends(year), { deps: [year] });

  const { data: deptData, loading: loadingDepts } =
    useApi(() => emissionsApi.getDepartmentEmissions(year), { deps: [year] });

  const { data: locations, loading: loadingLocations } =
    useApi(() => emissionsApi.getLocationPerformance(), { deps: [] });

  const loading = loadingSummary || loadingTrends || loadingDepts || loadingLocations;

  const depts: any[]   = Array.isArray(deptData) ? deptData : [];
  const trendList: any[] = Array.isArray(trends) ? trends : [];
  const locList: any[] = Array.isArray(locations) ? locations : [];

  const totalEmissions = summary?.total_emissions_kg ?? 0;
  const perEmployee    = summary?.emission_intensity ?? 0;
  const yoyChange      = summary?.yoy_change_percent ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Emissions Analytics</h1>
          <p className="text-muted-foreground mt-1">Track and analyze emissions across departments and locations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => refetchSummary()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsExportOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {([
          ['Total Emissions',  loadingSummary ? '—' : `${totalEmissions.toFixed(1)} kg`,           'bg-destructive-subtle',    TrendingDown, 'text-destructive'],
          ['Per Employee',     loadingSummary ? '—' : `${perEmployee.toFixed(2)} kg`,               'bg-info-subtle',   Users,        'text-info'],
          ['YoY Change',       loadingSummary ? '—' : `${yoyChange > 0 ? '+' : ''}${yoyChange}%`,  'bg-success-subtle',  TrendingDown, yoyChange <= 0 ? 'text-success' : 'text-destructive'],
          ['Locations',        loadingLocations ? '—' : locList.length,                             'bg-info-subtle', Building2,    'text-info'],
        ] as any[]).map(([label, val, bg, Icon, ic]) => (
          <Card key={label} className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${bg} rounded-lg`}><Icon className={`h-5 w-5 ${ic}`} /></div>
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold text-foreground">{val}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Year Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Label className="text-muted-foreground whitespace-nowrap">Year:</Label>
          <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Emissions Trend Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4">Monthly Emissions Trend ({year})</h3>
        {loadingTrends ? (
          <p className="text-sm text-muted-foreground text-center py-12">Loading trend data...</p>
        ) : trendList.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-12">No emissions data for {year}.</p>
        ) : (
          <div style={{ height: '350px', width: '100%' }}>
            <Line
              data={{
                labels: trendList.map(t => t.period),
                datasets: [
                  {
                    label: 'Actual Emissions (kg)',
                    data: trendList.map(t => t.actual),
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                  },
                ],
              }}
              options={lineChartOptions}
            />
          </div>
        )}
      </Card>

      {/* Department Emissions & Location Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Emissions by Department</h3>
          {loadingDepts ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
          ) : depts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No department data for {year}.</p>
          ) : (
            <div style={{ height: '300px', width: '100%' }}>
              <Bar
                data={{
                  labels: depts.map(d => d.department),
                  datasets: [{
                    label: 'Emissions (kg)',
                    data: depts.map(d => d.total_emissions),
                    backgroundColor: '#3b82f6',
                  }],
                }}
                options={barChartOptions}
              />
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Location Breakdown</h3>
          {loadingLocations ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
          ) : locList.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No location data available.</p>
          ) : (
            <div className="space-y-3">
              {locList.slice(0, 6).map((loc: any) => (
                <div key={loc.office_id ?? loc.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-info" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{loc.name}</p>
                      <p className="text-xs text-muted-foreground">{loc.city}</p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground text-sm">
                    {(loc.total_emissions ?? 0).toFixed(1)} kg
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Department Performance Table */}
      {!loadingDepts && depts.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-foreground mb-4">Department Performance</h3>
          <div className="space-y-2">
            {depts.map((dept: any) => {
              const onTarget = dept.per_employee <= EMISSION_TARGET_PER_EMPLOYEE;
              return (
                <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-info-subtle rounded-lg">
                      <Building2 className="h-5 w-5 text-info" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{dept.department}</h4>
                        {onTarget ? (
                          <Badge className="bg-success-subtle text-success">On Track</Badge>
                        ) : (
                          <Badge className="bg-warning-subtle text-warning">
                            <AlertTriangle className="h-3 w-3 mr-1" />At Risk
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Total: {dept.total_emissions.toFixed(1)} kg</span>
                        <span>·</span>
                        <span>Per Active Employee: {dept.per_employee.toFixed(3)} kg</span>
                        <span>·</span>
                        <span>Target: {EMISSION_TARGET_PER_EMPLOYEE} kg</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { setSelectedDept(dept); setIsViewOpen(true); }}>
                    <Eye className="h-4 w-4 mr-1" />Details
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDept?.department} Department</DialogTitle>
            <DialogDescription>Emissions breakdown for {year}</DialogDescription>
          </DialogHeader>
          {selectedDept && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <Label className="text-xs text-muted-foreground">Total Emissions</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{selectedDept.total_emissions.toFixed(1)} kg</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-xs text-muted-foreground">Per Active Employee</Label>
                  <p className="text-2xl font-bold text-foreground mt-1">{selectedDept.per_employee.toFixed(3)} kg</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-xs text-muted-foreground">Total Employees</Label>
                  <p className="text-2xl font-bold mt-1">{selectedDept.employee_count}</p>
                </Card>
                <Card className="p-4">
                  <Label className="text-xs text-muted-foreground">Active Loggers</Label>
                  <p className="text-2xl font-bold text-success mt-1">{selectedDept.active_employees}</p>
                </Card>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Target</Label>
                <p className="font-medium text-foreground mt-1">{EMISSION_TARGET_PER_EMPLOYEE} kg per employee</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Emissions Report</DialogTitle>
            <DialogDescription>Download comprehensive emissions analytics</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-background-subtle border rounded-lg text-sm">
              <p className="font-medium text-foreground mb-2">Report Includes:</p>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                <li>Total emissions by department</li>
                <li>Per-employee emissions breakdown</li>
                <li>Location-based analysis</li>
                <li>Monthly trend data</li>
                <li>Target achievement status</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success('Exporting emissions report...'); setIsExportOpen(false); }}>
              <Download className="h-4 w-4 mr-2" />Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
