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
import { useMutation } from '@apollo/client';
import { FORGOTTEN_PASSWORD, VERIFY_OTP } from '@repo/api';

export default function VerifyCodeScreen() {
  const { t } = useTranslation();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const otpRef = useRef<OTPInputRef>(null);
  const [verifyOtp, { loading: isVerifying }] = useMutation(VERIFY_OTP);
  const [requestPasswordReset, { loading: isResending }] =
    useMutation(FORGOTTEN_PASSWORD);
  const isLoading = isVerifying || isResending;

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
    setError(''); // Clear error when user types
  };

  const handleVerifyCode = async () => {
    const enteredCode = code.join('');
    const normalizedEmail = Array.isArray(email) ? email[0] : email;

    if (enteredCode.length !== 6) {
      setError(t('enterCompleteCode'));
      return;
    }
    if (!normalizedEmail) {
      setError(t('resetPasswordFailed'));
      return;
    }

    setError('');

    try {
      const { data } = await verifyOtp({
        variables: {
          input: {
            email: normalizedEmail,
            otpCode: enteredCode,
          },
        },
      });

      if (data?.verifyOtp?.success && data?.verifyOtp?.token) {
        router.push({
          pathname: '/auth/reset-password',
          params: { email: normalizedEmail, token: data.verifyOtp.token },
        });
        return;
      }

      setError(data?.verifyOtp?.message || t('invalidCode'));
    } catch (error) {
      console.error('Code verification failed:', error);
      setError(error instanceof Error ? error.message : t('invalidCode'));
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
    const normalizedEmail = Array.isArray(email) ? email[0] : email;
    if (!normalizedEmail) {
      setError(t('resetPasswordFailed'));
      return;
    }

    try {
      const { data } = await requestPasswordReset({
        variables: {
          input: {
            email: normalizedEmail,
          },
        },
      });

      if (!data?.requestPasswordReset?.success) {
        setError(
          data?.requestPasswordReset?.message || t('resetPasswordFailed')
        );
        return;
      }

      otpRef.current?.clear();
      setCode(['', '', '', '', '', '']);
      setError('');
    } catch (error) {
      console.error('Resend failed:', error);
      setError(
        error instanceof Error ? error.message : t('resetPasswordFailed')
      );
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
