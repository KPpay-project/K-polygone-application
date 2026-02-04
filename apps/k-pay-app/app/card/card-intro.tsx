import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { Typography } from '@/components/ui';
import {
  Flash,
  GlobalRefresh,
  SecuritySafe,
  ArrowRight,
} from 'iconsax-react-nativejs';
import { DebitCard } from '@/components/card/debit-card';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { Link } from 'expo-router';

export default function CardIntro() {
  const data = [
    {
      icon: <Flash size={20} color="#0057FF" />,
      size: 12,
      title: 'Instant Acces',
      description: 'Apply and activate instantly',
    },
    {
      icon: <GlobalRefresh size={20} color="#0057FF" />,
      size: 8,
      title: 'Global Acceptance',
      description: (
        <Typography variant="caption">
          Accepted by{' '}
          <Text className="text-blue-600 font-semibold">50,000 +</Text> online
          merchant including JUMIA, KONGA, NETFLIX, UBER, Wallet Funding and
          others
        </Typography>
      ),
    },
    {
      icon: <SecuritySafe size={20} color="#0057FF" />,
      size: 8,
      title: 'Security',
      description: (
        <Typography variant="caption">
          <Typography weight="600" className="!text-blue-600" variant="caption">
            Heavily
          </Typography>{' '}
          secure
        </Typography>
      ),
    },
  ];
  return (
    <ScreenContainer useSafeArea={true}>
      <View className="px-6 py-4">
        <Typography variant="h5" className="text-gray-900 font-bold">
          Kpay Cards
        </Typography>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="flex-1  h-[70vh]  justify-between">
          <View>
            <DebitCard />

            <View className="mt-10 space-y-6 px-6 gap-6 w-[90%]">
              {data.map((item, idx) => (
                <View
                  key={idx}
                  className="flex-row items-start space-x-4 gap-3"
                >
                  <View
                    className={`w-12 h-12 rounded-full bg-blue-50 justify-center items-center`}
                  >
                    {item.icon}
                  </View>
                  <View className="flex-1">
                    <Typography weight="600">{item.title}</Typography>
                    <Typography variant="caption">
                      {item.description}
                    </Typography>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View className="px-4 ">
            <Link href={'/card/create-card'} asChild>
              <ReusableButton>
                <Typography color="white" weight="500">
                  Create my virtual card
                </Typography>
                <ArrowRight color="#fff" />
              </ReusableButton>
            </Link>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
