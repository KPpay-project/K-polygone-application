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
