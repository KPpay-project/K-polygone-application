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

const GET_MY_WALLET_CURRENCIES = gql`
  query Currency {
    me {
      wallets {
        currency {
          code
          countryCode
          exchangeRateUsd
          id
          name
          precision
          symbol
        }
      }
    }
  }
`;

export { GET_MY_WALLET_CURRENCIES };
