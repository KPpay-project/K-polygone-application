import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

interface CircularProgressBarProps {
  percentage?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage = 50,
  size = 120,
  strokeWidth = 10,
  color = '#007BFF',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke="#D9D9D9"
          strokeWidth={strokeWidth}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        {/* Progress Circle */}
        <Circle
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CircularProgressBar;
