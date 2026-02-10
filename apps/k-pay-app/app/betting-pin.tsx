import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, OTPInput } from '@/components/ui';
import type { OTPInputRef } from '@/components/ui/input/otp-input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft, Key } from 'iconsax-react-nativejs';
import { router, useLocalSearchParams } from 'expo-router';
import { getColor, getSpacing } from '../src/theme';

export default function BettingPin() {
  const params = useLocalSearchParams();
  const otpRef = useRef<OTPInputRef>(null);

  const [code, setCode] = useState<string[]>(new Array(4).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const { country, provider, customerId, amount, currency } = params;

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
  };

  const isCodeComplete = code.join('').length === 4;

  const handleContinue = async () => {
    if (!isCodeComplete || isLoading) return;

    setIsLoading(true);

    try {
      // Simulate PIN verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsNavigating(true);
      router.push('/betting-success');
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.back();
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
            style={{ alignItems: 'center', marginBottom: getSpacing('2xl') }}
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
              Enter your Pin
            </Typography>
            <Typography
              variant="body"
              style={{
                color: getColor('gray.600'),
                textAlign: 'center',
                lineHeight: 24,
              }}
            >
              Please enter your 4-digit PIN to confirm your betting payment
            </Typography>
          </View>

          {/* PIN Input */}
          <View style={{ marginBottom: getSpacing('2xl') }}>
            <OTPInput
              ref={otpRef}
              length={4}
              value={code}
              onChange={handleCodeChange}
              disabled={isLoading}
            />
          </View>
        </View>

        {/* Continue Button */}
        <View style={{ paddingBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text={isLoading ? 'Processing...' : 'Continue'}
            onPress={handleContinue}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
            loading={isLoading || isNavigating}
            disabled={!isCodeComplete || isLoading}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
