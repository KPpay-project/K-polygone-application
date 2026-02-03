import React from 'react';
import { TwoFactorAuthSuccess } from '@/components/ui';

export default function SMSSuccess() {
  return (
    <TwoFactorAuthSuccess subtitle="You'll now be required to enter a verification code from your number whenever you sign in." />
  );
}
