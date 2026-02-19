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
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <Sidebar />
      <main className={cn(
        "mt-16 p-8 transition-all duration-300",
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