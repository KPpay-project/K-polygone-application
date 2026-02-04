import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const ALL_DEPOSITS_TRANSACTION_HISTORY = gql`
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

export function useAllDepositsTransactionHistory(variables) {
  return useQuery(ALL_DEPOSITS_TRANSACTION_HISTORY, {
    variables,
    fetchPolicy: 'cache-and-network'
  });
}
