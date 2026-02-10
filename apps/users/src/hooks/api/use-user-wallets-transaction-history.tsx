import { useQuery } from '@apollo/client';
import { USER_WALLETS_TRANSACTION_HISTORY } from '@repo/api';
import { UserWalletTransaction as WalletTransaction } from '@repo/types';

export interface UserWalletsTransactionHistoryVariables {
  limit?: number;
  offset?: number;
  type?: string | undefined;
  fromDate?: string | undefined; // format YYYY-MM-DD
  toDate?: string | undefined; // format YYYY-MM-DD
}

export function useUserWalletsTransactionHistory(variables: UserWalletsTransactionHistoryVariables = {}) {
  const { data, loading, error, refetch } = useQuery<
    { userWalletsTransactionHistory: WalletTransaction[] },
    UserWalletsTransactionHistoryVariables
  >(USER_WALLETS_TRANSACTION_HISTORY, {
    variables,
    fetchPolicy: 'network-only'
  });

  const items = data?.userWalletsTransactionHistory || [];
  const limit = variables.limit ?? 20;
  const offset = variables.offset ?? 0;
  const page = Math.floor(offset / Math.max(limit, 1)) + 1;

  // Heuristic pagination since API doesn't return totals:
  // If we received a full page, enable a potential next page by setting totalPages = currentPage + 1,
  // otherwise treat current page as the last page.
  const totalPages = items.length >= limit ? page + 1 : page;
  const totalEntries = offset + items.length; // lower bound only

  return {
    transactions: items,
    pagination: {
      page,
      perPage: limit,
      totalEntries,
      totalPages
    },
    loading,
    error,
    refetch
  };
}
