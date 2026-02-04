import React, { useState } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Typography } from '../typography/typography';

export interface DatePickerProps {
  value?: Date;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  placeholder = 'Select date',
  label,
  error,
  disabled = false,
  maximumDate,
  minimumDate,
  className = '',
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Always close picker on Android after any interaction
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    // Handle date selection for both platforms
    if (selectedDate && (event.type === 'set' || Platform.OS === 'ios')) {
      const adjustedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      onDateChange(adjustedDate);
    }
  };

  const handleDonePress = () => {
    setShowPicker(false);
  };

  return (
    <View className={className}>
      {label && (
        <Typography variant="small" className="text-sm font-medium mb-2">
          {label}
        </Typography>
      )}

      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        accessible={true}
        accessibilityLabel={label || placeholder}
        accessibilityRole="button"
        className={`w-full px-4 py-4 rounded-xl border flex-row items-center justify-between ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-50 opacity-50' : 'bg-white'}`}
      >
        <Typography
          className={`text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}
        >
          {value ? formatDate(value) : placeholder}
        </Typography>
        <Typography className="text-gray-400 text-xs">📅</Typography>
      </TouchableOpacity>

      {showPicker && (
        <View className="mt-4">
          {Platform.OS === 'ios' && (
            <View className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Typography className="text-red-600 text-lg">
                    Cancel
                  </Typography>
                </TouchableOpacity>
                <Typography className="text-lg font-semibold">
                  Select Date
                </Typography>
                <TouchableOpacity
                  onPress={handleDonePress}
                  className="bg-blue-600 px-4 py-2 rounded-lg"
                >
                  <Typography className="text-white font-medium">
                    Done
                  </Typography>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="spinner"
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                onChange={handleDateChange}
                style={{ height: 180 }}
              />
            </View>
          )}

          {Platform.OS === 'android' && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              onChange={handleDateChange}
            />
          )}
        </View>
      )}

      {error && (
        <Typography className="text-red-500 text-xs mt-1">{error}</Typography>
      )}
    </View>
  );
};
