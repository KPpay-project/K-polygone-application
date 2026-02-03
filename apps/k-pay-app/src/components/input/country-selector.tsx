import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Typography } from '../ui';
import { useTranslation } from 'react-i18next';
import { countries as countriesData } from '@/data/countries';

export interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode?: string;
}

export interface CountrySelectorProps {
  value?: Country | null;
  onSelect: (country: Country) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  showDialCode?: boolean;
  maxHeight?: number;
  className?: string;
  containerStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  dropdownStyle?: ViewStyle;
  labelStyle?: TextStyle;
  countries?: Country[];
  onOpen?: () => void;
  onClose?: () => void;
  onSearch?: (query: string) => void;
  renderCountryItem?: (
    country: Country,
    onSelect: () => void
  ) => React.ReactNode;
  renderSelectedValue?: (country: Country | null) => React.ReactNode;
  renderSearchInput?: (
    value: string,
    onChangeText: (text: string) => void
  ) => React.ReactNode;
}

const DEFAULT_COUNTRIES: Country[] = countriesData.map((country) => ({
  code: country.code,
  name: country.name,
  flag: country.flag,
  dialCode: country.phoneCode,
}));

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onSelect,
  label,
  placeholder,
  error,
  disabled = false,
  searchable = true,
  showDialCode = false,
  maxHeight = 200,
  className = '',
  containerStyle,
  buttonStyle,
  dropdownStyle,
  labelStyle,
  countries = DEFAULT_COUNTRIES,
  onOpen,
  onClose,
  onSearch,
  renderCountryItem,
  renderSelectedValue,
  renderSearchInput,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [countries, searchQuery]);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen) {
      onOpen?.();
    } else {
      onClose?.();
      setSearchQuery('');
    }
  }, [isOpen, disabled, onOpen, onClose]);

  const handleSelect = useCallback(
    (country: Country) => {
      onSelect(country);
      setIsOpen(false);
      setSearchQuery('');
      onClose?.();
    },
    [onSelect, onClose]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
    },
    [onSearch]
  );

  const defaultSelectedValueRenderer = useCallback(
    (country: Country | null) => (
      <Typography
        variant="body"
        className={country ? 'text-gray-900' : 'text-gray-400'}
      >
        {country ? (
          <>
            {country.flag} {country.name}
            {showDialCode && country.dialCode && ` (${country.dialCode})`}
          </>
        ) : (
          placeholder || t?.('selectCountry') || 'Select Country'
        )}
      </Typography>
    ),
    [placeholder, showDialCode, t]
  );

  const defaultCountryItemRenderer = useCallback(
    (country: Country, onSelectCountry: () => void) => (
      <TouchableOpacity
        key={country.code}
        className="px-4 py-3 border-b border-gray-100 last:border-b-0 flex-row items-center"
        onPress={onSelectCountry}
        activeOpacity={0.7}
      >
        <Typography variant="body" className="text-xl mr-3">
          {country.flag}
        </Typography>
        <View className="flex-1">
          <Typography variant="body" className="text-gray-900">
            {country.name}
          </Typography>
          {showDialCode && country.dialCode && (
            <Typography variant="caption" className="text-gray-500 mt-1">
              {country.dialCode}
            </Typography>
          )}
        </View>
      </TouchableOpacity>
    ),
    [showDialCode]
  );

  const defaultSearchInputRenderer = useCallback(
    (value: string, onChangeText: (text: string) => void) => (
      <View className="p-3 border-b border-gray-200">
        <TextInput
          className="px-3 py-2 border border-gray-200 rounded-lg text-gray-900"
          placeholder={t?.('searchCountry') || 'Search country...'}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    ),
    [t]
  );

  return (
    <View className={`relative ${className}`} style={containerStyle}>
      {label && (
        <Typography
          variant="subtitle"
          className="text-gray-900 mb-2"
          style={labelStyle}
        >
          {label}
        </Typography>
      )}

      <TouchableOpacity
        className={`w-full px-4 py-4 rounded-xl border ${
          error ? 'border-red-500' : 'border-gray-200'
        } flex-row items-center justify-between ${
          disabled ? 'opacity-50 bg-gray-50' : 'bg-white'
        }`}
        style={buttonStyle}
        onPress={handleToggle}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {renderSelectedValue
          ? renderSelectedValue(value || null)
          : defaultSelectedValueRenderer(value || null)}

        <Typography
          variant="caption"
          className={`text-gray-400 transform transition-transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          ▼
        </Typography>
      </TouchableOpacity>

      {isOpen && (
        <View
          className="absolute top-20 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg"
          style={[{ maxHeight }, dropdownStyle]}
        >
          {searchable &&
            (renderSearchInput
              ? renderSearchInput(searchQuery, handleSearchChange)
              : defaultSearchInputRenderer(searchQuery, handleSearchChange))}

          <ScrollView
            className="flex-1"
            style={{ maxHeight: maxHeight - (searchable ? 60 : 0) }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) =>
                renderCountryItem
                  ? renderCountryItem(country, () => handleSelect(country))
                  : defaultCountryItemRenderer(country, () =>
                      handleSelect(country)
                    )
              )
            ) : (
              <View className="px-4 py-8 items-center">
                <Typography
                  variant="body"
                  className="text-gray-500 text-center"
                >
                  {t?.('noCountriesFound') || 'No countries found'}
                </Typography>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {error && (
        <Typography variant="caption" className="text-red-500 mt-1">
          {error}
        </Typography>
      )}
    </View>
  );
};

export default CountrySelector;
