import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  UnifiedBankService,
  UnifiedBank,
  UnifiedAccountDetails,
  BankProvider,
} from '../services/bank';

export interface UseUnifiedBanksResult {
  banks: UnifiedBank[];
  loading: boolean;
  error: Error | null;
  resolveBankAccount: (
    accountNumber: string,
    bankCode: string,
  ) => Promise<UnifiedAccountDetails | null>;
  refreshBanks: () => Promise<void>;
}

/**
 * Hook to manage bank operations across different providers (Paystack, Flutterwave).
 *
 * @param provider - The bank provider to use ('paystack' or 'flutterwave')
 * @param secretKey - The API secret key for the provider
 * @param country - Optional country code (default: 'NG' for Flutterwave)
 */

export function useUnifiedBanks(
  provider: BankProvider,
  secretKey: string,
  country?: string,
): UseUnifiedBanksResult {
  const [banks, setBanks] = useState<UnifiedBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bankService = useMemo(
    () => new UnifiedBankService({ provider, secretKey, country }),
    [provider, secretKey, country],
  );

  const fetchBanks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBanks = await bankService.fetchBanks();
      setBanks(fetchedBanks);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch banks'));
      setBanks([]);
    } finally {
      setLoading(false);
    }
  }, [bankService]);

  const resolveBankAccount = useCallback(
    async (accountNumber: string, bankCode: string) => {
      return bankService.resolveBankAccount(accountNumber, bankCode);
    },
    [bankService],
  );

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  return {
    banks,
    loading,
    error,
    resolveBankAccount,
    refreshBanks: fetchBanks,
  };
}
