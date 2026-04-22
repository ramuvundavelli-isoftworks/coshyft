import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CommonActions } from '@react-navigation/native';
import { authApi, type UserProfile } from '../api';
import { getToken, clearTokens } from '../api/client';
import { navigationRef } from '../navigation/navigationRef';

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const loadUser = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        setState({ user: null, isLoading: false, isAuthenticated: false });
        return;
      }

      const result = await authApi.getMe();
      if (result.success && result.data) {
        setState({ user: result.data, isLoading: false, isAuthenticated: true });
      } else {
        await clearTokens();
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    if (result.success) {
      await loadUser();
      return { success: true };
    }
    return { success: false, error: result.error?.message || 'Login failed' };
  }, [loadUser]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      // Force-reset navigation to Auth screen — reliable across all platforms
      if (navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] })
        );
      }
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
