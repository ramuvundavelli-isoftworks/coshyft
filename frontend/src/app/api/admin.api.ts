/**
 * Admin API
 * User management, participation, rides, locations, policies, benefits, settings
 */

import { api, type ApiResponse } from './client';

export const adminApi = {
  async getOverview(): Promise<ApiResponse> {
    return api.get('/admin/overview');
  },

  async getParticipation(): Promise<ApiResponse> {
    return api.get('/admin/participation');
  },

  async setParticipationTarget(department: string, targetPercent: number): Promise<ApiResponse> {
    return api.post('/admin/participation/target', { department, target_percent: targetPercent });
  },

  async sendParticipationReminder(department: string, message: string): Promise<ApiResponse> {
    return api.post('/admin/participation/reminder', { department, message });
  },

  async getUsers(params?: any): Promise<ApiResponse> {
    return api.get('/users/', { params });
  },

  async updateUser(userId: string, data: any): Promise<ApiResponse> {
    return api.put(`/users/${userId}`, data);
  },

  async updateUserRole(userId: string, role: string): Promise<ApiResponse> {
    return api.put(`/users/${userId}/role`, { role });
  },

  async deactivateUser(userId: string): Promise<ApiResponse> {
    return api.post(`/users/${userId}/deactivate`);
  },

  async getRideOperations(params?: any): Promise<ApiResponse> {
    return api.get('/admin/rides', { params });
  },

  async cancelRide(rideId: string): Promise<ApiResponse> {
    return api.post(`/admin/rides/${rideId}/cancel`);
  },

  async getLocations(): Promise<ApiResponse> {
    return api.get('/admin/locations');
  },

  async createLocation(data: any): Promise<ApiResponse> {
    return api.post('/admin/locations', data);
  },

  async updateLocation(officeId: string, data: any): Promise<ApiResponse> {
    return api.put(`/admin/locations/${officeId}`, data);
  },

  async deleteLocation(officeId: string): Promise<ApiResponse> {
    return api.delete(`/admin/locations/${officeId}`);
  },

  async getPolicies(): Promise<ApiResponse> {
    return api.get('/admin/policies');
  },

  async createPolicy(data: any): Promise<ApiResponse> {
    return api.post('/admin/policies', data);
  },

  async updatePolicy(policyId: string, data: any): Promise<ApiResponse> {
    return api.put(`/admin/policies/${policyId}`, data);
  },

  async deletePolicy(policyId: string): Promise<ApiResponse> {
    return api.delete(`/admin/policies/${policyId}`);
  },

  async getSettings(): Promise<ApiResponse> {
    return api.get('/admin/settings');
  },

  async updateSettings(data: any): Promise<ApiResponse> {
    return api.put('/admin/settings', data);
  },

  async getWorkplaceBenefits(): Promise<ApiResponse> {
    return api.get('/admin/workplace-benefits');
  },

  async enableBenefit(data: { benefit_id: string; enabled: boolean }): Promise<ApiResponse> {
    return api.put(`/admin/workplace-benefits/${data.benefit_id}/enable`, { enabled: data.enabled });
  },
};
