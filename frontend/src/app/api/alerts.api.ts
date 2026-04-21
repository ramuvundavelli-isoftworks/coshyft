/**
 * Alerts API
 * CRUD for alerts, resolve, dismiss
 */

import { api, type ApiResponse } from './client';

export const alertsApi = {
  async getAlerts(params?: {
    severity?: string; resolved?: boolean; page?: number; page_size?: number;
  }): Promise<ApiResponse> {
    return api.get('/alerts', { params });
  },

  async getStats(): Promise<ApiResponse> {
    return api.get('/alerts/stats');
  },

  async resolveAlert(alertId: string, notes?: string): Promise<ApiResponse> {
    return api.put(`/alerts/${alertId}/resolve`, { resolution_notes: notes });
  },

  async dismissAlert(alertId: string): Promise<ApiResponse> {
    return api.put(`/alerts/${alertId}/dismiss`);
  },
};
