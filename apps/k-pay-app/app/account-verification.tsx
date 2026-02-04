import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { ContainerLayout, ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import {
  ArrowLeft,
  ArrowRight2,
  User,
  Card,
  Location,
  Building,
} from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getColor, getSpacing } from '../src/theme';
import { StatusBadge, StatusType } from '../src/components/ui/status-badge';
import VerificationScreen from './verification';

interface VerificationItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: StatusType;
  onPress: () => void;
}

const VerificationItem: React.FC<VerificationItemProps> = ({
  icon,
  title,
  subtitle,
  status,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl mb-3"
      style={{
        paddingHorizontal: getSpacing('lg'),
        paddingVertical: getSpacing('lg'),
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: getColor('gray.200'),
      }}
      activeOpacity={0.7}
    >
      <View style={{ gap: getSpacing('md') }}>
        {/* Icon and Status Row */}
        <View className="flex-row items-center justify-between">
          <View
            className="rounded-full items-center justify-center"
            style={{
              width: 48,
              height: 48,
              backgroundColor: getColor('primary.50'),
            }}
          >
            {icon}
          </View>
          <StatusBadge status={status} size="sm" />
        </View>

        {/* Text and Arrow Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Typography
              variant="h4"
              className="text-gray-900 font-semibold"
              style={{ marginBottom: 4 }}
            >
              {title}
            </Typography>
            <Typography variant="body" className="text-gray-500">
              {subtitle}
            </Typography>
          </View>
          <ArrowRight2
            size={20}
            color={getColor('gray.400')}
            variant="Outline"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function AccountVerificationScreen() {
  const { t } = useTranslation();

  const handleBackPress = () => {
    router.back();
  };

  const handleIdentityVerificationPress = () => {
    // Navigate to identity verification screen
    router.push('/identity-verification');
  };

  const handleAddressVerificationPress = () => {
    // Navigate to address verification screen
    router.push('/address-verification');
  };

  const handleCompanyVerificationPress = () => {
    // Navigate to company verification screen
    router.push('/company-verification');
  };

  return (
    // <ContainerLayout
    //   useSafeArea={true}

    // >
    //   <View
    //     className="flex-row items-center"
    //     style={{
    //       paddingHorizontal: getSpacing('lg'),
    //       paddingTop: getSpacing('md'),
    //       paddingBottom: getSpacing('xl'),
    //     }}
    //   >

    //     <TouchableOpacity
    //       onPress={handleBackPress}
    //       className="items-center justify-center"
    //       style={{
    //         width: 40,
    //         height: 40,
    //         marginRight: getSpacing('lg'),
    //       }}
    //       activeOpacity={0.7}
    //     >
    //       <ArrowLeft size={24} color={getColor('gray.900')} variant="Outline" />
    //     </TouchableOpacity>
    //     <Typography variant="h2" className="text-gray-900 font-semibold flex-1">
    //       {t('accountVerification')}
    //     </Typography>
    //   </View>

    //   {/* Content */}
    //   <ScrollView
    //     className="flex-1"
    //     style={{ paddingHorizontal: getSpacing('lg') }}
    //     showsVerticalScrollIndicator={false}
    //   >
    //     <View>
    //       <VerificationItem
    //         icon={
    //           <Card
    //             size={24}
    //             color={getColor('primary.600')}
    //             variant="Outline"
    //           />
    //         }
    //         title={t('identityVerification')}
    //         subtitle={t('identityVerificationDesc')}
    //         status="complete"
    //         onPress={handleIdentityVerificationPress}
    //       />

    //       <VerificationItem
    //         icon={
    //           <Location
    //             size={24}
    //             color={getColor('primary.600')}
    //             variant="Outline"
    //           />
    //         }
    //         title={t('addressVerification')}
    //         subtitle={t('addressVerificationDesc')}
    //         status="unverified"
    //         onPress={handleAddressVerificationPress}
    //       />

    //       <VerificationItem
    //         icon={
    //           <Building
    //             size={24}
    //             color={getColor('primary.600')}
    //             variant="Outline"
    //           />
    //         }
    //         title={t('companyVerification')}
    //         subtitle={t('companyVerificationDesc')}
    //         status="pending"
    //         onPress={handleCompanyVerificationPress}
    //       />
    //     </View>
    //   </ScrollView>
    // </ContainerLayout>
    <VerificationScreen />
  );
}
