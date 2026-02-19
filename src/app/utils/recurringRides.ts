// Recurring Ride Schedule & Pattern Management Utilities

export type RecurrencePattern = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface RecurringRideTemplate {
  id: string;
  name: string;
  description?: string;
  origin: {
    address: string;
    lat: number;
    lng: number;
  };
  destination: {
    address: string;
    lat: number;
    lng: number;
  };
  departureTime: string; // HH:MM format
  pattern: RecurrencePattern;
  daysOfWeek?: DayOfWeek[]; // For weekly/biweekly patterns
  customDates?: Date[]; // For custom pattern
  startDate: Date;
  endDate?: Date; // null = indefinite
  seats: number;
  isDriver: boolean;
  preferences: RidePreferences;
  exceptions: ScheduleException[];
  autoAccept: boolean;
  notificationEnabled: boolean;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: Date;
  statistics: {
    totalRidesGenerated: number;
    totalRidesCompleted: number;
    totalCO2Saved: number;
    averagePassengers: number;
  };
}

export interface RidePreferences {
  allowSmoking: boolean;
  allowPets: boolean;
  musicPreference: 'quiet' | 'moderate' | 'any';
  conversationPreference: 'chatty' | 'moderate' | 'quiet';
  detourTolerance: number; // minutes
  maxPassengers: number;
}

export interface ScheduleException {
  id: string;
  date: Date;
  type: 'skip' | 'modified' | 'substitute';
  reason?: string;
  modifiedTime?: string;
  modifiedRoute?: {
    origin?: { address: string; lat: number; lng: number };
    destination?: { address: string; lat: number; lng: number };
  };
}

export interface GeneratedRide {
  id: string;
  templateId: string;
  date: Date;
  departureTime: string;
  origin: { address: string; lat: number; lng: number };
  destination: { address: string; lat: number; lng: number };
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'skipped';
  isException: boolean;
  passengers?: Array<{ id: string; name: string; status: string }>;
  matchedRideId?: string;
}

export interface ScheduleConflict {
  id: string;
  type: 'time-overlap' | 'location-conflict' | 'capacity-exceeded';
  severity: 'low' | 'medium' | 'high';
  affectedRides: string[];
  description: string;
  suggestions: string[];
}

/**
 * Generate rides based on recurring template
 */
export function generateRidesFromTemplate(
  template: RecurringRideTemplate,
  startDate: Date,
  endDate: Date
): GeneratedRide[] {
  const rides: GeneratedRide[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate && (!template.endDate || currentDate <= template.endDate)) {
    if (shouldGenerateRideForDate(template, currentDate)) {
      const exception = template.exceptions.find(
        (e) => e.date.toDateString() === currentDate.toDateString()
      );

      if (!exception || exception.type !== 'skip') {
        const ride: GeneratedRide = {
          id: `ride-${template.id}-${currentDate.getTime()}`,
          templateId: template.id,
          date: new Date(currentDate),
          departureTime: exception?.modifiedTime || template.departureTime,
          origin: exception?.modifiedRoute?.origin || template.origin,
          destination: exception?.modifiedRoute?.destination || template.destination,
          status: 'scheduled',
          isException: !!exception,
        };
        rides.push(ride);
      }
    }

    currentDate = getNextDate(currentDate, template.pattern);
  }

  return rides;
}

/**
 * Check if a ride should be generated for a specific date
 */
function shouldGenerateRideForDate(template: RecurringRideTemplate, date: Date): boolean {
  if (date < template.startDate || (template.endDate && date > template.endDate)) {
    return false;
  }

  switch (template.pattern) {
    case 'daily':
      return true;

    case 'weekly':
      if (!template.daysOfWeek || template.daysOfWeek.length === 0) return false;
      const dayOfWeek = getDayOfWeek(date);
      return template.daysOfWeek.includes(dayOfWeek);

    case 'biweekly':
      if (!template.daysOfWeek || template.daysOfWeek.length === 0) return false;
      const weeksSinceStart = Math.floor(
        (date.getTime() - template.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
      );
      const isCorrectWeek = weeksSinceStart % 2 === 0;
      return isCorrectWeek && template.daysOfWeek.includes(getDayOfWeek(date));

    case 'monthly':
      return date.getDate() === template.startDate.getDate();

    case 'custom':
      if (!template.customDates) return false;
      return template.customDates.some(
        (customDate) => customDate.toDateString() === date.toDateString()
      );

    default:
      return false;
  }
}

/**
 * Get next date based on pattern
 */
function getNextDate(currentDate: Date, pattern: RecurrencePattern): Date {
  const nextDate = new Date(currentDate);

  switch (pattern) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
    case 'biweekly':
    case 'custom':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }

  return nextDate;
}

/**
 * Get day of week from date
 */
function getDayOfWeek(date: Date): DayOfWeek {
  const days: DayOfWeek[] = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[date.getDay()];
}

/**
 * Detect conflicts between multiple ride templates
 */
export function detectScheduleConflicts(templates: RecurringRideTemplate[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const dateRange = 30; // Check next 30 days

  const today = new Date();
  const endDate = new Date(today.getTime() + dateRange * 24 * 60 * 60 * 1000);

  // Generate all rides for the period
  const allRides = templates.flatMap((template) =>
    generateRidesFromTemplate(template, today, endDate).map((ride) => ({
      ...ride,
      template,
    }))
  );

  // Group rides by date
  const ridesByDate = new Map<string, typeof allRides>();
  allRides.forEach((ride) => {
    const dateKey = ride.date.toDateString();
    if (!ridesByDate.has(dateKey)) {
      ridesByDate.set(dateKey, []);
    }
    ridesByDate.get(dateKey)!.push(ride);
  });

  // Check for conflicts on each date
  ridesByDate.forEach((rides, dateKey) => {
    if (rides.length > 1) {
      // Check time overlaps
      for (let i = 0; i < rides.length; i++) {
        for (let j = i + 1; j < rides.length; j++) {
          const ride1 = rides[i];
          const ride2 = rides[j];

          const time1 = parseTime(ride1.departureTime);
          const time2 = parseTime(ride2.departureTime);

          // Check if times are within 30 minutes of each other
          const timeDiff = Math.abs(time1 - time2);
          if (timeDiff < 30) {
            conflicts.push({
              id: `conflict-${Date.now()}-${i}-${j}`,
              type: 'time-overlap',
              severity: timeDiff < 15 ? 'high' : 'medium',
              affectedRides: [ride1.id, ride2.id],
              description: `Two rides scheduled within ${timeDiff} minutes on ${dateKey}`,
              suggestions: [
                'Adjust departure times',
                'Combine into a single ride',
                'Cancel one of the rides',
              ],
            });
          }
        }
      }
    }
  });

  return conflicts;
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Format time from minutes since midnight to HH:MM
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Calculate optimal departure time based on historical data
 */
export function suggestDepartureTime(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  desiredArrivalTime: string
): string {
  // Simplified - in production, use historical traffic data
  const arrivalMinutes = parseTime(desiredArrivalTime);
  const estimatedTravelTime = 30; // minutes (would be calculated based on route)
  const bufferTime = 10; // minutes

  const departureMinutes = arrivalMinutes - estimatedTravelTime - bufferTime;
  return formatTime(departureMinutes);
}

/**
 * Get human-readable schedule description
 */
export function getScheduleDescription(template: RecurringRideTemplate): string {
  const time = template.departureTime;

  switch (template.pattern) {
    case 'daily':
      return `Every day at ${time}`;

    case 'weekly':
      if (!template.daysOfWeek || template.daysOfWeek.length === 0) {
        return `Weekly at ${time}`;
      }
      const days = template.daysOfWeek.map((d) => capitalize(d)).join(', ');
      return `Every ${days} at ${time}`;

    case 'biweekly':
      if (!template.daysOfWeek || template.daysOfWeek.length === 0) {
        return `Bi-weekly at ${time}`;
      }
      const biweeklyDays = template.daysOfWeek.map((d) => capitalize(d)).join(', ');
      return `Every other ${biweeklyDays} at ${time}`;

    case 'monthly':
      const dayOfMonth = template.startDate.getDate();
      return `Monthly on day ${dayOfMonth} at ${time}`;

    case 'custom':
      return `Custom schedule at ${time}`;

    default:
      return `At ${time}`;
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calculate statistics for a template
 */
export function calculateTemplateStatistics(
  template: RecurringRideTemplate,
  rides: GeneratedRide[]
): RecurringRideTemplate['statistics'] {
  const completedRides = rides.filter((r) => r.status === 'completed');
  const totalPassengers = completedRides.reduce(
    (sum, ride) => sum + (ride.passengers?.length || 0),
    0
  );

  return {
    totalRidesGenerated: rides.length,
    totalRidesCompleted: completedRides.length,
    totalCO2Saved: completedRides.length * 2.5, // Simplified calculation
    averagePassengers: completedRides.length > 0 ? totalPassengers / completedRides.length : 0,
  };
}

/**
 * Check if a date is a holiday or special day
 */
export function isHoliday(date: Date): { isHoliday: boolean; name?: string } {
  // Simplified - in production, use a comprehensive holiday API/database
  const holidays = [
    { month: 0, day: 1, name: "New Year's Day" },
    { month: 6, day: 4, name: 'Independence Day' },
    { month: 11, day: 25, name: 'Christmas Day' },
  ];

  const holiday = holidays.find((h) => h.month === date.getMonth() && h.day === date.getDate());

  return {
    isHoliday: !!holiday,
    name: holiday?.name,
  };
}

/**
 * Batch update multiple templates
 */
export function batchUpdateTemplates(
  templates: RecurringRideTemplate[],
  updates: Partial<RecurringRideTemplate>
): RecurringRideTemplate[] {
  return templates.map((template) => ({
    ...template,
    ...updates,
  }));
}

/**
 * Clone a template with new dates
 */
export function cloneTemplate(
  template: RecurringRideTemplate,
  newStartDate: Date,
  newEndDate?: Date
): RecurringRideTemplate {
  return {
    ...template,
    id: `template-${Date.now()}`,
    startDate: newStartDate,
    endDate: newEndDate,
    statistics: {
      totalRidesGenerated: 0,
      totalRidesCompleted: 0,
      totalCO2Saved: 0,
      averagePassengers: 0,
    },
    createdAt: new Date(),
  };
}

/**
 * Validate template configuration
 */
export function validateTemplate(template: Partial<RecurringRideTemplate>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!template.name || template.name.trim() === '') {
    errors.push('Template name is required');
  }

  if (!template.origin?.address) {
    errors.push('Origin address is required');
  }

  if (!template.destination?.address) {
    errors.push('Destination address is required');
  }

  if (!template.departureTime || !/^\d{2}:\d{2}$/.test(template.departureTime)) {
    errors.push('Valid departure time (HH:MM) is required');
  }

  if (!template.startDate) {
    errors.push('Start date is required');
  }

  if (template.endDate && template.startDate && template.endDate < template.startDate) {
    errors.push('End date must be after start date');
  }

  if (template.pattern === 'weekly' || template.pattern === 'biweekly') {
    if (!template.daysOfWeek || template.daysOfWeek.length === 0) {
      errors.push('At least one day of week must be selected');
    }
  }

  if (template.pattern === 'custom') {
    if (!template.customDates || template.customDates.length === 0) {
      errors.push('At least one custom date must be specified');
    }
  }

  if (template.seats && (template.seats < 1 || template.seats > 8)) {
    errors.push('Seats must be between 1 and 8');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get upcoming rides for next N days
 */
export function getUpcomingRides(
  template: RecurringRideTemplate,
  days: number = 7
): GeneratedRide[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

  return generateRidesFromTemplate(template, today, endDate);
}

/**
 * Export template to JSON
 */
export function exportTemplate(template: RecurringRideTemplate): string {
  return JSON.stringify(template, null, 2);
}

/**
 * Import template from JSON
 */
export function importTemplate(json: string): RecurringRideTemplate | null {
  try {
    const template = JSON.parse(json);
    // Convert date strings back to Date objects
    template.startDate = new Date(template.startDate);
    if (template.endDate) template.endDate = new Date(template.endDate);
    template.createdAt = new Date(template.createdAt);
    template.exceptions = template.exceptions.map((e: any) => ({
      ...e,
      date: new Date(e.date),
    }));
    if (template.customDates) {
      template.customDates = template.customDates.map((d: any) => new Date(d));
    }
    return template;
  } catch (error) {
    return null;
  }
}
