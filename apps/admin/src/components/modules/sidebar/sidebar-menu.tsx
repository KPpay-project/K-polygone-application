import { useTranslation } from 'react-i18next';
import {
  Home,
  Profile2User,
  Wallet,
  DocumentText,
  ShieldSecurity,
  CardAdd,
  DocumentFilter,
  Setting2,
  Activity,
  Verify,
  Headphone,
  HierarchySquare,
  Bill,
  Money
} from 'iconsax-reactjs';

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
    { icon: <Home size="18" variant="Outline" />, label: t('common.dashboard'), href: '/dashboard' },
    {
      icon: <Profile2User size="18" variant="Outline" />,
      label: t('common.user'),
      href: '/dashboard/user',
      subItems: [
        { label: t('common.userList'), href: '/dashboard/user/lists' },
        { label: t('common.admin'), href: '/dashboard/user/admin' },
        { label: t('common.marchant'), href: '/dashboard/user/marchant' }
      ]
    },
    { icon: <Wallet size="18" variant="Outline" />, label: t('common.wallet'), href: '/dashboard/wallet' },
    {
      icon: <DocumentText size="18" variant="Outline" />,
      label: t('common.transactionLabel'),
      href: '/dashboard/transaction',
      subItems: [
        { label: t('common.allTransactions'), href: '/dashboard/transaction/all' },
        { label: t('common.deposit'), href: '/dashboard/transaction/deposit' },
        { label: t('common.withdrawal'), href: '/dashboard/transaction/withdrawal' },
        // { label: t('common.requestPayment'), href: '/dashboard/transaction/request-payment' },
        // { label: t('common.exchange'), href: '/dashboard/transaction/exchange' },
        { label: t('common.transfer'), href: '/dashboard/transaction/transfer' }
      ]
    },
    {
      icon: <ShieldSecurity size="18" variant="Outline" />,
      label: t('common.billPayment'),
      href: '/dashboard/bill-payment'
    },
    { icon: <CardAdd size="18" variant="Outline" />, label: t('common.creditCard'), href: '/dashboard/credit-card' },
    { icon: <DocumentFilter size="18" variant="Outline" />, label: t('common.report'), href: '/dashboard/report' },
    { icon: <Setting2 size="18" variant="Outline" />, label: t('common.settings'), href: '/dashboard/settings' }
  ];
};

export const useBottomOptions = (): SidebarItemProps[] => {
  const { t } = useTranslation();

  return [
    {
      icon: <Setting2 size="18" variant="Outline" />,
      label: t('sidebar.settings'),
      href: '/dashboard/settings',
      matchTailingUrl: true
    }
  ];
};

export const useStaticMenuItems = (): SidebarItemProps[] => {
  const { t } = useTranslation();

  return [
    { icon: <Home size="18" variant="Outline" />, label: t('common.dashboard'), href: '/dashboard' },
    {
      icon: <Profile2User size="18" variant="Outline" />,
      label: t('common.user'),
      href: '/dashboard/user',
      subItems: [
        { label: t('common.userList'), href: '/dashboard/user/lists' },
        { label: t('common.admin'), href: '/dashboard/user/admin' },
        { label: t('common.marchant'), href: '/dashboard/user/marchant' }
      ]
    },

    {
      icon: <DocumentText size="18" variant="Outline" />,
      label: t('common.transactionLabel'),
      href: '/dashboard/transaction',
      subItems: [
        { label: t('common.allTransactions'), href: '/dashboard/transaction/all' },
        { label: t('common.deposit'), href: '/dashboard/transaction/deposit' },
        { label: t('common.withdrawal'), href: '/dashboard/transaction/withdrawal' },
        // { label: t('common.requestPayment'), href: '/dashboard/transaction/request-payment' },
        // { label: t('common.exchange'), href: '/dashboard/transaction/exchange' },
        { label: t('common.transfer'), href: '/dashboard/transaction/transfer' }
      ]
    },
    { icon: <Activity size="18" variant="Outline" />, label: 'Activity Log', href: '/dashboard/activity-log' },
    { icon: <Headphone size="18" variant="Outline" />, label: 'Dispute', href: '/dashboard/dispute' },
    { icon: <Verify size="18" variant="Outline" />, label: 'Verifications', href: '/dashboard/verifications' },
    { icon: <HierarchySquare size="18" variant="Outline" />, label: 'MNOs', href: '/dashboard/mnos' },
    { icon: <Money size="18" variant="Outline" />, label: 'Currency', href: '/dashboard/currency' },
    {
      icon: <Bill size="18" variant="Outline" />,
      label: 'Bills',
      href: '/dashboard/bills',
      subItems: [
        { label: 'Biller', href: '/dashboard/bills/biller' },
        { label: 'Bill Payment', href: '/dashboard/bills/bill-payment' }
      ]
    },
    { icon: <Setting2 size="18" variant="Outline" />, label: 'Settings', href: '/dashboard/settings' }
  ];
};

export const menuItems: SidebarItemProps[] = [
  { icon: <Home size="18" variant="Outline" />, label: 'Dashboard', href: '/dashboard' },
  {
    icon: <Profile2User size="18" variant="Outline" />,
    label: 'User',
    href: '/dashboard/user',
    subItems: [
      { label: 'User List', href: '/dashboard/user/lists' },
      { label: 'Admin', href: '/dashboard/admin' },
      { label: 'Marchants', href: '/dashboard/marchant' }
    ]
  },
  { icon: <Wallet size="18" variant="Outline" />, label: 'Wallet', href: '/dashboard/wallet' },
  {
    icon: <DocumentText size="18" variant="Outline" />,
    label: 'Transaction',
    href: '/dashboard/transaction',
    subItems: [
      { label: 'All Transactions', href: '/dashboard/transaction/all' },
      { label: 'Deposit', href: '/dashboard/transaction/deposit' },
      { label: 'Withdrawal', href: '/dashboard/transaction/withdrawal' },
      // { label: 'Request Payment', href: '/dashboard/transaction/request-payment' },
      // { label: 'Exchange', href: '/dashboard/transaction/exchange' },
      { label: 'Transfer', href: '/dashboard/transaction/transfer' }
    ]
  },
  { icon: <ShieldSecurity size="18" variant="Outline" />, label: 'Bill Payment', href: '/dashboard/bill-payment' },
  { icon: <CardAdd size="18" variant="Outline" />, label: 'Credit Card', href: '/dashboard/credit-card' }
  // { icon: <DocumentFilter size="18" variant="Outline" />, label: 'Report', href: '/dashboard/report' },
  // { icon: <Setting2 size="18" variant="Outline" />, label: 'Settings', href: '/dashboard/settings' }
];
