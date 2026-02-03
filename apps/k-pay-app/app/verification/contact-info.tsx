import React from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

import { ZodIssue } from 'zod';
import { useRouter } from 'expo-router';
import { Typography, Dropdown } from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import CustomTextInput from '@/components/input/custom-text-input';
import { useCreateContactDetail } from '@/hooks/api/use-create-contact-detail';
import { countries, Country } from '@/data/countries';
import { FormProgress } from '@/components/form/form-progress';
import { KYC_ROUTE_COUNT } from '@/constants';

const nigerianStates = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'FCT',
];

const getStatesForCountry = (countryCode: string): string[] => {
  if (countryCode === 'NG') return nigerianStates;
  return [];
};

export default function ContactInfoPage() {
  const router = useRouter();
  type FormValues = {
    country: string;
    street: string;
    city: string;
    postalCode: string;
    mailingAddress1?: string;
    mailingAddress2?: string;
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    addressProofUrl?: any;
  };

  const {
    createContactDetail,
    loading: createContactDetailLoading,
    error: createContactDetailError,
    data: createContactDetailData,
  } = useCreateContactDetail();

  const [validationErrors, setValidationErrors] = React.useState<
    ZodIssue[] | null
  >(null);
  const [wrapperErrorMessage, setWrapperErrorMessage] = React.useState<
    string | null
  >(null);
  const [selectedFile, setSelectedFile] = React.useState<{
    name: string;
    uri: string;
  } | null>(null);
  const errorTopRef = React.useRef<ScrollView>(null);

  const scrollToTopOfForm = () => {
    try {
      errorTopRef.current?.scrollTo({ y: 0, animated: true });
    } catch {
      errorTopRef.current?.scrollTo({ y: 0 });
    }
  };

  const countryOptions = React.useMemo(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.name,
        icon: <Typography className="text-xl">{country.flag}</Typography>,
      })),
    []
  );

  const findCountryByCode = (code?: string): Country | null => {
    if (!code) return null;
    return countries.find((country) => country.code === code) || null;
  };

  const form = useForm({
    defaultValues: {
      country: 'NG',
      street: '',
      city: '',
      postalCode: '',
      mailingAddress1: '',
      mailingAddress2: '',
      primaryPhone: '',
      secondaryPhone: '',
      email: '',
      addressProofUrl: undefined,
    },
  });

  const stateOptions = React.useMemo(() => {
    const countryCode = form.watch('country');
    const states = getStatesForCountry(countryCode || 'NG');
    return states.map((state) => ({
      value: state,
      label: state,
    }));
  }, [form.watch('country')]);

  const pickDocument = async () => {
    Alert.alert(
      'Select Document',
      'File upload functionality will be implemented with proper file picker',
      [
        {
          text: 'Simulate Selection',
          onPress: () => {
            const mockFile = { name: 'address_proof.pdf', uri: 'mock://file' };
            setSelectedFile(mockFile);
            form.setValue('addressProofUrl', mockFile as any);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  async function onSubmit(values: any) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);

      const errors: ZodIssue[] = [];

      if (!selectedFile) {
        errors.push({
          path: ['addressProofUrl'],
          message: 'Address proof file is required',
          code: 'custom',
        } as ZodIssue);
      }

      if (!values.country)
        errors.push({
          path: ['country'],
          message: 'Country is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.street || values.street.length < 3)
        errors.push({
          path: ['street'],
          message: 'Street must be at least 3 characters',
          code: 'custom',
        } as ZodIssue);
      if (!values.city)
        errors.push({
          path: ['city'],
          message: 'City is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.postalCode)
        errors.push({
          path: ['postalCode'],
          message: 'Postal code is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.primaryPhone)
        errors.push({
          path: ['primaryPhone'],
          message: 'Primary phone is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        errors.push({
          path: ['email'],
          message: 'Valid email is required',
          code: 'custom',
        } as ZodIssue);

      if (errors.length > 0) {
        setValidationErrors(errors);
        scrollToTopOfForm();
        return;
      }

      const input = {
        residentialStreet: values.street,
        residentialCity: values.city,
        residentialPostalCode: values.postalCode,
        residentialCountry: values.country,
        primaryPhone: values.primaryPhone,
        emailAddress: values.email,
        addressProofUrl: selectedFile,
      };

      const result = await createContactDetail({
        variables: { input },
      });

      const res = {
        ok: !result.errors && result.data?.createContactDetail?.success,
        error: result.errors?.[0] || undefined,
      };

      if (res.ok) {
        router.push('/verification/political-exposure');
      } else {
        setWrapperErrorMessage(res.error?.message || 'An error occurred');
        scrollToTopOfForm();
      }
    } catch (error: any) {
      setWrapperErrorMessage(error?.message || 'An unexpected error occurred');
      scrollToTopOfForm();
    }
  }

  const bannerPayload = createContactDetailData?.createContactDetail;
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
    createContactDetailError ||
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
        className="flex-1 px-4 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <HeaderWithTitle
          title="Contact Information"
          altOption={<FormProgress currentStep={3} steps={KYC_ROUTE_COUNT} />}
          description=" Provide your contact details for verification."
        />

        {bannerShouldShow && (
          <View className="bg-red-50 p-4 rounded-lg mb-4 border border-red-100">
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
            {createContactDetailError?.message && (
              <Typography className="text-red-600 text-sm mb-2">
                {createContactDetailError.message}
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

        <View className="space-y-4 gap-4">
          <Controller
            control={form.control}
            name="addressProofUrl"
            render={({ field: { onChange }, fieldState: { error } }) => (
              <View>
                <Typography className="text-sm font-medium mb-2 text-gray-900">
                  Proof of Address (Upload)
                </Typography>
                <TouchableOpacity
                  onPress={pickDocument}
                  disabled={createContactDetailLoading}
                  className={`w-full px-4 py-4 rounded-xl border ${
                    error ? 'border-red-500' : 'border-gray-200'
                  } ${
                    createContactDetailLoading
                      ? 'opacity-50 bg-gray-50'
                      : 'bg-white'
                  }`}
                >
                  <Typography
                    className={`text-base ${
                      selectedFile ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {selectedFile
                      ? selectedFile.name
                      : 'Select file (PDF or Image)'}
                  </Typography>
                </TouchableOpacity>
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="country"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Dropdown
                label="Country"
                options={countryOptions}
                selectedValue={value}
                onSelect={(option) => {
                  onChange(option.value);
                  // Clear city when country changes
                  form.setValue('city', '');
                }}
                placeholder="Select country"
                searchable
                searchPlaceholder="Search country..."
                disabled={createContactDetailLoading}
                error={error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="street"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Street and Number"
                  placeholder="Enter street"
                  value={value}
                  onChangeText={onChange}
                  editable={!createContactDetailLoading}
                  hasError={!!error}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="city"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Dropdown
                label="City/State"
                options={stateOptions}
                selectedValue={value}
                onSelect={(option) => onChange(option.value)}
                placeholder="Select city/state"
                searchable
                searchPlaceholder="Search state..."
                disabled={
                  createContactDetailLoading || stateOptions.length === 0
                }
                error={error?.message}
              />
            )}
          />

          <Controller
            control={form.control}
            name="postalCode"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Postal Code"
                  placeholder="Enter postal code"
                  value={value}
                  onChangeText={onChange}
                  editable={!createContactDetailLoading}
                  hasError={!!error}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="mailingAddress1"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Mailing Address 1 (Optional)"
                  placeholder="Enter mailing address"
                  value={value || ''}
                  onChangeText={onChange}
                  editable={!createContactDetailLoading}
                  hasError={!!error}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="mailingAddress2"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Mailing Address 2 (Optional)"
                  placeholder="Enter mailing address"
                  value={value || ''}
                  onChangeText={onChange}
                  editable={!createContactDetailLoading}
                  hasError={!!error}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="primaryPhone"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Primary Phone Number"
                  placeholder="Enter primary phone number"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  editable={!createContactDetailLoading}
                  hasError={!!error}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="secondaryPhone"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Secondary Phone Number (Optional)"
                  placeholder="Enter secondary phone number"
                  value={value || ''}
                  onChangeText={onChange}
                  keyboardType="phone-pad"
                  editable={!createContactDetailLoading}
                  hasError={!!error}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Email Address"
                  placeholder="janeunin@gmail.com"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!createContactDetailLoading}
                  hasError={!!error}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          <TouchableOpacity
            onPress={form.handleSubmit(onSubmit)}
            disabled={createContactDetailLoading}
            className={`w-full py-4 px-8 rounded-xl items-center mt-8 ${
              createContactDetailLoading ? 'bg-gray-400' : 'bg-red-600'
            }`}
          >
            {createContactDetailLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography className="text-white text-base font-semibold">
                Save and continue
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {createContactDetailLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ScreenContainer>
  );
}
