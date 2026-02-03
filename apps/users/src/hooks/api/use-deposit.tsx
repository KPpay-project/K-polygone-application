import { useMutation } from '@apollo/client';
import { DEPOSIT } from '../../lib/graphql/mutations/deposit';
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
