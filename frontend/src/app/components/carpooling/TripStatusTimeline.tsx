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
                ? 'bg-success-subtle text-success'
                : statusInfo.color === 'blue'
                ? 'bg-info-subtle text-info'
                : statusInfo.color === 'yellow'
                ? 'bg-warning-subtle text-warning'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <span className="text-lg">{statusInfo.icon}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{statusInfo.label}</h3>
              <Badge
                variant={statusInfo.color === 'green' ? 'default' : 'secondary'}
                className={
                  statusInfo.color === 'green'
                    ? 'bg-success'
                    : statusInfo.color === 'blue'
                    ? 'bg-info'
                    : statusInfo.color === 'yellow'
                    ? 'bg-warning'
                    : 'bg-muted-foreground'
                }
              >
                {statusInfo.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{statusInfo.description}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-foreground mb-6">Trip Progress</h3>

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
                        ? 'bg-success-subtle border-success'
                        : isCurrent
                        ? 'bg-info-subtle border-info ring-4 ring-blue-100'
                        : 'bg-muted border-border'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : isCurrent ? (
                      <Circle className="h-5 w-5 text-info fill-info animate-pulse" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Connecting Line */}
                  {!isLast && (
                    <div
                      className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                        isCompleted ? 'bg-success' : 'bg-border'
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
                          ? 'text-info'
                          : isCompleted
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {status.label}
                    </p>
                    {isCurrent && (
                      <Badge className="bg-info">Current</Badge>
                    )}
                    {isCompleted && (
                      <span className="text-xs text-muted-foreground">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        Complete
                      </span>
                    )}
                  </div>
                  
                  {isCurrent && (
                    <p className="text-sm text-muted-foreground">
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
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Pickup & Dropoff Points
          </h4>
          <div className="space-y-3">
            {waypoints.map((waypoint, index) => (
              <div
                key={waypoint.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  waypoint.status === 'completed'
                    ? 'bg-success-subtle border-success/25'
                    : waypoint.status === 'arrived'
                    ? 'bg-warning-subtle border-warning/25'
                    : 'bg-background-subtle border-border'
                }`}
              >
                <div className="flex-shrink-0">
                  {waypoint.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : waypoint.status === 'arrived' ? (
                    <Clock className="h-5 w-5 text-warning animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">
                      {waypoint.type === 'pickup' ? '📍 Pickup' : '📍 Dropoff'}
                    </p>
                    {waypoint.passengerName && (
                      <Badge variant="outline" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        {waypoint.passengerName}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{waypoint.address}</p>
                  {waypoint.actualTime && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Completed at {waypoint.actualTime.toLocaleTimeString()}
                    </p>
                  )}
                  {waypoint.scheduledTime && !waypoint.actualTime && (
                    <p className="text-xs text-muted-foreground mt-1">
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
              ? 'bg-success-subtle border border-success/25'
              : statusInfo.color === 'blue'
              ? 'bg-info-subtle border border-info/25'
              : statusInfo.color === 'yellow'
              ? 'bg-warning-subtle border border-warning/25'
              : 'bg-background-subtle border border-border'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{statusInfo.icon}</span>
            <div className="flex-1">
              <p
                className={`font-semibold ${
                  statusInfo.color === 'green'
                    ? 'text-success'
                    : statusInfo.color === 'blue'
                    ? 'text-info'
                    : statusInfo.color === 'yellow'
                    ? 'text-warning'
                    : 'text-foreground'
                }`}
              >
                {statusInfo.label}
              </p>
              <p
                className={`text-sm ${
                  statusInfo.color === 'green'
                    ? 'text-success'
                    : statusInfo.color === 'blue'
                    ? 'text-info'
                    : statusInfo.color === 'yellow'
                    ? 'text-warning'
                    : 'text-foreground'
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
