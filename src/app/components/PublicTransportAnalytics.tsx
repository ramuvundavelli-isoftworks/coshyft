// Public Transport Analytics Component
// Enhanced Transport Mode Visualizations

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Bus,
  Train,
  Bike,
  Car,
  Zap,
  TrendingDown,
  TrendingUp,
  MapPin,
  Users,
  Euro,
  Info,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { formatCurrency, formatEmissions, formatPercentage, formatNumber } from '../utils/localization';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { doughnutChartOptions, barChartOptions, lineChartOptions, colors } from '../utils/chartConfig';
import { LeapCardConnection, LeapCardStatus } from './LeapCardIntegration';

interface TransportMode {
  id: string;
  mode: string;
  operator: string;
  users: number;
  trips: number;
  totalKm: number;
  emissions: number;
  emissionFactor: number;
  costSavings: number;
  trend: number;
  coverage: string[];
}

const transportData: TransportMode[] = [
  {
    id: 'dublin_bus',
    mode: 'Dublin Bus',
    operator: 'Dublin Bus / Go-Ahead Ireland',
    users: 142,
    trips: 2847,
    totalKm: 38420,
    emissions: 3150.44,
    emissionFactor: 0.082,
    costSavings: 41300,
    trend: 12.5,
    coverage: ['Dublin City', 'Fingal', 'Dún Laoghaire-Rathdown', 'South Dublin'],
  },
  {
    id: 'dart',
    mode: 'DART',
    operator: 'Iarnród Éireann',
    users: 87,
    trips: 1740,
    totalKm: 42180,
    emissions: 1476.3,
    emissionFactor: 0.035,
    costSavings: 28400,
    trend: 18.3,
    coverage: ['Dublin Coastal Line', 'Malahide to Greystones'],
  },
  {
    id: 'luas_red',
    mode: 'Luas Red Line',
    operator: 'Transdev',
    users: 64,
    trips: 1280,
    totalKm: 15360,
    emissions: 583.68,
    emissionFactor: 0.038,
    costSavings: 18200,
    trend: 9.2,
    coverage: ['The Point to Tallaght/Saggart'],
  },
  {
    id: 'luas_green',
    mode: 'Luas Green Line',
    operator: 'Transdev',
    users: 52,
    trips: 1040,
    totalKm: 12480,
    emissions: 474.24,
    emissionFactor: 0.038,
    costSavings: 15800,
    trend: 7.8,
    coverage: ['Brides Glen to Broombridge'],
  },
  {
    id: 'irish_rail',
    mode: 'Irish Rail Commuter',
    operator: 'Iarnród Éireann',
    users: 73,
    trips: 1460,
    totalKm: 87600,
    emissions: 3504,
    emissionFactor: 0.04,
    costSavings: 32100,
    trend: 15.7,
    coverage: ['Kildare', 'Meath', 'Wicklow'],
  },
  {
    id: 'bike_to_work',
    mode: 'Bike to Work Scheme',
    operator: 'Various Retailers',
    users: 127,
    trips: 2540,
    totalKm: 12700,
    emissions: 0,
    emissionFactor: 0,
    costSavings: 34200,
    trend: 22.4,
    coverage: ['Nationwide'],
  },
];

const modeSplitData = [
  { mode: 'Dublin Bus', value: 142, color: '#0066CC' },
  { mode: 'DART', value: 87, color: '#00bc7d' },
  { mode: 'Luas', value: 116, color: '#D83E3E' },
  { mode: 'Irish Rail', value: 73, color: '#009689' },
  { mode: 'Bike to Work', value: 127, color: '#FFA500' },
  { mode: 'Private EV', value: 84, color: '#9B59B6' },
];

const monthlyTrend = [
  { month: 'Aug 2025', dublinBus: 128, dart: 72, luas: 98, irishRail: 64, bike: 108 },
  { month: 'Sep 2025', dublinBus: 132, dart: 78, luas: 104, irishRail: 67, bike: 115 },
  { month: 'Oct 2025', dublinBus: 135, dart: 81, luas: 108, irishRail: 69, bike: 118 },
  { month: 'Nov 2025', dublinBus: 138, dart: 83, luas: 111, irishRail: 71, bike: 122 },
  { month: 'Dec 2025', dublinBus: 140, dart: 85, luas: 114, irishRail: 72, bike: 125 },
  { month: 'Jan 2026', dublinBus: 142, dart: 87, luas: 116, irishRail: 73, bike: 127 },
];

const emissionsComparison = [
  { mode: 'Private Petrol Car', emissions: 172.3, color: '#E74C3C' },
  { mode: 'Private Diesel Car', emissions: 145.8, color: '#E67E22' },
  { mode: 'Dublin Bus', emissions: 82, color: '#0066CC' },
  { mode: 'Private EV', emissions: 48, color: '#9B59B6' },
  { mode: 'Irish Rail', emissions: 40, color: '#009689' },
  { mode: 'Luas', emissions: 38, color: '#D83E3E' },
  { mode: 'DART', emissions: 35, color: '#00bc7d' },
  { mode: 'Bicycle', emissions: 0, color: '#FFA500' },
];

export default function PublicTransportAnalytics() {
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLeapCardDialogOpen, setIsLeapCardDialogOpen] = useState(false);
  const [isLeapCardConnected, setIsLeapCardConnected] = useState(false);
  const [leapCardJourneys, setLeapCardJourneys] = useState(0);

  const handleViewDetails = (mode: TransportMode) => {
    setSelectedMode(mode);
    setIsDetailsDialogOpen(true);
  };

  const handleLeapCardConnect = (cardNumber: string) => {
    setIsLeapCardConnected(true);
    setLeapCardJourneys(238); // Mock journey count
    setIsLeapCardDialogOpen(false);
  };

  const totalUsers = transportData.reduce((sum, mode) => sum + mode.users, 0);
  const totalTrips = transportData.reduce((sum, mode) => sum + mode.trips, 0);
  const totalEmissions = transportData.reduce((sum, mode) => sum + mode.emissions, 0);
  const totalSavings = transportData.reduce((sum, mode) => sum + mode.costSavings, 0);

  const getModeIcon = (mode: string) => {
    if (mode.includes('Bus')) return Bus;
    if (mode.includes('Metro') || mode.includes('Rail') || mode.includes('Commuter')) return Train;
    if (mode.includes('Light')) return Train;
    if (mode.includes('Bike')) return Bike;
    if (mode.includes('EV')) return Zap;
    return Car;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Public Transport Analytics</h1>
          <p className="text-gray-600 mt-1">
            Employee commuting patterns across public transport networks
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{formatNumber(totalUsers)}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Active Users</p>
          <p className="text-xs text-green-600 mt-1">+14.2% vs last month</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{formatNumber(totalTrips)}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Total Trips</p>
          <p className="text-xs text-green-600 mt-1">Jan 2026</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingDown className="h-5 w-5 text-orange-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{formatEmissions(totalEmissions)}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Total Emissions</p>
          <p className="text-xs text-green-600 mt-1">68% below car alternative</p>
        </Card>

        <Card className="p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Euro className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-2xl font-semibold text-[#101828]">{formatCurrency(totalSavings, 'EUR')}</span>
          </div>
          <p className="text-sm text-[#6a7282]">Cost Savings</p>
          <p className="text-xs text-[#4a5565] mt-1">Through transit benefits</p>
        </Card>
      </div>

      {/* Leap Card Integration Status */}
      <LeapCardStatus
        isConnected={isLeapCardConnected}
        lastSync={isLeapCardConnected ? new Date() : undefined}
        journeyCount={leapCardJourneys}
        onConnect={() => setIsLeapCardDialogOpen(true)}
      />

      {/* Tabs */}
      <Tabs defaultValue="modes" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modes">Transport Modes</TabsTrigger>
          <TabsTrigger value="split">Mode Split</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Emissions Comparison</TabsTrigger>
        </TabsList>

        {/* Transport Modes Tab */}
        <TabsContent value="modes" className="space-y-4 mt-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#101828] mb-4">Public Transport Usage</h3>
            <div className="space-y-3">
              {transportData.map((mode) => {
                const ModeIcon = getModeIcon(mode.mode);
                return (
                  <div
                    key={mode.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#00bc7d] transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(mode)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <ModeIcon className="h-6 w-6 text-[#4a5565]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#101828]">{mode.mode}</span>
                          <Badge variant="outline" className="text-xs">{mode.operator}</Badge>
                        </div>
                        <p className="text-sm text-[#6a7282]">{mode.coverage.join(' • ')}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-[#4a5565]">
                            <Users className="h-3 w-3 inline mr-1" />
                            {mode.users} users
                          </span>
                          <span className="text-xs text-[#4a5565]">
                            {formatNumber(mode.trips)} trips
                          </span>
                          <span className="text-xs text-[#4a5565]">
                            {formatEmissions(mode.emissions)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#101828]">{formatCurrency(mode.costSavings, 'EUR')}</p>
                        <p className="text-xs text-[#6a7282]">Cost savings</p>
                      </div>
                      {mode.trend > 0 && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {formatPercentage(mode.trend)}
                        </Badge>
                      )}
                      <ChevronRight className="h-5 w-5 text-[#6a7282]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* Mode Split Tab */}
        <TabsContent value="split" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">Transport Mode Distribution</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <Doughnut
                  data={{
                    labels: modeSplitData.map(d => d.mode),
                    datasets: [
                      {
                        data: modeSplitData.map(d => d.value),
                        backgroundColor: modeSplitData.map(d => d.color),
                        borderWidth: 0,
                      },
                    ],
                  }}
                  options={doughnutChartOptions}
                />
              </div>
            </Card>

            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-[#101828] mb-4">Mode Statistics</h3>
              <div className="space-y-3">
                {modeSplitData.map((mode, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: mode.color }}
                      />
                      <span className="text-sm text-[#101828]">{mode.mode}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-[#101828]">{mode.value} users</span>
                      <div className="w-24">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: `${(mode.value / totalUsers) * 100}%`,
                              backgroundColor: mode.color,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-[#6a7282] w-12 text-right">
                        {formatPercentage((mode.value / totalUsers) * 100)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4 mt-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-[#101828] mb-4">6-Month Usage Trends</h3>
            <div style={{ height: '400px', width: '100%' }}>
              <Line
                data={{
                  labels: monthlyTrend.map(d => d.month),
                  datasets: [
                    {
                      label: 'Dublin Bus',
                      data: monthlyTrend.map(d => d.dublinBus),
                      borderColor: '#0066CC',
                      borderWidth: 2,
                      fill: false,
                    },
                    {
                      label: 'DART',
                      data: monthlyTrend.map(d => d.dart),
                      borderColor: '#00bc7d',
                      borderWidth: 2,
                      fill: false,
                    },
                    {
                      label: 'Luas',
                      data: monthlyTrend.map(d => d.luas),
                      borderColor: '#D83E3E',
                      borderWidth: 2,
                      fill: false,
                    },
                    {
                      label: 'Irish Rail',
                      data: monthlyTrend.map(d => d.irishRail),
                      borderColor: '#009689',
                      borderWidth: 2,
                      fill: false,
                    },
                    {
                      label: 'Bike Share',
                      data: monthlyTrend.map(d => d.bike),
                      borderColor: '#FFA500',
                      borderWidth: 2,
                      fill: false,
                    },
                  ],
                }}
                options={lineChartOptions}
              />
            </div>
          </Card>
        </TabsContent>

        {/* Emissions Comparison Tab */}
        <TabsContent value="comparison" className="space-y-4 mt-6">
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#101828]">
                Emission Factors Comparison (g CO₂e/km)
              </h3>
            </div>
            <div style={{ height: '400px', width: '100%' }}>
              <Bar
                data={{
                  labels: emissionsComparison.map(d => d.mode),
                  datasets: [
                    {
                      label: 'g CO₂e/km',
                      data: emissionsComparison.map(d => d.emissions),
                      backgroundColor: emissionsComparison.map(d => d.color),
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{
                  ...barChartOptions,
                  indexAxis: 'y' as const,
                }}
              />
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">Public Transport Advantage</p>
                  <p className="text-sm text-green-700 mt-1">
                    Employees using public transport modes generate{' '}
                    <strong>68-80% lower emissions</strong> compared to private petrol cars, representing significant environmental benefits and cost savings.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mode Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              {selectedMode && (
                <>
                  {React.createElement(getModeIcon(selectedMode.mode), { className: 'h-6 w-6 text-[#00bc7d]' })}
                  {selectedMode.mode}
                </>
              )}
            </DialogTitle>
            <DialogDescription>{selectedMode?.operator}</DialogDescription>
          </DialogHeader>
          {selectedMode && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Active Users</p>
                  <p className="text-2xl font-semibold text-[#101828]">{selectedMode.users}</p>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Total Trips</p>
                  <p className="text-2xl font-semibold text-[#101828]">{formatNumber(selectedMode.trips)}</p>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Total Distance</p>
                  <p className="text-2xl font-semibold text-[#101828]">{formatNumber(selectedMode.totalKm)} km</p>
                </Card>
                <Card className="p-4 border border-gray-200">
                  <p className="text-sm text-[#6a7282] mb-1">Total Emissions</p>
                  <p className="text-2xl font-semibold text-[#101828]">{formatEmissions(selectedMode.emissions)}</p>
                </Card>
              </div>

              <div>
                <p className="text-sm font-medium text-[#101828] mb-2">Emission Factor</p>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {selectedMode.emissionFactor} kg CO₂e/km
                </Badge>
              </div>

              <div>
                <p className="text-sm font-medium text-[#101828] mb-2">Coverage Area</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMode.coverage.map((area, index) => (
                    <Badge key={index} variant="outline">
                      <MapPin className="h-3 w-3 mr-1" />
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Euro className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Transit Benefit Savings</p>
                    <p className="text-sm text-green-700 mt-1">
                      Total employee savings through transit benefits: <strong>{formatCurrency(selectedMode.costSavings, 'EUR')}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {selectedMode.trend > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Growth Trend</p>
                      <p className="text-sm text-blue-700 mt-1">
                        Usage has increased by <strong>{formatPercentage(selectedMode.trend)}</strong> compared to the
                        previous month, indicating strong employee adoption.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Leap Card Connection Dialog */}
      <LeapCardConnection
        isOpen={isLeapCardDialogOpen}
        onClose={() => setIsLeapCardDialogOpen(false)}
        onConnect={handleLeapCardConnect}
      />

      {/* Leap Card Connected Dialog */}
      <Dialog open={isLeapCardConnected} onOpenChange={setIsLeapCardConnected}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-[#00bc7d]" />
              Leap Card Connected
            </DialogTitle>
            <DialogDescription>Your Leap Card is now connected and tracking your journeys.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card className="p-4 border border-gray-200">
              <p className="text-sm text-[#6a7282] mb-1">Total Journeys</p>
              <p className="text-2xl font-semibold text-[#101828]">{leapCardJourneys}</p>
            </Card>
            <Button
              className="w-full bg-[#00bc7d] text-white"
              onClick={() => setIsLeapCardConnected(false)}
            >
              Disconnect Leap Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}