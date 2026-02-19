// Role definitions
export type Role = 'employee' | 'admin' | 'sustainability' | 'auditor' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
}

// Carpooling types
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

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface ExtendedRide {
  id: string;
  driver: string;
  driverId: string;
  origin: string;
  originLocation: Location;
  destination: string;
  destinationLocation: Location;
  departureTime: string;
  distance: number;
  seatsAvailable: number;
  co2Saved: number;
  matchScore: number;
  driverRating?: number;
  totalTrips?: number;
  vehicleType?: string;
  vehicleMake?: string;
  preferences?: CommutePreferences;
  preferencesTags?: string[];
  recurring?: boolean;
  daysOfWeek?: number[];
  verifiedDriver?: boolean;
  trustScore?: number;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  origin: string;
  destination: string;
  departureTime: string;
  filters: AdvancedFilters;
  notifyOnMatch: boolean;
  createdAt: Date;
}

export interface AdvancedFilters {
  maxDistance?: number;
  departureWindowStart?: string;
  departureWindowEnd?: string;
  minSeats?: number;
  minRating?: number;
  vehicleTypes?: string[];
  mustHavePreferences?: Partial<CommutePreferences>;
}

// Alert types
export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  linkedEntity?: string;
}

// Emission data types
export interface EmissionData {
  period: string;
  actual: number;
  forecast?: number;
  target?: number;
}

export interface ModeDistribution {
  mode: string;
  percentage: number;
  emissions: number;
  color: string;
}

export interface LocationPerformance {
  location: string;
  employees: number;
  participation: number;
  emissions: number;
  intensity: number;
  trend: number[];
}

// Risk types
export interface Risk {
  id: string;
  title: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  financialExposure: number;
  owner: string;
  status: 'open' | 'mitigating' | 'closed';
  linkedInitiative?: string;
}

// Initiative types
export interface Initiative {
  id: string;
  name: string;
  owner: string;
  budget: number;
  expectedReduction: number;
  actualReduction: number;
  status: 'draft' | 'pending' | 'approved' | 'active' | 'completed';
  startDate: string;
  endDate: string;
}

// Emission Factor types
export interface EmissionFactor {
  id: string;
  mode: string;
  kgCO2perKm: number;
  source: string;
  version: string;
  effectiveDate: string;
  approvalStatus: 'draft' | 'pending' | 'approved';
}

// Baseline types
export interface Baseline {
  year: number;
  emissions: number;
  offices: string[];
  legalEntities: string[];
  dataSource: string;
  emissionFactorVersion: string;
  locked: boolean;
  approvedBy?: string;
  approvedDate?: string;
}

// Scenario types
export interface Scenario {
  id: string;
  name: string;
  carpoolIncrease: number;
  remoteDays: number;
  evAdoption: number;
  emissionsReduced: number;
  roi: number;
  payback: number;
  created: string;
}

// Employee ride types
export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  passengers: string[];
  origin: string;
  destination: string;
  distance: number;
  co2Saved: number;
  date: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}