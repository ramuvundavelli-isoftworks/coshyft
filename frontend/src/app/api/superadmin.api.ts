/**
 * Super Admin API
 * Tenants, users, system health, usage analytics, settings, audit log
 */

import { api, type ApiResponse } from './client';

export const superadminApi = {
  // ── Dashboard ──────────────────────────────────────────────────────────
  async getDashboard(): Promise<ApiResponse> {
    return api.get('/superadmin/dashboard');
  },

  // ── Tenants ────────────────────────────────────────────────────────────
  async getTenants(): Promise<ApiResponse> {
    return api.get('/superadmin/tenants');
  },

  async getTenant(tenantId: string): Promise<ApiResponse> {
    return api.get(`/superadmin/tenants/${tenantId}`);
  },

  async createTenant(data: {
    name: string;
    slug: string;
    contact_email: string;
    contact_name: string;
    plan?: string;
    primary_region?: string;
    max_users?: number;
    max_offices?: number;
    billing_email?: string;
  }): Promise<ApiResponse> {
    return api.post('/superadmin/tenants', data);
  },

  async updateTenant(tenantId: string, data: {
    name?: string;
    logo_url?: string;
    plan?: string;
    max_users?: number;
    max_offices?: number;
    contact_email?: string;
    contact_name?: string;
    billing_email?: string;
  }): Promise<ApiResponse> {
    return api.put(`/superadmin/tenants/${tenantId}`, data);
  },

  async deleteTenant(tenantId: string): Promise<ApiResponse> {
    return api.delete(`/superadmin/tenants/${tenantId}`);
  },

  async suspendTenant(tenantId: string): Promise<ApiResponse> {
    return api.post(`/superadmin/tenants/${tenantId}/suspend`);
  },

  async activateTenant(tenantId: string): Promise<ApiResponse> {
    return api.post(`/superadmin/tenants/${tenantId}/activate`);
  },

  // ── Tenant Config ──────────────────────────────────────────────────────
  async getTenantConfig(tenantId: string): Promise<ApiResponse> {
    return api.get(`/superadmin/tenants/${tenantId}/config`);
  },

  async updateTenantConfig(tenantId: string, data: Record<string, any>): Promise<ApiResponse> {
    return api.put(`/superadmin/tenants/${tenantId}/config`, data);
  },

  // ── Tenant Users ───────────────────────────────────────────────────────
  async getTenantUsers(tenantId: string, params?: { skip?: number; limit?: number }): Promise<ApiResponse> {
    return api.get(`/superadmin/tenants/${tenantId}/users`, { params });
  },

  async createTenantUser(tenantId: string, data: {
    email: string;
    name: string;
    password: string;
    role?: string;
    department?: string;
  }): Promise<ApiResponse> {
    return api.post(`/superadmin/tenants/${tenantId}/users`, data);
  },

  // ── Cross-tenant Users ─────────────────────────────────────────────────
  async getAllUsers(params?: {
    skip?: number;
    limit?: number;
    tenant_id?: string;
    role?: string;
  }): Promise<ApiResponse> {
    return api.get('/superadmin/users', { params });
  },

  async updateUser(userId: string, data: { role?: string; is_active?: boolean }): Promise<ApiResponse> {
    return api.put(`/superadmin/users/${userId}`, data);
  },

  // ── Usage Analytics ────────────────────────────────────────────────────
  async getUsage(): Promise<ApiResponse> {
    return api.get('/superadmin/usage');
  },

  // ── System Health ──────────────────────────────────────────────────────
  async getSystemHealth(): Promise<ApiResponse> {
    return api.get('/superadmin/health');
  },

  // ── Platform Settings ──────────────────────────────────────────────────
  async getSettings(): Promise<ApiResponse> {
    return api.get('/superadmin/settings');
  },

  async updateSettings(data: Record<string, any>): Promise<ApiResponse> {
    return api.put('/superadmin/settings', data);
  },

  // ── Audit Log ──────────────────────────────────────────────────────────
  async getAuditLog(params?: {
    skip?: number;
    limit?: number;
    action?: string;
    entity_type?: string;
    user_id?: string;
  }): Promise<ApiResponse> {
    return api.get('/superadmin/audit-log', { params });
  },
};
