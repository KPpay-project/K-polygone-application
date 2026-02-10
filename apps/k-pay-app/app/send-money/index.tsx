// SendMoneyPage.tsx
import React, { useMemo, useCallback, useState } from 'react';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import { ProfileCircle, Bank } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { TouchableOpacity, View, Modal } from 'react-native';
import { Typography } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import MobileMoneyOptions from '@/modules/send-money/mno-options';

export default function SendMoneyPage() {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = useCallback(() => setIsModalVisible(true), []);
  const closeModal = useCallback(() => setIsModalVisible(false), []);
  const navigateTo = useCallback((path: string) => router.push(path), []);

  const transferOptions = useMemo(
    () => [
      {
        icon: <ProfileCircle size={20} color="#0057FF" />,
        title: t('walletToWalletTitle', {
          defaultValue: 'Wallet to Wallet Transfer',
        }),
        description: t('walletToWalletDescription', {
          defaultValue: 'Transfer funds directly between wallets',
        }),
        path: '/send-money/wallet-transfer',
      },

      {
        icon: <ProfileCircle size={20} color="#0057FF" />,
        title: t('bankTransferTitle', { defaultValue: 'Bank Transfer' }),
        description: t('bankTransferDescription', {
          defaultValue: 'Transfer funds directly between wallets',
        }),
        path: '/send-money/bank-transfer',
      },
    ],
    [t]
  );

  return (
    <ScreenContainer useSafeArea paddingHorizontal={15}>
      <HeaderWithTitle
        title={t('sendMoney')}
        description={t('sendMoneyModeQuestion')}
      />

      <View className="mt-8">
        {transferOptions.map(({ icon, title, description, path }, idx) => (
          <TouchableOpacity
            key={`${path}-${idx}`}
            onPress={() => navigateTo(path)}
            className="flex-row items-center my-3 py-6 bg-gray-100/60 rounded-lg p-4 mb-4"
            accessibilityRole="button"
            accessibilityLabel={title}
          >
            <View className="w-[44px] h-[44px] bg-blue-100 rounded-full items-center justify-center mr-4">
              {icon}
            </View>
            <View>
              <Typography variant="body" className="font-bold text-blue-900">
                {title}
              </Typography>
              <Typography variant="caption" className="text-gray-600">
                {description}
              </Typography>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={openModal}
        className="flex-row items-center my-3 py-6 bg-gray-100/60 rounded-lg p-4 mb-4"
        accessibilityRole="button"
        accessibilityLabel={t('payWithMobileMoney', {
          defaultValue: 'Pay with Mobile Money',
        })}
      >
        <View className="w-[44px] h-[44px] bg-blue-100 rounded-full items-center justify-center mr-4">
          <Bank size={20} color="#0057FF" />
        </View>
        <View>
          <Typography variant="body" className="font-bold text-blue-900">
            {t('payWithMobileMoney', { defaultValue: 'Pay with Mobile Money' })}
          </Typography>
          <Typography variant="caption" className="text-gray-600">
            {t('mobileMoneyDescription', {
              defaultValue: 'Transfer funds to beneficiary with mobile money',
            })}
          </Typography>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <MobileMoneyOptions closeModal={closeModal} />
      </Modal>
    </ScreenContainer>
  );
}
