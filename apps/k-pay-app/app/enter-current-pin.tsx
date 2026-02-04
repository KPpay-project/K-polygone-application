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
import type { PinFormData, PinFormErrors } from '../src/validations/types';

export default function EnterCurrentPinScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<PinFormData>({ pin: '' });
  const [pinArray, setPinArray] = useState<string[]>(['', '', '', '']);
  const [errors, setErrors] = useState<PinFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const otpRef = useRef<OTPInputRef>(null);

  const handleBackPress = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    setTimeout(() => {
      router.back();
      setIsNavigating(false);
    }, 100);
  };

  const handleCodeChange = (newCode: string[]) => {
    setPinArray(newCode);
    const pinString = newCode.join('');
    setFormData({ pin: pinString });
    // Clear error when user starts typing
    if (errors.pin) {
      setErrors({});
    }
  };

  const handleContinue = async () => {
    if (formData.pin.length !== 4) {
      setErrors({ pin: 'Please enter a 4-digit PIN' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate PIN verification process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to create new PIN screen
      router.push('/create-new-pin');
    } catch (error) {
      setErrors({ pin: 'Invalid PIN. Please try again.' });
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
              Enter Current Pin
            </Typography>
            <Typography
              variant="body"
              style={{
                color: getColor('gray.600'),
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              Enter your 4-digit existing pin
            </Typography>
          </View>

          {/* PIN Input */}
          <View style={{ marginBottom: getSpacing('2xl') }}>
            <OTPInput
              ref={otpRef}
              length={4}
              value={pinArray}
              onChange={handleCodeChange}
              disabled={isLoading}
            />

            {/* Error display */}
            {errors.pin && (
              <Typography
                variant="caption"
                color={getColor('error.main')}
                style={{ textAlign: 'center', marginTop: getSpacing('xs') }}
              >
                {errors.pin}
              </Typography>
            )}
          </View>
        </View>

        {/* Continue Button */}
        <View style={{ paddingBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text="Continue"
            onPress={handleContinue}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
            loading={isLoading || isNavigating}
            disabled={formData.pin.length !== 4}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
