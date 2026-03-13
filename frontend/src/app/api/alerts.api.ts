/**
 * Alerts API
 * CRUD for alerts, resolve, dismiss
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';
import { mockAlerts } from '../data/mockData';

export const alertsApi = {
  async getAlerts(params?: {
    severity?: string; resolved?: boolean; page?: number; page_size?: number;
  }): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      let filtered = [...mockAlerts];
      if (params?.severity) filtered = filtered.filter(a => a.severity === params.severity);
      if (params?.resolved !== undefined) filtered = filtered.filter(a => a.resolved === params.resolved);
      return {
        success: true,
        data: { items: filtered, total: filtered.length, page: 1, page_size: 20 },
      };
    }
    return api.get('/alerts', { params });
  },

  async getStats(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          total: mockAlerts.length,
          critical: mockAlerts.filter(a => a.severity === 'critical' && !a.resolved).length,
          warning: mockAlerts.filter(a => a.severity === 'warning' && !a.resolved).length,
          info: mockAlerts.filter(a => a.severity === 'info' && !a.resolved).length,
          unresolved: mockAlerts.filter(a => !a.resolved).length,
          resolved_today: 0,
        },
      };
    }
    return api.get('/alerts/stats');
  },

  async resolveAlert(alertId: string, notes?: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/alerts/${alertId}/resolve`, { resolution_notes: notes });
  },

  async dismissAlert(alertId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/alerts/${alertId}/dismiss`);
  },
};
