import { gql } from '@apollo/client';

const DEPOSIT_VIA_BANK_MUTATION = gql`
  mutation DepositViaBank($input: FlutterwaveBankDepositInput!) {
    depositViaBank(input: $input) {
      accountName
      accountNumber
      bankName
      currency
      expiresAt
      isPermanent
      message
      success
    }
  }
`;

const DEPOSIT_VIA_CARD_MUTATION = gql`
  mutation DepositViaCard($input: FlutterwaveCardDepositInput!) {
    depositViaCard(input: $input) {
      authFields
      authMode
      authModel
      authUrl
      cardToken
      flutterwaveTransactionId
      message
      reference
      requiresAuth
      status
      success
    }
  }
`;

const RESOLVE_BANK_ACCOUNT_QUERY = gql`
  query VerifyAccount($accountNumber: String!, $bankCode: String!) {
    resolveBankAccountName(
      accountNumber: $accountNumber
      accountBank: $bankCode
    ) {
      accountNumber
      accountName
      bankCode
    }
  }
`;

const FLW_BANK_WITHDRAWAL_QUOTE = gql`
  mutation GetWithdrawalQuote($input: FlutterwaveBankWithdrawalQuoteInput!) {
    flutterwaveBankWithdrawalQuote(input: $input) {
      amount
      applies
      currencyCode
      expiresAt
      feeAmount
      feeCurrencyCode
      paymentType
      quoteId
      tier
      totalDebit
    }
  }
`;

const FLW_BANKS_QUERY = gql`
  query GetBanks($countryCode: String!) {
    flutterwaveBanks(countryCode: $countryCode) {
      id
      code
      name
    }
  }
`;

const FLW_VALIDATE_CARD_PAYMENT = gql`
  mutation ValidateCardPayment($input: ValidateCardPaymentInput!) {
    validateCardPayment(input: $input) {
      success
      status
      message
      cardToken
      transaction {
        id
        amount
        status
        reference
      }
    }
  }
`;

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

const WITHDRAW_TO_BANK = gql`
  mutation WithdrawToBank($input: FlutterwaveBankWithdrawalInput!) {
    withdrawToBank(input: $input) {
      success
      message
      transaction {
        id
        reference
        status
      }
    }
  }
`;

export {
  DEPOSIT_VIA_BANK_MUTATION,
  DEPOSIT_VIA_CARD_MUTATION,
  RESOLVE_BANK_ACCOUNT_QUERY,
  FLW_BANK_WITHDRAWAL_QUOTE,
  FLW_BANKS_QUERY,
  FLW_VALIDATE_CARD_PAYMENT,
  FLW_CARD_DEPOSIT_QUOTE,
  WITHDRAW_TO_BANK,
};
