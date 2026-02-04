import { useQuery } from '@apollo/client';
import { GET_ALL_WALLET_TRANSACTIONS } from '@repo/api';
import { UserWalletTransaction as WalletTransaction } from '@repo/types';

interface WalletTransactionsQueryResult {
  getAllWalletTransactions: WalletTransaction[];
}

export const useWalletTransactions = () => {
  return useQuery<WalletTransactionsQueryResult>(GET_ALL_WALLET_TRANSACTIONS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only'
  });
};
