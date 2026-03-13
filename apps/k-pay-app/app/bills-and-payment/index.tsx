import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { getSpacing } from '@/theme';
import { useTranslation } from 'react-i18next';
import { HeaderWithTitle } from '@/components';
import { useQuery } from '@apollo/client';
import {
  FLUTTERWAVE_BILL_CATEGORIES,
  FLUTTERWAVE_BILLERS,
  FLUTTERWAVE_BILL_ITEMS,
} from '@repo/api';
import { Dropdown } from '@/components/ui/dropdown/dropdown';
import CountrySelector, { type Country } from '@/components/input';
import { countries as countriesData } from '@/data/countries';
import { BillsPaymentForm } from './components';

type FlutterwaveBillCategory = {
  code: string;
  country: string;
  id: string;
  name: string;
};

type FlutterwaveBiller = {
  billerCode: string;
  category: string;
  country: string;
  id: string;
  isActive: boolean | null;
  name: string;
};

type FlutterwaveBillItem = {
  amount: string;
  billerCode: string;
  country: string;
  currency: string | null;
  id: string;
  isAmountFixed: boolean | null;
  itemCode: string;
  name: string;
};

export default function BillsAndPaymentScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');
  const [selectedBillerId, setSelectedBillerId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const defaultCountry = useMemo(() => {
    const match = countriesData.find((c) => c.code === selectedCountryCode) || countriesData[0];
    return {
      code: match.code,
      name: match.name,
      flag: match.flag,
      dialCode: match.phoneCode,
    } satisfies Country;
  }, [selectedCountryCode]);

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(defaultCountry);

  useEffect(() => {
    setSelectedCountry(defaultCountry);
  }, [defaultCountry]);

  const { data: categoriesData } = useQuery<{
    flutterwaveBillCategories: FlutterwaveBillCategory[];
  }>(FLUTTERWAVE_BILL_CATEGORIES, {
    variables: { countryCode: selectedCountryCode },
    skip: !selectedCountryCode,
  });

  const { data: billersData } = useQuery<{ flutterwaveBillers: FlutterwaveBiller[] }>(
    FLUTTERWAVE_BILLERS,
    {
      variables: {
        category: selectedCategoryCode,
        countryCode: selectedCountryCode,
      },
      skip: !selectedCategoryCode || !selectedCountryCode,
    }
  );

  const selectedBillerCode = useMemo(() => {
    return (billersData?.flutterwaveBillers || []).find((item) => item.id === selectedBillerId)?.billerCode || null;
  }, [billersData, selectedBillerId]);

  const { data: billItemsData } = useQuery<{ flutterwaveBillItems: FlutterwaveBillItem[] }>(
    FLUTTERWAVE_BILL_ITEMS,
    {
      variables: {
        billerCode: selectedBillerCode || '',
        countryCode: selectedCountryCode,
      },
      skip: !selectedBillerCode || !selectedCountryCode,
    }
  );

  useEffect(() => {
    setSelectedBillerId(null);
    setSelectedItemId(null);
  }, [selectedCategoryCode, selectedCountryCode]);

  const availableBillers = useMemo(() => {
    return billersData?.flutterwaveBillers || [];
  }, [billersData]);

  const availableBillerOptions = useMemo(() => {
    return availableBillers.map((biller) => ({
      value: biller.id,
      label: biller.name,
    }));
  }, [availableBillers]);

  const availableBillItemOptions = useMemo(() => {
    return (billItemsData?.flutterwaveBillItems || []).map((item) => ({
      value: item.id,
      label: `${item.name}${item.amount ? ` - ${item.amount}` : ''} (${item.itemCode})`,
    }));
  }, [billItemsData]);

  const categoryOptions = useMemo(() => {
    return (categoriesData?.flutterwaveBillCategories || []).map((category) => ({
      value: category.code,
      label: category.name,
    }));
  }, [categoriesData]);

  const selectedCategory = useMemo(
    () =>
      (categoriesData?.flutterwaveBillCategories || []).find(
        (item) => item.code === selectedCategoryCode
      ) || null,
    [categoriesData, selectedCategoryCode]
  );

  const selectedBiller = useMemo(
    () => availableBillers.find((item) => item.id === selectedBillerId) || null,
    [availableBillers, selectedBillerId]
  );

  const selectedItem = useMemo(
    () =>
      (billItemsData?.flutterwaveBillItems || []).find(
        (item) => item.id === selectedItemId
      ) || null,
    [billItemsData, selectedItemId]
  );

  return (
    <ScreenContainer useSafeArea={true} className="bg-gray-50">
      <HeaderWithTitle
        px={8}
        title="Bills payment"
        description="Manage your bills and payments"
      />

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: getSpacing('lg'),
          paddingBottom: getSpacing('2xl'),
        }}
      >
        <View className={isWide ? 'flex-row gap-6' : 'flex-col gap-6'}>
          <View
            className={`bg-white rounded-2xl border border-gray-100 p-4 ${
              isWide
                ? selectedCategoryCode
                  ? 'w-1/2'
                  : 'w-full'
                : 'w-full'
            }`}
          >
            <Typography className="text-gray-900 font-semibold mb-6">
              {t('billPayment.title') || 'Bill payment'}
            </Typography>

            <View className="mb-6">
              <Dropdown
                options={categoryOptions}
                selectedValue={selectedCategoryCode || undefined}
                onSelect={(option) => setSelectedCategoryCode(option.value)}
                placeholder={t('placeholders.searchBillType') || 'Select bill category'}
                searchPlaceholder={t('placeholders.searchBillType') || 'Search bill category'}
                searchable={true}
                emptyMessage="No bill category found"
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Typography variant="caption" className="text-gray-700 font-medium">
                  {t('billPayment.form.country') || 'Country'}
                </Typography>
              </View>
              <CountrySelector
                value={selectedCountry}
                onSelect={(country) => {
                  setSelectedCountry(country);
                  setSelectedCountryCode(country.code);
                }}
                placeholder={t('placeholders.selectCountry') || 'Select country'}
                searchable={true}
                showDialCode={false}
                maxHeight={300}
              />
            </View>

            {categoryOptions.length === 0 ? (
              <View className="py-8">
                <Typography className="text-gray-500 text-center">
                  No services found for this country.
                </Typography>
              </View>
            ) : null}

            {selectedCategoryCode ? (
              <View className="mt-6">
                <Typography className="text-gray-900 font-semibold mb-3">
                  {t('billPayment.availableBrands') || 'Available brands'}
                </Typography>

                {availableBillerOptions.length > 0 ? (
                  <View className="gap-3">
                    <Dropdown
                      options={availableBillerOptions}
                      selectedValue={selectedBillerId || undefined}
                      onSelect={(option) => {
                        setSelectedBillerId(option.value);
                        setSelectedItemId(null);
                      }}
                      placeholder={t('placeholders.selectNetwork') || 'Select biller'}
                      searchPlaceholder={t('placeholders.searchBillType') || 'Search biller'}
                      searchable={true}
                      emptyMessage="No biller found"
                    />
                    {selectedBillerId ? (
                      <Dropdown
                        options={availableBillItemOptions}
                        selectedValue={selectedItemId || undefined}
                        onSelect={(option) => setSelectedItemId(option.value)}
                        placeholder="Select bill item"
                        searchPlaceholder="Search bill item"
                        searchable={true}
                        emptyMessage="No bill item found"
                      />
                    ) : null}
                  </View>
                ) : (
                  <Typography variant="caption" className="text-gray-500">
                    {t('billPayment.noBrands') || 'No brands available for this selection.'}
                  </Typography>
                )}
              </View>
            ) : null}
          </View>

          {selectedCategoryCode ? (
            <View
              className={`${
                isWide ? 'w-1/2' : 'w-full'
              }`}
            >
              <BillsPaymentForm
                selectedCategory={selectedCategory}
                selectedBiller={selectedBiller}
                selectedItem={selectedItem}
                countryCode={selectedCountryCode}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
