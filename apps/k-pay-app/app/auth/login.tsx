import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ErrorAlert } from '@/components/alert';
import { Link, router } from 'expo-router';
import { ArrowLeft, Eye, EyeSlash } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../src/contexts/auth-context';
import { useUserStore } from '../../src/store/user-store';
import { usePinCheckRedirect } from '../../src/hooks/use-pin-check-redirect';
import {
  validateLoginForm,
  validateLoginField,
} from '../../src/validations/auth/login';
import type {
  LoginFormData,
  LoginFormErrors,
} from '../../src/validations/types';

export default function LoginScreen() {
  const { t } = useTranslation();
  const {
    login,
    isAuthenticated,
    loading: authLoading,
    graphqlUser,
  } = useAuth();
  const { setUserAccount } = useUserStore();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  usePinCheckRedirect({ enabled: isAuthenticated });

  const validateForm = (): boolean => {
    const validation = validateLoginForm(formData, t);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const fieldError = validateLoginField(field, value, t);

    setErrors((prev) => ({
      ...prev,
      [field]: fieldError || undefined,
    }));
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError('');

    try {
      const success = await login(formData.email, formData.password);

      if (success && graphqlUser) {
        setUserAccount(graphqlUser);
      } else {
        setGeneralError(
          t('invalidCredentials') ||
            'Invalid email or password. Please try again.'
        );
      }
    } catch (error) {
      console.error('Login failed:', error);
      setGeneralError(
        t('unexpectedError') ||
          'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/onboarding');
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

          <View className="mb-8">
            <Typography variant="h3" className="text-gray-900 mb-2">
              {!t('loginAccount') || 'Login to your account'}
            </Typography>
            <Typography variant="body" className="text-gray-500">
              {!t('fillDetailsCorrectly') ||
                'Please fill in your details correctly to login to your account.'}
            </Typography>
          </View>

          {/* General Error Message */}
          <ErrorAlert message={generalError} dismissible={true} />

          <View className="space-y-6">
            {/* Email */}
            <View>
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
                onChangeText={(value) => handleInputChange('email', value)}
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

            <View className="mt-5">
              <Typography variant="subtitle" className="text-gray-900 mb-2">
                {t('password')}
              </Typography>
              <View className="relative">
                <TextInput
                  className={`w-full px-4 py-4 pr-12 rounded-xl border ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  } text-gray-900`}
                  placeholder={t('enterPassword')}
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlash size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.password}
                </Typography>
              )}
            </View>

            <View className="items-end mt-2">
              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Typography
                  variant="caption"
                  className="text-gray-400 mt-3 underline"
                >
                  {!t('forgotPassword') || 'Forgotten Password?'}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-1" />

          <View className="mt-8 mb-6">
            <ReusableButton
              variant="primary"
              text={t('login')}
              onPress={handleLogin}
              loading={isLoading}
              textColor="#fff"
              iconColor="#fff"
            />
          </View>

          <View className="items-center mb-8">
            <View className="flex-row">
              <Typography variant="small" className="text-gray-600">
                {!t('noAccount') || 'No account found?'}{' '}
              </Typography>
              <Link href="/onboarding/register" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Typography
                    variant="small"
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
