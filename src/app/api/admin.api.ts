/**
 * Admin API
 * User management, participation, rides, locations, policies, benefits
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';
import { irishWorkplaceBenefits } from '../data/mockData';

export const adminApi = {
  async getOverview(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          total_users: 1695,
          active_users: 1290,
          participation_rate: 76.1,
          total_commutes_logged: 12480,
          total_rides: 856,
          active_rides: 24,
          total_emissions_kg: 1900,
          total_co2_saved_kg: 342.5,
        },
      };
    }
    return api.get('/admin/overview');
  },

  async getParticipation(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: [
          { department: 'Engineering', total_employees: 450, active_employees: 380, participation_rate: 84.4 },
          { department: 'Operations', total_employees: 320, active_employees: 240, participation_rate: 75.0 },
          { department: 'Sustainability', total_employees: 45, active_employees: 42, participation_rate: 93.3 },
          { department: 'HR', total_employees: 120, active_employees: 88, participation_rate: 73.3 },
          { department: 'Finance', total_employees: 180, active_employees: 125, participation_rate: 69.4 },
        ],
      };
    }
    return api.get('/admin/participation');
  },

  async setParticipationTarget(department: string, targetPercent: number): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post('/admin/participation/target', { department, target_percent: targetPercent });
  },

  async sendParticipationReminder(department: string, message: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post('/admin/participation/reminder', { department, message });
  },

  async getUsers(params?: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { items: [], total: 0 } }; }
    return api.get('/admin/users', { params });
  },

  async updateUser(userId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/users/${userId}`, data);
  },

  async updateUserRole(userId: string, role: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/users/${userId}/role`, { role });
  },

  async deactivateUser(userId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/users/${userId}/deactivate`);
  },

  async getRideOperations(params?: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { items: [], total: 0 } }; }
    return api.get('/admin/rides', { params });
  },

  async getLocations(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: [] }; }
    return api.get('/admin/locations');
  },

  async createLocation(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'loc-' + Date.now(), ...data } }; }
    return api.post('/admin/locations', data);
  },

  async updateLocation(officeId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/admin/locations/${officeId}`, data);
  },

  async deleteLocation(officeId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.delete(`/admin/locations/${officeId}`);
  },

  async getPolicies(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: [] }; }
    return api.get('/admin/policies');
  },

  async createPolicy(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'pol-' + Date.now(), ...data } }; }
    return api.post('/admin/policies', data);
  },

  async updatePolicy(policyId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/admin/policies/${policyId}`, data);
  },

  async deletePolicy(policyId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.delete(`/admin/policies/${policyId}`);
  },

  async updateSettings(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put('/admin/settings', data);
  },

  async getWorkplaceBenefits(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: irishWorkplaceBenefits };
    }
    return api.get('/admin/workplace-benefits');
  },

  async enableBenefit(data: { benefit_id: string; enabled: boolean }): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/admin/workplace-benefits/${data.benefit_id}/enable`, { enabled: data.enabled });
  },
};