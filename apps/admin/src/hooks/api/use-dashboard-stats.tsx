import { useQuery } from '@apollo/client';
import { GET_DASHBOARD_STATS } from '@repo/api';

interface CountChange {
  total: number | string;
  percentageChange: number;
}

export interface TopCountry {
  count: number | null;
  country: string;
}

export interface AdminDashboardStats {
  totalWallets: CountChange;
  totalKycApplications: CountChange;
  totalUsers: CountChange;
  totalMerchants: CountChange;

  totalDeposit: CountChange;
  totalWithdrawal: CountChange;
  totalTransfer: CountChange;

  pendingKyc: number;
  approvedKyc: number;
  rejectedKyc: number;
  topCountries: TopCountry[];
}

interface GetAdminDashboardStatsResult {
  adminDashboardStats: AdminDashboardStats;
}

export const useDashboardStats = () => {
  return useQuery<GetAdminDashboardStatsResult>(GET_DASHBOARD_STATS, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};

export default useDashboardStats;
