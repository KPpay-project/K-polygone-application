import { useMutation } from '@apollo/client';
import { DEPOSIT } from '@repo/api';
import { DepositResponse, DepositVariables } from '@repo/types';

interface DepositMutationResult {
  deposit: DepositResponse;
}

export const useDeposit = () => {
  return useMutation<DepositMutationResult, DepositVariables>(DEPOSIT, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      console.log('Deposit completed:', data);
    },
    onError: (error) => {
      console.error('Deposit error:', error);
    }
  });
};
