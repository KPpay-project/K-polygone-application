import axios from 'axios';
import { FLUTTERWAVE_TEST_KEY } from '@/constants';
import { FlutterwaveBank, FlutterwaveAccountDetails } from './types';

export const FLUTTERWAVE_API = {
  BANKS: 'https://api.flutterwave.com/v3/banks/NG?include_provider_type=1',
  RESOLVE_ACCOUNT: 'https://api.flutterwave.com/v3/accounts/resolve',
};

export const flutterwaveAxiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${FLUTTERWAVE_TEST_KEY}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

export class FlutterwaveBankService {
  static async fetchBanks(): Promise<FlutterwaveBank[]> {
    try {
      const response = await flutterwaveAxiosInstance.get(
        FLUTTERWAVE_API.BANKS
      );
      if (response.data.status === 'success') {
        return response.data.data
          .filter((bank: FlutterwaveBank) => bank.is_active !== false)
          .sort((a: FlutterwaveBank, b: FlutterwaveBank) =>
            a.name.localeCompare(b.name)
          );
      }
      throw new Error(response.data.message || 'Failed to fetch banks');
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch banks');
    }
  }

  static async resolveBankAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<FlutterwaveAccountDetails | null> {
    try {
      const response = await flutterwaveAxiosInstance.post(
        FLUTTERWAVE_API.RESOLVE_ACCOUNT,
        {
          account_number: accountNumber,
          account_bank: bankCode,
        }
      );

      if (response.data.status === 'success') {
        return {
          account_number: response.data.data.account_number,
          account_name: response.data.data.account_name,
          bank_code: response.data.data.bank_code,
        };
      }
      return null;
    } catch (err) {
      console.error('Error resolving bank account:', err);
      return null;
    }
  }
}
