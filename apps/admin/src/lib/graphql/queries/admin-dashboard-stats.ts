import { gql } from '@apollo/client';

export const GET_ADMIN_COMPREHENSIVE_TRANSACTION_STATS = gql`
  query ComprehensiveTransactionStats {
    adminDashboardStats {
      comprehensiveTransactionStats {
        cancelledCount
        cancelledVolume
        completedCount
        completedVolume
        failedCount
        failedVolume
        pendingCount
        pendingVolume
        processingCount
        processingVolume
        totalCount
        totalVolume
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

      monthlyTransactionTrend {
        cancelled
        completed
        failed
        month
        monthLabel
        monthStart
        pending
        total
        totalVolume
        year
      }
      totalDeposit {
        percentageChange
        total
      }
      totalTransfer {
        percentageChange
        total
      }
      monthlyTransactionVolumes {
        deposits
        total
        transfers
        withdrawals
      }
      dailyTransactionCounts {
        cancelled
        completed
        failed
        pending
        total
      }
      annualTransactionCounts {
        cancelled
        completed
        failed
        pending
        total
      }
      annualTransactionVolumes {
        deposits
        total
        transfers
        withdrawals
      }
      dailyTransactionTrend {
        cancelled
        completed
        date
        failed
        pending
        total
        totalVolume
      }
      totalUsers {
        percentageChange
        total
      }
      totalWallets {
        percentageChange
        total
      }
      totalWithdrawal {
        percentageChange
        total
      }
      dailyTransactionVolumes {
        deposits
        total
        transfers
        withdrawals
      }
      monthlyUserCounts {
        kycApplications
        merchants
        users
        wallets
      }
    }
  }
`;

export default GET_ADMIN_COMPREHENSIVE_TRANSACTION_STATS;
