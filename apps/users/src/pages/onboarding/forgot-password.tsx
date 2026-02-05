import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FORGOTTEN_PASSWORD } from '@repo/api';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { forgotPasswordSchema } from '@/schema/auth';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { IconArrowRight } from 'k-polygon-assets/icons';
import z from 'zod';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [forgotPassword, { loading }] = useMutation(FORGOTTEN_PASSWORD, {
    onCompleted: (data) => {
      if (data?.requestPasswordReset?.success) {
        toast.success(data.requestPasswordReset.message);
        navigate({
          to: '/onboarding/reset-password',
          search: { email: form.getValues('email'), otpCode: '' }
        });
      } else {
        toast.error(data?.requestPasswordReset?.message);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const formSchema = forgotPasswordSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  function onSubmit(values: FormValues) {
    forgotPassword({
      variables: {
        input: {
          email: values.email
        }
      }
    });
  }

  return (
    <OnboardingLayout
      title={t('auth.forgotPassword.title')}
      description={t('auth.forgotPassword.description')}
      canGoBack
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('auth.forgotPassword.email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.email')} {...field} />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.email} scope="error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-[62px] bg-primary hover:bg-brandBlue-600"
            icon={!loading && <IconArrowRight />}
            disabled={loading}
          >
            {loading ? t('common.processing', { defaultValue: 'Sending...' }) : t('auth.forgotPassword.sendResetLink')}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-[32px]">
            {t('auth.forgotPassword.backToLogin')}{' '}
            <Link to="/onboarding/login" className="text-primary font-medium hover:underline">
              {t('auth.forgotPassword.backToLogin')}
            </Link>
          </p>
        </form>
      </Form>
    </OnboardingLayout>
  );
}

export default ForgotPassword;
