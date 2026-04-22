// Carpool Matching Algorithm Utilities

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface CommutePreferences {
  musicPreference: 'quiet' | 'music' | 'podcast' | 'no-preference';
  conversationLevel: 'chatty' | 'quiet' | 'no-preference';
  allowsPets: boolean;
  allowsSmoking: boolean;
  vehicleType: 'sedan' | 'suv' | 'electric' | 'hybrid' | 'any';
  temperaturePreference?: 'warm' | 'cool' | 'no-preference';
  flexibleTiming: boolean;
  flexibleRadius: number; // km
}

export interface MatchingCriteria {
  routeWeight: number; // 0-1
  timeWeight: number; // 0-1
  preferencesWeight: number; // 0-1
  ratingWeight: number; // 0-1
}

export interface RouteInfo {
  origin: Location;
  destination: Location;
  departureTime: string;
  distance: number;
}

const DEFAULT_MATCHING_CRITERIA: MatchingCriteria = {
  routeWeight: 0.4,
  timeWeight: 0.3,
  preferencesWeight: 0.2,
  ratingWeight: 0.1,
};

/**
 * Calculate distance between two geographic points using Haversine formula
 * @returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate route compatibility score (0-100)
 */
export function calculateRouteScore(
  userRoute: RouteInfo,
  rideRoute: RouteInfo,
  flexibleRadius: number = 5
): number {
  // Calculate distance between origins
  const originDistance = calculateDistance(
    userRoute.origin.lat,
    userRoute.origin.lng,
    rideRoute.origin.lat,
    rideRoute.origin.lng
  );

  // Calculate distance between destinations
  const destDistance = calculateDistance(
    userRoute.destination.lat,
    userRoute.destination.lng,
    rideRoute.destination.lat,
    rideRoute.destination.lng
  );

  // Score based on how close both origin and destination are
  const originScore = Math.max(0, 100 - (originDistance / flexibleRadius) * 100);
  const destScore = Math.max(0, 100 - (destDistance / flexibleRadius) * 100);

  // Average of both scores
  return (originScore + destScore) / 2;
}

/**
 * Calculate time compatibility score (0-100)
 */
export function calculateTimeScore(
  userTime: string,
  rideTime: string,
  flexibleMinutes: number = 30
): number {
  const userMinutes = timeToMinutes(userTime);
  const rideMinutes = timeToMinutes(rideTime);
  const timeDiff = Math.abs(userMinutes - rideMinutes);

  if (timeDiff === 0) return 100;
  if (timeDiff > flexibleMinutes * 2) return 0;

  return Math.max(0, 100 - (timeDiff / flexibleMinutes) * 50);
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Calculate preferences compatibility score (0-100)
 */
export function calculatePreferencesScore(
  userPrefs: CommutePreferences,
  ridePrefs: CommutePreferences
): number {
  let score = 0;
  let criteriaCount = 0;

  // Music preference (20 points)
  if (userPrefs.musicPreference === 'no-preference' || ridePrefs.musicPreference === 'no-preference') {
    score += 20;
  } else if (userPrefs.musicPreference === ridePrefs.musicPreference) {
    score += 20;
  } else if (
    (userPrefs.musicPreference === 'quiet' && ridePrefs.musicPreference !== 'music') ||
    (ridePrefs.musicPreference === 'quiet' && userPrefs.musicPreference !== 'music')
  ) {
    score += 10;
  }
  criteriaCount += 20;

  // Conversation level (20 points)
  if (userPrefs.conversationLevel === 'no-preference' || ridePrefs.conversationLevel === 'no-preference') {
    score += 20;
  } else if (userPrefs.conversationLevel === ridePrefs.conversationLevel) {
    score += 20;
  } else {
    score += 10;
  }
  criteriaCount += 20;

  // Pets (15 points)
  if (userPrefs.allowsPets === ridePrefs.allowsPets) {
    score += 15;
  } else if (!userPrefs.allowsPets && ridePrefs.allowsPets) {
    // Passenger doesn't want pets but driver allows them
    score += 0;
  } else {
    score += 7;
  }
  criteriaCount += 15;

  // Smoking (25 points - most important for safety/health)
  if (!userPrefs.allowsSmoking && !ridePrefs.allowsSmoking) {
    score += 25;
  } else if (userPrefs.allowsSmoking && ridePrefs.allowsSmoking) {
    score += 25;
  } else if (!userPrefs.allowsSmoking && ridePrefs.allowsSmoking) {
    score += 0; // Deal breaker for non-smokers
  } else {
    score += 15;
  }
  criteriaCount += 25;

  // Vehicle type (20 points)
  if (userPrefs.vehicleType === 'any' || ridePrefs.vehicleType === 'any') {
    score += 20;
  } else if (userPrefs.vehicleType === ridePrefs.vehicleType) {
    score += 20;
  } else if (
    (userPrefs.vehicleType === 'electric' || userPrefs.vehicleType === 'hybrid') &&
    (ridePrefs.vehicleType === 'electric' || ridePrefs.vehicleType === 'hybrid')
  ) {
    score += 15;
  } else {
    score += 10;
  }
  criteriaCount += 20;

  return score;
}

/**
 * Calculate overall compatibility score
 */
export function calculateCompatibilityScore(
  userRoute: RouteInfo,
  rideRoute: RouteInfo,
  userPrefs: CommutePreferences,
  ridePrefs: CommutePreferences,
  driverRating?: number,
  criteria: MatchingCriteria = DEFAULT_MATCHING_CRITERIA
): number {
  const routeScore = calculateRouteScore(userRoute, rideRoute, userPrefs.flexibleRadius);
  const timeScore = calculateTimeScore(
    userRoute.departureTime,
    rideRoute.departureTime,
    userPrefs.flexibleTiming ? 30 : 15
  );
  const prefsScore = calculatePreferencesScore(userPrefs, ridePrefs);
  const ratingScore = driverRating ? (driverRating / 5) * 100 : 80; // Default to 80 if no rating

  const overallScore =
    routeScore * criteria.routeWeight +
    timeScore * criteria.timeWeight +
    prefsScore * criteria.preferencesWeight +
    ratingScore * criteria.ratingWeight;

  return Math.round(overallScore);
}

/**
 * Get match quality label
 */
export function getMatchQuality(score: number): {
  label: string;
  color: string;
  description: string;
} {
  if (score >= 90) {
    return {
      label: 'Excellent Match',
      color: 'green',
      description: 'Highly compatible route and preferences',
    };
  } else if (score >= 80) {
    return {
      label: 'Great Match',
      color: 'green',
      description: 'Very good compatibility',
    };
  } else if (score >= 70) {
    return {
      label: 'Good Match',
      color: 'blue',
      description: 'Compatible with minor differences',
    };
  } else if (score >= 60) {
    return {
      label: 'Fair Match',
      color: 'yellow',
      description: 'Some compatibility concerns',
    };
  } else {
    return {
      label: 'Low Match',
      color: 'red',
      description: 'Limited compatibility',
    };
  }
}

/**
 * Filter rides by advanced criteria
 */
export interface AdvancedFilters {
  maxDistance?: number;
  departureWindowStart?: string;
  departureWindowEnd?: string;
  minSeats?: number;
  minRating?: number;
  vehicleTypes?: string[];
  mustHavePreferences?: Partial<CommutePreferences>;
}

export function applyAdvancedFilters<T extends { distance: number; departureTime: string; seatsAvailable: number; driverRating?: number; vehicleType?: string }>(
  rides: T[],
  filters: AdvancedFilters
): T[] {
  return rides.filter((ride) => {
    // Distance filter
    if (filters.maxDistance && ride.distance > filters.maxDistance) {
      return false;
    }

    // Time window filter
    if (filters.departureWindowStart || filters.departureWindowEnd) {
      const rideMinutes = timeToMinutes(ride.departureTime);
      if (filters.departureWindowStart) {
        const startMinutes = timeToMinutes(filters.departureWindowStart);
        if (rideMinutes < startMinutes) return false;
      }
      if (filters.departureWindowEnd) {
        const endMinutes = timeToMinutes(filters.departureWindowEnd);
        if (rideMinutes > endMinutes) return false;
      }
    }

    // Seats filter
    if (filters.minSeats && ride.seatsAvailable < filters.minSeats) {
      return false;
    }

    // Rating filter
    if (filters.minRating && ride.driverRating && ride.driverRating < filters.minRating) {
      return false;
    }

    // Vehicle type filter
    if (filters.vehicleTypes && filters.vehicleTypes.length > 0 && ride.vehicleType) {
      if (!filters.vehicleTypes.includes(ride.vehicleType)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Generate mock location data (for demo purposes)
 */
export function geocodeAddress(address: string): Location {
  // Mock geocoding - in production, use Google Maps API or similar
  const locations: Record<string, { lat: number; lng: number }> = {
    // Dublin / Ireland
    'Acme Dublin HQ': { lat: 53.3498, lng: -6.2603 },
    'Acme Dublin HQ, Dublin 2': { lat: 53.3498, lng: -6.2603 },
    'Dublin City Centre': { lat: 53.3498, lng: -6.2603 },
    'Dublin 2': { lat: 53.3340, lng: -6.2535 },
    'Griffith Avenue DART Stop, Dublin 9': { lat: 53.3736, lng: -6.2521 },
    'Griffith Avenue': { lat: 53.3736, lng: -6.2521 },
    'Sandyford': { lat: 53.2745, lng: -6.2157 },
    'Salthill Road, Galway': { lat: 53.2635, lng: -9.0850 },
    'Acme Galway Campus, Galway': { lat: 53.2707, lng: -9.0568 },
    'Acme Galway Campus': { lat: 53.2707, lng: -9.0568 },
    'Acme Cork Office, Cork': { lat: 51.8979, lng: -8.4706 },
    'Leopardstown': { lat: 53.2745, lng: -6.2157 },
    'Clonskeagh': { lat: 53.3047, lng: -6.2325 },
    'Ranelagh': { lat: 53.3250, lng: -6.2594 },
    // London / UK
    'London Office': { lat: 51.5074, lng: -0.1278 },
    'Canary Wharf': { lat: 51.5049, lng: -0.0236 },
    // Default (Dublin centre)
    'Home': { lat: 53.3498, lng: -6.2603 },
    'Work': { lat: 53.3340, lng: -6.2535 },
  };

  const coords = locations[address] || { lat: 53.3498, lng: -6.2603 };

  return {
    ...coords,
    address,
  };
}

/**
 * Calculate estimated CO2 savings
 */
export function calculateCO2Savings(distance: number, passengers: number = 1): number {
  // Average car emissions: 0.21 kg CO2 per km
  // Carpooling divides emissions by (passengers + driver)
  const soloEmissions = distance * 0.21;
  const carpoolEmissions = soloEmissions / (passengers + 1);
  const savings = soloEmissions - carpoolEmissions;
  return Math.round(savings * 10) / 10;
}
