import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DashboardSubHeader } from '@/components/modules/header/dashboard-sub-header';
import { personalInfoSchema } from '@/schema/personal-info';
import { Button } from 'k-polygon-assets/components';
import { Form, FormControl, FormField, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { useNavigate } from '@tanstack/react-router';
import { IconArrowRight } from 'k-polygon-assets/icons';
import { useCreatePersonalInfo } from '@/hooks/api/use-create-personal-info';
import { FieldError, PersonalInfoInput } from '@repo/types';
import { z, ZodIssue } from 'zod';
import { Loading } from '@/components/common';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import React from 'react';
import { safeGraphQLOperation } from '@/lib/graphql/wrapper';
import { useKycPersonalInfoStore } from '@/store/kyc';
import { useUser } from '@/store';
import { CountrySelector } from '@/components/common';
import { ProfessionSelector } from '@/components/common/profession-selector';

const PersonalInfoScreen = () => {
  const navigate = useNavigate();
  const user = useUser();

  const {
    createPersonalInfo,
    loading: createPersonalInfoLoading,
    error: createPersonalInfoError,
    data: createPersonalInfoData
  } = useCreatePersonalInfo();
  const formSchema = personalInfoSchema();
  type FormValues = z.infer<typeof formSchema>;
  const [validationErrors, setValidationErrors] = React.useState<ZodIssue[] | null>(null);
  const [wrapperErrorMessage, setWrapperErrorMessage] = React.useState<string | null>(null);
  const errorTopRef = React.useRef<HTMLDivElement | null>(null);
  const kycStore = useKycPersonalInfoStore();

  const scrollToTopOfForm = () => {
    try {
      if (errorTopRef.current) {
        errorTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      window.scrollTo(0, 0);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      maidenName: '',
      dateOfBirth: new Date(),
      placeOfBirth: '',
      nationality: '',
      countryOrTaxResidence: '',
      taxIdentificationNumber: '',
      occupation: '',
      currentEmployer: '',
      employmentStatus: 'Employed'
    }
  });

  console.log(user, 'users deails');

  React.useEffect(() => {
    const s = kycStore;
    if (!s) return;
    const hasAny = !!(
      s.firstName ||
      s.lastName ||
      s.maidenName ||
      s.dateOfBirth ||
      s.placeOfBirth ||
      s.nationality ||
      s.countryOrTaxResidence ||
      s.taxIdentificationNumber ||
      s.occupation ||
      s.currentEmployer ||
      s.employmentStatus
    );
    if (hasAny) {
      form.reset({
        firstName: s.firstName || user?.firstName || '',
        lastName: s.lastName || user?.lastName || '',
        maidenName: s.maidenName || '',
        dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth) : new Date(),
        placeOfBirth: s.placeOfBirth || '',
        nationality: s.nationality || '',
        countryOrTaxResidence: s.countryOrTaxResidence || '',
        taxIdentificationNumber: s.taxIdentificationNumber || '',
        occupation: s.occupation || '',
        currentEmployer: s.currentEmployer || '',
        employmentStatus: s.employmentStatus || 'Employed'
      });
    } else if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        maidenName: '',
        dateOfBirth: new Date(),
        placeOfBirth: '',
        nationality: '',
        countryOrTaxResidence: '',
        taxIdentificationNumber: '',
        occupation: '',
        currentEmployer: '',
        employmentStatus: 'Employed'
      });
    }
  }, [user]);

  interface FormData extends FormValues {
    countryOrTaxResidence: string;
  }

  async function onSubmit(values: FormData) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);
      const savedDob = values.dateOfBirth instanceof Date ? values.dateOfBirth.toISOString().split('T')[0] : '';
      kycStore.setAll({
        firstName: values.firstName || '',
        lastName: values.lastName || '',
        maidenName: values.maidenName || '',
        dateOfBirth: savedDob,
        placeOfBirth: values.placeOfBirth || '',
        nationality: values.nationality || '',
        countryOrTaxResidence: values.countryOrTaxResidence || '',
        taxIdentificationNumber: values.taxIdentificationNumber || '',
        occupation: values.occupation || '',
        currentEmployer: values.currentEmployer || '',
        employmentStatus: values.employmentStatus || 'Employed'
      });

      const validationResult = formSchema.safeParse(values);
      if (!validationResult.success) {
        setValidationErrors(validationResult.error.issues);
        scrollToTopOfForm();
        return;
      }

      const formattedValues: PersonalInfoInput = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth.toISOString().split('T')[0],
        placeOfBirth: values.placeOfBirth,
        nationality: values.nationality,
        countryOrTaxResidence: values.countryOrTaxResidence,
        taxIdentificationNumber: values.taxIdentificationNumber || '',
        occupation: values.occupation,
        employmentStatus: values.employmentStatus,
        maidenName: values.maidenName || '',
        currentEmployer: values.currentEmployer || ''
      };

      const res = await safeGraphQLOperation<any, any, any>(createPersonalInfo as any, {
        variables: { input: formattedValues },
        payloadPath: 'createPersonalInfo',
        requireSuccess: true
      });

      if (res.ok) {
        navigate({ to: '/settings/verifications/banking-information' });
      } else {
        setWrapperErrorMessage(res.error?.message || 'An error occurred');
        scrollToTopOfForm();
      }
    } catch (error: any) {
      setWrapperErrorMessage(error?.message || 'An unexpected error occurred');
      scrollToTopOfForm();
    }
  }

  const bannerPayload = createPersonalInfoData?.createPersonalInfo;
  const bannerHasServerFieldErrors = !!(bannerPayload?.errors && bannerPayload.errors.length > 0);
  const bannerShouldShowServerMessage = !!(bannerPayload && bannerPayload.message && bannerPayload.success === false);
  const bannerShouldShow = !!(
    validationErrors ||
    createPersonalInfoError ||
    bannerHasServerFieldErrors ||
    bannerShouldShowServerMessage ||
    wrapperErrorMessage
  );
  React.useEffect(() => {
    if (bannerShouldShow) {
      scrollToTopOfForm();
    }
  }, [bannerShouldShow]);

  // Unused options removed as we're using CountrySelector component

  const employmentStatusOptions = [
    { label: 'Employed', value: 'Employed' },
    { label: 'Self-Employed', value: 'Self-Employed' },
    { label: 'Unemployed', value: 'Unemployed' },
    { label: 'Student', value: 'Student' },
    { label: 'Retired', value: 'Retired' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {createPersonalInfoLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
      <DashboardSubHeader
        title={'Personal Information'}
        content={'Tell us who you are to help verify your identity.'}
        steps={7}
        currentStep={1}
      />

      <div ref={errorTopRef} className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {(() => {
          const payload = createPersonalInfoData?.createPersonalInfo;
          const hasServerFieldErrors = !!(payload?.errors && payload.errors.length > 0);
          const shouldShowServerMessage = !!(payload && payload.message && payload.success === false);
          const shouldShowBanner = !!(
            validationErrors ||
            createPersonalInfoError ||
            hasServerFieldErrors ||
            shouldShowServerMessage ||
            wrapperErrorMessage
          );
          return (
            shouldShowBanner && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
                {validationErrors && (
                  <ul className="list-disc pl-4 mb-2">
                    {validationErrors.map((error: ZodIssue, index: number) => (
                      <li key={index}>{`${error.path.join('.')}: ${error.message}`}</li>
                    ))}
                  </ul>
                )}
                {wrapperErrorMessage && <div className="mb-2">{wrapperErrorMessage}</div>}
                {createPersonalInfoError?.message && <div className="mb-2">{createPersonalInfoError.message}</div>}
                {shouldShowServerMessage && <div className="mb-2">{payload?.message}</div>}
                {hasServerFieldErrors && (
                  <ul className="list-disc pl-4">
                    {payload!.errors.map((error: FieldError, index: number) => (
                      <li key={index}>{`${error.field}: ${error.message}`}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          );
        })()}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} disabled={createPersonalInfoLoading} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} disabled={createPersonalInfoLoading} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.lastName} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="maidenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maiden Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter maiden name" {...field} disabled={createPersonalInfoLoading} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.maidenName} scope="error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.onChange(date);
                        }}
                        value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                        disabled={createPersonalInfoLoading}
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.dateOfBirth} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="placeOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place of Birth</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter place of birth" {...field} disabled={createPersonalInfoLoading} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.placeOfBirth} scope="error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <CountrySelector
                        value={field.value}
                        onValueChange={(_, country) => field.onChange(country.code)}
                        placeholder="Select nationality"
                        disabled={createPersonalInfoLoading}
                        hasFlag
                        showPrefix={false}
                        className="max-h-[300px] overflow-y-auto"
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.nationality} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="countryOrTaxResidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Tax Residence</FormLabel>
                    <FormControl>
                      <CountrySelector
                        value={field.value}
                        onValueChange={(_, country) => field.onChange(country.code)}
                        placeholder="Select country of tax residence"
                        disabled={createPersonalInfoLoading}
                        hasFlag
                        showPrefix={false}
                        className="max-h-[300px] overflow-y-auto"
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.countryOrTaxResidence} scope="error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxIdentificationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Identification Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax ID number" {...field} disabled={createPersonalInfoLoading} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.taxIdentificationNumber} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <ProfessionSelector
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                        placeholder="Select occupation"
                        disabled={createPersonalInfoLoading}
                        className="max-h-[300px] overflow-y-auto"
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.occupation} scope="error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentEmployer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Employer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employer" {...field} disabled={createPersonalInfoLoading} />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.currentEmployer} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="employmentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <FormControl>
                      <select className="w-full p-2 border rounded" {...field}>
                        {employmentStatusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.employmentStatus} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                className="w-full md:w-auto lg:w-[300px] px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                rightIcon={<IconArrowRight />}
                loading={createPersonalInfoLoading}
                disabled={createPersonalInfoLoading}
              >
                {createPersonalInfoLoading ? 'Saving...' : 'Save and continue'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PersonalInfoScreen;
