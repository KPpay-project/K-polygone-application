import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  fragment AdminDashboardStatWithChangeFields on StatWithChange {
    total
    percentageChange
  }

  fragment AdminDashboardStatWithDecimalChangeFields on StatWithDecimalChange {
    total
    percentageChange
  }

  query AdminDashboardStats($countryCode: String) {
    adminDashboardStats(countryCode: $countryCode) {
      totalWallets {
        ...AdminDashboardStatWithChangeFields
      }
      totalUsers {
        ...AdminDashboardStatWithChangeFields
      }
      totalMerchants {
        ...AdminDashboardStatWithChangeFields
      }
      totalKycApplications {
        ...AdminDashboardStatWithChangeFields
      }

      totalDeposit {
        ...AdminDashboardStatWithDecimalChangeFields
      }

      totalWithdrawal {
        ...AdminDashboardStatWithDecimalChangeFields
      }
      totalTransfer {
        ...AdminDashboardStatWithDecimalChangeFields
      }

      kycApplicationsByStatus(status: "pending")

      dailyTransactionCounts {
        total
        pending
        completed
        failed
        cancelled
      }

      weeklyTransactionCounts {
        total
        pending
        completed
        failed
        cancelled
      }
      monthlyTransactionCounts {
        total
        pending
        completed
        failed
        cancelled
      }
      annualTransactionCounts {
        total
        pending
        completed
        failed
        cancelled
      }

      dailyUserCounts {
        users
        merchants
        kycApplications
        wallets
      }
      weeklyUserCounts {
        users
        merchants
        kycApplications
        wallets
      }
      monthlyUserCounts {
        users
        merchants
        kycApplications
        wallets
      }
      annualUserCounts {
        users
        merchants
        kycApplications
        wallets
      }

      dailyTransactionVolumes {
        total
        deposits
        withdrawals
        transfers
      }
      weeklyTransactionVolumes {
        total
        deposits
        withdrawals
        transfers
      }
      monthlyTransactionVolumes {
        total
        deposits
        withdrawals
        transfers
      }
      annualTransactionVolumes {
        total
        deposits
        withdrawals
        transfers
      }

      topCountries {
        country
        totalVolume
        transactionCount
      }
    }
  }
`;
