import { gql } from '@apollo/client';

export const GET_ALL_WALLET_TRANSACTIONS = gql`
  query GetAllWalletTransactions {
    getAllWalletTransactions {
      entries {
        amount
        counterpartyWallet {
          balances {
            availableBalance
            id
            insertedAt
            lastTransaction {
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
            }
            pendingBalance
            reservedBalance
            totalBalance
            updatedAt
            walletId
          }
          dailyLimit
          freezeReason
          id
          insertedAt
          isFrozen
          monthlyLimit
          ownerId
          ownerType
          status
          transactions {
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
            }
            pageNumber
            pageSize
            totalEntries
            totalPages
          }
          updatedAt
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
        customerPhone
        description
        exchangeRate
        externalReference
        feeAmount
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
        id
        insertedAt
        provider
        providerMessage
        providerStatus
        reference
        status
        transactionType
        updatedAt
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

export const GET_TRANSACTIONS = gql`
  query GetTransactions(
    $filters: TransactionFiltersInput
    $page: Int = 1
    $perPage: Int = 20
  ) {
    getTransactions(filters: $filters, page: $page, perPage: $perPage) {
      entries {
        id
        amount
        currency {
          code
          name
        }
        transactionType
        status
        reference
        externalReference
        description
        insertedAt
        updatedAt
        feeAmount
        feeCurrency {
          code
          name
        }
        provider
        providerStatus
        providerMessage
        customerPhone
        wallet {
          id
        }
        counterpartyWallet {
          id
        }
      }
      page
      perPage
      totalEntries
      totalPages
    }
  }
`;

export const USER_WALLETS_TRANSACTION_HISTORY = gql`
  query GetUserWalletsTransactionHistory(
    $page: Int!
    $perPage: Int!
    $search: String
    $type: String
    $fromDate: String
    $toDate: String
    $sortBy: String
    $sortDirection: String
  ) {
    userWalletsTransactionHistory(
      page: $page
      perPage: $perPage
      search: $search
      type: $type
      fromDate: $fromDate
      toDate: $toDate
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      entries {
        id
        transactionType
        amount
        status
        reference
        externalReference
        description
        feeAmount
        exchangeRate
        provider
        providerStatus
        providerMessage
        customerPhone
        insertedAt
        updatedAt
        currency {
          id
          code
          name
          symbol
        }
        wallet {
          id
          ownerType
          ownerId
          status
        }
        counterpartyWallet {
          id
          ownerType
          ownerId
        }
      }
      pageNumber
      pageSize
      totalEntries
      totalPages
    }
  }
`;
