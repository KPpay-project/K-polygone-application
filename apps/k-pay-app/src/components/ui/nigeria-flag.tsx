import React from 'react';
import { View } from 'react-native';

interface NigeriaFlagProps {
  size?: number;
}

export const NigeriaFlag: React.FC<NigeriaFlagProps> = ({ size = 20 }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        flexDirection: 'row',
      }}
    >
      {/* Green stripe */}
      <View
        style={{
          width: size / 3,
          height: size,
          backgroundColor: '#008751',
        }}
      />
      {/* White stripe */}
      <View
        style={{
          width: size / 3,
          height: size,
          backgroundColor: '#FFFFFF',
        }}
      />
      {/* Green stripe */}
      <View
        style={{
          width: size / 3,
          height: size,
          backgroundColor: '#008751',
        }}
      />
    </View>
  );
};
