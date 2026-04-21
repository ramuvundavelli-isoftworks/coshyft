// Leap Card Integration Component
// Connect and sync Leap Card data for automated journey tracking

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { CreditCard, CheckCircle, AlertCircle, Link as LinkIcon, Unlink, RefreshCw, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface LeapCardConnectionProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (cardNumber: string) => void;
}

export function LeapCardConnection({ isOpen, onClose, onConnect }: LeapCardConnectionProps) {
  const [step, setStep] = useState<'input' | 'verify' | 'connected'>('input');
  const [cardNumber, setCardNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    if (cardNumber.length === 16) {
      setStep('verify');
      toast.success('Verification code sent to your registered mobile');
    }
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      setStep('connected');
      setIsConnected(true);
      if (onConnect) {
        onConnect(cardNumber);
      }
      toast.success('Leap Card connected successfully');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setStep('input');
    setCardNumber('');
    setVerificationCode('');
    toast.success('Leap Card disconnected');
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep('input');
      setCardNumber('');
      setVerificationCode('');
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-brand-500" />
            Leap Card Integration
          </DialogTitle>
          <DialogDescription>
            Connect your Leap Card to automatically track your public transport journeys
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Step 1: Input Card Number */}
          {step === 'input' && (
            <div className="space-y-4">
              <div className="p-4 bg-info-subtle border border-info/25 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-info">Secure Connection</p>
                    <p className="text-xs text-info mt-1">
                      Your Leap Card data is encrypted and only used for emissions tracking. We never
                      access your payment information.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="card-number">Leap Card Number</Label>
                <Input
                  id="card-number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (value.length <= 16 && /^\d*$/.test(value)) {
                      setCardNumber(value);
                    }
                  }}
                  maxLength={19}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter the 16-digit number on your Leap Card
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">What we'll track:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Journey start and end points</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Transport mode (Dublin Bus, DART, Luas)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Journey dates and times</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Distance traveled (for emissions calculation)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Verification */}
          {step === 'verify' && (
            <div className="space-y-4">
              <div className="p-4 bg-success-subtle border border-success/25 rounded-lg text-center">
                <CheckCircle className="h-12 w-12 text-success mx-auto mb-2" />
                <p className="text-sm font-medium text-success">Verification code sent</p>
                <p className="text-xs text-success mt-1">
                  Check your registered mobile number for a 6-digit code
                </p>
              </div>

              <div>
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 6 && /^\d*$/.test(value)) {
                      setVerificationCode(value);
                    }
                  }}
                  maxLength={6}
                  className="font-mono text-center text-2xl tracking-widest"
                />
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toast.success('New verification code sent');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend Code
              </Button>
            </div>
          )}

          {/* Step 3: Connected */}
          {step === 'connected' && (
            <div className="space-y-4">
              <div className="p-6 bg-success-subtle border border-success/25 rounded-lg text-center">
                <CheckCircle className="h-16 w-16 text-success mx-auto mb-3" />
                <p className="text-lg font-semibold text-success">Connected Successfully!</p>
                <p className="text-sm text-success mt-2">
                  Your Leap Card is now linked to your enwayu account
                </p>
              </div>

              <Card className="p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Connected Card</span>
                  </div>
                  <Badge className="bg-success-subtle text-success border-success/25">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  •••• •••• •••• {cardNumber.slice(-4)}
                </p>
              </Card>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Next steps:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Journeys will sync automatically every 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>Emissions calculated automatically from your trips</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>No manual journey logging required</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleDisconnect}>
                <Unlink className="h-4 w-4 mr-2" />
                Disconnect Leap Card
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {step === 'connected' ? 'Close' : 'Cancel'}
          </Button>
          {step === 'input' && (
            <Button onClick={handleConnect} disabled={cardNumber.length !== 16}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Connect Card
            </Button>
          )}
          {step === 'verify' && (
            <Button onClick={handleVerify} disabled={verificationCode.length !== 6}>
              Verify
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Leap Card Journey Sync Status Component
interface LeapCardStatusProps {
  isConnected: boolean;
  lastSync?: Date;
  journeyCount?: number;
  onConnect: () => void;
}

export function LeapCardStatus({ isConnected, lastSync, journeyCount = 0, onConnect }: LeapCardStatusProps) {
  return (
    <Card className="p-4 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${isConnected ? 'bg-success-subtle' : 'bg-muted'}`}>
            <CreditCard className={`h-6 w-6 ${isConnected ? 'text-success' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <p className="font-semibold text-foreground">Leap Card Integration</p>
            {isConnected ? (
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-success-subtle text-success border-success/25">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                {lastSync && (
                  <span className="text-xs text-muted-foreground">
                    Last sync: {lastSync.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Automatically track your public transport journeys</p>
            )}
          </div>
        </div>
        {isConnected ? (
          <div className="text-right">
            <p className="text-2xl font-semibold text-foreground">{journeyCount}</p>
            <p className="text-xs text-muted-foreground">Journeys synced</p>
          </div>
        ) : (
          <Button onClick={onConnect}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Connect
          </Button>
        )}
      </div>
    </Card>
  );
}
