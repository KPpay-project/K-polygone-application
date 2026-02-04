import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft, Key } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { getColor, getSpacing } from '../src/theme';

export default function ChangePinIntroScreen() {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleBackPress = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.back();
  };

  const handleChangePinPress = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push('/enter-current-pin');
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-white">
      <ScrollView
        className="flex-1"
        style={{ paddingHorizontal: getSpacing('xl') }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
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
            disabled={isNavigating}
          >
            <ArrowLeft size={24} color={getColor('gray.900')} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {/* Icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: getColor('primary.100'),
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: getSpacing('2xl'),
            }}
          >
            <Key size={40} color={getColor('primary.600')} variant="Bold" />
          </View>

          {/* Title and Description */}
          <View
            style={{ alignItems: 'center', marginBottom: getSpacing('3xl') }}
          >
            <Typography
              variant="h3"
              weight="bold"
              style={{
                color: getColor('gray.900'),
                textAlign: 'center',
                marginBottom: getSpacing('md'),
              }}
            >
              Create Pin for all your devices
            </Typography>
            <Typography
              variant="body"
              style={{
                color: getColor('gray.600'),
                textAlign: 'center',
                lineHeight: 24,
                paddingHorizontal: getSpacing('lg'),
              }}
            >
              Set up a secure PIN that you can use to quickly access your
              account from any of your devices. This helps keep your information
              safe while making sign-ins faster and easier.
            </Typography>
          </View>
        </View>

        {/* Change Pin Button */}
        <View style={{ paddingBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text="Change Pin"
            onPress={handleChangePinPress}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
            loading={isNavigating}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
