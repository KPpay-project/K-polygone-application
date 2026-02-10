import { useMemo } from 'react';
import { useProfileStore, Profile } from '@/store/profile-store';
import { useCurrency } from '@/contexts/CurrencyContext';

type ProfileWallet = Profile['wallets'][0];
type ProfileWalletBalance = ProfileWallet['balances'][0];

export interface WalletData {
  walletId: string;
  balance: ProfileWalletBalance | null;
  wallet: ProfileWallet | null;
  availableBalance: number;
  totalBalance: number;
  formattedBalance: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
}

export const useWalletAbstractor = () => {
  const { profile } = useProfileStore();
  const { selectedCurrencyData, selectedCurrency } = useCurrency();

  const walletData: WalletData | null = useMemo(() => {
    const wallets = profile?.wallets;
    if (!wallets || wallets.length === 0) {
      return null;
    }

    const wallet = wallets[0];
    const balance = wallet.balances?.[0] || null;

    if (!balance) {
      return null;
    }

    const availableBalance = parseFloat(balance.availableBalance || '0');
    const totalBalance = parseFloat(balance.totalBalance || '0');

    const currencySymbol = selectedCurrencyData?.symbol || '$';
    const formattedBalance = `${currencySymbol}${availableBalance.toFixed(2)}`;

    return {
      walletId: wallet.id,
      balance,
      wallet,
      availableBalance,
      totalBalance,
      formattedBalance,
      currency: {
        code: selectedCurrency,
        symbol: currencySymbol,
        name: selectedCurrencyData?.name || 'Unknown',
      },
    };
  }, [profile?.wallets, selectedCurrencyData, selectedCurrency]);

  const hasWallet = !!walletData;

  const getWalletByCurrency = (currencyCode: string) => {
    const wallets = profile?.wallets;
    if (!wallets) return null;

    return (
      wallets.find((wallet) => {
        return wallet.status === 'active';
      }) || null
    );
  };

  const getAllWallets = () => {
    return profile?.wallets || [];
  };

  const logWalletInfo = () => {
    if (walletData) {
      //
    } else {
      //
    }
  };

  return {
    walletData,
    hasWallet,

    walletId: walletData?.walletId || null,
    balance: walletData?.availableBalance || 0,
    totalBalance: walletData?.totalBalance || 0,
    formattedBalance: walletData?.formattedBalance || '$0.00',
    currency: walletData?.currency || {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
    },

    getWalletByCurrency,
    getAllWallets,
    logWalletInfo,
  };
};
