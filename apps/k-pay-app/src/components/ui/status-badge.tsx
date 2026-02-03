import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

export type StatusType = 'pending' | 'unverified' | 'complete';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  pending: {
    labelKey: 'pending',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  unverified: {
    labelKey: 'unverified',
    bgColor: 'bg-red-100',
    textColor: 'text-red-600',
  },
  complete: {
    labelKey: 'complete',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
};

const sizeConfig = {
  sm: {
    paddingX: 'px-2',
    paddingY: 'py-1',
    textSize: 'text-xs',
  },
  md: {
    paddingX: 'px-3',
    paddingY: 'py-1.5',
    textSize: 'text-sm',
  },
  lg: {
    paddingX: 'px-4',
    paddingY: 'py-2',
    textSize: 'text-base',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  const { t } = useTranslation();
  const statusStyle = statusConfig[status];
  const sizeStyle = sizeConfig[size];

  return (
    <View
      className={`rounded-full ${statusStyle.bgColor} ${sizeStyle.paddingX} ${sizeStyle.paddingY}`}
    >
      <Text
        className={`font-medium ${statusStyle.textColor} ${sizeStyle.textSize}`}
      >
        {t(statusStyle.labelKey)}
      </Text>
    </View>
  );
};

export default StatusBadge;
