import { TFunction } from 'i18next';
import {
  ResetPasswordFormData,
  ResetPasswordFormErrors,
  ValidationResult,
} from '../types';
import {
  validateStrongPassword,
  validateConfirmPassword,
} from '../common/validators';

export const validateResetPasswordForm = (
  formData: ResetPasswordFormData,
  t: TFunction
): ValidationResult<ResetPasswordFormErrors> => {
  const errors: ResetPasswordFormErrors = {};

  // New Password validation (strong password requirements)
  const passwordError = validateStrongPassword(formData.newPassword, t);
  if (passwordError) {
    errors.newPassword = passwordError;
  }

  // Confirm Password validation
  const confirmPasswordError = validateConfirmPassword(
    formData.newPassword,
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

export const validateResetPasswordField = (
  field: keyof ResetPasswordFormData,
  value: string,
  formData: ResetPasswordFormData,
  t: TFunction
): string | null => {
  switch (field) {
    case 'newPassword':
      return validateStrongPassword(value, t);
    case 'confirmPassword':
      return validateConfirmPassword(formData.newPassword, value, t);
    default:
      return null;
  }
};
