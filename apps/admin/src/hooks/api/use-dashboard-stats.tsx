import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '@repo/api';

interface CountChange {
  total: number | string;
  percentageChange: number;
}

export interface TopCountry {
  country: string;
  totalVolume: string;
  transactionCount: number;
}

export interface TransactionCounts {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  cancelled: number;
}

export interface UserCounts {
  users: number;
  merchants: number;
  kycApplications: number;
  wallets: number;
}

export interface TransactionVolumes {
  total: string;
  deposits: string;
  withdrawals: string;
  transfers: string;
}

export interface AdminDashboardStats {
  totalWallets: CountChange;
  totalKycApplications: CountChange;
  totalUsers: CountChange;
  totalMerchants: CountChange;

  totalDeposit: CountChange;
  totalWithdrawal: CountChange;
  totalTransfer: CountChange;

  kycApplicationsByStatus: number;

  dailyTransactionCounts: TransactionCounts;
  weeklyTransactionCounts: TransactionCounts;
  monthlyTransactionCounts: TransactionCounts;
  annualTransactionCounts: TransactionCounts;

  dailyUserCounts: UserCounts;
  weeklyUserCounts: UserCounts;
  monthlyUserCounts: UserCounts;
  annualUserCounts: UserCounts;

  dailyTransactionVolumes: TransactionVolumes;
  weeklyTransactionVolumes: TransactionVolumes;
  monthlyTransactionVolumes: TransactionVolumes;
  annualTransactionVolumes: TransactionVolumes;

  topCountries: TopCountry[];
}

interface GetAdminDashboardStatsResult {
  adminDashboardStats: AdminDashboardStats;
}

export const useDashboardStats = (variables?: { countryCode?: string }) => {
  return useQuery<GetAdminDashboardStatsResult>(GET_DASHBOARD_STATS, {
    variables,
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

export default useDashboardStats;
