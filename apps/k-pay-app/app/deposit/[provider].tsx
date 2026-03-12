import { router, useLocalSearchParams } from 'expo-router';
import DepositViaMnoScreen from '@/screens/pay-via-mno';
import { PROVIDER_LABELS } from '@/constants';
import { SupportedProviders } from '@/types/graphql';
import { StatusScreen } from '@/components/fallbacks/status-screen';
import { ScreenContainer } from '@/layout/safe-area-layout';

const PROVIDER_PARAM_TO_ENUM: Record<string, SupportedProviders> = {
  airtel: SupportedProviders.AIRTEL,
  m_pesa: SupportedProviders.M_PESA,
  mpesa: SupportedProviders.M_PESA,
  mtn_momo: SupportedProviders.MTN_MOMO,
  mtnmomo: SupportedProviders.MTN_MOMO,
  orange: SupportedProviders.ORANGE,
};

function DepositViaMnoRoute() {
  const { provider } = useLocalSearchParams<{ provider?: string }>();
  const rawProvider = Array.isArray(provider) ? provider[0] : provider;
  const normalizedProvider = rawProvider
    ?.trim()
    .toLowerCase()
    .replace(/[-\s]/g, '_');
  const providerValue = normalizedProvider
    ? PROVIDER_PARAM_TO_ENUM[normalizedProvider]
    : undefined;

  const handleInvalidProviderBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/deposit');
  };

  if (!providerValue) {
    return (
      <ScreenContainer useSafeArea={true}>
        <StatusScreen
          status="failed"
          title="Unsupported Provider"
          message="The selected mobile money provider is not supported."
          buttonText="Go Back"
          onPress={handleInvalidProviderBack}
        />
      </ScreenContainer>
    );
  }

  return (
    <DepositViaMnoScreen
      title={`Add Money via ${PROVIDER_LABELS[providerValue]}`}
      provider={providerValue}
    />
  );
}

export default DepositViaMnoRoute;
