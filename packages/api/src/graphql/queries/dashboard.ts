import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  fragment DashboardStatWithChangeFields on StatWithChange {
    total
    percentageChange
  }

  fragment DashboardStatWithDecimalChangeFields on StatWithDecimalChange {
    total
    percentageChange
  }

  query GetAdminDashboardStats {
    adminDashboardStats {
      totalWallets {
        ...DashboardStatWithChangeFields
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
        ...DashboardStatWithChangeFields
      }

      totalUsers {
        ...DashboardStatWithChangeFields
      }
      totalMerchants {
        ...DashboardStatWithChangeFields
      }
      totalDeposit {
        ...DashboardStatWithDecimalChangeFields
      }
      totalWithdrawal {
        ...DashboardStatWithDecimalChangeFields
      }
      totalTransfer {
        ...DashboardStatWithDecimalChangeFields
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
