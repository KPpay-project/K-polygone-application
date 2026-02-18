import { gql } from '@apollo/client';

export const FETCH_BENEFICIARIES_QUERY = gql`
  query {
    myBeneficiaries(page: 1, perPage: 20) {
      entries {
        id
        name
        number
        type
        providerName
        currencyId
        insertedAt
        updatedAt
      }
      totalEntries
    }
  }
`;
