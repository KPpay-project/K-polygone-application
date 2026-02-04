import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Typography } from '../typography/typography';
import { ArrowDown2 } from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string;
  onSelect: (option: DropdownOption) => void;
  placeholder?: string;
  label?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder,
  label,
  searchable = false,
  searchPlaceholder,
  error,
  disabled = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const filteredOptions = searchable
    ? options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (option.subtitle &&
            option.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : options;

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <View className={`relative ${className}`}>
      {label && (
        <Typography variant="small" className="text-gray-900 font-medium mb-3">
          {label}
        </Typography>
      )}

      <TouchableOpacity
        onPress={toggleDropdown}
        className={`bg-white rounded-xl p-4 flex-row items-center justify-between border ${
          error ? 'border-red-500' : 'border-gray-200'
        } ${disabled ? 'opacity-50' : ''}`}
        disabled={disabled}
      >
        <View className="flex-row items-center flex-1">
          {selectedOption?.icon && (
            <View className="mr-3">{selectedOption.icon}</View>
          )}
          <View className="flex-1">
            <Typography
              variant="body"
              className={
                selectedOption ? 'text-gray-900 font-medium' : 'text-gray-400'
              }
            >
              {selectedOption
                ? selectedOption.label
                : placeholder || t('selectAnOption')}
            </Typography>
            {selectedOption?.subtitle && (
              <Typography variant="caption" className="text-gray-500">
                {selectedOption.subtitle}
              </Typography>
            )}
          </View>
        </View>
        <ArrowDown2 size={20} color="#6B7280" />
      </TouchableOpacity>

      {/* Dropdown Overlay */}
      {isOpen && (
        <View className="absolute top-20 left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60">
          {searchable && (
            <View className="p-3 border-b border-gray-200">
              <TextInput
                className="px-3 py-2 border border-gray-200 rounded-lg"
                placeholder={searchPlaceholder || t('search')}
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}
          <ScrollView className="max-h-48">
            {filteredOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="px-4 py-3 border-b border-gray-100 last:border-b-0 flex-row items-center"
                onPress={() => handleSelect(option)}
              >
                {option.icon && <View className="mr-3">{option.icon}</View>}
                <View className="flex-1">
                  <Typography
                    variant="body"
                    className="text-gray-900 font-medium"
                  >
                    {option.label}
                  </Typography>
                  {option.subtitle && (
                    <Typography variant="caption" className="text-gray-500">
                      {option.subtitle}
                    </Typography>
                  )}
                </View>
                {selectedValue === option.value && (
                  <View className="w-4 h-4 bg-blue-500 rounded-full" />
                )}
              </TouchableOpacity>
            ))}
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
