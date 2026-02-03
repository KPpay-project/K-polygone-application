import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft, Key, ArrowRight2 } from 'iconsax-react-nativejs';
import { router, useFocusEffect } from 'expo-router';
import { getColor, getSpacing } from '../../src/theme';

interface InstructionStepProps {
  stepNumber: string;
  title: string;
  description: string;
}

function InstructionStep({
  stepNumber,
  title,
  description,
}: InstructionStepProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: getSpacing('lg'),
        alignItems: 'flex-start',
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: getColor('primary.100'),
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: getSpacing('md'),
          marginTop: 2,
        }}
      >
        <Typography variant="body" className="text-primary-600" weight="600">
          {stepNumber}
        </Typography>
      </View>

      <View style={{ flex: 1 }}>
        <Typography
          variant="subtitle"
          className="text-gray-900 mb-1"
          weight="600"
        >
          {title}
        </Typography>
        <Typography variant="body" className="text-gray-500">
          {description}
        </Typography>
      </View>
    </View>
  );
}

export default function AuthenticatorSetupScreen() {
  const [isNavigating, setIsNavigating] = useState(false);

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

  const handleStartPairing = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push('/two-factor-auth/qr-code-setup');
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

        {/* Icon and Title */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: getSpacing('2xl'),
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: getColor('primary.100'),
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: getSpacing('lg'),
            }}
          >
            <Key size={40} color={getColor('primary.600')} variant="Outline" />
          </View>

          <Typography variant="h2" className="text-gray-900 mb-2" weight="bold">
            Pair Your Authenticator App
          </Typography>
          <Typography variant="body" className="text-gray-500 text-center">
            Follow these steps to set up two-factor authentication with your
            authenticator app.
          </Typography>
        </View>

        {/* Instructions */}
        <View style={{ marginBottom: getSpacing('2xl') }}>
          <InstructionStep
            stepNumber="1"
            title="Download an authenticator app"
            description="Install Google Authenticator, Authy, or any compatible TOTP app from your app store."
          />

          <InstructionStep
            stepNumber="2"
            title="Open the app"
            description="Launch your authenticator app and look for an option to add a new account or scan a QR code."
          />

          <InstructionStep
            stepNumber="3"
            title="Scan QR code"
            description="Use your authenticator app to scan the QR code that will be displayed on the next screen."
          />

          <InstructionStep
            stepNumber="4"
            title="Enter verification code"
            description="Enter the 6-digit code from your authenticator app to complete the setup."
          />
        </View>

        {/* Start Pairing Button */}
        <View style={{ marginBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text="Start Pairing"
            onPress={handleStartPairing}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
            disabled={isNavigating}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
