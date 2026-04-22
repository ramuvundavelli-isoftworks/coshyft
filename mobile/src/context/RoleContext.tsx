import React, { createContext, useContext } from 'react';
import type { Role } from '../types';
import { useAuth } from './AuthContext';

interface RoleContextValue {
  role: Role | null;
  isEmployee: boolean;
  isAdmin: boolean;
  isSustainability: boolean;
  isAuditor: boolean;
  isSuperAdmin: boolean;
  hasRole: (...roles: Role[]) => boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const role = (user?.role as Role) ?? null;

  const hasRole = (...roles: Role[]) => role !== null && roles.includes(role);

  const value: RoleContextValue = {
    role,
    isEmployee: hasRole('employee'),
    isAdmin: hasRole('admin', 'superadmin'),
    isSustainability: hasRole('sustainability', 'superadmin'),
    isAuditor: hasRole('auditor', 'superadmin'),
    isSuperAdmin: hasRole('superadmin'),
    hasRole,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
