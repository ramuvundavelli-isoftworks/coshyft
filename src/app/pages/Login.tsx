import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useRole } from '../context/RoleContext';
import { UserRole } from '../types';
import { Leaf, Users, Shield, Building2, Crown } from 'lucide-react';

const roleOptions: { role: UserRole; label: string; description: string; icon: any; color: string }[] = [
  {
    role: 'employee',
    label: 'Employee',
    description: 'Access personal commute tracking and carpooling',
    icon: Users,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
  },
  {
    role: 'admin',
    label: 'Corporate Admin',
    description: 'Manage operations, users, and participation',
    icon: Building2,
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  },
  {
    role: 'sustainability',
    label: 'Sustainability Manager',
    description: 'Full compliance and emissions management',
    icon: Leaf,
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
  },
  {
    role: 'auditor',
    label: 'Auditor',
    description: 'Read-only access to compliance data',
    icon: Shield,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
  },
  {
    role: 'superadmin',
    label: 'Super Admin',
    description: 'Platform-wide system management',
    icon: Crown,
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
  },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('sustainability');
  const { switchRole } = useRole();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Switch to selected role
    switchRole(selectedRole);
    
    // Navigate based on role
    const routes: Record<UserRole, string> = {
      employee: '/employee',
      admin: '/admin',
      sustainability: '/',
      auditor: '/auditor',
      superadmin: '/superadmin',
    };
    
    navigate(routes[selectedRole]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-600 rounded-xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Scope 3 Platform</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Enterprise Category 7 – Employee Commuting Intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Request Access
              </a>
            </div>
          </Card>

          {/* Role Selection */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Role</h2>
            <p className="text-sm text-gray-600 mb-6">
              Choose which role to sign in as for this demo session
            </p>
            <div className="space-y-3">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => setSelectedRole(option.role)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      selectedRole === option.role
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : option.color
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${selectedRole === option.role ? 'bg-blue-100' : 'bg-white'}`}>
                        <Icon className={`h-5 w-5 ${selectedRole === option.role ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">{option.label}</span>
                          {selectedRole === option.role && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Demo Notice */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Demo Mode</h3>
              <p className="text-sm text-blue-800">
                This is a demonstration platform. Use any email/password combination to sign in, 
                then select your role to explore different user experiences. You can switch roles 
                anytime from the profile menu in the top-right corner.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
