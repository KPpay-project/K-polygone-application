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
    $fromDate: Date
    $toDate: Date
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
