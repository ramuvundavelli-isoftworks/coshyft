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
import { ActiveTrip as ActiveTripType, TripSimulator, GPSCoordinate } from '../utils/tripTracking';
import { mockActiveTrip, mockEmergencyContacts, updateTripProgress } from '../data/mockTripData';
import { calculateTripStats, formatTimeRemaining } from '../utils/tripTracking';
import LiveTripMap from '../components/carpooling/LiveTripMap';
import TripStatusTimeline from '../components/carpooling/TripStatusTimeline';
import SOSEmergencyModal from '../components/carpooling/SOSEmergencyModal';
import ShareTripModal from '../components/carpooling/ShareTripModal';

export default function ActiveTrip() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<ActiveTripType>(mockActiveTrip);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [simulator, setSimulator] = useState<TripSimulator | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize trip simulator
  useEffect(() => {
    const sim = new TripSimulator(trip.route);
    setSimulator(sim);

    return () => {
      sim.stop();
    };
  }, []);

  // Start live simulation
  const startSimulation = () => {
    if (simulator && !isSimulating) {
      setIsSimulating(true);
      simulator.start(2000, (location: GPSCoordinate, progress: number) => {
        setTrip((prevTrip) => updateTripProgress(prevTrip, progress));
      });
      toast.success('Live tracking started!');
    }
  };

  // Stop simulation
  const stopSimulation = () => {
    if (simulator && isSimulating) {
      simulator.stop();
      setIsSimulating(false);
      toast.info('Live tracking paused');
    }
  };

  // Auto-start simulation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startSimulation();
    }, 1000);

    return () => clearTimeout(timer);
  }, [simulator]);

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
            <h1 className="text-3xl font-bold text-gray-900">Active Trip</h1>
            <p className="text-gray-600 mt-1">
              Live tracking and trip management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="default"
            className="bg-green-600 text-white animate-pulse"
          >
            <div className="h-2 w-2 bg-white rounded-full mr-2"></div>
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
            <span className="text-sm text-gray-600">Progress</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(trip.status.completionPercentage || 0)}%
          </p>
          <Progress
            value={trip.status.completionPercentage || 0}
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">ETA</span>
            <Clock className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatTimeRemaining(trip.status.durationRemaining || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {trip.status.estimatedArrival?.toLocaleTimeString()}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Distance Left</span>
            <MapPin className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {trip.status.distanceRemaining?.toFixed(1)} km
          </p>
          <p className="text-xs text-gray-500 mt-1">
            of {trip.totalDistance} km total
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">CO₂ Saved</span>
            <Navigation className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">
            {trip.co2Saved.toFixed(1)} kg
          </p>
          <p className="text-xs text-gray-500 mt-1">
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
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Trip Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Distance Traveled</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.distanceTraveled.toFixed(1)} km
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Time Elapsed</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(stats.timeElapsed)} min
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Speed</p>
                <p className="text-lg font-semibold text-gray-900">
                  {Math.round(stats.averageSpeed)} km/h
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">On-Time Status</p>
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
                      ? 'bg-green-600'
                      : stats.onTimeStatus === 'early'
                      ? 'bg-blue-600'
                      : 'bg-yellow-600'
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
              <Car className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Driver Information</h3>
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
                <p className="font-semibold text-gray-900 text-lg">
                  {trip.driverName}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    4.8 ⭐
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{trip.vehicleInfo}</span>
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
              <Users className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Passengers ({trip.passengers.length})
              </h3>
            </div>

            <div className="space-y-3">
              {trip.passengers.map((passenger) => (
                <div
                  key={passenger.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                      <p className="font-medium text-gray-900 text-sm">
                        {passenger.name}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          passenger.status === 'picked-up'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
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
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-900">Safety & Help</h3>
            </div>

            <div className="space-y-2">
              <Button
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700"
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

            <div className="mt-4 p-3 bg-white rounded border border-red-200">
              <p className="text-xs font-medium text-red-900 mb-1">
                Emergency Contacts on File
              </p>
              <div className="space-y-1">
                {mockEmergencyContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-700">
                      {contact.name} ({contact.relationship})
                    </span>
                    <span className="text-gray-500">{contact.phoneNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Route Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Route Details</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Origin</span>
                </div>
                <p className="text-sm text-gray-900 ml-5">{trip.origin.address}</p>
              </div>

              {trip.waypoints
                .filter((wp) => wp.type !== 'destination')
                .map((waypoint) => (
                  <div key={waypoint.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">
                        {waypoint.type === 'pickup' ? 'Pickup' : 'Dropoff'} -{' '}
                        {waypoint.passengerName}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          waypoint.status === 'completed'
                            ? 'bg-green-50 text-green-700'
                            : ''
                        }
                      >
                        {waypoint.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-900 ml-5">{waypoint.address}</p>
                  </div>
                ))}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Destination</span>
                </div>
                <p className="text-sm text-gray-900 ml-5">{trip.destination.address}</p>
              </div>
            </div>
          </Card>

          {/* Simulation Controls */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Live Simulation</h3>
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
            <p className="text-xs text-blue-700 mt-2">
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
        emergencyContacts={mockEmergencyContacts}
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
