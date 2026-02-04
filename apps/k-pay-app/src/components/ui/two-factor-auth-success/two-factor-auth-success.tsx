import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '../typography/typography';
import { ReusableButton } from '../button/reusable-button';
import { TickCircle } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { getColor, getSpacing } from '../../../theme';
import { useTranslation } from 'react-i18next';

interface TwoFactorAuthSuccessProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  navigateTo?: string;
}

export const TwoFactorAuthSuccess: React.FC<TwoFactorAuthSuccessProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonPress,
  navigateTo = '/(tabs)/home',
}) => {
  const { t } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleButtonPress = async () => {
    if (isNavigating) return;

    setIsNavigating(true);
    try {
      // Simulate navigation delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onButtonPress) {
        onButtonPress();
      } else {
        router.replace(navigateTo);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-white">
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <TickCircle
                size={48}
                color={getColor('success.600')}
                variant="Bold"
              />
            </View>
          </View>

          {/* Success Message */}
          <View style={styles.messageSection}>
            <Typography variant="h4" weight="bold" style={styles.title}>
              {title || t('twoFAActivatedSuccessfully')}
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              {subtitle || t('twoFAActivatedMessage')}
            </Typography>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <ReusableButton
            text={buttonText || t('goBackHome')}
            onPress={handleButtonPress}
            showArrow={true}
            variant="primary"
            textColor="#fff"
            iconColor="#fff"
            loading={isNavigating}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getSpacing('lg'),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: getSpacing('2xl'),
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: getColor('success.100'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageSection: {
    alignItems: 'center',
    gap: getSpacing('md'),
    paddingHorizontal: getSpacing('lg'),
  },
  title: {
    color: getColor('gray.900'),
    textAlign: 'center',
  },
  subtitle: {
    color: getColor('gray.600'),
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingBottom: getSpacing('xl'),
  },
});
