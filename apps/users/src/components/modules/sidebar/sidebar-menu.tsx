import {
  Bill,
  Card,
  CardReceive,
  EmptyWalletAdd,
  Home,
  MoneyChange,
  Profile2User,
  Setting2,
  Tag2,
  Ticket,
  Wallet
} from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
  matchTailingUrl?: boolean;
}

export const useMenuItems = (): SidebarItemProps[] => {
  const { t } = useTranslation();

  return [
    { icon: <Home size="18" variant="Outline" />, label: t('sidebar.dashboard'), href: '/dashboard' },
    { icon: <Wallet size="18" variant="Outline" />, label: t('sidebar.wallet'), href: '/wallet' },

    {
      icon: <Profile2User size={18} variant="Outline" />,
      label: t('sidebar.beneficiaries'),
      href: '/dashboard/beneficiaries',
      subItems: [
        { label: 'Bank Transfer', href: '/dashboard/beneficiaries?type=BANK' },
        { label: 'KPay User', href: '/dashboard/beneficiaries?type=WALLET_CODE' },
        { label: 'Mobile Money', href: '/dashboard/beneficiaries?type=MOBILE_MONEY' },
        { label: 'Airtime', href: '/dashboard/beneficiaries?type=AIRTIME' }
      ]
    },

    { icon: <EmptyWalletAdd size="18" variant="Outline" />, label: t('sidebar.deposit'), href: '/deposit' },
    { icon: <MoneyChange size="18" variant="Outline" />, label: 'Transfer', href: '/transfer/single' },

    {
      icon: <CardReceive size="18" variant="Outline" />,
      label: t('sidebar.withdrawals'),
      href: '/withdrawals',
      subItems: [{ label: t('sidebar.withdrawMoney'), href: '/withdrawals/money' }]
    },

    { icon: <Bill size="18" variant="Outline" />, label: t('sidebar.billPayment'), href: '/bill-payment' },
    { icon: <Card size="18" variant="Outline" />, label: t('sidebar.creditCard'), href: '/credit-card' },

    // {
    //   icon: <Tag2 size="18" variant="Outline" />,
    //   label: t('sidebar.transfer'),
    //   href: '/transfer',
    //   subItems: [
    //     { label: t('sidebar.singleTransfer') || 'Single Transfer', href: '/transfer/single' }
    //     // { label: t('sidebar.multipleTransfer') || 'Multiple Transfer', href: '/transfer/multiple' },
    //     // { label: t('sidebar.bulkTransfer') || 'Bulk Transfer', href: '/transfer/bulk' }
    //   ]
    // },

    { icon: <MoneyChange size="18" variant="Outline" />, label: t('sidebar.exchangeMoney'), href: '/exchange' }
    // { icon: <Clipboard size="18" variant="Outline" />, label: t('sidebar.transactionHistory'), href: '/transactions' }
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
  { icon: <Home size="18" variant="Outline" />, label: 'Dashboard', href: '/dashboard' },
  { icon: <Wallet size="18" variant="Outline" />, label: 'Wallet', href: '/wallet' },
  { icon: <EmptyWalletAdd size="18" variant="Outline" />, label: 'Deposit', href: '/deposit' },
  { icon: <Bill size="18" variant="Outline" />, label: 'Bill Payment', href: '/bill-payment' },
  { icon: <Card size="18" variant="Outline" />, label: 'Credit Card', href: '/credit-card' },
  {
    icon: <Profile2User size={18} variant="Outline" />,
    label: 'Beneficiaries',
    href: '/dashboard/beneficiaries',
    subItems: [
      { label: 'Bank Transfer', href: '/dashboard/beneficiaries?type=BANK' },
      { label: 'KPay User', href: '/dashboard/beneficiaries?type=WALLET_CODE' },
      { label: 'Mobile Money', href: '/dashboard/beneficiaries?type=MOBILE_MONEY' },
      { label: 'Airtime', href: '/dashboard/beneficiaries?type=AIRTIME' }
    ]
  },
  {
    icon: <CardReceive size="18" variant="Outline" />,
    label: 'Withdrawals',
    href: '/withdrawals',
    subItems: [{ label: 'Withdraw Money', href: '/withdrawals/money' }]
  },
  {
    icon: <Tag2 size="18" variant="Outline" />,
    label: 'Transfer',
    href: '/transfer',
    subItems: [
      { label: 'Single Transfer', href: '/transfer/single' },
      // { label: 'Multiple Transfer', href: '/transfer/multiple' },
      { label: 'Bulk Transfer', href: '/transfer/bulk' }
    ]
  },
  { icon: <MoneyChange size="18" variant="Outline" />, label: 'Exchange Money', href: '/exchange' }
  // { icon: <Clipboard size="18" variant="Outline" />, label: 'Transaction History', href: '/transactions' }
];

export const bottomOptions = [
  // {
  //   icon: <Ticket size="18" variant="Outline" />,
  //   label: 'Ticket',
  //   href: '/tickets'
  // },
  {
    icon: <Setting2 size="18" variant="Outline" />,
    label: 'Settings',
    href: '/settings',
    matchTailingUrl: true
  }
];
