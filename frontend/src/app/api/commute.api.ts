/**
 * Commute API
 * Log commutes, history, stats, emission calculation, transport modes
 */

import { api, simulateDelay, isMockMode, type ApiResponse, type PaginatedResponse } from './client';
import { irishTransportModes } from '../data/mockData';

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

export const commuteApi = {
  async logCommute(data: CommuteEntryCreate): Promise<ApiResponse<CommuteEntry>> {
    if (isMockMode()) {
      await simulateDelay();
      const mode = irishTransportModes.find(m => m.id === data.transport_mode_id);
      const emissions = data.distance_km * (mode?.emissionFactor || 0.178);
      return {
        success: true,
        data: {
          id: 'ce-' + Date.now(),
          user_id: 'current-user',
          date: data.date,
          transport_mode_id: data.transport_mode_id,
          transport_mode_label: mode?.mode || data.transport_mode_id,
          distance_km: data.distance_km,
          duration_minutes: data.duration_minutes,
          origin_address: data.origin_address,
          destination_address: data.destination_address,
          emissions_kg_co2: Math.round(emissions * 1000) / 1000,
          emission_factor_value: mode?.emissionFactor || 0.178,
          is_return_trip: data.is_return_trip || false,
          carpool_passengers: data.carpool_passengers,
          oxypoints_earned: 10,
          verification_method: data.verification_method || 'manual',
          notes: data.notes,
          created_at: new Date().toISOString(),
        },
      };
    }
    return api.post<CommuteEntry>('/commute', data);
  },

  async getHistory(params?: {
    page?: number; page_size?: number;
    start_date?: string; end_date?: string;
    transport_mode_id?: string;
  }): Promise<ApiResponse<PaginatedResponse<CommuteEntry>>> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: { items: [], total: 0, page: 1, page_size: 20, total_pages: 0 },
      };
    }
    return api.get('/commute/history', { params });
  },

  async getStats(): Promise<ApiResponse<CommuteStats>> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          total_commutes: 62,
          total_distance_km: 1240,
          total_emissions_kg: 95.5,
          total_oxypoints: 1850,
          avg_daily_distance: 20,
          avg_daily_emissions: 1.54,
          modal_split: [
            { mode: 'DART', count: 25, percentage: 40 },
            { mode: 'Carpool', count: 18, percentage: 29 },
            { mode: 'Bicycle', count: 12, percentage: 19 },
            { mode: 'Walking', count: 7, percentage: 12 },
          ],
          monthly_trend: [],
          streak: 7,
          co2_saved_vs_car: 125.6,
        },
      };
    }
    return api.get<CommuteStats>('/commute/stats');
  },

  async calculateEmissions(data: {
    transport_mode_id: string;
    distance_km: number;
    carpool_passengers?: number;
    region?: string;
  }): Promise<ApiResponse<EmissionCalculation>> {
    if (isMockMode()) {
      await simulateDelay();
      const mode = irishTransportModes.find(m => m.id === data.transport_mode_id);
      const factor = mode?.emissionFactor || 0.178;
      const emissions = data.distance_km * factor;
      const carEmissions = data.distance_km * 0.178;
      return {
        success: true,
        data: {
          emissions_kg_co2: Math.round(emissions * 1000) / 1000,
          emission_factor_used: factor,
          emission_factor_source: 'SEAI/EPA Ireland 2025',
          oxypoints_estimate: 10,
          co2_saved_vs_car: Math.round((carEmissions - emissions) * 1000) / 1000,
        },
      };
    }
    return api.post<EmissionCalculation>('/commute/calculate', data);
  },

  async getTransportModes(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: irishTransportModes.map(m => ({
          id: m.id,
          mode: m.mode,
          operator: m.operator,
          regions: m.regions,
          emission_factor: m.emissionFactor,
          category: m.category,
          tax_relief: m.taxRelief,
          bike_to_work_scheme: m.bikeToWorkScheme,
        })),
      };
    }
    return api.get('/commute/transport-modes');
  },

  async updateCommute(id: string, data: Partial<CommuteEntryCreate>): Promise<ApiResponse<CommuteEntry>> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: {} as CommuteEntry };
    }
    return api.put<CommuteEntry>(`/commute/${id}`, data);
  },

  async deleteCommute(id: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true };
    }
    return api.delete(`/commute/${id}`);
  },
};
