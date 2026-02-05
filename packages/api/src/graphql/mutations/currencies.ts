import { gql } from '@apollo/client';

export const CREATE_CURRENCY_MUTATION = gql`
  mutation CreateCurrency($input: CurrencyInput!) {
    createCurrency(input: $input) {
      id
      code
      countryCode
      countryNames
      exchangeRateUsd
      isActive
      name
      precision
      symbol
      insertedAt
    }
  }
`;

export const UPDATE_CURRENCY_MUTATION = gql`
  mutation UpdateCurrency($id: ID!, $input: CurrencyInput!) {
    updateCurrency(id: $id, input: $input) {
      id
      code
      countryCode
      countryNames
      exchangeRateUsd
      isActive
      name
      precision
      symbol
      updatedAt
    }
  }
`;

export const DELETE_CURRENCY_MUTATION = gql`
  mutation DeleteCurrency($id: ID!) {
    deleteCurrency(id: $id) {
      success
      message
    }
  }
`;
