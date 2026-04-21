/**
 * ProtectedRoute
 * Wraps authenticated routes to redirect unauthenticated users to /login.
 * Supports optional role-based access control.
 *
 * Usage in routes.ts:
 *   { path: '/admin', Component: () => <ProtectedRoute allowedRoles={['admin','superadmin']}><AdminOverview /></ProtectedRoute> }
 *
 * Or wrap the entire RootLayout:
 *   { path: '/', Component: ProtectedRootLayout, children: [...] }
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import type { Role } from '../types';

interface ProtectedRouteProps {
  children?: ReactNode;
  /** Optional list of allowed roles. If omitted, any authenticated user is allowed. */
  allowedRoles?: Role[];
  /** Where to redirect unauthenticated users. Defaults to '/login'. */
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { currentUser } = useRole();
  const location = useLocation();

  // Show nothing while checking auth state (prevents flash of redirect)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-success border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect unauthenticated users, preserving the attempted location
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = currentUser.role;
    if (!allowedRoles.includes(userRole)) {
      // Redirect to the user's default landing page based on their role
      const roleDefaultRoutes: Record<Role, string> = {
        employee: '/employee',
        admin: '/admin',
        sustainability: '/',
        auditor: '/auditor',
        superadmin: '/superadmin',
      };
      return <Navigate to={roleDefaultRoutes[userRole] || '/'} replace />;
    }
  }

  // Render children or Outlet for nested routes
  return <>{children || <Outlet />}</>;
}

/**
 * ProtectedRootLayout
 * Combines ProtectedRoute with RootLayout for use in the router config.
 * This wraps the entire authenticated section of the app.
 */
export { ProtectedRoute as default };
