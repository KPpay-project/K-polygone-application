import { gql } from '@apollo/client';
export const mutation_CREATE_MONOS = gql`
  mutation CreateMno($input: MnoInput!) {
    createMno(input: $input) {
      message
      success
      errors {
        code
        field
        message
      }
      mno {
        active
        name
        updatedAt
      }
    }
  }
`;
