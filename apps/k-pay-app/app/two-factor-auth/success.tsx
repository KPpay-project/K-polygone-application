import React from 'react';
import { TwoFactorAuthSuccess } from '@/components/ui';

const TwoFactorAuthSuccessScreen = () => {
  return (
    <TwoFactorAuthSuccess subtitle="You'll now be required to enter a verification code from your authenticator app whenever you sign in." />
  );
};

export default TwoFactorAuthSuccessScreen;
