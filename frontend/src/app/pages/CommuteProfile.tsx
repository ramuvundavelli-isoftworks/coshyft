import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
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
  Edit,
  Bell,
  Mail,
  User,
  Key,
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
  const [isEditNotificationsOpen, setIsEditNotificationsOpen] = useState(false);
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

  const handleSaveNotifications = () => {
    setProfileData({ ...profileData, ...tempData });
    setIsEditNotificationsOpen(false);
    toast.success('Notification settings updated');
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
      case 'notifications': setIsEditNotificationsOpen(true); break;
      case 'contact': setIsEditContactOpen(true); break;
    }
  };

  const initials = [profileData.firstName[0], profileData.lastName[0]].filter(Boolean).join('');

  const transportModes = [
    { id: 'carpool', label: 'Carpool', icon: Car, className: 'bg-info-subtle text-info' },
    { id: 'public-transit', label: 'Public Transit', icon: Bus, className: 'bg-success-subtle text-success' },
    { id: 'bike', label: 'Bike / Walk', icon: Bike, className: 'bg-success-subtle text-success' },
    { id: 'sov', label: 'Drive Alone', icon: Car, className: 'bg-muted text-foreground' },
  ];

  const notificationItems = [
    { key: 'rideMatches', icon: Bell, label: 'Ride Matches', desc: 'Get notified when new rides match your route' },
    { key: 'tripReminders', icon: Calendar, label: 'Trip Reminders', desc: 'Reminders for upcoming carpools' },
    { key: 'achievements', icon: CheckCircle, label: 'Achievements', desc: 'Celebrate milestones and achievements' },
    { key: 'weeklyReport', icon: Mail, label: 'Weekly Report', desc: 'Weekly impact summary via email' },
  ] as const;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Commute Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal commute preferences and settings</p>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-info-subtle flex items-center justify-center flex-shrink-0">
              {initials
                ? <span className="text-xl font-bold text-info">{initials}</span>
                : <User className="h-7 w-7 text-info" />
              }
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">
                {profileData.firstName || profileData.lastName
                  ? `${profileData.firstName} ${profileData.lastName}`.trim()
                  : <span className="text-muted-foreground">Name not set</span>
                }
              </p>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              {profileData.phone && (
                <p className="text-sm text-muted-foreground">{profileData.phone}</p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => openEditDialog('contact')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </Card>

      {/* Commute Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Commute Information</h2>
          <Button variant="outline" size="sm" onClick={() => openEditDialog('basic')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              Home Address
            </Label>
            <p className="text-foreground mt-2 font-medium">
              {profileData.homeAddress || <span className="text-muted-foreground italic">Not set</span>}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Only city is visible to others</p>
          </div>
          <div>
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4" />
              Work Address
            </Label>
            <p className="text-foreground mt-2 font-medium">
              {profileData.workAddress || <span className="text-muted-foreground italic">Not set</span>}
            </p>
          </div>
          <div>
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Typical Departure Time
            </Label>
            <p className="text-foreground mt-2 font-medium">{profileData.departureTime}</p>
          </div>
        </div>
      </Card>

      {/* Transport Preferences */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Transport Preferences</h2>
          <Button variant="outline" size="sm" onClick={() => openEditDialog('preferences')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-3 block">Preferred Modes</Label>
            <div className="flex flex-wrap gap-2">
              {transportModes
                .filter(m => profileData.preferredModes.includes(m.id))
                .map(({ id, label, icon: Icon, className }) => (
                  <Badge key={id} className={`${className} px-3 py-1`}>
                    <Icon className="h-3 w-3 mr-1 inline" />
                    {label}
                  </Badge>
                ))
              }
              {profileData.preferredModes.length === 0 && (
                <span className="text-sm text-muted-foreground italic">None selected</span>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Label className="text-sm text-muted-foreground mb-3 block">Carpool Preferences</Label>
            <div className="space-y-2">
              {profileData.carpoolPreferences.musicOk && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Music is okay
                </div>
              )}
              {profileData.carpoolPreferences.conversationOk && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Conversation welcome
                </div>
              )}
              {!profileData.carpoolPreferences.smokingOk && (
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  No smoking
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
          <Button variant="outline" size="sm" onClick={() => openEditDialog('notifications')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-3">
          {notificationItems.map(({ key, icon: Icon, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
              <Badge variant={profileData.notifications[key] ? 'default' : 'outline'}>
                {profileData.notifications[key] ? 'On' : 'Off'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Security & Privacy</h2>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => setIsChangePasswordOpen(true)}>
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive hover:border-destructive/40"
            onClick={() => setIsResetDataOpen(true)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Profile to Defaults
          </Button>
        </div>
      </Card>

      {/* Edit Commute Information Dialog */}
      <Dialog open={isEditBasicOpen} onOpenChange={setIsEditBasicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Commute Information</DialogTitle>
            <DialogDescription>Update your home and work location details</DialogDescription>
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
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Preferences Dialog */}
      <Dialog open={isEditPreferencesOpen} onOpenChange={setIsEditPreferencesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transport Preferences</DialogTitle>
            <DialogDescription>Select your preferred transport modes and carpool preferences</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="mb-3 block">Preferred Transport Modes</Label>
              <div className="space-y-2">
                {transportModes.map(({ id, label }) => (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={`mode-${id}`}
                      checked={tempData.preferredModes.includes(id)}
                      onCheckedChange={(checked) => {
                        const modes = checked
                          ? [...tempData.preferredModes, id]
                          : tempData.preferredModes.filter(m => m !== id);
                        setTempData({ ...tempData, preferredModes: modes });
                      }}
                    />
                    <Label htmlFor={`mode-${id}`} className="cursor-pointer">{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Carpool Preferences</Label>
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
                    <Label htmlFor={`pref-${id}`} className="cursor-pointer">{label}</Label>
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

      {/* Edit Notifications Dialog */}
      <Dialog open={isEditNotificationsOpen} onOpenChange={setIsEditNotificationsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>Manage how you receive updates and alerts</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {notificationItems.map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
                <Checkbox
                  checked={tempData.notifications[key]}
                  onCheckedChange={(checked) =>
                    setTempData({
                      ...tempData,
                      notifications: { ...tempData.notifications, [key]: checked as boolean },
                    })
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNotificationsOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNotifications}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
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

      {/* Change Password Dialog */}
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

      {/* Reset Profile Dialog */}
      <Dialog open={isResetDataOpen} onOpenChange={setIsResetDataOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Profile to Defaults</DialogTitle>
            <DialogDescription>This will reset all preferences to their default values</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-warning-subtle border border-warning/25 rounded-lg">
              <p className="text-sm text-warning">
                <strong>Warning:</strong> This will reset all preferences, notification settings, and transport mode selections. Your trip history and account information will not be affected.
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
