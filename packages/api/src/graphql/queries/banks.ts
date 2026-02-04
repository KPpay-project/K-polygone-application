import { gql } from '@apollo/client';

export const GET_BANKS_BY_COUNTRY = gql`
  query GetBanksByCountry($countryCode: String!) {
    banksByCountry(countryCode: $countryCode) {
      id
      name
      code
      country
      accountNumberLength
      accountNumberRegex
    }
  }
`;
