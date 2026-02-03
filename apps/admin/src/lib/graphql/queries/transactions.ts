import { gql } from '@apollo/client';

export const GET_TRANSACTIONS = gql`
  query GetTransactions($filters: TransactionFiltersInput, $page: Int = 1, $perPage: Int = 20) {
    getTransactions(filters: $filters, page: $page, perPage: $perPage) {
      entries {
        id
        amount
        currency
        transaction_type
        status
        description
        reference
        wallet_id
        created_at
        updated_at
      }
      page
      perPage
      totalEntries
      totalPages
    }
  }
`;

export const GET_ALL_DEPOSIT_TRANSACTIONS = gql`
  query AllDepositsTransactionHistory(
    $fromDate: String
    $page: Int
    $perPage: Int
    $search: String
    $sortBy: String
    $sortDirection: String
    $toDate: String
    $type: String
  ) {
    allDepositsTransactionHistory(
      fromDate: $fromDate
      page: $page
      perPage: $perPage
      search: $search
      sortBy: $sortBy
      sortDirection: $sortDirection
      toDate: $toDate
      type: $type
    ) {
      pageNumber
      pageSize
      totalEntries
      totalPages
      entries {
        amount
        customerPhone
        description
        exchangeRate
        externalReference
        feeAmount
        id
        insertedAt
        provider
        providerMessage
        providerStatus
        reference
        status
        transactionType
        updatedAt
        currency {
          code
          countryCode
          countryNames
          exchangeRateUsd
          id
          insertedAt
          isActive
          name
          precision
          symbol
          updatedAt
        }
        counterpartyWallet {
          dailyLimit
          freezeReason
          id
          insertedAt
          isFrozen
          monthlyLimit
          ownerId
          ownerType
          status
          updatedAt
        }
      }
    }
  }
`;

export const GET_ALL_TRANSFERS_TRANSACTIONS = gql`
  query AllTransfersTransactionHistory(
    $fromDate: String
    $page: Int
    $perPage: Int
    $search: String
    $sortBy: String
    $sortDirection: String
    $toDate: String
    $type: String
  ) {
    allTransfersTransactionHistory(
      fromDate: $fromDate
      page: $page
      perPage: $perPage
      search: $search
      sortBy: $sortBy
      sortDirection: $sortDirection
      toDate: $toDate
      type: $type
    ) {
      pageNumber
      pageSize
      totalEntries
      totalPages
      entries {
        amount
        customerPhone
        description
        exchangeRate
        externalReference
        feeAmount
        id
        insertedAt
        provider
        providerMessage
        providerStatus
        reference
        status
        transactionType
        updatedAt
        feeCurrency {
          code
          countryCode
          countryNames
          exchangeRateUsd
          id
          insertedAt
          isActive
          name
          precision
          symbol
          updatedAt
        }
        counterpartyWallet {
          dailyLimit
          freezeReason
          id
          insertedAt
          isFrozen
          monthlyLimit
          ownerId
          ownerType
          status
          updatedAt
          balances {
            availableBalance
            id
            insertedAt
            pendingBalance
            reservedBalance
            totalBalance
            updatedAt
            walletId
          }
        }
        currency {
          code
          countryCode
          countryNames
          exchangeRateUsd
          id
          insertedAt
          isActive
          name
          precision
          symbol
          updatedAt
        }
        wallet {
          dailyLimit
          freezeReason
          id
          insertedAt
          isFrozen
          monthlyLimit
          ownerId
          ownerType
          status
          updatedAt
        }
      }
    }
  }
`;

export const GET_ALL_WITHDRAWAL_TRANSACTIONS = gql`
  query AllWithdrawalTransactionHistory(
    $fromDate: String
    $page: Int
    $perPage: Int
    $search: String
    $sortBy: String
    $sortDirection: String
    $toDate: String
    $type: String
  ) {
    allWithdrawalTransactionHistory(
      fromDate: $fromDate
      page: $page
      perPage: $perPage
      search: $search
      sortBy: $sortBy
      sortDirection: $sortDirection
      toDate: $toDate
      type: $type
    ) {
      pageNumber
      pageSize
      totalEntries
      totalPages
      entries {
        amount
        customerPhone
        description
        exchangeRate
        externalReference
        feeAmount
        id
        insertedAt
        provider
        providerMessage
        providerStatus
        reference
        status
        transactionType
        updatedAt
        feeCurrency {
          code
          countryCode
          countryNames
          exchangeRateUsd
          id
          insertedAt
          isActive
          name
          precision
          symbol
          updatedAt
        }
      }
    }
  }
`;
