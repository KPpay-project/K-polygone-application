import {
  validateRequired,
  validateMinLength,
  validatePattern,
} from '../common/validators';
import type { TFunction } from 'i18next';

export interface IdentityVerificationFormData {
  identityType: string;
  identityNumber: string;
  expiringDate: string;
  identityProof: string | null;
}

export interface IdentityVerificationFormErrors {
  identityType?: string;
  identityNumber?: string;
  expiringDate?: string;
  identityProof?: string;
}

// Identity number patterns for different document types
const IDENTITY_PATTERNS = {
  passport: /^[A-Z0-9]{6,12}$/i,
  national_id: /^[A-Z0-9]{8,15}$/i,
  drivers_license: /^[A-Z0-9]{8,20}$/i,
  voter_id: /^[A-Z0-9]{8,15}$/i,
};

// Validation functions for individual fields
export const validateIdentityType = (
  value: string,
  t: TFunction
): string | null => {
  const requiredResult = validateRequired(value, t, 'identityType');
  if (requiredResult) return requiredResult;

  const validTypes = ['passport', 'national_id', 'drivers_license', 'voter_id'];
  if (!validTypes.includes(value)) {
    return t('identityTypeInvalid');
  }

  return null;
};

export const validateIdentityNumber = (
  value: string,
  identityType: string,
  t: TFunction
): string | null => {
  const requiredResult = validateRequired(value, t, 'identityNumber');
  if (requiredResult) return requiredResult;

  const minLengthResult = validateMinLength(value, 6, t, 'identityNumber');
  if (minLengthResult) return minLengthResult;

  // Validate pattern based on identity type
  if (
    identityType &&
    IDENTITY_PATTERNS[identityType as keyof typeof IDENTITY_PATTERNS]
  ) {
    const pattern =
      IDENTITY_PATTERNS[identityType as keyof typeof IDENTITY_PATTERNS];
    const patternResult = validatePattern(value, pattern, t, 'identityNumber');
    if (patternResult) return patternResult;
  }

  return null;
};

export const validateExpiringDate = (
  value: string,
  t: TFunction
): string | null => {
  const requiredResult = validateRequired(value, t, 'expiringDate');
  if (requiredResult) return requiredResult;

  // Validate date format (assuming YYYY-MM-DD or similar)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) {
    return t('expiringDateInvalid');
  }

  // Validate that the date is in the future
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  if (selectedDate <= today) {
    return t('expiringDateFuture');
  }

  return null;
};

export const validateIdentityProof = (
  value: string | null,
  t: TFunction
): string | null => {
  if (!value) {
    return t('identityProofRequired') || t('pleaseUploadIdentityDocument');
  }

  return null;
};

// Main form validation function
export const validateIdentityVerificationForm = (
  formData: IdentityVerificationFormData,
  t: TFunction
): {
  isValid: boolean;
  errors: IdentityVerificationFormErrors;
} => {
  const errors: IdentityVerificationFormErrors = {};

  // Validate identity type
  const identityTypeResult = validateIdentityType(formData.identityType, t);
  if (identityTypeResult) {
    errors.identityType = identityTypeResult;
  }

  // Validate identity number
  const identityNumberResult = validateIdentityNumber(
    formData.identityNumber,
    formData.identityType,
    t
  );
  if (identityNumberResult) {
    errors.identityNumber = identityNumberResult;
  }

  // Validate expiring date
  const expiringDateResult = validateExpiringDate(formData.expiringDate, t);
  if (expiringDateResult) {
    errors.expiringDate = expiringDateResult;
  }

  // Validate identity proof
  const identityProofResult = validateIdentityProof(formData.identityProof, t);
  if (identityProofResult) {
    errors.identityProof = identityProofResult;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Individual field validation function
export const validateIdentityVerificationField = (
  field: keyof IdentityVerificationFormData,
  value: any,
  formData: IdentityVerificationFormData,
  t: TFunction
): string | null => {
  switch (field) {
    case 'identityType':
      return validateIdentityType(value, t);
    case 'identityNumber':
      return validateIdentityNumber(value, formData.identityType, t);
    case 'expiringDate':
      return validateExpiringDate(value, t);
    case 'identityProof':
      return validateIdentityProof(value, t);
    default:
      return null;
  }
};
