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

export const GET_KYC_BY_ID = gql`
  query GetKycById($id: ID!) {
    kycApplicationById(id: $id) {
      bankInfo {
        accountNumber
        countryAccountHeld
        id
        insertedAt
        kycApplication {
          bankInfoStatus
          contactInfoStatus
          errors
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
        primaryBank
        updatedAt
      }
      bankInfoStatus
      contactDetail {
        addressProofUrl {
          thumb
          original
        }
        emailAddress
        id
        insertedAt
        mailingCity
        mailingCountry
        mailingPostalCode
        mailingStreet
        primaryPhone
        residentialCity
        residentialCountry
        residentialPostalCode
        residentialStreet
        secondaryPhone
        updatedAt
      }
      contactInfoStatus
      declarationsAndCommitments {
        companyName
        hasAcknowledgeInformationCollectionAmlCft
        id
        individualsFullName
        informationIsAccurate
        insertedAt
        updatedAt
      }
      errors
      financialInfo {
        estimatedAnnualIncome
        estimatedNetWorth
        id
        insertedAt
        salary
        updatedAt
        verified
      }
      financialInfoStatus
      id
      identityDocument {
        dateOfIssue
        documentNumber
        documentType
        documentUrl {
          thumb
          original
        }
        expiryDate
        id
        insertedAt
        issuingAuthority
        updatedAt
        verified
      }
      identityStatus
      insertedAt
      kycClientId
      kycClientType
      message
      personalInfo {
        countryOrTaxResidence
        currentEmployer
        dateOfBirth
        employmentStatus
        firstName
        id
        insertedAt
        lastName
        maidenName
        nationality
        occupation
        placeOfBirth
        taxIdentificationNumber
        updatedAt
        verified
      }
      personalInfoStatus
      politicalExposure {
        countryOfPosition
        endDate
        id
        insertedAt
        isPep
        positionHeld
        startDate
        updatedAt
      }
      rejectionReason
      status
      updatedAt
      userAccount {
        admin {
          email
          firstName
          id
          insertedAt
          lastName
          phone
          role
          status
          updatedAt
        }
        currentSignInAt
        currentSignInIp
        id
        insertedAt
        kycApplications {
          bankInfoStatus
          contactInfoStatus
          errors
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
        lastSignInAt
        lastSignInIp

        role
        signInCount
        signInIp
        status
        updatedAt
        user {
          country
          email
          firstName
          id
          insertedAt
          lastName
          phone
          updatedAt
        }
        walletCode
      }
    }
  }
`;
