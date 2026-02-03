import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import { CurrencySelectorModal } from '@/components/ui/currency-selector-modal';
import { StatusBadge, StatusType } from '@/components/ui/status-badge';
import { LogoutModal } from '@/components/ui/logout-modal/logout-modal';
import {
  User,
  Global,
  Shield,
  Lock,
  SecuritySafe,
  Eye,
  Notification,
  Call,
  Star1,
  ArrowRight2,
  Ticket2,
} from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useTranslation } from 'react-i18next';
import { getSpacing, getColor } from '@/theme';
import { HeaderWithTitle } from '@/components';

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  rightComponent?: React.ReactNode;
  onPress: () => void;
  showArrow?: boolean;
  textColor?: string;
  iconBgColor?: string;
  isDestructive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  textColor,
  iconBgColor = '#F3F4F6',
  badge,
  rightComponent,
  isDestructive = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: getSpacing('lg'),
        paddingHorizontal: getSpacing('md'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
      }}
      activeOpacity={0.6}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: iconBgColor,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          {icon}
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Typography
              variant="body"
              weight="medium"
              color={textColor || (isDestructive ? '#EF4444' : '#111827')}
            >
              {title}
            </Typography>

            {rightComponent ||
              (badge && (
                <View
                  style={{
                    backgroundColor:
                      badge === 'unverified' ? '#FEE2E2' : '#3B82F6',
                    borderRadius: 16,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                  }}
                >
                  <Typography
                    variant="caption"
                    weight="bold"
                    color={badge === 'unverified' ? '#DC2626' : '#FFFFFF'}
                  >
                    {badge}
                  </Typography>
                </View>
              ))}
          </View>

          {subtitle && (
            <Typography
              variant="caption"
              color="#6B7280"
              style={{ marginTop: 4 }}
            >
              {subtitle}
            </Typography>
          )}
        </View>
      </View>

      {showArrow && (
        <ArrowRight2 size={20} color={getColor('gray.400')} variant="Outline" />
      )}
    </TouchableOpacity>
  );
};

const TWO_FACTOR_AUTH_STATUS_KEY = '@kpay_2fa_status';

export default function MoreScreen() {
  const { t, ready } = useTranslation();
  const { logout } = useAuth();
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [verificationStatus] = useState<StatusType>('unverified');
  const [twoFactorAuth, setTwoFactorAuth] = useState<'on' | 'off'>('off');

  const translate = (key: string) => (ready ? t(key) : key);

  useEffect(() => {
    (async () => {
      const status = await AsyncStorage.getItem(TWO_FACTOR_AUTH_STATUS_KEY);
      setTwoFactorAuth(status === 'on' ? 'on' : 'off');
    })();
  }, []);

  const handleCurrencySelect = async (currency: any) => {
    await setSelectedCurrency(currency.code);
    setShowCurrencyModal(false);
  };

  return (
    <ScreenContainer useSafeArea className="bg-gray-50">
      <HeaderWithTitle title={translate('more')} px={8} />

      <TouchableWithoutFeedback>
        <ScrollView
          style={{ flex: 1, paddingHorizontal: getSpacing('xl') }}
          showsVerticalScrollIndicator={false}
        >
          <Section title="account">
            <MenuItem
              icon={<User size={20} color={getColor('primary.600')} />}
              title={translate('profile')}
              onPress={() => router.push('/profile')}
              iconBgColor="#DBEAFE"
              showArrow={false}
            />

            <MenuItem
              icon={<Global size={20} color={getColor('primary.600')} />}
              title={translate('defaultCurrency')}
              badge={selectedCurrency}
              onPress={() => setShowCurrencyModal(true)}
              iconBgColor="#DBEAFE"
            />

            <MenuItem
              icon={<Shield size={20} color={getColor('error.500')} />}
              title={translate('accountVerification')}
              rightComponent={
                <StatusBadge status={verificationStatus} size="sm" />
              }
              onPress={() => router.push('/account-verification')}
              iconBgColor="#FEE2E2"
              showArrow={false}
            />

            <MenuItem
              icon={<Ticket2 size={20} color={getColor('error.500')} />}
              title={'Tickets'}
              // rightComponent={<StatusBadge status={verificationStatus} size="sm" />}
              onPress={() => router.push('/ticket')}
              iconBgColor="#FEE2E2"
            />
          </Section>

          <Section title="security">
            <MenuItem
              icon={<Lock size={20} color={getColor('gray.600')} />}
              title={translate('changePassword')}
              onPress={() => {}}
              showArrow={false}
            />
            {/* 
            <MenuItem
              icon={<SecuritySafe size={20} color={getColor('gray.600')} />}
              title={translate('twoFactorAuthentication')}
              badge={twoFactorAuth}
              onPress={() => router.push('/two-factor-auth')}
            /> */}

            {/* <MenuItem
              icon={<Eye size={20} color={getColor('gray.600')} />}
              title={translate('deviceAndSessions')}
              onPress={() => router.push('/device-sessions')}
            /> */}

            {/* <MenuItem
              icon={<Lock size={20} color={getColor('gray.600')} />}
              title={translate('changePin')}
              onPress={() => router.push('/change-pin-intro')}
              showArrow={false}
            /> */}

            {/* <MenuItem
              icon={<Notification size={20} color={getColor('gray.600')} />}
              title={translate('notifications')}
              onPress={() => router.push('/notifications')}
              showArrow={false}
            /> */}
          </Section>

          {/* <Section title="general">
            <MenuItem
              icon={<Global size={20} color={getColor('gray.600')} />}
              title={translate('appLanguage')}
              onPress={() => router.push('/app-language')}
              showArrow={false}
            />

            <MenuItem
              icon={<Call size={20} color={getColor('gray.600')} />}
              title={translate('talkToSupport')}
              onPress={() => { }}
              showArrow={false}
            />

            <MenuItem
              icon={<Star1 size={20} color={getColor('gray.600')} />}
              title={translate('ourRate')}
              onPress={() => router.push('/our-rates')}
              showArrow={false}
            />
          </Section> */}

          <View
            style={{ alignItems: 'center', marginBottom: getSpacing('6xl') }}
          >
            <TouchableOpacity onPress={() => setShowLogoutModal(true)}>
              <Typography
                variant="body"
                weight="semibold"
                color={getColor('error.500')}
              >
                {translate('logoutAccount')}
              </Typography>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <CurrencySelectorModal
        visible={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        selectedCurrency={selectedCurrency}
        onCurrencySelect={handleCurrencySelect}
      />

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={logout}
      />
    </ScreenContainer>
  );
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={{ marginBottom: getSpacing('xl') }}>
    <Typography
      variant="h5"
      weight="500"
      color="#111827"
      style={{ marginBottom: 16 }}
    >
      {title}
    </Typography>

    <View
      style={{
        backgroundColor: getColor('gray.100'),
        borderRadius: 16,
        paddingVertical: getSpacing('xs'),
      }}
    >
      {children}
    </View>
  </View>
);
