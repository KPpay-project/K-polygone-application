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
import { Typography, PhoneInput } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { Link, router } from 'expo-router';
import { ArrowLeft, Eye, EyeSlash } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';
import {
  validateRegisterForm,
  validateRegisterField,
} from '../../src/validations/auth/register';
import type {
  RegisterFormData,
  RegisterFormErrors,
} from '../../src/validations/types';
import { useAuth } from '../../src/contexts/auth-context';
import { countries, Country } from '../../src/data/countries';

// Rename to avoid conflicts
type FormData = RegisterFormData;
type FormErrors = RegisterFormErrors;

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryOfResidence: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState<Country>(
    countries[0]
  );
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  const validateForm = (): boolean => {
    const validation = validateRegisterForm(formData, t);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Filter countries based on search query
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        country: formData.countryOfResidence,
      };

      const result = await registerUser(userData);

      if (result.success) {
        router.push('/auth/login');
      } else {
        // Set general error if registration fails
        setErrors({
          general: result.error || 'Registration failed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/onboarding');
    }
  };

  // Use selectedCountry state variable instead of computed value

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
              {t('createAccount')}
            </Typography>
            <Typography variant="body" className="text-gray-500">
              {t('fillDetailsCorrectly')}
            </Typography>
          </View>

          {/* Form Fields */}
          <View className="space-y-6">
            {/* First Name */}
            <View>
              <Typography variant="subtitle" className="text-gray-900 mb-2">
                {t('firstName')}
              </Typography>
              <TextInput
                className={`w-full px-4 py-4 rounded-xl border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-200'
                } text-gray-900`}
                placeholder={t('enterFirstName')}
                placeholderTextColor="#9CA3AF"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                autoCapitalize="words"
              />
              {errors.firstName && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.firstName}
                </Typography>
              )}
            </View>

            {/* Last Name */}
            <View>
              <Typography variant="subtitle" className="text-gray-900 mb-2">
                {t('lastName')}
              </Typography>
              <TextInput
                className={`w-full px-4 py-4 rounded-xl border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-200'
                } text-gray-900`}
                placeholder={t('enterLastName')}
                placeholderTextColor="#9CA3AF"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                autoCapitalize="words"
              />
              {errors.lastName && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.lastName}
                </Typography>
              )}
            </View>

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
              />
              {errors.email && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.email}
                </Typography>
              )}
            </View>

            {/* Phone Number */}
            <PhoneInput
              label={t('phoneNumber')}
              value={formData.phoneNumber}
              onChangeText={(value) => handleInputChange('phoneNumber', value)}
              placeholder={t('enterPhoneNumber')}
              selectedCountry={selectedPhoneCountry}
              onCountryChange={setSelectedPhoneCountry}
              countries={countries}
              error={errors.phoneNumber}
            />

            {/* Country of Residence */}
            <View className="relative">
              <Typography variant="subtitle" className="text-gray-900 mb-2">
                {t('countryOfResidence')}
              </Typography>
              <TouchableOpacity
                className={`w-full px-4 py-4 rounded-xl border ${
                  errors.countryOfResidence
                    ? 'border-red-500'
                    : 'border-gray-200'
                } flex-row items-center justify-between`}
                onPress={() => setShowCountryPicker(!showCountryPicker)}
              >
                <Typography
                  variant="body"
                  className={
                    selectedCountry ? 'text-gray-900' : 'text-gray-400'
                  }
                >
                  {selectedCountry
                    ? `${selectedCountry.flag} ${selectedCountry.name}`
                    : t('selectCountry')}
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  ▼
                </Typography>
              </TouchableOpacity>

              {/* Country Picker Overlay */}
              {showCountryPicker && (
                <View className="absolute top-20 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60">
                  <View className="p-3 border-b border-gray-200">
                    <TextInput
                      className="px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Search country..."
                      placeholderTextColor="#9CA3AF"
                      value={countrySearchQuery}
                      onChangeText={setCountrySearchQuery}
                    />
                  </View>
                  <ScrollView className="max-h-48">
                    {filteredCountries.map((country) => (
                      <TouchableOpacity
                        key={country.code}
                        className="px-4 py-3 border-b border-gray-100 last:border-b-0 flex-row items-center"
                        onPress={() => {
                          setSelectedCountry(country);
                          handleInputChange('countryOfResidence', country.code);
                          setShowCountryPicker(false);
                          setCountrySearchQuery('');
                        }}
                      >
                        <Typography variant="body" className="text-xl mr-3">
                          {country.flag}
                        </Typography>
                        <Typography
                          variant="body"
                          className="text-gray-900 flex-1"
                        >
                          {country.name}
                        </Typography>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {errors.countryOfResidence && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.countryOfResidence}
                </Typography>
              )}
            </View>

            {/* Password */}
            <View>
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
              {errors.password && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.password}
                </Typography>
              )}
            </View>

            {/* Confirm Password */}
            <View>
              <Typography variant="subtitle" className="text-gray-900 mb-2">
                {t('confirmPassword')}
              </Typography>
              <View className="relative">
                <TextInput
                  className={`w-full px-4 py-4 pr-12 rounded-xl border ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-200'
                  } text-gray-900`}
                  placeholder={t('enterConfirmPassword')}
                  placeholderTextColor="#9CA3AF"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange('confirmPassword', value)
                  }
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
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
              {errors.confirmPassword && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.confirmPassword}
                </Typography>
              )}
            </View>
          </View>

          {/* General Error */}
          {errors.general && (
            <View className="mt-4">
              <Typography
                variant="caption"
                className="text-red-500 text-center"
              >
                {errors.general}
              </Typography>
            </View>
          )}

          {/* Register Button */}
          <View className="mt-8 mb-6">
            <ReusableButton
              variant="primary"
              text={t('registerButton')}
              onPress={handleRegister}
              loading={isLoading}
              textColor="#fff"
              iconColor="#fff"
            />
          </View>

          {/* Login Link */}
          <View className="items-center mb-8">
            <View className="flex-row">
              <Typography variant="body" className="text-gray-600">
                {t('alreadyHaveAccount')}{' '}
              </Typography>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <Typography
                    variant="body"
                    className="text-red-500 font-semibold"
                  >
                    {t('signIn')}
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
