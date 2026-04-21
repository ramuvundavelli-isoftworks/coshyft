import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { SidebarProvider } from '../context/SidebarContext';
import { AppShell } from './AppShell';

/**
 * RootLayout — entry point for all authenticated routes.
 *
 * Renders:  ProtectedRoute → SidebarProvider → AppShell → <Outlet />
 *
 * AppShell owns the full layout (TopNav, Sidebar, main padding, Toaster).
 * Pages rendered via <Outlet /> receive a correctly spaced content area
 * driven entirely by design tokens.
 */
export default function RootLayout() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppShell />
      </SidebarProvider>
    </ProtectedRoute>
  );
}
