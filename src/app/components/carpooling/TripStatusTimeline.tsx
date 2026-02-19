import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  CheckCircle,
  Circle,
  Clock,
  MapPin,
  Navigation,
  Flag,
  User,
  AlertCircle,
} from 'lucide-react';
import { TripStatus, TripWaypoint } from '../../utils/tripTracking';
import { getTripStatusInfo } from '../../utils/tripTracking';

interface TripStatusTimelineProps {
  currentStatus: TripStatus['status'];
  waypoints: TripWaypoint[];
  compact?: boolean;
}

export default function TripStatusTimeline({
  currentStatus,
  waypoints,
  compact = false,
}: TripStatusTimelineProps) {
  const allStatuses: Array<{
    status: TripStatus['status'];
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      status: 'scheduled',
      label: 'Trip Scheduled',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      status: 'driver-on-way',
      label: 'Driver En Route',
      icon: <Navigation className="h-4 w-4" />,
    },
    {
      status: 'arrived-pickup',
      label: 'Arrived at Pickup',
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      status: 'in-progress',
      label: 'Trip In Progress',
      icon: <Navigation className="h-4 w-4" />,
    },
    {
      status: 'arriving-destination',
      label: 'Arriving Soon',
      icon: <Flag className="h-4 w-4" />,
    },
    {
      status: 'completed',
      label: 'Trip Completed',
      icon: <CheckCircle className="h-4 w-4" />,
    },
  ];

  const getCurrentStatusIndex = () => {
    return allStatuses.findIndex((s) => s.status === currentStatus);
  };

  const currentStatusIndex = getCurrentStatusIndex();
  const statusInfo = getTripStatusInfo(currentStatus);

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              statusInfo.color === 'green'
                ? 'bg-green-100 text-green-600'
                : statusInfo.color === 'blue'
                ? 'bg-blue-100 text-blue-600'
                : statusInfo.color === 'yellow'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span className="text-lg">{statusInfo.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{statusInfo.label}</h3>
              <Badge
                variant={statusInfo.color === 'green' ? 'default' : 'secondary'}
                className={
                  statusInfo.color === 'green'
                    ? 'bg-green-600'
                    : statusInfo.color === 'blue'
                    ? 'bg-blue-600'
                    : statusInfo.color === 'yellow'
                    ? 'bg-yellow-600'
                    : 'bg-gray-600'
                }
              >
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{statusInfo.description}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Trip Progress</h3>

      {/* Main Status Timeline */}
      <div className="space-y-4 mb-6">
        {allStatuses.map((status, index) => {
          const isCompleted = index < currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const isPending = index > currentStatusIndex;
          const isLast = index === allStatuses.length - 1;

          return (
            <div key={status.status} className="relative">
              <div className="flex items-start gap-4">
                {/* Timeline Icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-green-100 border-green-500'
                        : isCurrent
                        ? 'bg-blue-100 border-blue-500 ring-4 ring-blue-100'
                        : 'bg-gray-100 border-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : isCurrent ? (
                      <Circle className="h-5 w-5 text-blue-600 fill-blue-600 animate-pulse" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div
                      className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </div>

                {/* Status Info */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p
                      className={`font-medium ${
                        isCurrent
                          ? 'text-blue-900'
                          : isCompleted
                          ? 'text-gray-900'
                          : 'text-gray-500'
                      }`}
                    >
                      {status.label}
                    </p>
                    {isCurrent && (
                      <Badge className="bg-blue-600">Current</Badge>
                    )}
                    {isCompleted && (
                      <span className="text-xs text-gray-500">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Complete
                      </span>
                    )}
                  </div>
                  
                  {isCurrent && (
                    <p className="text-sm text-gray-600">
                      {getTripStatusInfo(status.status).description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Waypoints Section */}
      {waypoints.length > 0 && (
        <div className="pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Pickup & Dropoff Points
          </h4>
          <div className="space-y-3">
            {waypoints.map((waypoint, index) => (
              <div
                key={waypoint.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  waypoint.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : waypoint.status === 'arrived'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {waypoint.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : waypoint.status === 'arrived' ? (
                    <Clock className="h-5 w-5 text-yellow-600 animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {waypoint.type === 'pickup' ? '📍 Pickup' : '📍 Dropoff'}
                    </p>
                    {waypoint.passengerName && (
                      <Badge variant="outline" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        {waypoint.passengerName}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{waypoint.address}</p>
                  {waypoint.actualTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      Completed at {waypoint.actualTime.toLocaleTimeString()}
                    </p>
                  )}
                  {waypoint.scheduledTime && !waypoint.actualTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled for {waypoint.scheduledTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Status Card */}
      <div className="mt-6 pt-6 border-t">
        <div
          className={`p-4 rounded-lg ${
            statusInfo.color === 'green'
              ? 'bg-green-50 border border-green-200'
              : statusInfo.color === 'blue'
              ? 'bg-blue-50 border border-blue-200'
              : statusInfo.color === 'yellow'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{statusInfo.icon}</span>
            <div className="flex-1">
              <p
                className={`font-semibold ${
                  statusInfo.color === 'green'
                    ? 'text-green-900'
                    : statusInfo.color === 'blue'
                    ? 'text-blue-900'
                    : statusInfo.color === 'yellow'
                    ? 'text-yellow-900'
                    : 'text-gray-900'
                }`}
              >
                {statusInfo.label}
              </p>
              <p
                className={`text-sm ${
                  statusInfo.color === 'green'
                    ? 'text-green-700'
                    : statusInfo.color === 'blue'
                    ? 'text-blue-700'
                    : statusInfo.color === 'yellow'
                    ? 'text-yellow-700'
                    : 'text-gray-700'
                }`}
              >
                {statusInfo.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
