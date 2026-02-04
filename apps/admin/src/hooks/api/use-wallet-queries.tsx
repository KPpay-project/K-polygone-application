import { useQuery } from '@apollo/client';
import { GET_WALLET, GET_USER_WALLETS } from '../../lib/graphql/queries/wallet';
import { GET_ALL_WALLETS } from '../../lib/graphql/queries/wallets-admin';
import { GetUserWalletsVariables, GetWalletVariables, Wallet } from '@repo/types';

interface GetWalletResult {
  wallet: Wallet;
}

interface GetUserWalletsResult {
  wallets: Wallet[];
}

interface GetAllWalletsResult {
  wallets: Wallet[];
}

export const useGetWallet = (variables: GetWalletVariables) => {
  return useQuery<GetWalletResult, GetWalletVariables>(GET_WALLET, {
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

export const useGetUserWallets = (variables: GetUserWalletsVariables) => {
  return useQuery<GetUserWalletsResult, GetUserWalletsVariables>(GET_USER_WALLETS, {
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

export const useGetAllWallets = () => {
  return useQuery<GetAllWalletsResult>(GET_ALL_WALLETS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};
