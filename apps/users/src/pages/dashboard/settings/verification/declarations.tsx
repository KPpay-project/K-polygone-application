import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardSubHeader } from '@/components/modules/header/dashboard-sub-header.tsx';
import { Button } from 'k-polygon-assets';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useCreateDeclarationAndCommitment } from '@/hooks/api/kyc-hooks';
import z from 'zod';
import { Form, Input, FormLabel, FormControl, FormField, FormItem } from 'k-polygon-assets/components';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import Loading from '@/components/common/loading.tsx';
const declarationsSchema = () =>
  z.object({
    fullName: z.string().min(2, {
      message: 'Full name is required'
    }),
    institutionName: z.string().min(2, {
      message: 'Institution name is required'
    }),
    certifyAccurate: z
      .boolean({
        invalid_type_error: 'You must certify that the information is accurate'
      })
      .refine((val) => val === true, {
        message: 'You must certify that the information is accurate'
      }),
    acknowledgeAML: z
      .boolean({
        invalid_type_error: 'You must acknowledge the anti-money laundering statement'
      })
      .refine((val) => val === true, {
        message: 'You must acknowledge the anti-money laundering statement'
      })
  });

const DeclaringVerificationScreen = () => {
  const navigate = useNavigate();
  const formSchema = declarationsSchema();
  type FormValues = z.infer<typeof formSchema>;
  const { createDeclarationAndCommitment, loading } = useCreateDeclarationAndCommitment();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      institutionName: '',
      certifyAccurate: false,
      acknowledgeAML: false
    }
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    try {
      const res = await createDeclarationAndCommitment({
        variables: {
          input: {
            individualsFullName: values.fullName,
            companyName: values.institutionName,
            informationIsAccurate: values.certifyAccurate,
            hasAcknowledgeInformationCollectionAmlCft: values.acknowledgeAML
          }
        }
      });

      const payload = res.data?.createDeclarationAndCommitment;
      if (payload?.success) {
        navigate({ to: '/settings/verifications/complete' });
        return;
      }

      const serverMessage = payload?.message || payload?.errors?.map((e) => e.message).join(', ');
      setSubmitError(serverMessage || 'Submission failed. Please try again.');
    } catch (e: any) {
      setSubmitError(e?.message || 'An unexpected error occurred.');
    }
  }

  return (
    <>
      <Loading isLoading={loading} text={'Submitting KYC info'} />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <DashboardSubHeader
          title={'Declarations and Commitment(s)'}
          content={'Confirm and acknowledge before submitting'}
          steps={7}
          currentStep={7}
        />

        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {submitError && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
              {submitError}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-busy={loading}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="!text-black">Full Name (for declaration/signature)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} disabled={loading} />
                      </FormControl>
                      <CustomFormMessage message={form.formState.errors.fullName} scope="error" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="!text-black">Institution Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter institution name" {...field} disabled={loading} />
                      </FormControl>
                      <CustomFormMessage message={form.formState.errors.institutionName} scope="error" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-2">
                  <Input
                    type="checkbox"
                    id="certifyAccurate"
                    className="mt-1 h-5 w-5 accent-primary-600"
                    {...form.register('certifyAccurate')}
                    disabled={loading}
                  />
                  <label htmlFor="certifyAccurate" className="text-sm">
                    I certify that the information provided is accurate and complete
                  </label>
                </div>
                <CustomFormMessage message={form.formState.errors.certifyAccurate} scope="error" />

                <div className="flex items-start gap-2">
                  <Input
                    type="checkbox"
                    id="acknowledgeAML"
                    className="mt-1 h-5 w-5 accent-primary-600"
                    {...form.register('acknowledgeAML')}
                    disabled={loading}
                  />
                  <label htmlFor="acknowledgeAML" className="text-sm">
                    I acknowledge that this information may be used for anti-money laundering and counter-terrorism
                    purposes
                  </label>
                </div>
                <CustomFormMessage message={form.formState.errors.acknowledgeAML} scope="error" />
              </div>

              <div className="mt-8">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className={` md:w-auto bg-red-500 text-white
                      w-full lg:w-[300px] hover:bg-red-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Submitting…' : 'Submit KYC'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default DeclaringVerificationScreen;
