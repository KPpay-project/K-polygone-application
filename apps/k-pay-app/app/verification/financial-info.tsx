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
import { Typography } from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { HeaderWithTitle } from '@/components';
import CustomTextInput from '@/components/input/custom-text-input';
import { useCreateFinancialInfo } from '@/hooks/api/use-create-financial-info';
import { FormProgress } from '@/components/form/form-progress';
import { KYC_ROUTE_COUNT } from '@/constants';

export default function FinancialInfoVerificationScreen() {
  const router = useRouter();
  type FormValues = {
    salary: string;
    estimatedAnnualIncome: string;
    estimatedNetWorth: string;
  };

  const {
    createFinancialInfo,
    loading: createFinancialInfoLoading,
    error: createFinancialInfoError,
    data: createFinancialInfoData,
  } = useCreateFinancialInfo();

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

  const form = useForm({
    defaultValues: {
      salary: '',
      estimatedAnnualIncome: '',
      estimatedNetWorth: '',
    },
  });

  async function onSubmit(values: any) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);

      const errors: ZodIssue[] = [];

      if (!values.salary)
        errors.push({
          path: ['salary'],
          message: 'Salary is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.estimatedAnnualIncome)
        errors.push({
          path: ['estimatedAnnualIncome'],
          message: 'Estimated annual income is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.estimatedNetWorth)
        errors.push({
          path: ['estimatedNetWorth'],
          message: 'Estimated net worth is required',
          code: 'custom',
        } as ZodIssue);

      if (errors.length > 0) {
        setValidationErrors(errors);
        scrollToTopOfForm();
        return;
      }

      const input = {
        salary: values.salary,
        estimatedAnnualIncome: values.estimatedAnnualIncome,
        estimatedNetWorth: values.estimatedNetWorth,
      };

      const result = await createFinancialInfo({
        variables: { input },
      });

      const res = {
        ok: !result.errors && result.data?.createFinancialInfo?.success,
        error: result.errors?.[0] || undefined,
      };

      if (res.ok) {
        router.push('/verification/user-declarations');
      } else {
        setWrapperErrorMessage(res.error?.message || 'An error occurred');
        scrollToTopOfForm();
      }
    } catch (error: any) {
      setWrapperErrorMessage(error?.message || 'An unexpected error occurred');
      scrollToTopOfForm();
    }
  }

  const bannerPayload = createFinancialInfoData?.createFinancialInfo;
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
    createFinancialInfoError ||
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
          altOption={<FormProgress currentStep={6} steps={KYC_ROUTE_COUNT} />}
          title="Financial Information"
          description="Provide basic details about your source of funds"
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
            {createFinancialInfoError?.message && (
              <Typography className="text-red-600 text-sm mb-2">
                {createFinancialInfoError.message}
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

        <View className="space-y-4 gap-4">
          <Controller
            control={form.control}
            name="salary"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Salary"
                  placeholder="$20,000"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  editable={!createFinancialInfoLoading}
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
            name="estimatedAnnualIncome"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Estimated Annual Income"
                  placeholder="$20,000"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  editable={!createFinancialInfoLoading}
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
            name="estimatedNetWorth"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Estimated Net Worth"
                  placeholder="$20,000"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="numeric"
                  editable={!createFinancialInfoLoading}
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
            disabled={createFinancialInfoLoading}
            className={`w-full py-4 px-8 rounded-xl items-center mt-8 ${
              createFinancialInfoLoading ? 'bg-gray-400' : 'bg-red-600'
            }`}
          >
            {createFinancialInfoLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography className="text-white text-base font-semibold">
                Save and continue
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {createFinancialInfoLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ScreenContainer>
  );
}
