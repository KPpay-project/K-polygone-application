import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import {
  ArrowLeft,
  Edit2,
  Camera,
  User,
  Call,
  Sms,
  Location,
  Calendar,
  Verify,
} from 'iconsax-react-nativejs';
import { useTranslation } from 'react-i18next';
import { router, Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/auth-context';

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
  verified?: boolean;
}

const ProfileItem: React.FC<ProfileItemProps> = ({
  icon,
  label,
  value,
  onPress,
  verified = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-white rounded-2xl p-4 flex-row items-center justify-between shadow-sm mb-3"
  >
    <View className="flex-row items-center flex-1">
      <View className="w-10 h-10 bg-gray-100 rounded-xl items-center justify-center mr-3">
        {icon}
      </View>
      <View className="flex-1">
        <Typography variant="caption" className="text-gray-500 mb-1">
          {label}
        </Typography>
        <Typography variant="body" className="text-gray-900 font-medium">
          {value}
        </Typography>
      </View>
    </View>
    <View className="flex-row items-center">
      {verified && (
        <View className="mr-2">
          <Verify size={16} color="#10B981" variant="Bold" />
        </View>
      )}
      <Edit2 size={16} color="#9CA3AF" variant="Outline" />
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { logout, loading, meData, fetchUserData } = useAuth();

  const memoizedFetchUserData = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    memoizedFetchUserData();
  }, [memoizedFetchUserData]);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
  };

  const handleChangePhoto = () => {
    Alert.alert('Change Profile Photo', 'Choose an option', [
      {
        text: 'Camera',
        onPress: () =>
          Alert.alert('Camera', 'Camera functionality coming soon!'),
      },
      {
        text: 'Gallery',
        onPress: () =>
          Alert.alert('Gallery', 'Gallery functionality coming soon!'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleEditField = (field: string) => {
    Alert.alert('Edit', `Edit ${field} coming soon!`);
  };

  return (
    <ScreenContainer useSafeArea={true} className="bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={handleBack} className="p-2 -ml-2">
          <ArrowLeft size={24} color="#374151" variant="Outline" />
        </TouchableOpacity>
        <Typography variant="h3" className="text-gray-900 font-semibold">
          Profile
        </Typography>
        <TouchableOpacity onPress={handleEditProfile} className="p-2 -mr-2">
          <Edit2 size={24} color="#3B82F6" variant="Outline" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center px-6 mb-8">
          <View className="relative mb-4">
            <View className="w-24 h-24 bg-gray-200 rounded-full items-center justify-center overflow-hidden">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <User size={40} color="#9CA3AF" variant="Outline" />
              )}
            </View>
            <TouchableOpacity
              onPress={handleChangePhoto}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full items-center justify-center"
            >
              <Camera size={16} color="#FFFFFF" variant="Outline" />
            </TouchableOpacity>
          </View>

          <Typography variant="h5" className="text-gray-900 font-bold mb-1">
            {meData?.user?.firstName && meData?.user?.lastName
              ? `${meData.user.firstName} ${meData.user.lastName}`
              : 'User Name'}
          </Typography>
          <Typography variant="body" className="text-gray-500">
            {meData?.merchant
              ? meData.merchant.businessName
              : meData?.role || 'Member'}
          </Typography>
        </View>

        {/* Personal Information */}
        <View className="px-6 mb-6">
          <Typography variant="h5" className="text-gray-900 font-semibold mb-4">
            Personal Information
          </Typography>

          <ProfileItem
            icon={<User size={20} color="#6B7280" variant="Outline" />}
            label="Full Name"
            value={
              meData?.user?.firstName && meData?.user?.lastName
                ? `${meData.user.firstName} ${meData.user.lastName}`
                : 'User Name'
            }
            onPress={() => handleEditField('Full Name')}
            verified={true}
          />

          <ProfileItem
            icon={<Sms size={20} color="#6B7280" variant="Outline" />}
            label="Email Address"
            value={meData?.user?.email || 'user@example.com'}
            onPress={() => handleEditField('Email Address')}
            verified={true}
          />

          <ProfileItem
            icon={<Call size={20} color="#6B7280" variant="Outline" />}
            label="Phone Number"
            value={meData?.user?.phone ?? '+234 801 234 5678'}
            onPress={() => handleEditField('Phone Number')}
            verified={true}
          />
        </View>

        {/* Address Information */}

        {/* Logout Button */}
        <View className="px-6 mb-6">
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Logout',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await logout();
                      router.replace('/auth/login');
                    } catch (error) {
                      console.error('Logout error:', error);
                      Alert.alert(
                        'Error',
                        'Failed to logout. Please try again.'
                      );
                    }
                  },
                },
              ]);
            }}
            className="bg-red-100 rounded-2xl p-4 flex-row items-center justify-between shadow-sm"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center mr-3">
                <Text className="text-lg">🚪</Text>
              </View>
              <View>
                <Typography variant="body" className="text-red-600 font-medium">
                  Logout
                </Typography>
                <Typography variant="caption" className="text-red-400">
                  Sign out of your account
                </Typography>
              </View>
            </View>
            <Typography variant="body" className="text-red-400">
              ›
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View className="h-20" />
        <View></View>
      </ScrollView>
    </ScreenContainer>
  );
}
