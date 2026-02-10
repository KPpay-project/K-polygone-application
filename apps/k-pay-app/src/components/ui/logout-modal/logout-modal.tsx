import React, { useState } from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../typography/typography';
import { ReusableButton } from '../button/reusable-button';
import { Logout } from 'iconsax-react-nativejs';
import { getColor, getSpacing } from '../../../theme';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ visible, onClose, onConfirm }: LogoutModalProps) {
  const { t } = useTranslation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleBackdropPress = () => {
    if (isLoggingOut) return;
    onClose();
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback>
            <View
              className="bg-white rounded-2xl mx-6 p-6"
              style={{
                maxWidth: 320,
                width: '100%',
              }}
            >
              {/* Logout Icon */}
              <View className="items-center mb-4">
                <View className="w-12 h-12 bg-red-100 rounded-full items-center justify-center">
                  <Logout
                    size={24}
                    color={getColor('error.500')}
                    variant="Outline"
                  />
                </View>
              </View>

              {/* Title */}
              <View className="mb-2">
                <Typography
                  variant="h4"
                  weight="bold"
                  className="text-gray-900 text-center"
                >
                  {t('logout')}
                </Typography>
              </View>

              {/* Message */}
              <View className="mb-6">
                <Typography
                  variant="body"
                  className="text-gray-600 text-center leading-5"
                >
                  {t('logoutConfirmationMessage')}
                </Typography>
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3 gap-4">
                <View className="flex-1">
                  <ReusableButton
                    variant="outline"
                    text={t('cancel')}
                    onPress={onClose}
                    textColor={getColor('gray.700')}
                    style={{
                      borderColor: getColor('gray.300'),
                      paddingVertical: getSpacing('md'),
                    }}
                    disabled={isLoggingOut}
                  />
                </View>
                <View className="flex-1">
                  <ReusableButton
                    variant="primary"
                    text={t('logout')}
                    onPress={handleConfirmLogout}
                    style={{
                      backgroundColor: getColor('error.500'),
                      paddingVertical: getSpacing('md'),
                    }}
                    loading={isLoggingOut}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
