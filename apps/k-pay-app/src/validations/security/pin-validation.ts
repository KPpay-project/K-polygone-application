import { TFunction } from 'i18next';

// PIN form data interfaces
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

// Validation functions
export const validatePin = (pin: string, t: TFunction): string | null => {
  if (!pin || pin.trim() === '') {
    return t('pinRequired') || 'PIN is required';
  }

  if (pin.length !== 4) {
    return t('pinMustBe4Digits') || 'PIN must be exactly 4 digits';
  }

  if (!/^\d{4}$/.test(pin)) {
    return t('pinMustBeNumeric') || 'PIN must contain only numbers';
  }

  // Check for weak patterns
  if (/^(.)\1{3}$/.test(pin)) {
    return t('pinTooWeak') || 'PIN cannot be all the same digit';
  }

  if (
    pin === '1234' ||
    pin === '0000' ||
    pin === '1111' ||
    pin === '2222' ||
    pin === '3333' ||
    pin === '4444' ||
    pin === '5555' ||
    pin === '6666' ||
    pin === '7777' ||
    pin === '8888' ||
    pin === '9999' ||
    pin === '0123' ||
    pin === '1357' ||
    pin === '2468'
  ) {
    return (
      t('pinTooCommon') || 'PIN is too common, please choose a more secure PIN'
    );
  }

  return null;
};

export const validateNewPin = (newPin: string, t: TFunction): string | null => {
  return validatePin(newPin, t);
};

export const validateConfirmPin = (
  confirmPin: string,
  newPin: string,
  t: TFunction
): string | null => {
  if (!confirmPin || confirmPin.trim() === '') {
    return t('confirmPinRequired') || 'Please confirm your PIN';
  }

  if (confirmPin !== newPin) {
    return t('pinsDoNotMatch') || 'PINs do not match';
  }

  return null;
};

export const validateCurrentPin = (
  currentPin: string,
  t: TFunction
): string | null => {
  if (!currentPin || currentPin.trim() === '') {
    return t('currentPinRequired') || 'Current PIN is required';
  }

  if (currentPin.length !== 4) {
    return t('pinMustBe4Digits') || 'PIN must be exactly 4 digits';
  }

  if (!/^\d{4}$/.test(currentPin)) {
    return t('pinMustBeNumeric') || 'PIN must contain only numbers';
  }

  return null;
};

// Form validation functions
export const validatePinForm = (
  formData: PinFormData,
  t: TFunction
): { isValid: boolean; errors: PinFormErrors } => {
  const errors: PinFormErrors = {};

  const pinError = validatePin(formData.pin, t);
  if (pinError) errors.pin = pinError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateCreatePinForm = (
  formData: CreatePinFormData,
  t: TFunction
): { isValid: boolean; errors: CreatePinFormErrors } => {
  const errors: CreatePinFormErrors = {};

  const newPinError = validateNewPin(formData.newPin, t);
  if (newPinError) errors.newPin = newPinError;

  if (formData.confirmPin !== undefined) {
    const confirmPinError = validateConfirmPin(
      formData.confirmPin,
      formData.newPin,
      t
    );
    if (confirmPinError) errors.confirmPin = confirmPinError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateChangePinForm = (
  formData: ChangePinFormData,
  t: TFunction
): { isValid: boolean; errors: ChangePinFormErrors } => {
  const errors: ChangePinFormErrors = {};

  const currentPinError = validateCurrentPin(formData.currentPin, t);
  if (currentPinError) errors.currentPin = currentPinError;

  const newPinError = validateNewPin(formData.newPin, t);
  if (newPinError) errors.newPin = newPinError;

  if (formData.confirmPin !== undefined) {
    const confirmPinError = validateConfirmPin(
      formData.confirmPin,
      formData.newPin,
      t
    );
    if (confirmPinError) errors.confirmPin = confirmPinError;
  }

  // Check if new PIN is different from current PIN
  if (
    formData.currentPin &&
    formData.newPin &&
    formData.currentPin === formData.newPin
  ) {
    errors.newPin =
      t('newPinMustBeDifferent') ||
      'New PIN must be different from current PIN';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Field-specific validation for real-time feedback
export const validatePinField = (
  field: keyof (PinFormData | CreatePinFormData | ChangePinFormData),
  value: string,
  formData: Partial<CreatePinFormData | ChangePinFormData>,
  t: TFunction
): string | null => {
  switch (field) {
    case 'pin':
      return validatePin(value, t);
    case 'currentPin':
      return validateCurrentPin(value, t);
    case 'newPin':
      return validateNewPin(value, t);
    case 'confirmPin': {
      const newPin =
        (formData as CreatePinFormData | ChangePinFormData).newPin || '';
      return validateConfirmPin(value, newPin, t);
    }
    default:
      return null;
  }
};
