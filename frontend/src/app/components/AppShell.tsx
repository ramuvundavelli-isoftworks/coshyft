import React from 'react';
import { Outlet } from 'react-router';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { Toaster } from './ui/sonner';
import { useSidebar } from '../context/SidebarContext';
import { cn } from './ui/utils';

/* ------------------------------------------------------------------ */
/* AppShell                                                            */
/* ------------------------------------------------------------------ */

/**
 * AppShell — the single layout frame for every authenticated page.
 *
 * Structure
 * ─────────
 *  <html>                      ← next-themes injects .dark here
 *    <TopNav />                ← fixed, full-width, z-topnav
 *    <Sidebar />               ← fixed, left, collapsible
 *    <main>                    ← scrollable, offset by sidebar + topnav
 *      <Outlet /> | children
 *    </main>
 *    <Toaster />
 *
 * Spacing tokens used
 * ───────────────────
 *  --ds-topnav-height          → top offset for main
 *  --ds-sidebar-width          → left offset (expanded)
 *  --ds-sidebar-width-collapsed → left offset (collapsed)
 *  --ds-page-pad-x / -y        → page content padding
 *
 * Children can optionally be passed instead of using <Outlet />.
 * Useful for wrapping pages outside of a router context in tests.
 */
interface AppShellProps {
  children?: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--shell-bg)' }}
    >
      {/* ── Fixed chrome ─────────────────────────────────────────── */}
      <TopNav />
      <Sidebar />

      {/* ── Scrollable content area ──────────────────────────────── */}
      <main
        className={cn(
          'transition-[margin-left] duration-300',
          isCollapsed
            ? 'ml-[var(--ds-sidebar-width-collapsed)]'
            : 'ml-[var(--ds-sidebar-width)]'
        )}
        style={{
          paddingTop:    'calc(var(--ds-topnav-height) + var(--ds-page-pad-y))',
          paddingBottom: 'var(--ds-page-pad-y)',
          paddingLeft:   'var(--ds-page-pad-x)',
          paddingRight:  'var(--ds-page-pad-x)',
        }}
      >
        {children ?? <Outlet />}
      </main>

      {/* ── Notifications ────────────────────────────────────────── */}
      <Toaster />
    </div>
  );
}
