import { gql } from '@apollo/client';
export const CREATE_PAYMENT_LINK = gql`
  mutation CreatePaymentLink($input: CreatePaymentLinkInput!) {
    createPaymentLink(input: $input) {
      success
      message
      paymentLink {
        id
        code
        checkoutUrl
        name
        amount
        isActive
        allowedChannels
        insertedAt
      }
    }
  }
`;
