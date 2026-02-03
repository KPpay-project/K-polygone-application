import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  UnifiedBankService,
  UnifiedBank,
  UnifiedAccountDetails,
  BankProvider,
} from '@/services/bank/unified-bank-service';

interface UseUnifiedBanksResult {
  banks: UnifiedBank[];
  loading: boolean;
  error: Error | null;
  resolveBankAccount: (
    accountNumber: string,
    bankCode: string
  ) => Promise<UnifiedAccountDetails | null>;
  refreshBanks: () => Promise<void>;
}

export function useUnifiedBanks(
  provider: BankProvider,
  country?: string
): UseUnifiedBanksResult {
  const [banks, setBanks] = useState<UnifiedBank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bankService = useMemo(
    () => new UnifiedBankService({ provider, country }),
    [provider, country]
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
    [bankService]
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
