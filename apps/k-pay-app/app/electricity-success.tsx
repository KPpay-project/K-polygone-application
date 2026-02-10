import React from 'react';
import { TwoFactorAuthSuccess } from '@/components/ui/two-factor-auth-success/two-factor-auth-success';
import { router } from 'expo-router';

export default function ElectricitySuccessScreen() {
  const handleGoBackHome = () => {
    // Navigate back to the home screen
    router.replace('/(tabs)/home');
  };

  return (
    <TwoFactorAuthSuccess
      title="Electricity Purchase"
      subtitle="Your electricity has been sent to your Meter Number"
      buttonText="Go back home"
      onButtonPress={handleGoBackHome}
    />
  );
}
