import React, { useState, useEffect } from 'react';
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
import { useApi } from '../api';
import { gamificationApi } from '../api';

export default function RewardsAchievements() {
  const [selectedView, setSelectedView] = useState<'overview' | 'leaderboard'>('overview');
  const { data: apiProfile } = useApi(() => gamificationApi.getProfile());
  const userProfile = (apiProfile as any) ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rewards & Achievements</h1>
          <p className="text-muted-foreground mt-1">
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
        <Card className="p-4 bg-gradient-to-br from-info-subtle to-info-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Points</span>
            <Zap className="h-4 w-4 text-info" />
          </div>
          <p className="text-2xl font-bold text-info">{userProfile?.points?.toLocaleString() ?? '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">
            +{Math.floor(Math.random() * 100 + 50)} this week
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-info-subtle to-primary-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Level</span>
            <Trophy className="h-4 w-4 text-info" />
          </div>
          <p className="text-2xl font-bold text-info">{userProfile?.level ?? '—'}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {userProfile?.points_to_next_level ?? userProfile?.pointsToNextLevel ?? ''} to Level {userProfile ? (userProfile.level + 1) : '—'}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-success-subtle to-success-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Achievements</span>
            <Gift className="h-4 w-4 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">
            {userProfile?.achievements_unlocked ?? (userProfile?.achievements?.filter((a: any) => a.isUnlocked).length ?? '—')}/
            {userProfile?.achievements_total ?? (userProfile?.achievements?.length ?? '—')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {userProfile?.achievements ? Math.round(
              (userProfile.achievements.filter((a: any) => a.isUnlocked).length / userProfile.achievements.length) * 100
            ) : '—'}% complete
          </p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-warning-subtle to-warning-subtle">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Global Rank</span>
            <TrendingUp className="h-4 w-4 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">#{userProfile?.rank ?? '—'}</p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-success" />
            Up 2 places
          </p>
        </Card>
      </div>

      {/* Promotional Banner */}
      <Card className="p-6 bg-gradient-to-r from-info via-primary to-destructive text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-card text-info mb-3">
                🎉 Limited Time Event
              </Badge>
              <h2 className="text-2xl font-bold mb-2">
                Double Points Weekend!
              </h2>
              <p className="text-info-foreground mb-4">
                Earn 2x points on all carpools this weekend. Ends Monday at midnight.
              </p>
              <Button className="bg-card text-info hover:bg-info-subtle">
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
          <div className="absolute top-0 left-0 w-64 h-64 bg-card rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-card rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
      </Card>

      {/* Main Content */}
      {selectedView === 'overview' ? (
        <GamificationDashboard userProfile={userProfile} />
      ) : (
        <Leaderboard currentUserId="user-current" />
      )}

      {/* Bottom CTA */}
      <Card className="p-6 bg-gradient-to-r from-info-subtle to-info-subtle border-info/25">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Want to level up faster?
            </h3>
            <p className="text-sm text-muted-foreground">
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