import { gql } from '@apollo/client';

const DEPOSIT = gql`
  mutation Deposit($input: DepositInput!) {
    deposit(input: $input) {
      success
      message
      transaction {
        status
        reference
        providerStatus
        providerMessage
        feeAmount
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
  mutation DepositViaBank($input: FlutterwaveBankDepositInput!) {
    depositViaBank(input: $input) {
      accountName
      accountNumber
      bankName
      currency
      expiresAt

      message
      success
    }
  }
`;

const DEPOSIT_VIA_CARD = gql`
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

const VALIDATE_CARD_PAYMENT = gql`
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

const GET_MTN_MOMO_BASIC_USER_INFO = gql`
  query GetMtnMomoBasicUserInfo($phoneNumber: String!, $service: MtnMomoService) {
    mtnMomoBasicUserInfo(phoneNumber: $phoneNumber, service: $service) {
      msisdn
      service
      found
      targetEnvironment
      basicUserInfo {
        givenName
        familyName
      }
    }
  }
`;

const DEPOSIT_VIA_MOBIILE_MONEY = gql`
  mutation DepositViaMobileMoney($input: MobileMoneyDepositInput!) {
    depositViaMobileMoney(input: $input) {
      success
      message
      reference
      status
      requiresValidation
      flutterwaveTransactionId
      transaction {
        id
        status
        reference
      }
    }
  }
`;

export {
  DEPOSIT,
  MOMO_DEPOSIT,
  DEPOSIT_VIA_CARD,
  DEPOSIT_VIA_BANK,
  VALIDATE_CARD_PAYMENT,
  GET_MTN_MOMO_BASIC_USER_INFO,
  DEPOSIT_VIA_MOBIILE_MONEY,
};
