// Role definitions
export type Role = 'employee' | 'admin' | 'sustainability' | 'auditor' | 'superadmin';

// Localization types
export type SupportedLocale = 'en-IE' | 'en-GB' | 'en-US' | 'ga-IE';
export type SupportedCurrency = 'EUR' | 'GBP' | 'USD';
export type SupportedRegion = 'IE' | 'GB' | 'US' | 'NL' | 'DE' | 'FR' | 'EU';

// GDPR types
export interface GDPRConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  dataSharingCarpooling: boolean;
  consentDate: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface DataRetentionPolicy {
  retentionYears: number;
  autoDeleteEnabled: boolean;
  deletionDate?: Date;
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'legitimate_interest';
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
  gdprConsent?: GDPRConsent;
  dataRetention?: DataRetentionPolicy;
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
  city?: string;
  country?: string;
  region?: SupportedRegion;
  employees: number;
  participation: number;
  emissions: number;
  intensity: number;
  trend: number[];
  publicTransportAccess?: 'Excellent' | 'Good' | 'Moderate' | 'Limited';
  parkingSpaces?: number;
  bikeParking?: number;
  evChargers?: number;
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
  region?: SupportedRegion;
  effectiveDate: string;
  approvalStatus: 'draft' | 'pending' | 'approved';
  methodology?: string;
  scopeCategory?: string;
  gridIntensity?: number; // For EVs - g CO2/kWh
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

// Irish Transport Modes
export interface IrishTransportMode {
  id: string;
  mode: string;
  operator: string | null;
  regions: string[];
  emissionFactor: number; // kg CO2/km
  category: 'public-transport' | 'active-transport' | 'car' | 'carpool' | 'other';
  taxRelief?: boolean; // TaxSaver eligible
  bikeToWorkScheme?: boolean;
}

// Irish Workplace Benefits
export interface IrishWorkplaceBenefit {
  id: string;
  name: string;
  description: string;
  category: 'bike-to-work' | 'taxsaver' | 'ev-incentive' | 'remote-work';
  region: 'IE';
  taxRelief?: number; // Percentage (e.g., 0.52 for 52%)
  maxAmount?: number; // Maximum benefit amount in EUR
  eligibleModes?: string[];
  status: 'active' | 'proposed' | 'expired';
  complianceRequired?: boolean;
  documentation?: string;
}

// GDPR Audit Log
export interface GDPRAuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: Role;
  action: 'view' | 'create' | 'update' | 'delete' | 'export' | 'approve' | 'reject' | 'consent_given' | 'consent_withdrawn';
  entityType: 'emission_factor' | 'baseline' | 'commute_entry' | 'personal_data' | 'report' | 'user_profile';
  entityId: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress?: string;
  gdprBasis?: 'consent' | 'contract' | 'legal_obligation' | 'legitimate_interest';
  dataRetentionDate?: Date;
  region?: SupportedRegion;
}