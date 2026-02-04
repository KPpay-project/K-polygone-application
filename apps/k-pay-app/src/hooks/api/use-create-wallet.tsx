import { useMutation } from '@apollo/client';
import { CREATE_WALLET } from '../../lib/graphql/mutations/create-wallet';
import type { CreateWalletVariables, Wallet } from '../../types/graphql';

interface CreateWalletMutationResult {
  createWallet: Wallet;
}

export const useCreateWallet = () => {
  return useMutation<CreateWalletMutationResult, CreateWalletVariables>(
    CREATE_WALLET,
    {
      errorPolicy: 'all',
      onCompleted: (data) => {
        //
      },
      onError: (error) => {
        console.error('Create wallet error:', error);
      },
    }
  );
};
