import { api, type ApiResponse } from './client';

export const carpoolingApi = {
  async offerRide(data: any): Promise<ApiResponse> {
    return api.post('/rides', data);
  },
  async findRides(params: {
    origin_lat: number; origin_lng: number;
    destination_lat: number; destination_lng: number;
    departure_time?: string; max_distance_km?: number; min_seats?: number;
  }): Promise<ApiResponse> {
    return api.get('/rides/find', { params });
  },
  async getMyRides(status?: string): Promise<ApiResponse> {
    return api.get('/rides/my', { params: { status } });
  },
  async getRide(rideId: string): Promise<ApiResponse> {
    return api.get(`/rides/${rideId}`);
  },
  async updateRide(rideId: string, data: any): Promise<ApiResponse> {
    return api.put(`/rides/${rideId}`, data);
  },
  async cancelRide(rideId: string): Promise<ApiResponse> {
    return api.delete(`/rides/${rideId}`);
  },
  async requestRide(rideId: string, data: any): Promise<ApiResponse> {
    return api.post(`/rides/${rideId}/request`, data);
  },
  async acceptRequest(rideId: string, requestId: string): Promise<ApiResponse> {
    return api.put(`/rides/${rideId}/request/${requestId}/accept`);
  },
  async rejectRequest(rideId: string, requestId: string): Promise<ApiResponse> {
    return api.put(`/rides/${rideId}/request/${requestId}/reject`);
  },
  async startRide(rideId: string): Promise<ApiResponse> {
    return api.post(`/rides/${rideId}/start`);
  },
  async completeRide(rideId: string): Promise<ApiResponse> {
    return api.post(`/rides/${rideId}/complete`);
  },
  async getActiveTrip(): Promise<ApiResponse> {
    return api.get('/rides/active');
  },
  async getRecurringTemplates(): Promise<ApiResponse> {
    return api.get('/rides/recurring');
  },
  async createRecurringTemplate(data: any): Promise<ApiResponse> {
    return api.post('/rides/recurring', data);
  },
  async updateRecurringTemplate(templateId: string, data: any): Promise<ApiResponse> {
    return api.put(`/rides/recurring/${templateId}`, data);
  },
  async deleteRecurringTemplate(templateId: string): Promise<ApiResponse> {
    return api.delete(`/rides/recurring/${templateId}`);
  },
  async pauseTemplate(templateId: string): Promise<ApiResponse> {
    return api.post(`/rides/recurring/${templateId}/pause`);
  },
  async resumeTemplate(templateId: string): Promise<ApiResponse> {
    return api.post(`/rides/recurring/${templateId}/resume`);
  },
};
