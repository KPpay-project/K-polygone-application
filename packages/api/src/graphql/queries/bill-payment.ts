import { gql } from '@apollo/client';

export const GET_BILLERS = gql`
  query GetBillersList(
    $page: Int = 1
    $perPage: Int = 15
    $sortBy: String = "updatedAt"
    $sortDirection: String = "desc"
    $search: String
    $filters: BillerFilters
    $fromDate: Date
    $toDate: Date
  ) {
    billers(
      page: $page
      perPage: $perPage
      sortBy: $sortBy
      sortDirection: $sortDirection
      search: $search
      filters: $filters
      fromDate: $fromDate
      toDate: $toDate
    ) {
      entries {
        id
        billerName
        description
        iconLogo
        status
        shortCode
        providerCode
        channel
        insertedAt
        updatedAt
      }
      pageNumber
      pageSize
      totalEntries
      totalPages
    }
  }
`;

export const GET_BILLER_BY_ID = gql`
  query GetBillerById($id: ID!) {
    getBillerById(billerId: $id) {
      id
      billerName
      description
      iconLogo
      status
      shortCode
      providerCode
      channel
      insertedAt
      updatedAt
    }
  }
`;
