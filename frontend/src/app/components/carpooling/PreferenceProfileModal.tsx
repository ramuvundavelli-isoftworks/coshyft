import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Music,
  MessageCircle,
  PawPrint,
  Cigarette,
  Car,
  Thermometer,
  Clock,
  MapPin,
  Settings,
  CheckCircle,
} from 'lucide-react';
import { CommutePreferences } from '../../types';
import { toast } from 'sonner';
import { Card } from '../ui/card';

interface PreferenceProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CommutePreferences) => void;
  currentPreferences?: CommutePreferences;
  isDriverMode?: boolean;
}

const defaultPreferences: CommutePreferences = {
  musicPreference: 'no-preference',
  conversationLevel: 'no-preference',
  allowsPets: false,
  allowsSmoking: false,
  vehicleType: 'any',
  temperaturePreference: 'no-preference',
  flexibleTiming: true,
  flexibleRadius: 10,
};

export default function PreferenceProfileModal({
  isOpen,
  onClose,
  onSave,
  currentPreferences,
  isDriverMode = false,
}: PreferenceProfileModalProps) {
  const [preferences, setPreferences] = useState<CommutePreferences>(
    currentPreferences || defaultPreferences
  );

  const handleSave = () => {
    onSave(preferences);
    toast.success('Commute preferences saved!');
    onClose();
  };

  const preferenceCategories = [
    {
      title: 'Music & Audio',
      icon: Music,
      description: 'How do you prefer to spend your commute time?',
      field: 'musicPreference' as const,
      options: [
        { value: 'no-preference', label: 'No preference', description: 'Happy with any choice' },
        { value: 'quiet', label: 'Quiet ride', description: 'Prefer a peaceful commute' },
        { value: 'music', label: 'Music welcome', description: 'Enjoy listening to music' },
        { value: 'podcast', label: 'Podcast friendly', description: 'Like educational content' },
      ],
    },
    {
      title: 'Conversation Level',
      icon: MessageCircle,
      description: 'How chatty are you during commutes?',
      field: 'conversationLevel' as const,
      options: [
        { value: 'no-preference', label: 'No preference', description: 'Either is fine' },
        { value: 'quiet', label: 'Prefer quiet', description: 'Limited conversation' },
        { value: 'chatty', label: 'Happy to chat', description: 'Enjoy conversations' },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {isDriverMode ? 'Driver Ride Preferences' : 'My Commute Preferences'}
          </DialogTitle>
          <DialogDescription>
            {isDriverMode
              ? 'Set your preferences for rides you offer to help match with compatible passengers'
              : 'Customize your ride preferences to find the most compatible carpool matches'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Music & Conversation Preferences */}
          {preferenceCategories.map((category) => (
            <div key={category.field} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
                <category.icon className="h-4 w-4" />
                {category.title}
              </div>
              <p className="text-sm text-gray-600">{category.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.options.map((option) => (
                  <Card
                    key={option.value}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      preferences[category.field] === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() =>
                      setPreferences({
                        ...preferences,
                        [category.field]: option.value,
                      })
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                        <div className="text-xs text-gray-600">{option.description}</div>
                      </div>
                      {preferences[category.field] === option.value && (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Vehicle Type */}
          {!isDriverMode && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
                <Car className="h-4 w-4" />
                Vehicle Type Preference
              </div>
              <p className="text-sm text-gray-600">
                Do you have a preference for the type of vehicle?
              </p>

              <Select
                value={preferences.vehicleType}
                onValueChange={(value: any) =>
                  setPreferences({ ...preferences, vehicleType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any vehicle type</SelectItem>
                  <SelectItem value="electric">⚡ Electric vehicles</SelectItem>
                  <SelectItem value="hybrid">🔋 Hybrid vehicles</SelectItem>
                  <SelectItem value="sedan">🚗 Sedan</SelectItem>
                  <SelectItem value="suv">🚙 SUV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Binary Preferences */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
              Additional Preferences
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Checkbox
                      id="allowsPets"
                      checked={preferences.allowsPets}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, allowsPets: checked === true })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="allowsPets"
                      className="flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <PawPrint className="h-4 w-4" />
                      {isDriverMode ? 'Pets Allowed' : 'Comfortable with Pets'}
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      {isDriverMode
                        ? 'I allow passengers to bring pets'
                        : 'Comfortable riding with service animals or pets'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Checkbox
                      id="allowsSmoking"
                      checked={preferences.allowsSmoking}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, allowsSmoking: checked === true })
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="allowsSmoking"
                      className="flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Cigarette className="h-4 w-4" />
                      {isDriverMode ? 'Smoking Allowed' : 'Smoker-Friendly'}
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      {isDriverMode
                        ? 'Smoking permitted in vehicle'
                        : 'Comfortable with smoking during rides'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Temperature Preference */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
              <Thermometer className="h-4 w-4" />
              Temperature Preference
            </div>

            <Select
              value={preferences.temperaturePreference || 'no-preference'}
              onValueChange={(value: any) =>
                setPreferences({ ...preferences, temperaturePreference: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-preference">No preference</SelectItem>
                <SelectItem value="cool">🧊 Prefer cooler temperature</SelectItem>
                <SelectItem value="warm">☀️ Prefer warmer temperature</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Flexibility Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b">
              <Clock className="h-4 w-4" />
              Flexibility & Matching
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  id="flexibleTiming"
                  checked={preferences.flexibleTiming}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, flexibleTiming: checked === true })
                  }
                />
                <Label htmlFor="flexibleTiming" className="cursor-pointer">
                  <div className="font-medium">Flexible with departure time</div>
                  <div className="text-xs text-gray-600">
                    I can adjust my schedule by ±30 minutes for better matches
                  </div>
                </Label>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Pickup/Dropoff Radius
                  </Label>
                  <span className="text-sm font-medium text-gray-700">
                    {preferences.flexibleRadius} km
                  </span>
                </div>
                <Slider
                  value={[preferences.flexibleRadius]}
                  onValueChange={([value]) =>
                    setPreferences({ ...preferences, flexibleRadius: value })
                  }
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 km (Very close)</span>
                  <span>20 km (Flexible)</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Maximum distance from your route for pickup/dropoff points
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Preference Summary</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>
                    • Music: <strong>{preferences.musicPreference.replace('-', ' ')}</strong>
                  </p>
                  <p>
                    • Conversation: <strong>{preferences.conversationLevel.replace('-', ' ')}</strong>
                  </p>
                  <p>
                    • Pickup radius: <strong>±{preferences.flexibleRadius} km</strong>
                  </p>
                  <p>
                    • Time flexibility:{' '}
                    <strong>{preferences.flexibleTiming ? '±30 min' : 'Fixed schedule'}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
