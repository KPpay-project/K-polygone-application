import { TFunction } from 'i18next';
import { LoginFormData, LoginFormErrors, ValidationResult } from '../types';
import { validateEmail, validatePassword } from '../common/validators';

export const validateLoginForm = (
  formData: LoginFormData,
  t: TFunction
): ValidationResult<LoginFormErrors> => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(formData.email, t);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(formData.password, t, 6);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginField = (
  field: keyof LoginFormData,
  value: string,
  t: TFunction
): string | null => {
  switch (field) {
    case 'email':
      return validateEmail(value, t);
    case 'password':
      return validatePassword(value, t, 6);
    default:
      return null;
  }
};
