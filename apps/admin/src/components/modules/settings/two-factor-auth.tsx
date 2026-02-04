'use client';

import React, { useState } from 'react';
import { Button } from 'k-polygon-assets/components';
import { Typography } from '@/components/sub-modules/typography/typography';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Shield, ShieldCheck, ArrowRight } from 'lucide-react';
import { TwoFactorAuthModal } from './two-factor-auth-modal';

interface TwoFactorAuthProps {
  className?: string;
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => Promise<void>;
}

export const TwoFactorAuth = ({ className, isEnabled = false, onToggle }: TwoFactorAuthProps) => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(isEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handle2FAToggle = async () => {
    try {
      setIsLoading(true);

      if (onToggle) {
        await onToggle(!is2FAEnabled);
      } else {
        // Mock API call for demo
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setIs2FAEnabled(!is2FAEnabled);

      if (!is2FAEnabled) {
        toast.success('Two-factor authentication enabled successfully');
      } else {
        toast.success('Two-factor authentication disabled');
      }
    } catch {
      toast.error('Failed to update two-factor authentication settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivateClick = () => {
    if (!is2FAEnabled) {
      setShowModal(true);
    } else {
      handle2FAToggle();
    }
  };

  const handleModalComplete = () => {
    setIs2FAEnabled(true);
    toast.success('Two-factor authentication enabled successfully');
  };

  return (
    <>
      <div className={cn('space-y-6', className)}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={cn('p-2 rounded-lg', is2FAEnabled ? 'bg-green-100' : 'bg-gray-100')}>
              {is2FAEnabled ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <Shield className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <Typography variant="h3" className="text-gray-900 mb-1">
                Two-Factor Authentication
              </Typography>
              <Typography variant="muted" className="text-gray-600">
                {is2FAEnabled
                  ? 'Your account is protected with 2FA'
                  : 'Choose how you want to receive your authentication codes'}
              </Typography>
            </div>
          </div>
        </div>

        {!is2FAEnabled && (
          <Button onClick={handleActivateClick} disabled={isLoading} className="inline-flex items-center">
            Activate
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}

        {is2FAEnabled && (
          <div className="border rounded-lg p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <Typography variant="p" className="text-green-800 font-medium">
                    Two-factor authentication is active
                  </Typography>
                </div>
                <Typography variant="muted" className="text-green-700">
                  Your account is protected with an additional security layer
                </Typography>
              </div>
              <Button
                onClick={handle2FAToggle}
                disabled={isLoading}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                {isLoading ? 'Loading...' : 'Disable'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <TwoFactorAuthModal isOpen={showModal} onClose={() => setShowModal(false)} onComplete={handleModalComplete} />
    </>
  );
};
