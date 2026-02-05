import { useMutation } from '@apollo/client';
import {
  VERIFY_BANK_INFO,
  VERIFY_CONTACT_DETAIL,
  VERIFY_FINANCIAL_INFO,
  VERIFY_IDENTITY_DOCUMENT,
  VERIFY_PERSONAL_INFO,
  VERIFY_POLITICAL_EXPOSURE,
  REJECT_BANK_INFO,
  REJECT_CONTACT_DETAIL,
  REJECT_FINANCIAL_INFO,
  REJECT_IDENTITY_DOCUMENT,
  REJECT_PERSONAL_INFO
} from '@repo/api';

interface KycResponse {
  success: boolean;
  message: string;
  errors?: any;
  kycApplication?: any;
}

interface RejectInput {
  [key: string]: string;
}

const useKycVerification = () => {
  const [verifyBankInfo, { loading: bankInfoVerifyLoading, error: bankInfoVerifyError, data: bankInfoVerifyData }] =
    useMutation(VERIFY_BANK_INFO);
  const [
    verifyContactDetail,
    { loading: contactDetailVerifyLoading, error: contactDetailVerifyError, data: contactDetailVerifyData }
  ] = useMutation(VERIFY_CONTACT_DETAIL);
  const [
    verifyFinancialInfo,
    { loading: financialInfoVerifyLoading, error: financialInfoVerifyError, data: financialInfoVerifyData }
  ] = useMutation(VERIFY_FINANCIAL_INFO);
  const [
    verifyIdentityDocument,
    { loading: identityDocumentVerifyLoading, error: identityDocumentVerifyError, data: identityDocumentVerifyData }
  ] = useMutation(VERIFY_IDENTITY_DOCUMENT);
  const [
    verifyPersonalInfo,
    { loading: personalInfoVerifyLoading, error: personalInfoVerifyError, data: personalInfoVerifyData }
  ] = useMutation(VERIFY_PERSONAL_INFO);
  const [
    verifyPoliticalExposure,
    { loading: politicalExposureVerifyLoading, error: politicalExposureVerifyError, data: politicalExposureVerifyData }
  ] = useMutation(VERIFY_POLITICAL_EXPOSURE);
  const [rejectBankInfo, { loading: bankInfoRejectLoading, error: bankInfoRejectError, data: bankInfoRejectData }] =
    useMutation(REJECT_BANK_INFO);
  const [
    rejectContactDetail,
    { loading: contactDetailRejectLoading, error: contactDetailRejectError, data: contactDetailRejectData }
  ] = useMutation(REJECT_CONTACT_DETAIL);
  const [
    rejectFinancialInfo,
    { loading: financialInfoRejectLoading, error: financialInfoRejectError, data: financialInfoRejectData }
  ] = useMutation(REJECT_FINANCIAL_INFO);
  const [
    rejectIdentityDocument,
    { loading: identityDocumentRejectLoading, error: identityDocumentRejectError, data: identityDocumentRejectData }
  ] = useMutation(REJECT_IDENTITY_DOCUMENT);
  const [
    rejectPersonalInfo,
    { loading: personalInfoRejectLoading, error: personalInfoRejectError, data: personalInfoRejectData }
  ] = useMutation(REJECT_PERSONAL_INFO);

  const verifyKycComponent = async (mutation: any, id: string, variableName: string): Promise<KycResponse> => {
    try {
      const { data } = await mutation({
        variables: { [`${variableName}Id`]: id }
      });
      const resultKey = Object.keys(data)[0];
      return {
        success: data[resultKey].success,
        message: data[resultKey].message,
        errors: data[resultKey].errors,
        kycApplication: data[resultKey].kycApplication
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        errors: null,
        kycApplication: null
      };
    }
  };

  const rejectKycComponent = async (mutation: any, input: RejectInput): Promise<KycResponse> => {
    try {
      const { data } = await mutation({
        variables: { input }
      });
      const resultKey = Object.keys(data)[0];
      return {
        success: data[resultKey].success,
        message: data[resultKey].message,
        kycApplication: data[resultKey].kycApplication
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
        kycApplication: null
      };
    }
  };

  return {
    verifyBankInfo: (id: string) => verifyKycComponent(verifyBankInfo, id, 'bankInfo'),
    bankInfoVerifyLoading,
    bankInfoVerifyError,
    bankInfoVerifyData,

    verifyContactDetail: (id: string) => verifyKycComponent(verifyContactDetail, id, 'contactDetail'),
    contactDetailVerifyLoading,
    contactDetailVerifyError,
    contactDetailVerifyData,

    verifyFinancialInfo: (id: string) => verifyKycComponent(verifyFinancialInfo, id, 'financialInfo'),
    financialInfoVerifyLoading,
    financialInfoVerifyError,
    financialInfoVerifyData,

    verifyIdentityDocument: (id: string) => verifyKycComponent(verifyIdentityDocument, id, 'identityDocument'),
    identityDocumentVerifyLoading,
    identityDocumentVerifyError,
    identityDocumentVerifyData,

    verifyPersonalInfo: (id: string) => verifyKycComponent(verifyPersonalInfo, id, 'personalInfo'),
    personalInfoVerifyLoading,
    personalInfoVerifyError,
    personalInfoVerifyData,

    verifyPoliticalExposure: (id: string) => verifyKycComponent(verifyPoliticalExposure, id, 'politicalExposure'),
    politicalExposureVerifyLoading,
    politicalExposureVerifyError,
    politicalExposureVerifyData,

    rejectBankInfo: (input: RejectInput) => rejectKycComponent(rejectBankInfo, input),
    bankInfoRejectLoading,
    bankInfoRejectError,
    bankInfoRejectData,

    rejectContactDetail: (input: RejectInput) => rejectKycComponent(rejectContactDetail, input),
    contactDetailRejectLoading,
    contactDetailRejectError,
    contactDetailRejectData,

    rejectFinancialInfo: (input: RejectInput) => rejectKycComponent(rejectFinancialInfo, input),
    financialInfoRejectLoading,
    financialInfoRejectError,
    financialInfoRejectData,

    rejectIdentityDocument: (input: RejectInput) => rejectKycComponent(rejectIdentityDocument, input),
    identityDocumentRejectLoading,
    identityDocumentRejectError,
    identityDocumentRejectData,

    rejectPersonalInfo: (input: RejectInput) => rejectKycComponent(rejectPersonalInfo, input),
    personalInfoRejectLoading,
    personalInfoRejectError,
    personalInfoRejectData
  };
};

export default useKycVerification;
