import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  query AdminDashboardStats($countryCode: String) {
    adminDashboardStats(countryCode: $countryCode) {
      totalWallets {
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
      totalKycApplications {
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
