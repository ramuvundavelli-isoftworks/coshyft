import { EMISSION_FACTORS, BASELINE_EMISSION_FACTOR } from '../types';

export function calculateEmissions(
  modeId: string,
  distanceKm: number,
  carpoolPassengers?: number,
): number {
  const factors: Record<string, number> = {
    bus: EMISSION_FACTORS.BUS,
    rail: EMISSION_FACTORS.RAIL,
    ev: EMISSION_FACTORS.EV,
    petrol_car: EMISSION_FACTORS.PETROL_CAR,
    diesel_car: 0.171,
    cycling: EMISSION_FACTORS.WALK_CYCLE,
    walking: EMISSION_FACTORS.WALK_CYCLE,
    remote: 0,
    carpool: carpoolPassengers && carpoolPassengers >= 2
      ? EMISSION_FACTORS.PETROL_CAR / carpoolPassengers
      : EMISSION_FACTORS.PETROL_CAR,
  };

  const factor = factors[modeId] ?? 0;
  return factor * distanceKm;
}

export function calculateCO2Saved(
  modeId: string,
  distanceKm: number,
  carpoolPassengers?: number,
): number {
  const actual = calculateEmissions(modeId, distanceKm, carpoolPassengers);
  const baseline = BASELINE_EMISSION_FACTOR * distanceKm;
  return Math.max(0, baseline - actual);
}

export function calculateOxyPoints(
  modeId: string,
  distanceKm: number,
): number {
  const rates: Record<string, number> = {
    bus: 8,
    rail: 12,
    ev: 6,
    cycling: 20,
    walking: 25,
    carpool: 10,
    petrol_car: 0,
    diesel_car: 0,
    remote: 5,
  };
  const rate = rates[modeId] ?? 0;
  return Math.round(rate * distanceKm);
}

export function formatEmissions(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} tCO₂e`;
  return `${kg.toFixed(3)} kg CO₂`;
}

export function emissionColor(kg: number, baseline: number): string {
  const pct = baseline > 0 ? (kg / baseline) * 100 : 100;
  if (pct <= 30) return '#10B981'; // green
  if (pct <= 70) return '#F59E0B'; // yellow
  return '#EF4444'; // red
}
