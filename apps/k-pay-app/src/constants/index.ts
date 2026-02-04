import { SupportedProviders } from '@/types/graphql';
export const PAYSTACK_TEST_KEY =
  process.env.EXPO_PUBLIC_PAYSTACK_TEST_KEY || '';
export const FLUTTERWAVE_TEST_KEY = 'FLWSECK_TEST-SANDBOXDEMOKEY-X';

const GRAPHQL_ENDPOINT = 'https://kp-pay.fly.dev/api/kp-pay';

const PROVIDER_LABELS: Record<SupportedProviders, string> = {
  [SupportedProviders.AIRTEL]: 'Airtel Money',
  [SupportedProviders.M_PESA]: 'M-Pesa',
  [SupportedProviders.MTN_MOMO]: 'MTN Mobile Money',
  [SupportedProviders.ORANGE]: 'Orange Money',
};

const DEFAULT_BLURHASH =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const TRANSFER_PROVIDERS_ARRAY = [
  {
    key: SupportedProviders.MTN_MOMO,
    label: 'MTN Mobile Money',
    description: 'Send and receive money instantly with MTN’s mobile wallet',
    logo: 'https://images.seeklogo.com/logo-png/55/1/mtn-momo-mobile-money-uganda-logo-png_seeklogo-556395.png',
  },
  {
    key: SupportedProviders.M_PESA,
    label: 'M-Pesa',
    description:
      'Trusted mobile money transfer and payment service powered by Safaricom and Vodafone',
    logo: 'https://assets.e-agriculture.fao.org/public/uploads/news/2017/05/m-pesa-logo.jpg',
  },
  {
    key: SupportedProviders.ORANGE,
    label: 'Orange Money',
    description:
      'Convenient and secure payments, transfers, and withdrawals with Orange.',
    logo: 'https://images.seeklogo.com/logo-png/44/1/orange-money-logo-png_seeklogo-440383.png',
  },
  {
    key: SupportedProviders.AIRTEL,
    label: 'Airtel Money',
    description:
      'Fast, reliable, and easy transactions directly from your Airtel line.',
    logo: 'https://images.seeklogo.com/logo-png/55/1/airtel-money-uganda-logo-png_seeklogo-556391.png',
  },
];

const KYC_ROUTE_COUNT = 7;
const FALL_BACK_IMAGE = 'https://api.dicebear.com/9.x/glass/svg?seed=';

export {
  GRAPHQL_ENDPOINT,
  PROVIDER_LABELS,
  TRANSFER_PROVIDERS_ARRAY,
  KYC_ROUTE_COUNT,
  FALL_BACK_IMAGE,
  DEFAULT_BLURHASH,
};
