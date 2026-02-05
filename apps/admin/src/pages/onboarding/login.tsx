import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/sub-modules/typography/typography';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { Eye, EyeOff } from 'lucide-react';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { loginSchema } from '@/schema/auth';
import { Loading } from '@/components/common';
import z from 'zod';
import { Switch } from '@/components/ui/switch';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '@repo/api';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { JWT_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME, REMEMBER_ME_COOKIE } from '@/constant';
import type { LoginInput, LoginResponse } from '@repo/types';
import { scheduleTokenRefresh } from '@/lib/apollo-client';
import { useUserStore } from '@/store/user-store';

const LoginPage = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUserAccount } = useUserStore();

  const formSchema = loginSchema();
  type FormValues = z.infer<typeof formSchema>;

  const initialRemember = Cookies.get(REMEMBER_ME_COOKIE) === '1';

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: initialRemember
    }
  });

  const [login, { loading }] = useMutation<{ login: LoginResponse }, { input: LoginInput }>(LOGIN_USER, {
    onCompleted: (data) => {
      const { token, userAccount } = data.login;

      const remember = form.getValues('rememberMe') === true;
      if (remember) {
        Cookies.set(REMEMBER_ME_COOKIE, '1', { expires: 30 });
        Cookies.set(JWT_TOKEN_NAME, token.accessToken, { expires: 30 });
        Cookies.set(JWT_REFRESH_TOKEN_NAME, token.refreshToken, { expires: 30 });
      } else {
        Cookies.remove(REMEMBER_ME_COOKIE);
        Cookies.set(JWT_TOKEN_NAME, token.accessToken);
        Cookies.set(JWT_REFRESH_TOKEN_NAME, token.refreshToken);
      }

      setUserAccount(userAccount);

      scheduleTokenRefresh();

      toast.success(t('common.notifications.loginSuccessful'));

      navigate({ to: '/dashboard' });
    },
    onError: (error) => {
      toast.error(t('common.notifications.loginFailed'), {
        description: error.message
      });
    }
  });

  async function onSubmit(values: FormValues) {
    await login({
      variables: {
        input: {
          emailOrPhone: values.emailOrPhone,
          password: values.password
        }
      }
    });
  }

  return (
    <div
      className="w-full h-screen bg-blue-800 py-20
     bg-[url('./images/admin_login.png')] bg-center bg-cover"
    >
      <div className="w-[480px] py-[38px] px-[30px] bg-white rounded-xl mx-auto">
        <Typography className="text-center text-xl font-semibold">{t('auth.login.welcomeBack')}</Typography>

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

            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!text-black font-normal">{t('auth.login.rememberMe')}</FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-primary-500 rounded-lg mt-8" disabled={loading}>
              {loading ? <Loading /> : t('auth.login.submit')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
