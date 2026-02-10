import { useQuery } from '@apollo/client';
import { GET_ALL_WALLET_TRANSACTIONS } from '@/lib/graphql/queries/transactions';
import { WalletTransaction } from '@/types/graphql';

interface WalletTransactionsQueryResult {
  getAllWalletTransactions: WalletTransaction[];
}

export const useWalletTransactions = () => {
  return useQuery<WalletTransactionsQueryResult>(GET_ALL_WALLET_TRANSACTIONS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });
};
