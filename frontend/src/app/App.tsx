import { StrictMode } from 'react';
import { RouterProvider } from 'react-router';
import { RoleProvider } from './context/RoleContext';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';

export default function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <RoleProvider>
          <RouterProvider router={router} />
        </RoleProvider>
      </AuthProvider>
    </StrictMode>
  );
}