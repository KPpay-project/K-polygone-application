import { gql } from '@apollo/client';

const GET_ALL_KYC_APPLICATIONS = gql`
  query {
    allKycApplications {
      id
      status

      userAccount {
        id
        role
      }
      personalInfo {
        firstName
        lastName
      }
      identityDocument {
        documentType
      }
    }
  }
`;

const GET_KYC_BY_ID = gql`
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

export { GET_ALL_KYC_APPLICATIONS, GET_KYC_BY_ID };
