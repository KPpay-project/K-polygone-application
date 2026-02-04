import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { Typography } from '@/components/ui';

type StatusType =
  | 'not-started'
  | 'in-progress'
  | 'pending'
  | 'active'
  | 'done'
  | 'failed'
  | 'delayed'
  | 'cancelled';

type StatusConfig = {
  label: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  icon?: string;
};

const statusConfig: Record<StatusType, StatusConfig> = {
  'not-started': {
    label: 'Not Started',
    backgroundColor: '#F3F4F6',
    textColor: '#4B5563',
    borderColor: '#4B5563',
    icon: '○',
  },
  'in-progress': {
    label: 'In Progress',
    backgroundColor: '#FEF3C7',
    textColor: '#B45309',
    borderColor: '#B45309',
    icon: '◐',
  },
  pending: {
    label: 'Pending',
    backgroundColor: '#FEF9C3',
    textColor: '#854D0E',
    borderColor: '#854D0E',
    icon: '',
  },
  active: {
    label: 'Active',
    backgroundColor: '#EFF6FF',
    textColor: '#1D4ED8',
    borderColor: '#1D4ED8',
    icon: '●',
  },
  done: {
    label: 'Done',
    backgroundColor: '#ECFDF5',
    textColor: '#047857',
    borderColor: '#047857',
    icon: '✓',
  },
  failed: {
    label: 'Failed',
    backgroundColor: '#FEE2E2',
    textColor: '#B91C1C',
    borderColor: '#B91C1C',
    icon: '✗',
  },
  delayed: {
    label: 'Delayed',
    backgroundColor: '#FEE2E2',
    textColor: '#B91C1C',
    borderColor: '#B91C1C',
    icon: '!',
  },
  cancelled: {
    label: 'Cancelled',
    backgroundColor: '#F9FAFB',
    textColor: '#4B5563',
    borderColor: '#4B5563',
    icon: '⊘',
  },
};

type StatusBadgeProps = {
  status: StatusType;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
};

export function StatusBadge({
  status,
  showIcon = false,
  iconPosition = 'right',
  style,
  textStyle,
  className = 'px-3 py-1 rounded-full border',
  textClassName = 'text-xs font-medium',
  children,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  const iconEl =
    showIcon && config.icon ? (
      <Typography
        className="text-xs"
        style={{
          color: config.textColor,
          marginRight: iconPosition === 'left' ? 4 : 0,
          marginLeft: iconPosition === 'right' ? 4 : 0,
        }}
      >
        {config.icon}
      </Typography>
    ) : null;

  return (
    <View
      className={className}
      style={[
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
        },
        style,
      ]}
    >
      {iconPosition === 'left' && iconEl}
      <Typography
        variant="small"
        className={textClassName}
        style={[{ color: config.textColor }, textStyle]}
      >
        {children || config.label}
      </Typography>
      {iconPosition === 'right' && iconEl}
    </View>
  );
}
