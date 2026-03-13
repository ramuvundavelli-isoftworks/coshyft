import React from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ShieldAlert, Home, ArrowLeft, LogOut, User } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import type { Role } from '../types';

const roleLabels: Record<Role, string> = {
  employee: 'Employee',
  admin: 'Corporate Admin',
  sustainability: 'Sustainability Manager',
  auditor: 'Auditor',
  superadmin: 'Super Admin',
};

const roleDefaultRoutes: Record<Role, string> = {
  employee: '/employee',
  admin: '/admin',
  sustainability: '/',
  auditor: '/auditor',
  superadmin: '/superadmin',
};

const roleDescriptions: Record<Role, string> = {
  employee: 'Log commutes, carpool, and track your personal impact.',
  admin: 'Manage users, policies, and organizational settings.',
  sustainability: 'Oversee emissions data, compliance, and reporting.',
  auditor: 'Review emissions data, baselines, and audit trails.',
  superadmin: 'Full platform administration and tenant management.',
};

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { currentUser } = useRole();
  const role = currentUser.role;

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="max-w-lg w-full p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-50 border-2 border-red-200 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-8 w-8 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-[#101828] mb-2">
          Access Restricted
        </h1>
        <p className="text-[#4a5565] mb-6">
          You don't have permission to view this page. Your current role does not include access to this section.
        </p>

        {/* Current Role Info */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-6 text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#00bc7d] rounded-lg">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-[#6a7282]">Signed in as</p>
              <p className="font-semibold text-[#101828]">{currentUser.name}</p>
            </div>
            <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
              {roleLabels[role]}
            </Badge>
          </div>
          <p className="text-sm text-[#6a7282] mt-2">
            {roleDescriptions[role]}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate(roleDefaultRoutes[role])}
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to My Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-[#6a7282] mt-6">
          If you believe you should have access, contact your administrator or the sustainability team.
        </p>
      </Card>
    </div>
  );
}
