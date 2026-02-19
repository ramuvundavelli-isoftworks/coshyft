// Trip Tracking & GPS Simulation Utilities

export interface GPSCoordinate {
  lat: number;
  lng: number;
  timestamp: Date;
  speed?: number; // km/h
  heading?: number; // degrees
}

export interface TripStatus {
  status: 'scheduled' | 'driver-on-way' | 'arrived-pickup' | 'in-progress' | 'arriving-destination' | 'completed' | 'cancelled';
  currentLocation?: GPSCoordinate;
  estimatedArrival?: Date;
  actualArrival?: Date;
  distanceRemaining?: number; // km
  durationRemaining?: number; // minutes
  completionPercentage?: number;
}

export interface TripWaypoint {
  id: string;
  type: 'pickup' | 'dropoff' | 'destination';
  location: GPSCoordinate;
  address: string;
  passengerId?: string;
  passengerName?: string;
  status: 'pending' | 'arrived' | 'completed' | 'skipped';
  scheduledTime?: Date;
  actualTime?: Date;
}

export interface ActiveTrip {
  id: string;
  driverId: string;
  driverName: string;
  vehicleInfo: string;
  origin: GPSCoordinate & { address: string };
  destination: GPSCoordinate & { address: string };
  waypoints: TripWaypoint[];
  passengers: TripPassenger[];
  status: TripStatus;
  departureTime: Date;
  estimatedArrival: Date;
  route: GPSCoordinate[];
  totalDistance: number;
  co2Saved: number;
  shareCode?: string;
}

export interface TripPassenger {
  id: string;
  name: string;
  pickupLocation: GPSCoordinate & { address: string };
  dropoffLocation: GPSCoordinate & { address: string };
  status: 'waiting' | 'picked-up' | 'dropped-off';
  phoneNumber?: string;
  emergencyContact?: EmergencyContact;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
}

export interface SafetyAlert {
  id: string;
  type: 'sos' | 'route-deviation' | 'long-stop' | 'speed-alert' | 'check-in-missed';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: GPSCoordinate;
  timestamp: Date;
  resolved: boolean;
}

/**
 * Generate a simulated GPS route between two points
 */
export function generateRoute(
  start: GPSCoordinate,
  end: GPSCoordinate,
  numPoints: number = 20
): GPSCoordinate[] {
  const route: GPSCoordinate[] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    const lat = start.lat + (end.lat - start.lat) * ratio;
    const lng = start.lng + (end.lng - start.lng) * ratio;
    
    // Add slight randomness to simulate real GPS drift
    const latNoise = (Math.random() - 0.5) * 0.0001;
    const lngNoise = (Math.random() - 0.5) * 0.0001;
    
    route.push({
      lat: lat + latNoise,
      lng: lng + lngNoise,
      timestamp: new Date(),
      speed: 40 + Math.random() * 20, // 40-60 km/h
      heading: calculateBearing(
        i > 0 ? route[i - 1] : start,
        { lat: lat + latNoise, lng: lng + lngNoise, timestamp: new Date() }
      ),
    });
  }
  
  return route;
}

/**
 * Calculate bearing between two GPS coordinates
 */
export function calculateBearing(from: GPSCoordinate, to: GPSCoordinate): number {
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const dLng = toRadians(to.lng - from.lng);
  
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  
  const bearing = Math.atan2(y, x);
  return (toDegrees(bearing) + 360) % 360;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 */
export function calculateDistance(from: GPSCoordinate, to: GPSCoordinate): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Simulate GPS location update along a route
 */
export class TripSimulator {
  private route: GPSCoordinate[];
  private currentIndex: number = 0;
  private intervalId?: NodeJS.Timeout;
  private updateCallback?: (location: GPSCoordinate, progress: number) => void;
  
  constructor(route: GPSCoordinate[]) {
    this.route = route;
  }
  
  start(updateIntervalMs: number = 2000, callback?: (location: GPSCoordinate, progress: number) => void) {
    this.updateCallback = callback;
    this.currentIndex = 0;
    
    this.intervalId = setInterval(() => {
      if (this.currentIndex < this.route.length) {
        const location = this.route[this.currentIndex];
        const progress = (this.currentIndex / (this.route.length - 1)) * 100;
        
        if (this.updateCallback) {
          this.updateCallback(location, progress);
        }
        
        this.currentIndex++;
      } else {
        this.stop();
      }
    }, updateIntervalMs);
  }
  
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
  
  pause() {
    this.stop();
  }
  
  resume(updateIntervalMs: number = 2000) {
    if (!this.intervalId && this.currentIndex < this.route.length) {
      this.start(updateIntervalMs, this.updateCallback);
    }
  }
  
  getCurrentLocation(): GPSCoordinate | null {
    return this.currentIndex > 0 && this.currentIndex <= this.route.length
      ? this.route[this.currentIndex - 1]
      : null;
  }
  
  getProgress(): number {
    return this.route.length > 0
      ? (this.currentIndex / (this.route.length - 1)) * 100
      : 0;
  }
}

/**
 * Calculate ETA based on current location and destination
 */
export function calculateETA(
  currentLocation: GPSCoordinate,
  destination: GPSCoordinate,
  averageSpeed: number = 50 // km/h
): Date {
  const distance = calculateDistance(currentLocation, destination);
  const hours = distance / averageSpeed;
  const minutes = hours * 60;
  
  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + minutes);
  
  return eta;
}

/**
 * Detect if vehicle has deviated from expected route
 */
export function detectRouteDeviation(
  currentLocation: GPSCoordinate,
  expectedRoute: GPSCoordinate[],
  thresholdKm: number = 0.5
): boolean {
  // Find closest point on route
  let minDistance = Infinity;
  
  for (const point of expectedRoute) {
    const distance = calculateDistance(currentLocation, point);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }
  
  return minDistance > thresholdKm;
}

/**
 * Format time remaining in human-readable format
 */
export function formatTimeRemaining(minutes: number): string {
  if (minutes < 1) {
    return 'Arriving now';
  } else if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

/**
 * Generate a shareable trip code
 */
export function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generate share link for trip tracking
 */
export function generateShareLink(tripId: string, shareCode: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/track/${tripId}?code=${shareCode}`;
}

/**
 * Check if driver has been stationary for too long
 */
export function detectLongStop(
  recentLocations: GPSCoordinate[],
  thresholdMinutes: number = 10,
  radiusMeters: number = 50
): boolean {
  if (recentLocations.length < 2) return false;
  
  const firstLocation = recentLocations[0];
  const lastLocation = recentLocations[recentLocations.length - 1];
  
  const distance = calculateDistance(firstLocation, lastLocation) * 1000; // Convert to meters
  const timeDiff = (lastLocation.timestamp.getTime() - firstLocation.timestamp.getTime()) / 60000; // Minutes
  
  return distance < radiusMeters && timeDiff > thresholdMinutes;
}

/**
 * Calculate trip statistics
 */
export function calculateTripStats(trip: ActiveTrip): {
  distanceTraveled: number;
  timeElapsed: number;
  averageSpeed: number;
  estimatedTimeRemaining: number;
  onTimeStatus: 'early' | 'on-time' | 'delayed';
} {
  const currentLocation = trip.status.currentLocation;
  const startTime = trip.departureTime;
  const now = new Date();
  
  const timeElapsed = (now.getTime() - startTime.getTime()) / 60000; // minutes
  const distanceTraveled = currentLocation
    ? calculateDistance(trip.origin, currentLocation)
    : 0;
  
  const averageSpeed = timeElapsed > 0 ? (distanceTraveled / timeElapsed) * 60 : 0;
  
  const distanceRemaining = trip.status.distanceRemaining || 0;
  const estimatedTimeRemaining = averageSpeed > 0
    ? (distanceRemaining / averageSpeed) * 60
    : trip.status.durationRemaining || 0;
  
  const expectedArrival = new Date(startTime.getTime() + timeElapsed + estimatedTimeRemaining * 60000);
  const scheduledArrival = trip.estimatedArrival;
  const delayMinutes = (expectedArrival.getTime() - scheduledArrival.getTime()) / 60000;
  
  let onTimeStatus: 'early' | 'on-time' | 'delayed' = 'on-time';
  if (delayMinutes < -5) onTimeStatus = 'early';
  else if (delayMinutes > 5) onTimeStatus = 'delayed';
  
  return {
    distanceTraveled,
    timeElapsed,
    averageSpeed,
    estimatedTimeRemaining,
    onTimeStatus,
  };
}

/**
 * Get trip status display info
 */
export function getTripStatusInfo(status: TripStatus['status']): {
  label: string;
  color: string;
  icon: string;
  description: string;
} {
  const statusMap = {
    scheduled: {
      label: 'Scheduled',
      color: 'blue',
      icon: '📅',
      description: 'Trip is scheduled and confirmed',
    },
    'driver-on-way': {
      label: 'Driver En Route',
      color: 'yellow',
      icon: '🚗',
      description: 'Driver is on the way to pick you up',
    },
    'arrived-pickup': {
      label: 'Driver Arrived',
      color: 'green',
      icon: '📍',
      description: 'Driver has arrived at pickup location',
    },
    'in-progress': {
      label: 'Trip In Progress',
      color: 'blue',
      icon: '🛣️',
      description: 'Trip is currently in progress',
    },
    'arriving-destination': {
      label: 'Arriving Soon',
      color: 'green',
      icon: '🏁',
      description: 'Approaching destination',
    },
    completed: {
      label: 'Completed',
      color: 'green',
      icon: '✅',
      description: 'Trip completed successfully',
    },
    cancelled: {
      label: 'Cancelled',
      color: 'red',
      icon: '❌',
      description: 'Trip was cancelled',
    },
  };
  
  return statusMap[status] || statusMap.scheduled;
}
