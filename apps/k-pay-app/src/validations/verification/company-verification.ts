import { TFunction } from 'i18next';
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
} from '../common/validators';

// Form data interface
export interface CompanyVerificationFormData {
  identityType: string;
  companyName: string;
  identityNumber: string;
  identityProof: string | null;
}

// Form errors interface
export interface CompanyVerificationFormErrors {
  identityType?: string;
  companyName?: string;
  identityNumber?: string;
  identityProof?: string;
}

// Company identity number patterns for different document types
const COMPANY_IDENTITY_PATTERNS = {
  business_registration: /^[A-Z0-9]{6,20}$/,
  incorporation_certificate: /^[A-Z0-9]{8,15}$/,
  tax_identification: /^[0-9]{9,15}$/,
  trade_license: /^[A-Z0-9]{6,20}$/,
};

// Individual field validation functions
export const validateIdentityType = (
  identityType: string,
  t: TFunction
): string | null => {
  return validateRequired(identityType, t, 'identityType');
};

export const validateCompanyName = (
  companyName: string,
  t: TFunction
): string | null => {
  const requiredResult = validateRequired(companyName, t, 'companyName');
  if (requiredResult) return requiredResult;

  const minLengthResult = validateMinLength(companyName, 2, t, 'companyName');
  if (minLengthResult) return minLengthResult;

  const maxLengthResult = validateMaxLength(companyName, 100, t, 'companyName');
  if (maxLengthResult) return maxLengthResult;

  return null;
};

export const validateCompanyIdentityNumber = (
  identityNumber: string,
  identityType: string,
  t: TFunction
): string | null => {
  const requiredResult = validateRequired(identityNumber, t, 'identityNumber');
  if (requiredResult) return requiredResult;

  const minLengthResult = validateMinLength(
    identityNumber,
    5,
    t,
    'identityNumber'
  );
  if (minLengthResult) return minLengthResult;

  // Validate format based on identity type
  if (
    identityType &&
    COMPANY_IDENTITY_PATTERNS[
      identityType as keyof typeof COMPANY_IDENTITY_PATTERNS
    ]
  ) {
    const pattern =
      COMPANY_IDENTITY_PATTERNS[
        identityType as keyof typeof COMPANY_IDENTITY_PATTERNS
      ];
    if (!pattern.test(identityNumber.trim())) {
      return t('identityNumberInvalid');
    }
  }

  return null;
};

export const validateIdentityProof = (
  identityProof: string | null,
  t: TFunction
): string | null => {
  if (!identityProof) {
    return t('identityProofRequired');
  }
  return null;
};

// Form validation function
export const validateCompanyVerificationForm = (
  formData: CompanyVerificationFormData,
  t: TFunction
) => {
  const errors: CompanyVerificationFormErrors = {};
  let isValid = true;

  // Validate identity type
  const identityTypeError = validateIdentityType(formData.identityType, t);
  if (identityTypeError) {
    errors.identityType = identityTypeError;
    isValid = false;
  }

  // Validate company name
  const companyNameError = validateCompanyName(formData.companyName, t);
  if (companyNameError) {
    errors.companyName = companyNameError;
    isValid = false;
  }

  // Validate identity number
  const identityNumberError = validateCompanyIdentityNumber(
    formData.identityNumber,
    formData.identityType,
    t
  );
  if (identityNumberError) {
    errors.identityNumber = identityNumberError;
    isValid = false;
  }

  // Validate identity proof
  const identityProofError = validateIdentityProof(formData.identityProof, t);
  if (identityProofError) {
    errors.identityProof = identityProofError;
    isValid = false;
  }

  return { isValid, errors };
};

// Field validation function for real-time validation
export const validateCompanyVerificationField = (
  field: keyof CompanyVerificationFormData,
  value: any,
  formData: CompanyVerificationFormData,
  t: TFunction
): string | null => {
  switch (field) {
    case 'identityType':
      return validateIdentityType(value, t);
    case 'companyName':
      return validateCompanyName(value, t);
    case 'identityNumber':
      return validateCompanyIdentityNumber(value, formData.identityType, t);
    case 'identityProof':
      return validateIdentityProof(value, t);
    default:
      return null;
  }
};
