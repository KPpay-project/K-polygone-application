import { SupportedProviders } from '@repo/types';

export const PAYSTACK_TEST_KEY = import.meta.env.VITE_PAYSTACK_TEST_KEY || '';
export const FLUTTERWAVE_TEST_KEY = '';
const JWT_TOKEN_NAME = 'kp-user-token';
const JWT_TOKEN_EXPIRY = 'kp-user-token-expiry';
const JWT_REFRESH_TOKEN_NAME = 'kp-user-refresh-token';
export const USER_ROLE = 'kp-user-role';
const BASE_ENDPOINT_URL =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://move-bars-wispy-fog-4442.fly.dev/api/move-bars';
const DEFAULT_ICON_SIZE = {
  DASHBOARD: '18'
};

export enum UserRoleEnum {
  User = 'user',
  Client = 'client',
  Merchant = 'merchant'
}

const PROVIDER_LABELS: Record<SupportedProviders, string> = {
  [SupportedProviders.AIRTEL]: 'Airtel Money',
  [SupportedProviders.M_PESA]: 'M-Pesa',
  [SupportedProviders.MTN_MOMO]: 'MTN Mobile Money',
  [SupportedProviders.ORANGE]: 'Orange Money'
};

const TRANSFER_PROVIDERS_ARRAY = [
  {
    key: SupportedProviders.MTN_MOMO,
    label: 'MTN Mobile Money',
    description: 'Send and receive money instantly with MTN’s mobile wallet',
    logo: 'https://images.seeklogo.com/logo-png/55/1/mtn-momo-mobile-money-uganda-logo-png_seeklogo-556395.png'
  },
  {
    key: SupportedProviders.M_PESA,
    label: 'M-Pesa',
    description: 'Trusted mobile money transfer and payment service powered by Safaricom and Vodafone',
    logo: 'https://assets.e-agriculture.fao.org/public/uploads/news/2017/05/m-pesa-logo.jpg'
  },
  {
    key: SupportedProviders.ORANGE,
    label: 'Orange Money',
    description: 'Convenient and secure payments, transfers, and withdrawals with Orange.',
    logo: 'https://images.seeklogo.com/logo-png/44/1/orange-money-logo-png_seeklogo-440383.png'
  },
  {
    key: SupportedProviders.AIRTEL,
    label: 'Airtel Money',
    description: 'Fast, reliable, and easy transactions directly from your Airtel line.',
    logo: 'https://images.seeklogo.com/logo-png/55/1/airtel-money-uganda-logo-png_seeklogo-556391.png'
  }
];

const DISPUTE_SUBJECTS = [
  'Unauthorized transaction',
  'Card charged twice',
  'Merchant did not deliver',
  'Refund not received',
  'Failed transfer',
  'Chargeback follow-up',
  'ATM cash not dispensed',
  'Payment link fraud/scam',
  'KYC/verification issue',
  'Incorrect amount charged',
  'Subscription canceled but still charged',
  'POS declined but charged'
] as const;

export {
  JWT_TOKEN_EXPIRY,
  JWT_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
  BASE_ENDPOINT_URL,
  DEFAULT_ICON_SIZE,
  PROVIDER_LABELS,
  TRANSFER_PROVIDERS_ARRAY,
  DISPUTE_SUBJECTS
};
