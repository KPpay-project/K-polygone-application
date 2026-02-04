import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../ui';
import { ArrowDown2 } from 'iconsax-react-nativejs';
import { WalletSelectorModal } from '../ui/wallet-selector-modal';
import { useAuth } from '@/contexts/auth-context';
import { useAuthenticatedProfile } from '@/hooks/use-authenticated-profile';

const WalletBalancePreview = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  const {
    profile,
    loading: profileLoading,
    error,
  } = useAuthenticatedProfile(isAuthenticated);

  const { wallets: usersWallet } = profile || {};

  const handleWalletSelect = (wallet: any) => {
    //
  };

  const handleCreateWallet = () => {
    //
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
        className="bg-gray-50 rounded-xl p-4 mb-6 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
            <Typography className="text-green-600 font-bold">$</Typography>
          </View>
          <Typography
            variant="caption"
            weight="600"
            className="text-gray-900 font-medium"
          >
            USD
          </Typography>
          <ArrowDown2 size={18} color="#6B7280" />
        </View>

        <Typography
          variant="body"
          weight="700"
          className="text-gray-600 font-semibold"
        >
          0
        </Typography>
      </TouchableOpacity>

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

export default WalletBalancePreview;
