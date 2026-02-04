import React from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { Typography } from '@/components/ui';
import EmptyTicketData from '@/icons/empty-ticket';

interface EmptyStateProps extends SvgProps {
  title?: string;
  description?: string;
  icon?: React.FC<SvgProps>;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description,
  icon: Icon = EmptyTicketData,
  children,
  ...props
}) => {
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Icon {...props} />
      {title && (
        <Typography variant="h5" className="mt-4 font-semibold text-center">
          {title}
        </Typography>
      )}
      {description && (
        <Typography variant="small" className="mt-2 text-gray-500 text-center">
          {description}
        </Typography>
      )}
      {children && <View className="mt-4">{children}</View>}
    </View>
  );
};
