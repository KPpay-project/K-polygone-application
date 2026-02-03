import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../../lib/graphql/queries/transactions';
import {
  TransactionFiltersInput,
  WalletTransaction,
} from '../../types/graphql';

interface TransactionPagedResult {
  entries: WalletTransaction[];
  page: number;
  perPage: number;
  totalEntries: number;
  totalPages: number;
}

interface GetTransactionsVariables {
  filters?: TransactionFiltersInput;
  page?: number;
  perPage?: number;
}

export function useGetTransactions(variables: GetTransactionsVariables = {}) {
  const { data, loading, error, refetch } = useQuery<
    { getTransactions: TransactionPagedResult },
    GetTransactionsVariables
  >(GET_TRANSACTIONS, {
    variables,
    fetchPolicy: 'network-only',
  });

  return {
    transactions: data?.getTransactions.entries || [],
    pagination: {
      page: data?.getTransactions.page || 1,
      perPage: data?.getTransactions.perPage || 20,
      totalEntries: data?.getTransactions.totalEntries || 0,
      totalPages: data?.getTransactions.totalPages || 0,
    },
    loading,
    error,
    refetch,
  };
}
