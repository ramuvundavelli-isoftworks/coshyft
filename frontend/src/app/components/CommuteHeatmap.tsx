import React from 'react';
import { Card } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Car, Bus, Bike, Footprints, Users, Home } from 'lucide-react';

interface CommuteDay {
  day: number;
  mode: 'carpool' | 'drive' | 'bus' | 'bike' | 'walk' | 'remote' | null;
  co2Saved?: number;
  distance?: number;
}

interface CommuteHeatmapProps {
  month: string;
  year: number;
  data: CommuteDay[];
}

const modeConfig = {
  carpool: {
    label: 'Carpool',
    color: 'bg-green-500',
    icon: Users,
    textColor: 'text-green-900',
  },
  drive: {
    label: 'Drive Alone',
    color: 'bg-orange-400',
    icon: Car,
    textColor: 'text-orange-900',
  },
  bus: {
    label: 'Public Transit',
    color: 'bg-blue-500',
    icon: Bus,
    textColor: 'text-blue-900',
  },
  bike: {
    label: 'Bike',
    color: 'bg-teal-500',
    icon: Bike,
    textColor: 'text-teal-900',
  },
  walk: {
    label: 'Walk',
    color: 'bg-purple-500',
    icon: Footprints,
    textColor: 'text-purple-900',
  },
  remote: {
    label: 'Work from Home',
    color: 'bg-gray-400',
    icon: Home,
    textColor: 'text-gray-900',
  },
};

export function CommuteHeatmap({ month, year, data }: CommuteHeatmapProps) {
  // Get days in month
  const daysInMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth() + 1, 0).getDate();
  const firstDay = new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 1).getDay();
  
  // Create calendar grid
  const weeks: (CommuteDay | null)[][] = [];
  let currentWeek: (CommuteDay | null)[] = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayData = data.find(d => d.day === day) || { day, mode: null };
    currentWeek.push(dayData);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  // Add remaining week if not complete
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  // Calculate mode statistics
  const modeStats = Object.keys(modeConfig).reduce((acc, mode) => {
    acc[mode as keyof typeof modeConfig] = data.filter(d => d.mode === mode).length;
    return acc;
  }, {} as Record<keyof typeof modeConfig, number>);

  const totalCO2Saved = data.reduce((sum, day) => sum + (day.co2Saved || 0), 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Monthly Commute Pattern</h2>
          <p className="text-sm text-gray-600">{month} {year}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{totalCO2Saved.toFixed(1)} kg</p>
          <p className="text-xs text-gray-600">CO₂ saved this month</p>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="mb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-2">
          {weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIdx) => {
                if (!day || !day.mode) {
                  return (
                    <div
                      key={dayIdx}
                      className="aspect-square rounded border border-gray-200 bg-gray-50 flex items-center justify-center"
                    >
                      {day && <span className="text-xs text-gray-400">{day.day}</span>}
                    </div>
                  );
                }

                const config = modeConfig[day.mode];
                const Icon = config.icon;

                return (
                  <TooltipProvider key={dayIdx}>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <div
                          className={`aspect-square rounded ${config.color} flex flex-col items-center justify-center cursor-help transition-transform hover:scale-105`}
                        >
                          <Icon className="h-4 w-4 text-white mb-0.5" />
                          <span className="text-xs font-medium text-white">{day.day}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-semibold mb-1">{month} {day.day}, {year}</p>
                          <p>{config.label}</p>
                          {day.distance && <p>Distance: {day.distance} km</p>}
                          {day.co2Saved && day.co2Saved > 0 && (
                            <p className="text-green-600 font-medium">
                              CO₂ saved: {day.co2Saved.toFixed(1)} kg
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t pt-4">
        <p className="text-xs font-medium text-gray-700 mb-3">Commute Modes</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(modeConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = modeStats[key as keyof typeof modeConfig];
            return (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded ${config.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{config.label}</p>
                  <p className="text-xs text-gray-600">{count} days</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
