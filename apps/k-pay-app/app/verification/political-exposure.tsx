import React from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { ZodIssue } from 'zod';
import { useRouter } from 'expo-router';
import { Typography, Dropdown } from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import CustomTextInput from '@/components/input/custom-text-input';
import { useCreatePoliticalExposure } from '@/hooks/api/use-create-political-exposure';
import { FormProgress } from '@/components/form/form-progress';
import { KYC_ROUTE_COUNT } from '@/constants';
import { DatePicker } from '@/components/ui/date-picker/date-picker';
import { countries } from '@/data/countries';

export default function PoliticalExposureVerificationScreen() {
  const router = useRouter();
  type FormValues = {
    isPep: boolean;
    positionHeld: string;
    country: string;
    startDate: string;
    endDate: string;
  };

  const {
    createPoliticalExposure,
    loading: createPoliticalExposureLoading,
    error: createPoliticalExposureError,
    data: createPoliticalExposureData,
  } = useCreatePoliticalExposure();

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

  const countryOptions = React.useMemo(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.name,
        icon: <Typography className="text-xl">{country.flag}</Typography>,
      })),
    []
  );

  const findCountryByValue = (value?: string) => {
    if (!value) return null;
    return countries.find((country) => country.code === value) || null;
  };

  const form = useForm({
    defaultValues: {
      isPep: false,
      positionHeld: '',
      country: '',
      startDate: '',
      endDate: '',
    },
  });

  const watchIsPep = form.watch('isPep');

  React.useEffect(() => {
    if (!watchIsPep) {
      form.setValue('positionHeld', '');
      form.setValue('country', '');
      form.setValue('startDate', '');
      form.setValue('endDate', '');
    }
  }, [watchIsPep, form]);

  async function onSubmit(values: any) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);

      const errors: ZodIssue[] = [];

      if (values.isPep) {
        if (!values.positionHeld)
          errors.push({
            path: ['positionHeld'],
            message: 'Position held is required',
            code: 'custom',
          } as ZodIssue);
        if (!values.country)
          errors.push({
            path: ['country'],
            message: 'Country is required',
            code: 'custom',
          } as ZodIssue);
        if (!values.startDate)
          errors.push({
            path: ['startDate'],
            message: 'Start date is required',
            code: 'custom',
          } as ZodIssue);
        if (!values.endDate)
          errors.push({
            path: ['endDate'],
            message: 'End date is required',
            code: 'custom',
          } as ZodIssue);
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        scrollToTopOfForm();
        return;
      }

      const input: any = {
        isPep: Boolean(values.isPep),
      };

      if (values.isPep) {
        const selectedCountry = findCountryByValue(values.country);
        input.positionHeld = values.positionHeld;
        input.countryOfPosition = selectedCountry
          ? selectedCountry.name
          : values.country;
        input.startDate = values.startDate;
        input.endDate = values.endDate;
      }

      const result = await createPoliticalExposure({
        variables: { input },
      });

      const res = {
        ok: !result.errors && result.data?.createPoliticalExposure?.success,
        error: result.errors?.[0] || undefined,
      };

      if (res.ok) {
        router.push('/verification/identity-document');
      } else {
        setWrapperErrorMessage(res.error?.message || 'An error occurred');
        scrollToTopOfForm();
      }
    } catch (error: any) {
      setWrapperErrorMessage(error?.message || 'An unexpected error occurred');
      scrollToTopOfForm();
    }
  }

  const bannerPayload = createPoliticalExposureData?.createPoliticalExposure;
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
    createPoliticalExposureError ||
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
          title="Political Exposure (PEP)"
          altOption={<FormProgress currentStep={4} steps={KYC_ROUTE_COUNT} />}
          description="Tell us if you hold or have held a public office role
        "
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
            {createPoliticalExposureError?.message && (
              <Typography className="text-red-600 text-sm mb-2">
                {createPoliticalExposureError.message}
              </Typography>
            )}
            {bannerShouldShowServerMessage && (
              <Typography className="text-red-600 text-sm mb-2">
                {bannerPayload?.message}
              </Typography>
            )}
            {bannerHasServerFieldErrors && bannerPayload?.errors && (
              <View>
                {bannerPayload.errors.map((error: any, index: number) => (
                  <Typography key={index} className="text-red-600 text-sm">
                    {`${error.field}: ${error.message}`}
                  </Typography>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="space-y-6 gap-4">
          <Controller
            control={form.control}
            name="isPep"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <Typography className="text-lg font-medium mb-4 text-gray-900">
                  Are you a Politically Exposed Person (PEP)?
                </Typography>
                <View className="flex-row gap-6 mb-4">
                  <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => onChange(true)}
                    disabled={createPoliticalExposureLoading}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        value === true
                          ? 'border-red-600 bg-red-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {value === true && (
                        <View className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </View>
                    <Typography className="text-gray-900">Yes</Typography>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => onChange(false)}
                    disabled={createPoliticalExposureLoading}
                  >
                    <View
                      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                        value === false
                          ? 'border-red-600 bg-red-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {value === false && (
                        <View className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </View>
                    <Typography className="text-gray-900">No</Typography>
                  </TouchableOpacity>
                </View>
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {watchIsPep && (
            <View className="space-y-4 gap-4">
              <Controller
                control={form.control}
                name="positionHeld"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <CustomTextInput
                      label="Position Held"
                      placeholder="Enter position held"
                      value={value}
                      onChangeText={onChange}
                      editable={!createPoliticalExposureLoading}
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
                name="country"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Dropdown
                    label="Country where the Position is/was Held"
                    options={countryOptions}
                    selectedValue={value}
                    onSelect={(option) => onChange(option.value)}
                    placeholder="Select country"
                    searchable
                    searchPlaceholder="Search country..."
                    disabled={createPoliticalExposureLoading}
                    error={error?.message}
                  />
                )}
              />

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Controller
                    control={form.control}
                    name="startDate"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <DatePicker
                        label="Start Date"
                        value={value ? new Date(value) : undefined}
                        onDateChange={(date) =>
                          onChange(date.toISOString().split('T')[0])
                        }
                        placeholder="Select start date"
                        disabled={createPoliticalExposureLoading}
                        error={error?.message}
                      />
                    )}
                  />
                </View>

                <View className="flex-1">
                  <Controller
                    control={form.control}
                    name="endDate"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <DatePicker
                        label="End Date"
                        value={value ? new Date(value) : undefined}
                        onDateChange={(date) =>
                          onChange(date.toISOString().split('T')[0])
                        }
                        placeholder="Select end date"
                        disabled={createPoliticalExposureLoading}
                        error={error?.message}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={form.handleSubmit(onSubmit)}
            disabled={createPoliticalExposureLoading}
            className={`w-full py-4 px-8 rounded-xl items-center mt-8 ${
              createPoliticalExposureLoading ? 'bg-gray-400' : 'bg-red-600'
            }`}
          >
            {createPoliticalExposureLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography className="text-white text-base font-semibold">
                Save and continue
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {createPoliticalExposureLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ScreenContainer>
  );
}
