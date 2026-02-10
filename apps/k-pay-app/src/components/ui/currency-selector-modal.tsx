import React from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Typography } from './typography/typography';
import { CloseCircle } from 'iconsax-react-nativejs';
import { useWalletAbstractor } from '@/hooks/use-wallet';
import { useCurrencies } from '@/hooks/use-currencies';

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  balance?: string;
  walletId?: string;
}

interface CurrencySelectorModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCurrency?: string;
  onCurrencySelect: (currency: Currency) => void;
}

export function CurrencySelectorModal({
  visible,
  onClose,
  selectedCurrency,
  onCurrencySelect,
}: CurrencySelectorModalProps) {
  const { getAllWallets, walletData } = useWalletAbstractor();
  const { apiCurrencies, getCurrencySymbol } = useCurrencies();

  const userWallets = getAllWallets();

  const currencies: Currency[] = userWallets.map((wallet) => {
    const balance = wallet.balances?.[0];
    const currencyCode = balance?.currency?.code || 'USD';
    const currencySymbol = getCurrencySymbol(currencyCode);
    const availableBalance = balance?.availableBalance || '0';

    const apiCurrency = apiCurrencies?.find(
      (curr) => curr.code === currencyCode
    );

    return {
      id: wallet.id,
      name: apiCurrency?.name || `${currencyCode} Wallet`,
      code: currencyCode,
      symbol: currencySymbol,
      balance: availableBalance,
      walletId: wallet.id,
    };
  });

  const handleBackdropPress = () => {
    onClose();
  };

  const handleCurrencyPress = (currency: Currency) => {
    onCurrencySelect(currency);
    onClose();
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
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Typography
                  variant="h4"
                  className="text-gray-900 font-semibold text-lg"
                >
                  Select Default Currency
                </Typography>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <CloseCircle size={24} color="#6B7280" variant="Outline" />
                </TouchableOpacity>
              </View>

              {/* Currency List */}
              <ScrollView showsVerticalScrollIndicator={false}>
                {currencies.map((currency) => {
                  const isSelected = selectedCurrency === currency.code;

                  const getIconStyle = (code: string, symbol: string) => {
                    switch (code) {
                      case 'XOF':
                        return { bg: 'bg-blue-500', icon: 'f' };
                      case 'NGN':
                        return { bg: 'bg-green-600', icon: '₦' };
                      case 'ZMW':
                        return { bg: 'bg-orange-500', icon: 'K' };
                      case 'USD':
                        return { bg: 'bg-green-500', icon: '$' };
                      case 'EUR':
                        return { bg: 'bg-blue-600', icon: '€' };
                      case 'GBP':
                        return { bg: 'bg-indigo-600', icon: '£' };
                      default:
                        return {
                          bg: 'bg-gray-500',
                          icon: symbol || code.charAt(0),
                        };
                    }
                  };

                  const iconStyle = getIconStyle(
                    currency.code,
                    currency.symbol
                  );

                  return (
                    <TouchableOpacity
                      key={currency.id}
                      onPress={() => handleCurrencyPress(currency)}
                      className="flex-row items-center py-4 mb-3"
                      activeOpacity={0.7}
                    >
                      <View
                        className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${iconStyle.bg}`}
                      >
                        <Typography
                          variant="body"
                          className="text-white font-bold text-lg"
                        >
                          {iconStyle.icon}
                        </Typography>
                      </View>
                      <View className="flex-1">
                        <Typography
                          variant="body"
                          className="font-medium text-gray-900 text-base"
                        >
                          {currency.name}
                        </Typography>
                        <Typography
                          variant="body"
                          className="text-gray-600 font-medium"
                        >
                          {currency.symbol}
                          {parseFloat(currency.balance || '0').toFixed(2)}
                        </Typography>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
