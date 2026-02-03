import { TFunction } from 'i18next';

// Common validation patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[+]?[1-9]\d{1,14}$/;
export const PASSWORD_COMPLEXITY_REGEX = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// Base validation functions
export const validateRequired = (
  value: string,
  t: TFunction,
  fieldName: string
): string | null => {
  if (!value || !value.trim()) {
    return t(`${fieldName}Required`);
  }
  return null;
};

export const validateMinLength = (
  value: string,
  minLength: number,
  t: TFunction,
  fieldName: string
): string | null => {
  if (value && value.trim().length < minLength) {
    return t(`${fieldName}MinLength`);
  }
  return null;
};

export const validateMaxLength = (
  value: string,
  maxLength: number,
  t: TFunction,
  fieldName: string
): string | null => {
  if (value && value.trim().length > maxLength) {
    return t(`${fieldName}MaxLength`);
  }
  return null;
};

export const validatePattern = (
  value: string,
  pattern: RegExp,
  t: TFunction,
  fieldName: string
): string | null => {
  if (value && !pattern.test(value)) {
    return t(`${fieldName}Invalid`);
  }
  return null;
};

// Specific field validators
export const validateEmail = (email: string, t: TFunction): string | null => {
  const requiredError = validateRequired(email, t, 'email');
  if (requiredError) return requiredError;

  return validatePattern(email, EMAIL_REGEX, t, 'email');
};

export const validatePassword = (
  password: string,
  t: TFunction,
  minLength: number = 6
): string | null => {
  const requiredError = validateRequired(password, t, 'password');
  if (requiredError) return requiredError;

  return validateMinLength(password, minLength, t, 'password');
};

export const validateStrongPassword = (
  password: string,
  t: TFunction
): string | null => {
  const requiredError = validateRequired(password, t, 'password');
  if (requiredError) return requiredError;

  const minLengthError = validateMinLength(password, 8, t, 'password');
  if (minLengthError) return minLengthError;

  return validatePattern(
    password,
    PASSWORD_COMPLEXITY_REGEX,
    t,
    'passwordComplexity'
  );
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
  t: TFunction
): string | null => {
  const requiredError = validateRequired(confirmPassword, t, 'confirmPassword');
  if (requiredError) return requiredError;

  if (password !== confirmPassword) {
    return t('passwordsNotMatch');
  }

  return null;
};

export const validatePhoneNumber = (
  phoneNumber: string,
  t: TFunction
): string | null => {
  const requiredError = validateRequired(phoneNumber, t, 'phone');
  if (requiredError) return requiredError;

  const cleanPhone = phoneNumber.replace(/\s/g, '');
  return validatePattern(cleanPhone, PHONE_REGEX, t, 'phone');
};

export const validateName = (
  name: string,
  t: TFunction,
  fieldName: string
): string | null => {
  const requiredError = validateRequired(name, t, fieldName);
  if (requiredError) return requiredError;

  return validateMinLength(name, 2, t, fieldName);
};

export const validateCountry = (
  country: string,
  t: TFunction
): string | null => {
  return validateRequired(country, t, 'country');
};

export const validateCurrency = (
  currency: string,
  t: TFunction
): string | null => {
  return validateRequired(currency, t, 'currency');
};
