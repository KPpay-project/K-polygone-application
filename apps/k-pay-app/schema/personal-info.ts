import { z } from 'zod';

export const personalInfoSchema = () =>
  z.object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters' })
      .max(50, { message: 'First name must be at most 50 characters' })
      .regex(/^[a-zA-Z\s'-]+$/, {
        message:
          'First name can only contain letters, spaces, hyphens, or apostrophes',
      }),

    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters' })
      .max(50, { message: 'Last name must be at most 50 characters' })
      .regex(/^[a-zA-Z\s'-]+$/, {
        message:
          'Last name can only contain letters, spaces, hyphens, or apostrophes',
      }),

    maidenName: z
      .string()
      .max(50, { message: 'Maiden name must be at most 50 characters' })
      .regex(/^[a-zA-Z\s'-]*$/, {
        message:
          'Maiden name can only contain letters, spaces, hyphens, or apostrophes',
      })
      .optional()
      .or(z.literal('')),

    dateOfBirth: z
      .date()
      .min(new Date(1900, 0, 1), {
        message: 'Date of birth must be after 1900',
      })
      .max(new Date(), { message: 'Date of birth cannot be in the future' })
      .refine(
        (date) => {
          const age = Math.floor(
            (new Date().getTime() - date.getTime()) /
              (365.25 * 24 * 60 * 60 * 1000)
          );
          return age >= 18;
        },
        { message: 'You must be at least 18 years old' }
      ),

    placeOfBirth: z
      .string()
      .min(2, { message: 'Place of birth must be at least 2 characters' })
      .max(100, { message: 'Place of birth must be at most 100 characters' })
      .regex(/^[a-zA-Z\s,.-]+$/, {
        message:
          'Place of birth can only contain letters, spaces, commas, periods, or hyphens',
      }),

    nationality: z.string().min(2, { message: 'Nationality is required' }),

    countryOrTaxResidence: z
      .string()
      .min(2, { message: 'Country of tax residence is required' }),

    taxIdentificationNumber: z
      .string()
      .regex(/^\d*$/, {
        message: 'Tax identification number can only contain digits',
      })
      .optional()
      .or(z.literal('')),

    occupation: z
      .string()
      .min(2, { message: 'Occupation must be at least 2 characters' })
      .max(100, { message: 'Occupation must be at most 100 characters' })
      .regex(/^[a-zA-Z\s&-]+$/, {
        message:
          'Occupation can only contain letters, spaces, ampersands, or hyphens',
      }),

    currentEmployer: z
      .string()
      .max(100, { message: 'Current employer must be at most 100 characters' })
      .regex(/^[a-zA-Z0-9\s&.,'-]*$/, {
        message:
          'Current employer can only contain letters, numbers, spaces, ampersands, commas, periods, hyphens, or apostrophes',
      })
      .optional()
      .or(z.literal('')),

    employmentStatus: z
      .string()
      .min(2, { message: 'Employment status is required' }),
  });
