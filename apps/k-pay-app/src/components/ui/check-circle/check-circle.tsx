import React from 'react';
import { View, TouchableOpacity } from 'react-native';

export interface CheckCircleProps {
  checked: boolean;
  onPress?: () => void;
  size?: number;
  disabled?: boolean;
}

export const CheckCircle: React.FC<CheckCircleProps> = ({
  checked,
  onPress,
  size = 24,
  disabled = false,
}) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: checked ? '#2E4BF1' : '#E5E7EB',
        backgroundColor: checked ? '#2E4BF1' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked && (
        <View
          style={{
            position: 'absolute',
            top: '25%',
            left: '20%',
            width: '35%',
            height: '50%',
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderColor: '#FFFFFF',
            transform: [{ rotate: '-45deg' }],
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default CheckCircle;
