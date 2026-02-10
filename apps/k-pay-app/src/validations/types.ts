// Common validation types
export interface ValidationResult<T = Record<string, string | undefined>> {
  isValid: boolean;
  errors: T;
}

export interface ValidationRule<T = any> {
  validate: (value: T, formData?: any) => string | null;
}

export interface FieldValidationConfig {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any, formData?: any) => string | null;
}

// Auth form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  countryOfResidence: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  countryOfResidence?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  general?: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordFormErrors {
  newPassword?: string;
  confirmPassword?: string;
  general?: string;
}

// Wallet form types
export interface CreateWalletFormData {
  country: string;
  currency: string;
}

export interface CreateWalletFormErrors {
  country?: string;
  currency?: string;
}

// PIN form types
export interface PinFormData {
  pin: string;
}

export interface PinFormErrors {
  pin?: string;
}

export interface CreatePinFormData {
  newPin: string;
  confirmPin?: string;
}

export interface CreatePinFormErrors {
  newPin?: string;
  confirmPin?: string;
}

export interface ChangePinFormData {
  currentPin: string;
  newPin: string;
  confirmPin?: string;
}

export interface ChangePinFormErrors {
  currentPin?: string;
  newPin?: string;
  confirmPin?: string;
}
