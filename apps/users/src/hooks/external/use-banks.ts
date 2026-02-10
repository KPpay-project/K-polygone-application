import axios from 'axios';
import { PAYSTACK_TEST_KEY } from '@/constant';
import { useState, useCallback, useEffect } from 'react';

interface Bank {
  id: number;
  name: string;
  code: string;
  longcode: string;
  gateway?: string | null;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
}

interface BankAccountDetails {
  account_number: string;
  account_name: string;
  bank_id: number;
}

interface UsePaystackBanksResult {
  banks: Bank[];
  loading: boolean;
  error: Error | null;
  resolveBankAccount: (accountNumber: string, bankCode: string) => Promise<BankAccountDetails | null>;
  refreshBanks: () => Promise<void>;
}

const PAYSTACK_API = {
  BANKS: 'https://api.paystack.co/bank',
  RESOLVE_ACCOUNT: 'https://api.paystack.co/bank/resolve'
};

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${PAYSTACK_TEST_KEY}`,
    'Content-Type': 'application/json'
  }
});

export function usePaystackBanks(): UsePaystackBanksResult {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBanks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(PAYSTACK_API.BANKS);
      if (response.data.status) {
        // Filter active banks and sort by name
        const activeBanks = response.data.data
          .filter((bank: Bank) => bank.active)
          .sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));
        setBanks(activeBanks);
      } else {
        throw new Error(response.data.message || 'Failed to fetch banks');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch banks'));
      setBanks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveBankAccount = useCallback(
    async (accountNumber: string, bankCode: string): Promise<BankAccountDetails | null> => {
      try {
        const response = await axiosInstance.get(PAYSTACK_API.RESOLVE_ACCOUNT, {
          params: {
            account_number: accountNumber,
            bank_code: bankCode
          }
        });

        if (response.data.status) {
          return response.data.data as BankAccountDetails;
        }
        return null;
      } catch (err) {
        console.error('Error resolving bank account:', err);
        return null;
      }
    },
    []
  );

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return {
    banks,
    loading,
    error,
    resolveBankAccount,
    refreshBanks: fetchBanks
  };
}

export type { Bank, BankAccountDetails };
