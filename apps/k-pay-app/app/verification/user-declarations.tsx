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
import { useCreateDeclarationAndCommitment } from '@/hooks/api/kyc-hooks';
import { KYC_ROUTE_COUNT } from '@/constants';
import { FormProgress } from '@/components/form/form-progress';
import { SuccessAlert } from '@/components/alert/variants';

export default function UserDeclarationsVerificationScreen() {
  const router = useRouter();
  type FormValues = {
    fullName: string;
    institutionName: string;
    certifyAccurate: boolean;
    acknowledgeAML: boolean;
  };

  const {
    createDeclarationAndCommitment,
    loading: createDeclarationLoading,
    error: createDeclarationError,
    data: createDeclarationData,
  } = useCreateDeclarationAndCommitment();

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
      fullName: '',
      institutionName: '',
      certifyAccurate: false,
      acknowledgeAML: false,
    },
  });

  async function onSubmit(values: any) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);

      const errors: ZodIssue[] = [];

      if (!values.fullName || values.fullName.length < 2)
        errors.push({
          path: ['fullName'],
          message: 'Full name is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.institutionName || values.institutionName.length < 2)
        errors.push({
          path: ['institutionName'],
          message: 'Institution name is required',
          code: 'custom',
        } as ZodIssue);
      if (!values.certifyAccurate)
        errors.push({
          path: ['certifyAccurate'],
          message: 'You must certify that the information is accurate',
          code: 'custom',
        } as ZodIssue);
      if (!values.acknowledgeAML)
        errors.push({
          path: ['acknowledgeAML'],
          message: 'You must acknowledge the anti-money laundering statement',
          code: 'custom',
        } as ZodIssue);

      if (errors.length > 0) {
        setValidationErrors(errors);
        scrollToTopOfForm();
        return;
      }

      const input = {
        individualsFullName: values.fullName,
        companyName: values.institutionName,
        informationIsAccurate: values.certifyAccurate,
        hasAcknowledgeInformationCollectionAmlCft: values.acknowledgeAML,
      };

      const result = await createDeclarationAndCommitment({
        variables: { input },
      });

      const res = {
        ok:
          !result.errors &&
          result.data?.createDeclarationAndCommitment?.success,
        error: result.errors?.[0] || undefined,
      };

      if (res.ok) {
        router.push('/verification/complete');
      } else {
        setWrapperErrorMessage(res.error?.message || 'An error occurred');
        scrollToTopOfForm();
      }
    } catch (error: any) {
      setWrapperErrorMessage(error?.message || 'An unexpected error occurred');
      scrollToTopOfForm();
    }
  }

  const bannerPayload = createDeclarationData?.createDeclarationAndCommitment;
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
    createDeclarationError ||
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
          altOption={<FormProgress currentStep={7} steps={KYC_ROUTE_COUNT} />}
          title="Declarations and Commitment(s)"
          description=" Confirm and acknowledge before submitting"
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
            {createDeclarationError?.message && (
              <Typography className="text-red-600 text-sm mb-2">
                {createDeclarationError.message}
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
            name="fullName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Full Name (for declaration/signature)"
                  placeholder="Enter your full name"
                  value={value}
                  onChangeText={onChange}
                  editable={!createDeclarationLoading}
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
            name="institutionName"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <CustomTextInput
                  label="Institution Name"
                  placeholder="Enter institution name"
                  value={value}
                  onChangeText={onChange}
                  editable={!createDeclarationLoading}
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
            name="certifyAccurate"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TouchableOpacity
                  className="flex-row items-start gap-3 py-4"
                  onPress={() => onChange(!value)}
                  disabled={createDeclarationLoading}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${
                      value ? 'border-red-600 bg-red-600' : 'border-gray-300'
                    }`}
                  >
                    {value && (
                      <Typography className="text-white text-xs font-bold">
                        ✓
                      </Typography>
                    )}
                  </View>
                  <View className="flex-1">
                    <Typography className="text-gray-900 text-base leading-6">
                      I certify that the information provided is accurate and
                      complete
                    </Typography>
                  </View>
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
            name="acknowledgeAML"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TouchableOpacity
                  className="flex-row items-start gap-3 py-4"
                  onPress={() => onChange(!value)}
                  disabled={createDeclarationLoading}
                >
                  <View
                    className={`w-5 h-5 rounded border-2 items-center justify-center mt-0.5 ${
                      value ? 'border-red-600 bg-red-600' : 'border-gray-300'
                    }`}
                  >
                    {value && (
                      <Typography className="text-white text-xs font-bold">
                        ✓
                      </Typography>
                    )}
                  </View>
                  <View className="flex-1">
                    <Typography className="text-gray-900 text-base leading-6">
                      I acknowledge that this information may be used for
                      anti-money laundering and counter-terrorism purposes
                    </Typography>
                  </View>
                </TouchableOpacity>
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
            disabled={createDeclarationLoading}
            className={`w-full py-4 px-8 rounded-xl items-center mt-8 ${
              createDeclarationLoading ? 'bg-gray-400' : 'bg-red-600'
            }`}
          >
            {createDeclarationLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography className="text-white text-base font-semibold">
                Submit KYC
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {createDeclarationLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-xl p-6 items-center">
            <ActivityIndicator size="large" color="#EF4444" />
            <Typography className="text-gray-900 mt-4 font-medium">
              Submitting KYC info
            </Typography>
          </View>
        </View>
      )}
    </ScreenContainer>
  );
}
