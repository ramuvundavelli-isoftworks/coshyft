import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Role, User } from '../types';

interface RoleContextType {
  currentUser: User;
  switchRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@company.com',
    role: 'sustainability',
    department: 'Sustainability',
  });

  const switchRole = (role: Role) => {
    const roleNames = {
      employee: { name: 'John Employee', department: 'Engineering' },
      admin: { name: 'Admin User', department: 'Operations' },
      sustainability: { name: 'Sarah Mitchell', department: 'Sustainability' },
      auditor: { name: 'External Auditor', department: 'Audit Firm' },
      superadmin: { name: 'Super Admin', department: 'Platform' },
    };
    
    setCurrentUser({
      ...currentUser,
      role,
      name: roleNames[role].name,
      department: roleNames[role].department,
    });
  };

  return (
    <RoleContext.Provider value={{ currentUser, switchRole }}>
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
