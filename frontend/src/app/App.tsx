import { StrictMode } from 'react';
import { RouterProvider } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider } from './context/RoleContext';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';

export default function App() {
  return (
    <StrictMode>
      {/*
       * ThemeProvider must be outermost so every child can read the theme.
       * It applies class="dark" to <html> via next-themes.
       */}
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <RouterProvider router={router} />
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
