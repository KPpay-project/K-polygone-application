import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Typography } from '../ui';
import { ArrowDown2 } from 'iconsax-react-nativejs';
import { BottomSheetModal } from '../ui/modal/bottom-sheet-modal';
import { getCountryFlag, getCountryInfo } from '@/utils/country';
import { formatCurrencyByCode } from '@/utils/numbers';
import { getSymbolFromCode } from 'currency-code-symbol-map';
import { GET_MY_CURRENCIES_QUERY } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';

interface CurrencyDropdownWithBalanceProps {
  onCurrencySelect?: (data: {
    availableBalance: string;
    currencyCode: string;
    currencyId: string;
    walletId: string;
  }) => void;
}

const CurrencyDropdownWithBalance = ({
  onCurrencySelect,
}: CurrencyDropdownWithBalanceProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCurrencyAmount, setSelectedCurrencyAmount] = useState(0);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('');

  const { data, loading, error } = useQuery(GET_MY_CURRENCIES_QUERY);

  const wallets = data?.me?.wallets || [];
  const primaryWallet = wallets?.[0];
  const primaryCurrency = primaryWallet?.currency?.code || 'USD';

  const displayCurrency = selectedCurrencyCode || primaryCurrency;
  const displayAmount = selectedCurrencyAmount || 0;

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
        className="bg-gray-50 rounded-xl p-4 mb-6 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 bg-green-700 rounded-full items-center justify-center mr-3">
            <Typography
              variant="body"
              weight="bold"
              className="!font-bold text-white "
            >
              {getSymbolFromCode(displayCurrency)}
            </Typography>
          </View>

          <Typography
            variant="caption"
            weight="600"
            className="text-gray-900 font-medium"
          >
            {displayCurrency}
          </Typography>

          <ArrowDown2 size={18} color="#6B7280" />
        </View>

        <Typography
          variant="caption"
          weight="700"
          className="text-gray-600 font-semibold"
        >
          {formatCurrencyByCode(displayAmount, displayCurrency, 'en-US')}
        </Typography>
      </TouchableOpacity>

      <BottomSheetModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
          {loading ? (
            <ActivityIndicator size="large" color="#dc2626" />
          ) : (
            <>
              {wallets.map((wallet: any) => {
                const balance = wallet?.balances?.[0];
                const currency = wallet?.currency;
                const countryCode = currency?.countryCode || '';
                const flag = getCountryFlag(countryCode);
                const info = getCountryInfo(countryCode);

                const formattedBalance = formatCurrencyByCode(
                  balance?.availableBalance || '0',
                  currency?.code || 'USD',
                  'en-US'
                );

                return (
                  <TouchableOpacity
                    key={wallet.id}
                    activeOpacity={0.8}
                    onPress={() => {
                      setSelectedCurrencyAmount(balance?.availableBalance || 0);
                      setSelectedCurrencyCode(currency?.code || 'USD');
                      setIsModalVisible(false);

                      if (onCurrencySelect) {
                        onCurrencySelect({
                          availableBalance: balance?.availableBalance || '0',
                          currencyCode: currency?.code || 'USD',
                          currencyId: currency?.id || '',
                          walletId: wallet?.id || '',
                        });
                      }
                    }}
                    className="flex-row items-center py-4 px-4 mb-3 bg-gray-50 rounded-xl"
                  >
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mr-4"
                      style={{ backgroundColor: '#e1ecfd' }}
                    >
                      <Typography variant="h4" className="text-white font-bold">
                        {flag}
                      </Typography>
                    </View>

                    <View className="flex-1">
                      <Typography
                        variant="body"
                        className="text-gray-900 font-semibold"
                      >
                        {currency?.code} - {info?.countryName || ''}
                      </Typography>

                      <Typography variant="caption" className="text-gray-500">
                        {formattedBalance}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>
      </BottomSheetModal>
    </>
  );
};

export default CurrencyDropdownWithBalance;
