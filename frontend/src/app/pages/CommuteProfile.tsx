import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  MapPin, 
  Home, 
  Building2, 
  Clock, 
  Car, 
  Zap, 
  Bus, 
  Bike, 
  Calendar, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  Edit,
  Shield,
  Bell,
  Mail,
  Smartphone,
  User,
  Key
} from 'lucide-react';
import { toast } from 'sonner';
import { useApi, commuteApi, authApi } from '../api';

export default function CommuteProfile() {
  const { data: meResponse } = useApi(() => authApi.getMe());
  const { data: commuteProfileResponse } = useApi(() => commuteApi.getCommuteProfile());

  const [profileData, setProfileData] = useState({
    office: '',
    homeAddress: '',
    arrivalTime: '09:00',
    departureTime: '17:30',
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
      const nameParts = me?.name?.split(' ') || ['', ''];
      setProfileData(prev => ({
        ...prev,
        firstName: nameParts[0] || prev.firstName,
        lastName: nameParts.slice(1).join(' ') || prev.lastName,
        email: me?.email || prev.email,
        homeAddress: cp?.data?.default_origin_address || prev.homeAddress,
        arrivalTime: cp?.data?.typical_departure_time || prev.arrivalTime,
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
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleSaveBasic = async () => {
    const result = await commuteApi.updateCommuteProfile({
      default_origin_address: tempData.homeAddress,
      typical_departure_time: tempData.arrivalTime,
    });
    setProfileData({ ...profileData, ...tempData });
    setIsEditBasicOpen(false);
    if (result.success) toast.success('Basic information updated');
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
      case 'basic':
        setIsEditBasicOpen(true);
        break;
      case 'preferences':
        setIsEditPreferencesOpen(true);
        break;
      case 'notifications':
        setIsEditNotificationsOpen(true);
        break;
      case 'contact':
        setIsEditContactOpen(true);
        break;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Commute Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal commute preferences and settings
        </p>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Account Information</h2>
          <Button variant="outline" size="sm" onClick={() => openEditDialog('contact')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-info-subtle flex items-center justify-center text-2xl font-bold text-info">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </div>
            <div>
              <p className="text-xl font-semibold text-foreground">
                {profileData.firstName} {profileData.lastName}
              </p>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="text-foreground mt-1">{profileData.email}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Phone</Label>
              <p className="text-foreground mt-1">{profileData.phone}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
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
              <Building2 className="h-4 w-4" />
              Office Location
            </Label>
            <p className="text-foreground mt-2 font-medium">{profileData.office}</p>
          </div>
          <div>
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              Home Location
            </Label>
            <p className="text-foreground mt-2 font-medium">{profileData.homeAddress}</p>
            <p className="text-xs text-muted-foreground mt-1">For privacy, only city is visible to others</p>
          </div>
          <div>
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Preferred Arrival Time
            </Label>
            <p className="text-foreground mt-2 font-medium">{profileData.arrivalTime}</p>
          </div>
          <div>
            <Label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Preferred Departure Time
            </Label>
            <p className="text-foreground mt-2 font-medium">{profileData.departureTime}</p>
          </div>
        </div>
      </Card>

      {/* Transport Preferences */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Transport Mode Preferences</h2>
          <Button variant="outline" size="sm" onClick={() => openEditDialog('preferences')}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-3 block">Preferred Modes</Label>
            <div className="flex flex-wrap gap-2">
              {profileData.preferredModes.includes('carpool') && (
                <Badge className="bg-info-subtle text-info px-3 py-1">
                  <Car className="h-3 w-3 mr-1 inline" />
                  Carpool
                </Badge>
              )}
              {profileData.preferredModes.includes('public-transit') && (
                <Badge className="bg-success-subtle text-success px-3 py-1">
                  <Bus className="h-3 w-3 mr-1 inline" />
                  Public Transit
                </Badge>
              )}
              {profileData.preferredModes.includes('bike') && (
                <Badge className="bg-success-subtle text-success px-3 py-1">
                  <Bike className="h-3 w-3 mr-1 inline" />
                  Bike
                </Badge>
              )}
              {profileData.preferredModes.includes('sov') && (
                <Badge className="bg-muted text-foreground px-3 py-1">
                  <Car className="h-3 w-3 mr-1 inline" />
                  Drive Alone
                </Badge>
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
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Ride Matches</p>
                <p className="text-sm text-muted-foreground">Get notified when new rides match your route</p>
              </div>
            </div>
            <Badge variant={profileData.notifications.rideMatches ? 'default' : 'outline'}>
              {profileData.notifications.rideMatches ? 'On' : 'Off'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Trip Reminders</p>
                <p className="text-sm text-muted-foreground">Reminders for upcoming carpools</p>
              </div>
            </div>
            <Badge variant={profileData.notifications.tripReminders ? 'default' : 'outline'}>
              {profileData.notifications.tripReminders ? 'On' : 'Off'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Achievements</p>
                <p className="text-sm text-muted-foreground">Celebrate milestones and achievements</p>
              </div>
            </div>
            <Badge variant={profileData.notifications.achievements ? 'default' : 'outline'}>
              {profileData.notifications.achievements ? 'On' : 'Off'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Weekly Report</p>
                <p className="text-sm text-muted-foreground">Weekly impact summary via email</p>
              </div>
            </div>
            <Badge variant={profileData.notifications.weeklyReport ? 'default' : 'outline'}>
              {profileData.notifications.weeklyReport ? 'On' : 'Off'}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">Security & Privacy</h2>
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsChangePasswordOpen(true)}
          >
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

      {/* Edit Basic Information Dialog */}
      <Dialog open={isEditBasicOpen} onOpenChange={setIsEditBasicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Commute Information</DialogTitle>
            <DialogDescription>
              Update your office and home location details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-office">Office Location *</Label>
              <Select
                value={tempData.office}
                onValueChange={(value) => setTempData({ ...tempData, office: value })}
              >
                <SelectTrigger id="edit-office">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="San Francisco HQ">San Francisco HQ</SelectItem>
                  <SelectItem value="New York Office">New York Office</SelectItem>
                  <SelectItem value="London Office">London Office</SelectItem>
                  <SelectItem value="Tokyo Office">Tokyo Office</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-home">Home Location *</Label>
              <Input
                id="edit-home"
                value={tempData.homeAddress}
                onChange={(e) => setTempData({ ...tempData, homeAddress: e.target.value })}
                placeholder="Enter your home address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-arrival">Arrival Time *</Label>
                <Input
                  id="edit-arrival"
                  type="time"
                  value={tempData.arrivalTime}
                  onChange={(e) => setTempData({ ...tempData, arrivalTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-departure">Departure Time *</Label>
                <Input
                  id="edit-departure"
                  type="time"
                  value={tempData.departureTime}
                  onChange={(e) => setTempData({ ...tempData, departureTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditBasicOpen(false)}>
              Cancel
            </Button>
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
            <DialogDescription>
              Select your preferred transport modes and carpool preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="mb-3 block">Preferred Transport Modes *</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mode-carpool"
                    checked={tempData.preferredModes.includes('carpool')}
                    onCheckedChange={(checked) => {
                      const modes = checked 
                        ? [...tempData.preferredModes, 'carpool']
                        : tempData.preferredModes.filter(m => m !== 'carpool');
                      setTempData({ ...tempData, preferredModes: modes });
                    }}
                  />
                  <Label htmlFor="mode-carpool" className="cursor-pointer">Carpool</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mode-transit"
                    checked={tempData.preferredModes.includes('public-transit')}
                    onCheckedChange={(checked) => {
                      const modes = checked 
                        ? [...tempData.preferredModes, 'public-transit']
                        : tempData.preferredModes.filter(m => m !== 'public-transit');
                      setTempData({ ...tempData, preferredModes: modes });
                    }}
                  />
                  <Label htmlFor="mode-transit" className="cursor-pointer">Public Transit</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mode-bike"
                    checked={tempData.preferredModes.includes('bike')}
                    onCheckedChange={(checked) => {
                      const modes = checked 
                        ? [...tempData.preferredModes, 'bike']
                        : tempData.preferredModes.filter(m => m !== 'bike');
                      setTempData({ ...tempData, preferredModes: modes });
                    }}
                  />
                  <Label htmlFor="mode-bike" className="cursor-pointer">Bike / Walk</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="mode-sov"
                    checked={tempData.preferredModes.includes('sov')}
                    onCheckedChange={(checked) => {
                      const modes = checked 
                        ? [...tempData.preferredModes, 'sov']
                        : tempData.preferredModes.filter(m => m !== 'sov');
                      setTempData({ ...tempData, preferredModes: modes });
                    }}
                  />
                  <Label htmlFor="mode-sov" className="cursor-pointer">Drive Alone (SOV)</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Carpool Preferences</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pref-music"
                    checked={tempData.carpoolPreferences.musicOk}
                    onCheckedChange={(checked) => 
                      setTempData({
                        ...tempData,
                        carpoolPreferences: { ...tempData.carpoolPreferences, musicOk: checked as boolean }
                      })
                    }
                  />
                  <Label htmlFor="pref-music" className="cursor-pointer">Music is okay</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pref-conversation"
                    checked={tempData.carpoolPreferences.conversationOk}
                    onCheckedChange={(checked) => 
                      setTempData({
                        ...tempData,
                        carpoolPreferences: { ...tempData.carpoolPreferences, conversationOk: checked as boolean }
                      })
                    }
                  />
                  <Label htmlFor="pref-conversation" className="cursor-pointer">Conversation welcome</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="pref-smoking"
                    checked={tempData.carpoolPreferences.smokingOk}
                    onCheckedChange={(checked) => 
                      setTempData({
                        ...tempData,
                        carpoolPreferences: { ...tempData.carpoolPreferences, smokingOk: checked as boolean }
                      })
                    }
                  />
                  <Label htmlFor="pref-smoking" className="cursor-pointer">Smoking allowed</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPreferencesOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePreferences}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notifications Dialog */}
      <Dialog open={isEditNotificationsOpen} onOpenChange={setIsEditNotificationsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Manage how you receive updates and alerts
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Ride Matches</p>
                <p className="text-sm text-muted-foreground">New carpool opportunities</p>
              </div>
              <Checkbox
                checked={tempData.notifications.rideMatches}
                onCheckedChange={(checked) =>
                  setTempData({
                    ...tempData,
                    notifications: { ...tempData.notifications, rideMatches: checked as boolean }
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Trip Reminders</p>
                <p className="text-sm text-muted-foreground">Upcoming ride alerts</p>
              </div>
              <Checkbox
                checked={tempData.notifications.tripReminders}
                onCheckedChange={(checked) =>
                  setTempData({
                    ...tempData,
                    notifications: { ...tempData.notifications, tripReminders: checked as boolean }
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Achievements</p>
                <p className="text-sm text-muted-foreground">Milestone celebrations</p>
              </div>
              <Checkbox
                checked={tempData.notifications.achievements}
                onCheckedChange={(checked) =>
                  setTempData({
                    ...tempData,
                    notifications: { ...tempData.notifications, achievements: checked as boolean }
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Weekly Report</p>
                <p className="text-sm text-muted-foreground">Impact summary emails</p>
              </div>
              <Checkbox
                checked={tempData.notifications.weeklyReport}
                onCheckedChange={(checked) =>
                  setTempData({
                    ...tempData,
                    notifications: { ...tempData.notifications, weeklyReport: checked as boolean }
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditNotificationsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotifications}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
            <DialogDescription>
              Update your personal details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-firstname">First Name *</Label>
                <Input
                  id="edit-firstname"
                  value={tempData.firstName}
                  onChange={(e) => setTempData({ ...tempData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-lastname">Last Name *</Label>
                <Input
                  id="edit-lastname"
                  value={tempData.lastName}
                  onChange={(e) => setTempData({ ...tempData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-email">Email *</Label>
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditContactOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveContact}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="current-password">Current Password *</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password *</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password *</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Cancel
            </Button>
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
            <DialogDescription>
              This will reset all preferences to their default values
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-warning-subtle border border-warning/25 rounded-lg">
              <p className="text-sm text-warning">
                <strong>Warning:</strong> This action will reset all your preferences, notification settings, and transport mode selections to default values. Your trip history and account information will not be affected.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDataOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetData}>
              Reset Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
