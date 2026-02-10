import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { router } from 'expo-router';

type StatusType = 'success' | 'failed';

interface StatusScreenProps {
  status: StatusType;
  title?: string;
  message?: string;
  buttonText?: string;
  onPress?: () => void;
}

export const StatusScreen: React.FC<StatusScreenProps> = ({
  status,
  title,
  message,
  buttonText,
  onPress,
}) => {
  const isSuccess = status === 'success';

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View className="flex-1 justify-center items-center px-6 w-full">
        <View
          className={`w-24 h-24 ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          } rounded-full items-center justify-center mb-8`}
        >
          <View
            className={`w-12 h-12 ${
              isSuccess ? 'bg-green-500' : 'bg-red-500'
            } rounded-full items-center justify-center`}
          >
            <Typography variant="h3" className="text-white font-bold">
              {isSuccess ? '✓' : '✕'}
            </Typography>
          </View>
        </View>

        <Typography
          variant="h3"
          className="text-gray-900 font-semibold mb-4 text-center"
        >
          {title ??
            (isSuccess
              ? 'Wallet Created Successfully'
              : 'Wallet Creation Failed')}
        </Typography>

        <Typography
          variant="body"
          className="text-gray-600 text-center mb-12 px-4"
        >
          {message ??
            (isSuccess
              ? 'Your wallet is ready! Top up and start transacting instantly.'
              : 'Something went wrong while creating your wallet. Please try again.')}
        </Typography>
      </View>

      <View className="px-6 pb-6 w-full">
        <ReusableButton
          variant="primary"
          text={buttonText ?? (isSuccess ? 'Go back home' : 'Try again')}
          onPress={onPress ?? (() => router.push('/(tabs)/home'))}
          showArrow={true}
          className="w-full"
        />
      </View>
    </View>
  );
};
