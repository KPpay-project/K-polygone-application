import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import {
  ArrowLeft,
  ArrowRight2,
  Mobile,
  Sms,
  SecuritySafe,
} from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { getColor, getSpacing } from '../../src/theme';

interface TwoFactorOptionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const TwoFactorOption: React.FC<TwoFactorOptionProps> = ({
  icon,
  title,
  subtitle,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white rounded-2xl mb-4"
    style={{
      paddingHorizontal: getSpacing('lg'),
      paddingVertical: getSpacing('lg'),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
      borderWidth: 1,
      borderColor: getColor('gray.200'),
    }}
    activeOpacity={0.7}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center flex-1">
        <View
          className="rounded-full items-center justify-center bg-blue-100"
          style={{
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </View>
        <View className="ml-4 flex-1">
          <Typography variant="h4" className="text-gray-900 font-semibold">
            {title}
          </Typography>
          <Typography variant="body" className="text-gray-500 mt-1">
            {subtitle}
          </Typography>
        </View>
      </View>
      <ArrowRight2 size={20} color={getColor('gray.400')} variant="Outline" />
    </View>
  </TouchableOpacity>
);

export default function TwoFactorAuthScreen() {
  const handleAuthenticatorPress = () => {
    router.push('/two-factor-auth/authenticator-setup');
  };

  const handleSMSPress = () => {
    router.push('/two-factor-auth/sms-setup');
  };

  const handleEmailPress = () => {
    router.push('/two-factor-auth/email-setup');
  };

  return (
    <ScreenContainer>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View
          className="bg-white"
          style={{
            paddingHorizontal: getSpacing('lg'),
            paddingTop: getSpacing('md'),
            paddingBottom: getSpacing('lg'),
            borderBottomWidth: 1,
            borderBottomColor: getColor('gray.200'),
          }}
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft
                size={24}
                color={getColor('gray.900')}
                variant="Outline"
              />
            </TouchableOpacity>
            <Typography variant="h3" className="text-gray-900 font-semibold">
              Two Factor Authentication
            </Typography>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          style={{
            paddingHorizontal: getSpacing('lg'),
            paddingTop: getSpacing('xl'),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Content */}
          <View
            className="items-center"
            style={{ marginBottom: getSpacing('2xl') }}
          >
            <View
              className="rounded-full items-center justify-center bg-blue-100 mb-4"
              style={{
                width: 80,
                height: 80,
              }}
            >
              <SecuritySafe
                size={40}
                color={getColor('primary.500')}
                variant="Outline"
              />
            </View>
            <Typography
              variant="h2"
              className="text-gray-900 font-semibold text-center mb-3"
            >
              Secure Your Account
            </Typography>
            <Typography
              variant="body"
              className="text-gray-500 text-center leading-6"
            >
              Add an extra layer of security to your account by enabling
              two-factor authentication. Choose your preferred method below.
            </Typography>
          </View>

          {/* 2FA Options */}
          <View style={{ marginBottom: getSpacing('xl') }}>
            <TwoFactorOption
              icon={
                <SecuritySafe
                  size={20}
                  color={getColor('primary.500')}
                  variant="Outline"
                />
              }
              title="Authenticator App"
              subtitle="Use Google Authenticator or similar apps"
              onPress={handleAuthenticatorPress}
            />

            <TwoFactorOption
              icon={
                <Sms
                  size={20}
                  color={getColor('primary.500')}
                  variant="Outline"
                />
              }
              title="SMS Verification"
              subtitle="Receive codes via text message"
              onPress={handleSMSPress}
            />

            <TwoFactorOption
              icon={
                <Mobile
                  size={20}
                  color={getColor('primary.500')}
                  variant="Outline"
                />
              }
              title="Email Verification"
              subtitle="Receive codes via email"
              onPress={handleEmailPress}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
