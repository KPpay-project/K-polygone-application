import { gql } from '@apollo/client';

const DEPOSIT = gql`
  mutation Deposit($input: DepositInput!) {
    deposit(input: $input) {
      success
      message
      balance {
        pendingBalance
        reservedBalance
        availableBalance
      }
      transaction {
        status
        reference
      }
    }
  }
`;

const MOMO_DEPOSIT = gql`
  mutation MomoDeposit($input: MomoDepositInput!) {
    depositMomo(input: $input) {
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

export { DEPOSIT, MOMO_DEPOSIT };
