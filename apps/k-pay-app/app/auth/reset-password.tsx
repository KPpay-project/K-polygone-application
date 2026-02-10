import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { Input } from '@/components/ui/input/input';
import { ArrowLeft, Eye, EyeSlash } from 'iconsax-react-nativejs';
import { ReusableModal } from '@/components/ui/modal/modal';
import { useTranslation } from 'react-i18next';
import {
  validateResetPasswordForm,
  validateResetPasswordField,
} from '../../src/validations/auth/reset-password';
import type {
  ResetPasswordFormData,
  ResetPasswordFormErrors,
} from '../../src/validations/types';

type FormData = ResetPasswordFormData;
type FormErrors = ResetPasswordFormErrors;

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { email, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();
  const [formData, setFormData] = useState<FormData>({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const validateForm = (): boolean => {
    const validation = validateResetPasswordForm(formData, t);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleInputChange = (
    field: keyof ResetPasswordFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

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
      setIsModalVisible(true);
    } catch (error) {
      console.error('Password reset failed:', error);
      setErrors((prev) => ({ ...prev, general: t('passwordResetFailed') }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsModalVisible(false);
    router.push('/auth/login');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/auth/forgot-password');
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
              {t('resetPassword')}
            </Typography>
            <Typography variant="body" className="text-gray-500">
              {t('resetPasswordSubtitle')} {email}
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

          {/* New Password Input */}
          <View className="mb-6">
            <View className="relative">
              <Input
                label={t('newPassword')}
                placeholder={t('newPassword')}
                value={formData.newPassword}
                onChangeText={(text) => handleInputChange('newPassword', text)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                error={errors.newPassword}
                className="pr-12"
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlash size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View className="mb-6">
            <View className="relative">
              <Input
                label={t('confirmNewPassword')}
                placeholder={t('confirmNewPassword')}
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  handleInputChange('confirmPassword', text)
                }
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                error={errors.confirmPassword}
                className="pr-12"
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlash size={20} color="#9CA3AF" />
                ) : (
                  <Eye size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacer to push button to bottom */}
          <View className="flex-1" />

          {/* Reset Password Button */}
          <View className="mt-8 mb-6">
            <ReusableButton
              variant="primary"
              text={t('resetPassword')}
              onPress={handleResetPassword}
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
              <TouchableOpacity
                onPress={() => router.push('/onboarding/register')}
                disabled={isLoading}
              >
                <Typography
                  variant="body"
                  className="text-red-500 font-semibold"
                >
                  {t('register')}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <ReusableModal
        visible={isModalVisible}
        onClose={handleSuccessModalClose}
        showCloseButton={false}
      >
        <View className="items-center">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Typography variant="h2" className="text-green-600">
              ✓
            </Typography>
          </View>

          <Typography variant="h4" className="text-gray-900 mb-2 text-center">
            {t('passwordResetSuccessfully')}
          </Typography>

          <Typography variant="body" className="text-gray-500 text-center mb-6">
            {t('passwordResetSuccessMessage')}
          </Typography>

          <ReusableButton
            variant="primary"
            text={t('continueToLogin')}
            onPress={handleSuccessModalClose}
            textColor="#fff"
            showArrow
            iconColor="#fff"
          />
        </View>
      </ReusableModal>
    </ScreenContainer>
  );
}
