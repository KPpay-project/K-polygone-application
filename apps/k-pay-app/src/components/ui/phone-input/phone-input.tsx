import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Typography } from '../typography/typography';
import { getColor, getSpacing } from '../../../theme';
import type { Country } from '../../../data/countries';
import { Profile } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';
import { useUserCountry } from '@repo/common';
import { ReusableModal } from '../modal/modal';

export interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  countries: Country[];
  defaultCountryCode?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
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
  defaultCountryCode,
  disabled = false,
  style,
  showContactPicker = true,
}) => {
  const { t } = useTranslation();
  const { countryCode, loading } = useUserCountry();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const hasUserSelectedCountry = useRef(false);
  const lastAppliedDefaultCountryCode = useRef<string | null>(null);
  const lastAppliedDetectedCountryCode = useRef<string | null>(null);

  useEffect(() => {
    if (!countries.length) {
      return;
    }

    const preferred = String(defaultCountryCode || '')
      .trim()
      .toUpperCase();
    if (!preferred) {
      lastAppliedDefaultCountryCode.current = null;
      return;
    }

    if (lastAppliedDefaultCountryCode.current === preferred) {
      return;
    }

    const matchedCountry = countries.find(
      (country) => country.code.toUpperCase() === preferred
    );

    if (!matchedCountry) {
      return;
    }

    lastAppliedDefaultCountryCode.current = preferred;
    lastAppliedDetectedCountryCode.current = null;
    hasUserSelectedCountry.current = false;
    if (matchedCountry.code !== selectedCountry.code) {
      onCountryChange(matchedCountry);
    }
  }, [defaultCountryCode, countries, selectedCountry.code, onCountryChange]);

  useEffect(() => {
    if (
      !!String(defaultCountryCode || '').trim() ||
      !countries.length ||
      loading
    ) {
      return;
    }

    if (hasUserSelectedCountry.current) {
      return;
    }

    const detected = String(countryCode || '')
      .trim()
      .toUpperCase();
    const preferred = detected || 'BJ';

    if (lastAppliedDetectedCountryCode.current === preferred) {
      return;
    }

    const matchedCountry = countries.find(
      (country) => country.code.toUpperCase() === preferred
    );

    if (!matchedCountry) {
      return;
    }

    lastAppliedDetectedCountryCode.current = preferred;
    if (matchedCountry.code !== selectedCountry.code) {
      onCountryChange(matchedCountry);
    }
  }, [
    loading,
    countryCode,
    defaultCountryCode,
    countries,
    selectedCountry.code,
    onCountryChange,
  ]);

  const handleCountrySelect = (country: Country) => {
    hasUserSelectedCountry.current = true;
    onCountryChange(country);
    setShowCountryPicker(false);
    setSearchQuery('');
  };

  const openPicker = () => {
    if (disabled) return;
    setShowCountryPicker(true);
  };

  const closePicker = () => {
    setShowCountryPicker(false);
    setSearchQuery('');
  };

  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.phoneCode.replace('+', '').includes(q) ||
        country.code.toLowerCase().includes(q)
    );
  }, [countries, searchQuery]);

  const handleContactPicker = async () => {
    Alert.alert(t('contactPicker'), t('contactPickerMessage'), [
      { text: t('ok') },
    ]);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Typography variant="small" style={styles.label}>
          {label}
        </Typography>
      )}

      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TouchableOpacity
          style={[styles.countryCodeButton, disabled && styles.disabled]}
          onPress={openPicker}
          disabled={disabled}
          activeOpacity={0.85}
        >
          <Typography variant="body" style={styles.countryFlag}>
            {selectedCountry.flag}
          </Typography>
          <Typography variant="body" style={styles.countryCode}>
            {selectedCountry.phoneCode}
          </Typography>
          <Typography variant="caption" style={styles.dropdownArrow}>
            ▼
          </Typography>
        </TouchableOpacity>

        <View style={styles.phoneInputContainer}>
          <TextInput
            style={[
              styles.phoneInput,
              disabled && styles.disabled,
              showContactPicker && styles.phoneInputWithIcon,
            ]}
            placeholder={placeholder || t('enterPhoneNumber')}
            placeholderTextColor={getColor('gray.400')}
            value={value}
            onChangeText={onChangeText}
            keyboardType="phone-pad"
            editable={!disabled}
            selectionColor={getColor('primary.600')}
          />
          {showContactPicker && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactPicker}
              disabled={disabled}
              activeOpacity={0.85}
            >
              <Profile
                size={20}
                color={getColor('gray.500')}
                variant="Outline"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ReusableModal
        visible={showCountryPicker}
        onClose={closePicker}
        variant="bottom"
        animationType="slide"
        showCloseButton={false}
      >
        <View style={styles.drawerHandle} />

        <View style={styles.drawerHeader}>
          <Typography
            variant="body"
            weight="semiBold"
            style={styles.drawerTitle}
          >
            {t('selectCountry', { defaultValue: 'Select country' })}
          </Typography>
          <TouchableOpacity onPress={closePicker} activeOpacity={0.85}>
            <Typography variant="body" style={styles.drawerClose}>
              {t('close', { defaultValue: 'Close' })}
            </Typography>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchCountryOrCode')}
            placeholderTextColor={getColor('gray.400')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            selectionColor={getColor('primary.600')}
          />
        </View>

        <ScrollView
          style={styles.countryList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filteredCountries.map((country) => (
            <TouchableOpacity
              key={country.code}
              style={styles.countryOption}
              onPress={() => handleCountrySelect(country)}
              activeOpacity={0.85}
            >
              <Typography variant="body" style={styles.countryOptionFlag}>
                {country.flag}
              </Typography>
              <View style={styles.countryInfo}>
                <Typography variant="body" style={styles.countryName}>
                  {country.name}
                </Typography>
                <Typography variant="caption" style={styles.countryPhoneCode}>
                  {country.phoneCode}
                </Typography>
              </View>
              {country.code === selectedCountry.code ? (
                <Typography variant="caption" style={styles.selectedBadge}>
                  {t('selected', { defaultValue: 'Selected' })}
                </Typography>
              ) : null}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ReusableModal>

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
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: getColor('gray.300'),
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: getColor('white'),
    minHeight: 54,
  },
  inputError: {
    borderColor: getColor('red.500'),
    backgroundColor: getColor('red.50', 0.25),
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('md'),
    backgroundColor: getColor('gray.50'),
    borderRightWidth: 1,
    borderRightColor: getColor('gray.300'),
    gap: getSpacing('xs'),
    minWidth: 100,
  },
  countryFlag: {
    fontSize: 18,
  },
  countryCode: {
    color: getColor('gray.900'),
    fontWeight: '500',
  },
  dropdownArrow: {
    color: getColor('gray.500'),
    fontSize: 10,
  },
  phoneInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('md'),
    fontSize: 16,
    color: getColor('gray.900'),
    backgroundColor: 'white',
  },
  phoneInputWithIcon: {
    paddingRight: getSpacing('xs'),
  },
  contactButton: {
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('md'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: getSpacing('lg'),
    paddingBottom: getSpacing('md'),
  },
  searchInput: {
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('sm'),
    borderWidth: 1,
    borderColor: getColor('gray.200'),
    borderRadius: 12,
    fontSize: 14,
    color: getColor('gray.900'),
    backgroundColor: getColor('gray.50'),
  },
  countryList: {
    paddingHorizontal: getSpacing('lg'),
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: getColor('gray.100'),
  },
  countryOptionFlag: {
    fontSize: 18,
    marginRight: getSpacing('md'),
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    color: getColor('gray.900'),
    marginBottom: 2,
  },
  countryPhoneCode: {
    color: getColor('gray.500'),
  },
  errorText: {
    color: getColor('red.600'),
    marginTop: getSpacing('2xs'),
    fontSize: 13,
  },
  disabled: {
    backgroundColor: getColor('gray.100'),
    opacity: 0.6,
  },
  drawerHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: getColor('gray.200'),
    marginBottom: getSpacing('sm'),
  },
  drawerHeader: {
    paddingBottom: getSpacing('sm'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerTitle: {
    color: getColor('gray.900'),
  },
  drawerClose: {
    color: getColor('gray.500'),
  },
  selectedBadge: {
    color: getColor('primary.600'),
  },
});
