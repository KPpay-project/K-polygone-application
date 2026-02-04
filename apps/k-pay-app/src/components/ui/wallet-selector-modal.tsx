import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Typography } from './typography/typography';
import { ReusableButton } from './button/reusable-button';
import { router } from 'expo-router';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { formatCurrencyByCode } from '@/utils/numbers';
import { getCountryFlag, getCountryInfo } from '@/utils/country';

interface Wallet {
  id: string;
  name: string;
  code: string;
  balances?: any[];
  color: string;
}

interface WalletSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  wallets: Wallet[];
  onWalletSelect: (wallet: Wallet) => void;
  onCreateWallet: () => void;
}

export function WalletSelectorModal({
  visible,
  onClose,
  wallets,
  onWalletSelect,
  onCreateWallet,
}: WalletSelectorModalProps) {
  const { t } = useTranslation();
  const { setSelectedCurrency } = useCurrency();
  const [isCreating, setIsCreating] = useState(false);

  const handleBackdropPress = () => {
    onClose();
  };

  const handleWalletPress = (wallet: Wallet) => {
    const balance = wallet?.balances?.[0];
    const currency = balance?.currency?.code;

    setSelectedCurrency(currency);
    onWalletSelect(wallet);
    onClose();

    router.push({
      pathname: '/account-details',
      params: {
        walletId: wallet.id,
        currency,
        currencyName: wallet.name,
        balance: balance?.totalBalance || '0.00',
      },
    });
  };

  const handleCreateWallet = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onCreateWallet();
      onClose();
      router.push('/create-new-wallet');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8 max-h-[80%]">
              <View className="items-center mb-6">
                <View className="w-12 h-1 bg-gray-300 rounded-full mb-4" />
                <Typography
                  variant="h4"
                  className="text-gray-900 font-semibold"
                >
                  {t('selectWallet')}
                </Typography>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
                {wallets.map((wallet, index) => {
                  const balance = wallet?.balances?.[0];
                  const currency = balance?.currency;
                  const countryCode = currency?.countryCode || '';
                  const countryFlag = getCountryFlag(countryCode);
                  const countryInfo = getCountryInfo(countryCode);

                  const availableBalance = balance?.availableBalance || '0.00';

                  return (
                    <TouchableOpacity
                      key={wallet.id}
                      onPress={() => handleWalletPress(wallet)}
                      className="flex-row items-center py-4 px-4 mb-2 bg-gray-50 rounded-xl"
                      activeOpacity={0.7}
                    >
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{
                          backgroundColor: wallet.color || '#e1ecfdff',
                        }}
                      >
                        <Typography
                          variant="h4"
                          className="text-white font-bold"
                        >
                          {countryFlag}
                        </Typography>
                      </View>

                      <View className="flex-1">
                        <Typography
                          variant="body"
                          className="text-gray-900 font-semibold"
                        >
                          {wallet.name}{' '}
                          {countryInfo?.countryName
                            ? `${countryInfo.countryName}`
                            : ''}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {formatCurrencyByCode(
                            availableBalance,
                            currency?.code || 'USD',
                            currency?.locale || 'en-US'
                          )}
                        </Typography>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <ReusableButton
                variant="outline"
                onPress={handleCreateWallet}
                textColor="#0000"
                className=" border-0   mb-4 bg-[#EBF4FF]"
                loading={isCreating}
              >
                <Typography weight="500" className="text-blue-700">
                  {t('createNewWallet')}
                </Typography>
              </ReusableButton>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
