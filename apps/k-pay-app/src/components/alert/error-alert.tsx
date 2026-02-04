import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui';
import { CloseCircle, InfoCircle } from 'iconsax-react-nativejs';

interface ErrorAlertProps {
  message: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  className = '',
  dismissible = false,
  onDismiss,
  type = 'error',
}) => {
  if (!message) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-orange-50 border-orange-200',
          text: 'text-orange-700',
          icon: '#F97316',
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          text: 'text-blue-700',
          icon: '#3B82F6',
        };
      case 'error':
      default:
        return {
          container: 'bg-red-50 border-red-200',
          text: 'text-red-600',
          icon: '#DC2626',
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <View
      className={`mb-4 p-4 ${styles.container} border rounded-xl shadow-sm ${className}`}
    >
      <View className="flex-row items-start">
        {/* Icon */}
        <View className="mr-3 mt-0.5">
          <InfoCircle size={20} color={styles.icon} variant="Bold" />
        </View>

        {/* Message Content */}
        <View className="flex-1">
          <Typography variant="body" className={`${styles.text} leading-5`}>
            {message}
          </Typography>
        </View>

        {/* Dismiss Button */}
        {dismissible && onDismiss && (
          <TouchableOpacity
            onPress={onDismiss}
            className="ml-2 mt-0.5"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <CloseCircle size={18} color={styles.icon} variant="Bold" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
