// Gamification System - Points, Achievements, Leaderboards

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  points: number;
  pointsToNextLevel: number;
  totalCO2Saved: number;
  totalRides: number;
  achievements: Achievement[];
  badges: Badge[];
  streak: number;
  longestStreak: number;
  rank: number;
  tier: UserTier;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'rides' | 'co2' | 'social' | 'streak' | 'special';
  requirement: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  startDate: Date;
  endDate: Date;
  goal: number;
  progress: number;
  reward: {
    points: number;
    badge?: string;
  };
  status: 'active' | 'completed' | 'expired';
  participants: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  change: number; // Position change from last period
  badge?: string;
  tier: UserTier;
}

export type LeaderboardType = 'points' | 'co2' | 'rides' | 'streak';
export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all-time';
export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface ActivityEvent {
  id: string;
  type: 'ride_completed' | 'achievement_unlocked' | 'level_up' | 'streak_milestone' | 'challenge_completed';
  timestamp: Date;
  points: number;
  description: string;
  metadata?: any;
}

/**
 * Points system configuration
 */
export const POINTS_CONFIG = {
  RIDE_COMPLETED: 10,
  CARPOOL_DRIVER: 15,
  CARPOOL_PASSENGER: 10,
  PUBLIC_TRANSIT: 8,
  BIKE: 12,
  WALK: 15,
  STREAK_BONUS_PER_DAY: 2,
  FIRST_RIDE_OF_DAY: 5,
  SHARE_RIDE: 20,
  RATE_DRIVER: 3,
  REFER_FRIEND: 50,
  ACHIEVEMENT_MULTIPLIER: {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3,
  },
};

/**
 * Level thresholds (points required for each level)
 */
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1500, 2500, 4000, 6000, 8500,
  12000, 16000, 20000, 25000, 30000, 40000, 50000, 65000, 80000, 100000,
];

/**
 * Tier thresholds
 */
export const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 500,
  gold: 2000,
  platinum: 5000,
  diamond: 10000,
};

/**
 * Calculate user level from points
 */
export function calculateLevel(points: number): { level: number; pointsToNext: number } {
  let level = 1;
  
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const pointsToNext = nextThreshold - points;
  
  return { level, pointsToNext };
}

/**
 * Calculate user tier from points
 */
export function calculateTier(points: number): UserTier {
  if (points >= TIER_THRESHOLDS.diamond) return 'diamond';
  if (points >= TIER_THRESHOLDS.platinum) return 'platinum';
  if (points >= TIER_THRESHOLDS.gold) return 'gold';
  if (points >= TIER_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

/**
 * Calculate points for a ride
 */
export function calculateRidePoints(
  mode: string,
  isDriver: boolean,
  passengers: number,
  streak: number
): number {
  let basePoints = 0;
  
  switch (mode.toLowerCase()) {
    case 'carpool':
      basePoints = isDriver ? POINTS_CONFIG.CARPOOL_DRIVER : POINTS_CONFIG.CARPOOL_PASSENGER;
      // Bonus for full car
      if (isDriver && passengers >= 3) basePoints += 5;
      break;
    case 'public transit':
      basePoints = POINTS_CONFIG.PUBLIC_TRANSIT;
      break;
    case 'bike':
      basePoints = POINTS_CONFIG.BIKE;
      break;
    case 'walk':
      basePoints = POINTS_CONFIG.WALK;
      break;
    default:
      basePoints = POINTS_CONFIG.RIDE_COMPLETED;
  }
  
  // Streak bonus
  const streakBonus = Math.min(streak, 7) * POINTS_CONFIG.STREAK_BONUS_PER_DAY;
  
  return basePoints + streakBonus;
}

/**
 * Default achievements
 */
export const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'progress' | 'isUnlocked'>[] = [
  {
    id: 'ach-first-ride',
    name: 'First Steps',
    description: 'Complete your first carpool ride',
    icon: '🚗',
    category: 'rides',
    requirement: 1,
    points: 50,
    rarity: 'common',
  },
  {
    id: 'ach-10-rides',
    name: 'Regular Rider',
    description: 'Complete 10 carpool rides',
    icon: '🎯',
    category: 'rides',
    requirement: 10,
    points: 100,
    rarity: 'common',
  },
  {
    id: 'ach-50-rides',
    name: 'Carpool Champion',
    description: 'Complete 50 carpool rides',
    icon: '🏆',
    category: 'rides',
    requirement: 50,
    points: 500,
    rarity: 'rare',
  },
  {
    id: 'ach-100-rides',
    name: 'Century Club',
    description: 'Complete 100 carpool rides',
    icon: '💯',
    category: 'rides',
    requirement: 100,
    points: 1000,
    rarity: 'epic',
  },
  {
    id: 'ach-500-rides',
    name: 'Legendary Commuter',
    description: 'Complete 500 carpool rides',
    icon: '👑',
    category: 'rides',
    requirement: 500,
    points: 5000,
    rarity: 'legendary',
  },
  {
    id: 'ach-50kg-co2',
    name: 'Carbon Cutter',
    description: 'Save 50 kg of CO₂',
    icon: '🌱',
    category: 'co2',
    requirement: 50,
    points: 200,
    rarity: 'common',
  },
  {
    id: 'ach-250kg-co2',
    name: 'Eco Warrior',
    description: 'Save 250 kg of CO₂',
    icon: '🌿',
    category: 'co2',
    requirement: 250,
    points: 750,
    rarity: 'rare',
  },
  {
    id: 'ach-1000kg-co2',
    name: 'Planet Protector',
    description: 'Save 1,000 kg (1 ton) of CO₂',
    icon: '🌍',
    category: 'co2',
    requirement: 1000,
    points: 2500,
    rarity: 'epic',
  },
  {
    id: 'ach-5000kg-co2',
    name: 'Climate Hero',
    description: 'Save 5,000 kg (5 tons) of CO₂',
    icon: '🦸',
    category: 'co2',
    requirement: 5000,
    points: 10000,
    rarity: 'legendary',
  },
  {
    id: 'ach-7-day-streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day carpool streak',
    icon: '🔥',
    category: 'streak',
    requirement: 7,
    points: 150,
    rarity: 'common',
  },
  {
    id: 'ach-30-day-streak',
    name: 'Monthly Master',
    description: 'Maintain a 30-day carpool streak',
    icon: '⚡',
    category: 'streak',
    requirement: 30,
    points: 500,
    rarity: 'rare',
  },
  {
    id: 'ach-100-day-streak',
    name: 'Unstoppable',
    description: 'Maintain a 100-day carpool streak',
    icon: '🌟',
    category: 'streak',
    requirement: 100,
    points: 2000,
    rarity: 'epic',
  },
  {
    id: 'ach-first-share',
    name: 'Social Butterfly',
    description: 'Share your first ride',
    icon: '🦋',
    category: 'social',
    requirement: 1,
    points: 75,
    rarity: 'common',
  },
  {
    id: 'ach-10-referrals',
    name: 'Community Builder',
    description: 'Refer 10 friends to join',
    icon: '🏘️',
    category: 'social',
    requirement: 10,
    points: 1000,
    rarity: 'rare',
  },
  {
    id: 'ach-early-adopter',
    name: 'Early Adopter',
    description: 'Join in the first month',
    icon: '🎖️',
    category: 'special',
    requirement: 1,
    points: 500,
    rarity: 'rare',
  },
];

/**
 * Check for achievement unlocks
 */
export function checkAchievements(
  userProfile: UserProfile,
  recentActivity: ActivityEvent
): Achievement[] {
  const unlockedAchievements: Achievement[] = [];
  
  DEFAULT_ACHIEVEMENTS.forEach((achDef) => {
    const existingAch = userProfile.achievements.find((a) => a.id === achDef.id);
    
    if (existingAch?.isUnlocked) return;
    
    let progress = 0;
    
    switch (achDef.category) {
      case 'rides':
        progress = userProfile.totalRides;
        break;
      case 'co2':
        progress = userProfile.totalCO2Saved;
        break;
      case 'streak':
        progress = userProfile.longestStreak;
        break;
      case 'social':
        // Would check actual social metrics
        progress = 0;
        break;
    }
    
    if (progress >= achDef.requirement) {
      unlockedAchievements.push({
        ...achDef,
        progress,
        isUnlocked: true,
        unlockedAt: new Date(),
      });
    }
  });
  
  return unlockedAchievements;
}

/**
 * Get tier color
 */
export function getTierColor(tier: UserTier): string {
  const colors = {
    bronze: 'bg-orange-100 text-orange-700 border-orange-300',
    silver: 'bg-gray-100 text-gray-700 border-gray-300',
    gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    platinum: 'bg-blue-100 text-blue-700 border-blue-300',
    diamond: 'bg-purple-100 text-purple-700 border-purple-300',
  };
  return colors[tier];
}

/**
 * Get tier icon
 */
export function getTierIcon(tier: UserTier): string {
  const icons = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '💠',
  };
  return icons[tier];
}

/**
 * Get rarity color
 */
export function getRarityColor(rarity: Achievement['rarity']): string {
  const colors = {
    common: 'bg-gray-100 text-gray-700',
    rare: 'bg-blue-100 text-blue-700',
    epic: 'bg-purple-100 text-purple-700',
    legendary: 'bg-yellow-100 text-yellow-700',
  };
  return colors[rarity];
}

/**
 * Generate mock leaderboard
 */
export function generateLeaderboard(
  type: LeaderboardType,
  period: LeaderboardPeriod,
  currentUserId: string
): LeaderboardEntry[] {
  // Mock data - in production, fetch from backend
  const mockUsers = [
    { id: 'user-1', name: 'Sarah Johnson', avatar: '', points: 2450, co2: 125, rides: 87, streak: 15 },
    { id: 'user-2', name: 'Mike Chen', avatar: '', points: 2340, co2: 118, rides: 82, streak: 12 },
    { id: 'user-3', name: 'Emily Davis', avatar: '', points: 2180, co2: 110, rides: 76, streak: 10 },
    { id: 'user-4', name: 'David Wilson', avatar: '', points: 2050, co2: 105, rides: 71, streak: 9 },
    { id: 'user-5', name: 'Lisa Brown', avatar: '', points: 1920, co2: 98, rides: 65, streak: 8 },
    { id: currentUserId, name: 'You', avatar: '', points: 1850, co2: 95, rides: 62, streak: 7 },
    { id: 'user-7', name: 'Tom Anderson', avatar: '', points: 1780, co2: 90, rides: 58, streak: 7 },
    { id: 'user-8', name: 'Rachel Green', avatar: '', points: 1650, co2: 85, rides: 54, streak: 6 },
    { id: 'user-9', name: 'Chris Martinez', avatar: '', points: 1520, co2: 78, rides: 49, streak: 5 },
    { id: 'user-10', name: 'Amy Taylor', avatar: '', points: 1400, co2: 72, rides: 45, streak: 5 },
  ];
  
  const scoreKey = type === 'points' ? 'points' : type === 'co2' ? 'co2' : type === 'rides' ? 'rides' : 'streak';
  
  const sorted = [...mockUsers].sort((a, b) => b[scoreKey] - a[scoreKey]);
  
  return sorted.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    name: user.name,
    avatar: user.avatar,
    score: user[scoreKey],
    change: Math.floor(Math.random() * 5) - 2, // Random change for demo
    badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : undefined,
    tier: calculateTier(user.points),
  }));
}

/**
 * Format large numbers
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(current: number, target: number): number {
  return Math.min(100, Math.round((current / target) * 100));
}
