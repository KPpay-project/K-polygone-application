import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token {
        accessToken
        refreshToken
      }
      userAccount {
        id
        role
        status
        user {
          firstName
          lastName
          email
          phone
        }
        merchant {
          businessName
          businessType
        }
        admin {
          firstName
          lastName
        }
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($input: UserInput!) {
    registerUser(input: $input) {
      id
      role
      status
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const FORGOTTEN_PASSWORD = gql`
  mutation ForgottenPassword($input: ForgottenPasswordInput!) {
    requestPasswordReset(input: { email: "letorlimited@gmail.com" }) {
      message
      success
    }
  }
`;
