import * as z from 'zod';

export const createBillPaymentSchema = () => {
  return z.object({
    service: z.string().min(1, { message: 'Required' }),
    country: z.string().min(1, { message: 'Select a valid country' }),
    currency: z.string().min(1, { message: 'Select a valid currency' }),
    network: z.string().optional(),
    amount: z
      .string()
      .min(1, { message: 'Amount is required' })
      .refine(
        (val) => {
          const numericValue = parseFloat(val.replace(/,/g, ''));
          return !isNaN(numericValue) && numericValue > 0;
        },
        { message: 'Enter a valid amount' }
      )
      .refine(
        (val) => {
          const numericValue = parseFloat(val.replace(/,/g, ''));
          return numericValue >= 1;
        },
        { message: 'Amount must be at least 1' }
      ),
    account: z
      .string()
      .min(1, { message: 'Customer ID / Account Number is required' })
      .refine((val) => val.trim().length >= 3, {
        message: 'Enter a valid Customer ID / Account Number',
      }),
  });
};

export type BillPaymentFormData = z.infer<
  ReturnType<typeof createBillPaymentSchema>
>;

export const billPaymentDefaultValues: BillPaymentFormData = {
  service: '',
  country: '',
  currency: '',
  network: '',
  amount: '',
  account: '',
};
