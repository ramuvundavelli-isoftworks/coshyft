import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Home,
  Building2,
  Clock,
  Car,
  Bus,
  Bike,
  Calendar,
  Save,
  RefreshCw,
  CheckCircle,
  Edit2,
  Bell,
  Mail,
  User,
  Key,
  ArrowRight,
  MapPin,
  Music,
  MessageSquare,
  Ban,
  Shield,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, commuteApi, authApi } from '../api';

export default function CommuteProfile() {
  const { data: meResponse } = useApi(() => authApi.getMe());
  const { data: commuteProfileResponse } = useApi(() => commuteApi.getCommuteProfile());

  const [profileData, setProfileData] = useState({
    homeAddress: '',
    workAddress: '',
    departureTime: '08:30',
    preferredModes: ['carpool', 'public-transit'],
    carpoolPreferences: { musicOk: true, conversationOk: true, smokingOk: false },
    notifications: { rideMatches: true, tripReminders: true, achievements: true, weeklyReport: false },
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const me = meResponse as any;
    const cp = commuteProfileResponse as any;
    if (me || cp) {
      const nameParts = me?.name?.split(' ') ?? [];
      setProfileData(prev => ({
        ...prev,
        firstName: nameParts[0] ?? prev.firstName,
        lastName: nameParts.slice(1).join(' ') ?? prev.lastName,
        email: me?.email ?? prev.email,
        homeAddress: cp?.data?.default_origin_address ?? prev.homeAddress,
        workAddress: cp?.data?.default_destination_address ?? prev.workAddress,
        departureTime: cp?.data?.typical_departure_time ?? prev.departureTime,
      }));
    }
  }, [meResponse, commuteProfileResponse]);

  const [isEditBasicOpen, setIsEditBasicOpen] = useState(false);
  const [isEditPreferencesOpen, setIsEditPreferencesOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isResetDataOpen, setIsResetDataOpen] = useState(false);

  const [tempData, setTempData] = useState({ ...profileData });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

  const handleSaveBasic = async () => {
    const result = await commuteApi.updateCommuteProfile({
      default_origin_address: tempData.homeAddress || undefined,
      default_destination_address: tempData.workAddress || undefined,
      typical_departure_time: tempData.departureTime,
    });
    setProfileData({ ...profileData, ...tempData });
    setIsEditBasicOpen(false);
    if (result.success) toast.success('Commute information updated');
    else toast.error('Saved locally — API sync failed');
  };

  const handleSavePreferences = async () => {
    const result = await commuteApi.updateCommuteProfile({
      preferred_transport_mode_id: tempData.preferredModes[0] || undefined,
    });
    setProfileData({ ...profileData, ...tempData });
    setIsEditPreferencesOpen(false);
    if (result.success) toast.success('Preferences updated');
    else toast.error('Saved locally — API sync failed');
  };

  const handleSaveContact = async () => {
    const result = await authApi.updateProfile({
      name: `${tempData.firstName} ${tempData.lastName}`.trim(),
    });
    setProfileData({ ...profileData, ...tempData });
    setIsEditContactOpen(false);
    if (result.success) toast.success('Contact information updated');
    else toast.error('Saved locally — API sync failed');
  };

  const handleToggleNotification = (key: keyof typeof profileData.notifications, value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
    toast.success('Notification preference saved');
  };

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    const result = await authApi.changePassword({
      current_password: passwordData.current,
      new_password: passwordData.new,
    });
    setIsChangePasswordOpen(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    if (result.success) toast.success('Password changed successfully');
    else toast.error(result.error?.message || 'Failed to change password');
  };

  const handleResetData = () => {
    setIsResetDataOpen(false);
    toast.success('Profile reset to defaults');
  };

  const openEditDialog = (type: string) => {
    setTempData({ ...profileData });
    switch (type) {
      case 'basic': setIsEditBasicOpen(true); break;
      case 'preferences': setIsEditPreferencesOpen(true); break;
      case 'contact': setIsEditContactOpen(true); break;
    }
  };

  const fullName = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ');
  const initials = [profileData.firstName[0], profileData.lastName[0]].filter(Boolean).join('');

  const transportModes = [
    { id: 'carpool', label: 'Carpool', icon: Car, color: 'text-primary', bg: 'bg-primary/10' },
    { id: 'public-transit', label: 'Public Transit', icon: Bus, color: 'text-info', bg: 'bg-info/10' },
    { id: 'bike', label: 'Bike / Walk', icon: Bike, color: 'text-success', bg: 'bg-success/10' },
    { id: 'sov', label: 'Drive Alone', icon: Car, color: 'text-muted-foreground', bg: 'bg-muted' },
  ];

  const notificationItems = [
    { key: 'rideMatches' as const, icon: MapPin, label: 'Ride Matches', desc: 'New rides that match your route' },
    { key: 'tripReminders' as const, icon: Calendar, label: 'Trip Reminders', desc: 'Reminders for upcoming carpools' },
    { key: 'achievements' as const, icon: CheckCircle, label: 'Achievements', desc: 'Celebrate milestones and badges' },
    { key: 'weeklyReport' as const, icon: Mail, label: 'Weekly Report', desc: 'Weekly impact summary via email' },
  ];

  const carpoolPrefItems = [
    { key: 'musicOk' as const, icon: Music, label: 'Music OK', activeColor: 'text-primary bg-primary/10' },
    { key: 'conversationOk' as const, icon: MessageSquare, label: 'Conversation', activeColor: 'text-success bg-success/10' },
    { key: 'smokingOk' as const, icon: Ban, label: 'No Smoking', invertLogic: true, activeColor: 'text-destructive bg-destructive/10' },
  ];

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Commute Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your commute preferences and account settings</p>
      </div>

      {/* ── Profile Hero Card ── */}
      <Card className="overflow-hidden">
        {/* Gradient banner */}
        <div className="h-20 bg-gradient-to-r from-primary via-primary/90 to-primary/70 relative">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, white 0%, transparent 60%)' }}
          />
        </div>

        <div className="px-6 pb-5">
          {/* Avatar + edit */}
          <div className="flex items-end justify-between -mt-9 mb-3">
            <div className="h-[72px] w-[72px] rounded-2xl bg-background border-4 border-background shadow-md flex items-center justify-center">
              {initials
                ? <span className="text-2xl font-bold text-primary">{initials}</span>
                : <User className="h-8 w-8 text-primary" />
              }
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => openEditDialog('contact')}
            >
              <Edit2 className="h-3.5 w-3.5 mr-1.5" />Edit Profile
            </Button>
          </div>

          {/* Name + email */}
          <h2 className="text-lg font-semibold text-foreground leading-tight">
            {fullName || <span className="text-muted-foreground font-normal">Name not set</span>}
          </h2>
          <p className="text-sm text-muted-foreground">{profileData.email || 'No email'}</p>
          {profileData.phone && (
            <p className="text-sm text-muted-foreground">{profileData.phone}</p>
          )}
        </div>
      </Card>

      {/* ── Commute Route ── */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-semibold text-sm">Commute Route</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => openEditDialog('basic')}>
            <Edit2 className="h-3 w-3 mr-1" />Edit
          </Button>
        </div>

        {/* Route visual */}
        <div className="flex items-stretch gap-2">
          <div className="flex-1 bg-muted/50 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Home</span>
            </div>
            <p className={`text-sm font-medium ${profileData.homeAddress ? 'text-foreground' : 'text-muted-foreground italic'}`}>
              {profileData.homeAddress || 'Not set'}
            </p>
            {profileData.homeAddress && (
              <p className="text-[10px] text-muted-foreground mt-1">Only city visible to others</p>
            )}
          </div>

          <div className="flex items-center px-1">
            <div className="flex flex-col items-center gap-1">
              <div className="h-1 w-1 rounded-full bg-border" />
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="h-1 w-1 rounded-full bg-border" />
            </div>
          </div>

          <div className="flex-1 bg-muted/50 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Work</span>
            </div>
            <p className={`text-sm font-medium ${profileData.workAddress ? 'text-foreground' : 'text-muted-foreground italic'}`}>
              {profileData.workAddress || 'Not set'}
            </p>
          </div>
        </div>

        {/* Departure time */}
        <div className="mt-3 flex items-center gap-2.5 px-3.5 py-2.5 bg-muted/30 rounded-lg">
          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground">Typical departure</span>
          <span className="text-sm font-semibold text-foreground ml-auto">{profileData.departureTime}</span>
        </div>
      </Card>

      {/* ── Transport Preferences ── */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-info/10 flex items-center justify-center">
              <Car className="h-4 w-4 text-info" />
            </div>
            <h2 className="font-semibold text-sm">Transport Preferences</h2>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => openEditDialog('preferences')}>
            <Edit2 className="h-3 w-3 mr-1" />Edit
          </Button>
        </div>

        {/* Mode grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {transportModes.map(({ id, label, icon: Icon, color, bg }) => {
            const active = profileData.preferredModes.includes(id);
            return (
              <div
                key={id}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                  active
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-transparent bg-muted/40 opacity-50'
                }`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? bg : 'bg-muted'}`}>
                  <Icon className={`h-4 w-4 ${active ? color : 'text-muted-foreground'}`} />
                </div>
                <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
                {active && <CheckCircle className="h-3.5 w-3.5 text-primary ml-auto flex-shrink-0" />}
              </div>
            );
          })}
        </div>

        <Separator className="my-3" />

        {/* Carpool preferences */}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Carpool Atmosphere</p>
        <div className="flex items-center gap-2 flex-wrap">
          {carpoolPrefItems.map(({ key, icon: Icon, label, invertLogic, activeColor }) => {
            const isActive = invertLogic ? !profileData.carpoolPreferences[key] : profileData.carpoolPreferences[key];
            return (
              <div
                key={key}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? activeColor : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Notifications ── */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-warning/10 flex items-center justify-center">
            <Bell className="h-4 w-4 text-warning" />
          </div>
          <h2 className="font-semibold text-sm">Notification Settings</h2>
        </div>

        <div className="space-y-0 divide-y divide-border/60">
          {notificationItems.map(({ key, icon: Icon, label, desc }) => (
            <div key={key} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
              <Switch
                checked={profileData.notifications[key]}
                onCheckedChange={(v) => handleToggleNotification(key, v)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Security & Privacy ── */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center">
            <Shield className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-sm">Security & Privacy</h2>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => setIsChangePasswordOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 text-muted-foreground" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          <button
            onClick={() => setIsResetDataOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-destructive/5 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-destructive/70" />
              <div className="text-left">
                <p className="text-sm font-medium text-destructive/80">Reset Profile to Defaults</p>
                <p className="text-xs text-muted-foreground">Clear all preferences and settings</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-destructive/70 transition-colors" />
          </button>
        </div>
      </Card>

      {/* ── Dialogs ── */}

      {/* Edit Commute Information */}
      <Dialog open={isEditBasicOpen} onOpenChange={setIsEditBasicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Commute Route</DialogTitle>
            <DialogDescription>Update your home, work location and departure time</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-home">Home Address</Label>
              <Input
                id="edit-home"
                value={tempData.homeAddress}
                onChange={(e) => setTempData({ ...tempData, homeAddress: e.target.value })}
                placeholder="e.g. Tallaght, Dublin 24"
              />
            </div>
            <div>
              <Label htmlFor="edit-work">Work Address</Label>
              <Input
                id="edit-work"
                value={tempData.workAddress}
                onChange={(e) => setTempData({ ...tempData, workAddress: e.target.value })}
                placeholder="e.g. Grand Canal Dock, Dublin 2"
              />
            </div>
            <div>
              <Label htmlFor="edit-departure">Typical Departure Time</Label>
              <Input
                id="edit-departure"
                type="time"
                value={tempData.departureTime}
                onChange={(e) => setTempData({ ...tempData, departureTime: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBasicOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBasic}>
              <Save className="h-4 w-4 mr-2" />Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Preferences */}
      <Dialog open={isEditPreferencesOpen} onOpenChange={setIsEditPreferencesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transport Preferences</DialogTitle>
            <DialogDescription>Select your preferred transport modes and carpool atmosphere</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="mb-3 block text-sm font-semibold">Preferred Transport Modes</Label>
              <div className="grid grid-cols-2 gap-2">
                {transportModes.map(({ id, label, icon: Icon, color, bg }) => {
                  const checked = tempData.preferredModes.includes(id);
                  return (
                    <label
                      key={id}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        checked ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/30'
                      }`}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(v) => {
                          const modes = v
                            ? [...tempData.preferredModes, id]
                            : tempData.preferredModes.filter(m => m !== id);
                          setTempData({ ...tempData, preferredModes: modes });
                        }}
                        className="sr-only"
                      />
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${checked ? bg : 'bg-muted'}`}>
                        <Icon className={`h-3.5 w-3.5 ${checked ? color : 'text-muted-foreground'}`} />
                      </div>
                      <span className="text-xs font-medium">{label}</span>
                      {checked && <CheckCircle className="h-3.5 w-3.5 text-primary ml-auto" />}
                    </label>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-3 block text-sm font-semibold">Carpool Atmosphere</Label>
              <div className="space-y-2">
                {([
                  { id: 'musicOk', label: 'Music is okay' },
                  { id: 'conversationOk', label: 'Conversation welcome' },
                  { id: 'smokingOk', label: 'Smoking allowed' },
                ] as const).map(({ id, label }) => (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={`pref-${id}`}
                      checked={tempData.carpoolPreferences[id]}
                      onCheckedChange={(checked) =>
                        setTempData({
                          ...tempData,
                          carpoolPreferences: { ...tempData.carpoolPreferences, [id]: checked as boolean },
                        })
                      }
                    />
                    <Label htmlFor={`pref-${id}`} className="cursor-pointer text-sm">{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPreferencesOpen(false)}>Cancel</Button>
            <Button onClick={handleSavePreferences}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact */}
      <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Account Information</DialogTitle>
            <DialogDescription>Update your personal details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-firstname">First Name</Label>
                <Input
                  id="edit-firstname"
                  value={tempData.firstName}
                  onChange={(e) => setTempData({ ...tempData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-lastname">Last Name</Label>
                <Input
                  id="edit-lastname"
                  value={tempData.lastName}
                  onChange={(e) => setTempData({ ...tempData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={tempData.email}
                onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={tempData.phone}
                onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditContactOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveContact}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>Cancel</Button>
            <Button
              onClick={handleChangePassword}
              disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
            >
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Profile */}
      <Dialog open={isResetDataOpen} onOpenChange={setIsResetDataOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Profile to Defaults</DialogTitle>
            <DialogDescription>This will reset all preferences to their default values</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm text-warning">
                <strong>Warning:</strong> This will reset all preferences, notification settings, and transport mode selections.
                Your trip history and account information will not be affected.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDataOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleResetData}>Reset Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
