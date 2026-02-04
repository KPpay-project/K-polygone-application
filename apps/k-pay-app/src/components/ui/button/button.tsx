import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost';

type Size = 'default' | 'sm' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  textClassName?: string;
}

const variantStyles: Record<Variant, string> = {
  default: 'bg-gray-200',
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  destructive: 'bg-red-600',
  outline: 'border border-red-400 bg-transparent',
  ghost: 'bg-transparent',
};

const textVariantStyles: Record<Variant, string> = {
  default: 'text-black',
  primary: 'text-white',
  secondary: 'text-white',
  destructive: 'text-white',
  outline: 'text-red-500',
  ghost: 'text-gray-800',
};

const sizeStyles: Record<Size, string> = {
  default: 'py-3 px-8',
  sm: 'py-2 px-4',
  lg: 'py-4 px-10',
};

const textSizeStyles: Record<Size, string> = {
  default: 'text-base',
  sm: 'text-sm',
  lg: 'text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  textClassName = '',
  ...props
}) => {
  return (
    <TouchableOpacity
      className={`rounded-xl  items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      <Text
        className={`font-semibold ${textVariantStyles[variant]} ${textSizeStyles[size]} ${textClassName}`}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};
