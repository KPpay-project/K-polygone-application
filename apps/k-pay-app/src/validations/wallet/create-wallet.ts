import { TFunction } from 'i18next';
import {
  CreateWalletFormData,
  CreateWalletFormErrors,
  ValidationResult,
} from '../types';
import { validateCountry, validateCurrency } from '../common/validators';

export const validateCreateWalletForm = (
  formData: CreateWalletFormData,
  t: TFunction
): ValidationResult<CreateWalletFormErrors> => {
  const errors: CreateWalletFormErrors = {};

  const countryError = validateCountry(formData.country, t);
  if (countryError) {
    errors.country = countryError;
  }

  const currencyError = validateCurrency(formData.currency, t);
  if (currencyError) {
    errors.currency = currencyError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCreateWalletField = (
  field: keyof CreateWalletFormData,
  value: string,
  t: TFunction
): string | null => {
  switch (field) {
    case 'country':
      return validateCountry(value, t);
    case 'currency':
      return validateCurrency(value, t);
    default:
      return null;
  }
};
