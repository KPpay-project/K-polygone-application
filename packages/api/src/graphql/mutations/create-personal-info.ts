import { gql } from '@apollo/client';

export const CREATE_BANK_INFO = gql`
  mutation CreateBankInfo($input: BankInfoInput!) {
    createBankInfo(input: $input) {
      success
      message
      bankInfo {
        primaryBank
        accountNumber
        countryAccountHeld
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CREATE_CONTACT_DETAIL = gql`
  mutation CreateContactDetail($input: ContactDetailInput!) {
    createContactDetail(input: $input) {
      success
      message
      contactDetail {
        residentialStreet
        residentialCity
        residentialPostalCode
        residentialCountry
        primaryPhone
        emailAddress
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CREATE_FINANCIAL_INFO = gql`
  mutation CreateFinancialInfo($input: FinancialInfoInput!) {
    createFinancialInfo(input: $input) {
      success
      message
      financialInfo {
        salary
        estimatedAnnualIncome
        estimatedNetWorth
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CREATE_IDENTITY_DOCUMENT = gql`
  mutation CreateIdentityDocument($input: IdentityDocumentInput!) {
    createIdentityDocument(input: $input) {
      success
      message
      identityDocument {
        documentType
        documentNumber
        dateOfIssue
        expiryDate
        issuingAuthority
        documentUrl {
          thumb
          original
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CREATE_PERSONAL_INFO = gql`
  mutation CreatePersonalInfo($input: PersonalInfoInput!) {
    createPersonalInfo(input: $input) {
      success
      message
      errors {
        field
        message
      }
      personalInfo {
        id
        firstName
        lastName
        maidenName
        dateOfBirth
        placeOfBirth
        nationality
        countryOrTaxResidence
        taxIdentificationNumber
        occupation
        currentEmployer
        employmentStatus
        insertedAt
        updatedAt
      }
    }
  }
`;

export const CREATE_POLITICAL_EXPOSURE = gql`
  mutation CreatePoliticalExposure($input: PoliticalExposureInput!) {
    createPoliticalExposure(input: $input) {
      success
      message
      politicalExposure {
        isPep
        positionHeld
        countryOfPosition
        startDate
        endDate
      }
      errors {
        field
        message
      }
    }
  }
`;

export const CREATE_DECLARATION_AND_COMMITMENT = gql`
  mutation CreateDeclarationAndCommitment($input: DeclarationAndCommitmentInput!) {
    createDeclarationAndCommitment(input: $input) {
      success
      message
      declarationAndCommitments {
        individualsFullName
        companyName
      }
      errors {
        field
        message
      }
    }
  }
`;
