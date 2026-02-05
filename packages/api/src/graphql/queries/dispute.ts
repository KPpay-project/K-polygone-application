import { gql } from '@apollo/client';

export const LIST_DISPUTES = gql`
  query Disputes(
    $filters: TicketListsFilter
    $fromDate: Date
    $page: Int
    $perPage: Int
    $search: String
    $sortBy: String
    $sortDirection: String
    $toDate: Date
  ) {
    disputes(
      filters: $filters
      fromDate: $fromDate
      page: $page
      perPage: $perPage
      search: $search
      sortBy: $sortBy
      sortDirection: $sortDirection
      toDate: $toDate
    ) {
      entries {
        id
        insertedAt
        message
        priority
        resolvedAt
        status
        ticketNumber
        ticketSubject
        ticketType
        updatedAt
        customer {
          currentSignInAt
          currentSignInIp
          id
          insertedAt
          lastSignInAt
          lastSignInIp
          role
          signInCount
          signInIp
          status
          updatedAt
          walletCode
          user {
            country
            email
            firstName
            id
            insertedAt
            lastName
            phone
            updatedAt
          }
        }
      }
      pageNumber
      pageSize
      totalEntries
      totalPages
    }
  }
`;
