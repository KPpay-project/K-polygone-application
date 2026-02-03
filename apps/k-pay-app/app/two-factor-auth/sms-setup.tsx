import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, PhoneInput, Country } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { getColor, getSpacing } from '../../src/theme';
import { countries } from '../../src/data/countries';
import { useTranslation } from 'react-i18next';

export default function SMSSetup() {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleContinue = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert(t('error'), t('phoneRequired'));
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to send SMS
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to SMS verification screen with phone number
      router.push({
        pathname: '/two-factor-auth/sms-verify-code',
        params: { phoneNumber: `${selectedCountry.phoneCode}${phoneNumber}` },
      });
    } catch (error) {
      Alert.alert(t('error'), t('failedToSendSMS'));
    } finally {
      setIsLoading(false);
    }
  };

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
              Setup using your number
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              Enter your number to get your code
            </Typography>
          </View>

          <View style={styles.inputSection}>
            <PhoneInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              countries={countries}
              placeholder="Enter Phone Number"
              label="Phone Number"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <ReusableButton
            text="Continue"
            onPress={handleContinue}
            disabled={!phoneNumber.trim()}
            showArrow={true}
            variant="primary"
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
  buttonContainer: {
    paddingBottom: getSpacing('xl'),
  },
});
