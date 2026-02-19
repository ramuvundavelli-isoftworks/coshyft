import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle,
  Circle,
  MoreHorizontal,
} from 'lucide-react';
import { GeneratedRide, RecurringRideTemplate } from '../../utils/recurringRides';
import { generateRidesFromTemplate } from '../../utils/recurringRides';

interface ScheduleCalendarViewProps {
  templates: RecurringRideTemplate[];
  onRideClick?: (ride: GeneratedRide) => void;
  onDateClick?: (date: Date) => void;
}

export default function ScheduleCalendarView({
  templates,
  onRideClick,
  onDateClick,
}: ScheduleCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Generate all rides for the current month
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  const allRides = templates.flatMap((template) => {
    const rides = generateRidesFromTemplate(template, firstDay, lastDay);
    return rides.map((ride) => ({ ...ride, template }));
  });

  // Group rides by date
  const ridesByDate = new Map<string, typeof allRides>();
  allRides.forEach((ride) => {
    const dateKey = ride.date.toDateString();
    if (!ridesByDate.has(dateKey)) {
      ridesByDate.set(dateKey, []);
    }
    ridesByDate.get(dateKey)!.push(ride);
  });

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === today.toDateString();
  };

  const isPast = (date: Date | null) => {
    if (!date) return false;
    return date < today;
  };

  const getRidesForDate = (date: Date | null) => {
    if (!date) return [];
    return ridesByDate.get(date.toDateString()) || [];
  };

  const getRideStatusColor = (status: GeneratedRide['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'scheduled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'skipped':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: GeneratedRide['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'in-progress':
        return <Circle className="h-3 w-3 fill-current animate-pulse" />;
      case 'cancelled':
      case 'skipped':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Circle className="h-3 w-3" />;
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1 border rounded-lg p-1 bg-white">
              <Button
                variant={viewMode === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Month
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Week
              </Button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
            <span className="text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-gray-600">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-700 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            const rides = getRidesForDate(date);
            const hasRides = rides.length > 0;
            const displayRides = rides.slice(0, 3);
            const moreCount = rides.length - 3;

            return (
              <div
                key={index}
                className={`min-h-[120px] border rounded-lg p-2 transition-all ${
                  !date
                    ? 'bg-gray-50 cursor-not-allowed'
                    : isToday(date)
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : isPast(date)
                    ? 'bg-gray-50'
                    : 'bg-white hover:bg-gray-50 cursor-pointer'
                }`}
                onClick={() => date && onDateClick && onDateClick(date)}
              >
                {date && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm font-semibold ${
                          isToday(date)
                            ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
                            : isPast(date)
                            ? 'text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {hasRides && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {rides.length}
                        </Badge>
                      )}
                    </div>

                    {/* Rides for this day */}
                    <div className="space-y-1">
                      {displayRides.map((ride) => (
                        <div
                          key={ride.id}
                          className={`text-xs p-1.5 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getRideStatusColor(
                            ride.status
                          )}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRideClick && onRideClick(ride);
                          }}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            {getStatusIcon(ride.status)}
                            <span className="font-medium truncate">
                              {ride.departureTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] opacity-80">
                            <MapPin className="h-2.5 w-2.5" />
                            <span className="truncate">{ride.template.name}</span>
                          </div>
                          {ride.isException && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 mt-0.5">
                              Modified
                            </Badge>
                          )}
                        </div>
                      ))}
                      {moreCount > 0 && (
                        <div className="text-[10px] text-gray-500 text-center py-1">
                          +{moreCount} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="p-4 border-t bg-gray-50">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{allRides.length}</p>
            <p className="text-xs text-gray-600">Total Rides</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {allRides.filter((r) => r.status === 'completed').length}
            </p>
            <p className="text-xs text-gray-600">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">
              {allRides.filter((r) => r.status === 'confirmed').length}
            </p>
            <p className="text-xs text-gray-600">Confirmed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-600">
              {allRides.filter((r) => r.status === 'scheduled').length}
            </p>
            <p className="text-xs text-gray-600">Scheduled</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
