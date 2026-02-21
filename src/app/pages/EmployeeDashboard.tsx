import React, { useState } from 'react';
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
import { mockRides } from '../data/mockData';
import { Progress } from '../components/ui/progress';
import { LogCommuteModal, CommuteEntry } from '../components/LogCommuteModal';
import { toast } from 'sonner';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { lineChartOptions, doughnutChartOptions, barChartOptions, colors } from '../utils/chartConfig';

const impactData = [
  { week: 'Week 1', co2: 12.5 },
  { week: 'Week 2', co2: 15.2 },
  { week: 'Week 3', co2: 18.7 },
  { week: 'Week 4', co2: 21.3 },
];

// Mock commute data for February 2026
const mockCommuteData = [
  { day: 3, mode: 'carpool' as const, co2Saved: 2.8, distance: 12.3 },
  { day: 4, mode: 'carpool' as const, co2Saved: 2.8, distance: 12.3 },
  { day: 5, mode: 'bus' as const, co2Saved: 3.2, distance: 15 },
  { day: 6, mode: 'carpool' as const, co2Saved: 2.8, distance: 12.3 },
  { day: 7, mode: 'remote' as const, co2Saved: 0, distance: 0 },
  { day: 9, mode: 'remote' as const, co2Saved: 0, distance: 0 },
  { day: 10, mode: 'carpool' as const, co2Saved: 2.8, distance: 12.3 },
  { day: 11, mode: 'bike' as const, co2Saved: 4.5, distance: 12.3 },
  { day: 12, mode: 'carpool' as const, co2Saved: 2.8, distance: 12.3 },
  { day: 13, mode: 'bus' as const, co2Saved: 3.2, distance: 15 },
  { day: 14, mode: 'drive' as const, co2Saved: 0, distance: 12.3 },
  { day: 16, mode: 'remote' as const, co2Saved: 0, distance: 0 },
  { day: 17, mode: 'carpool' as const, co2Saved: 2.8, distance: 12.3 },
  { day: 18, mode: 'carpool' as const, co2Saved: 2.8, distance: 12.3 },
  { day: 19, mode: 'walk' as const, co2Saved: 4.8, distance: 5 },
  { day: 20, mode: 'bus' as const, co2Saved: 3.2, distance: 15 },
  { day: 21, mode: 'bike' as const, co2Saved: 4.5, distance: 12.3 },
];

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [isLogCommuteOpen, setIsLogCommuteOpen] = useState(false);
  const [commuteEntries, setCommuteEntries] = useState<CommuteEntry[]>([]);
  const [hoveredDay, setHoveredDay] = useState<{ day: number; mode?: string; distance?: number; month: string } | null>(null);
  
  const upcomingRides = mockRides.filter(r => r.status === 'scheduled');

  const handleLogCommute = (entry: CommuteEntry) => {
    setCommuteEntries(prev => [...prev, entry]);
    console.log('Commute logged:', entry);
    toast.success('Commute logged successfully!');
  };

  return (
    <div className="space-y-4">
      {/* Header - No Container */}
      <div className="flex items-start justify-between py-4">
        {/* Left - Greeting */}
        <div>
          <h1 className="font-['Inter',sans-serif] font-bold text-[32px] leading-[40px] text-[#101828] tracking-[0.0703px] mb-2">
            Good morning, Alex!
          </h1>
          <p className="font-['Inter',sans-serif] font-normal text-[16px] leading-[24px] text-[#6a7282] tracking-[-0.3125px]">
            You have 3 upcoming rides this week. Keep up the great work reducing emissions!
          </p>
        </div>

        {/* Right - Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/employee/offer-ride')}
            className="bg-white h-9 px-4 rounded-lg border border-[rgba(0,0,0,0.1)] hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#101828]" />
              <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-5 text-[#101828] tracking-[-0.1504px]">
                Offer Ride
              </span>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/employee/find-ride')}
            className="bg-white h-9 px-4 rounded-lg border border-[rgba(0,0,0,0.1)] hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#101828]" />
              <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-5 text-[#101828] tracking-[-0.1504px]">
                Find Ride
              </span>
            </div>
          </button>
          
          <button
            onClick={() => setIsLogCommuteOpen(true)}
            className="bg-[#00bc7d] h-9 px-4 rounded-lg hover:bg-[#00a872] transition-all shadow-md hover:shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-white" />
              <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-5 text-white tracking-[-0.1504px]">
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
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#6a7282] uppercase tracking-wide">
              Total Commutes
            </p>
            <Calendar className="w-4 h-4 text-[#6a7282]" />
          </div>
          <p className="font-['Inter',sans-serif] font-bold text-[32px] leading-[38px] text-[#101828] mb-1">
            127
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#00A63E]" />
            <span className="font-['Inter',sans-serif] text-[12px] text-[#00A63E]">+12% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#6a7282] uppercase tracking-wide">
              CO₂ Saved
            </p>
            <Leaf className="w-4 h-4 text-[#6a7282]" />
          </div>
          <p className="font-['Inter',sans-serif] font-bold text-[32px] leading-[38px] text-[#101828] mb-1">
            43.2 kg
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#00A63E]" />
            <span className="font-['Inter',sans-serif] text-[12px] text-[#00A63E]">+8% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#6a7282] uppercase tracking-wide">
              Carpool Rides
            </p>
            <Users className="w-4 h-4 text-[#6a7282]" />
          </div>
          <p className="font-['Inter',sans-serif] font-bold text-[32px] leading-[38px] text-[#101828] mb-1">
            34
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#00A63E]" />
            <span className="font-['Inter',sans-serif] text-[12px] text-[#00A63E]">+18% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-['Inter',sans-serif] font-medium text-[12px] text-[#6a7282] uppercase tracking-wide">
              Active Streaks
            </p>
            <Zap className="w-4 h-4 text-[#6a7282]" />
          </div>
          <p className="font-['Inter',sans-serif] font-bold text-[32px] leading-[38px] text-[#101828] mb-1">
            7 days
          </p>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-[#00A63E]" />
            <span className="font-['Inter',sans-serif] text-[12px] text-[#00A63E]">Keep it going!</span>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - 2/3 width */}
        <div className="col-span-2 space-y-4">
          {/* Today's Ride */}
          <div className="bg-white  rounded-[14px] border border-gray-300/50">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100/50">
              <h2 className="font-['Inter',sans-serif] font-semibold text-[18px] leading-7 text-[#0a0a0a] tracking-[-0.4395px]">
                Today's Ride
              </h2>
              <div className="bg-[#00bc7d] rounded-lg px-[9px] py-[3px]">
                <span className="font-['Inter',sans-serif] font-medium text-[12px] leading-4 text-white">
                  Active
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[#096] rounded-[14px] w-12 h-12 flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-['Inter',sans-serif] font-semibold text-[18px] leading-[27px] text-[#101828] tracking-[-0.4395px]">
                      You're driving today
                    </h3>
                    <div className="rounded-lg border border-[rgba(0,0,0,0.1)] px-[9px] py-[3px]">
                      <span className="font-['Inter',sans-serif] font-medium text-[12px] leading-4 text-[#0a0a0a]">
                        3 passengers
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#4a5565]" strokeWidth={1.33} />
                      <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-5 text-[#4a5565] tracking-[-0.1504px]">
                        8:30 AM departure
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#4a5565]" strokeWidth={1.33} />
                      <span className="font-['Inter',sans-serif] font-normal text-[14px] leading-5 text-[#4a5565] tracking-[-0.1504px]">
                        Downtown → Tech Park Office
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-['Inter',sans-serif] font-semibold text-[14px] leading-5 text-[#101828] mb-1">
                      Passengers
                    </p>
                    <p className="font-['Inter',sans-serif] font-normal text-[12px] leading-4 text-[#6a7282]">
                      Sarah Johnson, Mike Chen, Emma Davis
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-['Inter',sans-serif] font-semibold text-[24px] leading-8 text-[#00A63E] mb-1">
                        +2.5 kg
                      </p>
                      <p className="font-['Inter',sans-serif] font-normal text-[12px] leading-4 text-[#6a7282]">
                        CO₂ saved
                      </p>
                    </div>
                    <Link to="/employee/active-trip">
                      <button className="bg-[#096] hover:bg-[#00a86b] transition-colors rounded-lg px-6 py-2">
                        <span className="font-['Inter',sans-serif] font-medium text-[14px] leading-5 text-white">
                          Start Trip
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-gray-100/50">
              <button className="w-full text-center font-['Inter',sans-serif] font-normal text-[14px] text-[#4a5565] hover:text-[#101828] transition-colors">
                View Details
              </button>
            </div>
          </div>

          {/* Upcoming Rides */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-['Inter',sans-serif] font-semibold text-[18px] leading-7 text-[#0a0a0a] tracking-[-0.4395px]">
                Upcoming Rides
              </h2>
              <Link to="/employee/trips">
                <button className="font-['Inter',sans-serif] font-medium text-[14px] text-[#155DFC] hover:text-[#0d47d1] transition-colors">
                  View All →
                </button>
              </Link>
            </div>

            <div className="space-y-3">
              {upcomingRides.slice(0, 2).map((ride) => (
                <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg px-2 py-1 inline-block mb-2">
                        <span className="font-['Inter',sans-serif] font-medium text-[12px] text-orange-700">
                          Scheduled
                        </span>
                      </div>
                      <p className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#101828]">
                        {ride.driverName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[12px] text-[#6a7282] mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ride.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>Westside → Tech Park Office</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-['Inter',sans-serif] font-medium text-[12px] text-[#00A63E]">
                      +{ride.co2Saved} kg CO₂ saved
                    </span>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                      <span className="font-['Inter',sans-serif] font-medium text-[12px] text-blue-700">
                        Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 3-Month Commute Calendar - Separate Heatmap Chart */}
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="font-['Inter',sans-serif] font-semibold text-[18px] leading-7 text-[#0a0a0a] tracking-[-0.4395px] mb-1">
                3-Month Commute Calendar
              </h2>
              <p className="font-['Inter',sans-serif] font-normal text-[12px] text-[#4a5565]">
                Visual overview of your daily commute patterns
              </p>
            </div>

            {/* Horizontal 3 Month Heatmap */}
            <div className="space-y-4 relative">
              {/* Tooltip */}
              {hoveredDay && (
                <div className="absolute z-50 bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-lg pointer-events-none"
                  style={{
                    left: '50%',
                    top: '-60px',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="font-['Inter',sans-serif] font-semibold mb-1">
                    {hoveredDay.month} - Day {hoveredDay.day}
                  </div>
                  {hoveredDay.mode && (
                    <div className="font-['Inter',sans-serif]">
                      <div className="capitalize">{hoveredDay.mode}</div>
                      {hoveredDay.distance && <div>{hoveredDay.distance} km</div>}
                    </div>
                  )}
                  {!hoveredDay.mode && (
                    <div className="font-['Inter',sans-serif] text-gray-300">No commute</div>
                  )}
                </div>
              )}

              {/* February 2026 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#101828]">February 2026</p>
                  <p className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">43.0 kg CO₂ saved</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(28)].map((_, i) => {
                    const day = i + 1;
                    const dayData = mockCommuteData.find(d => d.day === day);
                    
                    const modeColors = {
                      carpool: 'bg-[#00bc7d]',
                      bike: 'bg-[#00a872]',
                      bus: 'bg-[#009689]',
                      walk: 'bg-[#008573]',
                      drive: 'bg-[#6a7282]',
                      remote: 'bg-gray-300',
                    };
                    
                    return (
                      <div
                        key={day}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-all hover:scale-125 cursor-pointer ${
                          dayData
                            ? modeColors[dayData.mode]
                            : day === 19
                            ? 'border-2 border-[#00A63E] bg-white'
                            : 'bg-gray-100'
                        }`}
                        title={dayData ? `Day ${day}: ${dayData.mode} - ${dayData.distance}km` : `Day ${day}`}
                        onMouseEnter={() => setHoveredDay({ day, mode: dayData?.mode, distance: dayData?.distance, month: 'February 2026' })}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 px-0.5">
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">1</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">7</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">14</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">21</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">28</span>
                </div>
              </div>

              {/* January 2026 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#101828]">January 2026</p>
                  <p className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">45.2 kg CO₂ saved</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const hasCommute = [2, 5, 6, 8, 9, 12, 13, 15, 16, 19, 20, 22, 23, 26, 27, 29, 30].includes(day);
                    const modes: Array<'carpool' | 'bike' | 'bus' | 'walk' | 'drive' | 'remote'> = ['carpool', 'bike', 'bus', 'remote', 'drive'];
                    const randomMode = modes[day % modes.length];
                    
                    const modeColors = {
                      carpool: 'bg-[#00bc7d]',
                      bike: 'bg-[#00a872]',
                      bus: 'bg-[#009689]',
                      walk: 'bg-[#008573]',
                      drive: 'bg-[#6a7282]',
                      remote: 'bg-gray-300',
                    };
                    
                    return (
                      <div
                        key={day}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-all hover:scale-125 cursor-pointer ${
                          hasCommute ? modeColors[randomMode] : 'bg-gray-100'
                        }`}
                        title={hasCommute ? `Day ${day}: ${randomMode}` : `Day ${day}`}
                        onMouseEnter={() => setHoveredDay({ day, mode: randomMode, month: 'January 2026' })}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 px-0.5">
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">1</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">8</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">15</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">22</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">31</span>
                </div>
              </div>

              {/* December 2025 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-['Inter',sans-serif] font-medium text-[11px] text-[#101828]">December 2025</p>
                  <p className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">39.3 kg CO₂ saved</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(31)].map((_, i) => {
                    const day = i + 1;
                    const hasCommute = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19].includes(day);
                    const modes: Array<'carpool' | 'bike' | 'bus' | 'walk' | 'drive' | 'remote'> = ['carpool', 'bike', 'bus', 'remote', 'walk'];
                    const randomMode = modes[(day + 2) % modes.length];
                    
                    const modeColors = {
                      carpool: 'bg-[#00bc7d]',
                      bike: 'bg-[#00a872]',
                      bus: 'bg-[#009689]',
                      walk: 'bg-[#008573]',
                      drive: 'bg-[#6a7282]',
                      remote: 'bg-gray-300',
                    };
                    
                    return (
                      <div
                        key={day}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-all hover:scale-125 cursor-pointer ${
                          hasCommute ? modeColors[randomMode] : 'bg-gray-100'
                        }`}
                        title={hasCommute ? `Day ${day}: ${randomMode}` : `Day ${day}`}
                        onMouseEnter={() => setHoveredDay({ day, mode: randomMode, month: 'December 2025' })}
                        onMouseLeave={() => setHoveredDay(null)}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 px-0.5">
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">1</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">8</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">15</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">22</span>
                  <span className="font-['Inter',sans-serif] text-[9px] text-[#6a7282]">31</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="pt-4 border-t border-gray-100 mt-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#00bc7d] rounded"></div>
                  <span className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">Carpool</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#00a872] rounded"></div>
                  <span className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">Bike</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#009689] rounded"></div>
                  <span className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">Transit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#6a7282] rounded"></div>
                  <span className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">Drive</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#008573] rounded"></div>
                  <span className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">Walk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span className="font-['Inter',sans-serif] text-[10px] text-[#6a7282]">Remote</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-4">
          {/* Carbon Impact */}
          <div className="bg-[#f0fdf4] rounded-[14px] border border-[rgba(0,0,0,0.1)] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-[#00A63E]" />
              <h2 className="font-['Inter',sans-serif] font-semibold text-[18px] leading-7 text-[#0a0a0a] tracking-[-0.4395px]">
                Your Carbon Impact
              </h2>
            </div>
            
            <div className="mb-4">
              <p className="font-['Inter',sans-serif] font-bold text-[36px] leading-10 text-[#00A63E] mb-1">
                142.5 kg
              </p>
              <p className="font-['Inter',sans-serif] font-normal text-[14px] text-[#4a5565]">
                CO₂ saved this month
              </p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-['Inter',sans-serif] text-[12px] text-[#6a7282]">Monthly goal</span>
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#00A63E]">160 kg</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#00A63E] rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="font-['Inter',sans-serif] text-[12px] text-[#6a7282]">Trees equivalent</span>
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828]">7 trees</span>
              </div>
              <div className="flex justify-between">
                <span className="font-['Inter',sans-serif] text-[12px] text-[#6a7282]">Distance saved</span>
                <span className="font-['Inter',sans-serif] font-semibold text-[12px] text-[#101828]">385 km</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/employee/impact')}
              className="w-full bg-white border border-[rgba(0,0,0,0.1)] hover:bg-gray-50 transition-colors rounded-lg py-2"
            >
              <span className="font-['Inter',sans-serif] font-medium text-[14px] text-[#0a0a0a]">
                View Full Report
              </span>
            </button>
          </div>

          {/* Green Champion Badge */}
          <div 
            className="rounded-[14px] border border-[#fff085] p-6 text-center relative"
            style={{ backgroundImage: "linear-gradient(152.288deg, rgb(10, 10, 10) 0%, rgb(0, 153, 102) 100%)" }}
          >
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-[#096] to-[#00bc7d] rounded-full px-6 py-3 mb-4">
              <Award className="w-6 h-6 text-white mr-2" />
              <span className="font-['Inter',sans-serif] font-semibold text-[20px] text-white">
                Green Champion!
              </span>
            </div>
            <p className="font-['Inter',sans-serif] font-normal text-[16px] text-white leading-[32px]">
              You're in the top 10% of drivers<br />
              saving CO₂ this month
            </p>
          </div>

          {/* Monthly Impact Chart */}
          <Card className="p-6">
            <h2 className="font-['Inter',sans-serif] font-semibold text-[18px] leading-7 text-[#0a0a0a] mb-4">
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
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="font-['Inter',sans-serif] text-[12px] text-green-800">
                <strong>Great job!</strong> You've saved 21.3 kg CO₂ this month, equivalent to planting 1.2 trees.
              </p>
            </div>
          </Card>

          {/* Alert */}
          <div className="bg-white  rounded-[14px] border border-gray-300/50 p-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange-500 rounded-lg w-9 h-9 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-['Inter',sans-serif] font-semibold text-[14px] text-[#101828] mb-1">
                  Haven't logged today's commute yet
                </h3>
                <p className="font-['Inter',sans-serif] font-normal text-[12px] text-[#4a5565] mb-3">
                  Click to view all transport modes
                </p>
                <button 
                  onClick={() => setIsLogCommuteOpen(true)}
                  className="bg-orange-500 hover:bg-orange-600 transition-colors rounded-lg px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-white" />
                    <span className="font-['Inter',sans-serif] font-medium text-[12px] text-white">
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