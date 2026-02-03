import React from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodIssue } from 'zod';
import { useRouter } from 'expo-router';
import { Typography, Dropdown } from '@/components/ui';
import type { DropdownOption } from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import CustomTextInput from '@/components/input/custom-text-input';
import { personalInfoSchema } from 'schema/personal-info';
import { useCreatePersonalInfo } from '@/hooks/api/use-create-personal-info';
import { safeGraphQLOperation } from '@/lib/graphql/wrapper';
import { PersonalInfoInput } from '@/types/graphql';
import { countries } from '@/data/countries';
import { DatePicker } from '@/components/ui/date-picker/date-picker';
import { FormProgress } from '@/components/form/form-progress';
import { KYC_ROUTE_COUNT } from '@/constants';

const occupationOptions: DropdownOption[] = [
  { label: 'Software Engineer', value: 'Software Engineer' },
  { label: 'Teacher', value: 'Teacher' },
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Engineer', value: 'Engineer' },
  { label: 'Nurse', value: 'Nurse' },
  { label: 'Lawyer', value: 'Lawyer' },
  { label: 'Accountant', value: 'Accountant' },
  { label: 'Sales Representative', value: 'Sales Representative' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Other', value: 'Other' },
];

const employmentStatusOptions: DropdownOption[] = [
  { label: 'Employed', value: 'Employed' },
  { label: 'Self-Employed', value: 'Self-Employed' },
  { label: 'Unemployed', value: 'Unemployed' },
  { label: 'Student', value: 'Student' },
  { label: 'Retired', value: 'Retired' },
];

const countryOptions: DropdownOption[] = countries.map((country) => ({
  value: country.code,
  label: country.name,
  icon: (
    <Typography variant="body" className="text-lg">
      {country.flag}
    </Typography>
  ),
}));

export default function PersonalInfoPage() {
  const router = useRouter();
  const {
    createPersonalInfo,
    loading: createPersonalInfoLoading,
    error: createPersonalInfoError,
    data: createPersonalInfoData,
  } = useCreatePersonalInfo();
  const formSchema = personalInfoSchema();
  type FormValues = z.infer<typeof formSchema>;
  const [validationErrors, setValidationErrors] = React.useState<
    ZodIssue[] | null
  >(null);
  const [wrapperErrorMessage, setWrapperErrorMessage] = React.useState<
    string | null
  >(null);

  const errorTopRef = React.useRef<ScrollView>(null);

  const scrollToTopOfForm = () => {
    try {
      errorTopRef.current?.scrollTo({ y: 0, animated: true });
    } catch {
      errorTopRef.current?.scrollTo({ y: 0 });
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      maidenName: '',
      dateOfBirth: new Date(),
      placeOfBirth: '',
      nationality: countries[0].code,
      countryOrTaxResidence: countries[0].code,
      taxIdentificationNumber: '',
      occupation: '',
      currentEmployer: '',
      employmentStatus: 'Employed',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);
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
        currentEmployer: values.currentEmployer || '',
      };

      const res = await safeGraphQLOperation<any, any, any>(
        createPersonalInfo as any,
        {
          variables: { input: formattedValues },
          payloadPath: 'createPersonalInfo',
          requireSuccess: true,
        }
      );

      if (res.ok) {
        router.push('/verification/bank-info');
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
  const bannerHasServerFieldErrors = !!(
    bannerPayload?.errors && bannerPayload.errors.length > 0
  );
  const bannerShouldShowServerMessage = !!(
    bannerPayload &&
    bannerPayload.message &&
    bannerPayload.success === false
  );
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

  return (
    <ScreenContainer useSafeArea={true}>
      <ScrollView
        ref={errorTopRef}
        className="p-4 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <HeaderWithTitle
          altOption={<FormProgress steps={KYC_ROUTE_COUNT} currentStep={1} />}
          title="Personal Information"
          description="Tell us who you are to help verify your identity."
        />

        {bannerShouldShow && (
          <View className="bg-red-50 p-4 rounded-lg mb-4">
            {validationErrors && (
              <View className="mb-2">
                {validationErrors.map((error: ZodIssue, index: number) => (
                  <Typography key={index} className="text-red-600 text-sm">
                    {`${error.path.join('.')}: ${error.message}`}
                  </Typography>
                ))}
              </View>
            )}
            {wrapperErrorMessage && (
              <Typography className="text-red-600 text-sm mb-2">
                {wrapperErrorMessage}
              </Typography>
            )}
            {createPersonalInfoError?.message && (
              <Typography className="text-red-600 text-sm mb-2">
                {createPersonalInfoError.message}
              </Typography>
            )}
            {bannerShouldShowServerMessage && (
              <Typography className="text-red-600 text-sm mb-2">
                {bannerPayload?.message}
              </Typography>
            )}
            {bannerHasServerFieldErrors && (
              <View>
                {bannerPayload!.errors.map((error: any, index: number) => (
                  <Typography key={index} className="text-red-600 text-sm">
                    {`${error.field}: ${error.message}`}
                  </Typography>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="flex-col gap-3">
          {/* First Name */}
          <Controller
            control={form.control}
            name="firstName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="First Name"
                  placeholder="Enter first name"
                  value={value}
                  onChangeText={onChange}
                  editable={!createPersonalInfoLoading}
                />
                {error && (
                  <Typography className="text-red-600 text-xs">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Last Name */}
          <Controller
            control={form.control}
            name="lastName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Last Name"
                  placeholder="Enter last name"
                  value={value}
                  onChangeText={onChange}
                  editable={!createPersonalInfoLoading}
                />
                {error && (
                  <Typography style={{ color: '#DC2626', fontSize: 12 }}>
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Maiden Name */}
          <Controller
            control={form.control}
            name="maidenName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Maiden Name"
                  placeholder="Enter maiden name"
                  value={value || ''}
                  onChangeText={onChange}
                  editable={!createPersonalInfoLoading}
                />
                {error && (
                  <Typography style={{ color: '#DC2626', fontSize: 12 }}>
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="dateOfBirth"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <DatePicker
                label="Date of Birth"
                value={value}
                onDateChange={onChange}
                placeholder="Select date of birth"
                error={error?.message}
                disabled={createPersonalInfoLoading}
                maximumDate={new Date()}
              />
            )}
          />

          {/* Place of Birth */}
          <Controller
            control={form.control}
            name="placeOfBirth"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Place of Birth"
                  placeholder="Enter place of birth"
                  value={value}
                  onChangeText={onChange}
                  editable={!createPersonalInfoLoading}
                />
                {error && (
                  <Typography style={{ color: '#DC2626', fontSize: 12 }}>
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Nationality */}
          <Controller
            control={form.control}
            name="nationality"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <Dropdown
                  label="Nationality"
                  selectedValue={value}
                  onSelect={(option: DropdownOption) => onChange(option.value)}
                  placeholder="Select your nationality"
                  options={countryOptions}
                  searchable
                  searchPlaceholder="Search countries..."
                  disabled={createPersonalInfoLoading}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Country of Tax Residence */}
          <Controller
            control={form.control}
            name="countryOrTaxResidence"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <Dropdown
                  label="Country of Tax Residence"
                  selectedValue={value}
                  onSelect={(option: DropdownOption) => onChange(option.value)}
                  placeholder="Select your country of tax residence"
                  options={countryOptions}
                  searchable
                  searchPlaceholder="Search countries..."
                  disabled={createPersonalInfoLoading}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Tax ID */}
          <Controller
            control={form.control}
            name="taxIdentificationNumber"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Tax Identification Number"
                  placeholder="Enter tax ID number"
                  value={value || ''}
                  onChangeText={onChange}
                  editable={!createPersonalInfoLoading}
                />
                {error && (
                  <Typography style={{ color: '#DC2626', fontSize: 12 }}>
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="occupation"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <Dropdown
                  label="Occupation"
                  selectedValue={value}
                  onSelect={(option: DropdownOption) => onChange(option.value)}
                  placeholder="Select occupation"
                  options={occupationOptions}
                  searchable
                  searchPlaceholder="Search occupations..."
                  disabled={createPersonalInfoLoading}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Current Employer */}
          <Controller
            control={form.control}
            name="currentEmployer"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Current Employer"
                  placeholder="Enter employer"
                  value={value || ''}
                  onChangeText={onChange}
                  editable={!createPersonalInfoLoading}
                />
                {error && (
                  <Typography style={{ color: '#DC2626', fontSize: 12 }}>
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Employment Status */}
          <Controller
            control={form.control}
            name="employmentStatus"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <Dropdown
                  label="Employment Status"
                  selectedValue={value}
                  onSelect={(option: DropdownOption) => onChange(option.value)}
                  placeholder="Select employment status"
                  options={employmentStatusOptions}
                  disabled={createPersonalInfoLoading}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={form.handleSubmit(onSubmit)}
            disabled={createPersonalInfoLoading}
            className={`py-4 px-8 rounded-lg items-center mb-6 ${
              createPersonalInfoLoading ? 'bg-red-500' : 'bg-red-600'
            }`}
          >
            {createPersonalInfoLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography className="text-white text-base font-semibold">
                Save and continue
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {createPersonalInfoLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ScreenContainer>
  );
}
