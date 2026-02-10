import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { BillItem } from './components';
import { getBillOptions } from './data';
import type { BillOption } from './types';
import { getSpacing } from '@/theme';
import { useTranslation } from 'react-i18next';

export default function BillsAndPaymentScreen() {
  const { t } = useTranslation();
  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={handleBack} className="mb-4">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Typography
          variant="h3"
          className="text-gray-900 font-semibold text-lg"
        >
          {t('billsAndPayment')}
        </Typography>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: getSpacing('lg'),
          paddingBottom: getSpacing('2xl'),
        }}
      >
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden p-2">
          {getBillOptions().map((option, index, array) => (
            <BillItem
              key={option.id}
              option={option}
              isLast={index === array.length - 1}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
