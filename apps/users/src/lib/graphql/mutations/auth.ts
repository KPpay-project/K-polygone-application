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
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input) {
      message
      success
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
      userAccount {
        id
      }
      errors
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      message
      success
      userAccount {
        id
      }
    }
  }
`;
