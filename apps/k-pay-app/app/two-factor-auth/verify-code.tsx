import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, OTPInput } from '@/components/ui';
import type { OTPInputRef } from '@/components/ui/input/otp-input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { router, useFocusEffect } from 'expo-router';
import { getColor, getSpacing } from '../../src/theme';
import { useTranslation } from 'react-i18next';

// Storage key for 2FA status
const TWO_FACTOR_AUTH_STATUS_KEY = '@kpay_2fa_status';

export default function VerifyCodeScreen() {
  const { t } = useTranslation();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const otpRef = useRef<OTPInputRef>(null);

  useFocusEffect(
    React.useCallback(() => {
      // Reset navigation state when screen gains focus
      setIsNavigating(false);
    }, [])
  );

  const handleBackPress = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.back();
  };

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
  };

  const handleVerifyCode = async () => {
    if (isNavigating || isLoading) return;

    const fullCode = code.join('');

    if (fullCode.length !== 6) {
      Alert.alert(t('error'), t('enterCompleteCode'));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, accept any 6-digit code
      // Store 2FA status as enabled
      await AsyncStorage.setItem(TWO_FACTOR_AUTH_STATUS_KEY, 'ON');

      // Navigate to success screen
      setIsNavigating(true);
      router.push('/two-factor-auth/success');
    } catch (error) {
      Alert.alert(t('error'), t('invalidCode'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    Alert.alert(
      'Code Sent',
      'A new verification code has been generated in your authenticator app.'
    );
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-white">
      <ScrollView
        className="flex-1"
        style={{ paddingHorizontal: getSpacing('xl') }}
        showsVerticalScrollIndicator={false}
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
          >
            <ArrowLeft size={24} color={getColor('gray.900')} />
          </TouchableOpacity>
        </View>

        {/* Title and Description */}
        <View style={{ marginBottom: getSpacing('2xl') }}>
          <Typography variant="h2" className="text-gray-900 mb-2" weight="bold">
            Verify Code
          </Typography>
          <Typography variant="body" className="text-gray-500">
            Enter the 6-digit code from your authenticator app to complete the
            setup.
          </Typography>
        </View>

        {/* Code Input Fields */}
        <View style={{ marginBottom: getSpacing('2xl') }}>
          <OTPInput
            ref={otpRef}
            value={code}
            onChange={handleCodeChange}
            disabled={isLoading}
            length={6}
          />
        </View>

        {/* Resend Code */}
        <View style={{ alignItems: 'center', marginBottom: getSpacing('2xl') }}>
          <Typography variant="body" className="text-gray-500 mb-2">
            Didn't receive a code?
          </Typography>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Typography
              variant="body"
              className="text-primary-600"
              weight="600"
            >
              Generate New Code
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Verify Button */}
        <View style={{ marginBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text="Verify Code"
            onPress={handleVerifyCode}
            disabled={isNavigating || code.join('').length !== 6}
            loading={isLoading}
            textColor="#fff"
            iconColor="#fff"
          />
        </View>

        {/* Help Text */}
        <View
          style={{
            backgroundColor: getColor('gray.50'),
            borderRadius: 12,
            padding: getSpacing('lg'),
            marginBottom: getSpacing('xl'),
          }}
        >
          <Typography variant="body" className="text-gray-600 text-center">
            Make sure your device's time is synchronized and check your
            authenticator app for the latest code.
          </Typography>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
