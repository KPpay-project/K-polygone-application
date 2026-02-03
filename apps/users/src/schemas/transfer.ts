import { z } from 'zod';

// Create a function that returns the schema with translated messages
export const createTransferSchema = (t: (key: string) => string) => {
  return z
    .object({
      amount: z
        .string()
        .min(1, t('transfer.validation.amountRequired'))
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
          message: t('transfer.validation.amountMustBePositive')
        }),
      currency: z.string().min(1, t('transfer.validation.currencyRequired')),
      destination: z.string().min(1, t('transfer.validation.destinationRequired')),

      // Optional fields for bank transfer
      bankAccount: z.string().optional(),
      recipientName: z.string().optional(),
      bankName: z.string().optional(),
      routingNumber: z.string().optional(),

      // Optional fields for card payment
      cardNumber: z.string().optional(),
      expiryDate: z.string().optional(),
      cvv: z.string().optional(),
      saveCard: z.boolean().optional()
    })
    .refine(
      (data) => {
        // If bank transfer method is selected, require bank fields
        if (data.bankAccount || data.recipientName || data.bankName || data.routingNumber) {
          return data.bankAccount && data.recipientName && data.bankName && data.routingNumber;
        }
        return true;
      },
      {
        message: t('transfer.validation.bankAccountRequired'),
        path: ['bankAccount']
      }
    )
    .refine(
      (data) => {
        // If card payment method is selected, require card fields
        if (data.cardNumber || data.expiryDate || data.cvv) {
          return data.cardNumber && data.expiryDate && data.cvv;
        }
        return true;
      },
      {
        message: t('transfer.validation.cardNumberRequired'),
        path: ['cardNumber']
      }
    );
};

// Default schema for backward compatibility
export const transferSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    }, 'Amount must be a valid positive number'),
  currency: z.string().min(1, 'Currency is required'),
  destination: z.string().min(1, 'Destination is required'),
  // Bank transfer fields
  bankAccount: z.string().optional(),
  recipientName: z.string().optional(),
  bankName: z.string().optional(),
  routingNumber: z.string().optional(),
  // Card fields
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  saveCard: z.boolean().optional()
});

export type TransferFormData = z.infer<typeof transferSchema>;
