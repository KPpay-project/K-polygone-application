import { gql } from '@apollo/client';

const REGISTER_MERCHANT = gql`
  mutation RegisterMerchant($input: MerchantInput!) {
    registerMerchant(input: $input) {
      currentSignInAt
      currentSignInIp
      id
      insertedAt
      lastSignInAt
      lastSignInIp
      role
      signInCount
      signInIp
      status
      updatedAt
      walletCode
    }
  }
`;

export default REGISTER_MERCHANT;
