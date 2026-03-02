/**
 * Super Admin API
 * Tenants, system health, usage analytics, settings
 */

import { api, simulateDelay, isMockMode, type ApiResponse } from './client';

export const superadminApi = {
  async getDashboard(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          total_tenants: 12, total_users: 4850, total_commutes: 89400,
          total_rides: 12600, total_co2_saved_kg: 4250.8, platform_status: 'healthy',
        },
      };
    }
    return api.get('/superadmin/dashboard');
  },

  async getTenants(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: [
          { id: 'tenant-001', name: 'CoShift Demo Corp', slug: 'coshift-demo', status: 'active', plan: 'enterprise', user_count: 1695 },
          { id: 'tenant-002', name: 'Green Transport Ltd', slug: 'green-transport', status: 'active', plan: 'professional', user_count: 340 },
          { id: 'tenant-003', name: 'Eco Commute Inc', slug: 'eco-commute', status: 'trial', plan: 'starter', user_count: 45 },
        ],
      };
    }
    return api.get('/superadmin/tenants');
  },

  async createTenant(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: { id: 'tn-' + Date.now(), ...data } }; }
    return api.post('/superadmin/tenants', data);
  },

  async updateTenant(tenantId: string, data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put(`/superadmin/tenants/${tenantId}`, data);
  },

  async suspendTenant(tenantId: string): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.post(`/superadmin/tenants/${tenantId}/suspend`);
  },

  async getUsage(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          total_tenants: 12, active_tenants: 10, total_users: 4850,
          active_users_today: 1240, active_users_week: 3800,
          total_commutes_logged: 89400, total_rides_completed: 12600,
          total_co2_saved_kg: 4250.8, total_oxypoints_awarded: 892000,
          api_calls_today: 45600, storage_used_gb: 2.4, revenue_monthly: 24500,
          tenant_breakdown: [],
        },
      };
    }
    return api.get('/superadmin/usage');
  },

  async getSystemHealth(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          status: 'healthy', uptime_hours: 720, api_latency_ms: 45,
          db_latency_ms: 12, active_connections: 24,
          memory_usage_percent: 62.5, cpu_usage_percent: 28.3,
          disk_usage_percent: 41.2, error_rate_percent: 0.02,
          services: [
            { name: 'API Server', status: 'healthy', latency_ms: 45 },
            { name: 'Database', status: 'healthy', latency_ms: 12 },
            { name: 'Redis Cache', status: 'healthy', latency_ms: 3 },
          ],
        },
      };
    }
    return api.get('/superadmin/health');
  },

  async getSettings(): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true, data: {} }; }
    return api.get('/superadmin/settings');
  },

  async updateSettings(data: any): Promise<ApiResponse> {
    if (isMockMode()) { await simulateDelay(); return { success: true }; }
    return api.put('/superadmin/settings', data);
  },
};
