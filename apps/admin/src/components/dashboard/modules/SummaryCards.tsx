import { ArrowDown, ArrowUp } from 'iconsax-reactjs';
import { ReactNode } from 'react';
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
  trend: {
    icon: ReactNode;
    value: string;
    rawValue: number;
    isPositive: boolean;
  };
  hasChange?: boolean;
};

export default function SummaryCards({ stats, loading }: { stats?: AdminDashboardStats; loading?: boolean }) {
  const pct = (n?: number) => (typeof n === 'number' ? `${Math.abs(n).toFixed(2)}%` : '0.00%');
  const up = <ArrowUp className="h-3.5 w-3.5" />;
  const down = <ArrowDown className="h-3.5 w-3.5" />;

  const calculateChange = (value: unknown) => {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  };

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
    path?: string;
  }[] = [
    { key: 'totalUsers', title: 'Users', hasChange: true, path: '/dashboard/user/lists' },
    { key: 'totalMerchants', title: 'Merchants', hasChange: true, path: '/dashboard/user/marchant' },
    { key: 'totalWallets', title: 'Wallets', hasChange: true, path: '/dashboard/wallets' },
    {
      key: 'totalKycApplications',
      title: 'KYC Apps',
      hasChange: true,
      path: '/dashboard/verifications'
    },
    { key: 'kycApplicationsByStatus', title: 'Pending KYC', path: '/dashboard/kyc-applications?status=pending' },
    {
      key: 'totalDeposit',
      title: 'Deposits',
      money: true,
      hasChange: true,
      path: '/dashboard/transaction/deposit'
    },
    {
      key: 'totalWithdrawal',
      title: 'Withdrawals',
      money: true,
      hasChange: true,
      path: '/dashboard/transaction/withdrawal'
    },
    {
      key: 'totalTransfer',
      title: 'Transfers',
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

  const allMetricsCards: CardData[] = metricsConfig.map(({ key, title, money, hasChange }) => {
    const raw = (stats as any)?.[key];
    const total = hasChange ? (raw?.total ?? 0) : (raw ?? 0);
    const value = money ? formatCurrency(total, 'USD') : total;
    const change = hasChange ? calculateChange(raw?.percentageChange) : 0;
    const isPositive = (change ?? 0) >= 0;
    return {
      title,
      value,
      trend: {
        icon: isPositive ? up : down,
        value: pct(change),
        rawValue: change,
        isPositive
      },
      hasChange
    };
  });

  const renderTrend = (trend: CardData['trend']) => {
    const trendTextClass = trend.isPositive ? 'text-green-700' : 'text-red-600';

    return (
      <div className="flex items-center gap-2">
        <div className={`inline-flex items-center gap-1 ${trendTextClass}`}>
          {trend.icon}
          <Typography variant="tiny" className={`font-medium ${trendTextClass}`}>
            {trend.value}
          </Typography>
        </div>
        <Typography variant="tiny" className="text-gray-500 font-normal ">
          vs last month
        </Typography>
      </div>
    );
  };

  const renderCard = (card: CardData, idx: number) => {
    const path = metricsConfig[idx]?.path;
    return (
      <motion.button
        key={card.title}
        type="button"
        onClick={() => path && navigate({ to: path })}
        className="w-full text-left"
        // initial={{ opacity: 0, y: 12 }}
        // animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.22, delay: idx * 0.035 }}
      >
        <ModularCard
          hideHeader
          className="h-full rounded-xl border border-slate-200 bg-white py-2 transition-colors duration-200 hover:border-slate-300"
          contentClassName=""
        >
          <div className="pb-2">
            <div className="flex items-center justify-between gap-3 mt-1">
              <Typography variant="tiny" className="font-medium text-slate-600">
                {card.title}
              </Typography>
              {/* <span className="text-gray-400">•••</span> */}
            </div>
          </div>
          <div className="pt-0">
            <div className="mb-2 text-2xl font-semibold leading-none text-slate-900">{card.value}</div>
            {card.hasChange ? renderTrend(card.trend) : null}
          </div>
        </ModularCard>
      </motion.button>
    );
  };

  const renderSkeleton = (idx: number) => (
    <div key={idx} className="w-full">
      <ModularCard hideHeader className="h-full rounded-xl border border-slate-200 shadow-sm" contentClassName="!p-4">
        <div className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
        <div className="pt-0">
          <Skeleton className="mb-2 h-8 w-28" />
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-14 rounded" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </ModularCard>
    </div>
  );

  return (
    <ModularCard className="bg-transparent">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Typography variant="h6" className="font-semibold text-slate-900">
          Overview
        </Typography>
        <div className="w-full sm:w-[180px]">
          <CountrySelector
            countries={COUNTRY_OPTIONS}
            value={selectedCountry}
            onValueChange={handleCountryChange}
            placeholder="Country"
            showPrefix={false}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: metricsConfig.length }).map((_, idx) => renderSkeleton(idx))
          : allMetricsCards.map(renderCard)}
      </div>
    </ModularCard>
  );
}
