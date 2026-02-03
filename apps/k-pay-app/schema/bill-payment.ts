import * as z from 'zod';

export const createBillPaymentSchema = (t: (key: string) => string) => {
  return z.object({
    service: z.string().min(1, { message: t('validation.required') }),
    country: z.enum(['nigeria', 'ghana', 'kenya']).refine((val) => val, {
      message: t('validation.selectValidCountry'),
    }),
    currency: z.enum(['USD', 'NGN', 'EUR']).refine((val) => val, {
      message: t('validation.selectValidCurrency'),
    }),
    paymentMethod: z.enum(['mobile', 'card', 'bank']).refine((val) => val, {
      message: t('validation.selectValidPaymentMethod'),
    }),
    network: z.string().optional(),
    amount: z
      .string()
      .min(1, { message: t('validation.amountRequired') })
      .refine(
        (val) => {
          const numericValue = parseFloat(val.replace(/,/g, ''));
          return !isNaN(numericValue) && numericValue > 0;
        },
        { message: t('validation.amountNumeric') }
      )
      .refine(
        (val) => {
          const numericValue = parseFloat(val.replace(/,/g, ''));
          return numericValue >= 1;
        },
        { message: t('validation.amountMinimum') }
      ),
    account: z
      .string()
      .min(1, { message: t('validation.accountNumberRequired') })
      .refine(
        (val) => {
          // More flexible validation for different account types
          const trimmed = val.trim();
          if (trimmed.includes('@')) {
            // Email validation for gift cards
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
          }
          // General account validation - allow alphanumeric, +, -, spaces, parentheses
          // Minimum length of 3 characters for any account type
          return /^[a-zA-Z0-9+\-\s()]+$/.test(trimmed) && trimmed.length >= 3;
        },
        { message: t('validation.accountNumberFormat') }
      ),
  });
};

export type BillPaymentFormData = z.infer<
  ReturnType<typeof createBillPaymentSchema>
>;

export const billPaymentDefaultValues: BillPaymentFormData = {
  service: '',
  country: 'nigeria',
  currency: 'USD',
  paymentMethod: 'mobile',
  network: '',
  amount: '',
  account: '',
};
