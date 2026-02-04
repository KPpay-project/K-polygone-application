import { useQuery } from '@apollo/client';
//import { GET_TRANSACTIONS, GET_WALLET_TRANSACTION_BY_ID } from '../../lib/graphql/mutations/transactions-mutation';
import { GET_TRANSACTIONS } from '@/lib/graphql/queries';
import {
  WalletTransaction,
  TransactionFiltersInput,
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

interface GetTransactionsResult {
  getTransactions: TransactionPagedResult;
}

interface GetWalletTransactionByIdVariables {
  transactionId: string;
}

interface GetWalletTransactionByIdResult {
  getWalletTransactionById: WalletTransaction;
}

export const useTransactions = (variables: GetTransactionsVariables) => {
  return useQuery<GetTransactionsResult, GetTransactionsVariables>(
    GET_TRANSACTIONS,
    { variables }
  );
};

export const useWalletTransactionById = (transactionId: string) => {
  return useQuery<
    GetWalletTransactionByIdResult,
    GetWalletTransactionByIdVariables
  >(GET_WALLET_TRANSACTION_BY_ID, {
    variables: { transactionId },
  });
};
