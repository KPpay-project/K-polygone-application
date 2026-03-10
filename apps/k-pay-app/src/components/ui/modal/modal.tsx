import { type ReactNode } from 'react';
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Typography } from '../typography/typography';
import { useTranslation } from 'react-i18next';

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  showCloseButton?: boolean;
  animationType?: 'slide' | 'fade' | 'none';
  transparent?: boolean;
  onBackdropPress?: () => void;
  variant?: 'center' | 'bottom';
  isClosing?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
                height: variant === 'bottom' ? screenHeight * 0.4 : undefined,
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

              {showCloseButton ? (
                <View className="mt-6">
                  <TouchableOpacity
                    onPress={onClose}
                    disabled={isClosing}
                    activeOpacity={0.85}
                    className="w-full py-3 rounded-xl border border-gray-200"
                  >
                    <Typography
                      variant="body"
                      className="text-gray-900 text-center"
                    >
                      {t('close')}
                    </Typography>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
