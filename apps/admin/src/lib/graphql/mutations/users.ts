import { gql } from '@apollo/client';

const SUSPEND_ADMIN = gql`
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

const REGISTER_MERCHANT = gql`
  mutation RegisterMerchant($input: MerchantInput!) {
    registerMerchant(input: $input) {
      id
      role
      status
      merchant {
        id
        businessName
        businessType
        status
      }
    }
  }
`;

const REGISTER_USER = gql`
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
        phone
      }
    }
  }
`;

const REGISTER_ADMIN = gql`
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

const UPDATE_ROLE = gql`
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
      errors {
        field
        message
      }
    }
  }
`;

export { SUSPEND_ADMIN, REGISTER_MERCHANT, REGISTER_USER, REGISTER_ADMIN, UPDATE_ROLE };
