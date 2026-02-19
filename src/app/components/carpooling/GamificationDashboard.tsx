import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Trophy,
  Star,
  Award,
  Target,
  TrendingUp,
  Lock,
  CheckCircle,
  Flame,
  Zap,
  Crown,
  Gift,
  ChevronRight,
} from 'lucide-react';
import {
  UserProfile,
  Achievement,
  Challenge,
  LeaderboardEntry,
  calculateLevel,
  calculateTier,
  getTierColor,
  getTierIcon,
  getRarityColor,
  getProgressPercentage,
  formatNumber,
  DEFAULT_ACHIEVEMENTS,
} from '../../utils/gamification';

interface GamificationDashboardProps {
  userProfile: UserProfile;
  onClaimReward?: (achievementId: string) => void;
}

export default function GamificationDashboard({ userProfile }: GamificationDashboardProps) {
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'challenges' | 'stats'>('achievements');

  const levelInfo = calculateLevel(userProfile.points);
  const progressToNextLevel = ((levelInfo.pointsToNext / 100) * 100);

  // Mock challenges
  const activeChallenges: Challenge[] = [
    {
      id: 'ch1',
      name: 'Weekly Warrior',
      description: 'Complete 5 carpools this week',
      type: 'weekly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      goal: 5,
      progress: 3,
      reward: { points: 100, badge: '🏆' },
      status: 'active',
      participants: 234,
    },
    {
      id: 'ch2',
      name: 'Green Month',
      description: 'Save 50kg CO₂ this month',
      type: 'monthly',
      startDate: new Date(),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      goal: 50,
      progress: 32,
      reward: { points: 500, badge: '🌿' },
      status: 'active',
      participants: 567,
    },
    {
      id: 'ch3',
      name: 'Streak Master',
      description: 'Build a 10-day streak',
      type: 'daily',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      goal: 10,
      progress: userProfile.streak,
      reward: { points: 250, badge: '🔥' },
      status: 'active',
      participants: 189,
    },
  ];

  // Populate achievements with progress
  const userAchievements: Achievement[] = DEFAULT_ACHIEVEMENTS.map((ach) => {
    let progress = 0;
    let isUnlocked = false;

    switch (ach.category) {
      case 'rides':
        progress = userProfile.totalRides;
        break;
      case 'co2':
        progress = userProfile.totalCO2Saved;
        break;
      case 'streak':
        progress = userProfile.longestStreak;
        break;
    }

    isUnlocked = progress >= ach.requirement;

    return {
      ...ach,
      progress,
      isUnlocked,
      unlockedAt: isUnlocked ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
    };
  });

  const unlockedCount = userAchievements.filter((a) => a.isUnlocked).length;
  const totalAchievements = userAchievements.length;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex items-start gap-6">
          {/* Avatar & Level */}
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                {userProfile.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 h-12 w-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white font-bold text-sm">{userProfile.level}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
              <Badge className={getTierColor(userProfile.tier)}>
                {getTierIcon(userProfile.tier)} {userProfile.tier.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                #{userProfile.rank} Rank
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Points</p>
                <p className="text-xl font-bold text-blue-600">{formatNumber(userProfile.points)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-xl font-bold text-purple-600">{userProfile.level}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-xl font-bold text-green-600">
                  {unlockedCount}/{totalAchievements}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Streak</p>
                <div className="flex items-center gap-1">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <p className="text-xl font-bold text-orange-600">{userProfile.streak}</p>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Level {userProfile.level}</span>
                <span className="text-gray-600">
                  {levelInfo.pointsToNext} points to Level {userProfile.level + 1}
                </span>
              </div>
              <Progress value={100 - progressToNextLevel} className="h-3" />
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={selectedTab === 'achievements' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('achievements')}
          className="rounded-b-none"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Achievements
        </Button>
        <Button
          variant={selectedTab === 'challenges' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('challenges')}
          className="rounded-b-none"
        >
          <Target className="h-4 w-4 mr-2" />
          Challenges
        </Button>
        <Button
          variant={selectedTab === 'stats' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('stats')}
          className="rounded-b-none"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Statistics
        </Button>
      </div>

      {/* Achievements Tab */}
      {selectedTab === 'achievements' && (
        <div className="space-y-6">
          {/* Progress Summary */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Achievement Progress</h3>
                <p className="text-sm text-gray-600">
                  You've unlocked {unlockedCount} out of {totalAchievements} achievements
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {Math.round((unlockedCount / totalAchievements) * 100)}%
                </div>
                <p className="text-xs text-gray-600">Complete</p>
              </div>
            </div>
            <Progress value={(unlockedCount / totalAchievements) * 100} className="mt-4" />
          </Card>

          {/* Achievement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`p-4 transition-all ${
                  achievement.isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-md'
                    : 'opacity-60 grayscale'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${
                      achievement.isUnlocked ? 'bg-white shadow-md' : 'bg-gray-200'
                    }`}
                  >
                    {achievement.isUnlocked ? achievement.icon : <Lock className="h-6 w-6 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{achievement.name}</h4>
                      <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>

                {achievement.isUnlocked ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Unlocked</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      +{achievement.points} pts
                    </Badge>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-600">
                        Progress: {achievement.progress}/{achievement.requirement}
                      </span>
                      <span className="font-medium text-gray-900">
                        {getProgressPercentage(achievement.progress, achievement.requirement)}%
                      </span>
                    </div>
                    <Progress
                      value={getProgressPercentage(achievement.progress, achievement.requirement)}
                      className="h-2"
                    />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {selectedTab === 'challenges' && (
        <div className="space-y-4">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Active Challenges</h3>
                <p className="text-sm text-gray-600">
                  Complete challenges to earn bonus points and exclusive badges
                </p>
              </div>
            </div>
          </Card>

          {activeChallenges.map((challenge) => (
            <Card key={challenge.id} className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center text-3xl">
                  {challenge.reward.badge}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{challenge.name}</h3>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      {challenge.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      <span>+{challenge.reward.points} points</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      <span>{challenge.participants} participating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      <span>Ends {challenge.endDate.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Progress: {challenge.progress}/{challenge.goal}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {getProgressPercentage(challenge.progress, challenge.goal)}%
                      </span>
                    </div>
                    <Progress
                      value={getProgressPercentage(challenge.progress, challenge.goal)}
                      className="h-3"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics Tab */}
      {selectedTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Performance Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Rides</span>
                <span className="text-xl font-bold text-gray-900">{userProfile.totalRides}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">CO₂ Saved</span>
                <span className="text-xl font-bold text-green-600">
                  {userProfile.totalCO2Saved.toFixed(1)} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Streak</span>
                <span className="text-xl font-bold text-orange-600 flex items-center gap-1">
                  <Flame className="h-5 w-5" />
                  {userProfile.streak} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Longest Streak</span>
                <span className="text-xl font-bold text-purple-600">
                  {userProfile.longestStreak} days
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Milestones
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Zap className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Level {userProfile.level}</p>
                  <p className="text-xs text-gray-600">
                    {levelInfo.pointsToNext} points to next level
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Crown className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">{userProfile.tier.toUpperCase()} Tier</p>
                  <p className="text-xs text-gray-600">Elite status achieved</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Trophy className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Rank #{userProfile.rank}</p>
                  <p className="text-xs text-gray-600">Top performer</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
