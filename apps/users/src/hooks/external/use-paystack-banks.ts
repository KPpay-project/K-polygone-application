import { useState, useCallback, useEffect } from 'react';
import { Bank, BankAccountDetails, PaystackBankService } from '@/services/paystack';

interface UsePaystackBanksResult {
  banks: Bank[];
  loading: boolean;
  error: Error | null;
  resolveBankAccount: (accountNumber: string, bankCode: string) => Promise<BankAccountDetails | null>;
  refreshBanks: () => Promise<void>;
}

export function usePaystackBanks(): UsePaystackBanksResult {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchBanks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const activeBanks = await PaystackBankService.fetchBanks();
      setBanks(activeBanks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch banks'));
      setBanks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveBankAccount = useCallback(async (accountNumber: string, bankCode: string) => {
    return PaystackBankService.resolveBankAccount(accountNumber, bankCode);
  }, []);

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
