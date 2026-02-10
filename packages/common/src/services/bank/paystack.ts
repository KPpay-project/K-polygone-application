import { PAYSTACK_API } from '../../constants/bank';
import { UnifiedBank, UnifiedAccountDetails } from './types';

interface PaystackBank {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
}

interface PaystackAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

export class PaystackBankService {
  private readonly headers: Record<string, string>;

  constructor(secretKey: string) {
    this.headers = {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async fetchBanks(): Promise<UnifiedBank[]> {
    try {
      const response = await fetch(PAYSTACK_API.BANKS, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch banks');
      }

      const data = await response.json();
      if (data.status) {
        return data.data
          .filter((bank: PaystackBank) => bank.active)
          .sort((a: PaystackBank, b: PaystackBank) => a.name.localeCompare(b.name))
          .map((bank: PaystackBank) => ({
            code: bank.code,
            name: bank.name,
            provider: 'paystack',
          }));
      }
      throw new Error(data.message || 'Failed to fetch banks');
    } catch (err) {
      console.error('Error fetching banks:', err);
      return [];
    }
  }

  async resolveBankAccount(
    accountNumber: string,
    bankCode: string,
  ): Promise<UnifiedAccountDetails | null> {
    try {
      const url = new URL(PAYSTACK_API.RESOLVE_ACCOUNT);
      url.searchParams.append('account_number', accountNumber);
      url.searchParams.append('bank_code', bankCode);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as PaystackAccountResponse;

      if (data.status) {
        return {
          accountNumber: data.data.account_number,
          accountName: data.data.account_name,
          bankCode: bankCode,
          provider: 'paystack',
        };
      }
      return null;
    } catch (err) {
      console.error('Error resolving bank account:', err);
      return null;
    }
  }
}
