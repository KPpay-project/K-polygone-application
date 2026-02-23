const getTranslation = (key: string, params?: any): string => {
  const translations: Record<string, string> = {
    'validation.country.required': 'Country is required',
    'validation.street.min': 'Street must be at least 3 characters',
    'validation.street.max': 'Street must be at most 100 characters',
    'validation.street.format': 'Street contains invalid characters',
    'validation.city.min': 'City must be at least 2 characters',
    'validation.city.max': 'City must be at most 50 characters',
    'validation.city.format': 'City contains invalid characters',
    'validation.postalCode.min': 'Postal code must be at least 3 characters',
    'validation.postalCode.max': 'Postal code must be at most 10 characters',
    'validation.postalCode.format': 'Postal code contains invalid characters',
    'validation.mailingAddress.max':
      'Mailing address must be at most 100 characters',
    'validation.mailingAddress.format':
      'Mailing address contains invalid characters',
    'validation.phone.min': 'Phone number must be at least 10 digits',
    'validation.phone.max': 'Phone number must be at most 15 digits',
    'validation.phone.format': 'Phone number contains invalid characters',
    'validation.email.format': 'Invalid email format',
    'validation.required': 'This field is required',
    'validation.cardNumber.length': 'Card number must be between 13-19 digits',
    'validation.cardNumber.format': 'Card number contains invalid characters',
    'validation.cardNumber.invalid': 'Invalid card number',
    'validation.expiryDate.format': 'Expiry date must be in MM/YY format',
    'validation.expiryDate.expired': 'Card has expired',
    'validation.cvv.length': 'CVV must be 3-4 digits',
    'validation.cvv.format': 'CVV contains invalid characters',
  };
  return translations[key] || key;
};
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

  if (
    yearNum < currentYear ||
    (yearNum === currentYear && monthNum < currentMonth)
  ) {
    return false;
  }

  return true;
};

export const addCardSchema = () =>
  z.object({
    cardNumber: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 13 && digits.length <= 19;
        },
        {
          message: getTranslation('validation.cardNumber.length'),
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cardNumber.format'),
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return luhnCheck(digits);
        },
        {
          message: getTranslation('validation.cardNumber.invalid'),
        }
      ),
    expiryDate: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .refine(
        (value) => {
          return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value);
        },
        {
          message: getTranslation('validation.expiryDate.format'),
        }
      )
      .refine(
        (value) => {
          return validateExpiryDate(value);
        },
        {
          message: getTranslation('validation.expiryDate.expired'),
        }
      ),
    CVV: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 3 && digits.length <= 4;
        },
        {
          message: getTranslation('validation.cvv.length'),
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format'),
        }
      ),
  });

export const transactionPinSchema = () =>
  z.object({
    pin: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 4 && digits.length <= 4;
        },
        {
          message: getTranslation('validation.cvv.length'),
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format'),
        }
      ),
  });

export const withdrawalRequestPinSchema = () =>
  z.object({
    pin: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 5 && digits.length <= 6;
        },
        {
          message: getTranslation('validation.cvv.length'),
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format'),
        }
      ),
  });

export const withdrawalSchema = () =>
  z.object({
    paymentMethod: z.string(),
    amount: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return digits.length >= 4 && digits.length <= 4;
        },
        {
          message: getTranslation('validation.cvv.length'),
        }
      )
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format'),
        }
      ),
    accountNumber: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .refine(
        (value) => {
          const digits = value.replace(/\D/g, '');
          return /^\d+$/.test(digits);
        },
        {
          message: getTranslation('validation.cvv.format'),
        }
      ),
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
            if (!value || value === '') return true;
            return /^\d*\.?\d*$/.test(value);
          },
          {
            message: getTranslation('validation.cvv.length'),
          }
        )
        .refine(
          (value) => {
            if (!value || value === '') return true;
            return parseFloat(value) > 0;
          },
          {
            message: getTranslation('validation.cvv.format'),
          }
        ),
      amountTo: z
        .string()
        .refine(
          (value) => {
            if (!value || value === '') return true;
            return /^\d*\.?\d*$/.test(value);
          },
          {
            message: getTranslation('validation.cvv.length'),
          }
        )
        .refine(
          (value) => {
            if (!value || value === '') return true;
            return parseFloat(value) > 0;
          },
          {
            message: getTranslation('validation.cvv.format'),
          }
        ),
    })
    .refine(
      (data) => {
        return (
          (data.amountFrom && data.amountFrom !== '') ||
          (data.amountTo && data.amountTo !== '')
        );
      },
      {
        message: getTranslation('validation.required'),
        path: ['amountFrom'],
      }
    );

export const editProfileSchema = () =>
  z.object({
    firstName: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 }),
    }),
    lastName: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 }),
    }),
    email: z.string().email({
      message: getTranslation('validation.email'),
    }),
    phone: z.string().min(10, {
      message: getTranslation('validation.phoneNumber'),
    }),

    gender: z.string({
      message: getTranslation('validation.required'),
    }),
    dateOfBirth: z.string({
      message: getTranslation('validation.required'),
    }),
  });

export const editProfileAddressSchema = () =>
  z.object({
    country: z.string({
      error: getTranslation('validation.required'),
    }),

    street: z.string({
      error: getTranslation('validation.required'),
    }),
    city: z.string({
      error: getTranslation('validation.required'),
    }),

    timezone: z.string({
      error: getTranslation('validation.required'),
    }),
  });

export const identityVerificationSchema = () =>
  z.object({
    identityType: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 }),
    }),
    identityNumber: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 }),
    }),
    expiringDate: z.string().email({
      message: getTranslation('validation.email'),
    }),
    attachment: z
      .string({
        message: getTranslation('validation.attachment.required'),
      })
      .min(1, { message: getTranslation('validation.attachment.required') })
      .optional()
      .refine((val) => !val || /\.(pdf|jpg|png)$/i.test(val), {
        message: getTranslation('validation.attachment.invalidType'),
      }),
  });

export const companyVerificationSchema = () =>
  z.object({
    identityType: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 }),
    }),
    companyName: z.string().min(2, {
      message: getTranslation('validation.minLength', { min: 2 }),
    }),
    expiringDate: z.string().email({
      message: getTranslation('validation.email'),
    }),
    attachment: z
      .string({
        message: getTranslation('validation.attachment.required'),
      })
      .min(1, { message: getTranslation('validation.attachment.required') })
      .optional()
      .refine((val) => !val || /\.(pdf|jpg|png)$/i.test(val), {
        message: getTranslation('validation.attachment.invalidType'),
      }),
  });

export const addressVerificationSchema = () =>
  z.object({
    address: z.string({
      message: getTranslation('validation.required'),
    }),
    attachment: z
      .string({
        message: getTranslation('validation.attachment.required'),
      })
      .min(1, { message: getTranslation('validation.attachment.required') })
      .optional()
      .refine((val) => !val || /\.(pdf|jpg|png)$/i.test(val), {
        message: getTranslation('validation.attachment.invalidType'),
      }),
  });

export const contactInfoSchema = () =>
  z.object({
    country: z.string().min(2, {
      message: getTranslation('validation.country.required'),
    }),
    street: z
      .string()
      .min(3, {
        message: getTranslation('validation.street.min'),
      })
      .max(100, {
        message: getTranslation('validation.street.max'),
      })
      .regex(/^[A-Za-z0-9\s.,'/-]+$/, {
        message: getTranslation('validation.street.format'),
      }),
    city: z
      .string()
      .min(2, {
        message: getTranslation('validation.city.min'),
      })
      .max(50, {
        message: getTranslation('validation.city.max'),
      })
      .regex(/^[A-Za-z\s.'/-]+$/, {
        message: getTranslation('validation.city.format'),
      }),
    postalCode: z
      .string()
      .min(3, {
        message: getTranslation('validation.postalCode.min'),
      })
      .max(10, {
        message: getTranslation('validation.postalCode.max'),
      })
      .regex(/^[A-Za-z0-9\s-]+$/, {
        message: getTranslation('validation.postalCode.format'),
      }),
    mailingAddress1: z
      .string()
      .max(100, {
        message: 'Mailing address must be at most 100 characters',
      })
      .regex(/^[A-Za-z0-9\s.,'/-]*$/, {
        message: 'Mailing address can only contain letters, numbers, spaces, and basic punctuation',
      })
      .optional()
      .or(z.literal('')),
    mailingAddress2: z
      .string()
      .max(100, {
        message: 'Mailing address must be at most 100 characters',
      })
      .regex(/^[A-Za-z0-9\s.,'/-]*$/, {
        message: 'Mailing address can only contain letters, numbers, spaces, and basic punctuation',
      })
      .optional()
      .or(z.literal('')),
    primaryPhone: z
      .string()
      .min(10, {
        message: getTranslation('validation.phoneNumber.min'),
      })
      .max(15, {
        message: getTranslation('validation.phoneNumber.max'),
      })
      .regex(/^\d+$/, {
        message: getTranslation('validation.phoneNumber.format'),
      }),
    secondaryPhone: z
      .string()
      .max(15, {
        message: getTranslation('validation.phoneNumber.max'),
      })
      .regex(/^\d*$/, {
        message: getTranslation('validation.phoneNumber.format'),
      })
      .optional()
      .or(z.literal('')),
    email: z.string().email({
      message: 'Please enter a valid email address',
    }),
    addressProofUrl: z.any().refine((file) => file instanceof File, {
      message: getTranslation('validation.required'),
    }),
  });

export const personalInfoSchema = () =>
  z.object({
    firstName: z.string().min(2, {
      message: getTranslation('validation.firstName'),
    }),
    lastName: z.string().min(2, {
      message: getTranslation('validation.lastName'),
    }),
    maidenName: z.string().optional(),
    dateOfBirth: z.date({
      message: getTranslation('validation.required'),
    }),
    placeOfBirth: z.string().min(2, {
      message: getTranslation('validation.required'),
    }),
    nationality: z.string().min(2, {
      message: getTranslation('validation.required'),
    }),
    countryOfTaxResidence: z.string().min(2, {
      message: getTranslation('validation.required'),
    }),
    taxIdentificationNumber: z.string().min(2, {
      message: getTranslation('validation.required'),
    }),
    occupation: z.string().min(2, {
      message: getTranslation('validation.required'),
    }),
    currentEmployer: z.string().optional(),
    employmentStatus: z.string().min(2, {
      message: getTranslation('validation.required'),
    }),
  });

export const politicalExposureSchema = () =>
  z
    .object({
      isPep: z.boolean().optional(),
      positionHeld: z
        .string()
        .min(2, {
          message: getTranslation('validation.required'),
        })
        .optional(),
      country: z
        .string()
        .min(2, {
          message: getTranslation('validation.required'),
        })
        .optional(),
      startDate: z
        .date({
          message: getTranslation('validation.required'),
        })
        .optional(),
      endDate: z
        .date({
          message: getTranslation('validation.required'),
        })
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.isPep) {
        if (!data.positionHeld) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getTranslation('validation.required'),
            path: ['positionHeld'],
          });
        }
        if (!data.country) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getTranslation('validation.required'),
            path: ['country'],
          });
        }
        if (!data.startDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getTranslation('validation.required'),
            path: ['startDate'],
          });
        }
        if (!data.endDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: getTranslation('validation.required'),
            path: ['endDate'],
          });
        }
      }
    });

export const transferSchema = () =>
  z.object({
    amount: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .refine(
        (value) => {
          const numericValue = parseFloat(value.replace(/,/g, ''));
          return !isNaN(numericValue) && numericValue > 0;
        },
        {
          message: getTranslation('validation.amountNumeric'),
        }
      ),
    destination: z
      .string()
      .min(1, {
        message: getTranslation('validation.required'),
      })
      .min(5, {
        message: getTranslation('validation.minLength', { min: 5 }),
      }),
    currency: z.string({
      message: getTranslation('validation.selectValidCurrency'),
    }),
  });

export const bankingInfoSchema = () =>
  z.object({
    countryAccountHeld: z.string({
      message: getTranslation('validation.required'),
    }),
    primaryBank: z.string({
      message: getTranslation('validation.required'),
    }),
    accountNumber: z
      .string()
      .min(8, { message: getTranslation('validation.minLength', { min: 8 }) })
      .max(20, {
        message: getTranslation('validation.maxLength', { max: 20 }),
      }),
  });

export const financialInfoSchema = () =>
  z.object({
    sourceOfFunds: z.string({
      message: getTranslation('validation.required'),
    }),
    salary: z.string({
      message: getTranslation('validation.required'),
    }),
    estimatedAnnualIncome: z.string({
      message: getTranslation('validation.required'),
    }),
    estimatedNetWorth: z.string({
      message: getTranslation('validation.required'),
    }),
  });
