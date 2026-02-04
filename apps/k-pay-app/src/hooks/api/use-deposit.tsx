import { useMutation } from '@apollo/client';
import { DEPOSIT } from '../../lib/graphql/mutations/deposit';
import type { DepositVariables, DepositResponse } from '../../types/graphql';

interface DepositMutationResult {
  deposit: DepositResponse;
}

export const useDeposit = () => {
  return useMutation<DepositMutationResult, DepositVariables>(DEPOSIT, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      //
    },
    onError: (error) => {
      console.error('Deposit error:', error);
    },
  });
};
