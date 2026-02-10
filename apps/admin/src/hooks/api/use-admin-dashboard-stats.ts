import { useMemo } from 'react';
import { useGraphQLQuery } from '@/hooks/useGraphQL';
import { GET_ADMIN_COMPREHENSIVE_TRANSACTION_STATS } from '@repo/api';

// Types mirroring the GraphQL response shapes we use
type ComprehensiveTransactionStats = {
  cancelledCount: number;
  cancelledVolume: string;
  completedCount: number;
  completedVolume: string;
  failedCount: number;
  failedVolume: string;
  pendingCount: number;
  pendingVolume: string;
  processingCount: number;
  processingVolume: string;
  totalCount: number;
  totalVolume: string;
};

type MonthlyTrendItem = {
  cancelled: number;
  completed: number;
  failed: number;
  month: number;
  monthLabel: string;
  monthStart: string;
  pending: number;
  total: number;
  totalVolume: string;
  year: number;
};

type AdminDashboardStatsResponse = {
  adminDashboardStats: {
    comprehensiveTransactionStats: ComprehensiveTransactionStats;
    monthlyTransactionTrend: MonthlyTrendItem[];
    totalDeposit: { percentageChange: number; total: string };
    totalTransfer: { percentageChange: number; total: string };
    totalWithdrawal: { percentageChange: number; total: string };
  };
};

export const useAdminTransactionStats = () => {
  const { data, loading, error, refetch } = useGraphQLQuery<AdminDashboardStatsResponse>(
    GET_ADMIN_COMPREHENSIVE_TRANSACTION_STATS,
    { fetchPolicy: 'cache-and-network' }
  );

  const summary = useMemo(() => {
    const stats = data?.adminDashboardStats?.comprehensiveTransactionStats;
    return {
      total: stats?.totalCount ?? 0,
      successful: stats?.completedCount ?? 0,
      failed: stats?.failedCount ?? 0,
      pending: stats?.pendingCount ?? 0
    };
  }, [data]);

  // Summaries for deposit and withdrawal pages (currently only total is provided by the API schema here)
  const depositSummary = useMemo(() => {
    const totalStr = data?.adminDashboardStats?.totalDeposit?.total ?? '0';
    const total = Number(totalStr) || 0;
    return {
      total,
      successful: 0,
      failed: 0,
      pending: 0
    };
  }, [data]);

  const withdrawalSummary = useMemo(() => {
    const totalStr = data?.adminDashboardStats?.totalWithdrawal?.total ?? '0';
    const total = Number(totalStr) || 0;
    return {
      total,
      successful: 0,
      failed: 0,
      pending: 0
    };
  }, [data]);

  return {
    data: data?.adminDashboardStats,
    loading,
    error,
    refetch,
    summary,
    depositSummary,
    withdrawalSummary
  };
};

export default useAdminTransactionStats;
