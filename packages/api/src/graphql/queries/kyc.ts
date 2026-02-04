import { gql } from '@apollo/client';

export const GET_KYC_APPLICATION_BY_ID = gql`
  query GetKycApplicationById($id: ID!) {
    getKycApplicationById(kycApplicationId: $id) {
      bankInfo {
        bankName
        accountNumber
        bankCode
      }
      contactDetail {
        email
        phone
        address
      }
      contactInfoStatus
      declarationsAndCommitments {
        isPoliticallyExposed
        isSanctioned
      }
      errors
      financialInfo {
        incomeSource
        annualIncome
      }
      financialInfoStatus
      id
      identityDocument {
        documentType
        documentNumber
        issueDate
        expiryDate
      }
      identityStatus
      insertedAt
      kycClientId
      kycClientType
      message
      politicalExposure {
        isPoliticallyExposed
        position
      }
      updatedAt
      userAccount {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_ALL_KYC_APPLICATIONS = gql`
  query GetAllKycApplications {
    getAllKycApplications {
      id
      kycClientId
      kycClientType
      message
      errors
      contactInfoStatus
      financialInfoStatus
      identityStatus
      insertedAt
      updatedAt
      bankInfo {
        id
      }
      contactDetail {
        id
      }
      declarationsAndCommitments {
        id
      }
      financialInfo {
        id
      }
      identityDocument {
        id
      }
      politicalExposure {
        id
      }
      userAccount {
        id
      }
    }
  }
`;

export const GET_MY_KYC = gql`
  query UserKyc {
    myKycApplication {
      bankInfo {
        id
        insertedAt
        primaryBank
        accountNumber
      }
      contactDetail {
        addressProofUrl
        emailAddress
        residentialCity
        primaryPhone
        mailingCity
        mailingCountry
      }

      identityStatus
      personalInfoStatus
      financialInfoStatus
      contactInfoStatus
    }
  }
`;
