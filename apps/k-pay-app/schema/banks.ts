import { z } from 'zod';

export const createBankingInfoSchema = (accountNumberValidation?: {
  length?: number;
  regex?: RegExp;
}) =>
  z.object({
    countryAccountHeld: z.string().min(1, {
      message: 'Country is required',
    }),
    primaryBank: z.string().min(1, {
      message: 'Bank is required',
    }),
    accountNumber: z
      .string()
      .min(1, {
        message: 'Account number is required',
      })
      .refine(
        (value) => {
          if (!accountNumberValidation) return true;
          if (
            accountNumberValidation.length &&
            value.length !== accountNumberValidation.length
          ) {
            return false;
          }
          if (
            accountNumberValidation.regex &&
            !accountNumberValidation.regex.test(value)
          ) {
            return false;
          }
          return true;
        },
        {
          message: accountNumberValidation?.length
            ? `Account number must be exactly ${accountNumberValidation.length} digits`
            : 'Invalid account number format',
        }
      ),
  });
