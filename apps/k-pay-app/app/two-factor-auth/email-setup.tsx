import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { getColor, getSpacing } from '../../src/theme';
import { useTranslation } from 'react-i18next';

export default function EmailSetup() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleContinue = async () => {
    if (!email.trim()) {
      setEmailError(t('emailRequired'));
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(t('emailInvalid'));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to verification screen
      router.push({
        pathname: '/two-factor-auth/email-verify-code',
        params: { email },
      });
    } catch (error) {
      Alert.alert(t('error'), t('failedToSendVerificationCode'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color={getColor('gray.900')} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Typography variant="h4" style={styles.title}>
              Setup using your email
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              Enter your email to get your code
            </Typography>
          </View>

          <View style={styles.inputSection}>
            <Typography variant="body" style={styles.inputLabel}>
              Email
            </Typography>
            <TextInput
              style={[
                styles.emailInput,
                emailError ? styles.emailInputError : null,
              ]}
              placeholder="Enter your email address"
              placeholderTextColor={getColor('gray.400')}
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            {emailError ? (
              <Typography variant="caption" style={styles.errorText}>
                {emailError}
              </Typography>
            ) : null}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ReusableButton
            variant="primary"
            text="Continue"
            onPress={handleContinue}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
            disabled={!email.trim()}
            loading={isLoading}
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
  },
  inputSection: {
    gap: getSpacing('md'),
  },
  inputLabel: {
    color: getColor('gray.700'),
    marginBottom: getSpacing('xs'),
  },
  emailInput: {
    borderWidth: 1,
    borderColor: getColor('gray.300'),
    borderRadius: 12,
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('md'),
    fontSize: 16,
    color: getColor('gray.900'),
    backgroundColor: 'white',
  },
  emailInputError: {
    borderColor: getColor('red.500'),
  },
  errorText: {
    color: getColor('red.500'),
    marginTop: getSpacing('xs'),
  },
  buttonContainer: {
    paddingBottom: getSpacing('xl'),
  },
});
