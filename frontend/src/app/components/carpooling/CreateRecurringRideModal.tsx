import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Calendar,
  Clock,
  MapPin,
  Repeat,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  RecurringRideTemplate,
  RecurrencePattern,
  DayOfWeek,
  validateTemplate,
  getScheduleDescription,
  suggestDepartureTime,
} from '../../utils/recurringRides';
import { geocodeAddress } from '../../utils/carpoolMatching';

interface CreateRecurringRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: RecurringRideTemplate) => void;
  editTemplate?: RecurringRideTemplate;
}

export default function CreateRecurringRideModal({
  isOpen,
  onClose,
  onSave,
  editTemplate,
}: CreateRecurringRideModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [originAddress, setOriginAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [pattern, setPattern] = useState<RecurrencePattern>('weekly');
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>(['monday', 'wednesday', 'friday']);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [seats, setSeats] = useState(3);
  const [isDriver, setIsDriver] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [customDates, setCustomDates] = useState<Date[]>([]);
  const [newCustomDate, setNewCustomDate] = useState('');

  // Preferences
  const [allowSmoking, setAllowSmoking] = useState(false);
  const [allowPets, setAllowPets] = useState(false);
  const [musicPreference, setMusicPreference] = useState<'quiet' | 'moderate' | 'any'>('moderate');
  const [conversationPreference, setConversationPreference] = useState<'chatty' | 'moderate' | 'quiet'>('moderate');
  const [detourTolerance, setDetourTolerance] = useState(10);

  useEffect(() => {
    if (editTemplate) {
      setName(editTemplate.name);
      setDescription(editTemplate.description || '');
      setOriginAddress(editTemplate.origin.address);
      setDestinationAddress(editTemplate.destination.address);
      setDepartureTime(editTemplate.departureTime);
      setPattern(editTemplate.pattern);
      setSelectedDays(editTemplate.daysOfWeek || []);
      setStartDate(editTemplate.startDate.toISOString().split('T')[0]);
      setEndDate(editTemplate.endDate?.toISOString().split('T')[0] || '');
      setHasEndDate(!!editTemplate.endDate);
      setSeats(editTemplate.seats);
      setIsDriver(editTemplate.isDriver);
      setAutoAccept(editTemplate.autoAccept);
      setNotificationEnabled(editTemplate.notificationEnabled);
      setCustomDates(editTemplate.customDates || []);
      setAllowSmoking(editTemplate.preferences.allowSmoking);
      setAllowPets(editTemplate.preferences.allowPets);
      setMusicPreference(editTemplate.preferences.musicPreference);
      setConversationPreference(editTemplate.preferences.conversationPreference);
      setDetourTolerance(editTemplate.preferences.detourTolerance);
    }
  }, [editTemplate]);

  const allDays: DayOfWeek[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addCustomDate = () => {
    if (newCustomDate) {
      const date = new Date(newCustomDate);
      if (!customDates.some((d) => d.toDateString() === date.toDateString())) {
        setCustomDates([...customDates, date].sort((a, b) => a.getTime() - b.getTime()));
        setNewCustomDate('');
      }
    }
  };

  const removeCustomDate = (date: Date) => {
    setCustomDates(customDates.filter((d) => d.getTime() !== date.getTime()));
  };

  const handleSave = () => {
    const originCoords = geocodeAddress(originAddress);
    const destCoords = geocodeAddress(destinationAddress);

    const template: RecurringRideTemplate = {
      id: editTemplate?.id || `template-${Date.now()}`,
      name,
      description,
      origin: {
        address: originAddress,
        ...originCoords,
      },
      destination: {
        address: destinationAddress,
        ...destCoords,
      },
      departureTime,
      pattern,
      daysOfWeek: selectedDays.length > 0 ? selectedDays : undefined,
      customDates: pattern === 'custom' ? customDates : undefined,
      startDate: new Date(startDate),
      endDate: hasEndDate ? new Date(endDate) : undefined,
      seats,
      isDriver,
      preferences: {
        allowSmoking,
        allowPets,
        musicPreference,
        conversationPreference,
        detourTolerance,
        maxPassengers: seats,
      },
      exceptions: editTemplate?.exceptions || [],
      autoAccept,
      notificationEnabled,
      status: 'active',
      createdAt: editTemplate?.createdAt || new Date(),
      statistics: editTemplate?.statistics || {
        totalRidesGenerated: 0,
        totalRidesCompleted: 0,
        totalCO2Saved: 0,
        averagePassengers: 0,
      },
    };

    const validation = validateTemplate(template);
    if (!validation.isValid) {
      toast.error('Validation failed', {
        description: validation.errors.join(', '),
      });
      return;
    }

    onSave(template);
    toast.success(editTemplate ? 'Template updated!' : 'Recurring ride created!', {
      description: getScheduleDescription(template),
    });
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    if (!editTemplate) {
      // Reset form
      setName('');
      setDescription('');
      setOriginAddress('');
      setDestinationAddress('');
      setDepartureTime('08:00');
      setPattern('weekly');
      setSelectedDays(['monday', 'wednesday', 'friday']);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setHasEndDate(false);
      setSeats(3);
      setIsDriver(true);
      setAutoAccept(false);
      setNotificationEnabled(true);
    }
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Template Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Daily Commute to Office"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about this recurring ride..."
          rows={2}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="origin">Pickup Location *</Label>
        <div className="relative mt-2">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="origin"
            value={originAddress}
            onChange={(e) => setOriginAddress(e.target.value)}
            placeholder="Enter pickup address"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="destination">Dropoff Location *</Label>
        <div className="relative mt-2">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="destination"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="Enter destination address"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="time">Departure Time *</Label>
        <div className="relative mt-2">
          <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="time"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isDriver"
            checked={isDriver}
            onCheckedChange={(checked) => setIsDriver(checked === true)}
          />
          <Label htmlFor="isDriver" className="cursor-pointer">
            I'm the driver
          </Label>
        </div>

        {isDriver && (
          <div className="flex items-center gap-2">
            <Label htmlFor="seats">Available Seats:</Label>
            <Input
              id="seats"
              type="number"
              min="1"
              max="8"
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              className="w-20"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label>Recurrence Pattern *</Label>
        <Select value={pattern} onValueChange={(value: RecurrencePattern) => setPattern(value)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom Dates</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(pattern === 'weekly' || pattern === 'biweekly') && (
        <div>
          <Label>Select Days *</Label>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {allDays.map((day) => (
              <Button
                key={day}
                variant={selectedDays.includes(day) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleDay(day)}
                className="text-xs"
              >
                {day.slice(0, 3).toUpperCase()}
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {selectedDays.length > 0 ? selectedDays.map(d => d.slice(0, 3)).join(', ') : 'None'}
          </p>
        </div>
      )}

      {pattern === 'custom' && (
        <div>
          <Label>Custom Dates *</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="date"
              value={newCustomDate}
              onChange={(e) => setNewCustomDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <Button onClick={addCustomDate} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {customDates.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {customDates.map((date, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 pl-3 pr-1"
                >
                  {date.toLocaleDateString()}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={() => removeCustomDate(date)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="startDate">Start Date *</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="mt-2"
        />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Checkbox
            id="hasEndDate"
            checked={hasEndDate}
            onCheckedChange={(checked) => setHasEndDate(checked === true)}
          />
          <Label htmlFor="hasEndDate" className="cursor-pointer">
            Set end date
          </Label>
        </div>
        {hasEndDate && (
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        )}
        {!hasEndDate && (
          <p className="text-xs text-gray-500">Rides will continue indefinitely</p>
        )}
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Schedule Preview:</p>
            <p>{getScheduleDescription({
              departureTime,
              pattern,
              daysOfWeek: selectedDays,
              startDate: new Date(startDate),
            } as RecurringRideTemplate)}</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label>Music Preference</Label>
        <Select
          value={musicPreference}
          onValueChange={(value: 'quiet' | 'moderate' | 'any') => setMusicPreference(value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quiet">🔇 No music preferred</SelectItem>
            <SelectItem value="moderate">🎵 Background music OK</SelectItem>
            <SelectItem value="any">🎶 Any music level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Conversation Preference</Label>
        <Select
          value={conversationPreference}
          onValueChange={(value: 'chatty' | 'moderate' | 'quiet') => setConversationPreference(value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chatty">💬 Love to chat</SelectItem>
            <SelectItem value="moderate">🙂 Moderate conversation</SelectItem>
            <SelectItem value="quiet">🤫 Prefer quiet rides</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="detour">Maximum Detour Time (minutes)</Label>
        <Input
          id="detour"
          type="number"
          min="0"
          max="30"
          value={detourTolerance}
          onChange={(e) => setDetourTolerance(parseInt(e.target.value))}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          How much extra time you're willing to spend picking up/dropping off passengers
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="smoking"
            checked={allowSmoking}
            onCheckedChange={(checked) => setAllowSmoking(checked === true)}
          />
          <Label htmlFor="smoking" className="cursor-pointer">
            🚬 Allow smoking
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="pets"
            checked={allowPets}
            onCheckedChange={(checked) => setAllowPets(checked === true)}
          />
          <Label htmlFor="pets" className="cursor-pointer">
            🐕 Allow pets
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="autoAccept"
            checked={autoAccept}
            onCheckedChange={(checked) => setAutoAccept(checked === true)}
          />
          <Label htmlFor="autoAccept" className="cursor-pointer">
            ✅ Auto-accept matching ride requests
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="notifications"
            checked={notificationEnabled}
            onCheckedChange={(checked) => setNotificationEnabled(checked === true)}
          />
          <Label htmlFor="notifications" className="cursor-pointer">
            🔔 Enable notifications for this schedule
          </Label>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Repeat className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {editTemplate ? 'Edit Recurring Ride' : 'Create Recurring Ride'}
              </DialogTitle>
              <DialogDescription>
                Step {step} of 3: {step === 1 ? 'Route Details' : step === 2 ? 'Schedule Pattern' : 'Preferences'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSave}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {editTemplate ? 'Save Changes' : 'Create Template'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
