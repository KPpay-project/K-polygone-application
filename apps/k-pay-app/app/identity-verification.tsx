import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Dropdown, DateSelector } from '@/components/ui';
import { Input } from '@/components/ui/input/input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { getSpacing, getColor } from '@/theme';
import { ArrowLeft, DocumentUpload } from 'iconsax-react-nativejs';
import type { DropdownOption } from '@/components/ui';
import {
  validateIdentityVerificationForm,
  validateIdentityVerificationField,
  type IdentityVerificationFormData,
  type IdentityVerificationFormErrors,
} from '@/validations/verification/identity-verification';

const identityTypeOptions: DropdownOption[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'national_id', label: 'National ID Card' },
  { value: 'drivers_license', label: "Driver's License" },
  { value: 'voter_id', label: 'Voter ID Card' },
];

export default function IdentityVerificationScreen() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<IdentityVerificationFormData>({
    identityType: '',
    identityNumber: '',
    expiringDate: '',
    identityProof: null,
  });

  const [errors, setErrors] = useState<IdentityVerificationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const validation = validateIdentityVerificationForm(formData, t);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleInputChange = (
    field: keyof IdentityVerificationFormData,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      Alert.alert(
        'Validation Error',
        'Please correct the errors and try again'
      );
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        'Success',
        'Identity verification submitted successfully! You will be notified once the verification is complete.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit verification. Please try again.');
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
          handleInputChange('identityProof', 'passport_photo.jpg');
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          handleInputChange('identityProof', 'identity_document.pdf');
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
            {t('identityVerification')}
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
                label={t('identityType')}
                options={identityTypeOptions}
                selectedValue={formData.identityType}
                onSelect={(option) => {
                  handleInputChange('identityType', option.value);
                }}
                placeholder={t('selectIdentityType')}
                searchable={false}
                error={errors.identityType}
              />
            </View>

            {/* Identity Number */}
            <View>
              <Input
                label={t('identityNumber')}
                placeholder={t('enterIdentityNumber')}
                value={formData.identityNumber}
                onChangeText={(text) => {
                  handleInputChange('identityNumber', text);
                }}
                autoCapitalize="characters"
                autoCorrect={false}
                error={errors.identityNumber}
              />
            </View>

            {/* Expiring Date */}
            <View>
              <DateSelector
                label={t('expiringDate')}
                value={formData.expiringDate}
                onDateSelect={(date) => {
                  handleInputChange('expiringDate', date);
                }}
                placeholder={t('selectExpiringDate')}
                minDate={new Date()}
                error={errors.expiringDate}
              />
            </View>

            {/* Attach Identity Proof */}
            <View>
              <Typography
                variant="body"
                className="text-gray-900 mb-2 font-medium"
              >
                {t('attachIdentityProof')}
              </Typography>
              <TouchableOpacity
                onPress={handleFileUpload}
                className={`bg-white rounded-xl border-2 border-dashed items-center justify-center ${
                  errors.identityProof ? 'border-red-300' : 'border-gray-300'
                }`}
                style={{
                  paddingHorizontal: getSpacing('lg'),
                  paddingVertical: getSpacing('xl'),
                  minHeight: 120,
                }}
              >
                {formData.identityProof ? (
                  <View className="items-center">
                    <View className="bg-green-50 rounded-full p-3 mb-3">
                      <DocumentUpload size={24} color={getColor('green.500')} />
                    </View>
                    <Typography
                      variant="body"
                      className="text-green-600 font-medium mb-1"
                    >
                      {t('fileSelected')}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-gray-500 text-center"
                    >
                      {formData.identityProof}
                    </Typography>
                  </View>
                ) : (
                  <View className="items-center">
                    <View className="bg-blue-50 rounded-full p-3 mb-3">
                      <DocumentUpload size={24} color={getColor('blue.500')} />
                    </View>
                    <Typography
                      variant="body"
                      className="text-blue-500 font-medium mb-1"
                    >
                      {t('chooseFile')}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-gray-400 text-center"
                    >
                      {t('uploadYourIdentityDocument')}
                      {'\n'}
                      {t('supportedFormats')}
                    </Typography>
                  </View>
                )}
              </TouchableOpacity>
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
                text={t('verifyIdentity')}
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
