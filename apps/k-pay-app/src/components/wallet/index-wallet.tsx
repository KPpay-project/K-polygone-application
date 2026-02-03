import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/ui';
import {
  Add,
  Send2,
  Eye,
  EyeSlash,
  ArrowDown2,
  ArrowRight,
  ConvertCard,
  Bank,
} from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { formatNumberWithCommas } from '@/utils/numbers';
import { useWalletAbstractor } from '@/hooks/use-wallet';
import { getSymbolFromCode } from 'currency-code-symbol-map';

interface Wallet {
  id: string;
  name: string;
  code: string;
  balance: string;
  icon: string;
  color: string;
  balances?: any[];
}

interface WalletCardProps {
  selectedWallet?: Wallet | null;
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  handleShowWalletSelector: () => void;
  loading?: boolean;
}

export default function WalletCard({
  selectedWallet,
  isBalanceVisible,
  toggleBalanceVisibility,
  handleShowWalletSelector,
  loading = false,
}: WalletCardProps) {
  const { t } = useTranslation();

  const { walletData, walletId, hasWallet } = useWalletAbstractor();

  const actionItems = [
    {
      icon: <Add size={24} color="#1A4ED8" />,
      label: t('addMoney'),
      path: '/deposit',
    },
    {
      icon: <Send2 size={24} color="#1A4ED8" />,
      label: t('send'),
      path: '/send-money',
    },
    {
      icon: <ConvertCard size={24} color="#1A4ED8" />,
      label: t('convert'),
      path: '/convert-currency',
    },
  ];

  if (loading || !selectedWallet) {
    return (
      <View className="mx-6 mb-6 relative">
        <View className="bg-primary-900 rounded-3xl p-6">
          <View className="w-[95%] mx-auto">
            <View className="items-center mb-6">
              <View className="h-6 w-32 bg-white/30 rounded-md" />
            </View>
            <View className="flex-row justify-center gap-4 mb-6">
              <View className="h-10 w-28 bg-white/30 rounded-lg" />
              <View className="h-10 w-20 bg-white/30 rounded-lg" />
            </View>
            <View className="flex-row justify-between">
              {Array.from({ length: 3 }).map((_, i) => (
                <View key={i} className="items-center flex-1">
                  <View className="w-12 h-12 bg-white/30 rounded-full mb-2" />
                  <View className="h-3 w-12 bg-white/30 rounded-md" />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  const balanceObj = selectedWallet.balances?.[0];
  const currencyCode =
    balanceObj?.currency?.code || selectedWallet.code || '---';
  const displayAmount =
    balanceObj?.availableBalance ||
    balanceObj?.totalBalance ||
    selectedWallet.balance ||
    '0.00';

  return (
    <View className="mx-6 mb-6 relative">
      <View className="bg-primary-900 rounded-3xl p-6 relative overflow-hidden">
        <View className="w-[95%] mx-auto">
          <View className="items-center mb-6">
            <View className="flex-row items-center">
              <Typography variant="h3" color="white" className="font-bold">
                {isBalanceVisible
                  ? `${getSymbolFromCode(currencyCode)} ${formatNumberWithCommas(displayAmount)}`
                  : '****'}
              </Typography>
              <TouchableOpacity
                onPress={toggleBalanceVisibility}
                className="ml-2 h-12 w-8 items-center justify-center"
              >
                {isBalanceVisible ? (
                  <Eye size={20} color="white" variant="Outline" />
                ) : (
                  <EyeSlash size={20} color="white" variant="Outline" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center justify-center gap-4 mb-6">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/account-details',
                  params: {
                    currency: selectedWallet.code,
                    currencyName: selectedWallet.name,
                    balance: displayAmount,
                  },
                })
              }
              className="bg-white bg-opacity-20 rounded-2xl px-4 py-2 flex-row items-center"
            >
              <View className="w-6 h-6 bg-white rounded-sm mr-2 items-center justify-center">
                <Bank size={16} />
              </View>
              <Typography variant="small" className="mr-2" weight="600">
                ********
              </Typography>
              <ArrowRight size={16} variant="Outline" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShowWalletSelector}
              className="bg-white bg-opacity-20 rounded-2xl px-4 py-2 flex-row items-center"
            >
              <View className="w-6 h-6 rounded-full mr-2 items-center justify-center">
                <ArrowDown2 size={12} color="white" />
              </View>
              <Typography variant="small" weight="bold" className="mr-2">
                {currencyCode}
              </Typography>
              <ArrowDown2 size={16} color="white" variant="Outline" />
            </TouchableOpacity>
          </View>

          <View className="bg-white/20 bg-opacity-30 rounded-3xl p-4">
            <View className="flex-row justify-between">
              {actionItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="items-center flex-1"
                  onPress={() =>
                    router.push({
                      pathname: item.path,
                      params: {
                        currency: selectedWallet.code,
                        currencyName: selectedWallet.name,
                        balance: displayAmount,
                      },
                    })
                  }
                >
                  <View className="w-12 h-12 bg-white rounded-full items-center justify-center mb-2">
                    {item.icon}
                  </View>
                  <Typography
                    variant="small"
                    color="white"
                    className="font-medium"
                  >
                    {item.label}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
