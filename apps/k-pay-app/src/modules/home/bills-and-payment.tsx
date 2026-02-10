import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { Typography, BillItem } from '@/components/ui';
import { Mobile, Wifi, Electricity, MoreSquare } from 'iconsax-react-nativejs';

interface BillItemConfig {
  icon: React.ReactNode;
  title: string;
  backgroundColor: string;
  textColor: string;
  onPress: () => void;
}

export default function BillsAndPayment() {
  const { t } = useTranslation();

  const billItems: BillItemConfig[] = [
    {
      icon: <Mobile size={20} color="#3B82F6" variant="Outline" />,
      title: t('airtime'),
      backgroundColor: 'bg-blue-100/60',
      textColor: 'text-blue-600',
      onPress: () => router.push('/airtime'),
    },
    {
      icon: <Electricity size={20} color="#EF4444" variant="Outline" />,
      title: t('electricity'),
      backgroundColor: 'bg-[#FFF5F4]',
      textColor: 'text-red-500',
      onPress: () => router.push('/electricity'),
    },
    // {
    //   icon: <ToggleOn size={20} color="#8B5CF6" variant="Outline" />,
    //   title: t('betting'),
    //   backgroundColor: 'bg-[#FBF7FF]',
    //   textColor: 'text-purple-600',
    //   onPress: () => router.push('/betting'),
    // },
    {
      icon: <Wifi size={20} color="#F59E0B" variant="Outline" />,
      title: t('data'),
      backgroundColor: 'bg-[#FFF9F4]',
      textColor: 'text-orange-500',
      onPress: () => console.log('Data pressed'),
    },
    {
      icon: <MoreSquare size={20} color="#10B981" variant="Outline" />,
      title: t('more'),
      backgroundColor: 'bg-green-100/50',
      textColor: 'text-green-600',
      onPress: () => router.push('/bills-and-payment'),
    },
  ];
  return (
    <View className="px-6 mb-6">
      <Typography variant="body" className="text-gray-900 mb-4" weight="500">
        {!t('billsAndPayment') || 'Bills and Payment'}
      </Typography>
      <View className="flex-row justify-between gap-6">
        {billItems.map((item, index) => (
          <BillItem
            key={`${item.title}-${index}`}
            icon={item.icon}
            title={item.title}
            backgroundColor={item.backgroundColor}
            textColor={item.textColor}
            onPress={item.onPress}
          />
        ))}
      </View>
    </View>
  );
}
