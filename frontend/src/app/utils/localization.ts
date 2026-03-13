// European & Irish Localization Utilities for enwayu platform

export type SupportedLocale = 'en-IE' | 'en-GB' | 'en-US' | 'ga-IE';
export type SupportedCurrency = 'EUR' | 'GBP' | 'USD';
export type SupportedRegion = 'IE' | 'GB' | 'US' | 'EU';

export interface LocaleConfig {
  code: SupportedLocale;
  name: string;
  flag: string;
  currency: SupportedCurrency;
  region: SupportedRegion;
  timeZone: string;
}

export const locales: Record<SupportedLocale, LocaleConfig> = {
  'en-IE': {
    code: 'en-IE',
    name: 'English (Ireland)',
    flag: '🇮🇪',
    currency: 'EUR',
    region: 'IE',
    timeZone: 'Europe/Dublin',
  },
  'en-GB': {
    code: 'en-GB',
    name: 'English (United Kingdom)',
    flag: '🇬🇧',
    currency: 'GBP',
    region: 'GB',
    timeZone: 'Europe/London',
  },
  'en-US': {
    code: 'en-US',
    name: 'English (United States)',
    flag: '🇺🇸',
    currency: 'USD',
    region: 'US',
    timeZone: 'America/New_York',
  },
  'ga-IE': {
    code: 'ga-IE',
    name: 'Gaeilge (Irish)',
    flag: '🇮🇪',
    currency: 'EUR',
    region: 'IE',
    timeZone: 'Europe/Dublin',
  },
};

// Default to Irish locale
export const defaultLocale: SupportedLocale = 'en-IE';

/**
 * Format date according to locale (DD/MM/YYYY for Europe, MM/DD/YYYY for US)
 */
export function formatDate(date: Date | string, locale: SupportedLocale = defaultLocale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  
  return formatter.format(dateObj);
}

/**
 * Format datetime with time (24-hour format for EU, 12-hour for US)
 */
export function formatDateTime(
  date: Date | string,
  locale: SupportedLocale = defaultLocale
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en-US', // 12-hour only for US
  });
  
  return formatter.format(dateObj);
}

/**
 * Format time only (24-hour format for EU)
 */
export function formatTime(time: string | Date, locale: SupportedLocale = defaultLocale): string {
  const dateObj = typeof time === 'string' ? new Date(`2000-01-01T${time}`) : time;
  
  const formatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: locale === 'en-US',
  });
  
  return formatter.format(dateObj);
}

/**
 * Format currency based on locale
 */
export function formatCurrency(
  amount: number,
  currency?: SupportedCurrency,
  locale: SupportedLocale = defaultLocale
): string {
  const currencyCode = currency || locales[locale].currency;
  
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
}

/**
 * Format currency with decimals
 */
export function formatCurrencyPrecise(
  amount: number,
  currency?: SupportedCurrency,
  locale: SupportedLocale = defaultLocale
): string {
  const currencyCode = currency || locales[locale].currency;
  
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
}

/**
 * Format numbers with locale-specific separators
 */
export function formatNumber(
  value: number,
  locale: SupportedLocale = defaultLocale,
  decimals: number = 0
): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  locale: SupportedLocale = defaultLocale,
  decimals: number = 1
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(value / 100);
}

/**
 * Format emissions (kg CO2e)
 */
export function formatEmissions(
  kgCO2: number,
  locale: SupportedLocale = defaultLocale
): string {
  if (kgCO2 >= 1000) {
    return `${formatNumber(kgCO2 / 1000, locale, 2)} tonnes CO₂e`;
  }
  return `${formatNumber(kgCO2, locale, 1)} kg CO₂e`;
}

/**
 * Format distance (km)
 */
export function formatDistance(km: number, locale: SupportedLocale = defaultLocale): string {
  return `${formatNumber(km, locale, 1)} km`;
}

/**
 * Convert USD to EUR (approximate - should use real exchange rates in production)
 */
export function convertUSDtoEUR(usd: number): number {
  const exchangeRate = 0.93; // Approximate as of Feb 2026
  return Math.round(usd * exchangeRate);
}

/**
 * Convert USD to GBP (approximate)
 */
export function convertUSDtoGBP(usd: number): number {
  const exchangeRate = 0.79; // Approximate as of Feb 2026
  return Math.round(usd * exchangeRate);
}

/**
 * Irish Public Holidays 2026
 */
export const irishPublicHolidays2026 = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-03-17', name: "St. Patrick's Day" },
  { date: '2026-04-06', name: 'Easter Monday' },
  { date: '2026-05-04', name: 'May Bank Holiday (First Monday in May)' },
  { date: '2026-06-01', name: 'June Bank Holiday (First Monday in June)' },
  { date: '2026-08-03', name: 'August Bank Holiday (First Monday in August)' },
  { date: '2026-10-26', name: 'October Bank Holiday (Last Monday in October)' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-26', name: "St. Stephen's Day" },
];

/**
 * Check if a date is an Irish public holiday
 */
export function isIrishPublicHoliday(date: Date | string): boolean {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  return irishPublicHolidays2026.some(holiday => holiday.date === dateStr);
}

/**
 * Get working days between two dates (excluding Irish public holidays)
 */
export function getWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    // Exclude weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isIrishPublicHoliday(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(
  date: Date | string,
  locale: SupportedLocale = defaultLocale
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffDay > 30) {
    return formatDate(dateObj, locale);
  } else if (diffDay > 0) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } else if (diffHour > 0) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
  } else if (diffMin > 0) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Get locale from browser or user preference
 */
export function detectLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return defaultLocale;
  
  const browserLang = navigator.language;
  
  // Check if browser language matches our supported locales
  if (browserLang.startsWith('en-IE') || browserLang.startsWith('ga')) {
    return 'en-IE';
  } else if (browserLang.startsWith('en-GB')) {
    return 'en-GB';
  } else if (browserLang.startsWith('en-US')) {
    return 'en-US';
  }
  
  // Default to Irish locale for European users
  return defaultLocale;
}

/**
 * GDPR-compliant date formatting for data retention
 */
export function calculateDataRetentionDate(
  createdDate: Date,
  retentionYears: number = 7
): Date {
  const retentionDate = new Date(createdDate);
  retentionDate.setFullYear(retentionDate.getFullYear() + retentionYears);
  return retentionDate;
}

/**
 * Format data retention notice
 */
export function formatDataRetentionNotice(
  createdDate: Date,
  retentionYears: number = 7,
  locale: SupportedLocale = defaultLocale
): string {
  const retentionDate = calculateDataRetentionDate(createdDate, retentionYears);
  return `Data will be retained until ${formatDate(retentionDate, locale)} (${retentionYears} years) in compliance with GDPR and Irish data protection regulations.`;
}
