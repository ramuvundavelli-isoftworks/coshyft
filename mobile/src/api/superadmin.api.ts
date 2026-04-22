import { api, type ApiResponse } from './client';

export const superadminApi = {
  async getDashboard(): Promise<ApiResponse> { return api.get('/superadmin/dashboard'); },
  async getTenants(): Promise<ApiResponse> { return api.get('/superadmin/tenants'); },
  async getTenant(tenantId: string): Promise<ApiResponse> { return api.get(`/superadmin/tenants/${tenantId}`); },
  async createTenant(data: any): Promise<ApiResponse> { return api.post('/superadmin/tenants', data); },
  async updateTenant(tenantId: string, data: any): Promise<ApiResponse> { return api.put(`/superadmin/tenants/${tenantId}`, data); },
  async deleteTenant(tenantId: string): Promise<ApiResponse> { return api.delete(`/superadmin/tenants/${tenantId}`); },
  async suspendTenant(tenantId: string): Promise<ApiResponse> { return api.post(`/superadmin/tenants/${tenantId}/suspend`); },
  async activateTenant(tenantId: string): Promise<ApiResponse> { return api.post(`/superadmin/tenants/${tenantId}/activate`); },
  async getTenantUsers(tenantId: string, params?: any): Promise<ApiResponse> { return api.get(`/superadmin/tenants/${tenantId}/users`, { params }); },
  async createTenantUser(tenantId: string, data: any): Promise<ApiResponse> { return api.post(`/superadmin/tenants/${tenantId}/users`, data); },
  async getAllUsers(params?: any): Promise<ApiResponse> { return api.get('/superadmin/users', { params }); },
  async updateUser(userId: string, data: any): Promise<ApiResponse> { return api.put(`/superadmin/users/${userId}`, data); },
  async getUsage(): Promise<ApiResponse> { return api.get('/superadmin/usage'); },
  async getSystemHealth(): Promise<ApiResponse> { return api.get('/superadmin/health'); },
  async getSettings(): Promise<ApiResponse> { return api.get('/superadmin/settings'); },
  async updateSettings(data: any): Promise<ApiResponse> { return api.put('/superadmin/settings', data); },
  async getAuditLog(params?: any): Promise<ApiResponse> { return api.get('/superadmin/audit-log', { params }); },
};
