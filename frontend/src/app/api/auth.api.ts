/**
 * Auth API
 * Login, register, refresh, logout, profile, GDPR consent
 */

import { api, setTokens, clearTokens, type ApiResponse } from './client';

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
  tenant_name?: string;
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
    const result = await api.post<TokenResponse>('/auth/login', data);
    if (result.success && result.data) {
      setTokens(result.data.access_token, result.data.refresh_token);
    }
    return result;
  },

  async register(data: RegisterRequest): Promise<ApiResponse<UserProfile>> {
    return api.post<UserProfile>('/auth/register', data);
  },

  async logout(): Promise<ApiResponse> {
    const result = await api.post('/auth/logout');
    clearTokens();
    return result;
  },

  async getMe(): Promise<ApiResponse<UserProfile>> {
    return api.get<UserProfile>('/auth/me');
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return api.put<UserProfile>('/auth/me', data);
  },

  async changePassword(data: { current_password: string; new_password: string }): Promise<ApiResponse> {
    return api.put('/auth/me/password', data);
  },

  async updateGDPRConsent(data: GDPRConsentUpdate): Promise<ApiResponse> {
    return api.put('/auth/me/gdpr-consent', data);
  },

  async requestDataExport(): Promise<ApiResponse> {
    return api.post('/auth/me/data-export');
  },

  async requestDataDeletion(): Promise<ApiResponse> {
    return api.delete('/auth/me/data');
  },
};
