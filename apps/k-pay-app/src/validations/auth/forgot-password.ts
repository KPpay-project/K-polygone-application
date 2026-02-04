import { TFunction } from 'i18next';
import {
  ForgotPasswordFormData,
  ForgotPasswordFormErrors,
  ValidationResult,
} from '../types';
import { validateEmail } from '../common/validators';

export const validateForgotPasswordForm = (
  formData: ForgotPasswordFormData,
  t: TFunction
): ValidationResult<ForgotPasswordFormErrors> => {
  const errors: ForgotPasswordFormErrors = {};

  // Email validation
  const emailError = validateEmail(formData.email, t);
  if (emailError) {
    errors.email = emailError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateForgotPasswordField = (
  field: keyof ForgotPasswordFormData,
  value: string,
  t: TFunction
): string | null => {
  switch (field) {
    case 'email':
      return validateEmail(value, t);
    default:
      return null;
  }
};
