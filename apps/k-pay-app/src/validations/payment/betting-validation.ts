import { TFunction } from 'i18next';
import {
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validatePattern,
} from '../common/validators';

// Form data interface
export interface BettingFormData {
  country: string;
  provider: string;
  customerId: string;
  amount: number;
  saveAsBeneficiary: boolean;
}

// Form errors interface
export interface BettingFormErrors {
  country?: string;
  provider?: string;
  customerId?: string;
  amount?: string;
}

// Customer ID patterns for different providers
const CUSTOMER_ID_PATTERNS = {
  sporty: /^\d{8,12}$/, // 8-12 digits for Sporty
  betway: /^[a-zA-Z0-9]{6,15}$/, // 6-15 alphanumeric for Betway
  bet365: /^[a-zA-Z0-9]{6,20}$/, // 6-20 alphanumeric for Bet365
  default: /^[a-zA-Z0-9]{4,20}$/, // Default pattern for other providers
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

export const validateCustomerId = (
  customerId: string,
  provider: string,
  t: TFunction
): string | null => {
  // Check if customer ID is provided
  const requiredError = validateRequired(customerId, t, 'customerId');
  if (requiredError) return requiredError;

  // Check minimum length
  const minLengthError = validateMinLength(customerId, 4, t, 'customerId');
  if (minLengthError) return minLengthError;

  // Check maximum length
  const maxLengthError = validateMaxLength(customerId, 20, t, 'customerId');
  if (maxLengthError) return maxLengthError;

  // Validate pattern based on provider
  const pattern =
    CUSTOMER_ID_PATTERNS[provider as keyof typeof CUSTOMER_ID_PATTERNS] ||
    CUSTOMER_ID_PATTERNS.default;
  const patternError = validatePattern(customerId, pattern, t, 'customerId');
  if (patternError) return patternError;

  return null;
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

  // Check maximum amount (e.g., $50,000 or equivalent for betting)
  if (amount > 50000) {
    return t('amountMaxValue');
  }

  return null;
};

// Main form validation function
export const validateBettingForm = (
  formData: BettingFormData,
  t: TFunction
): BettingFormErrors => {
  const errors: BettingFormErrors = {};

  // Validate country
  const countryError = validateCountry(formData.country, t);
  if (countryError) errors.country = countryError;

  // Validate provider
  const providerError = validateProvider(formData.provider, t);
  if (providerError) errors.provider = providerError;

  // Validate customer ID
  const customerIdError = validateCustomerId(
    formData.customerId,
    formData.provider,
    t
  );
  if (customerIdError) errors.customerId = customerIdError;

  // Validate amount
  const amountError = validateAmount(formData.amount, t);
  if (amountError) errors.amount = amountError;

  return errors;
};

// Field-specific validation function
export const validateBettingField = (
  fieldName: keyof BettingFormData,
  value: any,
  formData: BettingFormData,
  t: TFunction
): string | null => {
  switch (fieldName) {
    case 'country':
      return validateCountry(value, t);
    case 'provider':
      return validateProvider(value, t);
    case 'customerId':
      return validateCustomerId(value, formData.provider, t);
    case 'amount':
      return validateAmount(value, t);
    default:
      return null;
  }
};
