import { router } from 'expo-router';
import type { BillOption } from '../types';

export const getBillOptions = (): BillOption[] => [
  {
    id: 'airtime',
    title: 'Airtime',
    subtitle: 'Buy airtime smoothly at anytime',
    iconColor: '#3B82F6',
    onPress: () => router.push('/airtime'),
  },
  {
    id: 'electricity',
    title: 'Electricity',
    subtitle: 'Buy Electricity smoothly at anytime',
    iconColor: '#EF4444',
    onPress: () => router.push('/electricity'),
  },
  {
    id: 'betting',
    title: 'Betting',
    subtitle: 'Place bets smoothly at anytime',
    iconColor: '#8B5CF6',
    onPress: () => router.push('/betting'),
  },
  {
    id: 'data',
    title: 'Data',
    subtitle: 'Buy Data smoothly at anytime',
    iconColor: '#F59E0B',
    onPress: () => console.log('Data pressed'),
  },
  {
    id: 'cable-tv',
    title: 'Cable TV',
    subtitle: 'Buy airtime smoothly at anytime',
    iconColor: '#10B981',
    onPress: () => console.log('Cable TV pressed'),
  },
];

// Default export required by Expo Router
export default function BillsAndPaymentData() {
  return null;
}
