import React from 'react';
import { RouterProvider } from 'react-router';
import { RoleProvider } from './context/RoleContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <RoleProvider>
      <RouterProvider router={router} />
      <Toaster />
    </RoleProvider>
  );
}
