import {
  GET_ALL_DEPOSIT_TRANSACTIONS,
  GET_ALL_TRANSFERS_TRANSACTIONS,
  GET_ALL_WITHDRAWAL_TRANSACTIONS
} from '@/lib/graphql/queries/transactions';
import { useQuery } from '@apollo/client';

function useAllDepositsTransactionHistory(variables) {
  return useQuery(GET_ALL_DEPOSIT_TRANSACTIONS, {
    variables,
    fetchPolicy: 'cache-and-network'
  });
}

function useAllTransfersTransactionHistory(variables) {
  return useQuery(GET_ALL_TRANSFERS_TRANSACTIONS, {
    variables,
    fetchPolicy: 'cache-and-network'
  });
}

function useAllWithdrawalTransactionHistory(variables) {
  return useQuery(GET_ALL_WITHDRAWAL_TRANSACTIONS, {
    variables,
    fetchPolicy: 'cache-and-network'
  });
}

export { useAllDepositsTransactionHistory, useAllTransfersTransactionHistory, useAllWithdrawalTransactionHistory };
