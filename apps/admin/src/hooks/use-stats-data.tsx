import { ReactNode } from 'react';
import { TotalIcon, SuccessIcon, FailedIcon, PendingIcon } from '@/components/modules/stat-card/stat-icons';
import React from 'react';

export type StatCardData = {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorScheme: 'blue' | 'green' | 'red' | 'yellow';
};

export type StatIcons = {
  total?: ReactNode;
  successful?: ReactNode;
  failed?: ReactNode;
  pending?: ReactNode;
};

export type StatCategory = 'deposit' | 'withdrawal' | 'transaction' | 'transfer' | 'user';

export const useStatsData = (category: StatCategory, data?: Record<string, any>, customIcons?: StatIcons) => {
  const defaultValue = '0';

  const icons = {
    total: customIcons?.total || <TotalIcon />,
    successful: customIcons?.successful || <SuccessIcon />,
    failed: customIcons?.failed || <FailedIcon />,
    pending: customIcons?.pending || <PendingIcon />
  };

  const statsMap: Record<StatCategory, StatCardData[]> = {
    deposit: [
      { title: 'Total deposit', value: data?.total || defaultValue, icon: icons.total, colorScheme: 'blue' },
      {
        title: 'Successful deposits',
        value: data?.successful || defaultValue,
        icon: icons.successful,
        colorScheme: 'green'
      },
      { title: 'Failed deposits', value: data?.failed || defaultValue, icon: icons.failed, colorScheme: 'red' },
      { title: 'Pending deposits', value: data?.pending || defaultValue, icon: icons.pending, colorScheme: 'yellow' }
    ],
    withdrawal: [
      { title: 'Total withdrawal', value: data?.total || defaultValue, icon: icons.total, colorScheme: 'blue' },
      {
        title: 'Successful withdrawals',
        value: data?.successful || defaultValue,
        icon: icons.successful,
        colorScheme: 'green'
      },
      { title: 'Failed withdrawals', value: data?.failed || defaultValue, icon: icons.failed, colorScheme: 'red' },
      { title: 'Pending withdrawals', value: data?.pending || defaultValue, icon: icons.pending, colorScheme: 'yellow' }
    ],
    transaction: [
      { title: 'Total transactions', value: data?.total || defaultValue, icon: icons.total, colorScheme: 'blue' },
      {
        title: 'Successful transactions',
        value: data?.successful || defaultValue,
        icon: icons.successful,
        colorScheme: 'green'
      },
      { title: 'Failed transactions', value: data?.failed || defaultValue, icon: icons.failed, colorScheme: 'red' },
      {
        title: 'Pending transactions',
        value: data?.pending || defaultValue,
        icon: icons.pending,
        colorScheme: 'yellow'
      }
    ],
    transfer: [
      { title: 'Total transfer', value: data?.total || defaultValue, icon: icons.total, colorScheme: 'blue' },
      {
        title: 'Successful transfers',
        value: data?.successful || defaultValue,
        icon: icons.successful,
        colorScheme: 'green'
      },
      { title: 'Failed transfers', value: data?.failed || defaultValue, icon: icons.failed, colorScheme: 'red' },
      { title: 'Pending transfers', value: data?.pending || defaultValue, icon: icons.pending, colorScheme: 'yellow' }
    ],
    user: [
      { title: 'Total users', value: data?.total || defaultValue, icon: icons.total, colorScheme: 'blue' },
      { title: 'Active users', value: data?.active || defaultValue, icon: icons.successful, colorScheme: 'green' },
      { title: 'Inactive users', value: data?.inactive || defaultValue, icon: icons.failed, colorScheme: 'red' },
      { title: 'New users', value: data?.new || defaultValue, icon: icons.pending, colorScheme: 'yellow' }
    ]
  };

  return statsMap[category];
};
