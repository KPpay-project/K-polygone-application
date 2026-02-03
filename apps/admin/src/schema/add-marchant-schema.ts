import { z } from 'zod';

export const add_marchant_schema = z
  .object({
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(7, 'Phone number is required'),
    businessType: z.string().min(2, 'Business type is required'),
    businessWebsite: z.string().url('Invalid website URL').optional().or(z.literal('')),
    businessDescription: z.string().min(5, 'Description must be at least 5 characters').optional().or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include an uppercase letter')
      .regex(/[a-z]/, 'Password must include a lowercase letter')
      .regex(/[0-9]/, 'Password must include a number'),
    passwordConfirmation: z.string()
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  });
