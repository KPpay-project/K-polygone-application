import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';

interface BottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: string | number;
}

export const BottomSheetModal = ({
  visible,
  onClose,
  children,
  height = '',
}: BottomSheetModalProps) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 justify-end ">
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1"
        />

        <View
          className="bg-white  py-10 px-8 rounded-t-3xl"
          // style={{ maxHeight: height }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};
