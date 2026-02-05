import { gql } from '@apollo/client';

export const PAYMENT_LINKS_QUERY = gql`
  query PaymentLinks {
    myPaymentLinks {
      paymentLinks {
        id
        name
        description
        amount
        code
        isActive
        useCount
        maxUses
        insertedAt
        expiresAt
        completedPaymentsCount
        totalCollected
        checkoutUrl
        redirectUrl
        allowedChannels
        metadata
        updatedAt
      }
    }
  }
`;
