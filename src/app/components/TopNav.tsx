import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useRole } from '../context/RoleContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, Search, Download, HelpCircle, ChevronDown, Users, Building2, Leaf, Shield, Crown, CheckCircle, LogOut } from 'lucide-react';
import { mockAlerts } from '../data/mockData';
import { UserRole } from '../types';

export function TopNav() {
  const { currentUser, switchRole } = useRole();
  const [showAlerts, setShowAlerts] = useState(false);
  
  const unresolvedAlerts = mockAlerts.filter(a => !a.resolved);
  const criticalCount = unresolvedAlerts.filter(a => a.severity === 'critical').length;

  const roleLabels = {
    employee: 'Employee',
    admin: 'Corporate Admin',
    sustainability: 'Sustainability Manager',
    auditor: 'Auditor',
    superadmin: 'Super Admin',
  };

  const roleIcons = {
    employee: Users,
    admin: Building2,
    sustainability: Leaf,
    auditor: Shield,
    superadmin: Crown,
  };

  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-[#00bc7d] to-[#009689] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">REOXY</div>
            </div>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees, risks, initiatives, reports..."
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Alerts */}
          <DropdownMenu open={showAlerts} onOpenChange={setShowAlerts}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {criticalCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {criticalCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Alerts</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {unresolvedAlerts.slice(0, 5).map((alert) => (
                  <Link
                    key={alert.id}
                    to="/alerts"
                    className="block px-2 py-3 hover:bg-gray-50 border-b last:border-0"
                    onClick={() => setShowAlerts(false)}
                  >
                    <div className="flex items-start gap-2">
                      <Badge
                        variant={
                          alert.severity === 'critical'
                            ? 'destructive'
                            : alert.severity === 'warning'
                            ? 'default'
                            : 'secondary'
                        }
                        className="mt-0.5"
                      >
                        {alert.severity}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <DropdownMenuSeparator />
              <Link to="/alerts" onClick={() => setShowAlerts(false)}>
                <DropdownMenuItem>View all alerts</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Compliance Progress */}
          {currentUser.role === 'sustainability' && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">87% Complete</span>
            </div>
          )}

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden lg:flex gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export to PDF</DropdownMenuItem>
              <DropdownMenuItem>Export to Excel</DropdownMenuItem>
              <DropdownMenuItem>Export to XBRL</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">{roleLabels[currentUser.role]}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="pb-3">
                <div className="text-xs text-gray-500 mb-2">Switch Role (Demo)</div>
                <div className="text-sm font-semibold text-gray-900">
                  Current: {roleLabels[currentUser.role]}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(Object.keys(roleLabels) as UserRole[]).map((role) => {
                const Icon = roleIcons[role];
                const isActive = currentUser.role === role;
                return (
                  <DropdownMenuItem 
                    key={role}
                    onClick={() => switchRole(role)}
                    className={isActive ? 'bg-blue-50' : ''}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                      <span className="flex-1">{roleLabels[role]}</span>
                      {isActive && <CheckCircle className="h-4 w-4 text-blue-600" />}
                    </div>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/login')}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}