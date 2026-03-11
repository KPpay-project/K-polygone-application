import { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { useLazyQuery } from '@apollo/client';
import {
  Typography,
  ReusableButton,
  PhoneInput,
  ReusableModal,
} from '@/components/ui';
import { ContainerLayout } from '@/layout/safe-area-layout';
import CustomTextInput from '@/components/input/custom-text-input';
import { countries, Country } from '@/data/countries';
import { HeaderWithTitle } from '@/components';
import { useDeposit, useMe } from '@/hooks/api';
import { useProfileStore } from '@/store/profile-store';
import { DepositViaMnoScreenProps, FormErrors } from './types';
import { useWalletAbstractor } from '@/hooks/use-wallet';
import { getGraphQLErrorMessage } from '@/utils/error-handling';
import CurrencyDropdownWithBalance from '@/components/currency/currency-dropdown-with-balance';
import { GET_MTN_MOMO_BASIC_USER_INFO } from '@/lib/graphql/mutations/deposit';
import { SupportedProviders } from '@/types/graphql';

interface DepositFormData {
  amount: string;
  phoneNumber: string;
}

type MtnMomoBasicUserInfo = {
  givenName: string | null;
  familyName: string | null;
};

export default function DepositViaMnoScreen({
  title,
  provider,
}: DepositViaMnoScreenProps) {
  const { fetchProfile } = useProfileStore();
  const [depositMutation, { loading: mutationLoading }] = useDeposit();
  const [form, setForm] = useState<DepositFormData>({
    amount: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { refetch: refetchMe } = useMe();

  const { walletData, walletId, hasWallet } = useWalletAbstractor();

  const currency_code = walletData?.currency?.code;

  const [selectedCurrency, setSelectedCurrency] = useState<{
    availableBalance: string;
    currencyCode: string;
    currencyId: string;
    walletId: string;
  } | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error'>(
    'success'
  );
  const [resultMessage, setResultMessage] = useState('');
  const [resultReference, setResultReference] = useState('');

  const [momoUserInfo, setMomoUserInfo] = useState<MtnMomoBasicUserInfo | null>(
    null
  );
  const [momoLookupError, setMomoLookupError] = useState('');

  const setValue = (field: keyof DepositFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((country) => country.code === 'US') || countries[0]
  );

  const [getMtnMomoBasicUserInfo, { loading: verifyingMomo }] = useLazyQuery<{
    mtnMomoBasicUserInfo: {
      found: boolean;
      basicUserInfo: {
        givenName: string | null;
        familyName: string | null;
      } | null;
    };
  }>(GET_MTN_MOMO_BASIC_USER_INFO, { fetchPolicy: 'no-cache' });

  const normalizedPhone = useMemo(
    () => form.phoneNumber.replace(/\D/g, ''),
    [form.phoneNumber]
  );
  const isPhoneComplete =
    normalizedPhone.length >= 10 && normalizedPhone.length <= 15;
  const momoDisplayName = useMemo(() => {
    if (!momoUserInfo) return form.phoneNumber;
    return (
      `${momoUserInfo.givenName || ''} ${momoUserInfo.familyName || ''}`.trim() ||
      form.phoneNumber
    );
  }, [form.phoneNumber, momoUserInfo]);

  const formattedAmount = useMemo(() => {
    const amountNumber = parseFloat(String(form.amount).replace(/[^\d.]/g, ''));
    const currency = selectedCurrency?.currencyCode || currency_code || '';
    if (!currency || isNaN(amountNumber) || amountNumber <= 0) return '';
    return `${currency} ${amountNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [form.amount, selectedCurrency?.currencyCode, currency_code]);

  useEffect(() => {
    if (provider !== SupportedProviders.MTN_MOMO) {
      setMomoUserInfo(null);
      setMomoLookupError('');
      return;
    }

    if (!isPhoneComplete) {
      setMomoUserInfo(null);
      setMomoLookupError('');
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const verification = await getMtnMomoBasicUserInfo({
          variables: {
            phoneNumber: normalizedPhone,
            service: 'COLLECTION',
          },
        });

        const verifiedUser = verification.data?.mtnMomoBasicUserInfo;
        if (!verifiedUser?.found) {
          setMomoUserInfo(null);
          setMomoLookupError('MTN MoMo user not found for this phone number');
          return;
        }

        setMomoLookupError('');
        setMomoUserInfo({
          givenName: verifiedUser.basicUserInfo?.givenName ?? null,
          familyName: verifiedUser.basicUserInfo?.familyName ?? null,
        });
      } catch {
        setMomoUserInfo(null);
        setMomoLookupError('Unable to verify MTN MoMo user');
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [provider, isPhoneComplete, normalizedPhone, getMtnMomoBasicUserInfo]);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.amount) newErrors.amount = 'Amount is required';
    if (!form.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const processDeposit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      if (!hasWallet || !walletId) {
        setResultStatus('error');
        setResultMessage('No wallet found');
        setResultReference('');
        setResultOpen(true);
        setLoading(false);
        return;
      }
      const amount = parseFloat(String(form.amount).replace(/[^\d.]/g, ''));

      if (isNaN(amount) || amount <= 0) {
        setResultStatus('error');
        setResultMessage('Invalid amount');
        setResultReference('');
        setResultOpen(true);
        setLoading(false);
        return;
      }

      if (!isPhoneComplete) {
        setResultStatus('error');
        setResultMessage('Please enter a complete phone number');
        setResultReference('');
        setResultOpen(true);
        setLoading(false);
        return;
      }

      if (provider === SupportedProviders.MTN_MOMO && !momoUserInfo) {
        setResultStatus('error');
        setResultMessage(
          momoLookupError || 'Please enter a valid MTN MoMo number'
        );
        setResultReference('');
        setResultOpen(true);
        setLoading(false);
        return;
      }

      const finalWalletId = selectedCurrency?.walletId || walletId;
      const finalCurrencyCode =
        selectedCurrency?.currencyCode || currency_code || 'USD';

      const payload = {
        amount: amount,
        country: selectedCountry.code,
        currencyCode: finalCurrencyCode,
        customerPhone: form.phoneNumber,
        description: `Deposit via ${provider} - Phone: ${form.phoneNumber}`,
        provider: provider,
        walletId: finalWalletId,
      };

      const response = await depositMutation({ variables: { input: payload } });

      if (response?.data?.deposit?.success) {
        refetchMe();
        setConfirmOpen(false);
        setResultStatus('success');
        setResultMessage(
          response?.data?.deposit?.message || 'Deposit successful'
        );
        setResultReference(
          response?.data?.deposit?.transaction?.reference || ''
        );
        setResultOpen(true);
        setForm({ amount: '', phoneNumber: '' });
        await fetchProfile();
      } else {
        const errorMsg = getGraphQLErrorMessage(
          response,
          response?.data?.deposit?.message || 'Deposit failed'
        );
        setConfirmOpen(false);
        setResultStatus('error');
        setResultMessage(errorMsg);
        setResultReference('');
        setResultOpen(true);
      }
    } catch (error: any) {
      const errorMsg = getGraphQLErrorMessage(error, 'Deposit request failed');
      setConfirmOpen(false);
      setResultStatus('error');
      setResultMessage(errorMsg);
      setResultReference('');
      setResultOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!validate()) return;

    const amount = parseFloat(String(form.amount).replace(/[^\d.]/g, ''));
    if (isNaN(amount) || amount <= 0) {
      setErrors((prev) => ({ ...prev, amount: 'Please enter a valid amount' }));
      return;
    }

    if (!isPhoneComplete) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: 'Please enter a complete phone number',
      }));
      return;
    }

    if (provider === SupportedProviders.MTN_MOMO && !momoUserInfo) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: momoLookupError || 'Please enter a valid MTN MoMo number',
      }));
      return;
    }

    setConfirmOpen(true);
  };

  return (
    <ContainerLayout>
      <View className="flex-1 bg-white">
        {(loading || mutationLoading || verifyingMomo) && (
          <View className="absolute inset-0 bg-black/20 z-50 flex items-center justify-center">
            <View className="bg-white p-6 rounded-lg flex items-center">
              <ActivityIndicator size="large" color="#dc2626" />
              <Typography className="mt-3 text-gray-700">
                {loading || mutationLoading
                  ? 'Processing your deposit...'
                  : 'Verifying mobile money account...'}
              </Typography>
            </View>
          </View>
        )}
        <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          <HeaderWithTitle
            title={title}
            description="Add money to your wallet"
          />

          <CurrencyDropdownWithBalance
            onCurrencySelect={(data) => {
              setSelectedCurrency(data);
            }}
          />

          <View className="mb-6">
            <CustomTextInput
              label="Amount"
              placeholder="0.00"
              value={form.amount}
              onChangeText={(value: string) => setValue('amount', value)}
              keyboardType="decimal-pad"
              editable={!(loading || mutationLoading || verifyingMomo)}
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
              disabled={loading || mutationLoading || verifyingMomo}
              error={errors.phoneNumber}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              countries={countries}
            />
          </View>

          {provider === SupportedProviders.MTN_MOMO && momoUserInfo ? (
            <View className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <Typography variant="caption" className="text-gray-500 mb-1">
                Verified MTN MoMo User
              </Typography>
              <Typography className="text-gray-900">
                {momoDisplayName}
              </Typography>
            </View>
          ) : null}

          {provider === SupportedProviders.MTN_MOMO &&
          !momoUserInfo &&
          momoLookupError &&
          isPhoneComplete ? (
            <View className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
              <Typography variant="caption" className="text-red-600">
                {momoLookupError}
              </Typography>
            </View>
          ) : null}

          <View className="pb-6">
            <ReusableButton
              text={loading || mutationLoading ? 'Processing...' : 'Continue'}
              onPress={handleContinue}
              disabled={loading || mutationLoading || verifyingMomo}
              className="bg-red-600"
              showArrow
            />
          </View>
        </ScrollView>

        <ReusableModal
          visible={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          variant="bottom"
          animationType="slide"
          showCloseButton={false}
        >
          <View className="gap-4">
            <View className="items-center">
              <Typography
                variant="h4"
                weight="semiBold"
                className="text-gray-900"
              >
                Confirm Deposit
              </Typography>
              <Typography
                variant="caption"
                className="text-gray-500 mt-1 text-center"
              >
                You are about to deposit {formattedAmount || '-'} from{' '}
                {momoDisplayName || '-'}.
              </Typography>
            </View>

            <View className="rounded-2xl border border-gray-200 bg-gray-50 p-4 gap-3">
              <View className="flex-row justify-between items-center">
                <Typography variant="caption" className="text-gray-500">
                  Provider
                </Typography>
                <Typography className="text-gray-900">
                  {String(provider)}
                </Typography>
              </View>
              <View className="flex-row justify-between items-center">
                <Typography variant="caption" className="text-gray-500">
                  Phone
                </Typography>
                <Typography className="text-gray-900">
                  {form.phoneNumber || '-'}
                </Typography>
              </View>
              <View className="flex-row justify-between items-center">
                <Typography variant="caption" className="text-gray-500">
                  Amount
                </Typography>
                <Typography className="text-gray-900">
                  {formattedAmount || '-'}
                </Typography>
              </View>
            </View>

            <View className="gap-3">
              <ReusableButton
                variant="primary"
                text={loading || mutationLoading ? 'Processing...' : 'Continue'}
                onPress={processDeposit}
                loading={loading || mutationLoading}
                disabled={loading || mutationLoading}
                className="bg-red-600"
              />
              <ReusableButton
                variant="outline"
                text="Cancel"
                onPress={() => setConfirmOpen(false)}
                disabled={loading || mutationLoading}
                textColor="#111827"
              />
            </View>
          </View>
        </ReusableModal>

        <ReusableModal
          visible={resultOpen}
          onClose={() => setResultOpen(false)}
          variant="center"
          animationType="fade"
          showCloseButton={false}
        >
          <View className="items-center">
            <View
              className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${resultStatus === 'success' ? 'bg-green-100' : 'bg-red-100'}`}
            >
              <Typography
                variant="h2"
                className={
                  resultStatus === 'success' ? 'text-green-600' : 'text-red-600'
                }
              >
                {resultStatus === 'success' ? '✓' : '×'}
              </Typography>
            </View>
            <Typography
              variant="h4"
              weight="semiBold"
              className="text-gray-900 mb-2 text-center"
            >
              {resultStatus === 'success'
                ? 'Deposit Successful'
                : 'Deposit Failed'}
            </Typography>
            <Typography
              variant="body"
              className="text-gray-500 text-center mb-4"
            >
              {resultMessage ||
                (resultStatus === 'success'
                  ? 'Deposit successful'
                  : 'Deposit failed')}
            </Typography>
            {resultStatus === 'success' && resultReference ? (
              <View className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 mb-4">
                <Typography variant="caption" className="text-gray-500 mb-1">
                  Reference
                </Typography>
                <Typography className="text-gray-900">
                  {resultReference}
                </Typography>
              </View>
            ) : null}
            <ReusableButton
              text="Done"
              onPress={() => setResultOpen(false)}
              className="bg-red-600"
            />
          </View>
        </ReusableModal>
      </View>
    </ContainerLayout>
  );
}
