import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Crown,
  Medal,
  Award,
  Zap,
} from 'lucide-react';
import {
  LeaderboardEntry,
  LeaderboardType,
  LeaderboardPeriod,
  generateLeaderboard,
  getTierColor,
  getTierIcon,
  formatNumber,
} from '../../utils/gamification';

interface LeaderboardProps {
  currentUserId: string;
}

export default function Leaderboard({ currentUserId }: LeaderboardProps) {
  const [type, setType] = useState<LeaderboardType>('points');
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');

  const leaderboard = generateLeaderboard(type, period, currentUserId);
  const currentUserEntry = leaderboard.find((entry) => entry.userId === currentUserId);

  const getTypeLabel = (type: LeaderboardType) => {
    const labels = {
      points: '🏆 Points',
      co2: '🌱 CO₂ Saved',
      rides: '🚗 Total Rides',
      streak: '🔥 Best Streak',
    };
    return labels[type];
  };

  const getPeriodLabel = (period: LeaderboardPeriod) => {
    const labels = {
      daily: 'Today',
      weekly: 'This Week',
      monthly: 'This Month',
      'all-time': 'All Time',
    };
    return labels[period];
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-success" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-destructive" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-warning';
    if (rank === 2) return 'text-muted-foreground';
    if (rank === 3) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-info-subtle via-primary-subtle to-warning-subtle">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-warning to-warning rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
              <p className="text-muted-foreground">Compete with fellow commuters</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={type} onValueChange={(value: LeaderboardType) => setType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points">Points</SelectItem>
                <SelectItem value="co2">CO₂ Saved</SelectItem>
                <SelectItem value="rides">Total Rides</SelectItem>
                <SelectItem value="streak">Streak Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={period} onValueChange={(value: LeaderboardPeriod) => setPeriod(value)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Your Position */}
        {currentUserEntry && (
          <div className="p-4 bg-card rounded-lg border-2 border-info/25 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-info">#{currentUserEntry.rank}</span>
                  {getChangeIcon(currentUserEntry.change)}
                  {currentUserEntry.change !== 0 && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {Math.abs(currentUserEntry.change)}
                    </span>
                  )}
                </div>
                <Avatar className="h-12 w-12 border-2 border-info">
                  <AvatarFallback className="bg-info text-white font-bold">
                    YOU
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">Your Position</p>
                  <p className="text-sm text-muted-foreground">
                    {formatNumber(currentUserEntry.score)}{' '}
                    {type === 'co2' ? 'kg' : type === 'streak' ? 'days' : type === 'rides' ? 'rides' : 'pts'}
                  </p>
                </div>
              </div>
              <Badge className={getTierColor(currentUserEntry.tier)}>
                {getTierIcon(currentUserEntry.tier)} {currentUserEntry.tier.toUpperCase()}
              </Badge>
            </div>
          </div>
        )}
      </Card>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((entry, index) => {
          const heights = ['h-56', 'h-48', 'h-40'];
          const positions = [2, 1, 3]; // Middle is tallest
          const displayIndex = positions[index] - 1;
          const actualEntry = leaderboard[displayIndex];

          return (
            <Card
              key={actualEntry.userId}
              className={`p-4 flex flex-col items-center justify-end ${heights[displayIndex]} ${
                displayIndex === 0
                  ? 'bg-gradient-to-br from-warning-subtle to-warning-subtle border-warning/40'
                  : displayIndex === 1
                  ? 'bg-gradient-to-br from-background-subtle to-background-subtle border-border'
                  : 'bg-gradient-to-br from-warning-subtle to-warning-subtle border-warning/40'
              }`}
            >
              <div className="text-4xl mb-2">{getRankIcon(actualEntry.rank)}</div>
              <Avatar className={`h-16 w-16 border-4 ${
                displayIndex === 0
                  ? 'border-warning/60'
                  : displayIndex === 1
                  ? 'border-border'
                  : 'border-warning/60'
              }`}>
                <AvatarFallback className="text-lg font-bold">
                  {actualEntry.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <p className="font-semibold text-foreground mt-2 text-center">{actualEntry.name}</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatNumber(actualEntry.score)}
              </p>
              <p className="text-xs text-muted-foreground">
                {type === 'co2' ? 'kg' : type === 'streak' ? 'days' : type === 'rides' ? 'rides' : 'pts'}
              </p>
              <Badge variant="outline" className={`mt-2 ${getTierColor(actualEntry.tier)}`}>
                {getTierIcon(actualEntry.tier)}
              </Badge>
            </Card>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <Card className="p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Medal className="h-5 w-5 text-warning" />
          Rankings - {getPeriodLabel(period)}
        </h3>

        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;

            return (
              <div
                key={entry.userId}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  isCurrentUser
                    ? 'bg-info-subtle border-2 border-info/25'
                    : 'bg-background-subtle hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="flex items-center gap-2 w-16">
                    <span className={`text-xl font-bold ${getRankColor(entry.rank)}`}>
                      #{entry.rank}
                    </span>
                    {entry.badge && <span className="text-lg">{entry.badge}</span>}
                  </div>

                  {/* Avatar & Name */}
                  <Avatar className={`h-10 w-10 ${isCurrentUser ? 'border-2 border-info' : ''}`}>
                    <AvatarFallback className={isCurrentUser ? 'bg-info text-white' : ''}>
                      {entry.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className={`font-semibold ${isCurrentUser ? 'text-info' : 'text-foreground'}`}>
                      {entry.name}
                    </p>
                    <Badge variant="outline" className={`text-xs ${getTierColor(entry.tier)}`}>
                      {getTierIcon(entry.tier)} {entry.tier}
                    </Badge>
                  </div>

                  {/* Change */}
                  <div className="flex items-center gap-1 min-w-[60px]">
                    {getChangeIcon(entry.change)}
                    {entry.change !== 0 && (
                      <span
                        className={`text-sm font-medium ${
                          entry.change > 0
                            ? 'text-success'
                            : entry.change < 0
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {entry.change > 0 && '+'}
                        {entry.change}
                      </span>
                    )}
                  </div>

                  {/* Score */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-xl font-bold text-foreground">{formatNumber(entry.score)}</p>
                    <p className="text-xs text-muted-foreground">
                      {type === 'co2' ? 'kg CO₂' : type === 'streak' ? 'days' : type === 'rides' ? 'rides' : 'points'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Rewards Info */}
      <Card className="p-6 bg-gradient-to-r from-info-subtle to-primary-subtle border-info/25">
        <div className="flex items-start gap-3">
          <Award className="h-6 w-6 text-info mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Leaderboard Rewards</h3>
            <div className="space-y-1 text-sm text-info">
              <p>🥇 1st Place: 1,000 bonus points + Exclusive badge</p>
              <p>🥈 2nd Place: 500 bonus points + Elite badge</p>
              <p>🥉 3rd Place: 250 bonus points + Pro badge</p>
              <p>🏆 Top 10: 100 bonus points + Recognition badge</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
