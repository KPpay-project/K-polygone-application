import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft, Copy } from 'iconsax-react-nativejs';
import { router, useFocusEffect } from 'expo-router';
import { getColor, getSpacing } from '../../src/theme';

export default function QRCodeSetupScreen() {
  const [isNavigating, setIsNavigating] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsNavigating(false);
    }, [])
  );

  const handleBackPress = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.back();
  };

  const handleContinue = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push('/two-factor-auth/verify-code');
  };

  const handleCopySecret = () => {
    //
  };

  const secretKey = 'JBSWY3DPEHPK3PXP';

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
            Scan QR Code
          </Typography>
          <Typography variant="body" className="text-gray-500">
            Scan this QR code with your authenticator app to complete the setup.
          </Typography>
        </View>

        {/* QR Code Container */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: getSpacing('2xl'),
          }}
        >
          {/* QR Code Placeholder */}
          <View
            style={{
              width: 200,
              height: 200,
              backgroundColor: getColor('gray.100'),
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: getSpacing('lg'),
              borderWidth: 1,
              borderColor: getColor('gray.200'),
            }}
          >
            {/* QR Code Pattern Simulation */}
            <View
              style={{
                width: 160,
                height: 160,
                backgroundColor: getColor('gray.800'),
                borderRadius: 8,
              }}
            >
              {/* Simple QR code pattern */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {Array.from({ length: 256 }, (_, i) => (
                  <View
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor:
                        Math.random() > 0.5
                          ? getColor('gray.800')
                          : getColor('white'),
                    }}
                  />
                ))}
              </View>
            </View>
          </View>

          <Typography variant="body" className="text-gray-600 text-center mb-4">
            Can't scan? Enter this code manually:
          </Typography>

          {/* Secret Key */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: getColor('gray.50'),
              borderRadius: 12,
              padding: getSpacing('md'),
              borderWidth: 1,
              borderColor: getColor('gray.200'),
            }}
          >
            <Typography
              variant="body"
              className="text-gray-900 font-mono flex-1 mr-3"
              weight="600"
            >
              {secretKey}
            </Typography>
            <TouchableOpacity
              onPress={handleCopySecret}
              style={{
                padding: getSpacing('xs'),
              }}
              activeOpacity={0.7}
            >
              <Copy
                size={20}
                color={getColor('primary.600')}
                variant="Outline"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        <View
          style={{
            backgroundColor: getColor('blue.50'),
            borderRadius: 12,
            padding: getSpacing('lg'),
            marginBottom: getSpacing('2xl'),
          }}
        >
          <Typography
            variant="subtitle"
            className="text-blue-900 mb-2"
            weight="600"
          >
            Instructions:
          </Typography>
          <Typography variant="body" className="text-blue-800">
            1. Open your authenticator app{'\n'}
            2. Tap the "+" or "Add" button{'\n'}
            3. Scan this QR code or enter the code manually{'\n'}
            4. Your app will generate a 6-digit code
          </Typography>
        </View>

        {/* Continue Button */}
        <View style={{ marginBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text="Continue"
            onPress={handleContinue}
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
