import * as z from 'zod';

export const createBillPaymentSchema = (t: (key: string) => string) => {
  return z.object({
    service: z.string().min(1, { message: t('validation.required') }),
    country: z.string().min(1, { message: t('validation.selectValidCountry') }),
    currency: z.string().min(1, { message: t('validation.selectValidCurrency') }),
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
      .refine((val) => val.trim().length >= 3, { message: t('validation.accountNumberFormat') })
  });
};

export type BillPaymentFormData = z.infer<ReturnType<typeof createBillPaymentSchema>>;

export const billPaymentDefaultValues: BillPaymentFormData = {
  service: '',
  country: '',
  currency: '',
  network: '',
  amount: '',
  account: ''
};
