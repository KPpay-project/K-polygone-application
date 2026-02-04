import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CustomFormMessage } from '@/components/common/forms/form-message';
import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { resetPasswordSchema } from '@/schema/auth';
import { useNavigate } from '@tanstack/react-router';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { Eye, EyeOff } from 'lucide-react';
import z from 'zod';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '@/lib/graphql/mutations/auth';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface ResetPasswordProps {
  email: string;
  otpCode: string;
}

function ResetPassword({ email, otpCode }: ResetPasswordProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      if (data?.resetPassword?.success) {
        toast.success(data.resetPassword.message);
        navigate({ to: '/onboarding/password-reset' });
      } else {
        toast.error(data?.resetPassword?.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const formSchema = resetPasswordSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otpCode: otpCode || '',
      password: '',
      confirmPassword: ''
    }
  });

  function onSubmit(values: FormValues) {
    resetPassword({
      variables: {
        input: {
          email,
          otpCode: values.otpCode,
          newPassword: values.password,
          newPasswordConfirmation: values.confirmPassword
        }
      }
    });
  }

  return (
    <OnboardingLayout title={t('auth.resetPassword.title')} className="!items-start" canGoBack>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otpCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">
                  {t('auth.resetPassword.otpCode', { defaultValue: 'OTP Code' })}
                </FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                    <InputOTPGroup className="gap-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot className="border !rounded-lg size-[46px]" key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <CustomFormMessage message={form.formState.errors.otpCode} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('auth.resetPassword.password')}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('placeholders.password')}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <CustomFormMessage message={form.formState.errors.password} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('auth.resetPassword.confirmPassword')}</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('placeholders.password')}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <CustomFormMessage message={form.formState.errors.confirmPassword} scope="error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-[32px] bg-primary hover:bg-brandBlue-600"
            icon={!loading && <IconArrowRight />}
            disabled={loading}
          >
            {loading ? t('common.processing', { defaultValue: 'Resetting...' }) : t('auth.resetPassword.resetPassword')}
          </Button>
        </form>
      </Form>
    </OnboardingLayout>
  );
}

export default ResetPassword;
