import { FLUTTERWAVE_TEST_KEY } from '@/constants';
import { FlutterwaveBank, FlutterwaveAccountDetails } from './types';

export const FLUTTERWAVE_API = {
  BANKS: 'https://api.flutterwave.com/v3/banks/NG?include_provider_type=1',
  RESOLVE_ACCOUNT: 'https://api.flutterwave.com/v3/accounts/resolve',
};

export class FlutterwaveBankService {
  static async fetchBanks(): Promise<FlutterwaveBank[]> {
    try {
      const response = await fetch(FLUTTERWAVE_API.BANKS, {
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_TEST_KEY}`,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data
          .filter((bank: FlutterwaveBank) => bank.is_active !== false)
          .sort((a: FlutterwaveBank, b: FlutterwaveBank) =>
            a.name.localeCompare(b.name)
          );
      }
      throw new Error(data.message || 'Failed to fetch banks');
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch banks');
    }
  }

  static async resolveBankAccount(
    accountNumber: string,
    bankCode: string
  ): Promise<FlutterwaveAccountDetails | null> {
    try {
      const response = await fetch(FLUTTERWAVE_API.RESOLVE_ACCOUNT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_TEST_KEY}`,
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          account_number: accountNumber,
          account_bank: bankCode,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        return {
          account_number: data.data.account_number,
          account_name: data.data.account_name,
          bank_code: data.data.bank_code,
        };
      }
      return null;
    } catch (err) {
      console.error('Error resolving bank account:', err);
      return null;
    }
  }
}
