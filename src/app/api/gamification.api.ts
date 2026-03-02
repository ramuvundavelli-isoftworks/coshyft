/**
 * Gamification API
 * OxyPoints, achievements, leaderboards, challenges
 */

import { api, simulateDelay, isMockMode, type ApiResponse, type PaginatedResponse } from './client';
import { mockUserProfile } from '../data/mockGamificationData';
import { generateLeaderboard } from '../utils/gamification';

export const gamificationApi = {
  async getProfile(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          user_id: mockUserProfile.id,
          total_points: mockUserProfile.points,
          level: mockUserProfile.level,
          points_to_next_level: mockUserProfile.pointsToNextLevel,
          tier: mockUserProfile.tier,
          streak: mockUserProfile.streak,
          longest_streak: mockUserProfile.longestStreak,
          total_co2_saved: mockUserProfile.totalCO2Saved,
          total_rides: mockUserProfile.totalRides,
          rank: mockUserProfile.rank,
        },
      };
    }
    return api.get('/gamification/profile');
  },

  async getAchievements(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: mockUserProfile.achievements };
    }
    return api.get('/gamification/achievements');
  },

  async getLeaderboard(type = 'points', period = 'all-time'): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      const entries = generateLeaderboard(type as any, period as any, mockUserProfile.id);
      return {
        success: true,
        data: { type, period, entries, user_rank: mockUserProfile.rank },
      };
    }
    return api.get('/gamification/leaderboard', { params: { type, period } });
  },

  async getChallenges(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: [
          {
            id: 'ch-1', name: 'March Green Commute Challenge', description: 'Log 20 green commutes in March',
            type: 'monthly', goal: 20, reward_points: 200, status: 'active',
            participant_count: 145, user_progress: 8, user_completed: false,
            start_date: '2026-03-01', end_date: '2026-03-31',
          },
          {
            id: 'ch-2', name: 'Weekly Carpool Hero', description: 'Carpool 5 days this week',
            type: 'weekly', goal: 5, reward_points: 75, status: 'active',
            participant_count: 89, user_progress: 3, user_completed: false,
            start_date: '2026-03-02', end_date: '2026-03-08',
          },
        ],
      };
    }
    return api.get('/gamification/challenges');
  },

  async joinChallenge(challengeId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/gamification/challenges/${challengeId}/join`);
  },

  async getPointsHistory(params?: any): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 } };
    }
    return api.get('/gamification/history', { params });
  },

  async redeemPoints(data: { points: number; reward_type: string }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post('/gamification/redeem', data);
  },
};
