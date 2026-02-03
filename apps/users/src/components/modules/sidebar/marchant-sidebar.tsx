import {
  Bill,
  Card,
  CardReceive,
  EmptyWalletAdd,
  Home,
  MoneyChange,
  Setting2,
  Tag2,
  Ticket,
  Wallet,
  Clipboard
} from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
  matchTailingUrl?: boolean;
}

export const useMerchantSidebarMenue = (): SidebarItemProps[] => {
  const { t } = useTranslation();

  return [
    { icon: <Home size="18" variant="Outline" />, label: t('sidebar.dashboard'), href: '/merchant' },
    { icon: <Wallet size="18" variant="Outline" />, label: t('sidebar.wallet'), href: '/wallet' },
    { icon: <EmptyWalletAdd size="18" variant="Outline" />, label: t('sidebar.deposit'), href: '/deposit' },

    // { icon: <Bill size="18" variant="Outline" />, label: t('sidebar.billPayment'), href: '/bill-payment' },
    // { icon: <Card size="18" variant="Outline" />, label: t('sidebar.creditCard'), href: '/credit-card' },
    {
      icon: <CardReceive size="18" variant="Outline" />,
      label: t('sidebar.withdrawals'),
      href: '/withdrawals',
      subItems: [
        { label: t('sidebar.withdrawMoney'), href: '/withdrawals/money' },
        { label: t('sidebar.withdrawList'), href: '/withdrawals/list' }
      ]
    },
    {
      icon: <Tag2 size="18" variant="Outline" />,
      label: t('sidebar.transfer'),
      href: '/transfer',
      subItems: [
        { label: t('sidebar.singleTransfer') || 'Single Transfer', href: '/transfer/single' },
        { label: t('sidebar.bulkTransfer') || 'Bulk Transfer', href: '/transfer/bulk' }
      ]
    },
    { icon: <EmptyWalletAdd size="18" variant="Outline" />, label: 'POS', href: '/merchant/pos' },
    {
      icon: <EmptyWalletAdd size="18" variant="Outline" />,
      label: 'Product/Services',
      href: '/merchant/product-services'
    },
    { icon: <MoneyChange size="18" variant="Outline" />, label: t('sidebar.exchangeMoney'), href: '/exchange' },
    { icon: <Clipboard size="18" variant="Outline" />, label: t('sidebar.transactionHistory'), href: '/transactions' }
  ];
};

export const useBottomOptions = (): SidebarItemProps[] => {
  const { t } = useTranslation();

  return [
    {
      icon: <Ticket size="18" variant="Outline" />,
      label: t('sidebar.ticket'),
      href: '/ticket'
    },
    {
      icon: <Setting2 size="18" variant="Outline" />,
      label: t('sidebar.settings'),
      href: '/settings',
      matchTailingUrl: true
    }
  ];
};

export const menuItems: SidebarItemProps[] = [
  { icon: <Home size="18" variant="Outline" />, label: 'Dashboard', href: '/merchant' },
  { icon: <Wallet size="18" variant="Outline" />, label: 'Wallet', href: '/wallet' },
  { icon: <EmptyWalletAdd size="18" variant="Outline" />, label: 'Deposit', href: '/deposit' },
  { icon: <Bill size="18" variant="Outline" />, label: 'Bill Payment', href: '/bill-payment' },
  { icon: <Card size="18" variant="Outline" />, label: 'Credit Card', href: '/credit-card' },
  {
    icon: <CardReceive size="18" variant="Outline" />,
    label: 'Withdrawals',
    href: '/withdrawals',
    subItems: [
      { label: 'Withdraw Money', href: '/withdrawals/money' },
      { label: 'Withdraw List', href: '/withdrawals/list' },
      { label: 'Beneficiaries', href: '/withdrawals/beneficiaries' }
    ]
  },
  {
    icon: <Tag2 size="18" variant="Outline" />,
    label: 'Transfer',
    href: '/transfer',
    subItems: [
      { label: 'Single Transfer', href: '/transfer/single' },
      { label: 'Multiple Transfer', href: '/transfer/multiple' },
      { label: 'Bulk Transfer', href: '/transfer/bulk' }
    ]
  },
  { icon: <MoneyChange size="18" variant="Outline" />, label: 'Exchange Money', href: '/exchange' }
];

export const bottomOptions = [
  {
    icon: <Setting2 size="18" variant="Outline" />,
    label: 'Settings',
    href: '/settings',
    matchTailingUrl: true
  }
];
