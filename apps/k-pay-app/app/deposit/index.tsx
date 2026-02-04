import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import { Bank, Convert, Mobile } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@/components/ui';
import { useTranslation } from 'react-i18next';
import { StatusScreen } from '@/components/fallbacks/status-screen';

export default function AddMoneyPage() {
  const { t } = useTranslation();

  const data = [
    {
      icon: <Bank size={20} color="#0057FF" />,
      title: 'Add via Bank transfer',
      description:
        'Fund your account by sending money to your unique NG bank account',
      path: '/deposit/via-bank',
    },
    // {
    //   icon: <Convert size={20} color="#0057FF" />,
    //   title: 'Add via conversion',
    //   description: 'Send to a mobile money wallet instantly',
    //   path: '/deposit/via-conversion',
    // },
    {
      icon: <Mobile size={20} color="#0057FF" />,
      title: 'Add via M-Pesa',
      description: 'Deposit to our partner merchant',
      path: '/deposit/via-mpesa',
    },
    {
      icon: <Mobile size={20} color="#0057FF" />,
      title: 'Add via MTN Momo',
      description: 'Deposit to our partner merchant',
      path: '/deposit/via-mtn-momo',
    },
    {
      icon: <Mobile size={20} color="#0057FF" />,
      title: 'Add via Airtel',
      description: 'Deposit to our partner merchant',
      path: '/deposit/via-airtel',
    },
    {
      icon: <Mobile size={20} color="#0057FF" />,
      title: 'Add via Orange',
      description: 'Deposit to our partner merchant',
      path: '/deposit/via-orange',
    },
  ];

  return (
    <ScreenContainer useSafeArea={true} paddingHorizontal={15}>
      <HeaderWithTitle
        title={t('addMoney')}
        description={t('addMoneyModeQuestion')}
      />

      <View className={'mt-1'}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.path)}
            className="flex-row items-center my-3 py-6 bg-gray-100/60 rounded-2xl p-4 mb-2"
          >
            <View
              className="w-[44px] h-[44px]
                bg-blue-100 rounded-full items-center justify-center mr-4"
            >
              {item.icon}
            </View>
            <View>
              <Typography
                variant="body"
                weight="semiBold"
                className="text-black text-sm "
              >
                {item.title}
              </Typography>
              <View className="w-[85%] mt-1">
                <Typography variant="caption" className="text-gray-600">
                  {item.description}
                </Typography>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}
