import React from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Typography } from '@/components/ui';
import { ReusableModal } from '@/components/ui/modal/modal';
import { CloseCircle } from 'iconsax-react-nativejs';
import { networkOptions } from '../data';
import type { NetworkOption } from '../types';

interface NetworkSelectorProps {
  selectedNetwork: NetworkOption | null;
  onNetworkSelect: (network: NetworkOption) => void;
  showModal: boolean;
  onCloseModal: () => void;
}

export function NetworkSelector({
  selectedNetwork,
  onNetworkSelect,
  showModal,
  onCloseModal,
}: NetworkSelectorProps) {
  const handleNetworkSelect = (network: NetworkOption) => {
    onNetworkSelect(network);
    onCloseModal();
  };

  return (
    <ReusableModal
      visible={showModal}
      onClose={onCloseModal}
      variant="bottom"
      showCloseButton={false}
      animationType="slide"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Typography
          variant="h4"
          className="text-gray-900 font-semibold text-lg"
        >
          Select Network
        </Typography>
        <TouchableOpacity onPress={onCloseModal} className="p-1">
          <CloseCircle size={24} color="#6B7280" variant="Outline" />
        </TouchableOpacity>
      </View>

      {/* Network List */}
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-96">
        {networkOptions.map((network) => (
          <TouchableOpacity
            key={network.id}
            className={`flex-row items-center p-4 mb-3 border border-gray-200 rounded-xl ${
              selectedNetwork?.id === network.id
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white'
            }`}
            onPress={() => handleNetworkSelect(network)}
            activeOpacity={0.7}
          >
            <Image
              source={network.logo}
              style={{
                width: 32,
                height: 32,
                marginRight: 12,
              }}
              resizeMode="contain"
            />
            <Typography
              variant="body"
              className={`text-base font-medium ${
                selectedNetwork?.id === network.id
                  ? 'text-blue-700'
                  : 'text-gray-900'
              }`}
            >
              {network.name}
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ReusableModal>
  );
}

export default NetworkSelector;
