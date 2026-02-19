import { ActiveTrip, GPSCoordinate, TripWaypoint, EmergencyContact } from '../utils/tripTracking';
import { geocodeAddress } from '../utils/carpoolMatching';
import { generateRoute, generateShareCode } from '../utils/tripTracking';

// Mock emergency contacts
export const mockEmergencyContacts: EmergencyContact[] = [
  {
    name: 'Jane Doe',
    relationship: 'Spouse',
    phoneNumber: '+1 (555) 123-4567',
  },
  {
    name: 'John Smith',
    relationship: 'Father',
    phoneNumber: '+1 (555) 987-6543',
  },
];

// Create mock GPS coordinates for pickup points
const downtownPickup: GPSCoordinate & { address: string } = {
  ...geocodeAddress('Downtown SF'),
  address: 'Downtown SF, 123 Market St',
};

const missionPickup: GPSCoordinate & { address: string } = {
  ...geocodeAddress('Mission District'),
  address: 'Mission District, 456 Valencia St',
};

const destination: GPSCoordinate & { address: string } = {
  ...geocodeAddress('San Francisco HQ'),
  address: 'San Francisco HQ, 789 Tech Blvd',
};

// Generate route
const fullRoute = generateRoute(downtownPickup, destination, 40);

// Create waypoints
const mockWaypoints: TripWaypoint[] = [
  {
    id: 'wp1',
    type: 'pickup',
    location: downtownPickup,
    address: downtownPickup.address,
    passengerId: 'p1',
    passengerName: 'Sarah Johnson',
    status: 'completed',
    scheduledTime: new Date(Date.now() - 15 * 60000), // 15 min ago
    actualTime: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'wp2',
    type: 'pickup',
    location: missionPickup,
    address: missionPickup.address,
    passengerId: 'p2',
    passengerName: 'Mike Chen',
    status: 'completed',
    scheduledTime: new Date(Date.now() - 10 * 60000), // 10 min ago
    actualTime: new Date(Date.now() - 9 * 60000), // 9 min ago
  },
  {
    id: 'wp3',
    type: 'destination',
    location: destination,
    address: destination.address,
    status: 'pending',
    scheduledTime: new Date(Date.now() + 15 * 60000), // In 15 min
  },
];

// Create active trip
export const mockActiveTrip: ActiveTrip = {
  id: 'trip-' + Date.now(),
  driverId: 'driver-001',
  driverName: 'Alice Johnson',
  vehicleInfo: 'Tesla Model 3 - Blue - ABC 1234',
  origin: downtownPickup,
  destination: destination,
  waypoints: mockWaypoints,
  passengers: [
    {
      id: 'p1',
      name: 'Sarah Johnson',
      pickupLocation: downtownPickup,
      dropoffLocation: destination,
      status: 'picked-up',
      phoneNumber: '+1 (555) 234-5678',
      emergencyContact: {
        name: 'Tom Johnson',
        relationship: 'Husband',
        phoneNumber: '+1 (555) 345-6789',
      },
    },
    {
      id: 'p2',
      name: 'Mike Chen',
      pickupLocation: missionPickup,
      dropoffLocation: destination,
      status: 'picked-up',
      phoneNumber: '+1 (555) 456-7890',
      emergencyContact: {
        name: 'Lisa Chen',
        relationship: 'Sister',
        phoneNumber: '+1 (555) 567-8901',
      },
    },
  ],
  status: {
    status: 'in-progress',
    currentLocation: fullRoute[Math.floor(fullRoute.length * 0.6)], // 60% through trip
    estimatedArrival: new Date(Date.now() + 15 * 60000), // 15 min from now
    distanceRemaining: 5.2,
    durationRemaining: 15,
    completionPercentage: 60,
  },
  departureTime: new Date(Date.now() - 20 * 60000), // 20 min ago
  estimatedArrival: new Date(Date.now() + 15 * 60000), // 15 min from now
  route: fullRoute,
  totalDistance: 12.3,
  co2Saved: 2.5,
  shareCode: generateShareCode(),
};

// Mock function to update trip status (for simulation)
export function updateTripProgress(trip: ActiveTrip, progressPercentage: number): ActiveTrip {
  const routeIndex = Math.floor((trip.route.length - 1) * (progressPercentage / 100));
  const currentLocation = trip.route[routeIndex];
  
  const distanceRemaining = trip.totalDistance * (1 - progressPercentage / 100);
  const durationRemaining = Math.round(distanceRemaining * 2); // Assume 2 min per km
  
  let status: typeof trip.status.status = 'in-progress';
  if (progressPercentage >= 95) {
    status = 'arriving-destination';
  } else if (progressPercentage >= 100) {
    status = 'completed';
  }
  
  return {
    ...trip,
    status: {
      ...trip.status,
      currentLocation,
      distanceRemaining,
      durationRemaining,
      completionPercentage: progressPercentage,
      status,
    },
  };
}
