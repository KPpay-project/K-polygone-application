import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Typography, ReusableButton } from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import { CROSS_CURRENCY_QUOTE } from '@/lib/graphql/mutations/exchange_mutation';
import { useMutation, useQuery } from '@apollo/client';
import { getGraphQLErrorMessage } from '@/utils/error-handling';
import { ReusableModal } from '@/components/ui/modal/modal';
import CrossCurrencyPreviewAndConvertionAction from '@/components/actions/cross-currency-convertion-action';
import { BottomSheetModal } from '@/components/ui/modal/bottom-sheet-modal';
import { GET_MY_CURRENCIES_QUERY } from '@/lib/graphql/queries';
import { ArrowDown2 } from 'iconsax-react-nativejs';
import { getCountryFlag, getCountryInfo } from '@/utils/country';
import {
  formatCurrencyByCode,
  formatCurrencyWithCommas,
} from '@/utils/numbers';
import { getSymbolFromCode } from 'currency-code-symbol-map';

export default function ConvertPage() {
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [fromWallet, setFromWallet] = useState<any>(null);
  const [toWallet, setToWallet] = useState<any>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [quote, setQuote] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<any | null>(null);
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [walletModalSide, setWalletModalSide] = useState<'from' | 'to'>('from');

  const { data, loading: walletsLoading } = useQuery(GET_MY_CURRENCIES_QUERY);
  const wallets = data?.me?.wallets || [];

  const [getCrossQuote, { loading: quoteLoading }] =
    useMutation(CROSS_CURRENCY_QUOTE);

  useEffect(() => {
    if (wallets.length > 0 && !fromWallet) {
      setFromWallet(wallets[0]);
      if (wallets.length > 1) {
        setToWallet(wallets[1]);
      }
    }
  }, [wallets]);

  const getLiveQuote = useCallback(
    async (amount: string, fromW: any, toW: any) => {
      if (!amount || parseFloat(amount) <= 0 || !fromW || !toW) {
        setToAmount('');
        return;
      }

      if (fromW.id === toW.id) {
        setToAmount('');
        return;
      }

      try {
        const { data } = await getCrossQuote({
          variables: {
            input: {
              amount: parseFloat(amount),
              fromWalletId: fromW.id,
              toWalletId: toW.id,
            },
          },
        });

        if (data?.crossCurrencyQuote) {
          const receiveAmount =
            data.crossCurrencyQuote.receiveAmount?.toString() || '';
          setToAmount(receiveAmount);
        }
      } catch (err: any) {
        console.error('Live quote failed:', err);
      }
    },
    [getCrossQuote]
  );

  const handleAmountChange = (value: string) => {
    setFromAmount(value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      getLiveQuote(value, fromWallet, toWallet);
    }, 800);

    setDebounceTimer(newTimer);
  };

  const handleWalletSelect = (wallet: any) => {
    if (walletModalSide === 'from') {
      setFromWallet(wallet);
      if (fromAmount) {
        getLiveQuote(fromAmount, wallet, toWallet);
      }
    } else {
      setToWallet(wallet);
      if (fromAmount) {
        getLiveQuote(fromAmount, fromWallet, wallet);
      }
    }
    setWalletModalVisible(false);
  };

  const handleSwap = () => {
    const tempWallet = fromWallet;
    setFromWallet(toWallet);
    setToWallet(tempWallet);

    const tempAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempAmount);

    if (toAmount) {
      getLiveQuote(toAmount, toWallet, tempWallet);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  async function onSubmit() {
    setError(null);
    setIsSubmitting(true);

    try {
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (!fromWallet || !toWallet) {
        setError('Please select currencies for exchange');
        return;
      }

      if (fromWallet.id === toWallet.id) {
        setError('Please select different currencies for exchange');
        return;
      }

      const availableBalance = parseFloat(
        fromWallet?.balances?.[0]?.availableBalance || '0'
      );
      const requestedAmount = parseFloat(fromAmount);

      if (requestedAmount > availableBalance) {
        setError(
          `Insufficient balance. Available: ${availableBalance} ${fromWallet.currency?.code}`
        );
        return;
      }

      const { data } = await getCrossQuote({
        variables: {
          input: {
            amount: parseFloat(fromAmount),
            fromWalletId: fromWallet.id,
            toWalletId: toWallet.id,
          },
        },
      });

      if (data?.crossCurrencyQuote) {
        setQuote(data.crossCurrencyQuote);
        setIsOpen(true);
      } else {
        setError('Unable to get exchange quote. Please try again.');
      }
    } catch (err: any) {
      console.error('Quote failed:', err);
      const errorMsg = getGraphQLErrorMessage(
        err,
        'Failed to get exchange quote. Please try again.'
      );
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  const getBalance = (wallet: any): string => {
    if (!wallet) return '0';
    const balance = wallet?.balances?.[0]?.availableBalance || '0';
    return formatCurrencyByCode(
      balance,
      wallet?.currency?.code || 'USD',
      'en-US'
    );
  };

  return (
    <ScreenContainer useSafeArea={true} paddingHorizontal={20}>
      <HeaderWithTitle title="Exchange money" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* From Card */}
        <View className="border border-gray-200 rounded-2xl p-4 bg-white mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Typography variant="body" className="text-gray-600">
              From
            </Typography>
            <Typography variant="caption" className="text-gray-600">
              Available balance: {getBalance(fromWallet)}
            </Typography>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                setWalletModalSide('from');
                setWalletModalVisible(true);
              }}
              activeOpacity={0.7}
              className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mr-3"
            >
              <View className="w-8 h-8 bg-green-700 rounded-full items-center justify-center mr-2">
                <Typography variant="body" className="text-white font-bold">
                  {getSymbolFromCode(fromWallet?.currency?.code || 'USD')}
                </Typography>
              </View>
              <Typography variant="body" className="font-bold mr-1">
                {fromWallet?.currency?.code || 'USD'}
              </Typography>
              <ArrowDown2 size={16} color="#6B7280" />
            </TouchableOpacity>

            <View className="flex-1">
              <TextInput
                value={fromAmount}
                onChangeText={handleAmountChange}
                placeholder="Enter Amount"
                keyboardType="decimal-pad"
                className="text-lg font-semibold text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* Swap Button */}
        <View className="items-center my-4">
          <TouchableOpacity
            onPress={handleSwap}
            activeOpacity={0.8}
            className="w-11 h-11 rounded-full bg-blue-50 items-center justify-center"
          >
            <Typography variant="body" className="text-indigo-700 text-lg">
              ⇄
            </Typography>
          </TouchableOpacity>
        </View>

        {/* To Card */}
        <View className="border border-gray-200 rounded-2xl p-4 bg-white">
          <View className="flex-row items-center justify-between mb-3">
            <Typography variant="body" className="text-gray-600">
              To
            </Typography>
            <Typography variant="caption" className="text-gray-600">
              Available balance: {getBalance(toWallet)}
            </Typography>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => {
                setWalletModalSide('to');
                setWalletModalVisible(true);
              }}
              activeOpacity={0.7}
              className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mr-3"
            >
              <View className="w-8 h-8 bg-green-700 rounded-full items-center justify-center mr-2">
                <Typography variant="body" className="text-white font-bold">
                  {getSymbolFromCode(toWallet?.currency?.code || 'USD')}
                </Typography>
              </View>
              <Typography variant="body" className="font-bold mr-1">
                {toWallet?.currency?.code || 'USD'}
              </Typography>
              <ArrowDown2 size={16} color="#6B7280" />
            </TouchableOpacity>

            <View className="flex-1">
              <TextInput
                value={formatCurrencyWithCommas(toAmount)}
                editable={false}
                placeholder="Enter Amount"
                className="text-lg font-semibold text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {quote?.feeAmount && (
          <View className="flex-row items-center justify-between mt-6">
            <Typography variant="body" className="text-gray-900">
              Fee
            </Typography>
            <View className="bg-green-50 px-3 py-2 rounded-lg">
              <Typography
                variant="caption"
                className="text-green-800 font-semibold"
              >
                {quote?.feeAmount} {quote?.fromCurrencyCode}
              </Typography>
            </View>
          </View>
        )}

        {error && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-3 mt-4">
            <Typography variant="caption" className="text-red-800">
              {error}
            </Typography>
          </View>
        )}

        {/* Continue Button */}
        <View className="mt-8 mb-10">
          <ReusableButton
            text={
              isSubmitting || quoteLoading ? 'Getting Quote...' : 'Continue'
            }
            onPress={onSubmit}
            disabled={
              isSubmitting ||
              quoteLoading ||
              walletsLoading ||
              wallets.length === 0
            }
            className="bg-red-600"
            showArrow
          />
        </View>

        <BottomSheetModal visible={isOpen} onClose={() => setIsOpen(false)}>
          {quote && (
            <CrossCurrencyPreviewAndConvertionAction
              quote={{
                ...quote,
                fromWalletId: fromWallet?.id,
                toWalletId: toWallet?.id,
              }}
              onSuccess={() => setIsOpen(false)}
            />
          )}
        </BottomSheetModal>

        <BottomSheetModal
          visible={walletModalVisible}
          onClose={() => setWalletModalVisible(false)}
        >
          <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
            {walletsLoading ? (
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
                      onPress={() => handleWalletSelect(wallet)}
                      className="flex-row items-center py-4 px-4 mb-3 bg-gray-50 rounded-xl"
                    >
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                        style={{ backgroundColor: '#e1ecfd' }}
                      >
                        <Typography
                          variant="h4"
                          className="text-white font-bold"
                        >
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
      </ScrollView>
    </ScreenContainer>
  );
}
