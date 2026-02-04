import React from 'react';
import { View, Image } from 'react-native';

interface OnboardingSlideProps {
  image: any;
}

export function OnboardingSlide({ image }: OnboardingSlideProps) {
  return (
    <View className="relative mb-12">
      <View />
      <View className="w-[280px] h-[280px] items-center justify-center">
        <Image
          source={image}
          className="w-[250px] h-[350px]"
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
