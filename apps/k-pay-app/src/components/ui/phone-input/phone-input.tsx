import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Typography } from '../typography/typography';
import { getColor, getSpacing } from '../../../theme';
import { Country } from '../../../data/countries';
import { Profile } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';

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

export const PhoneInput: React.FC<PhoneInputProps> = ({
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
  showContactPicker = true,
}) => {
  const { t } = useTranslation();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.phoneCode.includes(searchQuery)
  );

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country);
    setShowCountryPicker(false);
    setSearchQuery('');
  };

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

      <View style={styles.inputContainer}>
        {/* Country Code Button */}
        <TouchableOpacity
          style={[
            styles.countryCodeButton,
            error && styles.errorBorder,
            disabled && styles.disabled,
          ]}
          onPress={() => !disabled && setShowCountryPicker(!showCountryPicker)}
          disabled={disabled}
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

        {/* Phone Number Input */}
        <View style={styles.phoneInputContainer}>
          <TextInput
            style={[
              styles.phoneInput,
              error && styles.errorBorder,
              disabled && styles.disabled,
              showContactPicker && styles.phoneInputWithIcon,
            ]}
            placeholder={placeholder || t('enterPhoneNumber')}
            placeholderTextColor={getColor('gray.400')}
            value={value}
            onChangeText={onChangeText}
            keyboardType="phone-pad"
            editable={!disabled}
          />
          {showContactPicker && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactPicker}
              disabled={disabled}
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

      {/* Country Picker Modal */}
      {showCountryPicker && (
        <View style={styles.countryPickerModal}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={t('searchCountryOrCode')}
              placeholderTextColor={getColor('gray.400')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView
            style={styles.countryList}
            showsVerticalScrollIndicator={true}
          >
            {filteredCountries.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={styles.countryOption}
                onPress={() => handleCountrySelect(country)}
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
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Error Message */}
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
    borderRadius: 12,
    overflow: 'hidden',
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
  countryPickerModal: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: getColor('gray.300'),
    borderRadius: 12,
    marginTop: getSpacing('xs'),
    maxHeight: 250,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    padding: getSpacing('md'),
    borderBottomWidth: 1,
    borderBottomColor: getColor('gray.200'),
  },
  searchInput: {
    paddingHorizontal: getSpacing('md'),
    paddingVertical: getSpacing('sm'),
    borderWidth: 1,
    borderColor: getColor('gray.200'),
    borderRadius: 8,
    fontSize: 14,
    color: getColor('gray.900'),
  },
  countryList: {
    maxHeight: 200,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getSpacing('md'),
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
