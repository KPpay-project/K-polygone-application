export interface Bank {
  id: number;
  code: string;
  name: string;
  active: boolean;
  slug?: string;
  currency?: string;
  type?: string;
}

export interface BankAccountDetails {
  account_number: string;
  account_name: string;
  bank_id?: number;
}

export type BankProvider = 'paystack' | 'flutterwave';

export interface UnifiedBank {
  code: string;
  name: string;
  provider: BankProvider;
}

export interface UnifiedAccountDetails {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  provider: BankProvider;
}

export interface BankServiceConfig {
  provider: BankProvider;
  country?: string;
  secretKey: string;
}
