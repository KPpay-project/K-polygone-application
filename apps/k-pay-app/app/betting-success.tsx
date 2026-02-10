import React from 'react';
import { View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { TickCircle } from 'iconsax-react-nativejs';
import { getColor, getSpacing } from '../src/theme';

export default function BettingSuccess() {
  const handleGoHome = () => {
    router.push('/(tabs)/home');
  };

  return (
    <ScreenContainer useSafeArea={true}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: getSpacing('lg'),
          }}
        >
          {/* Success Icon */}
          <View
            style={{ alignItems: 'center', marginBottom: getSpacing('2xl') }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: getColor('success.50'),
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: getSpacing('lg'),
              }}
            >
              <TickCircle
                size={48}
                color={getColor('success.600')}
                variant="Bold"
              />
            </View>
          </View>

          {/* Success Message */}
          <View
            style={{ alignItems: 'center', marginBottom: getSpacing('3xl') }}
          >
            <Typography
              variant="h3"
              weight="bold"
              style={{
                color: getColor('gray.900'),
                marginBottom: getSpacing('md'),
                textAlign: 'center',
              }}
            >
              Betting Payment
            </Typography>
            <Typography
              variant="body"
              style={{
                color: getColor('gray.600'),
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              Your betting amount has been sent to{'\n'}your ID Number
            </Typography>
          </View>
        </View>

        {/* Go Home Button */}
        <View style={{ paddingBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text="Go back home"
            onPress={handleGoHome}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
