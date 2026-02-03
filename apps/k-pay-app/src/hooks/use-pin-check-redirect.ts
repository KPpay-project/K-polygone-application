import { useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { useQuery } from '@apollo/client';
import {
  HAS_PAYMENT_PIN,
  HasPaymentPinResponse,
} from '@/lib/graphql/queries/misc';

interface UsePinCheckRedirectOptions {
  enabled?: boolean;
  onComplete?: () => void;
}

export const usePinCheckRedirect = (
  options: UsePinCheckRedirectOptions = {}
) => {
  const { enabled = true, onComplete } = options;

  const {
    data: pinData,
    loading: pinLoading,
    refetch,
  } = useQuery<{ hasPaymentPin: HasPaymentPinResponse }>(HAS_PAYMENT_PIN, {
    fetchPolicy: 'network-only',
    skip: !enabled,
  });

  const checkAndRedirect = useCallback(() => {
    if (!enabled || pinLoading) return;

    if (pinData?.hasPaymentPin && !pinData.hasPaymentPin.hasPin) {
      router.replace('/set-up-pin');
    } else {
      router.replace('/(tabs)/home');
    }
    onComplete?.();
  }, [enabled, pinLoading, pinData, onComplete]);

  useEffect(() => {
    if (enabled && !pinLoading && pinData) {
      checkAndRedirect();
    }
  }, [enabled, pinLoading, pinData, checkAndRedirect]);

  return {
    isChecking: pinLoading,
    hasPin: pinData?.hasPaymentPin?.hasPin ?? null,
    checkAndRedirect,
    refetch,
  };
};
