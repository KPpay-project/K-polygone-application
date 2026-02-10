import React from 'react';
import { View } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { router } from 'expo-router';

export default function WalletCreatedSuccessScreen() {
  const handleGoBackHome = () => {
    // Navigate back to home screen
    router.push('/(tabs)/home');
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-white">
      <View className="flex-1 justify-center items-center px-6">
        {/* Success Icon */}
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-8">
          <View className="w-12 h-12 bg-green-500 rounded-full items-center justify-center">
            <Typography variant="h2" className="text-white font-bold">
              ✓
            </Typography>
          </View>
        </View>

        <Typography
          variant="h2"
          className="text-gray-900 font-semibold mb-4 text-center"
        >
          Wallet Created Successfully
        </Typography>

        <Typography
          variant="body"
          className="text-gray-600 text-center mb-12 px-4"
        >
          Your wallet is ready! Top up and start transacting instantly.
        </Typography>
      </View>

      {/* Go Back Home Button */}
      <View className="px-6 pb-6">
        <ReusableButton
          variant="primary"
          text="Go back home"
          onPress={handleGoBackHome}
          showArrow={true}
          className="bg-red-500"
        />
      </View>
    </ScreenContainer>
  );
}
