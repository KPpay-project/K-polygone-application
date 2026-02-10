import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { ArrowLeft, Trash } from 'iconsax-react-nativejs';

interface DeviceSession {
  id: string;
  deviceName: string;
  status: string;
  lastLogin?: string;
  platform: string;
  isCurrent: boolean;
}

const DeviceSessionCard = ({ session }: { session: DeviceSession }) => {
  const handleDelete = () => {
    Alert.alert(
      'Remove Device',
      `Are you sure you want to remove ${session.deviceName} from your account?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // Handle device removal logic here
          },
        },
      ]
    );
  };

  return (
    <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Typography
            variant="body"
            className="text-gray-900 font-semibold text-base mb-1"
          >
            {session.deviceName}
          </Typography>

          <Typography variant="caption" className="text-gray-600 text-sm mb-1">
            {session.status}
          </Typography>

          {session.lastLogin && (
            <Typography
              variant="caption"
              className="text-gray-500 text-sm mb-1"
            >
              {session.lastLogin}
            </Typography>
          )}

          <Typography variant="caption" className="text-gray-500 text-sm">
            {session.platform}
          </Typography>
        </View>

        {!session.isCurrent && (
          <TouchableOpacity
            onPress={handleDelete}
            className="p-2 ml-3"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function DeviceSessionsScreen() {
  const deviceSessions: DeviceSession[] = [
    {
      id: '1',
      deviceName: 'Iphone (Current Device)',
      status: 'Currently signed in',
      platform: 'Signed in via mobile app',
      isCurrent: true,
    },
    {
      id: '2',
      deviceName: 'Chrome Window',
      status: 'Last Login: 03 Aug 2025, 15:02:77PM',
      platform: 'Signed in via Web Platform',
      isCurrent: false,
    },
  ];

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScreenContainer>
      <View className="flex-1 px-4 pt-2">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity
            onPress={handleGoBack}
            className="mr-4 p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>

          <Typography
            variant="h3"
            className="text-gray-900 font-semibold text-lg"
          >
            Device and sessions
          </Typography>
        </View>

        {/* Device Sessions List */}
        <View className="flex-1">
          {deviceSessions.map((session) => (
            <DeviceSessionCard key={session.id} session={session} />
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}
