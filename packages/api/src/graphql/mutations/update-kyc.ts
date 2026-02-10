import { gql } from '@apollo/client';

export const UPDATE_BANK_INFO = gql`
  mutation UpdateBankInfo($input: BankInfoInput!) {
    updateBankInfo(input: $input) {
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

export const UPDATE_DECLARATION_AND_COMMITMENT = gql`
  mutation UpdateDeclarationAndCommitment($input: DeclarationAndCommitmentInput!) {
    updateDeclarationAndCommitment(input: $input) {
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

export const UPDATE_FINANCIAL_INFO = gql`
  mutation UpdateFinancialInfo($input: FinancialInfoInput!) {
    updateFinancialInfo(input: $input) {
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

export const UPDATE_IDENTITY_DOCUMENT = gql`
  mutation UpdateIdentityDocument($input: IdentityDocumentInput!) {
    updateIdentityDocument(input: $input) {
      success
      message
      identityDocument {
        documentType
        documentNumber
        dateOfIssue
        expiryDate
        issuingAuthority
        documentUrl
      }
      errors {
        field
        message
      }
    }
  }
`;

export const UPDATE_PERSONAL_INFO = gql`
  mutation UpdatePersonalInfo($input: PersonalInfoUpdateInput!) {
    updatePersonalInfo(input: $input) {
      success
      message
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
      }
      errors {
        field
        message
      }
    }
  }
`;

export const UPDATE_POLITICAL_EXPOSURE = gql`
  mutation UpdatePoliticalExposure($input: PoliticalExposureInput!) {
    updatePoliticalExposure(input: $input) {
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
