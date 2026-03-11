import { gql } from '@apollo/client';

export const WITHDRAW = gql`
  mutation Withdraw($input: WithdrawInput!) {
    withdraw(input: $input) {
      success
      message
      balance {
        id
        amount
        currency
        wallet_id
        updated_at
      }
      transaction {
        id
        amount
        currency
        transaction_type
        status
        description
        reference
        wallet_id
        created_at
        updated_at
      }
    }
  }
`;

export const WITHDRAW_OR_TRANSFER = gql`
  mutation WithdrawOrTransfer($input: WithdrawalInput!) {
    withdrawOrTransfer(input: $input) {
      success
      message
      balance {
        availableBalance
        pendingBalance
        reservedBalance
      }
      transaction {
        id
        status
        reference
        provider
        amount
        insertedAt
      }
    }
  }
`;

export const MOBILE_MONEY_WITHRAWAL_QOUTE = gql`
  mutation MobileMoneyWithdrawalQuote(
    $input: MobileMoneyWithdrawalQuoteInput!
  ) {
    mobileMoneyWithdrawalQuote(input: $input) {
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

export const WITHDRAW_TO_MOBILE_MONEY = gql`
  mutation WithdrawToMobileMoney($input: MobileMoneyWithdrawalInput!) {
    withdrawToMobileMoney(input: $input) {
      flutterwaveTransferId
      message
      reference
      status
      success
    }
  }
`;
