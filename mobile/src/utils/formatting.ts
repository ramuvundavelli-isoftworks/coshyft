import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatDate(dateStr: string, fmt = 'dd MMM yyyy'): string {
  try { return format(parseISO(dateStr), fmt); } catch { return dateStr; }
}

export function formatDateTime(dateStr: string): string {
  try { return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm'); } catch { return dateStr; }
}

export function formatRelative(dateStr: string): string {
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }); } catch { return dateStr; }
}

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('en-IE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('en-IE', { style: 'currency', currency }).format(amount);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatEmissionKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} tCO₂e`;
  return `${kg.toFixed(3)} kg CO₂`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

export function truncate(str: string, max = 50): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}
