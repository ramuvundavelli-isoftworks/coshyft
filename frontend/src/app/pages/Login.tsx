import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useRole } from '../context/RoleContext';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';
import { Leaf, Users, Shield, Building2, Crown, Loader2, CheckCircle, Eye, EyeOff, UserCog } from 'lucide-react';

const DEMO_PASSWORD = 'Password123!';

const roleOptions: {
  role: Role;
  label: string;
  description: string;
  icon: any;
  email: string;
  color: string;
}[] = [
  {
    role: 'employee',
    label: 'Employee',
    description: 'Access personal commute tracking and carpooling',
    icon: Users,
    email: 'ciara.brennan@acme.com',
    color: 'bg-info-subtle border-info/25 hover:bg-info-subtle',
  },
  {
    role: 'admin',
    label: 'Corporate Admin',
    description: 'Manage operations, users, and participation',
    icon: Building2,
    email: 'james.obrien@acme.com',
    color: 'bg-info-subtle border-info/25 hover:bg-info-subtle',
  },
  {
    role: 'sustainability',
    label: 'Sustainability Manager',
    description: 'Full compliance and emissions management',
    icon: Leaf,
    email: 'aoife.kelly@acme.com',
    color: 'bg-success-subtle border-success/25 hover:bg-success-subtle',
  },
  {
    role: 'auditor',
    label: 'Auditor',
    description: 'Read-only access to compliance data',
    icon: Shield,
    email: 'declan.ryan@acme.com',
    color: 'bg-warning-subtle border-warning/25 hover:bg-warning-subtle',
  },
  {
    role: 'superadmin',
    label: 'Super Admin',
    description: 'Platform-wide system management',
    icon: Crown,
    email: 'superadmin@coshyft.io',
    color: 'bg-destructive-subtle border-destructive/25 hover:bg-destructive-subtle',
  },
];

const roleRoutes: Record<Role, string> = {
  employee: '/employee',
  admin: '/admin',
  sustainability: '/',
  auditor: '/auditor',
  superadmin: '/superadmin',
};

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<Role | 'other'>('sustainability');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const { switchRole } = useRole();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname;

  const isOther = selectedRole === 'other';
  const selectedOption = isOther ? null : roleOptions.find((o) => o.role === selectedRole)!;

  const activeEmail = isOther ? manualEmail : selectedOption!.email;
  const activePassword = isOther ? manualPassword : DEMO_PASSWORD;

  const handleRoleSelect = (role: Role | 'other') => {
    setSelectedRole(role);
    setLoginError(null);
  };

  const handleManualEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedRole !== 'other') {
      setSelectedRole('other');
    }
    setManualEmail(e.target.value);
  };

  const handleManualPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedRole !== 'other') {
      setSelectedRole('other');
    }
    setManualPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const result = await login(activeEmail, activePassword);

      if (result.success) {
        const realRole = (result.role as Role) || null;
        if (realRole && realRole in roleRoutes) {
          switchRole(realRole);
          navigate(from || roleRoutes[realRole], { replace: true });
        } else if (!isOther) {
          switchRole(selectedRole as Role);
          navigate(from || roleRoutes[selectedRole as Role], { replace: true });
        }
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch {
      setLoginError('Unable to connect to the server');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-info-subtle via-background to-success-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Co</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground">CoShyft</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Enterprise Category 7 — Employee Commuting Intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Login Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={activeEmail}
                  onChange={handleManualEmailChange}
                  className={`mt-2 bg-background-subtle ${!isOther ? 'cursor-default' : ''}`}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={activePassword}
                    onChange={handleManualPasswordChange}
                    className={`bg-background-subtle pr-10 ${!isOther ? 'cursor-default' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-info hover:text-info font-medium">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              {loginError && (
                <p className="text-sm text-destructive text-center">{loginError}</p>
              )}
            </form>
            <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="text-info hover:text-info font-medium">
                Request Access
              </a>
            </div>
          </Card>

          {/* Right — Role Selection */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Select Your Role</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Choose which role to sign in as for this demo session
            </p>
            <div className="space-y-3">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isActive = selectedRole === option.role;
                return (
                  <button
                    key={option.role}
                    type="button"
                    onClick={() => handleRoleSelect(option.role)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      isActive ? 'border-info bg-info-subtle shadow-sm' : option.color
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-info-subtle' : 'bg-card'}`}>
                        <Icon className={`h-5 w-5 ${isActive ? 'text-info' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-foreground">{option.label}</span>
                          {isActive && <CheckCircle className="h-4 w-4 text-info" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleRoleSelect('other')}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  isOther ? 'border-info bg-info-subtle shadow-sm' : 'bg-card border-border hover:bg-muted/80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${isOther ? 'bg-info-subtle' : 'bg-card'}`}>
                    <UserCog className={`h-5 w-5 ${isOther ? 'text-info' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">Other / Manual Entry</span>
                      {isOther && <CheckCircle className="h-4 w-4 text-info" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter custom credentials for manual login.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </Card>
        </div>

        {/* Demo Notice */}
        <Card className="mt-8 p-6 bg-info-subtle border-info/25">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-info mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-info mb-1">Demo Mode</h3>
              <p className="text-sm text-info">
                This is a demonstration platform. Select a role on the right to auto-fill the
                credentials, then click Sign In to access the respective dashboard.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
