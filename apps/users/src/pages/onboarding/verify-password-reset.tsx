import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CustomFormMessage } from '@/components/common/forms/form-message';
import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { verifyResetPassword } from '@/schema/auth';
import { useNavigate } from '@tanstack/react-router';
import { Button, Form, FormControl, FormField, FormItem } from 'k-polygon-assets/components';
import { IconArrowRight } from 'k-polygon-assets/icons';
import z from 'zod';

interface VerifyResetPasswordProps {
  email: string;
}

function VerifyResetPassword({ email }: VerifyResetPasswordProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formSchema = verifyResetPassword();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: ''
    }
  });

  function onSubmit(values: FormValues) {
    navigate({
      to: '/onboarding/reset-password',
      search: {
        email: email,
        otpCode: values.otp
      }
    });
  }

  return (
    <OnboardingLayout
      title={t('auth.verifyReset.title')}
      description={t('auth.verifyReset.description', { email })}
      canGoBack
      className="!items-start"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[32px]">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
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
            className="w-full mt-[62px] bg-primary hover:bg-brandBlue-600"
            icon={<IconArrowRight />}
          >
            {t('auth.verifyReset.verify')}
          </Button>
        </form>
      </Form>

      {/* <div className="mt-[32px] text-center">
        <p className="text-[13px] font-[300] text-[#161414]/60">
          {t('auth.verifyReset.resendCode')} <b className="text-black">{t('auth.verifyReset.resendCode')}</b>
        </p>
      </div> */}
    </OnboardingLayout>
  );
}

export default VerifyResetPassword;
