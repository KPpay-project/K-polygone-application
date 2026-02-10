import { gql } from '@apollo/client';

const CREATE_BENEFICIARY_MUTATION = gql`
  mutation CreateBeneficiary($name: String!, $number: String!, $type: BeneficiaryType!, $providerName: String) {
    createBeneficiary(name: $name, number: $number, type: $type, providerName: $providerName) {
      beneficiary {
        id
        insertedAt
        name
        number
        type
        updatedAt
      }
      message
      success
      errors {
        code
        field
        message
      }
    }
  }
`;

const FETCH_BENEFICIARIES_QUERY = gql`
  query {
    myBeneficiaries(page: 1, perPage: 20) {
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

const DELETE_BENEFICIARY_MUTATION = gql`
  mutation DeleteBeneficiary($deleteBeneficiaryId: ID!) {
    deleteBeneficiary(id: $deleteBeneficiaryId) {
      message
      success
    }
  }
`;

export { CREATE_BENEFICIARY_MUTATION, FETCH_BENEFICIARIES_QUERY, DELETE_BENEFICIARY_MUTATION };
