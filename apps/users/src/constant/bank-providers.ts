export const BANK_PROVIDERS = ['paystack', 'flutterwave'] as const;
export type BankProvider = (typeof BANK_PROVIDERS)[number];
