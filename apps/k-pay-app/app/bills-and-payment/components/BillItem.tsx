import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui';
import {
  Mobile,
  Electricity,
  ToggleOn,
  Wifi,
  Monitor,
} from 'iconsax-react-nativejs';
import type { BillItemProps } from '../types';

const getIconForBillType = (billId: string, iconColor: string) => {
  switch (billId) {
    case 'airtime':
      return <Mobile size={24} variant="Outline" color={iconColor} />;
    case 'electricity':
      return <Electricity size={24} variant="Outline" color={iconColor} />;
    case 'betting':
      return <ToggleOn size={24} variant="Outline" color={iconColor} />;
    case 'data':
      return <Wifi size={24} variant="Outline" color={iconColor} />;
    case 'cable-tv':
      return <Monitor size={24} variant="Outline" color={iconColor} />;
    default:
      return <Mobile size={24} variant="Outline" color={iconColor} />;
  }
};

export const BillItem: React.FC<BillItemProps> = ({
  option,
  isLast = false,
}) => {
  return (
    <TouchableOpacity
      onPress={option.onPress}
      className={`flex-row items-center p-4 my-1 ${!isLast ? 'border-b border-gray-200' : ''}`}
      activeOpacity={0.7}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: option.iconColor + '20' }}
      >
        {getIconForBillType(option.id, option.iconColor)}
      </View>
      <View className="flex-1">
        <Typography
          variant="body"
          className="text-gray-900 font-medium mb-1 text-sm"
        >
          {option.title}
        </Typography>
        <Typography variant="caption" className="text-gray-500 text-xs">
          {option.subtitle}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

export default BillItem;
