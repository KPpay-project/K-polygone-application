import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Dropdown } from '@/components/ui';
import { Input } from '@/components/ui/input/input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { getSpacing, getColor } from '@/theme';
import { ArrowLeft, DocumentUpload } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';
import type { DropdownOption } from '@/components/ui';
import {
  validateAddressVerificationForm,
  validateAddressVerificationField,
} from '../src/validations/verification/address-verification';
import type {
  AddressVerificationFormData,
  AddressVerificationFormErrors,
} from '../src/validations/verification/address-verification';

type FormData = AddressVerificationFormData;
type FormErrors = AddressVerificationFormErrors;

const addressTypeOptions: DropdownOption[] = [
  { label: 'Residential Address', value: 'residential' },
  { label: 'Business Address', value: 'business' },
  { label: 'Mailing Address', value: 'mailing' },
];

const countryOptions: DropdownOption[] = [
  { label: 'Nigeria', value: 'nigeria' },
  { label: 'Ghana', value: 'ghana' },
  { label: 'Kenya', value: 'kenya' },
  { label: 'South Africa', value: 'south_africa' },
];

export default function AddressVerificationScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    addressType: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    utilityBill: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = () => {
    Alert.alert(
      'Upload Utility Bill',
      'Please select a utility bill document (PDF, JPG, PNG)',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const validateForm = (): boolean => {
    const validation = validateAddressVerificationForm(formData, t);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        'Address verification submitted successfully. We will review your information and notify you of the status.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to submit address verification. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View
          className="flex-row items-center bg-white"
          style={{
            paddingHorizontal: getSpacing('lg'),
            paddingVertical: getSpacing('md'),
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              marginRight: getSpacing('md'),
            }}
            className="items-center justify-center"
          >
            <ArrowLeft size={24} color={getColor('gray.700')} />
          </TouchableOpacity>

          <Typography variant="h2" className="text-gray-900">
            Address Verification
          </Typography>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          style={{
            paddingHorizontal: getSpacing('lg'),
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingTop: getSpacing('xl'), gap: getSpacing('xl') }}>
            {/* Address Type */}
            <View>
              <Dropdown
                label="Address Type"
                options={addressTypeOptions}
                selectedValue={formData.addressType}
                onSelect={(option) => {
                  handleInputChange('addressType', option.value);
                }}
                placeholder="Select Address Type"
                error={errors.addressType}
              />
            </View>

            {/* Street Address */}
            <View>
              <Input
                label="Street Address"
                placeholder="Enter your street address"
                value={formData.streetAddress}
                onChangeText={(text) => {
                  handleInputChange('streetAddress', text);
                }}
                multiline
                numberOfLines={2}
                error={errors.streetAddress}
              />
            </View>

            {/* City */}
            <View>
              <Input
                label="City"
                placeholder="Enter your city"
                value={formData.city}
                onChangeText={(text) => {
                  handleInputChange('city', text);
                }}
                error={errors.city}
              />
            </View>

            {/* State/Province */}
            <View>
              <Input
                label="State/Province"
                placeholder="Enter your state or province"
                value={formData.state}
                onChangeText={(text) => {
                  handleInputChange('state', text);
                }}
                error={errors.state}
              />
            </View>

            {/* Postal Code */}
            <View>
              <Input
                label="Postal Code"
                placeholder="Enter postal/zip code"
                value={formData.postalCode}
                onChangeText={(text) => {
                  handleInputChange('postalCode', text);
                }}
                error={errors.postalCode}
              />
            </View>

            {/* Country */}
            <View>
              <Dropdown
                label="Country"
                options={countryOptions}
                selectedValue={formData.country}
                onSelect={(option) => {
                  handleInputChange('country', option.value);
                }}
                placeholder="Select Country"
                error={errors.country}
              />
            </View>

            {/* Utility Bill Upload */}
            <View>
              <Typography
                variant="body"
                className="text-gray-900 font-medium mb-2"
              >
                Attach Utility Bill
              </Typography>
              <TouchableOpacity
                onPress={handleFileUpload}
                className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl"
                style={{
                  paddingHorizontal: getSpacing('lg'),
                  paddingVertical: getSpacing('lg'),
                }}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <DocumentUpload
                    size={20}
                    color={getColor('primary.600')}
                    variant="Outline"
                  />
                  <Typography
                    variant="body"
                    className="text-primary-600 font-medium ml-2"
                  >
                    Choose File
                  </Typography>
                </View>
                <Typography variant="body" className="text-gray-500">
                  {formData.utilityBill || 'No File Chosen'}
                </Typography>
              </TouchableOpacity>
              <Typography variant="caption" className="text-gray-500 mt-1">
                Upload a recent utility bill (electricity, water, gas) not older
                than 3 months
              </Typography>
            </View>

            {/* Submit Button */}
            <View style={{ paddingBottom: getSpacing('2xl') }}>
              <ReusableButton
                variant="primary"
                text={isSubmitting ? 'Submitting...' : 'Verify Address'}
                className={`${isSubmitting ? 'bg-red-400' : 'bg-red-500'}`}
                style={{
                  paddingVertical: getSpacing('md'),
                }}
                onPress={handleSubmit}
                showArrow={!isSubmitting}
                disabled={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
