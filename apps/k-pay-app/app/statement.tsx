import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Dropdown, DateSelector } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import type { DropdownOption } from '@/components/ui';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function StatementScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const initialCurrency = (params.currency as string) || 'XOF';

  const currencies = [
    { code: 'XOF', symbol: 'CFA', name: t('westAfricanCFAFranc') },
    { code: 'USD', symbol: '$', name: t('usDollar') },
    { code: 'EUR', symbol: '€', name: t('euro') },
    { code: 'GBP', symbol: '£', name: t('britishPound') },
    { code: 'NGN', symbol: '₦', name: t('nigerianNaira') },
  ];

  const formatTypes = [
    { value: 'PDF', label: t('pdf') },
    { value: 'CSV', label: t('csv') },
    { value: 'EXCEL', label: t('excel') },
  ];

  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedFormat, setSelectedFormat] = useState(formatTypes[0].value);
  const [isDownloading, setIsDownloading] = useState(false);

  // Convert currencies to dropdown options
  const currencyOptions: DropdownOption[] = useMemo(
    () =>
      currencies.map((currency) => ({
        value: currency.code,
        label: currency.code,
        subtitle: currency.name,
        icon: (
          <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center">
            <Typography variant="caption" className="text-white font-bold">
              {currency.code && currency.code.length > 0
                ? currency.code.charAt(0)
                : 'C'}
            </Typography>
          </View>
        ),
      })),
    []
  );

  // Convert format types to dropdown options
  const formatOptions: DropdownOption[] = useMemo(
    () =>
      formatTypes.map((format) => ({
        value: format.value,
        label: format.label,
      })),
    []
  );

  const handleDownloadStatement = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      // Simulate statement download process
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Failed to download statement:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCurrencySelect = (option: DropdownOption) => {
    setSelectedCurrency(option.value);
  };

  const handleFormatSelect = (option: DropdownOption) => {
    setSelectedFormat(option.value);
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Typography variant="h3" className="text-gray-900 font-semibold">
          {t('statementOfAccount')}
        </Typography>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Currency Selection */}
        <View className="mt-6 mb-6">
          <Dropdown
            label={t('selectCurrency')}
            options={currencyOptions}
            selectedValue={selectedCurrency}
            onSelect={handleCurrencySelect}
            placeholder={t('chooseCurrency')}
            searchable={true}
          />
        </View>

        {/* Start Date */}
        <View className="mb-6">
          <DateSelector
            label={t('startDate')}
            value={startDate}
            onDateSelect={setStartDate}
            placeholder={t('selectStartDate')}
          />
        </View>

        {/* End Date */}
        <View className="mb-6">
          <DateSelector
            label={t('endDate')}
            value={endDate}
            onDateSelect={setEndDate}
            placeholder={t('selectEndDate')}
          />
        </View>

        {/* Format Type */}
        <View className="mb-8">
          <Dropdown
            label={t('formatType')}
            options={formatOptions}
            selectedValue={selectedFormat}
            onSelect={handleFormatSelect}
            placeholder={t('chooseFormat')}
            searchable={false}
          />
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Download Button */}
        <View className="mb-6">
          <ReusableButton
            variant="primary"
            text={t('downloadStatementOfAccount')}
            onPress={handleDownloadStatement}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
            loading={isDownloading}
          />
        </View>

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>
    </ScreenContainer>
  );
}
