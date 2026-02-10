import React from 'react';
import { TwoFactorAuthSuccess } from '@/components/ui/two-factor-auth-success/two-factor-auth-success';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function PinSuccessScreen() {
  const { t } = useTranslation();
  const handleGoBackHome = () => {
    // Navigate back to the More screen
    router.replace('/(tabs)/more');
  };

  return (
    <TwoFactorAuthSuccess
      title={t('pinCreatedSuccessfully')}
      subtitle={t('pinCreatedDescription')}
      buttonText={t('goBackHome')}
      onButtonPress={handleGoBackHome}
    />
  );
}
