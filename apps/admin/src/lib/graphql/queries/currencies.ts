import { gql } from '@apollo/client';

export const GET_CURRENCIES = gql`
  query GetCurrencies {
    currencies {
      code
      countryCode
      id
      exchangeRateUsd
      isActive
      name
      symbol
    }
  }
`;

const ADD_CURRENCY = gql`
  mutation CreateCurrency($input: CurrencyInput!) {
    createCurrency(input: $input) {
      id
      code
      name
      symbol
      precision
      exchangeRateUsd
      countryCode
      isActive
      countryNames
      insertedAt
    }
  }
`;

export const ADD_CURRENCY_MUTATION = ADD_CURRENCY;
