import { gql } from '@apollo/client';

export const CREATE_BILL_PAYMENT = gql`
  mutation CreateBillPayment($input: BillPaymentInput!) {
    createBillPayment(input: $input) {
      id
      amount
      currency
      service
      network
      account
      status
      reference
      fee
      total
      createdAt
      updatedAt
      transaction {
        id
        amount
        currency
        transactionType
        status
        description
        reference
        walletId
        createdAt
        updatedAt
      }
    }
  }
`;

export const VERIFY_BILL_PAYMENT = gql`
  mutation VerifyBillPayment($reference: String!) {
    verifyBillPayment(reference: $reference) {
      id
      status
      verificationStatus
      verifiedAt
    }
  }
`;

export const GET_BILL_PAYMENT_FEES = gql`
  query GetBillPaymentFees($service: String!, $network: String, $amount: Float!) {
    billPaymentFees(service: $service, network: $network, amount: $amount) {
      serviceFee
      networkFee
      totalFee
      exchangeRate
    }
  }
`;
