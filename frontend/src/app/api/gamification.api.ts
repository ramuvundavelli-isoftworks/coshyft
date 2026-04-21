/**
 * Gamification API
 * OxyPoints, achievements, leaderboards, challenges
 */

import { api, type ApiResponse } from './client';

export const gamificationApi = {
  async getProfile(): Promise<ApiResponse> {
    return api.get('/gamification/profile');
  },

  async getAchievements(): Promise<ApiResponse> {
    return api.get('/gamification/achievements');
  },

  async getLeaderboard(type = 'points', period = 'all-time'): Promise<ApiResponse> {
    return api.get('/gamification/leaderboard', { params: { type, period } });
  },

  async getChallenges(): Promise<ApiResponse> {
    return api.get('/gamification/challenges');
  },

  async joinChallenge(challengeId: string): Promise<ApiResponse> {
    return api.post(`/gamification/challenges/${challengeId}/join`);
  },

  async getPointsHistory(params?: any): Promise<ApiResponse> {
    return api.get('/gamification/history', { params });
  },

  async redeemPoints(data: { points: number; reward_type: string }): Promise<ApiResponse> {
    return api.post('/gamification/redeem', data);
  },
};
