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
  const { currentUser } = useRole();
  const userRole = currentUser.role;

  if (!allowedRoles.includes(userRole)) {
    // Redirect to a friendly unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

/**
 * Factory helpers for common role guards.
 * These are used as route Components in routes.ts.
 */
export function SustainabilityGuard() {
  return <RoleGuard allowedRoles={['sustainability', 'superadmin']} />;
}

export function EmployeeGuard() {
  return <RoleGuard allowedRoles={['employee', 'sustainability', 'admin', 'superadmin']} />;
}

export function AdminGuard() {
  return <RoleGuard allowedRoles={['admin', 'superadmin']} />;
}

export function AuditorGuard() {
  return <RoleGuard allowedRoles={['auditor', 'superadmin']} />;
}

export function SuperAdminGuard() {
  return <RoleGuard allowedRoles={['superadmin']} />;
}