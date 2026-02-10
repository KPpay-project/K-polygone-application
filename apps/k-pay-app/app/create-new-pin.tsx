import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, OTPInput } from '@/components/ui';
import type { OTPInputRef } from '@/components/ui/input/otp-input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft, Key } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getColor, getSpacing } from '../src/theme';
import {
  validateCreatePinForm,
  validatePinField,
} from '../src/validations/security/pin-validation';
import type {
  CreatePinFormData,
  CreatePinFormErrors,
} from '../src/validations/types';

export default function CreateNewPinScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreatePinFormData>({
    newPin: '',
    confirmPin: '',
  });
  const [newPinArray, setNewPinArray] = useState<string[]>(['', '', '', '']);
  const [confirmPinArray, setConfirmPinArray] = useState<string[]>([
    '',
    '',
    '',
    '',
  ]);
  const [errors, setErrors] = useState<CreatePinFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [step, setStep] = useState<'new' | 'confirm'>('new');
  const otpRef = useRef<OTPInputRef>(null);

  const handleBackPress = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    setTimeout(() => {
      if (step === 'confirm') {
        setStep('new');
        setFormData((prev) => ({ ...prev, confirmPin: '' }));
        setConfirmPinArray(['', '', '', '']);
        setErrors({});
      } else {
        router.back();
      }
      setIsNavigating(false);
    }, 100);
  };

  const handleCodeChange = (newCode: string[]) => {
    if (step === 'new') {
      setNewPinArray(newCode);
      const pinString = newCode.join('');
      setFormData((prev) => ({ ...prev, newPin: pinString }));
      // Clear error when user starts typing
      if (errors.newPin) {
        setErrors((prev) => ({ ...prev, newPin: undefined }));
      }
    } else {
      setConfirmPinArray(newCode);
      const pinString = newCode.join('');
      setFormData((prev) => ({ ...prev, confirmPin: pinString }));
      // Clear error when user starts typing
      if (errors.confirmPin) {
        setErrors((prev) => ({ ...prev, confirmPin: undefined }));
      }
    }
  };

  const handleContinue = async () => {
    const currentPin = step === 'new' ? formData.newPin : formData.confirmPin;

    if (step === 'new') {
      // Validate new PIN length
      if (formData.newPin.length !== 4) {
        setErrors({ newPin: t('pinMustBe4Digits') });
        return;
      }

      // Move to confirmation step
      setStep('confirm');
      setErrors({});
      setConfirmPinArray(['', '', '', '']);
      return;
    }

    // Validate complete form
    const validationResult = validateCreatePinForm(formData, t);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    setIsLoading(true);

    try {
      // Simulate PIN creation process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to success screen
      router.push('/pin-success');
    } catch (error) {
      Alert.alert(t('error'), t('failedToCreatePIN'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-white">
      <ScrollView
        className="flex-1"
        style={{ paddingHorizontal: getSpacing('xl') }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: getSpacing('lg'),
            marginBottom: getSpacing('lg'),
          }}
        >
          <TouchableOpacity
            onPress={handleBackPress}
            style={{
              marginRight: getSpacing('md'),
              padding: getSpacing('xs'),
            }}
            activeOpacity={0.7}
            disabled={isNavigating}
          >
            <ArrowLeft size={24} color={getColor('gray.900')} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: getColor('primary.100'),
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: getSpacing('2xl'),
            }}
          >
            <Key size={40} color={getColor('primary.600')} variant="Bold" />
          </View>

          {/* Title and Description */}
          <View
            style={{ alignItems: 'center', marginBottom: getSpacing('2xl') }}
          >
            <Typography
              variant="h3"
              weight="bold"
              style={{
                color: getColor('gray.900'),
                textAlign: 'center',
                marginBottom: getSpacing('md'),
              }}
            >
              {step === 'new' ? t('createNewPIN') : t('confirmPIN')}
            </Typography>
            <Typography
              variant="body"
              style={{
                color: getColor('gray.600'),
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              {step === 'new'
                ? t('createPINDescription')
                : t('reenterPINToConfirm')}
            </Typography>
          </View>

          {/* PIN Input */}
          <View style={{ marginBottom: getSpacing('2xl') }}>
            <OTPInput
              ref={otpRef}
              length={4}
              value={step === 'new' ? newPinArray : confirmPinArray}
              onChange={handleCodeChange}
              disabled={isLoading}
            />

            {/* Error display */}
            {step === 'new' && errors.newPin && (
              <Typography
                variant="caption"
                color={getColor('error.main')}
                style={{ textAlign: 'center', marginTop: getSpacing('xs') }}
              >
                {errors.newPin}
              </Typography>
            )}

            {step === 'confirm' && errors.confirmPin && (
              <Typography
                variant="caption"
                color={getColor('error.main')}
                style={{ textAlign: 'center', marginTop: getSpacing('xs') }}
              >
                {errors.confirmPin}
              </Typography>
            )}
          </View>
        </View>

        {/* Continue Button */}
        <View style={{ paddingBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text={t('continue')}
            onPress={handleContinue}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
            loading={isLoading || isNavigating}
            disabled={
              (step === 'new' ? formData.newPin : formData.confirmPin || '')
                .length !== 4
            }
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
