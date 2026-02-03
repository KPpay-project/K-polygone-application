import React from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../typography/typography';

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  transparent?: boolean;
  onBackdropPress?: () => void;
  variant?: 'center' | 'bottom';
  isClosing?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export function ReusableModal({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  animationType = 'fade',
  transparent = true,
  onBackdropPress,
  variant = 'center',
  isClosing = false,
}: ReusableModalProps) {
  const { t } = useTranslation();
  const handleBackdropPress = () => {
    if (isClosing) return;
    if (onBackdropPress) {
      onBackdropPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      onRequestClose={onClose}
      style={{
        borderTopEndRadius: 40,
        borderTopStartRadius: 40,
      }}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View
          className={`flex-1 bg-black/50 ${
            variant === 'center' ? 'justify-center items-center' : 'justify-end'
          }`}
        >
          <TouchableWithoutFeedback>
            <View
              className={`bg-white p-6 ${
                variant === 'center'
                  ? 'rounded-2xl mx-6'
                  : 'rounded-t-2xl w-full'
              }`}
              style={{
                maxWidth: variant === 'center' ? 400 : screenWidth,
              }}
            >
              {title && (
                <View className="mb-4">
                  <Typography
                    variant="caption"
                    className="text-gray-900 text-center"
                  >
                    {title}
                  </Typography>
                </View>
              )}

              {children}

              {/* {showCloseButton && (
                <View className="mt-6">
                  <ReusableButton
                    variant="outline"
                    text={t('close')}
                    onPress={onClose}
                    loading={isClosing}
                  />
                </View>
              )} */}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
