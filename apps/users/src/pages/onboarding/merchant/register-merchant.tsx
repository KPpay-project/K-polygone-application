import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { REGISTER_MERCHANT } from '@repo/api';
import z from 'zod';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import OnboardingLayout from '@/components/layouts/onboarding-layout';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { CountrySelector } from '@/components/common/country-selector';
import { handleGraphQLError } from '@/utils/error-handling';
import { Link } from '@tanstack/react-router';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { Eye, EyeOff } from 'lucide-react';
import { Loading } from '@/components/common';
import { PrimaryPhoneNumberInput } from '@/components/common/inputs/primary-phone-number-input';
import { SearchableSelect } from '@/components/common/searchable-select';

const BUSINESS_TYPES = [
  { value: 'retail', label: 'Retail' },
  { value: 'e-commerce', label: 'E-commerce' },
  { value: 'service', label: 'Service' },
  { value: 'food', label: 'Food & Restaurants' },
  { value: 'travel', label: 'Travel & Hospitality' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'health-beauty', label: 'Health & Beauty' },
  { value: 'grocery', label: 'Grocery & Market' },
  { value: 'electronics', label: 'Electronics & Gadgets' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'education', label: 'Education & Training' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'finance', label: 'Financial Services' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'logistics', label: 'Logistics & Delivery' }
] as const;

const businessTypeEnum = z.enum(BUSINESS_TYPES.map((t) => t.value) as [string, ...string[]], {
  message: 'Business type is required'
});

const merchantSchema = z
  .object({
    email: z.string().email('Enter a valid email').min(1, 'Contact email is required'),
    phone: z.string().min(1, 'Phone is required'),
    country: z.string().min(1, 'Country is required'),

    businessName: z.string().min(1, 'Business name is required'),
    businessType: businessTypeEnum,
    businessDescription: z.string().optional(),
    businessWebsite: z
      .string()
      .url('Enter a valid URL starting with http(s)://')
      .optional()
      .or(z.literal(''))
      .transform((v) => (v === '' ? undefined : v)),

    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string().min(1, 'Confirm your password'),

    status: z.string().optional(),
    merchantRejectionReason: z.string().optional(),
    logoUrl: z
      .string()
      .url('Enter a valid logo URL')
      .optional()
      .or(z.literal(''))
      .transform((v) => (v === '' ? undefined : v)),
    group: z.string().optional()
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation']
  });

type FormValues = z.infer<typeof merchantSchema>;

const RegisterMerchantPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      email: '',
      phone: '',
      country: '',
      businessName: '',
      businessType: 'retail',
      businessDescription: '',
      businessWebsite: '',
      password: '',
      passwordConfirmation: '',
      status: '',
      merchantRejectionReason: '',
      logoUrl: '',
      group: ''
    }
  });

  const [registerMerchant, { loading }] = useMutation(REGISTER_MERCHANT as any);

  async function onSubmit(values: FormValues) {
    try {
      const input = {
        email: values.email,
        phone: values.phone,
        country: values.country,
        businessName: values.businessName,
        businessType: values.businessType,
        password: values.password,
        passwordConfirmation: values.passwordConfirmation,
        businessDescription: values.businessDescription || undefined,
        businessWebsite: values.businessWebsite || undefined,
        status: values.status || undefined,
        merchantRejectionReason: values.merchantRejectionReason || undefined,
        logoUrl: values.logoUrl || undefined,
        group: values.group || undefined
      };

      const response = await registerMerchant({ variables: { input } });

      if (response?.data) {
        toast.success('Merchant registered successfully');
        navigate({ to: '/onboarding/login' });
      } else if (response?.errors && response.errors.length > 0) {
        handleGraphQLError(response, 'Registration failed');
      }
    } catch (error: any) {
      handleGraphQLError(error, 'An error occurred during registration');
    }
  }

  return (
    <OnboardingLayout
      title={t('merchant.register.title') || 'Register Merchant'}
      description={t('merchant.register.description') || ''}
      canGoBack
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{t('merchant.register.contactEmail') || 'Contact Email'}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.email') || 'contact@business.com'} {...field} />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.email} scope="error" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">{t('merchant.register.country') || 'Country'}</FormLabel>
                  <CountrySelector
                    value={field.value || ''}
                    onValueChange={(value) => field.onChange(value)}
                    hasFlag
                    showPrefix={false}
                    placeholder={t('merchant.register.selectCountry') || 'Select country'}
                  />
                  <CustomFormMessage message={form.formState.errors.country} scope="error" />
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
                      value={field.value || ''}
                      onChange={(v) => field.onChange(v)}
                      placeholder={t('auth.createAccount.enterPhoneNumber') || 'Enter phone number'}
                      className="w-full"
                    />
                  </FormControl>
                  <CustomFormMessage message={form.formState.errors.phone} scope="error" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">
                    {t('merchant.register.businessName') || 'Business Name'}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t('placeholders.businessName') || 'Acme Trading Ltd'} {...field} />
                  </FormControl>
                  <CustomFormMessage message={form.formState.errors.businessName} scope="error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">{t('merchant.register.website') || 'Website'}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('placeholders.website') || 'https://example.com'} {...field} />
                  </FormControl>
                  <CustomFormMessage message={form.formState.errors.businessWebsite} scope="error" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="businessDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">
                  {t('merchant.register.businessDescription') || 'Business Description'}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('placeholders.businessDescription') || 'What does your business do?'}
                    {...field}
                  />
                </FormControl>
                <CustomFormMessage message={form.formState.errors.businessDescription} scope="error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-black">{!t('merchant.register.businessType') || 'Business Type'}</FormLabel>
                <SearchableSelect
                  options={BUSINESS_TYPES}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as z.infer<typeof businessTypeEnum>)}
                  placeholder={!t('merchant.register.selectBusinessType') || 'Select business type'}
                  searchPlaceholder={t('common.search') || 'Search business types...'}
                />
                <CustomFormMessage message={form.formState.errors.businessType} scope="error" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">{t('auth.createAccount.password') || 'Password'}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('placeholders.password') || 'Enter password'}
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-black">
                    {t('auth.createAccount.confirmPassword') || 'Confirm Password'}
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={t('placeholders.password') || 'Confirm password'}
                        {...field}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <CustomFormMessage message={form.formState.errors.passwordConfirmation} scope="error" />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-[32px] bg-primary hover:bg-brandBlue-600"
            icon={<IconArrowRight />}
            disabled={loading}
          >
            {loading ? t('common.loading') : t('merchant.register.submit') || 'Create account'}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-[32px]">
            {t('merchant.register.alreadyHaveAccount') || 'Already have an account?'}{' '}
            <Link to="/onboarding/login" className="text-primary font-medium hover:underline">
              {t('merchant.register.signIn') || 'Sign in'}
            </Link>
          </p>
        </form>
      </Form>

      <Loading isLoading={loading} />
    </OnboardingLayout>
  );
};

export default RegisterMerchantPage;
