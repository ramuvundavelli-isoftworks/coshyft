// Role definitions — mirrors frontend exactly
export type Role = 'employee' | 'admin' | 'sustainability' | 'auditor' | 'superadmin';
export type UserRole = Role;

export type SupportedLocale = 'en-IE' | 'en-GB' | 'en-US' | 'ga-IE';
export type SupportedCurrency = 'EUR' | 'GBP' | 'USD';
export type SupportedRegion = 'IE' | 'GB' | 'US' | 'NL' | 'DE' | 'FR' | 'EU';

export interface GDPRConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  dataSharingCarpooling: boolean;
  consentDate: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  locale?: SupportedLocale;
  region?: SupportedRegion;
  tenant_id?: string;
  tenant_name?: string;
  gdprConsent?: GDPRConsent;
}

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
  flexibleTiming: boolean;
  flexibleRadius: number;
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
  recurring?: boolean;
  daysOfWeek?: number[];
  verifiedDriver?: boolean;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  linkedEntity?: string;
}

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

export interface Risk {
  id: string;
  title: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  financialExposure: number;
  owner: string;
  status: 'open' | 'mitigating' | 'closed';
}

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

export interface EmissionFactor {
  id: string;
  mode: string;
  kgCO2perKm: number;
  source: string;
  version: string;
  region?: SupportedRegion;
  effectiveDate: string;
  approvalStatus: 'draft' | 'pending' | 'approved';
}

// Irish emission constants
export const EMISSION_FACTORS = {
  BUS: 0.089,
  RAIL: 0.025,
  EV: 0.053,
  PETROL_CAR: 0.168,
  WALK_CYCLE: 0.0,
  CARPOOL_2: 0.084,
  CARPOOL_3: 0.056,
  CARPOOL_4: 0.042,
} as const;

export const BASELINE_EMISSION_FACTOR = 0.168; // Solo petrol car (SEAI 2024)

// Navigation param types
export type RootStackParamList = {
  Auth: undefined;
  Employee: undefined;
  Sustainability: undefined;
  Admin: undefined;
  Auditor: undefined;
  SuperAdmin: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type EmployeeTabParamList = {
  Dashboard: undefined;
  LogCommute: undefined;
  FindRide: undefined;
  MyImpact: undefined;
  More: undefined;
};

export type EmployeeStackParamList = {
  EmployeeTabs: undefined;
  OfferRide: undefined;
  ActiveTrip: undefined;
  MyTrips: undefined;
  Rewards: undefined;
  RecurringRides: undefined;
  Messages: undefined;
  CommuteProfile: undefined;
  Settings: undefined;
};

export type SustainabilityTabParamList = {
  Overview: undefined;
  Emissions: undefined;
  Reports: undefined;
  Compliance: undefined;
  More: undefined;
};

export type AdminTabParamList = {
  Overview: undefined;
  Users: undefined;
  Rides: undefined;
  Settings: undefined;
};

export type AuditorTabParamList = {
  Overview: undefined;
  Review: undefined;
  Evidence: undefined;
  Reports: undefined;
};

export type SuperAdminTabParamList = {
  Dashboard: undefined;
  Tenants: undefined;
  System: undefined;
  Settings: undefined;
};
