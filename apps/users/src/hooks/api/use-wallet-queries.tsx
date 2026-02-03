import { useQuery } from '@apollo/client';
import { GET_WALLET, GET_USER_WALLETS, GET_MY_WALLETS } from '../../lib/graphql/queries/wallet';
import { GetUserWalletsVariables, GetWalletVariables, Wallet } from '@repo/types';
import { GET_MY_CURRENCIES_QUERY } from '@/lib/graphql/mutations/wallet';

interface GetWalletResult {
  wallet: Wallet;
}

interface GetUserWalletsResult {
  wallets: Wallet[];
}

interface MyWalletBalance {
  availableBalance: string;
  totalBalance: string;
  walletId: string;
  currency: {
    code: string;
    countryCode: string;
    countryNames: string;
    exchangeRateUsd: string;
    id: string;
    insertedAt: string;
    isActive: boolean;
    name: string;
    precision: number;
    symbol: string;
    updatedAt: string;
  };
}

export interface MyWallet {
  id: string;
  ownerId: string;
  ownerType: string;
  status: string;
  isFrozen: boolean;
  freezeReason?: string;
  dailyLimit?: string;
  monthlyLimit?: string;
  insertedAt: string;
  updatedAt: string;
  currency: {
    code: string;
    countryCode: string;
    countryNames: string;
    exchangeRateUsd: string;
    id: string;
    insertedAt: string;
    isActive: boolean;
    name: string;
    precision: number;
    symbol: string;
    updatedAt: string;
  };
  balances: MyWalletBalance[];
}

interface GetMyWalletsResult {
  myWallet: MyWallet[];
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

export const useGetMyWallets = () => {
  return useQuery<GetMyWalletsResult>(GET_MY_WALLETS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

export const useFetchUsersCurrencies = () => {
  return useQuery(GET_MY_CURRENCIES_QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

export { useFreezeWallet } from '@/hooks/api/kyc/wallet';
