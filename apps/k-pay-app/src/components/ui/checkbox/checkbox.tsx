import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../typography/typography';
import { getColor } from '@/theme';

export interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  labelStyle?: any;
  checkboxStyle?: any;
  containerStyle?: any;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onPress,
  label,
  disabled = false,
  size = 'medium',
  variant = 'primary',
  labelStyle,
  checkboxStyle,
  containerStyle,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 16,
          height: 16,
          checkmarkSize: { width: 6, height: 6 },
        };
      case 'large':
        return {
          width: 24,
          height: 24,
          checkmarkSize: { width: 10, height: 10 },
        };
      default: // medium
        return {
          width: 20,
          height: 20,
          checkmarkSize: { width: 8, height: 8 },
        };
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          checkedBg: getColor('gray.600'),
          checkedBorder: getColor('gray.600'),
          uncheckedBorder: getColor('gray.300'),
        };
      default: // primary
        return {
          checkedBg: getColor('primary.600'),
          checkedBorder: getColor('primary.600'),
          uncheckedBorder: getColor('gray.300'),
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        containerStyle,
      ]}
      activeOpacity={0.7}
    >
      <View
        style={[
          {
            width: sizeStyles.width,
            height: sizeStyles.height,
            borderRadius: 4,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: checked ? variantStyles.checkedBg : 'transparent',
            borderColor: checked
              ? variantStyles.checkedBorder
              : variantStyles.uncheckedBorder,
            marginRight: label ? 12 : 0,
          },
          checkboxStyle,
        ]}
      >
        {checked && (
          <View
            style={{
              width: sizeStyles.checkmarkSize.width,
              height: sizeStyles.checkmarkSize.height,
              backgroundColor: 'white',
              borderRadius: 1,
            }}
          />
        )}
      </View>
      {label && (
        <Typography
          variant="body"
          style={[
            {
              color: disabled ? getColor('gray.400') : getColor('gray.700'),
              flex: 1,
            },
            labelStyle,
          ]}
        >
          {label}
        </Typography>
      )}
    </TouchableOpacity>
  );
};
