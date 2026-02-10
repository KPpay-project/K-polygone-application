import { gql } from '@apollo/client';

export interface SetupPaymentPinInput {
  paymentPin: string;
  paymentPinConfirmation: string;
}

export interface UpdatePaymentPinInput {
  currentPaymentPin: string;
  paymentPin: string;
  paymentPinConfirmation: string;
}

export interface VerifyPaymentPinInput {
  paymentPin: string;
}

export interface PaymentPinResponse {
  message: string;
  success: boolean;
}

export interface VerifyPaymentPinResponse {
  attemptsRemaining: number;
  lockedUntilSeconds: number;
  message: string;
  success: boolean;
}

const SETUP_PIN_MUTATION = gql`
  mutation SetupPaymentPin($input: SetupPaymentPinInput!) {
    setupPaymentPin(input: $input) {
      message
      success
    }
  }
`;

const UPDATE_PAYMENT_PIN = gql`
  mutation UpdatePaymentPin($input: UpdatePaymentPinInput!) {
    updatePaymentPin(input: $input) {
      message
      success
    }
  }
`;

const VERIFY_PAYMENT_PIN = gql`
  mutation VerifyPaymentPin($input: VerifyPaymentPinInput!) {
    verifyPaymentPin(input: $input) {
      attemptsRemaining
      lockedUntilSeconds
      message
      success
    }
  }
`;

export { SETUP_PIN_MUTATION, UPDATE_PAYMENT_PIN, VERIFY_PAYMENT_PIN };
