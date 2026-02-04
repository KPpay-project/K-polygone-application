import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      id
      role
      status
      currentSignInAt
      currentSignInIp
      lastSignInAt
      lastSignInIp
      signInCount
      signInIp
      insertedAt
      updatedAt
      user {
        id
        firstName
        lastName
        email
      }
      merchant {
        id
        businessName
        businessType
      }
      admin {
        id
        firstName
        lastName
      }
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
          availableBalance
          totalBalance
          currency {
            code
            countryCode
            precision
          }
        }
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      createdAt
      updatedAt
    }
  }
`;
