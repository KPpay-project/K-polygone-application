import { gql } from '@apollo/client';

export const SUSPEND_USER = gql`
  mutation SuspendUser($userAccountId: ID!, $reason: String) {
    suspendUser(userAccountId: $userAccountId, reason: $reason) {
      message
      success
      errors {
        code
        field
        message
      }
    }
  }
`;

export const SUSPEND_ADMIN = gql`
  mutation SuspendAdmin($input: AdminSuspensionInput!) {
    suspendAdmin(input: $input) {
      success
      message
      admin {
        id
        firstName
        lastName
        email
        status
      }
      errors {
        field
        message
      }
    }
  }
`;


export const REGISTER_ADMIN = gql`
  mutation RegisterAdmin($input: AdminInput!) {
    registerAdmin(input: $input) {
      id
      role
      status
      admin {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($input: UserRoleInput!) {
    updateRole(input: $input) {
      success
      message
      userAccount {
        id
        role
        status
        admin {
          id
          firstName
          lastName
          email
        }
        merchant {
          id
          businessName
          businessType
          status
        }
        user {
          id
          firstName
          lastName
          email
          phone
        }
      }
    }
  }
`;
