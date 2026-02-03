import { gql } from '@apollo/client';

export interface HasPaymentPinResponse {
  hasPin: boolean;
  isLocked: boolean;
  lockedUntilSeconds: number | null;
}

const HAS_PAYMENT_PIN = gql`
  query HasPaymentPin {
    hasPaymentPin {
      hasPin
      isLocked
      lockedUntilSeconds
    }
  }
`;

export { HAS_PAYMENT_PIN };
