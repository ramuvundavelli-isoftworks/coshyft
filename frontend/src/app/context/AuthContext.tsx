/**
 * AuthContext
 * Provides authentication state, login/logout, and current user info.
 * Works alongside RoleContext for role switching in demo mode.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { authApi, type UserProfile } from '../api/auth.api';
import { getToken, clearTokens } from '../api/client';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.getMe().then((result) => {
        if (result.success && result.data) {
          setUser(result.data);
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    if (result.success) {
      // Fetch user profile after login
      const meResult = await authApi.getMe();
      if (meResult.success && meResult.data) {
        setUser(meResult.data);
        // Return role directly so callers don't read from stale React state
        return { success: true, role: meResult.data.role };
      }
      return { success: true, role: null };
    }
    return { success: false, error: result.error?.message || 'Login failed', role: null };
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    const result = await authApi.updateProfile(data);
    if (result.success && result.data) {
      setUser((prev) => prev ? { ...prev, ...result.data } : null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user || !!getToken(),
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}