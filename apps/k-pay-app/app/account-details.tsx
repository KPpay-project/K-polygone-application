import React from 'react';
import { View, TouchableOpacity, ScrollView, Share } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft, Copy, Share as ShareIcon } from 'iconsax-react-nativejs';
import { router, useLocalSearchParams } from 'expo-router';
import { useProfile } from '@/store/profile-store';
import { formatCurrencyByCode } from '@/utils/numbers';
import { countries, Country } from '@/data/countries';

interface AccountDetail {
  labelKey: string;
  value: string;
  copyable?: boolean;
}

export default function AccountDetailsScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const walletId = params.walletId as string | undefined;
  const profile = useProfile();
  const wallets = profile?.wallets || [];
  const wallet = wallets.find((w: any) => w.id === walletId);
  const balanceObj = wallet?.balances?.[0];
  const availableBalance =
    balanceObj?.availableBalance || balanceObj?.totalBalance || '0';
  const currencyCode =
    balanceObj?.currency?.code || (params.currency as string) || 'XOF';
  const currencyName =
    (params.currencyName as string) || 'West African CFA franc';
  const accountHolder = [profile?.user?.firstName, profile?.user?.lastName]
    .filter(Boolean)
    .join(' ');

  const accountDetails: AccountDetail[] = [
    {
      labelKey: 'accountHolder',
      value: accountHolder,
      copyable: true,
    },
    {
      labelKey: 'accountNumber',
      value: wallet?.id || '',
      copyable: true,
    },
    {
      labelKey: 'accountType',
      value: 'Checking',
      copyable: true,
    },
  ];

  const handleCopy = async (value: string, labelKey: string) => {
    Toast.show({
      type: 'success',
      text1: `${t(labelKey)} ${t('copiedToClipboard')}`,
      visibilityTime: 2000,
      topOffset: 60,
      props: {
        style: {
          backgroundColor: '#10B981',
          borderRadius: 16,
          borderLeftWidth: 4,
          borderLeftColor: '#059669',
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginHorizontal: 16,
        },
        text1Style: {
          fontSize: 14,
          fontWeight: '500',
          color: '#FFFFFF',
        },
      },
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Account Details:\n${accountDetails.map((detail) => `${t(detail.labelKey)}: ${detail.value}`).join('\n')}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const navigateToStatement = () => {
    router.push({
      pathname: '/statement',
      params: { currency: currencyCode, currencyName },
    });
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-gray-50">
      <View className="flex-row items-center px-6 py-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-blue-500 rounded-full mr-3 items-center justify-center">
              <Typography
                variant="body"
                className="text-white font-bold text-sm"
              >
                {currencyCode.charAt(0)}
              </Typography>
            </View>
            <Typography variant="h4" className="text-gray-900 font-semibold">
              {currencyCode}
            </Typography>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="mt-6 mb-6">
          <Typography variant="body" className="text-gray-600 mb-2">
            {t('availableBalance')}
          </Typography>
          <Typography variant="h2" className="text-gray-900 font-bold">
            {formatCurrencyByCode(availableBalance, currencyCode)}
          </Typography>
        </View>

        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
          <Typography variant="h4" className="text-gray-900 font-semibold mb-6">
            Account Details
          </Typography>

          {accountDetails.map((detail, index) => (
            <View key={index} className="mb-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Typography variant="body" className="text-gray-600 mb-1">
                    {t(detail.labelKey)}
                  </Typography>
                  <Typography
                    variant="body"
                    className="text-gray-900 font-medium"
                  >
                    {detail.value}
                  </Typography>
                </View>
                {detail.copyable && (
                  <TouchableOpacity
                    onPress={() => handleCopy(detail.value, detail.labelKey)}
                    className="ml-4 p-2"
                  >
                    <Copy size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {/* Share Details Button */}
          <View className="mt-2">
            <ReusableButton
              variant="ghost"
              text={t('shareDetails')}
              onPress={handleShare}
              textColor="#3B82F6"
              className="py-3"
            >
              <ShareIcon size={20} color="#3B82F6" variant="Outline" />
            </ReusableButton>
          </View>
        </View>

        {/* <View className="mb-3">
          <ReusableButton
            variant="primary"
            text={t('viewStatement')}
            onPress={navigateToStatement}
            textColor="#fff"
          />
        </View> */}

        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
}
