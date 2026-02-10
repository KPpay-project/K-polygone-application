import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Dropdown, type DropdownOption } from '@/components/ui';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { useCurrency } from '@/contexts/CurrencyContext';

// Exchange rate data
const exchangeRates = [
  {
    from: 'USD',
    to: 'XOF',
    rate: '5.4179',
    reverseRate: '0.175',
  },
  {
    from: 'USD',
    to: 'NGN',
    rate: '1600',
    reverseRate: '0.006',
  },
  {
    from: 'USD',
    to: 'ZMW',
    rate: '6.2',
    reverseRate: '0.15',
  },
];

export default function OurRatesScreen() {
  const { currencies, selectedCurrency } = useCurrency();
  const [selectedBaseCurrency, setSelectedBaseCurrency] =
    useState(selectedCurrency);

  // Convert currencies to dropdown options
  const currencyOptions: DropdownOption[] = currencies.map((currency) => ({
    value: currency.code,
    label: currency.name,
    subtitle: currency.code,
    icon: (
      <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
        <Typography variant="caption" className="text-white font-bold">
          {currency.symbol || currency.code.charAt(0)}
        </Typography>
      </View>
    ),
  }));

  const handleCurrencySelect = (option: DropdownOption) => {
    setSelectedBaseCurrency(option.value);
  };

  const handleBack = () => {
    router.back();
  };

  // Get filtered exchange rates based on selected currency
  const getFilteredRates = () => {
    return exchangeRates.filter(
      (rate) =>
        rate.from === selectedBaseCurrency || rate.to === selectedBaseCurrency
    );
  };

  const renderRateCard = (rate: any, index: number) => {
    const isFromSelected = rate.from === selectedBaseCurrency;
    const fromCurrency = isFromSelected ? rate.from : rate.to;
    const toCurrency = isFromSelected ? rate.to : rate.from;
    const displayRate = isFromSelected ? rate.rate : rate.reverseRate;
    const reverseDisplayRate = isFromSelected ? rate.reverseRate : rate.rate;
    const filteredRates = getFilteredRates();
    const isLastItem = index === filteredRates.length - 1;

    return (
      <View key={index}>
        <View className="flex-row justify-between items-center py-4">
          {/* Left side - From currency */}
          <View className="flex-1">
            <Typography
              variant="caption"
              className="text-gray-700 font-medium mb-1"
            >
              {fromCurrency} → {toCurrency}
            </Typography>
            <Typography variant="body" className="text-gray-900 font-semibold">
              {displayRate}
            </Typography>
          </View>

          {/* Right side - To currency */}
          <View className="flex-1 items-end">
            <Typography
              variant="caption"
              className="text-gray-700 font-medium mb-1"
            >
              {toCurrency} → {fromCurrency}
            </Typography>
            <Typography variant="body" className="text-gray-900 font-semibold">
              {reverseDisplayRate}
            </Typography>
          </View>
        </View>
        {!isLastItem && <View className="h-px bg-gray-200" />}
      </View>
    );
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-white">
        <TouchableOpacity onPress={handleBack} className="mr-4 p-2">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View className="flex-1">
          <Typography variant="h4" className="text-gray-900 font-semibold">
            Our Rates
          </Typography>
          <Typography variant="caption" className="text-gray-600 mt-1">
            View all supported currency rates at a glance
          </Typography>
        </View>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Currency Selector */}
        <View className="mt-6 mb-6">
          <View className="bg-white rounded-2xl border border-gray-200 p-4">
            <View className="flex-row items-center mb-3">
              <Typography
                variant="caption"
                className="text-gray-700 font-medium mr-2"
              >
                Change :
              </Typography>
            </View>
            <View className="min-h-[40px]">
              <Dropdown
                options={currencyOptions}
                selectedValue={selectedBaseCurrency}
                onSelect={handleCurrencySelect}
                placeholder="Select currency"
                searchable={true}
              />
            </View>
          </View>
        </View>

        {/* Exchange Rates */}
        <View className="mb-8">
          <View className="bg-white rounded-2xl border border-gray-200 px-4">
            {getFilteredRates().map((rate, index) =>
              renderRateCard(rate, index)
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
