import { TFunction } from 'i18next';
import { validateRequired, validatePhoneNumber } from '../common/validators';

// Form data interface
export interface AirtimeFormData {
  country: string;
  network: string;
  phoneNumber: string;
  amount: number;
}

// Form errors interface
export interface AirtimeFormErrors {
  country?: string;
  network?: string;
  phoneNumber?: string;
  amount?: string;
}

// Individual validation functions
export const validateCountry = (
  country: string,
  t: TFunction
): string | null => {
  return validateRequired(country, t, 'country');
};

export const validateNetwork = (
  network: string,
  t: TFunction
): string | null => {
  return validateRequired(network, t, 'network');
};

export const validateAirtimePhoneNumber = (
  phoneNumber: string,
  country: string,
  t: TFunction
): string | null => {
  // Check if phone number is provided
  const requiredError = validateRequired(phoneNumber, t, 'phoneNumber');
  if (requiredError) return requiredError;

  // Use the common phone number validator
  const phoneError = validatePhoneNumber(phoneNumber, t);
  if (phoneError) return phoneError;

  // Additional validation for specific countries if needed
  // This can be extended based on country-specific phone number formats

  return null;
};

export const validateAirtimeAmount = (
  amount: number,
  t: TFunction
): string | null => {
  // Check if amount is provided and greater than 0
  if (!amount || amount <= 0) {
    return t('amountRequired');
  }

  // Check minimum amount (e.g., $1 or equivalent)
  if (amount < 1) {
    return t('amountMinValue');
  }

  // Check maximum amount (e.g., $1,000 or equivalent for airtime)
  if (amount > 1000) {
    return t('amountMaxValue');
  }

  return null;
};

// Main form validation function
export const validateAirtimeForm = (
  formData: AirtimeFormData,
  t: TFunction
): AirtimeFormErrors => {
  const errors: AirtimeFormErrors = {};

  // Validate country
  const countryError = validateCountry(formData.country, t);
  if (countryError) errors.country = countryError;

  // Validate network
  const networkError = validateNetwork(formData.network, t);
  if (networkError) errors.network = networkError;

  // Validate phone number
  const phoneError = validateAirtimePhoneNumber(
    formData.phoneNumber,
    formData.country,
    t
  );
  if (phoneError) errors.phoneNumber = phoneError;

  // Validate amount
  const amountError = validateAirtimeAmount(formData.amount, t);
  if (amountError) errors.amount = amountError;

  return errors;
};

// Field-specific validation function
export const validateAirtimeField = (
  fieldName: keyof AirtimeFormData,
  value: any,
  formData: AirtimeFormData,
  t: TFunction
): string | null => {
  switch (fieldName) {
    case 'country':
      return validateCountry(value, t);
    case 'network':
      return validateNetwork(value, t);
    case 'phoneNumber':
      return validateAirtimePhoneNumber(value, formData.country, t);
    case 'amount':
      return validateAirtimeAmount(value, t);
    default:
      return null;
  }
};
