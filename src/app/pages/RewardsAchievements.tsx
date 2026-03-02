import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Trophy,
  Target,
  TrendingUp,
  Gift,
  Zap,
  ArrowRight,
} from 'lucide-react';
import GamificationDashboard from '../components/carpooling/GamificationDashboard';
import Leaderboard from '../components/carpooling/Leaderboard';
import { mockUserProfile } from '../data/mockGamificationData';
import { useApi } from '../api';
import { gamificationApi } from '../api';

export default function RewardsAchievements() {
  const [selectedView, setSelectedView] = useState<'overview' | 'leaderboard'>('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rewards & Achievements</h1>
          <p className="text-gray-600 mt-1">
            Track your progress, earn rewards, and compete with others
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedView === 'overview' ? 'default' : 'outline'}
            onClick={() => setSelectedView('overview')}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Achievements
          </Button>
          <Button
            variant={selectedView === 'leaderboard' ? 'default' : 'outline'}
            onClick={() => setSelectedView('leaderboard')}
          >
            <Target className="h-4 w-4 mr-2" />
            Leaderboard
          </Button>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Points</span>
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-700">{mockUserProfile.points.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">
            +{Math.floor(Math.random() * 100 + 50)} this week
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Level</span>
            <Trophy className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">{mockUserProfile.level}</p>
          <p className="text-xs text-gray-600 mt-1">
            {mockUserProfile.pointsToNextLevel} to Level {mockUserProfile.level + 1}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Achievements</span>
            <Gift className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">
            {mockUserProfile.achievements.filter((a) => a.isUnlocked).length}/
            {mockUserProfile.achievements.length}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {Math.round(
              (mockUserProfile.achievements.filter((a) => a.isUnlocked).length /
                mockUserProfile.achievements.length) *
                100
            )}
            % complete
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Global Rank</span>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-700">#{mockUserProfile.rank}</p>
          <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" />
            Up 2 places
          </p>
        </Card>
      </div>

      {/* Promotional Banner */}
      <Card className="p-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-white text-purple-600 mb-3">
                🎉 Limited Time Event
              </Badge>
              <h2 className="text-2xl font-bold mb-2">
                Double Points Weekend!
              </h2>
              <p className="text-purple-100 mb-4">
                Earn 2x points on all carpools this weekend. Ends Monday at midnight.
              </p>
              <Button className="bg-white text-purple-600 hover:bg-purple-50">
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="hidden md:block text-8xl opacity-20">
              🎁
            </div>
          </div>
        </div>
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </Card>

      {/* Main Content */}
      {selectedView === 'overview' ? (
        <GamificationDashboard userProfile={mockUserProfile} />
      ) : (
        <Leaderboard currentUserId="user-current" />
      )}

      {/* Bottom CTA */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Want to level up faster?
            </h3>
            <p className="text-sm text-gray-600">
              Join recurring carpools and challenges to earn bonus points and exclusive rewards
            </p>
          </div>
          <Button>
            <Target className="h-4 w-4 mr-2" />
            View Challenges
          </Button>
        </div>
      </Card>
    </div>
  );
}