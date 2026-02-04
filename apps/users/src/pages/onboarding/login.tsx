import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Turnstile from 'react-turnstile';
import z from 'zod';

import { CustomFormMessage } from '@/components/common/forms/form-message';
import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { LOGIN_USER } from '@repo/api';
import { loginSchema } from '@/schema/auth';
import { useAuth } from '@/hooks/use-auth';
import type { LoginInput, LoginResponse } from '@repo/types';
import { ENV } from '@/utils/constants';
import { handleGraphQLError } from '@/utils/error-handling';
import { Link, useNavigate } from '@tanstack/react-router';
import {  Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { Eye, EyeOff } from 'lucide-react';
import { Loading, Head } from '@/components/common';
import { Button } from '@/components/ui/button';

function Login() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const turnstileRef = useRef<any>(null);
  const navigate = useNavigate();
  const { setAuthTokens, logUser } = useAuth();

  const formSchema = loginSchema();
  type FormValues = z.infer<typeof formSchema>;

  const [login, { loading }] = useMutation<{ login: LoginResponse }, { input: LoginInput }>(LOGIN_USER);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: '',
      password: ''
    }
  });

  async function onSubmit(values: FormValues) {
    try {
      const response = await login({
        variables: {
          input: {
            emailOrPhone: values.emailOrPhone,
            password: values.password
          }
        }
      });

      if (response?.data?.login) {
        const { token, userAccount } = response.data.login;

        setAuthTokens(token.accessToken, token.refreshToken);
        logUser(userAccount);

        navigate({ to: '/dashboard' });
      } else if (response.errors) {
        handleGraphQLError(response, 'Login failed');
        turnstileRef.current?.reset();
        setCaptchaToken('');
      }
    } catch (error) {
      handleGraphQLError(error, t('common.notifications.loginFailed'));
      turnstileRef.current?.reset();
      setCaptchaToken('');
    }
  }

  const params = new URLSearchParams(window.location.search);
  const urlParamType = params.get('user');
  return (
    <OnboardingLayout title={t('auth.login.title')} description={t('auth.login.description')} canGoBack>
      <Head title={t('auth.login.title')} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="emailOrPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('auth.login.emailOrPhone')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.emailOrPhone')} {...field} />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.emailOrPhone} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('auth.login.password')}</FormLabel>
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

          <div className="flex items-center justify-between">
            <Link
              to="/onboarding/forgot-password"
              className="text-gray-800 underline text-[11px]  font-light hover:underline"
            >
              {t('auth.login.forgotPassword')}
            </Link>
          </div>

          <div className="w-full flex justify-center py-4 min-h-[70px]">
            <Turnstile
              ref={turnstileRef}
              sitekey={ENV.CLOUDFLARE_SITE_KEY}
              action="login"
              theme="light"
              fixedSize={true}
              onVerify={(token) => {
                setCaptchaToken(token);
              }}
              onError={() => {
                setCaptchaToken('');
              }}
              onExpire={() => {
                setCaptchaToken('');
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-brandBlue-600"
            // icon={<IconArrowRight />}
            disabled={loading || !captchaToken}
          >
            {loading ? t('common.loading') : t('auth.login.signIn')}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-[32px]">
            {t('auth.login.dontHaveAccount')}{' '}
            <button
              type="button"
              onClick={() => {
                if (urlParamType === 'user') {
                  navigate({ to: '/onboarding/create-account' });
                } else {
                  navigate({ to: '/onboarding/register-merchant' });
                }
              }}
              className="text-primary font-medium hover:underline bg-transparent border-0 p-0"
            >
              {t('auth.login.createAccount')}
            </button>
          </p>
        </form>
      </Form>
      <Loading isLoading={loading} />
    </OnboardingLayout>
  );
}

export default Login;
