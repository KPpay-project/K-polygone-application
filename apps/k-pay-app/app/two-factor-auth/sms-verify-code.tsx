import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { getColor, getSpacing } from '../../src/theme';

const TWO_FACTOR_AUTH_STATUS_KEY = '@kpay_2fa_status';

export default function SMSVerifyCode() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleBackPress = () => {
    router.back();
  };

  const handleCodeChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste scenario
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);

      // Focus on the next empty input or the last one
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Handle single character input
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to verify SMS code
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Store 2FA status in AsyncStorage
      await AsyncStorage.setItem(TWO_FACTOR_AUTH_STATUS_KEY, 'ON');

      // Navigate to success screen
      router.push('/two-factor-auth/sms-success');
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
      // Clear the code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
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
        'Verification code has been resent to your phone.'
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
              Enter the 6-digit sent to your number
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              Enter the 6-digit code from your number to verify your identity
              and complete the pairing process for two-factor authentication.
            </Typography>
            {phoneNumber && (
              <Typography variant="caption" style={styles.phoneNumber}>
                Code sent to {phoneNumber}
              </Typography>
            )}
          </View>

          <View style={styles.codeInputSection}>
            <View style={styles.codeInputContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.codeInput,
                    digit ? styles.codeInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={6} // Allow paste of full code
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            <TouchableOpacity
              onPress={handleResendCode}
              style={styles.resendButton}
            >
              <Typography variant="caption" style={styles.resendText}>
                Didn't receive the code? Resend
              </Typography>
            </TouchableOpacity>
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
  phoneNumber: {
    color: getColor('gray.500'),
    marginTop: getSpacing('xs'),
  },
  codeInputSection: {
    gap: getSpacing('lg'),
    alignItems: 'center',
  },
  codeInputContainer: {
    flexDirection: 'row',
    gap: getSpacing('sm'),
    justifyContent: 'center',
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: getColor('gray.300'),
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: getColor('gray.900'),
    backgroundColor: 'white',
  },
  codeInputFilled: {
    borderColor: getColor('primary.500'),
    backgroundColor: getColor('primary.50'),
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
