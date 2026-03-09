import { useLocalSearchParams } from 'expo-router';
import DepositViaMnoScreen from '@/screens/pay-via-mno';
import { PROVIDER_LABELS } from '@/constants';
import { SupportedProviders } from '@/types/graphql';
import { StatusScreen } from '@/components/fallbacks/status-screen';
import { ScreenContainer } from '@/layout/safe-area-layout';

const isSupportedProvider = (
  value: string
): value is SupportedProviders => {
  return Object.values(SupportedProviders).includes(
    value as SupportedProviders
  );
};

function DepositViaMnoRoute() {
  const { provider } = useLocalSearchParams<{ provider?: string }>();
  const providerValue = Array.isArray(provider) ? provider[0] : provider;

  if (!providerValue || !isSupportedProvider(providerValue)) {
    return (
      <ScreenContainer useSafeArea={true}>
        <StatusScreen
          status="failed"
          title="Unsupported Provider"
          message="The selected mobile money provider is not supported."
          buttonText="Go Back"
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
