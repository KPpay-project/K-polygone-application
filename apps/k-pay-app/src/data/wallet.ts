import { Wallet, Transaction } from '@/types/wallet';

export const wallets: Wallet[] = [
  {
    id: '1',
    name: 'West African CFA franc',
    code: 'XOF',
    balance: '0 XOF',
    icon: 'F',
    color: '#3B82F6',
  },
  {
    id: '2',
    name: 'Nigerian Naira',
    code: 'NGN',
    balance: '0 NGN',
    icon: '₦',
    color: '#22C55E',
  },
  {
    id: '3',
    name: 'Zambian Kwacha',
    code: 'ZMW',
    balance: '0 ZMW',
    icon: 'Z',
    color: '#F59E0B',
  },
  {
    id: '4',
    name: 'United State Dollar',
    code: 'USD',
    balance: '$1000',
    icon: '$',
    color: '#10B981',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Uber',
    amount: '-$55.00',
    time: 'Today, 8:00 AM',
    icon: 'Uber',
    type: 'expense',
  },
  {
    id: '2',
    name: 'Amazon',
    amount: '-$55.00',
    time: 'Today, 8:00 AM',
    icon: 'a',
    type: 'expense',
  },
  {
    id: '3',
    name: 'PayPal',
    amount: '-$55.00',
    time: 'Today, 8:00 AM',
    icon: 'P',
    type: 'expense',
  },
];
