import { z } from 'zod';
import { getTranslation } from '@/utils/helpers';

export const personalInfoSchema = () =>
  z.object({
    firstName: z
      .string()
      .min(2, { message: getTranslation('validation.firstName.min') })
      .max(50, { message: getTranslation('validation.firstName.max') })
      .regex(/^[a-zA-Z\s'-]+$/, { message: getTranslation('validation.firstName.format') }),

    lastName: z
      .string()
      .min(2, { message: getTranslation('validation.lastName.min') })
      .max(50, { message: getTranslation('validation.lastName.max') })
      .regex(/^[a-zA-Z\s'-]+$/, { message: getTranslation('validation.lastName.format') }),

    maidenName: z
      .string()
      .max(50, { message: getTranslation('validation.maidenName.max') })
      .regex(/^[a-zA-Z\s'-]*$/, { message: getTranslation('validation.maidenName.format') })
      .optional()
      .or(z.literal('')),

    dateOfBirth: z
      .date()
      .min(new Date(1900, 0, 1), { message: getTranslation('validation.dateOfBirth.min') })
      .max(new Date(), { message: getTranslation('validation.dateOfBirth.max') })
      .refine(
        (date) => {
          const age = Math.floor((new Date().getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
          return age >= 18;
        },
        { message: getTranslation('validation.dateOfBirth.age') }
      ),

    placeOfBirth: z
      .string()
      .min(2, { message: getTranslation('validation.placeOfBirth.min') })
      .max(100, { message: getTranslation('validation.placeOfBirth.max') })
      .regex(/^[a-zA-Z\s,.-]+$/, { message: getTranslation('validation.placeOfBirth.format') }),

    nationality: z.string().min(2, { message: getTranslation('validation.nationality.required') }),

    countryOrTaxResidence: z.string().min(2, { message: getTranslation('validation.countryOfTaxResidence.required') }),

    taxIdentificationNumber: z
      .string()
      .regex(/^\d*$/, { message: getTranslation('validation.taxIdentificationNumber.format') })
      .optional()
      .or(z.literal('')),

    occupation: z
      .string()
      .min(2, { message: getTranslation('validation.occupation.min') })
      .max(100, { message: getTranslation('validation.occupation.max') })
      .regex(/^[a-zA-Z\s&-]+$/, { message: getTranslation('validation.occupation.format') }),

    currentEmployer: z
      .string()
      .max(100, { message: getTranslation('validation.currentEmployer.max') })
      .regex(/^[a-zA-Z0-9\s&.,'-]*$/, { message: getTranslation('validation.currentEmployer.format') })
      .optional()
      .or(z.literal('')),

    employmentStatus: z.string().min(2, { message: getTranslation('validation.employmentStatus.required') })
  });
