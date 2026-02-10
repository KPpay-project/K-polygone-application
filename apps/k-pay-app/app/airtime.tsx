import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Dropdown, PhoneInput, MoneyInput } from '@/components/ui';
import { Input } from '@/components/ui/input/input';
import { Button } from '@/components/ui/button/button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { getColor, getSpacing } from '@/theme';
import { countries } from '@/data/countries';
import type { DropdownOption } from '@/components/ui';
import { NetworkSelector } from './airtime/components';
import { networkOptions, getCountryOptions } from './airtime/data';
import type { NetworkOption } from './airtime/types';
import { getCurrencyForCountry } from '@/utils/currency-mapping';
import {
  validateAirtimeForm,
  validateAirtimeField,
  AirtimeFormData,
  AirtimeFormErrors,
} from '../src/validations/payment/airtime-validation';

const countryOptions: DropdownOption[] = countries.map((country) => ({
  value: country.code,
  label: country.name,
  icon: (
    <Typography variant="body" className="text-lg">
      {country.flag}
    </Typography>
  ),
}));

export default function AirtimeScreen() {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption | null>(
    null
  );
  const [formData, setFormData] = useState<AirtimeFormData>({
    country: countries[0].code,
    network: '',
    phoneNumber: '',
    amount: 0,
  });
  const [errors, setErrors] = useState<AirtimeFormErrors>({});
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof AirtimeFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field as keyof AirtimeFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountrySelect = (option: DropdownOption) => {
    const country = countries.find((c) => c.code === option.value);
    if (country) {
      setSelectedCountry(country);
      handleInputChange('country', option.value);
    }
    setSelectedNetwork(null);
    handleInputChange('network', '');
  };

  const handleNetworkSelect = (network: NetworkOption) => {
    setSelectedNetwork(network);
    handleInputChange('network', network.name);
    setShowNetworkModal(false);
  };

  const validateForm = (): boolean => {
    const formErrors = validateAirtimeForm(formData, t);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handlePurchase = async () => {
    if (!validateForm()) {
      return;
    }

    // Navigate to airtime review screen
    router.push({
      pathname: '/airtime-review',
      params: {
        country: selectedCountry.code,
        network: selectedNetwork?.name || '',
        phoneNumber: formData.phoneNumber,
        amount: formData.amount.toString(),
      },
    });
  };

  const selectedCountryData = countries.find(
    (c) => c.code === selectedCountry.code
  );
  const balance = 500; // Mock balance
  const currentCurrency = getCurrencyForCountry(selectedCountry.code);

  return (
    <ScreenContainer useSafeArea={true} className="bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Typography variant="h3" className="text-gray-900 font-semibold">
          Airtime
        </Typography>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Select Country */}
        <View className="mt-6 mb-6">
          <Dropdown
            label="Select Country"
            options={countryOptions}
            selectedValue={selectedCountry.code}
            onSelect={handleCountrySelect}
            placeholder="Choose country"
            searchable={true}
            searchPlaceholder="Search countries..."
          />
        </View>

        {/* Network Selection */}
        <View className="mb-6">
          <Typography variant="subtitle" className="text-gray-900 mb-2">
            Network
          </Typography>
          <TouchableOpacity
            className="w-full px-4 py-4 rounded-xl border border-gray-200 flex-row items-center justify-between bg-white"
            onPress={() => setShowNetworkModal(true)}
          >
            <View className="flex-row items-center">
              {selectedNetwork ? (
                <>
                  <Image
                    source={selectedNetwork.logo}
                    className="w-6 h-4 mr-3"
                    style={{ resizeMode: 'contain' }}
                  />
                  <Typography variant="body" className="text-gray-900">
                    {selectedNetwork.name}
                  </Typography>
                </>
              ) : (
                <Typography variant="body" className="text-gray-400">
                  Select Network
                </Typography>
              )}
            </View>
            <Typography variant="caption" className="text-gray-400">
              ▼
            </Typography>
          </TouchableOpacity>
          {errors.network && (
            <Typography variant="body" color="error" style={{ marginTop: 4 }}>
              {errors.network}
            </Typography>
          )}
        </View>

        {/* Phone Number */}
        <View className="mb-6">
          <PhoneInput
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            countries={countries}
            placeholder="Enter Phone Number"
            showContactPicker={true}
          />
          {errors.phoneNumber && (
            <Typography variant="body" color="error" style={{ marginTop: 4 }}>
              {errors.phoneNumber}
            </Typography>
          )}
        </View>

        {/* Amount */}
        <MoneyInput
          label="Amount"
          value={formData.amount}
          onChange={(value) => handleInputChange('amount', value)}
          balance={balance.toString()}
          placeholder="Enter amount"
          currency={currentCurrency}
        />
        {errors.amount && (
          <Typography variant="body" color="error" style={{ marginTop: 4 }}>
            {errors.amount}
          </Typography>
        )}

        {/* Purchase Button */}
        <View className="mt-8 mb-8">
          <Button
            variant="primary"
            onPress={handlePurchase}
            disabled={
              !selectedNetwork ||
              !formData.phoneNumber ||
              !formData.amount ||
              isLoading
            }
            className="bg-blue-600"
          >
            {isLoading ? 'Processing...' : 'Purchase Airtime'}
          </Button>
        </View>
      </ScrollView>

      {/* Network Selection Modal */}
      <NetworkSelector
        selectedNetwork={selectedNetwork}
        onNetworkSelect={handleNetworkSelect}
        showModal={showNetworkModal}
        onCloseModal={() => setShowNetworkModal(false)}
      />
    </ScreenContainer>
  );
}
