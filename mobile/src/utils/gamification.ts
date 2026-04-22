export const LEVELS = [
  { level: 1, name: 'Eco Starter', minPoints: 0, maxPoints: 499 },
  { level: 2, name: 'Green Commuter', minPoints: 500, maxPoints: 1499 },
  { level: 3, name: 'Carbon Cutter', minPoints: 1500, maxPoints: 3499 },
  { level: 4, name: 'Sustainability Hero', minPoints: 3500, maxPoints: 7499 },
  { level: 5, name: 'Climate Champion', minPoints: 7500, maxPoints: 14999 },
  { level: 6, name: 'Net Zero Warrior', minPoints: 15000, maxPoints: Infinity },
] as const;

export function getLevel(points: number) {
  return LEVELS.find(l => points >= l.minPoints && points <= l.maxPoints) ?? LEVELS[0];
}

export function getLevelProgress(points: number): number {
  const level = getLevel(points);
  if (level.maxPoints === Infinity) return 1;
  const range = level.maxPoints - level.minPoints;
  const progress = points - level.minPoints;
  return Math.min(progress / range, 1);
}

export function getPointsToNextLevel(points: number): number {
  const level = getLevel(points);
  if (level.maxPoints === Infinity) return 0;
  return level.maxPoints - points + 1;
}

export const ACHIEVEMENTS = [
  { id: 'first_commute', title: 'First Step', description: 'Log your first commute', icon: '🚶', pointsRequired: 1, type: 'commute_count' },
  { id: 'streak_7', title: 'Week Warrior', description: '7-day commute streak', icon: '🔥', pointsRequired: 7, type: 'streak' },
  { id: 'streak_30', title: 'Monthly Maverick', description: '30-day commute streak', icon: '⚡', pointsRequired: 30, type: 'streak' },
  { id: 'co2_saved_100', title: 'Carbon Crusher', description: 'Save 100kg CO₂', icon: '🌿', pointsRequired: 100, type: 'co2_saved' },
  { id: 'carpool_10', title: 'Carpool King', description: '10 successful carpools', icon: '🚗', pointsRequired: 10, type: 'carpool_count' },
  { id: 'cyclist', title: 'Pedal Power', description: 'Cycle 50km total', icon: '🚴', pointsRequired: 50, type: 'cycle_distance' },
] as const;
