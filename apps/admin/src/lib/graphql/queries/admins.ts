import { gql } from '@apollo/client';

export const GET_ADMINS = gql`
  query GetAdminsList(
    $page: Int = 1
    $perPage: Int = 10
    $sortBy: String = "updatedAt"
    $sortDirection: String = "desc"
    $search: String
    $filters: AdminFilters
    $fromDate: Date
    $toDate: Date
  ) {
    admins(
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
        firstName
        email
        role
        status
        updatedAt
      }
      pageNumber
      pageSize
      totalEntries
      totalPages
    }
  }
`;

const SUSPEND_ADMIN = gql`
  mutation SuspendAdmin($input: AdminSuspensionInput!) {
    suspendAdmin(input: $input) {
      success
      message
      admin {
        id
        firstName
        lastName
        email
        status
      }
      errors {
        code
        field
        message
      }
    }
  }
`;

export default GET_ADMINS;
export { SUSPEND_ADMIN };
