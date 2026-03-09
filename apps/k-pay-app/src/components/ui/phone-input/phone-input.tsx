import { FC, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../typography/typography';
import { getColor, getSpacing } from '../../../theme';
import { Country } from '../../../data/countries';
import { useTranslation } from 'react-i18next';
import { useUserCountry } from '@repo/common';
import PhoneInputLib, {
  PhoneInput as PhoneInputRefType,
} from 'react-native-phone-number-input';

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;

  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  countries: Country[];

  disabled?: boolean;
  style?: any;
  showContactPicker?: boolean;
}

export const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChangeText,
  placeholder,
  error,
  label,
  selectedCountry,
  onCountryChange,
  countries,
  disabled = false,
  style,
}) => {
  const { t } = useTranslation();
  const { countryCode, loading } = useUserCountry();
  const phoneInputRef = useRef<PhoneInputRefType | null>(null);

  useEffect(() => {
    if (loading || !countryCode || !countries.length) return;

    const matchedCountry = countries.find(
      (c) => c.code.toUpperCase() === countryCode.toUpperCase()
    );

    if (matchedCountry && matchedCountry.code !== selectedCountry.code) {
      onCountryChange(matchedCountry);
    }

    if (!value && matchedCountry) {
      const dialCode = matchedCountry.phoneCode.replace('+', '');

      onChangeText(`+${dialCode}`);
    }
  }, [
    loading,
    countryCode,
    countries,
    selectedCountry.code,
    onCountryChange,
    value,
    onChangeText,
  ]);

  const defaultIsoCode =
    selectedCountry?.code?.toUpperCase?.() ||
    countryCode?.toUpperCase?.() ||
    'US';

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Typography variant="small" style={styles.label}>
          {label}
        </Typography>
      )}

      <View
        style={[
          styles.inputWrapper,
          error && styles.errorBorder,
          disabled && styles.disabled,
        ]}
      >
        <PhoneInputLib
          ref={phoneInputRef}
          defaultCode={defaultIsoCode as any}
          layout="first"
          value={value}
          onChangeText={onChangeText}
          onChangeFormattedText={onChangeText}
          placeholder={placeholder || t('enterPhoneNumber')}
          disabled={disabled}
          containerStyle={styles.phoneContainer}
          textContainerStyle={styles.textContainer}
          textInputStyle={styles.textInput}
          codeTextStyle={styles.codeText}
          flagButtonStyle={styles.flagButton}
          withDarkTheme={false}
          withShadow={false}
        />
      </View>

      {error && (
        <Typography variant="caption" style={styles.errorText}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  label: {
    color: getColor('gray.900'),
    marginBottom: getSpacing('xs'),
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: getColor('gray.300'),
    borderRadius: 12,
    overflow: 'hidden',
  },
  phoneContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  textContainer: {
    backgroundColor: 'white',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: getSpacing('md'),
    paddingHorizontal: getSpacing('md'),
  },
  textInput: {
    fontSize: 16,
    color: getColor('gray.900'),
    padding: 0,
    margin: 0,
  },
  codeText: {
    color: getColor('gray.900'),
    fontWeight: '500',
  },
  flagButton: {
    paddingHorizontal: getSpacing('md'),
  },
  errorBorder: {
    borderColor: getColor('red.500'),
  },
  errorText: {
    color: getColor('red.500'),
    marginTop: getSpacing('xs'),
  },
  disabled: {
    backgroundColor: getColor('gray.100'),
    opacity: 0.6,
  },
});
