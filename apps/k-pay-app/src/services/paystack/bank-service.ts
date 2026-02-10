import axios from 'axios';
import { PAYSTACK_TEST_KEY } from '@/constants';
import { Bank, BankAccountDetails } from './types';

export const PAYSTACK_API = {
  BANKS: 'https://api.paystack.co/bank',
  RESOLVE_ACCOUNT: 'https://api.paystack.co/bank/resolve',
};

export const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${PAYSTACK_TEST_KEY}`,
    'Content-Type': 'application/json',
  },
});

export class PaystackBankService {
  static async fetchBanks(): Promise<Bank[]> {
    try {
      const response = await axiosInstance.get(PAYSTACK_API.BANKS);
      if (response.data.status) {
        return response.data.data
          .filter((bank: Bank) => bank.active)
          .sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));
      }
      throw new Error(response.data.message || 'Failed to fetch banks');
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch banks');
    }
  }

  static async resolveBankAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<BankAccountDetails | null> {
    try {
      const response = await axiosInstance.get(PAYSTACK_API.RESOLVE_ACCOUNT, {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
      });

      if (response.data.status) {
        return response.data.data as BankAccountDetails;
      }
      return null;
    } catch (err) {
      console.error('Error resolving bank account:', err);
      return null;
    }
  }
}
