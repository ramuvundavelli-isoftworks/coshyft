import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import type { Role } from '../types';

const roleDefaultRoutes: Record<Role, string> = {
  employee: '/employee',
  admin: '/admin',
  sustainability: '/',
  auditor: '/auditor',
  superadmin: '/superadmin',
};

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { currentUser } = useRole();

  const dashboardRoute = roleDefaultRoutes[currentUser?.role] ?? '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-subtle to-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        {/* Large 404 */}
        <div className="mb-8">
          <div className="text-[10rem] font-black leading-none bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5 bg-clip-text text-transparent select-none">
            404
          </div>
        </div>

        <Card className="p-8">
          <div className="mx-auto w-16 h-16 bg-warning-subtle border-2 border-warning/25 rounded-full flex items-center justify-center mb-6">
            <Search className="h-8 w-8 text-warning" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved. Double-check the URL or head back to your dashboard.
          </p>

          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate(dashboardRoute)} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground mt-6">
          Error 404 · CoShyft Platform
        </p>
      </div>
    </div>
  );
}
