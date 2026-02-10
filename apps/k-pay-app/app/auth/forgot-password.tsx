import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { Link, router } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';
import {
  validateForgotPasswordForm,
  validateForgotPasswordField,
} from '../../src/validations/auth/forgot-password';
import type {
  ForgotPasswordFormData,
  ForgotPasswordFormErrors,
} from '../../src/validations/types';

// Rename to avoid conflicts
type FormData = ForgotPasswordFormData;
type FormErrors = ForgotPasswordFormErrors;

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const validation = validateForgotPasswordForm(formData, t);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleInputChange = (
    field: keyof ForgotPasswordFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push({
        pathname: '/auth/verify-code',
        params: { email: formData.email },
      });
    } catch (error) {
      console.error('Reset password failed:', error);
      setErrors((prev) => ({ ...prev, general: t('resetPasswordFailed') }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/auth/login');
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
              {t('forgotPasswordTitle')}
            </Typography>
            <Typography variant="body" className="text-gray-500">
              {t('forgotPasswordSubtitle')}
            </Typography>
          </View>

          {/* General Error */}
          {errors.general && (
            <View className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <Typography variant="body" className="text-red-600">
                {errors.general}
              </Typography>
            </View>
          )}

          {/* Email Input */}
          <View className="mb-6">
            <Typography variant="subtitle" className="text-gray-900 mb-2">
              {t('email')}
            </Typography>
            <TextInput
              className={`w-full px-4 py-4 rounded-xl border ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              } text-gray-900`}
              placeholder={t('enterEmail')}
              placeholderTextColor="#9CA3AF"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {errors.email && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.email}
              </Typography>
            )}
          </View>

          {/* Spacer to push button to bottom */}
          <View className="flex-1" />

          {/* Reset Password Button */}
          <View className="mt-8 mb-6">
            <ReusableButton
              variant="primary"
              text={t('sendResetLink')}
              onPress={handleResetPassword}
              loading={isLoading}
              textColor="#fff"
              iconColor="#fff"
            />
          </View>

          {/* Back to Login Link */}
          <View className="items-center mb-8">
            <Link href="/auth/login" asChild>
              <TouchableOpacity disabled={isLoading}>
                <Typography variant="body" className="text-gray-600">
                  {t('rememberPassword')}{' '}
                  <Typography
                    variant="body"
                    className="text-red-500 font-semibold"
                  >
                    {t('backToLogin')}
                  </Typography>
                </Typography>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
