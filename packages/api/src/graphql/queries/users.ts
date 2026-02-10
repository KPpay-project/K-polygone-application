import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsersList(
    $page: Int = 1
    $perPage: Int = 15
    $sortBy: String = "insertedAt"
    $sortDirection: String = "desc"
    $search: String
    $filters: UserFilters
  ) {
    users(
      page: $page
      perPage: $perPage
      sortBy: $sortBy
      sortDirection: $sortDirection
      search: $search
      filters: $filters
    ) {
      entries {
        id
        firstName
        email
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

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(userId: $id) {
      id
      firstName
      lastName
      email
      country
      phone
      insertedAt
      updatedAt
    }
  }
`;
