import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { verifyResetPassword } from '@/schema/auth';
import { Button, Form, FormControl, FormField, FormItem, FormLabel } from '@repo/ui';
import z from 'zod';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useMutation } from '@apollo/client';
import { VERIFY_OTP } from '@repo/api';
import { toast } from 'sonner';



function OTPPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  // @ts-ignore
  const email = search.email || '';

  const [verifyOtp, { loading }] = useMutation(VERIFY_OTP, {
    onCompleted: (data) => {
      if (data?.verifyOtp?.success) {
        toast.success(data.verifyOtp.message);
        navigate({
          to: '/onboarding/reset-password',
          search: { token: data.verifyOtp.token }
        });
      } else {
        toast.error(data?.verifyOtp?.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const formSchema = verifyResetPassword();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: ''
    }
  });

  function onSubmit(values: FormValues) {
    verifyOtp({
      variables: {
        input: {
          email,
          otpCode: values.otp
        }
      }
    });
  }

  return (
    <OnboardingLayout title={t('auth.verifyOtp.title', { defaultValue: 'Verify OTP' })} className="!items-start" canGoBack>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="otp"
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
                <CustomFormMessage message={form.formState.errors.otp} scope="error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-[32px] bg-primary hover:bg-brandBlue-600"
         
            disabled={loading}
          >
            {loading ? t('common.processing', { defaultValue: 'Verifying...' }) : t('auth.verifyOtp.submit', { defaultValue: 'Verify Code' })}
          </Button>
        </form>
      </Form>
    </OnboardingLayout>
  );
}

export default OTPPage;
