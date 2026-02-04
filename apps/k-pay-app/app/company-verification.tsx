import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Dropdown } from '@/components/ui';
import { Input } from '@/components/ui/input/input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { getSpacing, getColor } from '@/theme';
import { ArrowLeft, DocumentUpload } from 'iconsax-react-nativejs';
import type { DropdownOption } from '@/components/ui';
import {
  validateCompanyVerificationForm,
  validateCompanyVerificationField,
  CompanyVerificationFormData,
  CompanyVerificationFormErrors,
} from '../src/validations/verification/company-verification';

const identityTypeOptions: DropdownOption[] = [
  {
    value: 'business_registration',
    label: 'Business Registration Certificate',
  },
  { value: 'incorporation_certificate', label: 'Certificate of Incorporation' },
  { value: 'tax_identification', label: 'Tax Identification Number' },
  { value: 'trade_license', label: 'Trade License' },
];

export default function CompanyVerificationScreen() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<CompanyVerificationFormData>({
    identityType: '',
    companyName: '',
    identityNumber: '',
    identityProof: null,
  });

  const [errors, setErrors] = useState<CompanyVerificationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const validation = validateCompanyVerificationForm(formData, t);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleInputChange = (
    field: keyof CompanyVerificationFormData,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert('Success', 'Company verification submitted successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to submit company verification. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = () => {
    // Simulate file selection for demo purposes
    // In a real app, this would use expo-document-picker or expo-image-picker
    Alert.alert('Select Document', 'Choose document type', [
      {
        text: 'Camera',
        onPress: () => {
          handleInputChange('identityProof', 'company_certificate.jpg');
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          handleInputChange('identityProof', 'business_registration.pdf');
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
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
            Company Verification
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
            {/* Identity Type */}
            <View>
              <Dropdown
                label="Identity Type"
                options={identityTypeOptions}
                selectedValue={formData.identityType}
                onSelect={(option) => {
                  handleInputChange('identityType', option.value);
                }}
                placeholder="Select Identity type"
                searchable={false}
                error={errors.identityType}
              />
            </View>

            {/* Company Name */}
            <View>
              <Input
                label="Company Name"
                placeholder="Type company name"
                value={formData.companyName}
                onChangeText={(text) => {
                  handleInputChange('companyName', text);
                }}
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.companyName}
              />
            </View>

            {/* Identity Number */}
            <View>
              <Input
                label="Identity Number"
                placeholder="Enter Identity type"
                value={formData.identityNumber}
                onChangeText={(text) => {
                  handleInputChange('identityNumber', text);
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                error={errors.identityNumber}
              />
            </View>

            {/* Attach Identity Proof */}
            <View>
              <Typography
                variant="body"
                className="text-gray-900 mb-2 font-medium"
              >
                Attach Identity Proof
              </Typography>
              <TouchableOpacity
                onPress={handleFileUpload}
                className={`bg-white rounded-xl border items-center justify-center flex-row ${errors.identityProof ? 'border-red-300' : 'border-gray-300'}`}
                style={{
                  paddingHorizontal: getSpacing('lg'),
                  paddingVertical: getSpacing('lg'),
                  minHeight: 60,
                }}
              >
                <View className="flex-row items-center justify-between flex-1">
                  <View className="flex-row items-center">
                    <View className="bg-blue-50 rounded-lg p-2 mr-3">
                      <DocumentUpload size={20} color={getColor('blue.500')} />
                    </View>
                    <Typography
                      variant="body"
                      className="text-blue-500 font-medium"
                    >
                      Choose File
                    </Typography>
                  </View>

                  <Typography variant="body" className="text-gray-400">
                    {formData.identityProof || 'No File Chosen'}
                  </Typography>
                </View>
              </TouchableOpacity>
              {errors.identityProof && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.identityProof}
                </Typography>
              )}
            </View>

            {/* Verify Button */}
            <View
              style={{
                paddingTop: getSpacing('xl'),
                paddingBottom: getSpacing('xl'),
              }}
            >
              <ReusableButton
                variant="primary"
                text="Verify Company"
                className="bg-red-500"
                style={{
                  paddingVertical: getSpacing('md'),
                }}
                onPress={handleSubmit}
                showArrow={true}
                loading={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
