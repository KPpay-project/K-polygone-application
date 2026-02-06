import { gql } from '@apollo/client';

const VERIFY_CONTACT_DETAIL = gql`
  mutation VerifyContactDetail($contactDetailId: ID!) {
    verifyContactDetail(contactDetailId: $contactDetailId) {
      success
      message
      errors {
        field
        message
      }
      kycApplication {
        id
        status
        contactDetailStatus
      }
    }
  }
`;

const VERIFY_FINANCIAL_INFO = gql`
  mutation VerifyFinancialInfo($financialInfoId: ID!) {
    verifyFinancialInfo(financialInfoId: $financialInfoId) {
      success
      message
      errors {
        field
        message
      }
      kycApplication {
        id
        status
        financialInfoStatus
      }
    }
  }
`;

const VERIFY_IDENTITY_DOCUMENT = gql`
  mutation VerifyIdentityDocument($identityDocumentId: ID!) {
    verifyIdentityDocument(identityDocumentId: $identityDocumentId) {
      success
      message
      errors {
        field
        message
      }
      kycApplication {
        id
        status
        identityDocumentStatus
      }
    }
  }
`;

const VERIFY_PERSONAL_INFO = gql`
  mutation VerifyPersonalInfo($personalInfoId: ID!) {
    verifyPersonalInfo(personalInfoId: $personalInfoId) {
      success
      message
      errors {
        field
        message
      }
      kycApplication {
        id
        status
        personalInfoStatus
      }
    }
  }
`;

const VERIFY_POLITICAL_EXPOSURE = gql`
  mutation VerifyPoliticalExposure($politicalExposureId: ID!) {
    verifyPoliticalExposure(politicalExposureId: $politicalExposureId) {
      success
      message
      errors {
        field
        message
      }
      kycApplication {
        id
        status
        politicalExposureStatus
      }
    }
  }
`;

export const VERIFY_BANK_INFO = gql`
  mutation VerifyBankInfo($bankInfoId: ID!) {
    verifyBankInfo(bankInfoId: $bankInfoId) {
      success
      message
      errors {
        field
        message
      }
      kycApplication {
        id
        status
        bankInfoStatus
      }
    }
  }
`;

const REJECT_BANK_INFO = gql`
  mutation rejectBankInfo($input: BankInfoRejectionInput!) {
    rejectBankInfo(input: $input) {
      success
      message
      kycApplication {
        id
        status
        bankInfoStatus
      }
    }
  }
`;

const REJECT_CONTACT_DETAIL = gql`
  mutation rejectContactDetail($input: ContactDetailRejectionInput!) {
    rejectContactDetail(input: $input) {
      success
      message
      kycApplication {
        id
        status
        contactDetailStatus
      }
    }
  }
`;

const REJECT_FINANCIAL_INFO = gql`
  mutation rejectFinancialInfo($input: FinancialInfoRejectionInput!) {
    rejectFinancialInfo(input: $input) {
      success
      message
      kycApplication {
        id
        status
        financialInfoStatus
      }
    }
  }
`;

const REJECT_IDENTITY_DOCUMENT = gql`
  mutation rejectIdentityDocument($input: IdentityDocumentRejectionInput!) {
    rejectIdentityDocument(input: $input) {
      success
      message
      kycApplication {
        id
        status
        identityDocumentStatus
      }
    }
  }
`;

const REJECT_PERSONAL_INFO = gql`
  mutation rejectPersonalInfo($input: PersonalInfoRejectionInput!) {
    rejectPersonalInfo(input: $input) {
      success
      message
      kycApplication {
        id
        status
        personalInfoStatus
      }
    }
  }
`;

export {
  REJECT_BANK_INFO,
  REJECT_CONTACT_DETAIL,
  REJECT_FINANCIAL_INFO,
  REJECT_IDENTITY_DOCUMENT,
  REJECT_PERSONAL_INFO,
  VERIFY_CONTACT_DETAIL,
  VERIFY_IDENTITY_DOCUMENT,
  VERIFY_FINANCIAL_INFO,
  VERIFY_PERSONAL_INFO,
  VERIFY_POLITICAL_EXPOSURE,
};
