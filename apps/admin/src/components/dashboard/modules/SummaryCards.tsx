import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, ProfileRemove } from 'iconsax-reactjs';
import { ReactNode, useState } from 'react';
import { AdminDashboardStats } from '@/hooks/api/use-dashboard-stats';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Typography, CountrySelector, Skeleton, ModularCard } from '@repo/ui';

const COUNTRY_OPTIONS = [
  { code: 'ALL', name: 'All', flag: '🌍', prefix: '' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', prefix: '+234' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', prefix: '+229' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', prefix: '+221' }
];

type CardData = {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend: {
    icon: ReactNode;
    value: string;
    isPositive: boolean;
  };
  isHighlighted?: boolean;
};

export default function SummaryCards({ stats, loading }: { stats?: AdminDashboardStats; loading?: boolean }) {
  const pct = (n?: number) => (typeof n === 'number' ? `${Math.abs(n)}%` : '0%');
  const up = <ArrowUp className="w-3 h-3 mr-1 text-green-500" />;
  const down = <ArrowDown className="w-3 h-3 mr-1 text-red-500" />;
  const formatCurrency = (value: number | string | undefined, currency: string = 'USD') => {
    const num = typeof value === 'string' ? parseFloat(value) : typeof value === 'number' ? value : 0;
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(
        isFinite(num) ? num : 0
      );
    } catch {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(
        isFinite(num) ? num : 0
      );
    }
  };

  type MetricKey =
    | 'totalUsers'
    | 'totalMerchants'
    | 'totalWallets'
    | 'totalKycApplications'
    | 'kycApplicationsByStatus'
    | 'totalDeposit'
    | 'totalWithdrawal'
    | 'totalTransfer';

  const metricsConfig: {
    key: MetricKey;
    title: string;
    money?: boolean;
    hasChange?: boolean;
    highlighted?: boolean;
    path?: string;
  }[] = [
    { key: 'totalUsers', title: 'Total Users', hasChange: true, highlighted: true, path: '/dashboard/user/lists' },
    { key: 'totalMerchants', title: 'Total Merchants', hasChange: true, path: '/dashboard/user/marchant' },
    { key: 'totalWallets', title: 'Total Wallets', hasChange: true, path: '/dashboard/wallets' },
    {
      key: 'totalKycApplications',
      title: 'Total KYC Applications',
      hasChange: true,
      path: '/dashboard/verifications'
    },
    { key: 'kycApplicationsByStatus', title: 'Pending KYC', path: '/dashboard/kyc-applications?status=pending' },
    {
      key: 'totalDeposit',
      title: 'Total Deposit',
      money: true,
      hasChange: true,
      path: '/dashboard/transaction/deposit'
    },
    {
      key: 'totalWithdrawal',
      title: 'Total Withdrawal',
      money: true,
      hasChange: true,
      path: '/dashboard/transaction/withdrawal'
    },
    {
      key: 'totalTransfer',
      title: 'Total Transfer',
      money: true,
      hasChange: true,
      path: '/dashboard/transaction/transfer'
    }
  ];

  const search = useSearch({ from: '/dashboard/' });
  const navigate = useNavigate();
  const selectedCountry = (search as any).filter || 'ALL';

  const handleCountryChange = (_: string, country: any) => {
    navigate({
      to: '.',
      search: (prev: any) => ({ ...prev, filter: country.code })
    });
  };

  const allMetricsCards: CardData[] = metricsConfig.map(({ key, title, money, hasChange, highlighted }) => {
    const raw = (stats as any)?.[key];
    const total = hasChange ? (raw?.total ?? 0) : (raw ?? 0);
    const value = money ? formatCurrency(total, 'USD') : total;
    const change = hasChange ? (raw?.percentageChange as number | undefined) : 0;
    const isPositive = (change ?? 0) >= 0;
    return {
      title,
      value,
      icon: <ProfileRemove size={30} color={`${highlighted ? 'white' : 'blue'}`} />,
      trend: {
        icon: isPositive ? up : down,
        value: pct(change),
        isPositive
      },
      isHighlighted: !!highlighted
    } as CardData;
  });

  const renderCard = (card: CardData, idx: number) => {
    const isHighlighted = card.isHighlighted;
    const { isPositive } = card.trend;

    const path = metricsConfig[idx]?.path;
    return (
      <motion.div
        key={card.title}
        onClick={() => path && navigate({ to: path })}
        className="cursor-pointer "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
        transition={{ duration: 0.3, delay: idx * 0.05 }}
      >
        <Card className={`${isHighlighted ? 'bg-blue-700 text-white border-0' : ''} shadow-none w-full h-full`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-[40px] h-[40px] 
                ${!isHighlighted ? 'bg-blue-100/80' : 'bg-white'}
                flex items-center px-3 rounded-lg `}
              >
                {card.icon}
              </div>
              <CardTitle className={`text-sm font-medium ${isHighlighted ? 'opacity-90' : ''}`}>{card.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold mb-2">{card.value}</div>
            <div className={`flex items-center text-xs ${isHighlighted ? '' : 'text-gray-600'}`}>
              <span
                className={`
                  flex items-center
                    ${
                      isHighlighted
                        ? 'bg-white/20 px-1.5 py-0.5 rounded text-xs mr-2'
                        : isPositive
                          ? 'bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full text-xs mr-2'
                          : 'bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-xs mr-2'
                    }
                  `}
              >
                {card.trend.icon}
                {card.trend.value}
              </span>
              <span className={isHighlighted ? 'opacity-90' : ''}>This Month</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderSkeleton = (idx: number) => (
    <div key={idx} className="w-full h-full">
      <Card className="shadow-none w-full h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-[40px] h-[40px] rounded-lg" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[120px] mb-2" />
          <div className="flex items-center">
            <Skeleton className="h-5 w-[80px] rounded-full mr-2" />
            <Skeleton className="h-4 w-[60px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ModularCard>
      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h6" className="font-medium">
          Dashboard
        </Typography>
        <div className="w-[200px]">
          <CountrySelector
            countries={COUNTRY_OPTIONS}
            value={selectedCountry}
            onValueChange={handleCountryChange}
            placeholder="Select Country"
            showPrefix={false}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: metricsConfig.length }).map((_, idx) => renderSkeleton(idx))
          : allMetricsCards.map(renderCard)}
      </div>
    </ModularCard>
  );
}
