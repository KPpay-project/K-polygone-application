import { gql } from '@apollo/client';

export const CREATE_WALLET = gql`
  mutation CreateWallet($input: CreateWalletInput!) {
    createWallet(input: $input) {
      id
      ownerId
    }
  }
`;
