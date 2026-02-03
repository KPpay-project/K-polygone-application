import { getTranslation } from '@/utils/helpers';
import z from 'zod';

const luhnCheck = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

const validateExpiryDate = (value: string): boolean => {
  if (!value) return false;

  const [month, year] = value.split('/');
  if (!month || !year) return false;

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (monthNum < 1 || monthNum > 12) return false;
  if (yearNum < 0 || yearNum > 99) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return false;
  }

  return true;
};

export const addCardSchema = () =>
  z.object({
    cardNumber: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 13 && digits.length <= 19;
        },
        {
          message: getTranslation('validation.cardNumber.length')
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cardNumber.format')
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return luhnCheck(digits);
        },
        {
          message: getTranslation('validation.cardNumber.invalid')
        }
      ),
    expiryDate: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .refine(
        (value) => {
          return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value);
        },
        {
          message: getTranslation('validation.expiryDate.format')
        }
      )
      .refine(
        (value) => {
          return validateExpiryDate(value);
        },
        {
          message: getTranslation('validation.expiryDate.expired')
        }
      ),
    CVV: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 3 && digits.length <= 4;
        },
        {
          message: getTranslation('validation.cvv.length')
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format')
        }
      )
  });

export const transactionPinSchema = () =>
  z.object({
    pin: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 4 && digits.length <= 4;
        },
        {
          message: getTranslation('validation.cvv.length')
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format')
        }
      )
  });

export const withdrawalRequestPinSchema = () =>
  z.object({
    pin: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 5 && digits.length <= 6;
        },
        {
          message: getTranslation('validation.cvv.length')
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format')
        }
      )
  });

export const withdrawalSchema = () =>
  z.object({
    paymentMethod: z.string(),
    amount: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 4 && digits.length <= 4;
        },
        {
          message: getTranslation('validation.cvv.length')
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format')
        }
      ),
    accountNumber: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format')
        }
      )
  });

export const exchangeSchema = () =>
  z
    .object({
      currencyFrom: z.string(),
      currencyTo: z.string(),
      amountFrom: z
        .string()
        .refine(
          (value) => {
            if (!value || value === '') return true; // Allow empty values for real-time conversion
            return /^\d*\.?\d*$/.test(value);
          },
          {
            message: getTranslation('validation.cvv.length')
          }
        )
        .refine(
          (value) => {
            if (!value || value === '') return true; // Allow empty values for real-time conversion
            return parseFloat(value) > 0;
          },
          {
            message: getTranslation('validation.cvv.format')
          }
        ),
      amountTo: z
        .string()
        .refine(
          (value) => {
            if (!value || value === '') return true; // Allow empty values for real-time conversion
            return /^\d*\.?\d*$/.test(value);
          },
          {
            message: getTranslation('validation.cvv.length')
          }
        )
        .refine(
          (value) => {
            if (!value || value === '') return true; // Allow empty values for real-time conversion
            return parseFloat(value) > 0;
          },
          {
            message: getTranslation('validation.cvv.format')
          }
        )
    })
    .refine(
      (data) => {
        // At least one amount field should have a value when submitting
        return (data.amountFrom && data.amountFrom !== '') || (data.amountTo && data.amountTo !== '');
      },
      {
        message: getTranslation('validation.required'),
        path: ['amountFrom'] // Show error on amountFrom field
      }
    );

export const editProfileSchema = () =>
  z.object({
    firstName: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 })
    }),
    lastName: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 })
    }),
    email: z.string().email({
      message: getTranslation('validation.email')
    }),
    phone: z.string().min(10, {
      message: getTranslation('validation.phoneNumber')
    }),

    gender: z.string({
      message: getTranslation('validation.required')
    }),
    dateOfBirth: z.string({
      message: getTranslation('validation.required')
    })
  });

export const editProfileAddressSchema = () =>
  z.object({
    country: z.string({
      error: getTranslation('validation.required')
    }),

    street: z.string({
      error: getTranslation('validation.required')
    }),
    city: z.string({
      error: getTranslation('validation.required')
    }),

    timezone: z.string({
      error: getTranslation('validation.required')
    })
  });

export const identityVerificationSchema = () =>
  z.object({
    identityType: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 })
    }),
    identityNumber: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 })
    }),
    expiringDate: z.string().email({
      message: getTranslation('validation.email')
    }),
    attachment: z
      .string({
        message: getTranslation('validation.attachment.required')
      })
      .min(1, { message: getTranslation('validation.attachment.required') })
      .optional()
      .refine((val) => !val || /\.(pdf|jpg|png)$/i.test(val), {
        message: getTranslation('validation.attachment.invalidType')
      })
  });

export const companyVerificationSchema = () =>
  z.object({
    identityType: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 })
    }),
    companyName: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 })
    }),
    expiringDate: z.string().email({
      message: getTranslation('validation.email')
    }),
    attachment: z
      .string({
        message: getTranslation('validation.attachment.required')
      })
      .min(1, { message: getTranslation('validation.attachment.required') })
      .optional()
      .refine((val) => !val || /\.(pdf|jpg|png)$/i.test(val), {
        message: getTranslation('validation.attachment.invalidType')
      })
  });

export const addressVerificationSchema = () =>
  z.object({
    address: z.string({
      message: getTranslation('validation.required')
    }),
    attachment: z
      .string({
        message: getTranslation('validation.attachment.required')
      })
      .min(1, { message: getTranslation('validation.attachment.required') })
      .optional()
      .refine((val) => !val || /\.(pdf|jpg|png)$/i.test(val), {
        message: getTranslation('validation.attachment.invalidType')
      })
  });

export const transferSchema = () =>
  z.object({
    amount: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .refine(
        (value) => {
          const numericValue = parseFloat(value.replace(/,/g, ''));
          return !isNaN(numericValue) && numericValue > 0;
        },
        {
          message: getTranslation('validation.amountNumeric')
        }
      ),
    destination: z
      .string()
      .min(1, {
        message: getTranslation('validation.required')
      })
      .min(5, {
        message: getTranslation('validation.minLength', { min: 5 })
      }),
    currency: z.string({
      message: getTranslation('validation.selectValidCurrency')
    })
  });
