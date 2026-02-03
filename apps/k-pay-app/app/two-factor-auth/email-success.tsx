import React from 'react';
import { TwoFactorAuthSuccess } from '@/components/ui';

export default function EmailSuccess() {
  return (
    <TwoFactorAuthSuccess subtitle="You'll now be required to enter a verification code from your email whenever you sign in." />
  );
}
