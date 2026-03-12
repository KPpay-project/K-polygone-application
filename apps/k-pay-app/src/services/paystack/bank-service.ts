import { PAYSTACK_TEST_KEY } from '@/constants';
import { Bank, BankAccountDetails } from './types';

export const PAYSTACK_API = {
  BANKS: 'https://api.paystack.co/bank',
  RESOLVE_ACCOUNT: 'https://api.paystack.co/bank/resolve',
};

export class PaystackBankService {
  static async fetchBanks(): Promise<Bank[]> {
    try {
      const response = await fetch(PAYSTACK_API.BANKS, {
        headers: {
          Authorization: `Bearer ${PAYSTACK_TEST_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status) {
        return data.data
          .filter((bank: Bank) => bank.active)
          .sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));
      }
      throw new Error(data.message || 'Failed to fetch banks');
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch banks');
    }
  }

  static async resolveBankAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<BankAccountDetails | null> {
    try {
      const params = new URLSearchParams({
        account_number: accountNumber,
        bank_code: bankCode,
      });
      const response = await fetch(
        `${PAYSTACK_API.RESOLVE_ACCOUNT}?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${PAYSTACK_TEST_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.status) {
        return data.data as BankAccountDetails;
      }
      return null;
    } catch (err) {
      console.error('Error resolving bank account:', err);
      return null;
    }
  }
}
