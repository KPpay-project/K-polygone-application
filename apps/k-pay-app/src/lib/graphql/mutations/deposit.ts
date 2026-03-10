import { gql } from '@apollo/client';

const DEPOSIT = gql`
  mutation Deposit($input: DepositInput!) {
    deposit(input: $input) {
      success
      message

      transaction {
        status
        reference
      }
    }
  }
`;

const GET_MTN_MOMO_BASIC_USER_INFO = gql`
  query GetMtnMomoBasicUserInfo($phoneNumber: String!, $service: MtnMomoService) {
    mtnMomoBasicUserInfo(phoneNumber: $phoneNumber, service: $service) {
      found
      basicUserInfo {
        givenName
        familyName
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

const DEPOSIT_VIA_BANK = gql`
  mutation DepositViaBank($input: DepositViaBankInput!) {
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

export { DEPOSIT, GET_MTN_MOMO_BASIC_USER_INFO, MOMO_DEPOSIT, DEPOSIT_VIA_BANK };
