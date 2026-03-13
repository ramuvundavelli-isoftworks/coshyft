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
            <CreditCard className="h-6 w-6 text-[#00bc7d]" />
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
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Secure Connection</p>
                    <p className="text-xs text-blue-700 mt-1">
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
                <p className="text-xs text-[#6a7282] mt-1">
                  Enter the 16-digit number on your Leap Card
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[#101828]">What we'll track:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Journey start and end points</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Transport mode (Dublin Bus, DART, Luas)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Journey dates and times</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Distance traveled (for emissions calculation)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Verification */}
          {step === 'verify' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-900">Verification code sent</p>
                <p className="text-xs text-green-700 mt-1">
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
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-3" />
                <p className="text-lg font-semibold text-green-900">Connected Successfully!</p>
                <p className="text-sm text-green-700 mt-2">
                  Your Leap Card is now linked to your enwayu account
                </p>
              </div>

              <Card className="p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-[#4a5565]" />
                    <span className="text-sm font-medium text-[#101828]">Connected Card</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                </div>
                <p className="text-sm text-[#6a7282] font-mono">
                  •••• •••• •••• {cardNumber.slice(-4)}
                </p>
              </Card>

              <div className="space-y-2">
                <p className="text-sm font-medium text-[#101828]">Next steps:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Journeys will sync automatically every 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Emissions calculated automatically from your trips</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#4a5565]">
                    <CheckCircle className="h-4 w-4 text-green-600" />
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
    <Card className="p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
            <CreditCard className={`h-6 w-6 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="font-semibold text-[#101828]">Leap Card Integration</p>
            {isConnected ? (
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                {lastSync && (
                  <span className="text-xs text-[#6a7282]">
                    Last sync: {lastSync.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#6a7282] mt-1">Automatically track your public transport journeys</p>
            )}
          </div>
        </div>
        {isConnected ? (
          <div className="text-right">
            <p className="text-2xl font-semibold text-[#101828]">{journeyCount}</p>
            <p className="text-xs text-[#6a7282]">Journeys synced</p>
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
