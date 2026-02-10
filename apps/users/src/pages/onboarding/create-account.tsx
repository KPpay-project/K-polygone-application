import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { REGISTER_USER } from '@repo/api';
import type { UserInput, RegisterUserResponse } from '@repo/types';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { CountrySelector } from '@repo/ui';
import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { createAccountSchema } from '@/schema/auth';
import { countries, ENV } from '@/utils/constants';
import { handleGraphQLError } from '@/utils/error-handling';
import { Link } from '@tanstack/react-router';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from '@repo/ui';
import { ArrowLeft as IconArrowRight } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import z from 'zod';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { Loading } from '@/components/common';
import { PrimaryPhoneNumberInput } from '@repo/ui';
import Turnstile from 'react-turnstile';

function CreateAccount() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(countries[0].code);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const navigate = useNavigate();

  const formSchema = createAccountSchema();
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    //@ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: countries[0].name,
      password: '',
      confirmPassword: ''
    }
  });

  const [registerUser, { loading }] = useMutation<{ registerUser: RegisterUserResponse }, { input: UserInput }>(
    REGISTER_USER
  );

  async function onSubmit(values: FormValues) {
    try {
      const { firstName, lastName, email, phone, password, country } = values;

      const response = await registerUser({
        variables: {
          input: {
            firstName,
            lastName,
            email,
            phone,
            password,
            passwordConfirmation: values.confirmPassword,
            country
          }
        }
      });

      if (response.data?.registerUser) {
        toast.success('User registered successfully');
        navigate({
          to: '/onboarding/login'
        });
      } else if (response.errors && response.errors.length > 0) {
        handleGraphQLError(response, 'Registration failed');
      }
    } catch (error: any) {
      handleGraphQLError(error, 'An error occurred during registration');
    }
  }

  return (
    <OnboardingLayout title={t('auth.createAccount.title')} description={t('auth.createAccount.description')} canGoBack>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">{t('auth.createAccount.firstName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('placeholders.firstName')} {...field} />
                  </FormControl>
                  <CustomFormMessage message={form.formState.errors.firstName} scope="error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">{t('auth.createAccount.lastName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('placeholders.lastName')} {...field} />
                  </FormControl>
                  <CustomFormMessage message={form.formState.errors.lastName} scope="error" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('auth.createAccount.email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.email')} {...field} />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.email} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PrimaryPhoneNumberInput
                    value={field.value}
                    onChange={field.onChange}
                    inputProps={{
                      name: field.name,
                      onBlur: field.onBlur
                    }}
                    error={!!form.formState.errors.phone}
                  />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.phone} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('auth.createAccount.country')}</FormLabel>
                <CountrySelector
                  // value={selectedCountryCode}
                  onValueChange={(value, country) => {
                    setSelectedCountryCode(country.code);
                    field.onChange(value);
                  }}
                  
                  showPrefix={false}
                  placeholder={t('auth.createAccount.selectCountry')}
                />
                <CustomFormMessage message={form.formState.errors.country} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('auth.createAccount.password')}</FormLabel>
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
                <FormLabel className="!text-black">{t('auth.createAccount.confirmPassword')}</FormLabel>
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

          <div className="w-full flex justify-center mt-4 min-h-[70px]">
            <Turnstile
              sitekey={ENV.CLOUDFLARE_SITE_KEY}
              theme="light"
              fixedSize={true}
              onVerify={(token) => {
                console.log('Turnstile verified:', token);
                setCaptchaToken(token);
              }}
              onError={(error) => console.error('Turnstile error:', error)}
              onLoad={() => console.log('Turnstile loaded')}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-[32px] bg-primary hover:bg-brandBlue-600"
            icon={<IconArrowRight />}
            disabled={loading || !captchaToken}
          >
            {loading ? t('common.loading') : t('auth.createAccount.signIn')}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-[32px]">
            {t('auth.createAccount.alreadyHaveAccount')}{' '}
            <Link to="/onboarding/login" className="text-primary font-medium hover:underline">
              {t('auth.createAccount.signIn')}
            </Link>
          </p>
        </form>
      </Form>

      <Loading isLoading={loading} />
    </OnboardingLayout>
  );
}

export default CreateAccount;
