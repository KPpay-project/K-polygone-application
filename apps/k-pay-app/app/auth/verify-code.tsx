import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, OTPInput } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import type { OTPInputRef } from '@/components/ui';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';

export default function VerifyCodeScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRef = useRef<OTPInputRef>(null);

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
    setError(''); // Clear error when user types
  };

  const handleVerifyCode = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError(t('enterCompleteCode'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push({
        pathname: '/auth/reset-password',
        params: { email, code: enteredCode },
      });
    } catch (error) {
      console.error('Code verification failed:', error);
      setError(t('invalidCode'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/auth/forgot-password');
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      otpRef.current?.clear();
    } catch (error) {
      console.error('Resend failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header */}
          <View className="flex-row items-center mt-4 mb-8">
            <TouchableOpacity onPress={handleBack} className="mr-4 p-2">
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View className="mb-8">
            <Typography variant="h3" className="text-gray-900 mb-2">
              {t('verifyCode')}
            </Typography>
            <Typography variant="body" className="text-gray-500">
              {t('verifyCodeSubtitle')} {email}
            </Typography>
          </View>

          {/* OTP Input */}
          <OTPInput
            ref={otpRef}
            value={code}
            onChange={handleCodeChange}
            error={error}
            disabled={isLoading}
          />

          {/* Resend Code */}
          <View className="items-center mb-8">
            <Typography variant="body" className="text-gray-600 mb-2">
              {t('didntReceiveOTP')}
            </Typography>
            <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
              <Typography
                variant="body"
                className="text-red-500 font-semibold underline"
              >
                {t('resendCode')}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Spacer to push button to bottom */}
          <View className="flex-1" />

          {/* Verify Button */}
          <View className="mt-8 mb-6">
            <ReusableButton
              variant="primary"
              text={t('verifyCode')}
              onPress={handleVerifyCode}
              disabled={code.join('').length !== 6}
              loading={isLoading}
              textColor="#fff"
              iconColor="#fff"
            />
          </View>

          {/* Register Link */}
          <View className="items-center mb-8">
            <View className="flex-row">
              <Typography variant="body" className="text-gray-600">
                {t('noAccount')}{' '}
              </Typography>
              <Link href="/onboarding/register" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Typography
                    variant="body"
                    className="text-red-500 font-semibold"
                  >
                    {t('register')}
                  </Typography>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
