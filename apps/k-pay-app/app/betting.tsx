import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Dropdown, MoneyInput, Checkbox } from '@/components/ui';
import type { DropdownOption } from '@/components/ui';
import { Input } from '@/components/ui/input/input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { getSpacing } from '@/theme';
import { getCurrencyForCountry } from '@/utils/currency-mapping';
import {
  validateBettingForm,
  validateBettingField,
  BettingFormData,
  BettingFormErrors,
} from '../src/validations/payment/betting-validation';

// Remove local interface as we're using the imported one

const countryOptions: DropdownOption[] = [
  { value: 'kenya', label: 'Kenya' },
  { value: 'uganda', label: 'Uganda' },
  { value: 'tanzania', label: 'Tanzania' },
];

const providerOptions: DropdownOption[] = [
  { value: 'sporty', label: 'Sporty' },
  { value: 'betway', label: 'Betway' },
  { value: 'bet365', label: 'Bet365' },
];

export default function BettingScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BettingFormData>({
    country: '',
    provider: '',
    customerId: '',
    amount: 0,
    saveAsBeneficiary: false,
  });
  const [errors, setErrors] = useState<BettingFormErrors>({});

  // Get currency based on selected country
  const currentCurrency = formData.country
    ? getCurrencyForCountry(formData.country)
    : 'KES';
  const balance = 50000; // Mock balance

  const handleInputChange = (field: keyof BettingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field as keyof BettingFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const formErrors = validateBettingForm(formData, t);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleProceed = () => {
    if (!validateForm()) {
      return;
    }

    // Navigate to betting review screen
    router.push({
      pathname: '/betting-review',
      params: {
        country:
          countryOptions.find((c) => c.value === formData.country)?.label || '',
        provider:
          providerOptions.find((p) => p.value === formData.provider)?.label ||
          '',
        customerId: formData.customerId,
        amount: formData.amount,
      },
    });
  };

  const isFormValid =
    formData.country &&
    formData.provider &&
    formData.customerId.trim() !== '' &&
    formData.amount > 0;

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" variant="Outline" />
          </TouchableOpacity>
          <Typography variant="h3" className="text-gray-900 font-semibold">
            Betting
          </Typography>
          <View style={{ width: 24 }} />
        </View>

        <View className="px-6 pb-6">
          {/* Country Selection */}
          <View style={{ marginBottom: getSpacing('lg') }}>
            <Dropdown
              options={countryOptions}
              selectedValue={
                countryOptions.find((c) => c.value === formData.country)?.value
              }
              onSelect={(option) =>
                handleInputChange('country', option?.value || '')
              }
              placeholder="Select country"
              label="Country of Residence"
            />
            {errors.country && (
              <Typography variant="body" color="error" style={{ marginTop: 4 }}>
                {errors.country}
              </Typography>
            )}
          </View>

          {/* Provider Selection */}
          <View style={{ marginBottom: getSpacing('lg') }}>
            <Dropdown
              options={providerOptions}
              selectedValue={
                providerOptions.find((p) => p.value === formData.provider)
                  ?.value
              }
              onSelect={(option) =>
                handleInputChange('provider', option?.value || '')
              }
              placeholder="Select provider"
              label="Betting Provider"
            />
            {errors.provider && (
              <Typography variant="body" color="error" style={{ marginTop: 4 }}>
                {errors.provider}
              </Typography>
            )}
          </View>

          {/* Customer ID */}
          <View style={{ marginBottom: getSpacing('lg') }}>
            <Input
              label="Customer ID / Username / Account Number"
              value={formData.customerId}
              onChangeText={(text: string) =>
                handleInputChange('customerId', text)
              }
              placeholder="12345777"
            />
            {errors.customerId && (
              <Typography variant="body" color="error" style={{ marginTop: 4 }}>
                {errors.customerId}
              </Typography>
            )}
          </View>

          {/* Amount */}
          <MoneyInput
            label="Amount"
            value={formData.amount}
            onChange={(value: number) => handleInputChange('amount', value)}
            balance={balance.toString()}
            placeholder="Enter amount"
            currency={currentCurrency as any}
          />
          {errors.amount && (
            <Typography variant="body" color="error" style={{ marginTop: 4 }}>
              {errors.amount}
            </Typography>
          )}

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
        </View>
      </ScrollView>

      {/* Proceed Button */}
      <View className="px-6 pb-6">
        <ReusableButton
          text="Proceed"
          onPress={handleProceed}
          disabled={!isFormValid}
          className="w-full"
        />
      </View>
    </ScreenContainer>
  );
}
