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
import { useCreateBankInfo } from '@/hooks/api/use-create-bank-info';
import { countries } from '@/data/countries';
import { useUnifiedBanks } from '@/hooks/bank/use-unified-banks';
import { createBankingInfoSchema } from 'schema/banks';
import { FormProgress } from '@/components/form/form-progress';
import { KYC_ROUTE_COUNT } from '@/constants';

const countryOptions: DropdownOption[] = countries.map((country) => ({
  value: country.code,
  label: country.name,
  icon: (
    <Typography variant="body" className="text-lg">
      {country.flag}
    </Typography>
  ),
}));

export default function BankInfoVerificationScreen() {
  const router = useRouter();
  const {
    banks,
    loading: banksLoading,
    resolveBankAccount,
  } = useUnifiedBanks('paystack');

  const bankOptions = React.useMemo(
    () =>
      banks.map((bank: { code: string; name: string }) => ({
        value: bank.code,
        label: bank.name,
      })),
    [banks]
  );

  const [
    createBankInfoMutation,
    {
      loading: createBankInfoLoading,
      error: createBankInfoError,
      data: createBankInfoData,
    },
  ] = useCreateBankInfo();

  const formSchema = createBankingInfoSchema();
  type FormValues = z.infer<typeof formSchema>;

  const [validationErrors, setValidationErrors] = React.useState<
    ZodIssue[] | null
  >(null);
  const [wrapperErrorMessage, setWrapperErrorMessage] = React.useState<
    string | null
  >(null);
  const [accountName, setAccountName] = React.useState<string>('');
  const [validatingAccount, setValidatingAccount] = React.useState(false);
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
      countryAccountHeld: countries[0].code,
      primaryBank: '',
      accountNumber: '',
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(
      async (value: any, { name }: { name?: string }) => {
        if (
          name === 'accountNumber' &&
          value.accountNumber &&
          value.primaryBank
        ) {
          const accountNumber = value.accountNumber;
          const bankCode = value.primaryBank;

          if (accountNumber.length === 10 && bankCode) {
            try {
              setValidatingAccount(true);
              const accountDetails = await resolveBankAccount(
                accountNumber,
                bankCode
              );
              if (accountDetails) {
                setAccountName(accountDetails.accountName);
                form.clearErrors('accountNumber');
              } else {
                setAccountName('');
                form.setError('accountNumber', {
                  type: 'manual',
                  message: 'Invalid account number for the selected bank',
                });
              }
            } catch (error) {
              setAccountName('');
              form.setError('accountNumber', {
                type: 'manual',
                message: 'Error validating account',
              });
            } finally {
              setValidatingAccount(false);
            }
          } else {
            setAccountName('');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [form, resolveBankAccount]);

  async function onSubmit(values: FormValues) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);

      const { primaryBank, accountNumber } = values;
      if (primaryBank && accountNumber) {
        const accountDetails = await resolveBankAccount(
          accountNumber,
          primaryBank
        );
        if (!accountDetails) {
          setValidationErrors([
            {
              path: ['accountNumber'],
              message: 'Invalid account number for the selected bank',
              code: 'custom',
            } as ZodIssue,
          ]);
          scrollToTopOfForm();
          return;
        }
      }

      const validationResult = formSchema.safeParse(values);
      if (!validationResult.success) {
        setValidationErrors(validationResult.error.issues);
        scrollToTopOfForm();
        return;
      }

      const selectedBank = banks.find(
        (bank) => bank.code === values.primaryBank
      );
      if (!selectedBank) {
        setWrapperErrorMessage('Selected bank not found');
        scrollToTopOfForm();
        return;
      }

      const formattedValues = {
        countryAccountHeld: values.countryAccountHeld,
        primaryBank: selectedBank.name,
        accountNumber: values.accountNumber,
      };

      const result = await createBankInfoMutation({
        variables: { input: formattedValues },
      });

      const res = {
        ok: !result.errors && result.data?.createBankInfo,
        error: result.errors?.[0] || undefined,
      };

      if (res.ok) {
        router.push('/verification/contact-info');
      } else {
        setWrapperErrorMessage(res.error?.message || 'An error occurred');
        scrollToTopOfForm();
      }
    } catch (error: any) {
      setWrapperErrorMessage(error?.message || 'An unexpected error occurred');
      scrollToTopOfForm();
    }
  }

  const bannerPayload = createBankInfoData?.createBankInfo;
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
    createBankInfoError ||
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
          title="Banking Information"
          altOption={<FormProgress steps={KYC_ROUTE_COUNT} currentStep={2} />}
          description=" Provide basic details about your bank"
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
            {createBankInfoError?.message && (
              <Typography className="text-red-600 text-sm mb-2">
                {createBankInfoError.message}
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

        <View className="space-y-4 gap-6">
          {/* Country Account Held */}
          <Controller
            control={form.control}
            name="countryAccountHeld"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <Dropdown
                  label="Country Account Held"
                  selectedValue={value}
                  onSelect={(option: DropdownOption) => {
                    onChange(option.value);
                    form.setValue('primaryBank', '');
                    form.setValue('accountNumber', '');
                    setAccountName('');
                  }}
                  placeholder="Select country"
                  options={countryOptions}
                  searchable
                  searchPlaceholder="Search countries..."
                  disabled={createBankInfoLoading}
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Primary Bank */}
          <Controller
            control={form.control}
            name="primaryBank"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <Dropdown
                  label="Primary Bank"
                  selectedValue={value}
                  onSelect={(option: DropdownOption) => {
                    onChange(option.value);
                    form.setValue('accountNumber', '');
                    setAccountName('');
                  }}
                  placeholder={
                    banksLoading ? 'Loading banks...' : 'Select bank'
                  }
                  options={bankOptions}
                  searchable
                  searchPlaceholder="Search banks..."
                  disabled={
                    createBankInfoLoading ||
                    !form.getValues('countryAccountHeld') ||
                    banksLoading
                  }
                />
                {error && (
                  <Typography className="text-red-500 text-xs mt-1">
                    {error.message}
                  </Typography>
                )}
              </View>
            )}
          />

          {/* Account Number */}
          <Controller
            control={form.control}
            name="accountNumber"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <View className="relative">
                  <CustomTextInput
                    label="Account Number"
                    placeholder="Enter your account number"
                    value={value}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, '');
                      if (numericValue.length <= 10) {
                        onChange(numericValue);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={10}
                    // editable={
                    //   !!form.getValues('primaryBank') && !createBankInfoLoading
                    // }
                    hasError={!!error}
                    style={{
                      borderColor: accountName
                        ? '#10B981'
                        : error
                          ? '#EF4444'
                          : '#D1D5DB',
                    }}
                  />
                  {validatingAccount && (
                    <View className="absolute right-3 top-4">
                      <ActivityIndicator size="small" color="#9CA3AF" />
                    </View>
                  )}
                </View>
                {accountName && (
                  <Typography className="text-green-600 text-sm font-medium mt-1">
                    {accountName}
                  </Typography>
                )}
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
            disabled={createBankInfoLoading}
            className={`w-full py-4 px-8 rounded-xl items-center mt-8 ${
              createBankInfoLoading ? 'bg-gray-400' : 'bg-red-600'
            }`}
          >
            {createBankInfoLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Typography className="text-white text-base font-semibold">
                Save and continue
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {createBankInfoLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ScreenContainer>
  );
}
