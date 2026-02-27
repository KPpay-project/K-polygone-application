import { gql } from '@apollo/client';

export const LIST_MNOS = gql`
  query Mnos(
    $filters: MnoFilters
    $fromDate: Date
    $page: Int
    $perPage: Int
    $search: String
    $sortBy: String
    $sortDirection: String
    $toDate: Date
  ) {
    mnos(
      filters: $filters
      fromDate: $fromDate
      page: $page
      perPage: $perPage
      search: $search
      sortBy: $sortBy
      sortDirection: $sortDirection
      toDate: $toDate
    ) {
      pageNumber
      pageSize
      totalEntries
      totalPages
      entries {
        country {
          active
          code
          countryFlag
          id
          insertedAt
          name
          updatedAt
        }
      }
    }
  }
`;

export const LIST_ACTIVE_MNOS = gql`
  query ActiveMnos {
    activeMnos {
      active
      id
      insertedAt
      name
      updatedAt
    }
  }
`;
