import React from 'react';
import { Outlet } from 'react-router';
import { TopNav } from './TopNav';
import { Sidebar } from './Sidebar';
import { Toaster } from './ui/sonner';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { cn } from './ui/utils';

function RootLayoutContent() {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(242deg, #EDF0F4 -19.37%, #F0F5F7 36.74%, #FFF 92.86%)' }}>
      <TopNav />
      <Sidebar />
      <main className={cn(
        "mt-14 py-16 px-16 transition-all duration-300",
        isCollapsed ? "ml-16" : "ml-72"
      )}>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}

export default function RootLayout() {
  return (
    <SidebarProvider>
      <RootLayoutContent />
    </SidebarProvider>
  );
}