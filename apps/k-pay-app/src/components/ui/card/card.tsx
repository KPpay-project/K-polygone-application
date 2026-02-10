import React from 'react';
import { View, ViewStyle } from 'react-native';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'shadow' | 'bordered';
}

const variantClasses: Record<string, string> = {
  default: 'bg-card rounded-lg p-4',
  shadow: 'bg-card rounded-lg p-4 shadow-lg',
  bordered: 'bg-card rounded-lg p-4 border border-gray200',
};

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
}) => (
  <View className={twMerge(variantClasses[variant])} style={style}>
    {children}
  </View>
);
