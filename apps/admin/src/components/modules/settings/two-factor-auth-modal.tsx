'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from 'k-polygon-assets/components';
import { Typography } from '@/components/sub-modules/typography/typography';
import { cn } from '@/lib/utils';
import { ArrowRight, Smartphone, Mail, MessageSquare, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type AuthMethod = 'app' | 'sms' | 'email';
type ModalStep = 'method-selection' | 'qr-code' | 'verification' | 'success';

export const TwoFactorAuthModal = ({ isOpen, onClose, onComplete }: TwoFactorAuthModalProps) => {
  const [currentStep, setCurrentStep] = useState<ModalStep>('method-selection');
  const [selectedMethod, setSelectedMethod] = useState<AuthMethod>('app');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [secretKey] = useState('JBSWY3DPEHPK3PXP'); // Mock secret key
  const [isCopied, setIsCopied] = useState(false);

  const handleMethodSelect = (method: AuthMethod) => {
    setSelectedMethod(method);
  };

  const handleActivate = () => {
    if (selectedMethod === 'app') {
      setCurrentStep('qr-code');
    } else {
      // For SMS/Email, go directly to verification
      setCurrentStep('verification');
    }
  };

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setIsCopied(true);
      toast.success('Secret key copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error('Failed to copy secret key');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleConfirmCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error('Please enter a complete 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentStep('success');
    } catch {
      toast.error('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    // Reset state for next time
    setCurrentStep('method-selection');
    setVerificationCode(['', '', '', '', '', '']);
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Typography variant="h2" className="text-gray-900 mb-2">
          2-Factor Authentication
        </Typography>
        <Typography variant="muted" className="text-gray-600">
          Choose how you want to receive your authentication codes
        </Typography>
      </div>

      <div className="space-y-3">
        <div
          className={cn(
            'border rounded-lg p-4 cursor-pointer transition-all',
            selectedMethod === 'app' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          )}
          onClick={() => handleMethodSelect('app')}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                'w-4 h-4 rounded-full border-2',
                selectedMethod === 'app' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              )}
            >
              {selectedMethod === 'app' && <div className="w-full h-full rounded-full bg-white scale-50" />}
            </div>
            <Smartphone className="h-5 w-5 text-gray-600" />
            <div className="flex-1">
              <Typography variant="p" className="font-medium text-gray-900">
                Set up using an authenticator app
              </Typography>
              <Typography variant="small" className="text-green-600 font-medium">
                Recommended
              </Typography>
              <Typography variant="muted" className="text-gray-600 text-sm">
                Use an authenticator app to get your authentication codes
              </Typography>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'border rounded-lg p-4 cursor-pointer transition-all',
            selectedMethod === 'sms' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          )}
          onClick={() => handleMethodSelect('sms')}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                'w-4 h-4 rounded-full border-2',
                selectedMethod === 'sms' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              )}
            >
              {selectedMethod === 'sms' && <div className="w-full h-full rounded-full bg-white scale-50" />}
            </div>
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <div className="flex-1">
              <Typography variant="p" className="font-medium text-gray-900">
                Set up using SMS
              </Typography>
              <Typography variant="muted" className="text-gray-600 text-sm">
                Use SMS to get your authentication codes
              </Typography>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'border rounded-lg p-4 cursor-pointer transition-all',
            selectedMethod === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          )}
          onClick={() => handleMethodSelect('email')}
        >
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                'w-4 h-4 rounded-full border-2',
                selectedMethod === 'email' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              )}
            >
              {selectedMethod === 'email' && <div className="w-full h-full rounded-full bg-white scale-50" />}
            </div>
            <Mail className="h-5 w-5 text-gray-600" />
            <div className="flex-1">
              <Typography variant="p" className="font-medium text-gray-900">
                Set up using Email
              </Typography>
              <Typography variant="muted" className="text-gray-600 text-sm">
                Use your email to get your authentication codes
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleActivate} className="w-full">
        Activate
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  const renderQRCode = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Typography variant="h2" className="text-gray-900 mb-2">
          Authenticator App
        </Typography>
        <Typography variant="muted" className="text-gray-600">
          Scan using an authenticator app
        </Typography>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg border">
          {/* QR Code placeholder - in a real app, you'd generate this */}
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
            <div className="text-center">
              <div
                className="w-32 h-32 bg-black mx-auto mb-2"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='30' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='50' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='70' y='10' width='10' height='10' fill='%23fff'/%3E%3Crect x='10' y='30' width='10' height='10' fill='%23fff'/%3E%3Crect x='30' y='30' width='10' height='10' fill='%23fff'/%3E%3Crect x='50' y='30' width='10' height='10' fill='%23fff'/%3E%3Crect x='70' y='30' width='10' height='10' fill='%23fff'/%3E%3C/svg%3E")`,
                  backgroundSize: 'cover'
                }}
              />
              <Typography variant="small" className="text-gray-500">
                QR Code
              </Typography>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Typography variant="muted" className="text-gray-600 mb-4">
          If you can't scan the code above, enter this text code instead:
        </Typography>
        <div className="flex items-center justify-center space-x-2 bg-gray-50 p-3 rounded-lg">
          <Typography variant="small" className="font-mono text-sm">
            {secretKey}
          </Typography>
          <Button variant="ghost" size="sm" onClick={handleCopySecret} className="h-8 w-8 p-0">
            {isCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button onClick={() => setCurrentStep('verification')} className="w-full">
        Next
      </Button>
    </div>
  );

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Typography variant="h2" className="text-gray-900 mb-2">
          Enter the 6-digit code from your authenticator app
        </Typography>
        <Typography variant="muted" className="text-gray-600">
          Enter the 6-digit code from your authenticator app to verify and complete the pairing process for two-factor
          authentication.
        </Typography>
      </div>

      <div className="flex justify-center space-x-3">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        ))}
      </div>

      <Button
        onClick={handleConfirmCode}
        disabled={isLoading || verificationCode.join('').length !== 6}
        className="w-full"
      >
        {isLoading ? 'Verifying...' : 'Confirm Code'}
      </Button>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div>
        <Typography variant="h2" className="text-gray-900 mb-2">
          Authenticator app paired successfully
        </Typography>
        <Typography variant="muted" className="text-gray-600">
          You have successfully paired an authenticator app with your account. Two-factor authentication will now be
          required when you sign in.
        </Typography>
      </div>

      <Button onClick={handleComplete} className="w-full">
        Done
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'method-selection':
        return renderMethodSelection();
      case 'qr-code':
        return renderQRCode();
      case 'verification':
        return renderVerification();
      case 'success':
        return renderSuccess();
      default:
        return renderMethodSelection();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">{renderCurrentStep()}</DialogContent>
    </Dialog>
  );
};
