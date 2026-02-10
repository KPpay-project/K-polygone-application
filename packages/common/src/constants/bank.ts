export const FLUTTERWAVE_API = {
  BASE_URL: 'https://corsproxy.io/?${encodeURIComponent("https://api.flutterwave.com/v3")}',
  ENDPOINTS: {
    BANKS: (countryCode: string) => `/banks/${countryCode}?include_provider_type=1`,
    RESOLVE_ACCOUNT: '/accounts/resolve',
  },
};

export const PAYSTACK_API = {
  BANKS: 'https://api.paystack.co/bank',
  RESOLVE_ACCOUNT: 'https://api.paystack.co/bank/resolve',
};
