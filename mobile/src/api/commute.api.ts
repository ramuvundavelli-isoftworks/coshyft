import { api, type ApiResponse, type PaginatedResponse } from './client';

export interface CommuteEntryCreate {
  date: string;
  transport_mode_id: string;
  distance_km: number;
  duration_minutes?: number;
  origin_address?: string;
  destination_address?: string;
  origin_lat?: number;
  origin_lng?: number;
  destination_lat?: number;
  destination_lng?: number;
  is_return_trip?: boolean;
  carpool_passengers?: number;
  verification_method?: string;
  notes?: string;
}

export interface CommuteEntry {
  id: string;
  user_id: string;
  date: string;
  transport_mode_id: string;
  transport_mode_label: string;
  distance_km: number;
  duration_minutes?: number;
  origin_address?: string;
  destination_address?: string;
  emissions_kg_co2: number;
  emission_factor_value: number;
  is_return_trip: boolean;
  carpool_passengers?: number;
  oxypoints_earned: number;
  verification_method: string;
  notes?: string;
  created_at: string;
}

export interface CommuteStats {
  total_commutes: number;
  total_distance_km: number;
  total_emissions_kg: number;
  total_oxypoints: number;
  avg_daily_distance: number;
  avg_daily_emissions: number;
  modal_split: Array<{ mode: string; count: number; percentage: number }>;
  monthly_trend: Array<{ month: string; emissions: number }>;
  streak: number;
  co2_saved_vs_car: number;
}

export interface EmissionCalculation {
  emissions_kg_co2: number;
  emission_factor_used: number;
  emission_factor_source: string;
  oxypoints_estimate: number;
  co2_saved_vs_car: number;
}

export interface CommuteProfileData {
  user_id: string;
  default_origin_address?: string;
  default_origin_lat?: number;
  default_origin_lng?: number;
  default_destination_address?: string;
  default_destination_lat?: number;
  default_destination_lng?: number;
  preferred_transport_mode_id?: string;
  work_days_per_week?: number;
  remote_days_per_week?: number;
  typical_departure_time?: string;
  vehicle_fuel_type?: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  updated_at: string;
}

export const commuteApi = {
  async logCommute(data: CommuteEntryCreate): Promise<ApiResponse<CommuteEntry>> {
    return api.post<CommuteEntry>('/commute', data);
  },

  async getHistory(params?: {
    page?: number; page_size?: number;
    start_date?: string; end_date?: string;
    transport_mode_id?: string;
  }): Promise<ApiResponse<PaginatedResponse<CommuteEntry>>> {
    return api.get('/commute/history', { params });
  },

  async getStats(): Promise<ApiResponse<CommuteStats>> {
    return api.get<CommuteStats>('/commute/stats');
  },

  async calculateEmissions(data: {
    transport_mode_id: string;
    distance_km: number;
    carpool_passengers?: number;
    region?: string;
  }): Promise<ApiResponse<EmissionCalculation>> {
    return api.post<EmissionCalculation>('/commute/calculate', data);
  },

  async getTransportModes(): Promise<ApiResponse> {
    return api.get('/commute/transport-modes');
  },

  async updateCommute(id: string, data: Partial<CommuteEntryCreate>): Promise<ApiResponse<CommuteEntry>> {
    return api.put<CommuteEntry>(`/commute/${id}`, data);
  },

  async deleteCommute(id: string): Promise<ApiResponse> {
    return api.delete(`/commute/${id}`);
  },

  async getMonthlyStats(): Promise<ApiResponse> {
    return api.get('/commute/stats/monthly');
  },

  async getCommuteProfile(): Promise<ApiResponse<CommuteProfileData>> {
    return api.get<CommuteProfileData>('/commute/profile');
  },

  async updateCommuteProfile(data: Partial<CommuteProfileData>): Promise<ApiResponse<CommuteProfileData>> {
    return api.put<CommuteProfileData>('/commute/profile', data);
  },
};
