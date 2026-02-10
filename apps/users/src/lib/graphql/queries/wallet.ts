import { gql } from '@apollo/client';

export const GET_WALLET = gql`
  query GetWallet($id: ID!) {
    wallet(id: $id) {
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
      transactions {
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

export const GET_USER_WALLETS = gql`
  query GetUserWallets($ownerId: ID!, $ownerType: String!) {
    wallets(ownerId: $ownerId, ownerType: $ownerType) {
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

export const GET_MY_WALLETS = gql`
  query MyWallet {
    myWallet {
      dailyLimit
      freezeReason
      id
      isFrozen
      monthlyLimit
      ownerId
      ownerType
      status
      updatedAt
      currency {
        code
        countryCode
        countryNames
        id
        isActive
        name
        precision
        symbol
      }

      balances {
        availableBalance
        totalBalance
        walletId
        currency {
          code
          countryCode
          countryNames
          exchangeRateUsd
          id
          insertedAt
          isActive
          name
          precision
          symbol
          updatedAt
        }
      }
    }
  }
`;
