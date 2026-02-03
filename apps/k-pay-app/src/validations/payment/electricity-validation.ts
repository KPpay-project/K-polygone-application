import { TFunction } from 'i18next';
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
} from '../common/validators';

// Form data interface
export interface ElectricityFormData {
  country: string;
  provider: string;
  meterNumber: string;
  meterType: string;
  amount: number;
  saveAsBeneficiary: boolean;
}

// Form errors interface
export interface ElectricityFormErrors {
  country?: string;
  provider?: string;
  meterNumber?: string;
  meterType?: string;
  amount?: string;
}

// Meter number patterns for different providers
const METER_NUMBER_PATTERNS = {
  kplc: /^\d{11}$/, // 11 digits for KPLC
  umeme: /^\d{8,12}$/, // 8-12 digits for Umeme
  eneo: /^\d{10}$/, // 10 digits for Eneo
  eko: /^\d{11}$/, // 11 digits for Eko
  ikeja: /^\d{11}$/, // 11 digits for Ikeja
  default: /^\d{8,12}$/, // Default pattern for other providers
};

// Individual validation functions
export const validateCountry = (
  country: string,
  t: TFunction
): string | null => {
  return validateRequired(country, t, 'country');
};

export const validateProvider = (
  provider: string,
  t: TFunction
): string | null => {
  return validateRequired(provider, t, 'provider');
};

export const validateMeterNumber = (
  meterNumber: string,
  provider: string,
  t: TFunction
): string | null => {
  // Check if meter number is provided
  const requiredError = validateRequired(meterNumber, t, 'meterNumber');
  if (requiredError) return requiredError;

  // Check minimum length
  const minLengthError = validateMinLength(meterNumber, 8, t, 'meterNumber');
  if (minLengthError) return minLengthError;

  // Check maximum length
  const maxLengthError = validateMaxLength(meterNumber, 12, t, 'meterNumber');
  if (maxLengthError) return maxLengthError;

  // Validate pattern based on provider
  const pattern =
    METER_NUMBER_PATTERNS[provider as keyof typeof METER_NUMBER_PATTERNS] ||
    METER_NUMBER_PATTERNS.default;
  const patternError = validatePattern(meterNumber, pattern, t, 'meterNumber');
  if (patternError) return patternError;

  return null;
};

export const validateMeterType = (
  meterType: string,
  t: TFunction
): string | null => {
  return validateRequired(meterType, t, 'meterType');
};

export const validateAmount = (amount: number, t: TFunction): string | null => {
  // Check if amount is provided and greater than 0
  if (!amount || amount <= 0) {
    return t('amountRequired');
  }

  // Check minimum amount (e.g., $1 or equivalent)
  if (amount < 1) {
    return t('amountMinValue');
  }

  // Check maximum amount (e.g., $10,000 or equivalent)
  if (amount > 10000) {
    return t('amountMaxValue');
  }

  return null;
};

// Main form validation function
export const validateElectricityForm = (
  formData: ElectricityFormData,
  t: TFunction
): ElectricityFormErrors => {
  const errors: ElectricityFormErrors = {};

  // Validate country
  const countryError = validateCountry(formData.country, t);
  if (countryError) errors.country = countryError;

  // Validate provider
  const providerError = validateProvider(formData.provider, t);
  if (providerError) errors.provider = providerError;

  // Validate meter number
  const meterNumberError = validateMeterNumber(
    formData.meterNumber,
    formData.provider,
    t
  );
  if (meterNumberError) errors.meterNumber = meterNumberError;

  // Validate meter type
  const meterTypeError = validateMeterType(formData.meterType, t);
  if (meterTypeError) errors.meterType = meterTypeError;

  // Validate amount
  const amountError = validateAmount(formData.amount, t);
  if (amountError) errors.amount = amountError;

  return errors;
};

// Field-specific validation function
export const validateElectricityField = (
  fieldName: keyof ElectricityFormData,
  value: any,
  formData: ElectricityFormData,
  t: TFunction
): string | null => {
  switch (fieldName) {
    case 'country':
      return validateCountry(value, t);
    case 'provider':
      return validateProvider(value, t);
    case 'meterNumber':
      return validateMeterNumber(value, formData.provider, t);
    case 'meterType':
      return validateMeterType(value, t);
    case 'amount':
      return validateAmount(value, t);
    default:
      return null;
  }
};
