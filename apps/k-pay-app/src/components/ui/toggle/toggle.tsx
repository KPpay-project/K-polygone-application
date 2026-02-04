import React from 'react';
import { TouchableOpacity, Animated } from 'react-native';

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'md',
  className,
}) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const sizeStyles = {
    sm: {
      container: { width: 32, height: 20 },
      thumb: { width: 12, height: 12 },
      translateRange: [4, 16],
    },
    md: {
      container: { width: 40, height: 24 },
      thumb: { width: 18, height: 18 },
      translateRange: [3, 19],
    },
    lg: {
      container: { width: 48, height: 28 },
      thumb: { width: 20, height: 20 },
      translateRange: [4, 24],
    },
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: sizeStyles[size].translateRange,
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          borderRadius: 20,
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: value ? '#2E4BF1' : '#E7EAEF',
          opacity: disabled ? 0.5 : 1,
        },
        sizeStyles[size].container,
      ]}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 2,
            transform: [{ translateX }],
          },
          sizeStyles[size].thumb,
        ]}
      />
    </TouchableOpacity>
  );
};

export default Toggle;
