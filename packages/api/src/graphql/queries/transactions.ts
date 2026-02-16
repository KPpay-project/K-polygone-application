import { gql } from '@apollo/client';

export const GET_ALL_WALLET_TRANSACTIONS = gql`
  query GetAllWalletTransactions {
    getAllWalletTransactions {
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
      exchangeRate
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
  }
`;

export const GET_TRANSACTIONS = gql`
  query GetTransactions($filters: TransactionFiltersInput, $page: Int = 1, $perPage: Int = 20) {
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

export const GET_WALLET_TRANSACTION_BY_ID = gql`
  query GetWalletTransactionById($transactionId: String!) {
    getWalletTransactionById(transactionId: $transactionId) {
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
  }
`;

// export const USER_WALLETS_TRANSACTION_HISTORY = gql`
//   query UserWalletsTransactionHistory($limit: Int, $offset: Int, $type: String, $fromDate: Date, $toDate: Date) {
//     userWalletsTransactionHistory(limit: $limit, offset: $offset, type: $type, fromDate: $fromDate, toDate: $toDate) {

//       id
//     }
//   }
// `;

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
