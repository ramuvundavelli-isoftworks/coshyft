/**
 * CoShift Mobile API Client
 * Uses expo-secure-store on native, localStorage on web.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// Storage abstraction: SecureStore on native, localStorage on web (dev only)
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; field?: string };
  meta?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  signal?: AbortSignal;
}

// Token keys
const TOKEN_KEY = 'coshift_access_token';
const REFRESH_KEY = 'coshift_refresh_token';

export async function getToken(): Promise<string | null> {
  return storage.getItem(TOKEN_KEY);
}

export async function setTokens(access: string, refresh: string): Promise<void> {
  await storage.setItem(TOKEN_KEY, access);
  await storage.setItem(REFRESH_KEY, refresh);
}

export async function clearTokens(): Promise<void> {
  await storage.removeItem(TOKEN_KEY);
  await storage.removeItem(REFRESH_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return storage.getItem(REFRESH_KEY);
}

// Build query string from params
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  const entries = Object.entries(params).filter(([, v]) => v !== null && v !== undefined);
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

// Core fetch wrapper
async function apiFetch<T>(
  method: string,
  path: string,
  body?: any,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...config?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${path}${buildQueryString(config?.params)}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: config?.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        const refreshed = await attemptTokenRefresh();
        if (refreshed) {
          const newToken = await getToken();
          headers['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
          });
          return await retryResponse.json();
        }
        await clearTokens();
      }

      return {
        success: false,
        error: {
          code: data?.error?.code || `HTTP_${response.status}`,
          message: data?.error?.message || data?.detail || 'Request failed',
        },
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error',
      },
    };
  }
}

async function attemptTokenRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        await setTokens(data.data.access_token, data.data.refresh_token);
        return true;
      }
    }
  } catch {
    // Refresh failed
  }
  return false;
}

// Public API methods
export const api = {
  get: <T>(path: string, config?: RequestConfig) =>
    apiFetch<T>('GET', path, undefined, config),

  post: <T>(path: string, body?: any, config?: RequestConfig) =>
    apiFetch<T>('POST', path, body, config),

  put: <T>(path: string, body?: any, config?: RequestConfig) =>
    apiFetch<T>('PUT', path, body, config),

  delete: <T>(path: string, config?: RequestConfig) =>
    apiFetch<T>('DELETE', path, undefined, config),
};
