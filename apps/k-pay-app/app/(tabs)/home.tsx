import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { WalletSelectorModal } from '@/components/ui/wallet-selector-modal';
import Header from '@/components/header';
import { router } from 'expo-router';
import BillsAndPayment from '@/modules/home/bills-and-payment';
import WalletCard from '@/components/wallet/index-wallet';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Wallet, Transaction } from '@/types/wallet';
import { TransactionsList } from '@/components/tables/transactions-list-table';
import { useAuthenticatedProfile } from '@/hooks/use-authenticated-profile';
import { useAuth } from '@/contexts/auth-context';

export default function HomeScreen() {
  const { selectedCurrency } = useCurrency();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isWalletSelectorVisible, setIsWalletSelectorVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    profile,
    loading: profileLoading,
    refetch,
  } = useAuthenticatedProfile(isAuthenticated);

  const { wallets: usersWallet } = profile || {};

  useEffect(() => {
    if (usersWallet && usersWallet.length > 0) {
      const walletForCurrency =
        usersWallet.find((wallet) =>
          wallet.balances.some((b) => b.currency.code === selectedCurrency)
        ) || usersWallet[0];
      setSelectedWallet(walletForCurrency);
    }
  }, [selectedCurrency, usersWallet]);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleShowWalletSelector = () => {
    setIsWalletSelectorVisible(true);
  };

  const handleCloseWalletSelector = () => {
    setIsWalletSelectorVisible(false);
  };

  const handleCreateWallet = () => {
    //
  };

  const handleTransactionPress = (transaction: Transaction) => {
    router.push('/(tabs)/transactions');
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch?.();
    } catch (err) {
      console.error('Refresh failed', err);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (authLoading) {
    return (
      <ScreenContainer
        useSafeArea
        className="bg-gray-50 items-center justify-center"
      >
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    router.replace('/auth/login');
    return null;
  }

  if (profileLoading && !refreshing) {
    return (
      <ScreenContainer
        useSafeArea
        className="bg-gray-50 items-center justify-center"
      >
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  const effectiveSelectedWallet =
    selectedWallet || (usersWallet && usersWallet[0]);

  return (
    <ScreenContainer useSafeArea className="bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Header />
        <WalletCard
          selectedWallet={effectiveSelectedWallet}
          isBalanceVisible={isBalanceVisible}
          toggleBalanceVisibility={toggleBalanceVisibility}
          handleShowWalletSelector={handleShowWalletSelector}
        />
        <BillsAndPayment />
        <TransactionsList length={5} />
      </ScrollView>

      <WalletSelectorModal
        visible={isWalletSelectorVisible}
        onClose={handleCloseWalletSelector}
        wallets={usersWallet || []}
        onWalletSelect={setSelectedWallet}
        onCreateWallet={handleCreateWallet}
      />
    </ScreenContainer>
  );
}
