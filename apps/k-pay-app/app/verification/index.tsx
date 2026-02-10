import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bank,
  ProfileAdd,
  Money,
  ProfileCircle,
  Document,
  CopySuccess,
  Call,
  ArrowRight2,
} from 'iconsax-react-nativejs';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Typography, ReusableButton } from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { useKycStatus } from '@/hooks/api/use-kyc-status';
import { useMe } from '@/hooks/api';
import { router } from 'expo-router';
import { StatusBadge } from '@/components/badge';
import { HeaderWithTitle } from '@/components';
import CountrySelector from '@/components/input';
import { IdentityVerificationImage } from '@/components/svgs';

const ICON_SIZE = 22;

function VerificationScreen() {
  const { t } = useTranslation();
  const { kycApplications, loading } = useKycStatus();
  const { data: userData, loading: loadingUser } = useMe();

  const kycApplicationIsNull =
    kycApplications === null || kycApplications?.length === 0;
  const latestApplication =
    kycApplications && kycApplications.length > 0 ? kycApplications[0] : null;

  const verificationItems = [
    {
      icon: <ProfileCircle size={ICON_SIZE} color="#4F46E5" />,
      title: 'Personal Information',
      description: 'Tell us who you are',
      path: '/verification/personal-info',
      statusKey: 'personalInfoStatus',
    },
    {
      icon: <Bank size={ICON_SIZE} color="#4F46E5" />,
      title: 'Banking Information',
      description: 'Let us bank information',
      path: '/verification/bank-info',
      statusKey: 'bankInfoStatus',
    },
    {
      icon: <Call size={ICON_SIZE} color="#4F46E5" />,
      title: 'Contact Details',
      description: 'Share contact',
      path: '/verification/contact-info',
      statusKey: 'contactInfoStatus',
    },
    {
      icon: <ProfileAdd size={ICON_SIZE} color="#4F46E5" />,
      title: 'Political Exposure (PEP)',
      description: 'Tell us a public office role',
      path: '/verification/political-exposure',
      statusKey: 'politicalExposureStatus',
    },
    {
      icon: <Document size={ICON_SIZE} color="#4F46E5" />,
      title: 'Identity Document',
      description: 'Upload a valid ID',
      path: '/verification/identity-document',
      statusKey: 'identityStatus',
    },
    {
      icon: <Money size={ICON_SIZE} color="#4F46E5" />,
      title: 'Financial Information',
      description: 'Provide your source of funds',
      path: '/verification/financial-info',
      statusKey: 'financialInfoStatus',
    },
    {
      icon: <CopySuccess size={ICON_SIZE} color="#4F46E5" />,
      title: 'Declarations',
      description: 'Confirm and acknowledge',
      path: '/verification/user-declarations',
      statusKey: 'declarationsStatus',
    },
  ];

  const findFirstActionableStep = () => {
    if (!latestApplication) return verificationItems[0].path;
    const firstActionableItem = verificationItems.find((item) => {
      const statusValue =
        latestApplication[item.statusKey as keyof typeof latestApplication];
      return (
        statusValue !== 'processing' &&
        statusValue !== 'approved' &&
        statusValue !== 'completed'
      );
    });

    return firstActionableItem
      ? firstActionableItem.path
      : verificationItems[0].path;
  };

  const getStatusForStep = (stepKey: string) => {
    if (loading || !latestApplication) return 'pending';

    const statusValue =
      latestApplication[stepKey as keyof typeof latestApplication];

    if (statusValue === 'approved' || statusValue === 'completed')
      return 'done';
    if (
      statusValue === 'rejected' ||
      statusValue === 'reject' ||
      statusValue === 'failed'
    )
      return 'failed';
    if (statusValue === 'processing') return 'in-progress';
    if (statusValue === 'pending') return 'pending';
    return 'pending';
  };

  const isStepClickable = (stepKey: string) => {
    if (loading || !latestApplication) return true;

    const statusValue =
      latestApplication[stepKey as keyof typeof latestApplication];
    return (
      statusValue !== 'processing' &&
      statusValue !== 'approved' &&
      statusValue !== 'completed'
    );
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'done':
        return {
          backgroundColor: '#DCFCE7',
          textColor: '#166534',
          text: 'Completed',
        };
      case 'failed':
        return {
          backgroundColor: '#FEE2E2',
          textColor: '#991B1B',
          text: 'Failed',
        };
      case 'in-progress':
        return {
          backgroundColor: '#DBEAFE',
          textColor: '#1E40AF',
          text: 'In Progress',
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          textColor: '#4B5563',
          text: 'Pending',
        };
    }
  };

  if (loading || loadingUser) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (kycApplicationIsNull) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Typography className="text-gray-600 text-center mb-4">
          Unable to load verification status. Please pull down to refresh.
        </Typography>
        <ReusableButton
          text="Reload"
          onPress={() => router.replace('/verification')}
          className="w-[200px]"
        />
      </View>
    );
  }

  return (
    <ScreenContainer useSafeArea={true}>
      <HeaderWithTitle px={6} title="" />

      <View className="items-center my-8">
        <View className="mb-4">
          <IdentityVerificationImage />
        </View>

        <Typography
          variant="h5"
          className="text-gray-900 font-semibold mb-2 text-center"
        >
          Verify your identity
        </Typography>
        <Typography variant="small" className=" text-center px-4 w-[285px]">
          To comply with OHADA and AML/CTF regulations, we need to verify your
          identity.
        </Typography>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <View className="space-y-4">
          {verificationItems.map((item, index) => {
            const isClickable = isStepClickable(item.statusKey);
            const status = getStatusForStep(item.statusKey);
            const statusStyle = getStatusBadgeStyle(status);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => isClickable && router.push(item.path)}
                disabled={!isClickable}
                className={`border rounded-xl p-4 my-2 ${
                  isClickable ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                }`}
                style={{ opacity: isClickable ? 1 : 0.75 }}
              >
                <View className="flex-row gap-3 items-center space-x-3 justify-between">
                  <View
                    className={`p-2 rounded-full ${
                      isClickable ? 'bg-blue-50' : 'bg-gray-100'
                    }`}
                  >
                    {item.icon}
                  </View>
                  {/* 
                  <StatusBadge
                    status={status}
                    showIcon={true}
                    iconPosition="left"
                  /> */}
                  <View className="flex-1">
                    <Typography
                      variant="body"
                      weight="600"
                      className="font-medium text-gray-900"
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="small" className=" text-xs">
                      {isClickable
                        ? item.description
                        : status === 'in-progress'
                          ? 'Pending review'
                          : item.description}
                    </Typography>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View className="p-6 border-t border-gray-100">
        <ReusableButton
          text="Start Verification"
          onPress={() => router.push(findFirstActionableStep())}
          className="bg-red-500 w-full"
          showArrow={true}
        />
      </View>
    </ScreenContainer>
  );
}

export default VerificationScreen;
