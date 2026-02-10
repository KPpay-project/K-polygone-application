import { gql } from '@apollo/client';

const FLW_CARD_DEPOSIT_QUOTE = gql`
  query GetCardDepositQuote($input: FlutterwaveCardDepositQuoteInput!) {
    flutterwaveCardDepositQuote(input: $input) {
      quoteId
      amount
      currencyCode
      feeAmount
      netAmount
      totalDebit
      expiresAt
    }
  }
`;

const FLW_BANKS = gql`
  query GetBanks($countryCode: String!) {
    flutterwaveBanks(countryCode: $countryCode) {
      id
      code
      name
    }
  }
`;

const FLW_BANK_WITHDRAWAL_QUOTE = gql`
  query GetWithdrawalQuote($input: FlutterwaveBankWithdrawalQuoteInput!) {
    flutterwaveBankWithdrawalQuote(input: $input) {
      quoteId
      amount
      currencyCode
      feeAmount
      netAmount
      totalDebit
      expiresAt
    }
  }
`;

//virtual account
export const GET_VIRTUAL_ACCOUNT_NUMBER = gql`
  query GetVirtualAccountNumber($currencyCode: String!, $walletId: ID!) {
    getVirtualAccount(currencyCode: $currencyCode, walletId: $walletId) {
      accountName
      accountNumber
      accountReference
      bankCode
      bankName
      createdAtFlutterwave
      currency
      deactivatedAt
      deactivationReason
      expiresAt
      flutterwaveAccountId
      flwRef
      id
      insertedAt
      isActive
      isPermanent
      lastDepositAt
      metadata
      orderRef
      totalDepositsAmount
      totalDepositsCount
      updatedAt
      userAccountId
      walletId
    }
  }
`;

export { FLW_CARD_DEPOSIT_QUOTE, FLW_BANKS, FLW_BANK_WITHDRAWAL_QUOTE, GET_VIRTUAL_ACCOUNT_NUMBER };
