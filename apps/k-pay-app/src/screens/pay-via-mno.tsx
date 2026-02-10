import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography, ReusableButton, PhoneInput } from '@/components/ui';
import { ContainerLayout } from '@/layout/safe-area-layout';
import CustomTextInput from '@/components/input/custom-text-input';
import { countries, Country } from '@/data/countries';
import { HeaderWithTitle } from '@/components';
import { StatusScreen } from '@/components/fallbacks/status-screen';
import { useDeposit, useMe } from '@/hooks/api';
import { useProfileStore } from '@/store/profile-store';
import {
  DepositViaBankScreenProps,
  FormErrors,
  TransactionStatus,
} from './types';
import { useWalletAbstractor } from '@/hooks/use-wallet';
import { getGraphQLErrorMessage } from '@/utils/error-handling';
import CurrencyDropdownWithBalance from '@/components/currency/currency-dropdown-with-balance';

interface DepositFormData {
  amount: string;
  phoneNumber: string;
  transactionId: string;
}

export default function DepositViaBankScreen({
  title,
  provider,
}: DepositViaBankScreenProps) {
  const router = useRouter();
  const { profile, fetchProfile } = useProfileStore();
  const [depositMutation, { loading: mutationLoading }] = useDeposit();
  const [form, setForm] = useState<DepositFormData>({
    amount: '',
    phoneNumber: '',
    transactionId: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { refetch: refetchMe } = useMe();

  const { walletData, walletId, hasWallet } = useWalletAbstractor();

  const currency_code = walletData?.currency?.code;

  const [selectedCurrency, setSelectedCurrency] = useState<{
    availableBalance: string;
    currencyCode: string;
    currencyId: string;
    walletId: string;
  } | null>(null);

  const setValue = (field: keyof DepositFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((country) => country.code === 'US') || countries[0]
  );

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.amount) newErrors.amount = 'Amount is required';
    if (!form.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!form.transactionId)
      newErrors.transactionId = 'Transaction ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setTransactionStatus('processing');
    setErrorMessage('');

    try {
      if (!hasWallet || !walletId) {
        setErrorMessage('No wallet found');
        setTransactionStatus('failed');
        setLoading(false);
        return;
      }
      const amount = parseFloat(form.amount.replace(/[^\d.]/g, ''));

      if (isNaN(amount) || amount <= 0) {
        setErrorMessage('Invalid amount');
        setTransactionStatus('failed');
        setLoading(false);
        return;
      }

      const payload = {
        amount: amount,
        country: selectedCountry.code,
        currencyCode: selectedCurrency?.currencyCode || currency_code || 'USD',
        customerPhone: form.phoneNumber,
        description: `Deposit via ${provider} - Phone: ${form.phoneNumber} - Ref: ${form.transactionId}`,
        provider: provider,
        walletId: walletId,
      };

      console.log('user payload', payload);

      const response = await depositMutation({ variables: { input: payload } });

      if (response?.data?.deposit?.success) {
        setTransactionStatus('success');
        refetchMe();
        await fetchProfile();
      } else {
        // Extract error message from GraphQL errors or use deposit message
        const errorMsg = getGraphQLErrorMessage(
          response,
          response?.data?.deposit?.message || 'Deposit failed'
        );
        setErrorMessage(errorMsg);
        setTransactionStatus('failed');
      }
    } catch (error: any) {
      console.error('Deposit error:', error);
      const errorMsg = getGraphQLErrorMessage(error, 'Deposit request failed');
      setErrorMessage(errorMsg);
      setTransactionStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setTransactionStatus('idle');
    setErrors({});
  };

  const handleGoBack = () => {
    router.back();
  };

  if (transactionStatus === 'success') {
    return (
      <ContainerLayout>
        <StatusScreen
          status="success"
          title="Deposit Successful!"
          message={`Your deposit of $${form.amount} via ${provider} has been processed successfully.`}
          buttonText="Done"
          onPress={handleGoBack}
        />
      </ContainerLayout>
    );
  }

  if (transactionStatus === 'failed') {
    return (
      <ContainerLayout>
        <StatusScreen
          status="failed"
          title="Deposit Failed"
          message={
            errorMessage ||
            'Your deposit could not be processed. Please check your details and try again.'
          }
          buttonText="Try Again"
          onPress={handleRetry}
        />
      </ContainerLayout>
    );
  }

  return (
    <ContainerLayout>
      <View className="flex-1 bg-white">
        {(loading || mutationLoading) && (
          <View className="absolute inset-0 bg-black/20 z-50 flex items-center justify-center">
            <View className="bg-white p-6 rounded-lg flex items-center">
              <ActivityIndicator size="large" color="#dc2626" />
              <Typography className="mt-3 text-gray-700">
                Processing your deposit...
              </Typography>
            </View>
          </View>
        )}
        <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          <HeaderWithTitle
            title={title}
            description="Deposit to our partner merchant"
          />

          <CurrencyDropdownWithBalance
            onCurrencySelect={(data) => {
              setSelectedCurrency(data);
            }}
          />

          <View className="mb-6">
            <CustomTextInput
              label="Amount"
              placeholder="$23"
              value={form.amount}
              onChangeText={(value: string) => setValue('amount', value)}
              keyboardType="decimal-pad"
              editable={!(loading || mutationLoading)}
              hasError={!!errors.amount}
            />
            {errors.amount && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.amount}
              </Typography>
            )}
          </View>

          <View className="mb-6">
            <PhoneInput
              label="Phone Number"
              value={form.phoneNumber}
              onChangeText={(value: string) => setValue('phoneNumber', value)}
              placeholder="Enter Phone Number"
              disabled={loading || mutationLoading}
              error={errors.phoneNumber}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              countries={countries}
            />
          </View>

          <View className="mb-8">
            <CustomTextInput
              label="Transaction ID / Reference"
              placeholder="$23"
              value={form.transactionId}
              onChangeText={(value: string) => setValue('transactionId', value)}
              editable={!(loading || mutationLoading)}
              hasError={!!errors.transactionId}
            />
            {errors.transactionId && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.transactionId}
              </Typography>
            )}
          </View>

          <View className="pb-6">
            <ReusableButton
              text={loading || mutationLoading ? 'Processing...' : 'Continue'}
              onPress={handleSubmit}
              disabled={loading || mutationLoading}
              className="bg-red-600"
              showArrow
            />
          </View>
        </ScrollView>
      </View>
    </ContainerLayout>
  );
}
