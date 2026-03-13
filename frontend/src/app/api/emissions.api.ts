/**
 * Emissions API
 * Dashboard KPIs, trends, mode split, location performance
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';
import { mockEmissionData, mockModeDistribution, mockLocationPerformance } from '../data/mockData';

export interface EmissionSummary {
  total_emissions_kg: number;
  total_emissions_previous_period: number;
  yoy_change_percent: number;
  emission_intensity: number;
  total_commutes: number;
  participation_rate: number;
  data_quality_score: number;
  target_emissions_kg?: number;
  gap_to_target?: number;
}

export const emissionsApi = {
  async getSummary(year = 2026): Promise<ApiResponse<EmissionSummary>> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          total_emissions_kg: 1900,
          total_emissions_previous_period: 2320,
          yoy_change_percent: -18.1,
          emission_intensity: 1.12,
          total_commutes: 12480,
          participation_rate: 76.2,
          data_quality_score: 78.5,
          target_emissions_kg: 2250,
          gap_to_target: -350,
        },
      };
    }
    return api.get<EmissionSummary>('/emissions/summary', { params: { year } });
  },

  async getTrends(year = 2026): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: mockEmissionData };
    }
    return api.get('/emissions/trends', { params: { year } });
  },

  async getModeSplit(year = 2026): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: mockModeDistribution };
    }
    return api.get('/emissions/mode-split', { params: { year } });
  },

  async getLocationPerformance(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: mockLocationPerformance };
    }
    return api.get('/emissions/locations');
  },

  async getLocationDetail(officeId: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      const location = mockLocationPerformance.find(l => l.location.includes(officeId));
      return { success: true, data: location || mockLocationPerformance[0] };
    }
    return api.get(`/emissions/locations/${officeId}`);
  },
};
