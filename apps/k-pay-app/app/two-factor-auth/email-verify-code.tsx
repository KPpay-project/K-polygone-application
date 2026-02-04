import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, OTPInput } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { getColor, getSpacing } from '../../src/theme';
import type { OTPInputRef } from '@/components/ui';

const TWO_FACTOR_AUTH_STATUS_KEY = '@kpay_2fa_status';

export default function EmailVerifyCode() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const otpRef = useRef<OTPInputRef>(null);

  const handleBackPress = () => {
    router.back();
  };

  const handleCodeChange = (newCode: string[]) => {
    setCode(newCode);
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to verify email code
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store 2FA status in AsyncStorage
      await AsyncStorage.setItem(TWO_FACTOR_AUTH_STATUS_KEY, 'ON');

      // Navigate to success screen
      router.push('/two-factor-auth/email-success');
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      otpRef.current?.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert(
        'Success',
        'Verification code has been resent to your email.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    }
  };

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    const verificationCode = code.join('');
    if (verificationCode.length === 6) {
      handleVerifyCode();
    }
  }, [code]);

  return (
    <ScreenContainer useSafeArea={true} className="bg-white">
      <View style={styles.container}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={getColor('gray.900')} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Typography variant="h4" weight="bold" style={styles.title}>
              Enter the 6-digit sent to your Email
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              Enter the 6-digit code from your email to verify your identity and
              complete the pairing process for two-factor authentication.
            </Typography>
            {email && (
              <Typography variant="caption" style={styles.emailAddress}>
                Code sent to {email}
              </Typography>
            )}
          </View>

          <View style={styles.codeInputSection}>
            <OTPInput
              ref={otpRef}
              length={6}
              value={code}
              onChange={handleCodeChange}
              disabled={isLoading}
            />

            <View style={styles.resendSection}>
              <Typography variant="body" style={styles.resendLabel}>
                Didn't receive OTP?
              </Typography>
              <TouchableOpacity
                onPress={handleResendCode}
                style={styles.resendButton}
              >
                <Typography variant="body" style={styles.resendText}>
                  Resend Code
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ReusableButton
            text="Verify Code"
            onPress={handleVerifyCode}
            disabled={code.join('').length !== 6}
            loading={isLoading}
            showArrow={true}
            variant="primary"
            textColor="#fff"
            iconColor="#fff"
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getSpacing('lg'),
  },
  header: {
    paddingTop: getSpacing('md'),
    paddingBottom: getSpacing('lg'),
  },
  backButton: {
    padding: getSpacing('sm'),
    marginLeft: -getSpacing('sm'),
  },
  content: {
    flex: 1,
    gap: getSpacing('xl'),
  },
  headerSection: {
    gap: getSpacing('sm'),
  },
  title: {
    color: getColor('gray.900'),
    marginBottom: getSpacing('xs'),
  },
  subtitle: {
    color: getColor('gray.600'),
    lineHeight: 24,
  },
  emailAddress: {
    color: getColor('gray.500'),
    marginTop: getSpacing('xs'),
  },
  codeInputSection: {
    gap: getSpacing('xl'),
    alignItems: 'center',
  },
  resendSection: {
    alignItems: 'center',
    gap: getSpacing('xs'),
  },
  resendLabel: {
    color: getColor('gray.600'),
  },
  resendButton: {
    paddingVertical: getSpacing('sm'),
  },
  resendText: {
    color: getColor('primary.600'),
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    paddingBottom: getSpacing('xl'),
  },
});
