//@ts-nocheck
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DashboardSubHeader } from '@/components/modules/header/dashboard-sub-header.tsx';
import { Button } from 'k-polygon-assets';
import { Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { useNavigate } from '@tanstack/react-router';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useCreateFinancialInfo } from '@/hooks/api/use-create-financial-info';
import { FieldError } from '@repo/types';
import { z, ZodIssue } from 'zod';
import { Loading } from '@/components/common';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import React from 'react';

const FinancialInfoVerification = () => {
  const navigate = useNavigate();
  const formSchema = z.object({
    salary: z.string({ message: 'Salary is required' }),
    estimatedAnnualIncome: z.string({ message: 'Estimated annual income is required' }),
    estimatedNetWorth: z.string({ message: 'Estimated net worth is required' })
  });
  type FormValues = z.infer<typeof formSchema>;
  const [validationErrors, setValidationErrors] = React.useState<ZodIssue[] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salary: '',
      estimatedAnnualIncome: '',
      estimatedNetWorth: ''
    }
  });

  const {
    createFinancialInfo,
    loading: createFinancialInfoLoading,
    data: createFinancialInfoData
  } = useCreateFinancialInfo();

  async function onSubmit(values: FormValues & { salary: string }) {
    try {
      setValidationErrors(null);

      const validationResult = formSchema.safeParse(values);
      if (!validationResult.success) {
        setValidationErrors(validationResult.error.issues);
        return;
      }

      const input = {
        salary: values.salary,
        estimatedAnnualIncome: values.estimatedAnnualIncome,
        estimatedNetWorth: values.estimatedNetWorth
      };

      const response = await createFinancialInfo({
        variables: { input }
      });

      if (response.data?.createFinancialInfo.success) {
        navigate({ to: '/settings/verifications/declarations' });
      }
    } catch (error) {
      console.error('Error creating financial info:', error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <DashboardSubHeader
        title={'Financial Information'}
        content={'Provide basic details about your source of funds'}
        steps={7}
        currentStep={6}
      />

      <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {createFinancialInfoLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loading />
          </div>
        )}
        {(validationErrors ||
          (createFinancialInfoData?.createFinancialInfo.errors &&
            createFinancialInfoData.createFinancialInfo.errors.length > 0)) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
            {validationErrors && (
              <ul className="list-disc pl-4 mb-2">
                {validationErrors.map((error: ZodIssue, index: number) => (
                  <li key={index}>{`${error.path.join('.')}: ${error.message}`}</li>
                ))}
              </ul>
            )}
            {createFinancialInfoData?.createFinancialInfo.errors &&
              createFinancialInfoData.createFinancialInfo.errors.length > 0 && (
                <ul className="list-disc pl-4">
                  {createFinancialInfoData.createFinancialInfo.errors.map((error: FieldError, index: number) => (
                    <li key={index}>{`${error.field}: ${error.message}`}</li>
                  ))}
                </ul>
              )}
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="$20,000" {...field} disabled={createFinancialInfoLoading} />
                      </FormControl>
                      <CustomFormMessage message={form.formState.errors.salary} scope="error" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="estimatedAnnualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Annual Income</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="$20,000" {...field} disabled={createFinancialInfoLoading} />
                      </FormControl>
                      <CustomFormMessage message={form.formState.errors.estimatedAnnualIncome} scope="error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="estimatedNetWorth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Net Worth</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="$20,000" {...field} disabled={createFinancialInfoLoading} />
                      </FormControl>
                      <CustomFormMessage message={form.formState.errors.estimatedNetWorth} scope="error" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full md:w-auto px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                icon={<IconArrowRight />}
                loading={createFinancialInfoLoading}
                disabled={createFinancialInfoLoading}
              >
                {createFinancialInfoLoading ? 'Saving...' : 'Save and continue'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FinancialInfoVerification;
