/**
 * Emission Factors API
 * CRUD, region filtering, approval workflow
 */

import { api, simulateDelay, isMockMode, type ApiResponse, type PaginatedResponse } from './client';
import { mockEmissionFactors } from '../data/mockData';
import type { EmissionFactor } from '../types';

export const emissionFactorsApi = {
  async getFactors(params?: {
    page?: number; page_size?: number; region?: string; status?: string;
  }): Promise<ApiResponse<PaginatedResponse<EmissionFactor>>> {
    if (isMockMode()) {
      await simulateDelay();
      let filtered = [...mockEmissionFactors];
      if (params?.region) filtered = filtered.filter(f => f.region === params.region);
      if (params?.status) filtered = filtered.filter(f => f.approvalStatus === params.status);
      return {
        success: true,
        data: {
          items: filtered as any,
          total: filtered.length,
          page: params?.page || 1,
          page_size: params?.page_size || 50,
          total_pages: 1,
        },
      };
    }
    return api.get('/emission-factors', { params });
  },

  async getFactorsByRegion(region: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: mockEmissionFactors.filter(f => f.region === region),
      };
    }
    return api.get(`/emission-factors/region/${region}`);
  },

  async createFactor(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { ...data, approval_status: 'draft' } }; }
    return api.post('/emission-factors', data);
  },

  async updateFactor(factorId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/emission-factors/${factorId}`, data);
  },

  async submitFactor(factorId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/emission-factors/${factorId}/submit`);
  },

  async approveFactor(factorId: string, approved: boolean, comments?: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/emission-factors/${factorId}/approve`, { approved, comments });
  },
};
