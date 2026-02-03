import { gql } from '@apollo/client';

const GET_DASHBOARD_STATS = gql`
  query GetAdminDashboardStats {
    adminDashboardStats {
      totalWallets {
        total
        percentageChange
      }

      walletCountByMonth {
        activeWallets
        cumulativeCount
        frozenWallets
        month
        monthLabel
        monthOverMonthChange
        monthStart
        walletCount
        year
      }

      totalKycApplications {
        total
        percentageChange
      }

      totalUsers {
        total
        percentageChange
      }
      totalMerchants {
        total
        percentageChange
      }
      totalDeposit {
        total
        percentageChange
      }
      totalWithdrawal {
        total
        percentageChange
      }
      totalTransfer {
        total
        percentageChange
      }
      pendingKyc: kycApplicationsByStatus(status: "pending")
      approvedKyc: kycApplicationsByStatus(status: "approved")
      rejectedKyc: kycApplicationsByStatus(status: "rejected")
      topCountries {
        count
        country
      }
    }
  }
`;
export { GET_DASHBOARD_STATS };
