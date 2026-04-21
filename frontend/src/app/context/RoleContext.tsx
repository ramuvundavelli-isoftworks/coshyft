import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User } from '../types';
import { useAuth } from './AuthContext';

interface RoleContextType {
  currentUser: User;
  isRoleLoading: boolean;
  switchRole: (role: Role) => void;
  /** @deprecated Use AuthContext.user directly for real auth data. switchRole is demo-only. */
  refreshUser: () => Promise<Role | null>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();

  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: '',
    email: '',
    role: 'employee',
    department: undefined,
  });

  // Sync currentUser from AuthContext whenever the auth user changes.
  // This eliminates the second /auth/me call that was previously here.
  useEffect(() => {
    if (user) {
      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
        department: user.department,
        locale: user.locale as any,
        region: user.region as any,
        tenant_id: user.tenant_id,
        tenant_name: user.tenant_name,
      });
    }
  }, [user]);

  /** Demo-only: override the displayed role without a real auth change. */
  const switchRole = (role: Role) => {
    const roleNames: Record<Role, { name: string; department: string }> = {
      employee:       { name: 'John Employee',    department: 'Engineering' },
      admin:          { name: 'Admin User',        department: 'Operations' },
      sustainability: { name: 'Sarah Mitchell',    department: 'Sustainability' },
      auditor:        { name: 'External Auditor',  department: 'Audit Firm' },
      superadmin:     { name: 'Super Admin',       department: 'Platform' },
    };
    setCurrentUser(prev => ({
      ...prev,
      role,
      name: roleNames[role].name,
      department: roleNames[role].department,
    }));
  };

  /** @deprecated Returns the current role from state; kept for Login page compatibility. */
  const refreshUser = async (): Promise<Role | null> => {
    return user ? (user.role as Role) : null;
  };

  return (
    <RoleContext.Provider value={{ currentUser, isRoleLoading: authLoading, switchRole, refreshUser }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
