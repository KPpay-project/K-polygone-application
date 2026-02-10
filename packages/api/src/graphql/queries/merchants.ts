import { gql } from '@apollo/client';

export const GET_MERCHANTS = gql`
  query GetMerchantsList(
    $page: Int = 1
    $perPage: Int = 10
    $sortBy: String = "updatedAt"
    $sortDirection: String = "desc"
    $search: String
    $filters: MerchantFilters
    $fromDate: Date
    $toDate: Date
  ) {
    merchants(
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
        businessName
        email
        status
        country
        phone
        updatedAt
      }
      pageNumber
      pageSize
      totalEntries
      totalPages
    }
  }
`;

export default GET_MERCHANTS;
