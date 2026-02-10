import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography, Toggle } from '@/components/ui';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { ArrowLeft } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { getColor, getSpacing } from '@/theme';

interface NotificationSettingProps {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const NotificationSetting: React.FC<NotificationSettingProps> = ({
  title,
  value,
  onValueChange,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Typography
      variant="caption"
      weight="400"
      style={{ color: getColor('gray.500'), flex: 1 }}
    >
      {title}
    </Typography>
    <Toggle value={value} onValueChange={onValueChange} size="md" />
  </View>
);

interface NotificationSectionProps {
  title: string;
  children: React.ReactNode;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  title,
  children,
}) => (
  <View style={{ marginBottom: getSpacing('md') }}>
    <Typography
      variant="caption"
      weight="600"
      style={{ color: getColor('gray.900'), marginBottom: getSpacing('md') }}
    >
      {title}
    </Typography>
    {children}
  </View>
);

export default function NotificationsScreen() {
  const [loginEmailAlert, setLoginEmailAlert] = useState(false);
  const [transactionEmailAlert, setTransactionEmailAlert] = useState(true);
  const [pushNotification, setPushNotification] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      router.back();
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-5 h-5 items-center justify-center"
          >
            <ArrowLeft
              size={20}
              color={getColor('gray.900')}
              variant="Outline"
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View
          style={{
            paddingHorizontal: getSpacing('lg'),
            marginBottom: getSpacing('lg'),
          }}
        >
          <Typography
            variant="subtitle"
            weight="700"
            style={{ color: getColor('gray.900') }}
          >
            Notifications
          </Typography>
        </View>

        {/* Notification Settings */}
        <View
          style={{
            paddingHorizontal: getSpacing('lg'),
            marginBottom: getSpacing('2xl'),
          }}
        >
          <View
            style={{
              backgroundColor: '#F4F9FF',
              borderRadius: 12,
              paddingHorizontal: getSpacing('sm'),
              paddingVertical: getSpacing('md'),
              gap: getSpacing('md'),
            }}
          >
            <NotificationSection title="Login Alerts">
              <NotificationSetting
                title="Email"
                value={loginEmailAlert}
                onValueChange={setLoginEmailAlert}
              />
            </NotificationSection>

            <View style={{ height: 1, backgroundColor: '#D9D9D9' }} />

            <NotificationSection title="Transaction Alerts">
              <View style={{ gap: getSpacing('sm') }}>
                <NotificationSetting
                  title="Email"
                  value={transactionEmailAlert}
                  onValueChange={setTransactionEmailAlert}
                />
                <NotificationSetting
                  title="Push Notification"
                  value={pushNotification}
                  onValueChange={setPushNotification}
                />
              </View>
            </NotificationSection>
          </View>
        </View>

        {/* Save Button */}
        <View
          style={{
            paddingHorizontal: getSpacing('lg'),
            paddingBottom: getSpacing('2xl'),
          }}
        >
          <ReusableButton
            variant="primary"
            text="Save Changes"
            onPress={handleSaveChanges}
            showArrow={true}
            textColor="#FDFFFC"
            iconColor="#FDFFFC"
            loading={isSaving}
            style={{
              backgroundColor: '#FF0033',
              borderRadius: 10,
              height: 46,
              shadowColor: 'rgba(22, 20, 20, 0.06)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 20,
              elevation: 3,
            }}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
