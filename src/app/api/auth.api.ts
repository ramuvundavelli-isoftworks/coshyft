/**
 * Auth API
 * Login, register, refresh, logout, profile, GDPR consent
 */

import { api, simulateDelay, isMockMode, setTokens, clearTokens, type ApiResponse } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  department?: string;
  locale?: string;
  region?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  avatar_url?: string;
  locale: string;
  region: string;
  tenant_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GDPRConsentUpdate {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  data_sharing_carpooling: boolean;
}

export const authApi = {
  async login(data: LoginRequest): Promise<ApiResponse<TokenResponse>> {
    if (isMockMode()) {
      await simulateDelay();
      const mockToken = 'mock-jwt-token-' + Date.now();
      setTokens(mockToken, 'mock-refresh-' + Date.now());
      return {
        success: true,
        data: {
          access_token: mockToken,
          refresh_token: 'mock-refresh',
          token_type: 'bearer',
          expires_in: 900,
        },
      };
    }
    const result = await api.post<TokenResponse>('/auth/login', data);
    if (result.success && result.data) {
      setTokens(result.data.access_token, result.data.refresh_token);
    }
    return result;
  },

  async register(data: RegisterRequest): Promise<ApiResponse<UserProfile>> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          id: 'new-user-' + Date.now(),
          email: data.email,
          name: data.name,
          role: 'employee',
          department: data.department,
          locale: data.locale || 'en-IE',
          region: data.region || 'IE',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }
    return api.post<UserProfile>('/auth/register', data);
  },

  async logout(): Promise<ApiResponse> {
    if (isMockMode()) {
      clearTokens();
      return { success: true };
    }
    const result = await api.post('/auth/logout');
    clearTokens();
    return result;
  },

  async getMe(): Promise<ApiResponse<UserProfile>> {
    if (isMockMode()) {
      await simulateDelay();
      return {
        success: true,
        data: {
          id: 'user-sus-001',
          email: 'sarah.mitchell@company.ie',
          name: 'Sarah Mitchell',
          role: 'sustainability',
          department: 'Sustainability',
          locale: 'en-IE',
          region: 'IE',
          tenant_id: 'tenant-001',
          is_active: true,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2026-03-01T00:00:00Z',
        },
      };
    }
    return api.get<UserProfile>('/auth/me');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, data: data as UserProfile };
    }
    return api.put<UserProfile>('/auth/me', data);
  },

  async changePassword(data: { current_password: string; new_password: string }): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      // Simulate validation: reject if current password is empty
      if (!data.current_password || !data.new_password) {
        return { success: false, error: { message: 'Both current and new password are required' } };
      }
      if (data.new_password.length < 8) {
        return { success: false, error: { message: 'New password must be at least 8 characters' } };
      }
      return { success: true };
    }
    return api.put('/auth/me/password', data);
  },

  async updateGDPRConsent(data: GDPRConsentUpdate): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true };
    }
    return api.put('/auth/me/gdpr-consent', data);
  },

  async requestDataExport(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, meta: { message: 'Data export request received.' } };
    }
    return api.post('/auth/me/data-export');
  },

  async requestDataDeletion(): Promise<ApiResponse> {
    if (isMockMode()) {
      await simulateDelay();
      return { success: true, meta: { message: 'Data deletion request received.' } };
    }
    return api.delete('/auth/me/data');
  },
};