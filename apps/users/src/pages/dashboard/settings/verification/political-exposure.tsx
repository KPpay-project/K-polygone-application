import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { DashboardSubHeader } from '@/components/modules/header/dashboard-sub-header.tsx';
import { politicalExposureSchema } from '@/schema/dashboard';
import { Button } from 'k-polygon-assets';
import { useNavigate } from '@tanstack/react-router';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useEffect } from 'react';
import { useCreatePoliticalExposure } from '@/hooks/api/kyc/use-create-political-exposure';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { CustomFormMessage } from '@/components/common/forms/form-message';
const PoliticalExposureVerificationScreen = () => {
  const navigate = useNavigate();
  const formSchema = politicalExposureSchema();

  const { createPoliticalExposure, loading } = useCreatePoliticalExposure();

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isPep: false,
      positionHeld: '',
      country: '',
      startDate: undefined,
      endDate: undefined
    }
  });

  const watchIsPep = form.watch('isPep');

  useEffect(() => {
    if (!watchIsPep) {
      form.reset({
        ...form.getValues(),
        positionHeld: '',
        country: '',
        startDate: undefined,
        endDate: undefined
      });
    }
  }, [watchIsPep, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const input: any = {
        isPep: Boolean(values.isPep)
      };

      if (values.isPep) {
        const selectedCountry = countryOptions.find((c) => c.value === values.country);
        input.positionHeld = values.positionHeld;
        input.countryOfPosition = selectedCountry ? selectedCountry.label : values.country;
        input.startDate = values.startDate ? values.startDate.toISOString().split('T')[0] : undefined;
        input.endDate = values.endDate ? values.endDate.toISOString().split('T')[0] : undefined;
      }

      const response = await createPoliticalExposure({
        variables: { input }
      });

      if (response.data?.createPoliticalExposure.success) {
        navigate({ to: '/settings/verifications/identity-document' });
      } else if (response.error || response.data?.createPoliticalExposure.errors) {
        const errors = response.data?.createPoliticalExposure.errors || [
          { field: 'root', message: 'Submission failed' }
        ];

        const fieldMap: Record<string, keyof FormValues | 'root'> = {
          countryOfPosition: 'country',
          positionHeld: 'positionHeld',
          isPep: 'root',
          startDate: 'startDate',
          endDate: 'endDate'
        };
        errors.forEach((error) => {
          const mapped = fieldMap[error.field] ?? 'root';
          form.setError(mapped as any, { message: error.message });
        });
      }
    } catch {
      form.setError('root', {
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const countryOptions = [
    { label: 'Nigeria', value: 'nigeria', flag: '🇳🇬' },
    { label: 'Ghana', value: 'ghana', flag: '🇬🇭' },
    { label: 'Kenya', value: 'kenya', flag: '🇰🇪' },
    { label: 'United States', value: 'us', flag: '🇺🇸' },
    { label: 'United Kingdom', value: 'uk', flag: '🇬🇧' },
    { label: 'Canada', value: 'canada', flag: '🇨🇦' },
    { label: 'Australia', value: 'australia', flag: '🇦🇺' },
    { label: 'Germany', value: 'germany', flag: '🇩🇪' },
    { label: 'France', value: 'france', flag: '🇫🇷' },
    { label: 'China', value: 'china', flag: '🇨🇳' },
    { label: 'Japan', value: 'japan', flag: '🇯🇵' },
    { label: 'South Africa', value: 'south-africa', flag: '🇿🇦' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <DashboardSubHeader
        title={'Political Exposure (PEP)'}
        content={'Tell us if you hold or have held a public office role'}
        steps={7}
        currentStep={4}
      />

      <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 grid place-items-center">
            <div className="h-6 w-6 border-2 border-brandBlue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-busy={loading}>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Are you a Politically Exposed Person (PEP)?</h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="true"
                    checked={form.watch('isPep') === true}
                    onChange={() => form.setValue('isPep', true)}
                    className="w-5 h-5 accent-primary-600"
                    disabled={loading}
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="false"
                    checked={form.watch('isPep') === false}
                    onChange={() => form.setValue('isPep', false)}
                    className="w-5 h-5 accent-primary-600"
                    disabled={loading}
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {watchIsPep && (
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="positionHeld"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="!text-black">Position Held</FormLabel>
                      <div className="relative" aria-busy={loading}>
                        <FormControl>
                          <Input placeholder="Enter position held" {...field} disabled={loading} />
                        </FormControl>
                        {loading && (
                          <div aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 border-2 border-brandBlue-600/60 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <CustomFormMessage message={form.formState.errors.positionHeld} scope="error" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="!text-black">Country where the Position is/was Held</FormLabel>
                      <div className="relative" aria-busy={loading}>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border border-gray-300 rounded-md px-2 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={(e) => field.onChange(e.target.value)}
                            value={field.value || ''}
                            disabled={loading}
                          >
                            <option value="">Select country</option>
                            {countryOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.flag} {option.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        {loading && (
                          <div aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 border-2 border-brandBlue-600/60 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <CustomFormMessage message={form.formState.errors.country} scope="error" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="!text-black">Start Date</FormLabel>
                        <div className="relative" aria-busy={loading}>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value && field.value instanceof Date
                                  ? field.value.toISOString().split('T')[0]
                                  : ''
                              }
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                              max={
                                form.getValues('endDate') && form.getValues('endDate') instanceof Date
                                  ? form.getValues('endDate').toISOString().split('T')[0]
                                  : ''
                              }
                              disabled={loading}
                            />
                          </FormControl>
                          {loading && (
                            <div aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="h-4 w-4 border-2 border-brandBlue-600/60 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <CustomFormMessage message={form.formState.errors.startDate} scope="error" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="!text-black">End Date</FormLabel>
                        <div className="relative" aria-busy={loading}>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value && field.value instanceof Date
                                  ? field.value.toISOString().split('T')[0]
                                  : ''
                              }
                              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                              min={
                                form.getValues('startDate') && form.getValues('startDate') instanceof Date
                                  ? form.getValues('startDate').toISOString().split('T')[0]
                                  : ''
                              }
                              disabled={loading}
                            />
                          </FormControl>
                          {loading && (
                            <div aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="h-4 w-4 border-2 border-brandBlue-600/60 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                        <CustomFormMessage message={form.formState.errors.endDate} scope="error" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full md:w-auto bg-primary hover:bg-brandBlue-600 text-white py-3 rounded-lg"
                rightIcon={<IconArrowRight />}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save and continue'}
              </Button>
            </div>

            <div>
              <CustomFormMessage message={form.formState.errors.root as any} scope="error" />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PoliticalExposureVerificationScreen;
