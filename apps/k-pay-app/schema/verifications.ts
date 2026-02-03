import { z } from 'zod';

const identityDocumentSchema = z
  .object({
    documentType: z.string().min(1, { message: 'Document type is required' }),
    documentNumber: z
      .string()
      .min(1, { message: 'Document number is required' }),
    dateOfIssue: z
      .date()
      .refine((val) => !!val, { message: 'Date of issue is required' })
      .refine((val) => val <= new Date(), {
        message: 'Date of issue cannot be in the future',
      }),
    expiryDate: z
      .date()
      .refine((val) => !!val, { message: 'Expiry date is required' })
      .refine((val) => val > new Date(), {
        message: 'Expiry date must be in the future',
      }),
    issuingAuthority: z
      .string()
      .min(1, { message: 'Issuing authority is required' })
      .min(2, { message: 'Issuing authority must be at least 2 characters' })
      .max(100, { message: 'Issuing authority cannot exceed 100 characters' })
      .regex(/^[A-Za-z\s\-',.]+$/, {
        message:
          'Issuing authority can only contain letters, spaces and basic punctuation',
      }),
    identityDocument: z
      .any()
      .refine((val) => val instanceof File || typeof val === 'string', {
        message: 'Identity document is required',
      })
      .refine(
        (val) => {
          if (val instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            return allowedTypes.includes(val.type);
          }
          return true;
        },
        { message: 'Only JPG, PNG or PDF files are allowed' }
      )
      .refine(
        (val) => {
          if (val instanceof File) {
            return val.size <= 10 * 1024 * 1024;
          }
          return true;
        },
        { message: 'File size must not exceed 10MB' }
      ),
  })
  .refine(
    (data) => {
      if (!data.documentType || !data.documentNumber) return true;

      switch (data.documentType) {
        case 'nin':
          return /^\d{11}$/.test(data.documentNumber);
        case 'passport':
          return /^[A-Z]{1,2}\d{6,8}$/i.test(data.documentNumber);
        case 'drivers_license':
          return /^[A-Z0-9]{8,15}$/i.test(data.documentNumber);
        case 'national_id':
          return /^\d{9,12}$/.test(data.documentNumber);
        default:
          return true;
      }
    },
    {
      message:
        'Document number format is invalid for the selected document type',
      path: ['documentNumber'],
    }
  )
  .refine(
    (data) => {
      if (
        !data.documentType ||
        !data.documentNumber ||
        data.documentType !== 'nin'
      )
        return true;
      return /^\d{11}$/.test(data.documentNumber);
    },
    {
      message: 'NIN must be exactly 11 digits',
      path: ['documentNumber'],
    }
  )
  .refine(
    (data) => {
      if (
        !data.documentType ||
        !data.documentNumber ||
        data.documentType !== 'passport'
      )
        return true;
      return /^[A-Z]{1,2}\d{6,8}$/i.test(data.documentNumber);
    },
    {
      message:
        'Passport number must be 1-2 letters followed by 6-8 digits (e.g., A1234567)',
      path: ['documentNumber'],
    }
  )
  .refine(
    (data) => {
      if (
        !data.documentType ||
        !data.documentNumber ||
        data.documentType !== 'drivers_license'
      )
        return true;
      return /^[A-Z0-9]{8,15}$/i.test(data.documentNumber);
    },
    {
      message: "Driver's License must be 8-15 alphanumeric characters",
      path: ['documentNumber'],
    }
  )
  .refine(
    (data) => {
      if (
        !data.documentType ||
        !data.documentNumber ||
        data.documentType !== 'national_id'
      )
        return true;
      return /^\d{9,12}$/.test(data.documentNumber);
    },
    {
      message: 'National ID must be 9-12 digits',
      path: ['documentNumber'],
    }
  );

export { identityDocumentSchema };
