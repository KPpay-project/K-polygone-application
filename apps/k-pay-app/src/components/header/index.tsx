import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/ui';
import { ArrowLeft, Notification } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/auth-context';

import { LinearGradient } from 'expo-linear-gradient';

export default function Header() {
  const { t } = useTranslation();
  const { user, meData } = useAuth();

  const meUser = meData?.user;
  const basicUser = user;

  const firstName = meUser?.firstName || basicUser?.name?.split(' ')[0] || '';
  const lastName =
    meUser?.lastName || basicUser?.name?.split(' ').slice(1).join(' ') || '';
  const fullName =
    `${firstName} ${lastName}`.trim() || basicUser?.name || 'User';

  const avatarLetter =
    firstName.charAt(0).toUpperCase() ||
    fullName.charAt(0).toUpperCase() ||
    'U';

  const navigateToProfile = () => {
    router.push('/profile');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <TouchableOpacity
        onPress={navigateToProfile}
        className="flex-row items-center"
      >
        <LinearGradient
          colors={['#3646efff', '#c9c7f0ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-12 h-12 rounded-full mr-3 overflow-hidden items-center justify-center"
        >
          <Typography variant="h4" className="text-white">
            {avatarLetter}
          </Typography>
        </LinearGradient>

        <View>
          <Typography variant="caption" className="text-gray-500">
            {getGreeting()}
          </Typography>
          <Typography variant="h5" className="text-gray-900 ">
            {fullName}
          </Typography>
        </View>
      </TouchableOpacity>
      <TouchableOpacity className="p-2">
        <View className="bg-gray-100 w-12 h-12 items-center justify-center rounded-full">
          <Notification size={22} color="#374151" variant="Outline" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

interface HeaderWithTitleProps {
  title?: string;
  description?: string;
  showIcon?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  icon?: React.ReactNode;
  px?: string | number | undefined;
  altOption?: React.ReactNode;
}

export function HeaderWithTitle({
  title,
  description,
  showIcon = true,
  showTitle = true,
  showDescription = true,
  icon,
  px = 0,
  altOption,
}: HeaderWithTitleProps) {
  const hasText = (showTitle && title) || (showDescription && description);

  return (
    <View className={`px-${px} mb-8 ${hasText ? '' : ''}`}>
      {showIcon && (
        <TouchableOpacity onPress={() => router.back()}>
          {icon || <ArrowLeft />}
        </TouchableOpacity>
      )}

      {altOption && <View className="my-2">{altOption}</View>}

      {hasText && (
        <View>
          {showTitle && title && (
            <Typography
              variant="body"
              weight="600"
              className="text-gray-900 mt-2"
            >
              {title}
            </Typography>
          )}

          {showDescription && description && (
            <Typography variant="caption" className="">
              {description}
            </Typography>
          )}
        </View>
      )}
    </View>
  );
}
