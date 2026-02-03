import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
          opacity,
        },
        style,
      ]}
    />
  );
};

interface TransactionSkeletonProps {
  itemsCount?: number;
}

export const TransactionSkeleton: React.FC<TransactionSkeletonProps> = ({
  itemsCount = 5,
}) => {
  return (
    <View className="px-4">
      {Array.from({ length: itemsCount }).map((_, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between py-4 border-b border-gray-100"
        >
          {/* Avatar skeleton */}
          <View className="flex-row items-center flex-1">
            <SkeletonLoader
              width={40}
              height={40}
              borderRadius={20}
              style={{ marginRight: 12 }}
            />

            {/* Text content skeleton */}
            <View className="flex-1">
              <SkeletonLoader
                width="70%"
                height={16}
                borderRadius={4}
                style={{ marginBottom: 6 }}
              />
              <SkeletonLoader width="40%" height={12} borderRadius={4} />
            </View>
          </View>

          {/* Amount skeleton */}
          <View className="items-end">
            <SkeletonLoader
              width={60}
              height={16}
              borderRadius={4}
              style={{ marginBottom: 4 }}
            />
            <SkeletonLoader width={40} height={12} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
};
