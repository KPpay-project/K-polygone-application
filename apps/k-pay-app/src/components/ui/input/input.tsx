import React from 'react';
import { TextInput, View, TextInputProps } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../typography/typography';

export interface InputProps extends TextInputProps {
  variant?: 'default' | 'outline' | 'filled';
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  variant = 'default',
  error,
  label,
  disabled = false,
  className = '',
  style,
  ...props
}) => {
  const base = 'bg-white rounded-xl p-4 text-base font-medium';
  const borderClass = error
    ? 'border border-red-500'
    : 'border border-gray-200';
  const disabledClass = disabled ? 'opacity-50' : '';

  return (
    <View className={`${className}`}>
      {label && (
        <Typography variant="body" className="text-gray-900 font-medium mb-3">
          {label}
        </Typography>
      )}

      <TextInput
        className={twMerge(base, borderClass, disabledClass)}
        style={style}
        placeholderTextColor="#9CA3AF"
        editable={!disabled}
        {...props}
      />

      {error && (
        <Typography variant="caption" className="text-red-500 mt-1">
          {error}
        </Typography>
      )}
    </View>
  );
};
