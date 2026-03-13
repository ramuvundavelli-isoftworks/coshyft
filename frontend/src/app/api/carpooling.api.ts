/**
 * Carpooling API
 * Find/offer rides, manage requests, recurring templates, active trips
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';
import { mockExtendedRides } from '../data/mockCarpoolData';
import { mockRecurringTemplates } from '../data/mockRecurringData';
import { mockActiveTrip } from '../data/mockTripData';

export const carpoolingApi = {
  async offerRide(data: any): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: { id: 'ride-' + Date.now(), ...data, status: 'scheduled' } };
    }
    return api.post('/rides', data);
  },

  async findRides(params: {
    origin_lat: number; origin_lng: number;
    destination_lat: number; destination_lng: number;
    departure_time?: string; max_distance_km?: number; min_seats?: number;
  }): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: mockExtendedRides.map(r => ({
          ride: r,
          match_score: r.matchScore,
          route_score: 85,
          time_score: 90,
          preference_score: 80,
        })),
      };
    }
    return api.get('/rides/find', { params });
  },

  async getMyRides(status?: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: [] };
    }
    return api.get('/rides/my', { params: { status } });
  },

  async getRide(rideId: string): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      const ride = mockExtendedRides.find(r => r.id === rideId);
      return { success: true, data: ride || mockExtendedRides[0] };
    }
    return api.get(`/rides/${rideId}`);
  },

  async updateRide(rideId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/rides/${rideId}`, data);
  },

  async cancelRide(rideId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.delete(`/rides/${rideId}`);
  },

  async requestRide(rideId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'req-' + Date.now() } }; }
    return api.post(`/rides/${rideId}/request`, data);
  },

  async acceptRequest(rideId: string, requestId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/rides/${rideId}/request/${requestId}/accept`);
  },

  async rejectRequest(rideId: string, requestId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/rides/${rideId}/request/${requestId}/reject`);
  },

  async startRide(rideId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/rides/${rideId}/start`);
  },

  async completeRide(rideId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/rides/${rideId}/complete`);
  },

  async getActiveTrip(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: mockActiveTrip };
    }
    return api.get('/rides/active');
  },

  // Recurring templates
  async getRecurringTemplates(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: mockRecurringTemplates };
    }
    return api.get('/rides/recurring');
  },

  async createRecurringTemplate(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'tpl-' + Date.now(), ...data } }; }
    return api.post('/rides/recurring', data);
  },

  async updateRecurringTemplate(templateId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/rides/recurring/${templateId}`, data);
  },

  async deleteRecurringTemplate(templateId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.delete(`/rides/recurring/${templateId}`);
  },

  async pauseTemplate(templateId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/rides/recurring/${templateId}/pause`);
  },

  async resumeTemplate(templateId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/rides/recurring/${templateId}/resume`);
  },

  async addException(templateId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/rides/recurring/${templateId}/exception`, data);
  },
};
