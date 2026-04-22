/**
 * RoleGuard
 * A layout route component that restricts access based on user role.
 * Used in routes.ts as a parent layout for role-specific route sections.
 *
 * Usage in routes.ts:
 *   {
 *     Component: () => <RoleGuard allowedRoles={['admin', 'superadmin']} />,
 *     children: [
 *       { path: 'admin', Component: AdminOverview },
 *       ...
 *     ],
 *   }
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useRole } from '../context/RoleContext';
import type { Role } from '../types';

interface RoleGuardProps {
  allowedRoles: Role[];
}

/** Default landing page per role for unauthorized redirects */
const roleDefaultRoutes: Record<Role, string> = {
  employee: '/employee',
  admin: '/admin',
  sustainability: '/',
  auditor: '/auditor',
  superadmin: '/superadmin',
};

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { currentUser, isRoleLoading } = useRole();
  const userRole = currentUser.role;

  // Wait for /auth/me to resolve before checking role — prevents stale-state redirects
  if (isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-success border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={roleDefaultRoutes[userRole] || '/unauthorized'} replace />;
  }

  return <Outlet />;
}

/**
 * Factory helpers for role guards.
 * Each guard allows ONLY its own role — no cross-role access.
 * Attempting to navigate to another role's route redirects to your own dashboard.
 */
export function SustainabilityGuard() {
  return <RoleGuard allowedRoles={['sustainability']} />;
}

export function EmployeeGuard() {
  return <RoleGuard allowedRoles={['employee']} />;
}

export function AdminGuard() {
  return <RoleGuard allowedRoles={['admin']} />;
}

export function AuditorGuard() {
  return <RoleGuard allowedRoles={['auditor']} />;
}

export function SuperAdminGuard() {
  return <RoleGuard allowedRoles={['superadmin']} />;
}