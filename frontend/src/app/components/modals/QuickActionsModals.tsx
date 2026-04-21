// Quick Actions Modal Collection
// Reusable quick action modals for common tasks

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Car, Users, MapPin, Calendar, Send, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// ======================
// QUICK JOIN CARPOOL MODAL
// ======================

interface QuickJoinCarpoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CarpoolRequest) => void;
}

export interface CarpoolRequest {
  date: string;
  time: string;
  origin: string;
  destination: string;
  seatsNeeded: number;
  notes?: string;
}

export function QuickJoinCarpoolModal({ isOpen, onClose, onSubmit }: QuickJoinCarpoolModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    origin: '',
    destination: '',
    seatsNeeded: 1,
    notes: '',
  });

  const handleSubmit = () => {
    if (!formData.origin || !formData.destination) {
      toast.error('Please provide origin and destination');
      return;
    }

    onSubmit(formData);
    toast.success('Carpool request submitted!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-500" />
            Quick Join Carpool
          </DialogTitle>
          <DialogDescription>
            Find a ride quickly by posting your request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="origin">
              <MapPin className="h-4 w-4 inline mr-1" />
              Pickup Location
            </Label>
            <Input
              id="origin"
              value={formData.origin}
              onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              placeholder="e.g., Dublin City Centre"
            />
          </div>

          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="e.g., Tech Park Dublin 18"
            />
          </div>

          <div>
            <Label htmlFor="seats">Seats Needed</Label>
            <Select 
              value={String(formData.seatsNeeded)} 
              onValueChange={(v) => setFormData({ ...formData, seatsNeeded: parseInt(v) })}
            >
              <SelectTrigger id="seats">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map(n => (
                  <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional details..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Post Request</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======================
// SEND ANNOUNCEMENT MODAL
// ======================

interface SendAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AnnouncementData) => void;
}

export interface AnnouncementData {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  audience: string[];
  sendEmail: boolean;
  sendPush: boolean;
}

export function SendAnnouncementModal({ isOpen, onClose, onSubmit }: SendAnnouncementModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    audience: [] as string[],
    sendEmail: true,
    sendPush: true,
  });

  const audienceOptions = [
    'All Employees',
    'Drivers',
    'Passengers',
    'Remote Workers',
    'HQ - Dublin',
    'Cork Campus',
    'Galway Office',
  ];

  const toggleAudience = (option: string) => {
    setFormData({
      ...formData,
      audience: formData.audience.includes(option)
        ? formData.audience.filter(a => a !== option)
        : [...formData.audience, option],
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.message || formData.audience.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
    toast.success('Announcement sent successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-brand-500" />
            Send Announcement
          </DialogTitle>
          <DialogDescription>
            Broadcast a message to employees
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="title">Announcement Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., New Carpool Initiative Launched"
            />
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your announcement message..."
              rows={5}
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(v: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: v })}
            >
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Informational</SelectItem>
                <SelectItem value="medium">Medium - Standard</SelectItem>
                <SelectItem value="high">High - Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Target Audience * (Select at least one)</Label>
            <div className="grid grid-cols-2 gap-2">
              {audienceOptions.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`audience-${option}`}
                    checked={formData.audience.includes(option)}
                    onChange={() => toggleAudience(option)}
                    className="rounded"
                  />
                  <label 
                    htmlFor={`audience-${option}`} 
                    className="text-sm text-foreground cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 p-4 bg-background-subtle rounded-lg">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendEmail"
                checked={formData.sendEmail}
                onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="sendEmail" className="text-sm text-foreground cursor-pointer">
                Send Email Notification
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sendPush"
                checked={formData.sendPush}
                onChange={(e) => setFormData({ ...formData, sendPush: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="sendPush" className="text-sm text-foreground cursor-pointer">
                Send Push Notification
              </label>
            </div>
          </div>

          {formData.audience.length > 0 && (
            <div className="p-3 bg-info-subtle border border-info/25 rounded-lg">
              <p className="text-sm text-info">
                Will be sent to: <strong>{formData.audience.join(', ')}</strong>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.title || !formData.message || formData.audience.length === 0}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Announcement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ======================
// QUICK ADD LOCATION MODAL
// ======================

interface QuickAddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LocationData) => void;
}

export interface LocationData {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  parkingSpaces: number;
}

export function QuickAddLocationModal({ isOpen, onClose, onSubmit }: QuickAddLocationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: 'Ireland',
    capacity: '',
    parkingSpaces: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit({
      ...formData,
      capacity: parseInt(formData.capacity) || 0,
      parkingSpaces: parseInt(formData.parkingSpaces) || 0,
    });
    toast.success('Location added successfully!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand-500" />
            Quick Add Location
          </DialogTitle>
          <DialogDescription>
            Add a new office location quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Location Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Dublin North Office"
            />
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Dublin"
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Employee Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="parking">Parking Spaces</Label>
              <Input
                id="parking"
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => setFormData({ ...formData, parkingSpaces: e.target.value })}
                placeholder="50"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.address || !formData.city}
          >
            Add Location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
