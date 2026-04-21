/**
 * Emission Factors API
 * CRUD, region filtering, approval workflow
 */

import { api, type ApiResponse, type PaginatedResponse } from './client';
import type { EmissionFactor } from '../types';

export const emissionFactorsApi = {
  async getFactors(params?: {
    page?: number; page_size?: number; region?: string; status?: string;
  }): Promise<ApiResponse<PaginatedResponse<EmissionFactor>>> {
    return api.get('/emission-factors', { params });
  },

  async getFactorsByRegion(region: string): Promise<ApiResponse> {
    return api.get(`/emission-factors/region/${region}`);
  },

  async createFactor(data: any): Promise<ApiResponse> {
    return api.post('/emission-factors', data);
  },

  async updateFactor(factorId: string, data: any): Promise<ApiResponse> {
    return api.put(`/emission-factors/${factorId}`, data);
  },

  async submitFactor(factorId: string): Promise<ApiResponse> {
    return api.post(`/emission-factors/${factorId}/submit`);
  },

  async approveFactor(factorId: string, approved: boolean, comments?: string): Promise<ApiResponse> {
    return api.put(`/emission-factors/${factorId}/approve`, { approved, comments });
  },
};
