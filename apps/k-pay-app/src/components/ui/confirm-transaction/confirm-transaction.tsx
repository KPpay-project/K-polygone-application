import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '../typography/typography';
import { ReusableButton } from '../button/reusable-button';
import { formatNumberWithCommas } from '@/utils/numbers';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { getColor, getSpacing } from '../../../theme';

interface TransactionDetail {
  label: string;
  value: string;
}

interface ConfirmTransactionProps {
  title?: string;
  subtitle?: string;
  amount: string | number;
  currency?: string;
  details: TransactionDetail[];
  onContinue: () => void;
  onBack?: () => void;
  isLoading?: boolean;
  continueButtonText?: string;
}

export function ConfirmTransaction({
  title,
  subtitle,
  amount,
  currency = 'KES',
  details,
  onContinue,
  onBack,
  isLoading = false,
  continueButtonText,
}: ConfirmTransactionProps) {
  const { t } = useTranslation();
  const [isNavigating, setIsNavigating] = useState(false);

  const defaultTitle = title || t('reviewYourTransaction');
  const defaultContinueText = continueButtonText || t('continue');

  const handleBackPress = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleContinue = async () => {
    if (isNavigating || isLoading) return;
    setIsNavigating(true);

    try {
      await onContinue();
    } catch (error) {
      console.error('Continue error:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const formattedAmount =
    typeof amount === 'string'
      ? formatNumberWithCommas(amount)
      : formatNumberWithCommas(amount.toString());

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
        <View style={{ flex: 1 }}>
          {/* Title */}
          <View style={{ marginBottom: getSpacing('6xl') }}>
            <Typography
              variant="h2"
              weight="semiBold"
              style={{
                color: getColor('gray.900'),
                fontSize: 24,
              }}
            >
              {defaultTitle}
            </Typography>
          </View>

          {/* Amount */}
          <View
            style={{ alignItems: 'center', marginBottom: getSpacing('3xl') }}
          >
            <Typography
              variant="h4"
              weight="bold"
              style={{
                color: getColor('gray.900'),
                fontSize: 26,
                marginBottom: getSpacing('sm'),
              }}
            >
              {formattedAmount}
            </Typography>
            {subtitle && (
              <Typography
                variant="body"
                style={{
                  color: getColor('gray.600'),
                  fontSize: 14,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </View>

          {/* Transaction Details Card */}
          <View
            style={{
              backgroundColor: getColor('blue.50'),
              borderRadius: 16,
              padding: getSpacing('lg'),
              marginBottom: getSpacing('xl'),
            }}
          >
            {/* Transaction Details */}
            <View style={{ gap: getSpacing('xl') }}>
              {details.map((detail, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="body"
                    style={{ color: getColor('gray.600') }}
                  >
                    {detail.label}
                  </Typography>
                  <Typography
                    variant="body"
                    weight="medium"
                    style={{ color: getColor('gray.900') }}
                  >
                    {detail.value}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={{ paddingBottom: getSpacing('xl') }}>
          <ReusableButton
            variant="primary"
            text={isLoading ? t('loading') : defaultContinueText}
            onPress={handleContinue}
            showArrow={true}
            textColor="#fff"
            iconColor="#fff"
            loading={isLoading || isNavigating}
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export type { ConfirmTransactionProps, TransactionDetail };
