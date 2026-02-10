import { gql } from '@apollo/client';

export const FREEZE_WALLET = gql`
  mutation FreezeWallet($walletId: ID!, $input: FreezeWalletInput!) {
    freezeWallet(walletId: $walletId, input: $input) {
      dailyLimit
      freezeReason
      id
      insertedAt
      isFrozen
      monthlyLimit
      ownerId
      ownerType
      status
      updatedAt
    }
  }
`;

export const CROSS_CURRENCY_QUOTE = gql`
  mutation CrossCurrencyQuote($input: CrossCurrencyQuoteInput!) {
    crossCurrencyQuote(input: $input) {
      exchangeRate
      expiresAt
      feeAmount
      fromCurrencyCode
      fromWalletId
      netDebit
      receiveAmount
      sendAmount
      toCurrencyCode
      toWalletId
    }
  }
`;

export const EXCHANGE_CURRENCY_VIA_WALLET = gql`
  mutation ExchangeCurrencyViaWallet($input: ExchangeCurrencyInput!) {
    exchangeCurrencyViaWallet(input: $input) {
      message
      success
    }
  }
`;

export const CROSS_CURRENCY_TRANSFER = gql`
  mutation CrossCurrencyTransfer($input: CrossCurrencyTransferInput!) {
    crossCurrencyTransfer(input: $input) {
      expiresAt
      message
      success
    }
  }
`;

export const GET_MY_CURRENCIES_QUERY = gql`
  query Wallets {
    me {
      wallets {
        id
        ownerId
        status
        updatedAt
        currency {
          code
          countryCode
          id
          symbol
        }
        balances {
          availableBalance
        }
      }
    }
  }
`;
