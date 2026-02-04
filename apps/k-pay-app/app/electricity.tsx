import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Dropdown, MoneyInput, Checkbox } from '@/components/ui';
import { Input } from '@/components/ui/input/input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { getColor, getSpacing } from '@/theme';
import { countries } from '@/data/countries';
import type { DropdownOption } from '@/components/ui';
import { getCurrencyForCountry } from '@/utils/currency-mapping';
import {
  validateElectricityForm,
  validateElectricityField,
  ElectricityFormData,
  ElectricityFormErrors,
} from '../src/validations/payment/electricity-validation';

const countryOptions: DropdownOption[] = countries.map((country) => ({
  value: country.code,
  label: country.name,
  icon: (
    <Typography variant="body" className="text-lg">
      {country.flag}
    </Typography>
  ),
}));

const electricityProviders: DropdownOption[] = [
  { value: 'kplc', label: 'KPLC' },
  { value: 'umeme', label: 'Umeme' },
  { value: 'eneo', label: 'Eneo' },
  { value: 'eko', label: 'Eko Electricity' },
  { value: 'ikeja', label: 'Ikeja Electric' },
];

const meterTypes: DropdownOption[] = [
  { value: 'prepaid', label: 'Prepaid' },
  { value: 'postpaid', label: 'Postpaid' },
];

export default function ElectricityScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ElectricityFormData>({
    country: countries[0].code,
    provider: '',
    meterNumber: '',
    meterType: '',
    amount: 0,
    saveAsBeneficiary: false,
  });
  const [errors, setErrors] = useState<ElectricityFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const selectedCountry =
    countries.find((c) => c.code === formData.country) || countries[0];

  const handleInputChange = (field: keyof ElectricityFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field as keyof ElectricityFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountrySelect = (option: DropdownOption) => {
    handleInputChange('country', option.value);
    // Reset provider when country changes
    handleInputChange('provider', '');
  };

  const handleProviderSelect = (option: DropdownOption) => {
    handleInputChange('provider', option.value);
  };

  const handleMeterTypeSelect = (option: DropdownOption) => {
    handleInputChange('meterType', option.value);
  };

  const validateForm = (): boolean => {
    const formErrors = validateElectricityForm(formData, t);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleProceed = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to review screen with electricity data
      router.push({
        pathname: '/electricity-review',
        params: {
          country: selectedCountry.name,
          provider: electricityProviders.find(
            (p) => p.value === formData.provider
          )?.label,
          meterNumber: formData.meterNumber,
          meterType: meterTypes.find((m) => m.value === formData.meterType)
            ?.label,
          amount: formData.amount.toString(),
          currency: getCurrencyForCountry(selectedCountry.code),
        },
      });
    }, 1000);
  };

  const balance = 500; // Mock balance
  const currentCurrency = getCurrencyForCountry(selectedCountry.code);
  const isFormValid =
    formData.provider &&
    formData.meterNumber &&
    formData.meterType &&
    formData.amount > 0;

  return (
    <ScreenContainer useSafeArea={true} className="bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-2">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Typography variant="h3" className="text-gray-900 font-semibold">
          Electricity
        </Typography>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Country of Residence */}
        <View className="mt-6 mb-6">
          <Dropdown
            label="Country of Residence"
            options={countryOptions}
            selectedValue={selectedCountry.code}
            onSelect={handleCountrySelect}
            placeholder="Choose country"
            searchable={true}
            searchPlaceholder="Search countries..."
          />
        </View>

        {/* Electricity Provider */}
        <View className="mb-6">
          <Dropdown
            label="Electricity Provider"
            options={electricityProviders}
            selectedValue={formData.provider}
            onSelect={handleProviderSelect}
            placeholder="Select provider"
            error={errors.provider}
          />
        </View>

        {/* Meter/Account Number */}
        <View className="mb-6">
          <Input
            label="Meter/Account Number"
            value={formData.meterNumber}
            onChangeText={(value) => handleInputChange('meterNumber', value)}
            placeholder="Enter meter number"
            keyboardType="numeric"
            error={errors.meterNumber}
          />
        </View>

        {/* Meter Type */}
        <View className="mb-6">
          <Dropdown
            label="Meter Type (Prepaid / Postpaid)"
            options={meterTypes}
            selectedValue={formData.meterType}
            onSelect={handleMeterTypeSelect}
            placeholder="Select meter type"
            error={errors.meterType}
          />
        </View>

        {/* Amount */}
        <MoneyInput
          label="Amount"
          value={formData.amount}
          onChange={(value) => handleInputChange('amount', value)}
          balance={balance.toString()}
          placeholder="Enter amount"
          currency={currentCurrency}
          error={errors.amount}
        />

        {/* Save as Beneficiary */}
        <View style={{ marginBottom: getSpacing('lg') }}>
          <Checkbox
            checked={formData.saveAsBeneficiary}
            onPress={() =>
              handleInputChange(
                'saveAsBeneficiary',
                !formData.saveAsBeneficiary
              )
            }
            label="Save as beneficiary"
            size="medium"
            variant="primary"
          />
        </View>

        {/* Proceed Button */}
        <View className="mb-8">
          <ReusableButton
            variant="primary"
            text={isLoading ? 'Processing...' : 'Proceed'}
            onPress={handleProceed}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            showArrow={!isLoading}
            textColor="#fff"
            iconColor="#fff"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
