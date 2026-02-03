import { gql } from '@apollo/client';

export const GET_ALL_WALLETS = gql`
  query GetAllWallets {
    wallets {
      id
      ownerId
      ownerType
      status
      isFrozen
      freezeReason
      dailyLimit
      monthlyLimit
      insertedAt
      updatedAt
      balances {
        id
        amount
        currency
        wallet_id
        updated_at
      }
    }
  }
`;
