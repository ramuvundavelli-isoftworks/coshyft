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
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import {
  AlertTriangle,
  Phone,
  Shield,
  MapPin,
  Clock,
  Users,
  MessageCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { GPSCoordinate, EmergencyContact } from '../../utils/tripTracking';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface SOSEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: GPSCoordinate;
  driverName: string;
  driverPhone?: string;
  passengers?: Array<{ name: string; phone?: string }>;
  emergencyContacts?: EmergencyContact[];
  tripId: string;
}

export default function SOSEmergencyModal({
  isOpen,
  onClose,
  currentLocation,
  driverName,
  driverPhone,
  passengers = [],
  emergencyContacts = [],
  tripId,
}: SOSEmergencyModalProps) {
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [notifyEmergencyServices, setNotifyEmergencyServices] = useState(false);
  const [notifyEmergencyContacts, setNotifyEmergencyContacts] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const emergencyTypes = [
    {
      id: 'medical',
      label: 'Medical Emergency',
      icon: '🚑',
      description: 'Someone needs immediate medical attention',
      severity: 'critical',
    },
    {
      id: 'accident',
      label: 'Vehicle Accident',
      icon: '🚗',
      description: 'Vehicle involved in collision or accident',
      severity: 'critical',
    },
    {
      id: 'unsafe',
      label: 'Feel Unsafe',
      icon: '⚠️',
      description: 'Feel threatened or uncomfortable',
      severity: 'high',
    },
    {
      id: 'breakdown',
      label: 'Vehicle Breakdown',
      icon: '🔧',
      description: 'Vehicle has mechanical issues',
      severity: 'medium',
    },
    {
      id: 'harassment',
      label: 'Harassment',
      icon: '🛑',
      description: 'Experiencing harassment or unwanted behavior',
      severity: 'critical',
    },
    {
      id: 'other',
      label: 'Other Emergency',
      icon: '❗',
      description: 'Other urgent situation requiring help',
      severity: 'high',
    },
  ];

  const handleActivateSOS = () => {
    if (!emergencyType) {
      toast.error('Please select an emergency type');
      return;
    }
    setIsConfirming(true);
  };

  const handleConfirmSOS = () => {
    // In production, this would trigger:
    // 1. Alert emergency services if selected
    // 2. Notify emergency contacts
    // 3. Alert platform support team
    // 4. Record incident with location and details
    // 5. Lock trip recording for evidence
    
    setIsActivated(true);
    setIsConfirming(false);
    
    toast.success('Emergency alert activated!', {
      description: 'Help is on the way. Stay safe.',
    });

    // Simulate emergency response
    setTimeout(() => {
      toast.info('Emergency contacts have been notified', {
        description: `Location shared: ${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`,
      });
    }, 2000);
  };

  const handleCancel = () => {
    setIsConfirming(false);
    setEmergencyType('');
    setDescription('');
    setNotifyEmergencyServices(false);
    setNotifyEmergencyContacts(true);
    onClose();
  };

  if (isActivated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <Shield className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl text-red-600">
              Emergency Alert Active
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Help has been notified and is on the way
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Status Updates */}
            <Card className="p-4 bg-red-50 border-red-200">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Emergency contacts notified</p>
                    <p className="text-xs text-gray-600">Sent at {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Platform support alerted</p>
                    <p className="text-xs text-gray-600">Response team activated</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location shared</p>
                    <p className="text-xs text-gray-600">Live tracking active</p>
                  </div>
                </div>

                {notifyEmergencyServices && (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-2 border-yellow-500 rounded-full border-t-transparent animate-spin" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contacting emergency services</p>
                      <p className="text-xs text-gray-600">Please stay on the line</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Current Location */}
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">Current Location</p>
                  <p className="text-xs text-gray-600 font-mono">
                    {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Location is being shared with emergency contacts
                  </p>
                </div>
              </div>
            </Card>

            {/* Emergency Contacts */}
            {emergencyContacts.length > 0 && (
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-2">Notified Contacts</p>
                    <div className="space-y-2">
                      {emergencyContacts.map((contact, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <div>
                            <p className="font-medium text-gray-900">{contact.name}</p>
                            <p className="text-gray-600">{contact.relationship}</p>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sent
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Safety Tips */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-2">Safety Tips</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Stay calm and in a safe location if possible</li>
                    <li>• Keep your phone charged and accessible</li>
                    <li>• Do not end this alert until help arrives</li>
                    <li>• Call emergency services directly if in immediate danger</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel Alert
            </Button>
            <Button variant="destructive">
              <Phone className="h-4 w-4 mr-2" />
              Call Emergency Services
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isConfirming) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">Confirm Emergency Alert</DialogTitle>
            <DialogDescription className="text-center">
              This will immediately notify emergency contacts and platform support
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-900 font-medium mb-2">
                You are about to activate an emergency alert for:
              </p>
              <p className="text-lg font-semibold text-yellow-900">
                {emergencyTypes.find(t => t.id === emergencyType)?.label}
              </p>
            </Card>

            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-medium">The following actions will be taken:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {notifyEmergencyContacts && (
                  <li>Notify {emergencyContacts.length} emergency contact(s)</li>
                )}
                <li>Alert platform support team</li>
                <li>Share your live location</li>
                <li>Record incident details</li>
                {notifyEmergencyServices && <li>Contact emergency services (911)</li>}
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsConfirming(false)} className="w-full sm:w-auto">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmSOS} className="w-full sm:w-auto">
              <Shield className="h-4 w-4 mr-2" />
              Activate Emergency Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-xl">Emergency SOS</DialogTitle>
              <DialogDescription>
                Get immediate help in an emergency situation
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Emergency Type Selection */}
          <div>
            <Label className="text-base font-semibold mb-3 block">What type of emergency?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    emergencyType === type.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setEmergencyType(type.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">{type.label}</p>
                        {emergencyType === type.id && (
                          <CheckCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          {emergencyType && (
            <>
              <div>
                <Label htmlFor="description">Additional Details (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any additional information that might help..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              {/* Notification Options */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Who should be notified?</Label>
                
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="emergency-contacts"
                      checked={notifyEmergencyContacts}
                      onCheckedChange={(checked) => setNotifyEmergencyContacts(checked === true)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="emergency-contacts" className="cursor-pointer font-medium">
                        Emergency Contacts
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        {emergencyContacts.length > 0
                          ? `Notify ${emergencyContacts.length} saved contact(s)`
                          : 'No emergency contacts on file'}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="emergency-services"
                      checked={notifyEmergencyServices}
                      onCheckedChange={(checked) => setNotifyEmergencyServices(checked === true)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="emergency-services" className="cursor-pointer font-medium">
                        Emergency Services (911)
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        For immediate life-threatening emergencies
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Warning */}
              <Card className="p-4 bg-red-50 border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900 mb-1">
                      Important: False alarms have consequences
                    </p>
                    <p className="text-xs text-red-800">
                      Misuse of emergency services may result in account suspension and legal action.
                      Only use this feature in genuine emergency situations.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Current Trip Info */}
          <Card className="p-4 bg-gray-50">
            <p className="text-sm font-medium text-gray-900 mb-3">Current Trip Information</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-gray-600">Driver</p>
                <p className="font-medium text-gray-900">{driverName}</p>
              </div>
              {driverPhone && (
                <div>
                  <p className="text-gray-600">Driver Phone</p>
                  <p className="font-medium text-gray-900">{driverPhone}</p>
                </div>
              )}
              <div>
                <p className="text-gray-600">Trip ID</p>
                <p className="font-medium text-gray-900 font-mono">{tripId}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="font-medium text-gray-900">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleActivateSOS}
            disabled={!emergencyType}
            className="bg-red-600 hover:bg-red-700"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Activate SOS Emergency Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
