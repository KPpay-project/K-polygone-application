import { gql } from '@apollo/client';

const CREATE_BENEFICIARY_MUTATION = gql`
  mutation CreateBeneficiary($name: String!, $number: String!, $type: BeneficiaryType!) {
    createBeneficiary(name: $name, number: $number, type: $type) {
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

export { CREATE_BENEFICIARY_MUTATION };
