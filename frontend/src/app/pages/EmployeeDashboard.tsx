import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { 
  TrendingDown, 
  MapPin, 
  Plus,
  Search,
  Car,
  Clock,
  Activity,
  Award,
  AlertCircle,
  Calendar,
  Leaf,
  Users,
  Zap,
  TrendingUp,
  Bus,
  Bike,
  Home,
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { LogCommuteModal, CommuteEntry } from '../components/LogCommuteModal';
import { toast } from 'sonner';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { lineChartOptions, doughnutChartOptions, barChartOptions, colors } from '../utils/chartConfig';
import { useApi } from '../api';
import { commuteApi, gamificationApi, carpoolingApi, useApiMutation } from '../api';
import type { CommuteEntryCreate, CommuteEntry as ApiCommuteEntry } from '../api/commute.api';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [isLogCommuteOpen, setIsLogCommuteOpen] = useState(false);
  const [commuteEntries, setCommuteEntries] = useState<CommuteEntry[]>([]);
  const [hoveredDay, setHoveredDay] = useState<{ day: number; mode?: string; distance?: number; month: string } | null>(null);

  // API hooks
  const { data: commuteStats } = useApi(() => commuteApi.getStats());
  const { data: gamificationProfile } = useApi(() => gamificationApi.getProfile());
  const { data: apiRides } = useApi(() => carpoolingApi.getMyRides());
  const { data: activeTrip } = useApi(() => carpoolingApi.getActiveTrip());
  const { data: commuteHistory } = useApi(() => commuteApi.getHistory({ page: 1, page_size: 90 }));
  const { data: monthlyStats } = useApi(() => commuteApi.getMonthlyStats());

  // Mutation hook for logging commutes
  const logCommuteMutation = useApiMutation<CommuteEntryCreate, ApiCommuteEntry>(
    (data) => commuteApi.logCommute(data)
  );

  // apiRides.data is already the array (useApi unwraps response.data)
  const ridesArray: any[] = Array.isArray(apiRides) ? apiRides as any[] : [];
  const upcomingRides = ridesArray.filter((r: any) => r.status === 'scheduled');

  // Active trip derived values
  const activeTripData = activeTrip as any;
  const isDriverToday = activeTripData && activeTripData.driver_id;
  const activeTripTime = activeTripData?.departure_time
    ? new Date(activeTripData.departure_time).toLocaleTimeString('en-IE', { hour: 'numeric', minute: '2-digit' })
    : null;
  const activeTripRoute = activeTripData
    ? `${activeTripData.origin ?? ''} → ${activeTripData.destination ?? ''}`
    : null;

  // Build calendar data from API history
  const historyItems: any[] = (commuteHistory as any)?.items ?? [];
  const calendarDataByDate = historyItems.reduce((acc: Record<string, any>, entry: any) => {
    const dateStr = entry.commute_date ?? entry.date;
    if (dateStr) acc[dateStr] = entry;
    return acc;
  }, {});

  // Weekly impact data from monthly stats
  const monthlyStatsList: any[] = Array.isArray(monthlyStats) ? monthlyStats : [];
  const impactData = monthlyStatsList.slice(-4).map((m: any) => ({
    week: m.month_name ?? `Month ${m.month}`,
    co2: m.co2_saved_vs_car ?? 0,
  }));

  const handleLogCommute = async (entry: CommuteEntry) => {
    // Optimistic local update
    setCommuteEntries(prev => [...prev, entry]);

    // Map LogCommuteModal entry to API format
    const apiPayload: CommuteEntryCreate = {
      date: entry.date,
      transport_mode_id: entry.mode.toLowerCase().replace(/\s+/g, '-'),
      distance_km: entry.distance,
      is_return_trip: true,
      carpool_passengers: entry.carpoolDetails?.passengers,
      verification_method: 'manual',
    };

    const result = await logCommuteMutation.execute(apiPayload);
    if (!result.success) {
      // Rollback optimistic update on failure
      setCommuteEntries(prev => prev.filter(e => e.id !== entry.id));
      toast.error(result.error?.message || 'Failed to log commute');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header - No Container */}
      <div className="flex items-start justify-between py-4">
        {/* Left - Greeting */}
        <div>
          <h1 className="font-['Geist',sans-serif] font-bold text-[32px] leading-[40px] text-foreground tracking-[0.0703px] mb-2">
            Good morning, Alex!
          </h1>
          <p className="font-['Geist',sans-serif] font-normal text-[16px] leading-[24px] text-muted-foreground tracking-[-0.3125px]">
            You have 3 upcoming rides this week. Keep up the great work reducing emissions!
          </p>
        </div>

        {/* Right - Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/employee/offer-ride')}
            className="bg-card h-9 px-4 rounded-lg border border-[rgba(0,0,0,0.1)] hover:bg-background-subtle transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-foreground" />
              <span className="font-['Geist',sans-serif] font-medium text-[14px] leading-5 text-foreground tracking-[-0.1504px]">
                Offer Ride
              </span>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/employee/find-ride')}
            className="bg-card h-9 px-4 rounded-lg border border-[rgba(0,0,0,0.1)] hover:bg-background-subtle transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-foreground" />
              <span className="font-['Geist',sans-serif] font-medium text-[14px] leading-5 text-foreground tracking-[-0.1504px]">
                Find Ride
              </span>
            </div>
          </button>
          
          <button
            onClick={() => setIsLogCommuteOpen(true)}
            className="bg-brand-500 h-9 px-4 rounded-lg hover:bg-brand-500 transition-all shadow-md hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-white" />
              <span className="font-['Geist',sans-serif] font-medium text-[14px] leading-5 text-white tracking-[-0.1504px]">
                Log Commute
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Geist',sans-serif] font-medium text-[12px] text-muted-foreground uppercase tracking-wide">
              Total Commutes
            </p>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="font-['Geist',sans-serif] font-bold text-[32px] leading-[38px] text-foreground mb-1">
            {(commuteStats as any)?.total_commutes ?? '—'}
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="font-['Geist',sans-serif] text-[12px] text-success">All time</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Geist',sans-serif] font-medium text-[12px] text-muted-foreground uppercase tracking-wide">
              CO₂ Saved
            </p>
            <Leaf className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="font-['Geist',sans-serif] font-bold text-[32px] leading-[38px] text-foreground mb-1">
            {(commuteStats as any)?.co2_saved_vs_car != null ? `${(commuteStats as any).co2_saved_vs_car} kg` : '—'}
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="font-['Geist',sans-serif] text-[12px] text-success">vs solo car</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Geist',sans-serif] font-medium text-[12px] text-muted-foreground uppercase tracking-wide">
              OxyPoints
            </p>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="font-['Geist',sans-serif] font-bold text-[32px] leading-[38px] text-foreground mb-1">
            {(commuteStats as any)?.total_oxypoints != null ? (commuteStats as any).total_oxypoints.toLocaleString() : '—'}
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="font-['Geist',sans-serif] text-[12px] text-success">Total earned</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Geist',sans-serif] font-medium text-[12px] text-muted-foreground uppercase tracking-wide">
              Active Streak
            </p>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="font-['Geist',sans-serif] font-bold text-[32px] leading-[38px] text-foreground mb-1">
            {(commuteStats as any)?.streak != null ? `${(commuteStats as any).streak} days` : '—'}
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="font-['Geist',sans-serif] text-[12px] text-success">Keep it going!</span>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - 2/3 width */}
        <div className="col-span-2 space-y-4">
          {/* Today's Ride — shown only when there's an active trip */}
          {activeTripData ? (
            <div className="bg-card rounded-[14px] border border-border/50">
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-border-subtle/50">
                <h2 className="font-['Geist',sans-serif] font-semibold text-[18px] leading-7 text-foreground tracking-[-0.4395px]">
                  Today's Ride
                </h2>
                <div className="bg-brand-500 rounded-lg px-[9px] py-[3px]">
                  <span className="font-['Geist',sans-serif] font-medium text-[12px] leading-4 text-white">
                    Active
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-600 rounded-[14px] w-12 h-12 flex items-center justify-center">
                    <Car className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-['Geist',sans-serif] font-semibold text-[18px] leading-[27px] text-foreground tracking-[-0.4395px]">
                        {isDriverToday ? "You're driving today" : "You're a passenger today"}
                      </h3>
                      <div className="rounded-lg border border-[rgba(0,0,0,0.1)] px-[9px] py-[3px]">
                        <span className="font-['Geist',sans-serif] font-medium text-[12px] leading-4 text-foreground">
                          {activeTripData.seats_total - activeTripData.seats_available - 1} passengers
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      {activeTripTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.33} />
                          <span className="font-['Geist',sans-serif] font-normal text-[14px] leading-5 text-muted-foreground tracking-[-0.1504px]">
                            {activeTripTime} departure
                          </span>
                        </div>
                      )}
                      {activeTripRoute && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" strokeWidth={1.33} />
                          <span className="font-['Geist',sans-serif] font-normal text-[14px] leading-5 text-muted-foreground tracking-[-0.1504px]">
                            {activeTripRoute}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-['Geist',sans-serif] font-semibold text-[24px] leading-8 text-success mb-1">
                          +{(activeTripData.co2_saved ?? 0).toFixed(1)} kg
                        </p>
                        <p className="font-['Geist',sans-serif] font-normal text-[12px] leading-4 text-muted-foreground">
                          CO₂ saved
                        </p>
                      </div>
                      <Link to="/employee/active-trip">
                        <button className="bg-brand-600 hover:bg-brand-500 transition-colors rounded-lg px-6 py-2">
                          <span className="font-['Geist',sans-serif] font-medium text-[14px] leading-5 text-white">
                            View Trip
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-border-subtle/50">
                <Link to="/employee/active-trip">
                  <button className="w-full text-center font-['Geist',sans-serif] font-normal text-[14px] text-muted-foreground hover:text-foreground transition-colors">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* No active trip — quick-action prompt */
            <div className="bg-card rounded-[14px] border border-border/50 p-6">
              <div className="flex items-start gap-4">
                <div className="bg-muted rounded-[14px] w-12 h-12 flex items-center justify-center">
                  <Car className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-['Geist',sans-serif] font-semibold text-[18px] leading-[27px] text-foreground mb-1">
                    No active trip today
                  </h3>
                  <p className="font-['Geist',sans-serif] font-normal text-[14px] text-muted-foreground mb-4">
                    Find a ride or log your commute to get started.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/employee/find-ride')}
                      className="bg-brand-600 hover:bg-brand-500 transition-colors rounded-lg px-4 py-2"
                    >
                      <span className="font-['Geist',sans-serif] font-medium text-[14px] leading-5 text-white">
                        Find a Ride
                      </span>
                    </button>
                    <button
                      onClick={() => setIsLogCommuteOpen(true)}
                      className="bg-card border border-[rgba(0,0,0,0.1)] hover:bg-background-subtle transition-colors rounded-lg px-4 py-2"
                    >
                      <span className="font-['Geist',sans-serif] font-medium text-[14px] leading-5 text-foreground">
                        Log Commute
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Rides */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Geist',sans-serif] font-semibold text-[18px] leading-7 text-foreground tracking-[-0.4395px]">
                Upcoming Rides
              </h2>
              <Link to="/employee/trips">
                <button className="font-['Geist',sans-serif] font-medium text-[14px] text-info hover:text-info transition-colors">
                  View All →
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingRides.slice(0, 2).map((ride: any) => {
                const isPending = ride.user_role === 'passenger_pending';
                const isDriver = ride.user_role === 'driver';
                const label = isDriver ? 'Driver' : isPending ? 'Pending Approval' : 'Confirmed';
                const labelClass = isDriver
                  ? 'bg-brand-subtle border border-brand/25 text-brand-600'
                  : isPending
                  ? 'bg-warning-subtle border border-warning/25 text-warning'
                  : 'bg-info-subtle border border-info/25 text-info';
                return (
                  <div key={ride.id} className="border border-border rounded-lg p-4 hover:border-border transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="bg-warning-subtle border border-warning/25 rounded-lg px-2 py-1 inline-block mb-2">
                          <span className="font-['Geist',sans-serif] font-medium text-[12px] text-warning">
                            Scheduled
                          </span>
                        </div>
                        <p className="font-['Geist',sans-serif] font-semibold text-[14px] text-foreground">
                          {isDriver ? 'Your ride' : (ride.driver_name ?? 'Driver')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[12px] text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(ride.departure_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{ride.origin} → {ride.destination}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                      <span className="font-['Geist',sans-serif] font-medium text-[12px] text-success">
                        +{(ride.co2_saved ?? 0).toFixed(1)} kg CO₂ saved
                      </span>
                      <div className={`rounded-lg px-2 py-1 ${labelClass}`}>
                        <span className="font-['Geist',sans-serif] font-medium text-[12px]">
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* 3-Month Commute Calendar - Separate Heatmap Chart */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="font-['Geist',sans-serif] font-semibold text-[18px] leading-7 text-foreground tracking-[-0.4395px] mb-1">
                3-Month Commute Calendar
              </h2>
              <p className="font-['Geist',sans-serif] font-normal text-[12px] text-muted-foreground">
                Visual overview of your daily commute patterns
              </p>
            </div>

            {/* Horizontal 3 Month Heatmap */}
            <div className="space-y-4 relative">
              {/* Tooltip */}
              {hoveredDay && (
                <div className="absolute z-50 bg-foreground text-white text-[11px] rounded-lg px-3 py-2 shadow-lg pointer-events-none"
                  style={{
                    left: '50%',
                    top: '-60px',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="font-['Geist',sans-serif] font-semibold mb-1">
                    {hoveredDay.month} - Day {hoveredDay.day}
                  </div>
                  {hoveredDay.mode && (
                    <div className="font-['Geist',sans-serif]">
                      <div className="capitalize">{hoveredDay.mode}</div>
                      {hoveredDay.distance && <div>{hoveredDay.distance} km</div>}
                    </div>
                  )}
                  {!hoveredDay.mode && (
                    <div className="font-['Geist',sans-serif] text-muted-foreground">No commute</div>
                  )}
                </div>
              )}

              {/* Dynamic last 3 months from today */}
              {(() => {
                const modeColors: Record<string, string> = {
                  carpool: 'bg-brand-500',
                  bike: 'bg-brand-500',
                  bus: 'bg-brand-600',
                  walk: 'bg-brand-700',
                  drive: 'bg-muted-foreground',
                  remote: 'bg-border',
                };

                const getModeKey = (label: string) =>
                  label.includes('carpool') ? 'carpool'
                  : label.includes('bike') || label.includes('cycl') ? 'bike'
                  : label.includes('bus') || label.includes('transit') || label.includes('train') ? 'bus'
                  : label.includes('walk') ? 'walk'
                  : label.includes('remote') || label.includes('work from home') ? 'remote'
                  : label.includes('car') || label.includes('drive') ? 'drive'
                  : '';

                const months = Array.from({ length: 3 }, (_, i) => {
                  const d = new Date();
                  d.setDate(1);
                  d.setMonth(d.getMonth() - (i + 1));
                  const year = d.getFullYear();
                  const month = d.getMonth() + 1;
                  const days = new Date(year, month, 0).getDate();
                  const label = d.toLocaleString('en-IE', { month: 'long', year: 'numeric' });
                  const prefix = `${year}-${String(month).padStart(2, '0')}`;
                  const monthCo2 = Object.entries(calendarDataByDate)
                    .filter(([k]) => k.startsWith(prefix))
                    .reduce((s, [, e]: [string, any]) => s + (e.co2_saved ?? 0), 0);
                  return { days, label, prefix, monthCo2 };
                });

                return months.map(({ days, label, prefix, monthCo2 }) => (
                  <div key={prefix}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-['Geist',sans-serif] font-medium text-[11px] text-foreground">{label}</p>
                      <p className="font-['Geist',sans-serif] text-[10px] text-muted-foreground">
                        {monthCo2 > 0 ? `${monthCo2.toFixed(1)} kg CO₂ saved` : '—'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: days }, (_, i) => {
                        const day = i + 1;
                        const dateKey = `${prefix}-${String(day).padStart(2, '0')}`;
                        const dayData = calendarDataByDate[dateKey];
                        const modeLabel = dayData?.transport_mode_label?.toLowerCase() ?? '';
                        const modeKey = getModeKey(modeLabel);
                        return (
                          <div
                            key={day}
                            className={`w-6 h-6 rounded flex items-center justify-center transition-all hover:scale-125 cursor-pointer ${
                              dayData && modeKey ? modeColors[modeKey] : 'bg-muted'
                            }`}
                            title={dayData ? `Day ${day}: ${dayData.transport_mode_label} - ${dayData.distance_km ?? 0}km` : `Day ${day}`}
                            onMouseEnter={() => setHoveredDay({ day, mode: modeKey || undefined, distance: dayData?.distance_km, month: label })}
                            onMouseLeave={() => setHoveredDay(null)}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1 px-0.5">
                      <span className="font-['Geist',sans-serif] text-[9px] text-muted-foreground">1</span>
                      <span className="font-['Geist',sans-serif] text-[9px] text-muted-foreground">{Math.ceil(days * 0.25)}</span>
                      <span className="font-['Geist',sans-serif] text-[9px] text-muted-foreground">{Math.ceil(days * 0.5)}</span>
                      <span className="font-['Geist',sans-serif] text-[9px] text-muted-foreground">{Math.ceil(days * 0.75)}</span>
                      <span className="font-['Geist',sans-serif] text-[9px] text-muted-foreground">{days}</span>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-border-subtle mt-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-brand-500 rounded"></div>
                  <span className="font-['Geist',sans-serif] text-[10px] text-muted-foreground">Carpool</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-brand-500 rounded"></div>
                  <span className="font-['Geist',sans-serif] text-[10px] text-muted-foreground">Bike</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-brand-600 rounded"></div>
                  <span className="font-['Geist',sans-serif] text-[10px] text-muted-foreground">Transit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-muted-foreground rounded"></div>
                  <span className="font-['Geist',sans-serif] text-[10px] text-muted-foreground">Drive</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-brand-700 rounded"></div>
                  <span className="font-['Geist',sans-serif] text-[10px] text-muted-foreground">Walk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-border rounded"></div>
                  <span className="font-['Geist',sans-serif] text-[10px] text-muted-foreground">Remote</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-4">
          {/* Carbon Impact */}
          <div className="bg-success-subtle rounded-[14px] border border-[rgba(0,0,0,0.1)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-success" />
              <h2 className="font-['Geist',sans-serif] font-semibold text-[18px] leading-7 text-foreground tracking-[-0.4395px]">
                Your Carbon Impact
              </h2>
            </div>
            
            <div className="mb-4">
              <p className="font-['Geist',sans-serif] font-bold text-[36px] leading-10 text-success mb-1">
                {(commuteStats as any)?.co2_saved_vs_car != null ? `${(commuteStats as any).co2_saved_vs_car} kg` : '—'}
              </p>
              <p className="font-['Geist',sans-serif] font-normal text-[14px] text-muted-foreground">
                CO₂ saved (vs solo car)
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="font-['Geist',sans-serif] text-[12px] text-muted-foreground">Trees equivalent</span>
                <span className="font-['Geist',sans-serif] font-semibold text-[12px] text-foreground">
                  {(commuteStats as any)?.co2_saved_vs_car != null
                    ? `${((commuteStats as any).co2_saved_vs_car / 21).toFixed(1)} trees`
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-['Geist',sans-serif] text-[12px] text-muted-foreground">Total distance</span>
                <span className="font-['Geist',sans-serif] font-semibold text-[12px] text-foreground">
                  {(commuteStats as any)?.total_distance_km != null
                    ? `${(commuteStats as any).total_distance_km} km`
                    : '—'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/employee/impact')}
              className="w-full bg-card border border-[rgba(0,0,0,0.1)] hover:bg-background-subtle transition-colors rounded-lg py-2"
            >
              <span className="font-['Geist',sans-serif] font-medium text-[14px] text-foreground">
                View Full Report
              </span>
            </button>
          </div>

          {/* Green Champion Badge */}
          <div 
            className="rounded-[14px] border border-warning/40 p-6 text-center relative"
            style={{ backgroundImage: "linear-gradient(152.288deg, rgb(10, 10, 10) 0%, rgb(0, 153, 102) 100%)" }}
          >
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-brand-600 to-brand-500 rounded-full px-6 py-3 mb-4">
              <Award className="w-6 h-6 text-white mr-2" />
              <span className="font-['Geist',sans-serif] font-semibold text-[20px] text-white">
                Green Champion!
              </span>
            </div>
            <p className="font-['Geist',sans-serif] font-normal text-[16px] text-white leading-[32px]">
              You're in the top 10% of drivers<br />
              saving CO₂ this month
            </p>
          </div>

          {/* Monthly Impact Chart */}
          <Card className="p-6">
            <h2 className="font-['Geist',sans-serif] font-semibold text-[18px] leading-7 text-foreground mb-4">
              Your Monthly Impact
            </h2>
            <div style={{ height: '200px', width: '100%' }}>
              <Line
                data={{
                  labels: impactData.map(d => d.week),
                  datasets: [
                    {
                      label: 'CO₂ Saved (kg)',
                      data: impactData.map(d => d.co2),
                      borderColor: colors.chart.green,
                      borderWidth: 3,
                      fill: false,
                    },
                  ],
                }}
                options={lineChartOptions}
              />
            </div>
            <div className="mt-4 bg-success-subtle border border-success/25 rounded-lg p-3">
              <p className="font-['Geist',sans-serif] text-[12px] text-success">
                <strong>Great job!</strong> You've saved 21.3 kg CO₂ this month, equivalent to planting 1.2 trees.
              </p>
            </div>
          </Card>

          {/* Alert */}
          <div className="bg-card  rounded-[14px] border border-border/50 p-4">
            <div className="flex items-start gap-3">
              <div className="bg-warning rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-['Geist',sans-serif] font-semibold text-[14px] text-foreground mb-1">
                  Haven't logged today's commute yet
                </h3>
                <p className="font-['Geist',sans-serif] font-normal text-[12px] text-muted-foreground mb-3">
                  Click to view all transport modes
                </p>
                <button 
                  onClick={() => setIsLogCommuteOpen(true)}
                  className="bg-warning hover:bg-warning transition-colors rounded-lg px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-white" />
                    <span className="font-['Geist',sans-serif] font-medium text-[12px] text-white">
                      Quick Log
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Commute Modal */}
      <LogCommuteModal
        isOpen={isLogCommuteOpen}
        onClose={() => setIsLogCommuteOpen(false)}
        onSubmit={handleLogCommute}
        existingEntries={commuteEntries}
      />
    </div>
  );
}