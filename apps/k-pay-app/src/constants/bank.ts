import { PAYSTACK_TEST_KEY } from '.';

export const ENV = {
  APP_NAME: 'KPay',
  API_URL: 'http://localhost:3000',
  PAYSTACK_TEST_KEY,
  FLUTTERWAVE_TEST_KEY: '',
};

export const FLUTTERWAVE_API = {
  BASE_URL:
    'https://corsproxy.io/?${encodeURIComponent("https://api.flutterwave.com/v3")}',
  ENDPOINTS: {
    BANKS: (countryCode: string) =>
      `/banks/${countryCode}?include_provider_type=1`,
    RESOLVE_ACCOUNT: '/accounts/resolve',
  },
  HEADERS: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${ENV.FLUTTERWAVE_TEST_KEY}`,
  },
};

export const BANK_PROVIDERS = {
  PAYSTACK: 'paystack',
  FLUTTERWAVE: 'flutterwave',
} as const;

export type BankProvider = keyof typeof BANK_PROVIDERS;
