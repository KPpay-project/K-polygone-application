import { useMutation } from '@apollo/client';
import { CREATE_WALLET } from '../../lib/graphql/mutations/create-wallet';
import { CreateWalletVariables, Wallet } from '@repo/types';

interface CreateWalletMutationResult {
  createWallet: Wallet;
}

export const useCreateWallet = () => {
  return useMutation<CreateWalletMutationResult, CreateWalletVariables>(CREATE_WALLET, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      console.log('Wallet created successfully:', data);
    },
    onError: (error) => {
      console.error('Create wallet error:', error);
    }
  });
};
