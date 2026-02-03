import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from './typography/typography';

interface BillItemProps {
  icon: React.ReactNode;
  title: string;
  backgroundColor: string;
  textColor: string;
  onPress?: () => void;
}

export const BillItem: React.FC<BillItemProps> = ({
  icon,
  title,
  backgroundColor,
  textColor,
  onPress,
}) => {
  return (
    <TouchableOpacity className="items-center flex-1" onPress={onPress}>
      <View
        className={`w-[65px] h-[65px] ${backgroundColor} rounded-xl items-center justify-center`}
      >
        {icon}
        <Typography
          color=""
          variant="small"
          className={`${textColor} text-xs mt-1`}
        >
          {title}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
