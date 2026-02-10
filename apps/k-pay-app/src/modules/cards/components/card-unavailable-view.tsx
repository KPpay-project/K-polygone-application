import * as React from 'react';
import { View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/ui/typography/typography';
import { Button } from '@/components/ui/button/button';
import { Link } from 'expo-router';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cardImage = require('@/assets/card.png');

export function CardUnavailableView() {
  const { t } = useTranslation();
  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <View className="items-center justify-center mb-8">
        <View className="w-[100px] h-[100px] rounded-full bg-white items-center justify-center border-4 border-red-500 mb-4">
          <Image
            source={cardImage}
            className="w-[60px] h-[40px]"
            resizeMode="contain"
          />
          <View className="absolute w-[100px] h-[100px] items-center justify-center">
            <View
              className="absolute w-[100px] h-[100px] border-4 border-red-500 rounded-full"
              style={{ borderColor: '#FF0033' }}
            />
            <View
              className="absolute w-[100px] h-[4px] bg-red-500 rotate-[-25deg] top-[48px] left-0"
              style={{ backgroundColor: '#FF0033' }}
            />
          </View>
        </View>
      </View>
      <Typography
        variant="h4"
        className="text-center font-bold text-black text-[22px] mb-2"
      >
        {t('cardNotAvailableTitle')}
      </Typography>
      <Typography variant="body" className="text-center text-gray-500 mb-8">
        {t('cardNotAvailableMessage')}
      </Typography>
      <View className="w-full items-center mb-4">
        <Button
          variant="primary"
          className="w-full bg-red-500 rounded-xl py-4 text-white text-base font-semibold flex-row items-center justify-center"
        >
          {t('joinWaitlist')} <span className="ml-2">→</span>
        </Button>
      </View>
      <Link href="#" className="text-black underline text-base font-medium">
        {t('learnMore')}
      </Link>
    </View>
  );
}
