import { gql } from '@apollo/client';

export const FETCH_BENEFICIARIES_QUERY = gql`
  query FetchBeneficiaries($page: Int, $perPage: Int) {
    myBeneficiaries(page: $page, perPage: $perPage) {
      entries {
        id
        name
        number
        type
        providerName
        insertedAt
        updatedAt
      }
      totalEntries
    }
  }
`;
