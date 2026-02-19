import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
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
import { Settings, Bell, Shield, MapPin, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeSettings() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    rideRequests: true,
    rideMatches: true,
    achievements: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showLocation: true,
    shareTrips: true,
  });

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const handleSavePrivacy = () => {
    toast.success('Privacy settings updated');
  };

  const handleChangePassword = () => {
    toast.success('Password changed successfully');
    setIsPasswordDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and privacy
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Profile Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Smith" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john.smith@company.com" disabled />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Engineering" disabled />
            </div>
          </div>
          <div>
            <Label htmlFor="home-location">Home Location</Label>
            <Input id="home-location" defaultValue="Downtown, San Francisco" />
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => toast.success('Profile updated')}>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <Switch
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Ride Requests</p>
              <p className="text-sm text-gray-600">Notify when someone requests your ride</p>
            </div>
            <Switch
              checked={notificationSettings.rideRequests}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, rideRequests: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Ride Matches</p>
              <p className="text-sm text-gray-600">Notify when rides match your preferences</p>
            </div>
            <Switch
              checked={notificationSettings.rideMatches}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, rideMatches: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Achievements</p>
              <p className="text-sm text-gray-600">Notify when you unlock achievements</p>
            </div>
            <Switch
              checked={notificationSettings.achievements}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, achievements: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Weekly Report</p>
              <p className="text-sm text-gray-600">Receive weekly impact summary</p>
            </div>
            <Switch
              checked={notificationSettings.weeklyReport}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, weeklyReport: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Monthly Report</p>
              <p className="text-sm text-gray-600">Receive monthly impact summary</p>
            </div>
            <Switch
              checked={notificationSettings.monthlyReport}
              onCheckedChange={(checked) =>
                setNotificationSettings({ ...notificationSettings, monthlyReport: checked })
              }
            />
          </div>
          <Button onClick={handleSaveNotifications}>
            <Save className="h-4 w-4 mr-2" />
            Save Notification Settings
          </Button>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Privacy & Visibility</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-gray-600">Allow others to see your profile</p>
            </div>
            <Switch
              checked={privacySettings.profileVisible}
              onCheckedChange={(checked) =>
                setPrivacySettings({ ...privacySettings, profileVisible: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Show Location</p>
              <p className="text-sm text-gray-600">Display your commute location to others</p>
            </div>
            <Switch
              checked={privacySettings.showLocation}
              onCheckedChange={(checked) =>
                setPrivacySettings({ ...privacySettings, showLocation: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Share Trip Data</p>
              <p className="text-sm text-gray-600">Share anonymized trip data for reporting</p>
            </div>
            <Switch
              checked={privacySettings.shareTrips}
              onCheckedChange={(checked) =>
                setPrivacySettings({ ...privacySettings, shareTrips: checked })
              }
            />
          </div>
          <Button onClick={handleSavePrivacy}>
            <Save className="h-4 w-4 mr-2" />
            Save Privacy Settings
          </Button>
        </div>
      </Card>

      {/* Commute Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Commute Preferences</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="default-mode">Default Commute Mode</Label>
            <Select defaultValue="carpool">
              <SelectTrigger id="default-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carpool">Carpool</SelectItem>
                <SelectItem value="public-transit">Public Transit</SelectItem>
                <SelectItem value="bike">Bike/Walk</SelectItem>
                <SelectItem value="drive-alone">Drive Alone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="arrival-time">Preferred Arrival Time</Label>
            <Input id="arrival-time" type="time" defaultValue="09:00" />
          </div>
          <div>
            <Label htmlFor="max-detour">Maximum Detour (minutes)</Label>
            <Select defaultValue="15">
              <SelectTrigger id="max-detour">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toast.success('Commute preferences saved')}>
            <Save className="h-4 w-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Update your account password</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="current-password">Current Password *</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="new-password">New Password *</Label>
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password *</Label>
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
              />
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Password must be at least 8 characters and include uppercase, lowercase, and numbers.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleChangePassword}>
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
