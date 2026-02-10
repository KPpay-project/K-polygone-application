import { gql } from '@apollo/client';

export const ME = gql`
  query Me {
    me {
      id
      walletCode
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
      kycApplications {
        bankInfoStatus
        contactInfoStatus
        financialInfoStatus
        id
        identityStatus
        insertedAt
        kycClientId
        kycClientType
        message
        personalInfoStatus
        rejectionReason
        status
        updatedAt
      }
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

export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int) {
    users(limit: $limit, offset: $offset) {
      id
      email
      name
      createdAt
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      name
      createdAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      name
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;

export const USER_SUBSCRIPTION = gql`
  subscription OnUserUpdated($userId: ID!) {
    userUpdated(userId: $userId) {
      id
      email
      name
      updatedAt
    }
  }
`;
