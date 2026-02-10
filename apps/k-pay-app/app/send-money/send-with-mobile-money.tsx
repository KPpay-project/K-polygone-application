import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { Typography, ReusableButton, Dropdown } from '@/components/ui';
import type { DropdownOption } from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import { StatusScreen } from '@/components/fallbacks/status-screen';
import Toast from 'react-native-toast-message';
import { useWithdrawOrTransfer } from '@/hooks/api/use-withdraw-or-transfer';
import { TRANSFER_PROVIDERS_ARRAY } from '@/constants';
import { SupportedProviders, WithdrawalInput } from '@/types/graphql';
import { HeaderWithTitle } from '@/components';
import { useWalletAbstractor } from '@/hooks/use-wallet';
import { countries } from '@/data/countries';
import CustomTextInput from '@/components/input/custom-text-input';
import { useLocalSearchParams } from 'expo-router';
import CurrencyDropdownWithBalance from '@/components/currency/currency-dropdown-with-balance';
import VerifyTransactionPin from '@/components/actions/verify-pin-action';

type FormData = {
  amount: string;
  currencyCode: string;
  description: string;
  provider: SupportedProviders;
  receiverPhone: string;
  walletId: string;
  country: string;
};

type FormErrors = {
  amount?: string;
  currencyCode?: string;
  description?: string;
  provider?: string;
  receiverPhone?: string;
  walletId?: string;
  country?: string;
};

function TransferForm() {
  const { provider: urlProvider } = useLocalSearchParams<{
    provider?: string;
  }>();
  const { walletData, walletId, currency } = useWalletAbstractor();

  const [form, setForm] = useState<FormData>({
    amount: '',
    currencyCode: currency.code,
    description: '',
    provider:
      (urlProvider as SupportedProviders) || SupportedProviders.MTN_MOMO,
    receiverPhone: '',
    walletId: walletId || '',
    country: 'NG',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showStatus, setShowStatus] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<{
    availableBalance: string;
    currencyCode: string;
    currencyId: string;
    walletId: string;
  } | null>(null);

  const { withdrawOrTransfer, loading } = useWithdrawOrTransfer();

  useEffect(() => {
    if (walletId && walletId !== form.walletId) {
      setForm((prev) => ({ ...prev, walletId, currencyCode: currency.code }));
    }
  }, [walletId, currency.code, form.walletId]);

  useEffect(() => {
    if (
      urlProvider &&
      Object.values(SupportedProviders).includes(
        urlProvider as SupportedProviders
      )
    ) {
      setForm((prev) => ({
        ...prev,
        provider: urlProvider as SupportedProviders,
        description: `Transfer to ${TRANSFER_PROVIDERS_ARRAY.find((p) => p.key === urlProvider)?.label || 'Mobile Money'}`,
      }));
    }
  }, [urlProvider]);

  const countryOptions: DropdownOption[] = useMemo(
    () =>
      countries.map((country) => ({
        value: country.code,
        label: country.name,
        icon: (
          <Typography variant="body" className="text-lg">
            {country.flag}
          </Typography>
        ),
      })),
    []
  );

  const selectedProvider = TRANSFER_PROVIDERS_ARRAY.find(
    (p) => p.key === form.provider
  );

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.walletId) newErrors.walletId = 'Wallet is required';
    if (!form.currencyCode) newErrors.currencyCode = 'Currency is required';
    if (!form.amount || parseFloat(form.amount) <= 0)
      newErrors.amount = 'Valid amount is required';
    if (!form.receiverPhone)
      newErrors.receiverPhone = 'Phone number is required';
    if (!form.country) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleContinue = () => {
    if (!validate()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all required fields.',
      });
      return;
    }
    setShowPinModal(true);
  };

  const handlePinVerified = async (pin: string) => {
    setShowPinModal(false);

    try {
      const input: WithdrawalInput = {
        walletId: selectedCurrency?.walletId || form.walletId,
        currencyCode: selectedCurrency?.currencyCode || form.currencyCode,
        amount: parseFloat(form.amount),
        provider: form.provider,
        receiverPhone: form.receiverPhone,
        description:
          form.description || `Transfer to ${selectedProvider?.label}`,
        paymentPin: pin,
      };

      const result = await withdrawOrTransfer({ variables: { input } });

      if (result.errors && result.errors.length > 0) {
        const msg =
          result.errors[0]?.message || 'Transfer failed. Please try again.';
        setErrorMessage(msg);
        setShowStatus(true);
        Toast.show({ type: 'error', text1: 'Transfer Failed', text2: msg });
        return;
      }

      if (result.data?.withdrawOrTransfer?.success) {
        setErrorMessage('');
        setShowStatus(true);
        Toast.show({
          type: 'success',
          text1: 'Transfer Successful',
          text2: 'Your mobile money transfer was successful.',
        });
      } else {
        const msg =
          result.data?.withdrawOrTransfer?.message ||
          'Transfer failed. Please try again.';
        setErrorMessage(msg);
        setShowStatus(true);
        Toast.show({ type: 'error', text1: 'Transfer Failed', text2: msg });
      }
    } catch (error: any) {
      const msg =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      setErrorMessage(msg);
      setShowStatus(true);
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    }
  };

  if (showPinModal) {
    return (
      <ScreenContainer useSafeArea={true}>
        <VerifyTransactionPin
          onClose={() => setShowPinModal(false)}
          onSuccess={handlePinVerified}
          loading={loading}
          title="Verify Transaction"
          description="Enter your 4-digit PIN to authorize this transfer"
        />
      </ScreenContainer>
    );
  }

  if (showStatus) {
    return (
      <ScreenContainer useSafeArea={true}>
        <StatusScreen
          status={errorMessage ? 'failed' : 'success'}
          title={errorMessage ? 'Transfer Failed' : 'Transfer Successful'}
          message={
            errorMessage
              ? errorMessage
              : `Your ${selectedProvider?.label} transfer was completed successfully.`
          }
          buttonText="Done"
          onPress={() => setShowStatus(false)}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer useSafeArea={true}>
      <View className="px-6 pt-6">
        <HeaderWithTitle
          title=" Send with Mobile Money"
          description="Transfer funds to mobile money accounts easily."
        />

        <CurrencyDropdownWithBalance
          onCurrencySelect={(currency) => setSelectedCurrency(currency)}
        />

        {selectedProvider && (
          <View className="mb-4 p-4 bg-blue-50 rounded-xl">
            <Typography variant="small" className="text-gray-600 mb-1">
              Selected Provider
            </Typography>
            <Typography variant="body" className="font-semibold text-blue-900">
              {selectedProvider.label}
            </Typography>
            <Typography variant="caption" className="text-gray-600">
              {selectedProvider.description}
            </Typography>
          </View>
        )}

        {/* Country Selection */}
        <View className="mb-4">
          <Dropdown
            label="Country"
            options={countryOptions}
            selectedValue={form.country}
            onSelect={(option) => handleChange('country', option.value)}
            placeholder="Select country"
            searchable
            searchPlaceholder="Search countries..."
            error={errors.country}
          />
        </View>

        {/* Amount Input */}
        <View className="mb-4">
          <CustomTextInput
            label="Amount"
            placeholder="Enter amount (e.g., 2000)"
            value={form.amount}
            onChangeText={(v) => handleChange('amount', v)}
            keyboardType="decimal-pad"
          />
          {errors.amount && (
            <Typography className="text-red-500 text-xs mt-1">
              {errors.amount}
            </Typography>
          )}
        </View>

        {/* Phone Input */}
        <View className="mb-4">
          <CustomTextInput
            label="Receiver Phone Number"
            placeholder="Enter phone number (e.g., +254708374149)"
            value={form.receiverPhone}
            onChangeText={(phone: string) =>
              handleChange('receiverPhone', phone)
            }
            keyboardType="phone-pad"
          />
          {errors.receiverPhone && (
            <Typography className="text-red-500 text-xs mt-1">
              {errors.receiverPhone}
            </Typography>
          )}
        </View>

        {/* Description Input */}
        <View className="mb-8">
          <CustomTextInput
            label="Description (Optional)"
            placeholder={`Transfer to ${selectedProvider?.label || 'Mobile Money'}`}
            value={form.description}
            onChangeText={(v) => handleChange('description', v)}
          />
          {errors.description && (
            <Typography className="text-red-500 text-xs mt-1">
              {errors.description}
            </Typography>
          )}
        </View>

        <ReusableButton
          text={loading ? 'Processing...' : 'Send Money'}
          onPress={handleContinue}
          disabled={loading}
          className="w-full"
        />
      </View>
      <Toast />
    </ScreenContainer>
  );
}

export default TransferForm;
