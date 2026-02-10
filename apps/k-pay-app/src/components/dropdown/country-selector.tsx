import React, { useState, useMemo } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui';
import { countries } from '@/data/countries';

type Country = {
  code: string;
  name: string;
  flag: string;
};

type CountryPickerProps = {
  label?: string;
  value?: string; // country code
  onChange: (code: string, country: Country) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
};

export function CountryPicker({
  label = 'Select Country',
  value,
  onChange,
  error,
  disabled,
  placeholder = 'Select your nationality',
}: CountryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCountry = useMemo(
    () => countries.find((c) => c.code === value) || null,
    [value]
  );

  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    return countries.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <View className="relative">
      {label && (
        <Typography variant="small" className="text-sm font-medium mb-2">
          {label}
        </Typography>
      )}

      {/* Trigger */}
      <TouchableOpacity
        className={`w-full px-4 py-4 rounded-xl border flex-row items-center justify-between ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 opacity-50' : 'bg-white'}`}
        onPress={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <Typography
          className={`text-base ${
            selectedCountry ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {selectedCountry
            ? `${selectedCountry.flag} ${selectedCountry.name}`
            : placeholder}
        </Typography>
        <Typography className="text-gray-400 text-xs">▼</Typography>
      </TouchableOpacity>

      {/* Dropdown */}
      {isOpen && (
        <View className="absolute top-20 left-0 right-0 z-50 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60">
          {/* Search */}
          <View className="p-3 border-b border-gray-300">
            <TextInput
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              placeholder="Search country..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* List */}
          <ScrollView className="max-h-48">
            {filteredCountries.map((country) => (
              <TouchableOpacity
                key={country.code}
                className="px-4 py-3 border-b border-gray-100 flex-row items-center"
                onPress={() => {
                  onChange(country.code, country);
                  setIsOpen(false);
                  setSearch('');
                }}
              >
                <Typography className="text-xl mr-3">{country.flag}</Typography>
                <Typography className="text-gray-900 text-base flex-1">
                  {country.name}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Error */}
      {error && (
        <Typography className="text-red-500 text-xs mt-1">{error}</Typography>
      )}
    </View>
  );
}
