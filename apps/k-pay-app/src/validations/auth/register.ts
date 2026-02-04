import { TFunction } from 'i18next';
import {
  RegisterFormData,
  RegisterFormErrors,
  ValidationResult,
} from '../types';
import {
  validateEmail,
  validateStrongPassword,
  validateConfirmPassword,
  validatePhoneNumber,
  validateName,
  validateCountry,
} from '../common/validators';

export const validateRegisterForm = (
  formData: RegisterFormData,
  t: TFunction
): ValidationResult<RegisterFormErrors> => {
  const errors: RegisterFormErrors = {};

  // First Name validation
  const firstNameError = validateName(formData.firstName, t, 'firstName');
  if (firstNameError) {
    errors.firstName = firstNameError;
  }

  // Last Name validation
  const lastNameError = validateName(formData.lastName, t, 'lastName');
  if (lastNameError) {
    errors.lastName = lastNameError;
  }

  // Email validation
  const emailError = validateEmail(formData.email, t);
  if (emailError) {
    errors.email = emailError;
  }

  // Phone Number validation
  const phoneError = validatePhoneNumber(formData.phoneNumber, t);
  if (phoneError) {
    errors.phoneNumber = phoneError;
  }

  // Country validation
  const countryError = validateCountry(formData.countryOfResidence, t);
  if (countryError) {
    errors.countryOfResidence = countryError;
  }

  // Password validation (strong password requirements)
  const passwordError = validateStrongPassword(formData.password, t);
  if (passwordError) {
    errors.password = passwordError;
  }

  // Confirm Password validation
  const confirmPasswordError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword,
    t
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateRegisterField = (
  field: keyof RegisterFormData,
  value: string,
  formData: RegisterFormData,
  t: TFunction
): string | null => {
  switch (field) {
    case 'firstName':
      return validateName(value, t, 'firstName');
    case 'lastName':
      return validateName(value, t, 'lastName');
    case 'email':
      return validateEmail(value, t);
    case 'phoneNumber':
      return validatePhoneNumber(value, t);
    case 'countryOfResidence':
      return validateCountry(value, t);
    case 'password':
      return validateStrongPassword(value, t);
    case 'confirmPassword':
      return validateConfirmPassword(formData.password, value, t);
    default:
      return null;
  }
};
