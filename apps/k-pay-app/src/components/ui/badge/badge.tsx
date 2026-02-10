import React from 'react';
import { View, ViewStyle } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Typography } from '../typography/typography';

export interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  style?: ViewStyle;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-gray100 text-gray900',
  success: 'bg-success500 text-white',
  warning: 'bg-warning500 text-white',
  destructive: 'bg-red500 text-white',
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  color,
  variant = 'primary',
  style,
}) => (
  <View
    className={twMerge(
      'px-3 py-1 rounded-full items-center justify-center',
      color ? `bg-[${color}]` : variantClasses[variant]
    )}
    style={style}
  >
    <Typography variant="caption" weight="semiBold" className="text-xs">
      {label}
    </Typography>
  </View>
);
