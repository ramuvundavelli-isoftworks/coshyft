import { api, type ApiResponse } from './client';

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
    return api.get<EmissionSummary>('/emissions/summary', { params: { year } });
  },
  async getTrends(year = 2026): Promise<ApiResponse> {
    return api.get('/emissions/trends', { params: { year } });
  },
  async getModeSplit(year = 2026): Promise<ApiResponse> {
    return api.get('/emissions/mode-split', { params: { year } });
  },
  async getLocationPerformance(): Promise<ApiResponse> {
    return api.get('/emissions/locations');
  },
  async getLocationDetail(officeId: string): Promise<ApiResponse> {
    return api.get(`/emissions/locations/${officeId}`);
  },
  async getDepartmentEmissions(year = 2026): Promise<ApiResponse> {
    return api.get('/emissions/by-department', { params: { year } });
  },
};
