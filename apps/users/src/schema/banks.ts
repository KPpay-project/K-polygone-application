import { z } from 'zod';
import { getTranslation } from '@/utils/helpers';

export const createBankingInfoSchema = (accountNumberValidation?: { length?: number; regex?: RegExp }) =>
  z.object({
    countryAccountHeld: z.string().min(1, {
      message: getTranslation('validation.countryRequired')
    }),
    primaryBank: z.string().min(1, {
      message: getTranslation('validation.bankRequired')
    }),
    accountNumber: z
      .string()
      .min(1, {
        message: getTranslation('validation.accountNumberRequired')
      })
      .refine(
        (value) => {
          if (!accountNumberValidation) return true;
          if (accountNumberValidation.length && value.length !== accountNumberValidation.length) {
            return false;
          }
          if (accountNumberValidation.regex && !accountNumberValidation.regex.test(value)) {
            return false;
          }
          return true;
        },
        {
          message: accountNumberValidation?.length
            ? getTranslation('validation.accountNumberLength', {
                length: accountNumberValidation.length
              })
            : getTranslation('validation.accountNumberFormat')
        }
      )
  });
