import { gql } from '@apollo/client';

export const CREATE_BENEFICIARY_MUTATION = gql`
  mutation CreateBeneficiary(
    $name: String!
    $number: String!
    $type: BeneficiaryType!
    $providerName: String
    $currencyId: ID
  ) {
    createBeneficiary(
      name: $name
      number: $number
      type: $type
      providerName: $providerName
      currencyId: $currencyId
    ) {
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

