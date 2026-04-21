import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Progress } from '../components/ui/progress';
import {
  AlertTriangle,
  Share2,
  Phone,
  MessageCircle,
  Navigation,
  Clock,
  MapPin,
  Users,
  Car,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { ActiveTrip as ActiveTripType } from '../utils/tripTracking';
import { calculateTripStats, formatTimeRemaining } from '../utils/tripTracking';
import LiveTripMap from '../components/carpooling/LiveTripMap';
import TripStatusTimeline from '../components/carpooling/TripStatusTimeline';
import SOSEmergencyModal from '../components/carpooling/SOSEmergencyModal';
import ShareTripModal from '../components/carpooling/ShareTripModal';
import { useApi } from '../api';
import { carpoolingApi } from '../api';

export default function ActiveTrip() {
  const navigate = useNavigate();
  const { data: activeTripData, loading: tripLoading } = useApi(() => carpoolingApi.getActiveTrip());
  const trip: ActiveTripType | null = (activeTripData as any) ?? null;
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Keep useEffect for cleanup only
  useEffect(() => {
    return () => {};
  }, []);

  // Placeholder handlers (no GPS simulator in production)
  const isSimulating = false;
  const simulator = null;
  const startSimulation = () => { toast.info('GPS tracking not available in this environment.'); };
  const stopSimulation = () => {};

  if (tripLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Active Trip</h1>
        </div>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Loading trip data...</p>
        </Card>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Active Trip</h1>
        </div>
        <Card className="p-12 text-center">
          <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Active Trip</h2>
          <p className="text-muted-foreground mb-4">You don't have an active trip right now. Find a ride or offer one to get started.</p>
          <Button onClick={() => navigate('/employee/find-ride')}>Find a Ride</Button>
        </Card>
      </div>
    );
  }

  const stats = calculateTripStats(trip);
  const currentLocation = trip.status.currentLocation || trip.origin;

  const handleCall = (phoneNumber: string, name: string) => {
    toast.info(`Calling ${name}...`, {
      description: phoneNumber,
    });
  };

  const handleMessage = (name: string) => {
    toast.info(`Opening message to ${name}...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Active Trip</h1>
            <p className="text-muted-foreground mt-1">
              Live tracking and trip management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="default"
            className="bg-success text-white animate-pulse"
          >
            <div className="h-2 w-2 bg-card rounded-full mr-2"></div>
            Live
          </Badge>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsSOSOpen(true)}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            SOS Emergency
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Trip
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progress</span>
            <TrendingUp className="h-4 w-4 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {Math.round(trip.status.completionPercentage || 0)}%
          </p>
          <Progress
            value={trip.status.completionPercentage || 0}
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">ETA</span>
            <Clock className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatTimeRemaining(trip.status.durationRemaining || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {trip.status.estimatedArrival?.toLocaleTimeString()}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Distance Left</span>
            <MapPin className="h-4 w-4 text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {trip.status.distanceRemaining?.toFixed(1)} km
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            of {trip.totalDistance} km total
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">CO₂ Saved</span>
            <Navigation className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">
            {trip.co2Saved.toFixed(1)} kg
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            vs. driving alone
          </p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Map and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Map */}
          <LiveTripMap
            currentLocation={currentLocation}
            origin={trip.origin}
            destination={trip.destination}
            waypoints={trip.waypoints}
            route={trip.route}
            progress={trip.status.completionPercentage || 0}
            showRoute={true}
          />

          {/* Trip Status Timeline */}
          <TripStatusTimeline
            currentStatus={trip.status.status}
            waypoints={trip.waypoints}
          />

          {/* Trip Statistics */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-info" />
              Trip Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Distance Traveled</p>
                <p className="text-lg font-semibold text-foreground">
                  {stats.distanceTraveled.toFixed(1)} km
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time Elapsed</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.round(stats.timeElapsed)} min
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Speed</p>
                <p className="text-lg font-semibold text-foreground">
                  {Math.round(stats.averageSpeed)} km/h
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">On-Time Status</p>
                <Badge
                  variant={
                    stats.onTimeStatus === 'on-time'
                      ? 'default'
                      : stats.onTimeStatus === 'early'
                      ? 'secondary'
                      : 'destructive'
                  }
                  className={
                    stats.onTimeStatus === 'on-time'
                      ? 'bg-success'
                      : stats.onTimeStatus === 'early'
                      ? 'bg-info'
                      : 'bg-warning'
                  }
                >
                  {stats.onTimeStatus === 'early'
                    ? 'Ahead'
                    : stats.onTimeStatus === 'on-time'
                    ? 'On Time'
                    : 'Delayed'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Trip Info and Actions */}
        <div className="space-y-6">
          {/* Driver Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Driver Information</h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold">
                  {trip.driverName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">
                  {trip.driverName}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="bg-info-subtle text-info">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="outline" className="bg-success-subtle text-success">
                    4.8 ⭐
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{trip.vehicleInfo}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleCall('+1 555-0123', trip.driverName)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleMessage(trip.driverName)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </Card>

          {/* Passengers */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">
                Passengers ({trip.passengers.length})
              </h3>
            </div>

            <div className="space-y-3">
              {trip.passengers.map((passenger) => (
                <div
                  key={passenger.id}
                  className="flex items-center justify-between p-3 bg-background-subtle rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm">
                        {passenger.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {passenger.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          passenger.status === 'picked-up'
                            ? 'bg-success-subtle text-success border-success/25'
                            : 'bg-warning-subtle text-warning border-warning/25'
                        }
                      >
                        {passenger.status === 'picked-up' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            On Board
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Waiting
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleCall(
                          passenger.phoneNumber || '',
                          passenger.name
                        )
                      }
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMessage(passenger.name)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Safety Actions */}
          <Card className="p-6 bg-destructive-subtle border-destructive/25">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold text-destructive">Safety & Help</h3>
            </div>

            <div className="space-y-2">
              <Button
                variant="destructive"
                className="w-full bg-destructive hover:bg-destructive"
                onClick={() => setIsSOSOpen(true)}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency SOS
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsShareOpen(true)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Live Location
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  toast.info('Opening support chat...')
                }
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>

            <div className="mt-4 p-3 bg-card backdrop-blur-md rounded-[14px] border border-border-subtle/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <p className="text-xs font-medium text-destructive mb-1">
                Emergency Contacts on File
              </p>
              <div className="space-y-1">
                {((trip as any)?.emergencyContacts ?? []).map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-foreground">
                      {contact.name} ({contact.relationship})
                    </span>
                    <span className="text-muted-foreground">{contact.phoneNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Route Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Route Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 bg-info rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Origin</span>
                </div>
                <p className="text-sm text-foreground ml-5">{trip.origin.address}</p>
              </div>

              {trip.waypoints
                .filter((wp) => wp.type !== 'destination')
                .map((waypoint) => (
                  <div key={waypoint.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-info rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">
                        {waypoint.type === 'pickup' ? 'Pickup' : 'Dropoff'} -{' '}
                        {waypoint.passengerName}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          waypoint.status === 'completed'
                            ? 'bg-success-subtle text-success'
                            : ''
                        }
                      >
                        {waypoint.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground ml-5">{waypoint.address}</p>
                  </div>
                ))}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 bg-success rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Destination</span>
                </div>
                <p className="text-sm text-foreground ml-5">{trip.destination.address}</p>
              </div>
            </div>
          </Card>

          {/* Simulation Controls */}
          <Card className="p-6 bg-info-subtle border-info/25">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-info" />
              <h3 className="font-semibold text-info">Live Simulation</h3>
            </div>
            <div className="flex gap-2">
              {!isSimulating ? (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={startSimulation}
                  disabled={!simulator}
                >
                  Start Tracking
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={stopSimulation}
                >
                  Pause Tracking
                </Button>
              )}
            </div>
            <p className="text-xs text-info mt-2">
              Demo mode: Simulating GPS updates every 2 seconds
            </p>
          </Card>
        </div>
      </div>

      {/* SOS Emergency Modal */}
      <SOSEmergencyModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        currentLocation={currentLocation}
        driverName={trip.driverName}
        driverPhone="+1 (555) 123-4567"
        passengers={trip.passengers.map((p) => ({
          name: p.name,
          phone: p.phoneNumber,
        }))}
        emergencyContacts={((trip as any)?.emergencyContacts ?? [])}
        tripId={trip.id}
      />

      {/* Share Trip Modal */}
      <ShareTripModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        tripId={trip.id}
        driverName={trip.driverName}
        origin={trip.origin.address}
        destination={trip.destination.address}
        departureTime={trip.departureTime.toLocaleTimeString()}
        estimatedArrival={trip.estimatedArrival.toLocaleTimeString()}
        existingShareCode={trip.shareCode}
      />
    </div>
  );
}