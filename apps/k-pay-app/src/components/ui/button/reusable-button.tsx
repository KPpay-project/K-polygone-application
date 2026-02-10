import React, { ReactNode, useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  TouchableOpacityProps,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Typography } from '../typography/typography';
type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'default' | 'sm' | 'lg';

export interface ReusableButtonProps extends TouchableOpacityProps {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  text?: string;
  showArrow?: boolean;
  iconColor?: string;
  textColor?: string;
  loading?: boolean;
  textClassName?: string;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-red-500',
  outline: 'border border-primary-DEFAULT bg-transparent',
  ghost: 'bg-transparent',
};

const sizeStyles: Record<Size, string> = {
  default: 'py-3 px-8 h-[56px]',
  sm: 'py-2 px-4 h-[40px]',
  lg: 'py-4 px-10 h-[64px]',
};

export const ReusableButton: React.FC<ReusableButtonProps> = ({
  children,
  variant = 'primary',
  size = 'default',
  className = '',
  text,
  showArrow = false,
  iconColor = '#fff',
  textColor = '#fff',
  disabled = false,
  loading = false,
  textClassName = '',
  ...props
}) => {
  const spinOuter = useRef(new Animated.Value(0)).current;
  const spinInner = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      const outerAnim = Animated.loop(
        Animated.timing(spinOuter, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      );
      const innerAnim = Animated.loop(
        Animated.timing(spinInner, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      outerAnim.start();
      innerAnim.start();
      return () => {
        outerAnim.stop();
        innerAnim.stop();
      };
    } else {
      spinOuter.setValue(0);
      spinInner.setValue(0);
    }
  }, [loading, spinOuter, spinInner]);

  const getDisabledStyles = () => {
    if (!disabled && !loading) return '';
    return 'opacity-50';
  };

  const getDisabledTextColor = () => {
    if (!disabled && !loading) return textColor;
    return '#9CA3AF';
  };

  const spinOuterInterpolate = spinOuter.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getDisabledIconColor = () => {
    if (!disabled) return iconColor;
    return '#9CA3AF';
  };

  const spinInnerInterpolate = spinInner.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <TouchableOpacity
      className={`rounded-xl items-center justify-center w-full ${variantStyles[variant]} ${sizeStyles[size]} ${getDisabledStyles()} ${className}`}
      activeOpacity={disabled || loading ? 1 : 0.8}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <View>
          <ActivityIndicator color={'white'} />
        </View>
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {children}
          {text && (
            <Typography
              color={getDisabledTextColor()}
              className={`font-semibold ${textClassName}`}
            >
              {text}
            </Typography>
          )}
          {/* {showArrow && (
            <ArrowRight2 color={getDisabledIconColor()} size={18} />
          )} */}
        </View>
      )}
    </TouchableOpacity>
  );
};
