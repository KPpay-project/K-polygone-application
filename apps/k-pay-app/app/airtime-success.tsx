import React from 'react';
import { TwoFactorAuthSuccess } from '@/components/ui/two-factor-auth-success/two-factor-auth-success';
import { router } from 'expo-router';

export default function AirtimeSuccessScreen() {
  const handleGoBackHome = () => {
    // Navigate back to the home screen
    router.replace('/(tabs)/home');
  };

  return (
    <TwoFactorAuthSuccess
      title="Airtime purchased Successfully"
      subtitle="Your airtime has been sent to your phone Number"
      buttonText="Go back home"
      onButtonPress={handleGoBackHome}
    />
  );
}
