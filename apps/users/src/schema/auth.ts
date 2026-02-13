import { getTranslation } from '@/utils/helpers';
import * as z from 'zod';

export const createAccountSchema = () =>
  z
    .object({
      firstName: z.string().min(2, {
        message: getTranslation('validation.minLength', { min: 2 })
      }),
      lastName: z.string().min(2, {
        message: getTranslation('validation.minLength', { min: 2 })
      }),
      email: z.string().email({
        message: getTranslation('validation.email')
      }),
      phone: z.string().min(10, {
        message: getTranslation('validation.phoneNumber')
      }),
      country: z.string({
        error: getTranslation('validation.required')
      }),
      password: z
        .string()
        .min(8, {
          message: getTranslation('validation.minLength', { min: 8 })
        })
        .regex(/[A-Z]/, {
          message: getTranslation('validation.passwordRequirements')
        })
        .regex(/[a-z]/, {
          message: getTranslation('validation.passwordRequirements')
        })
        .regex(/[0-9]/, {
          message: getTranslation('validation.passwordRequirements')
        }),
      confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: getTranslation('auth.createAccount.passwordsDontMatch'),
      path: ['confirmPassword']
    });

export const loginSchema = () =>
  z.object({
    emailOrPhone: z.string().min(1, {
      message: getTranslation('validation.required')
    }),

    password: z.string().min(1, {
      message: getTranslation('validation.required')
    })
  });

export const forgotPasswordSchema = () =>
  z.object({
    email: z.string().email({
      message: getTranslation('validation.email')
    })
  });

export const verifyResetPassword = () =>
  z.object({
    otp: z
      .string()
      .length(6, { message: getTranslation('validation.otpLength') })
      .regex(/^\d{6}$/, { message: getTranslation('validation.otpFormat') })
  });

export const resetPasswordSchema = () =>
  z
    .object({
      password: z
        .string()
        .min(8, {
          message: getTranslation('validation.minLength', { min: 8 })
        })
        .regex(/[A-Z]/, {
          message: getTranslation('validation.passwordRequirements')
        })
        .regex(/[a-z]/, {
          message: getTranslation('validation.passwordRequirements')
        })
        .regex(/[0-9]/, {
          message: getTranslation('validation.passwordRequirements')
        }),
      confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: getTranslation('auth.createAccount.passwordsDontMatch'),
      path: ['confirmPassword']
    });
