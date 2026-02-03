import { useQuery } from '@apollo/client';
import { USER_WALLETS_TRANSACTION_HISTORY } from '@/lib/graphql/queries/transactions';
import { WalletTransaction } from '@/types/graphql';

export interface UserWalletsTransactionHistoryVariables {
  page?: number;
  perPage?: number;
  search?: string;
  type?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortDirection?: string;
}

interface UserWalletsTransactionHistoryResponse {
  userWalletsTransactionHistory: {
    entries: WalletTransaction[];
    pageNumber: number;
    pageSize: number;
    totalEntries: number;
    totalPages: number;
  };
}

export function useUserWalletsTransactionHistory(
  variables: UserWalletsTransactionHistoryVariables = {}
) {
  const queryVariables = {
    page: variables.page || 1,
    perPage: variables.perPage || 20,
    search: variables.search || undefined,
    type: variables.type || undefined,
    fromDate: variables.fromDate || undefined,
    toDate: variables.toDate || undefined,
    sortBy: variables.sortBy || undefined,
    sortDirection: variables.sortDirection || undefined,
  };

  const { data, loading, error, refetch } = useQuery<
    UserWalletsTransactionHistoryResponse,
    UserWalletsTransactionHistoryVariables
  >(USER_WALLETS_TRANSACTION_HISTORY, {
    variables: queryVariables,
    fetchPolicy: 'network-only',
  });

  const transactions = data?.userWalletsTransactionHistory?.entries || [];
  const pagination = {
    page: data?.userWalletsTransactionHistory?.pageNumber || 1,
    perPage: data?.userWalletsTransactionHistory?.pageSize || 20,
    totalEntries: data?.userWalletsTransactionHistory?.totalEntries || 0,
    totalPages: data?.userWalletsTransactionHistory?.totalPages || 1,
  };

  return {
    transactions,
    pagination,
    loading,
    error,
    refetch,
  };
}
