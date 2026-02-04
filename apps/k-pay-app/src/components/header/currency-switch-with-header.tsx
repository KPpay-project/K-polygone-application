import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { HeaderWithTitle } from '.';
import { WalletSelectorModal } from '../ui/wallet-selector-modal';
import { Typography } from '../ui';
import { ArrowDown2 } from 'iconsax-react-nativejs';
import { useAuthenticatedProfile } from '@/hooks/use-authenticated-profile';
import { useAuth } from '@/contexts/auth-context';

interface Props {
  title: string;
  description: string;
}

const CurrencySwitchWithHeader = ({ title, description }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isAuthenticated } = useAuth();

  const {
    profile,
    loading: profileLoading,
    error,
  } = useAuthenticatedProfile(isAuthenticated);

  const { wallets: usersWallet } = profile || {};

  const mockWallets = [
    {
      id: '1',
      name: 'NGN Wallet',
      code: 'NGN',
      color: '#22C55E',
      balances: [
        {
          currency: { code: 'NGN', countryCode: 'NG', locale: 'en-NG' },
          availableBalance: '150000.00',
          totalBalance: '150000.00',
        },
      ],
    },
    {
      id: '2',
      name: 'USD Wallet',
      code: 'USD',
      color: '#3B82F6',
      balances: [
        {
          currency: { code: 'USD', countryCode: 'US', locale: 'en-US' },
          availableBalance: '2500.50',
          totalBalance: '2500.50',
        },
      ],
    },
    {
      id: '3',
      name: 'GBP Wallet',
      code: 'GBP',
      color: '#8B5CF6',
      balances: [
        {
          currency: { code: 'GBP', countryCode: 'GB', locale: 'en-GB' },
          availableBalance: '1200.75',
          totalBalance: '1200.75',
        },
      ],
    },
  ];

  const handleWalletSelect = (wallet: any) => {
    //
  };

  const handleCreateWallet = () => {
    //
  };

  return (
    <>
      <View className="pt-4 pb-2 px-1 flex-row items-center justify-between">
        <HeaderWithTitle title={title} description={description} />

        <Pressable
          onPress={() => setIsModalVisible(true)}
          className="flex-row items-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
        >
          <Typography className="text-gray-900 font-medium mr-2">
            Currency
          </Typography>
          <ArrowDown2 size={16} color="#6B7280" />
        </Pressable>
      </View>

      <WalletSelectorModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        wallets={usersWallet || []}
        onWalletSelect={handleWalletSelect}
        onCreateWallet={handleCreateWallet}
      />
    </>
  );
};

export { CurrencySwitchWithHeader };
