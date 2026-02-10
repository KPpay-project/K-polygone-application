import { TFunction } from 'i18next';
import {
  validateRequired,
  validateMinLength,
  validatePattern,
} from '../common/validators';

// Address verification form types
export interface AddressVerificationFormData {
  addressType: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  utilityBill?: string;
}

export interface AddressVerificationFormErrors {
  addressType?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  utilityBill?: string;
  general?: string;
}

export interface ValidationResult<T = Record<string, string | undefined>> {
  isValid: boolean;
  errors: T;
}

// Postal code patterns for different countries
const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
  nigeria: /^\d{6}$/,
  ghana: /^[A-Z]{2}\d{3}\d{4}$/,
  kenya: /^\d{5}$/,
  south_africa: /^\d{4}$/,
  default: /^[A-Za-z0-9\s-]{3,10}$/,
};

// Validation functions
export const validateAddressType = (
  addressType: string,
  t: TFunction
): string | null => {
  return validateRequired(addressType, t, 'addressType');
};

export const validateStreetAddress = (
  streetAddress: string,
  t: TFunction
): string | null => {
  const requiredError = validateRequired(streetAddress, t, 'streetAddress');
  if (requiredError) return requiredError;

  return validateMinLength(streetAddress, 5, t, 'streetAddress');
};

export const validateCity = (city: string, t: TFunction): string | null => {
  const requiredError = validateRequired(city, t, 'city');
  if (requiredError) return requiredError;

  return validateMinLength(city, 2, t, 'city');
};

export const validateState = (state: string, t: TFunction): string | null => {
  const requiredError = validateRequired(state, t, 'state');
  if (requiredError) return requiredError;

  return validateMinLength(state, 2, t, 'state');
};

export const validatePostalCode = (
  postalCode: string,
  country: string,
  t: TFunction
): string | null => {
  if (!postalCode.trim()) {
    return null; // Postal code is optional
  }

  const pattern = POSTAL_CODE_PATTERNS[country] || POSTAL_CODE_PATTERNS.default;
  return validatePattern(postalCode, pattern, t, 'postalCode');
};

export const validateCountry = (
  country: string,
  t: TFunction
): string | null => {
  return validateRequired(country, t, 'country');
};

// Form validation
export const validateAddressVerificationForm = (
  formData: AddressVerificationFormData,
  t: TFunction
): ValidationResult<AddressVerificationFormErrors> => {
  const errors: AddressVerificationFormErrors = {};

  // Address Type validation
  const addressTypeError = validateAddressType(formData.addressType, t);
  if (addressTypeError) {
    errors.addressType = addressTypeError;
  }

  // Street Address validation
  const streetAddressError = validateStreetAddress(formData.streetAddress, t);
  if (streetAddressError) {
    errors.streetAddress = streetAddressError;
  }

  // City validation
  const cityError = validateCity(formData.city, t);
  if (cityError) {
    errors.city = cityError;
  }

  // State validation
  const stateError = validateState(formData.state, t);
  if (stateError) {
    errors.state = stateError;
  }

  // Country validation
  const countryError = validateCountry(formData.country, t);
  if (countryError) {
    errors.country = countryError;
  }

  // Postal Code validation (optional)
  const postalCodeError = validatePostalCode(
    formData.postalCode,
    formData.country,
    t
  );
  if (postalCodeError) {
    errors.postalCode = postalCodeError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Individual field validation
export const validateAddressVerificationField = (
  field: keyof AddressVerificationFormData,
  value: string,
  formData: AddressVerificationFormData,
  t: TFunction
): string | null => {
  switch (field) {
    case 'addressType':
      return validateAddressType(value, t);
    case 'streetAddress':
      return validateStreetAddress(value, t);
    case 'city':
      return validateCity(value, t);
    case 'state':
      return validateState(value, t);
    case 'postalCode':
      return validatePostalCode(value, formData.country, t);
    case 'country':
      return validateCountry(value, t);
    default:
      return null;
  }
};
