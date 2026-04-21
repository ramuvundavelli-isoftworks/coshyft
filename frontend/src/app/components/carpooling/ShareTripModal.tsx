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
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import {
  Share2,
  Copy,
  Mail,
  MessageCircle,
  CheckCircle,
  QrCode,
  Clock,
  MapPin,
  User,
  Link as LinkIcon,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { generateShareCode, generateShareLink } from '../../utils/tripTracking';

interface ShareTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  driverName: string;
  origin: string;
  destination: string;
  departureTime: string;
  estimatedArrival: string;
  existingShareCode?: string;
}

export default function ShareTripModal({
  isOpen,
  onClose,
  tripId,
  driverName,
  origin,
  destination,
  departureTime,
  estimatedArrival,
  existingShareCode,
}: ShareTripModalProps) {
  const [shareCode] = useState(existingShareCode || generateShareCode());
  const [shareLink] = useState(generateShareLink(tripId, shareCode));
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'email' | 'sms' | 'qr'>('link');

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareLink).then(() => {
          setCopied(true);
          toast.success('Link copied to clipboard!');
          setTimeout(() => setCopied(false), 3000);
        }).catch(() => {
          // If clipboard API fails, use fallback
          fallbackCopyToClipboard(shareLink);
          setCopied(true);
          toast.success('Link copied to clipboard!');
          setTimeout(() => setCopied(false), 3000);
        });
      } else {
        // Fallback for when clipboard API is not available
        fallbackCopyToClipboard(shareLink);
        setCopied(true);
        toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (error) {
      fallbackCopyToClipboard(shareLink);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCopyCode = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareCode).then(() => {
          toast.success('Share code copied!');
        }).catch(() => {
          fallbackCopyToClipboard(shareCode);
          toast.success('Share code copied!');
        });
      } else {
        fallbackCopyToClipboard(shareCode);
        toast.success('Share code copied!');
      }
    } catch (error) {
      fallbackCopyToClipboard(shareCode);
      toast.success('Share code copied!');
    }
  };

  // Fallback copy method for when Clipboard API is not available
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Could not copy text', err);
    }
    document.body.removeChild(textArea);
  };

  const handleSendEmail = () => {
    if (!emailAddress) {
      toast.error('Please enter an email address');
      return;
    }

    // In production, this would send an actual email
    const subject = encodeURIComponent(`Track my trip with ${driverName}`);
    const body = encodeURIComponent(
      `Hi!\n\nI'm sharing my trip details with you for safety. You can track my journey in real-time using this link:\n\n${shareLink}\n\nOr use this code: ${shareCode}\n\nTrip Details:\n• Driver: ${driverName}\n• From: ${origin}\n• To: ${destination}\n• Departure: ${departureTime}\n• ETA: ${estimatedArrival}\n\nStay safe!`
    );

    window.open(`mailto:${emailAddress}?subject=${subject}&body=${body}`, '_blank');
    toast.success('Email client opened!');
    setEmailAddress('');
  };

  const handleSendSMS = () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    // In production, this would use SMS API
    const message = encodeURIComponent(
      `Track my trip: ${shareLink}\nCode: ${shareCode}\nDriver: ${driverName}`
    );

    // This opens the SMS app on mobile devices
    window.open(`sms:${phoneNumber}?body=${message}`, '_blank');
    toast.success('SMS app opened!');
    setPhoneNumber('');
  };

  const shareOptions = [
    {
      id: 'link',
      label: 'Share Link',
      icon: LinkIcon,
      description: 'Copy shareable tracking link',
    },
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      description: 'Send via email',
    },
    {
      id: 'sms',
      label: 'Text Message',
      icon: MessageCircle,
      description: 'Send via SMS',
    },
    {
      id: 'qr',
      label: 'QR Code',
      icon: QrCode,
      description: 'Generate QR code',
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-info-subtle rounded-full flex items-center justify-center">
              <Share2 className="h-6 w-6 text-info" />
            </div>
            <div>
              <DialogTitle className="text-xl">Share Trip Tracking</DialogTitle>
              <DialogDescription>
                Let others follow your journey in real-time
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Trip Summary */}
          <Card className="p-4 bg-gradient-to-br from-info-subtle to-info-subtle">
            <div className="flex items-start gap-3 mb-3">
              <Globe className="h-5 w-5 text-info mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-info mb-1">
                  Live Tracking Link Active
                </p>
                <p className="text-xs text-info">
                  Anyone with this link can see your real-time location during the trip
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-info">Driver</p>
                <p className="font-medium text-info">{driverName}</p>
              </div>
              <div>
                <p className="text-info">Share Code</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-info text-sm font-mono">{shareCode}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={handleCopyCode}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-info">From</p>
                <p className="font-medium text-info">{origin}</p>
              </div>
              <div>
                <p className="text-info">To</p>
                <p className="font-medium text-info">{destination}</p>
              </div>
            </div>
          </Card>

          {/* Share Method Tabs */}
          <div className="grid grid-cols-4 gap-2">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setActiveTab(option.id as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  activeTab === option.id
                    ? 'border-info bg-info-subtle'
                    : 'border-border hover:border-border'
                }`}
              >
                <option.icon
                  className={`h-5 w-5 mx-auto mb-1 ${
                    activeTab === option.id ? 'text-info' : 'text-muted-foreground'
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    activeTab === option.id ? 'text-info' : 'text-foreground'
                  }`}
                >
                  {option.label}
                </p>
              </button>
            ))}
          </div>

          {/* Share Content */}
          <Card className="p-6">
            {activeTab === 'link' && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Tracking Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={handleCopyLink} className="flex-shrink-0">
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this link with anyone you want to track your trip
                  </p>
                </div>

                <div className="p-4 bg-warning-subtle border border-warning/25 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-warning">
                        Link expires after trip completion
                      </p>
                      <p className="text-xs text-warning mt-1">
                        The tracking link will automatically deactivate once your trip is complete
                        for privacy and security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                    Recipient Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="friend@example.com"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll open your email client with a pre-filled message
                  </p>
                </div>

                <div className="p-4 bg-background-subtle border rounded-lg">
                  <p className="text-xs font-medium text-foreground mb-2">Email Preview:</p>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p className="font-medium">Subject: Track my trip with {driverName}</p>
                    <p className="whitespace-pre-line">
                      Hi!{'\n\n'}
                      I'm sharing my trip details with you for safety. You can track my journey in
                      real-time using this link:{'\n\n'}
                      {shareLink}
                    </p>
                  </div>
                </div>

                <Button onClick={handleSendEmail} className="w-full" disabled={!emailAddress}>
                  <Mail className="h-4 w-4 mr-2" />
                  Open Email Client
                </Button>
              </div>
            )}

            {activeTab === 'sms' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                    Recipient Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    We'll open your messaging app with a pre-filled text
                  </p>
                </div>

                <div className="p-4 bg-background-subtle border rounded-lg">
                  <p className="text-xs font-medium text-foreground mb-2">SMS Preview:</p>
                  <div className="text-xs text-muted-foreground">
                    <p>Track my trip: {shareLink}</p>
                    <p>Code: {shareCode}</p>
                    <p>Driver: {driverName}</p>
                  </div>
                </div>

                <Button onClick={handleSendSMS} className="w-full" disabled={!phoneNumber}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Open Messaging App
                </Button>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="space-y-4">
                <div className="flex flex-col items-center py-6">
                  {/* QR Code Placeholder - In production, use a QR library */}
                  <div className="w-64 h-64 bg-card border-4 border-border rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <QrCode className="h-32 w-32 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">QR Code</p>
                      <p className="text-xs text-muted-foreground mt-1">Scan to track trip</p>
                    </div>
                  </div>

                  <Badge variant="outline" className="mb-4">
                    Code: {shareCode}
                  </Badge>

                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    Scan this QR code with a smartphone camera to instantly access the trip
                    tracking page
                  </p>
                </div>

                <div className="p-4 bg-info-subtle border border-info/25 rounded-lg text-center">
                  <p className="text-xs text-info">
                    📱 Production: Generate scannable QR code using qrcode.react library
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Safety Information */}
          <Card className="p-4 bg-success-subtle border-success/25">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-success mb-1">
                  Tracking Features Included
                </p>
                <ul className="text-xs text-success space-y-1">
                  <li>• Real-time location updates every 30 seconds</li>
                  <li>• Live ETA and route progress</li>
                  <li>• Driver and vehicle information</li>
                  <li>• Trip status notifications</li>
                  <li>• Automatic link expiration after trip</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Quick Share Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleCopyLink();
                // In production, integrate with WhatsApp API
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    `Track my trip: ${shareLink}\nCode: ${shareCode}`
                  )}`,
                  '_blank'
                );
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // In production, integrate with Facebook Messenger
                toast.info('Opening Messenger...');
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Messenger
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // In production, integrate with Telegram
                toast.info('Opening Telegram...');
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Telegram
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleCopyLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}