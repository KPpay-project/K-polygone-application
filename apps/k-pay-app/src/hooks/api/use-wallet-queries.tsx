import { useQuery } from '@apollo/client';
import { GET_WALLET, GET_USER_WALLETS } from '../../lib/graphql/queries/wallet';
import type {
  Wallet,
  GetWalletVariables,
  GetUserWalletsVariables,
} from '../../types/graphql';

interface GetWalletResult {
  wallet: Wallet;
}

interface GetUserWalletsResult {
  wallets: Wallet[];
}

export const useGetWallet = (variables: GetWalletVariables) => {
  return useQuery<GetWalletResult, GetWalletVariables>(GET_WALLET, {
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });
};

export const useGetUserWallets = (variables: GetUserWalletsVariables) => {
  return useQuery<GetUserWalletsResult, GetUserWalletsVariables>(
    GET_USER_WALLETS,
    {
      variables,
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    }
  );
};
