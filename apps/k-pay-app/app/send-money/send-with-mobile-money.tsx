import { useState, useEffect, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQuery } from '@apollo/client';
import {
  Typography,
  ReusableButton,
  ReusableModal,
  MoneyInput,
  PhoneInput,
} from '@/components/ui';
import { ScreenContainer } from '@/layout/safe-area-layout';
import Toast from 'react-native-toast-message';
import { TRANSFER_PROVIDERS_ARRAY } from '@/constants';
import { SupportedProviders } from '@/types/graphql';
import { HeaderWithTitle } from '@/components';
import { useWalletAbstractor } from '@/hooks/use-wallet';
import { countries, type Country } from '@/data/countries';
import { useLocalSearchParams } from 'expo-router';
import CurrencyDropdownWithBalance from '@/components/currency/currency-dropdown-with-balance';
import VerifyTransactionPin from '@/components/actions/verify-pin-action';
import {
  MOBILE_MONEY_WITHRAWAL_QOUTE,
  WITHDRAW_TO_MOBILE_MONEY,
} from '@/lib/graphql/mutations/withdraw';
import { GET_MY_CURRENCIES_QUERY } from '@/lib/graphql/queries';
import { FETCH_BENEFICIARIES_QUERY } from '@/lib/graphql/queries/beneficiary';
import { CREATE_BENEFICIARY_MUTATION } from '@/lib/graphql/mutations/beneficiary';

type FormData = {
  amount: string;
  currencyCode: string;
  provider: SupportedProviders;
  receiverPhone: string;
  walletId: string;
};

type FormErrors = {
  amount?: string;
  currencyCode?: string;
  provider?: string;
  receiverPhone?: string;
  walletId?: string;
};

type MobileMoneyQuote = {
  amount: string;
  applies: boolean;
  currencyCode: string;
  expiresAt: string;
  feeAmount: string;
  feeCurrencyCode: string;
  paymentType: string;
  quoteId: string;
  tier: string;
  totalDebit: string;
};

type QuoteResult = {
  mobileMoneyWithdrawalQuote: MobileMoneyQuote | null;
};

type WithdrawToMobileMoneyResult = {
  withdrawToMobileMoney: {
    success: boolean;
    message?: string | null;
    flutterwaveTransferId?: string | null;
    reference?: string | null;
    status?: string | null;
  } | null;
};

type BeneficiaryEntry = {
  id: string;
  name: string;
  number: string;
  currencyId?: string | null;
  providerName?: string | null;
};

type BeneficiariesResult = {
  myBeneficiaries: {
    entries: BeneficiaryEntry[];
    totalEntries: number;
  };
};

type MyCurrenciesResult = {
  me: {
    wallets: Array<{
      id: string;
      currency: { id: string; code: string; countryCode?: string | null };
      balances: Array<{ availableBalance: string }>;
    }>;
  };
};

function TransferForm() {
  const { provider: urlProvider } = useLocalSearchParams<{
    provider?: string;
  }>();
  const { walletId, currency } = useWalletAbstractor();

  const [form, setForm] = useState<FormData>({
    amount: '',
    currencyCode: currency?.code || 'USD',
    provider:
      (urlProvider as SupportedProviders) || SupportedProviders.MTN_MOMO,
    receiverPhone: '',
    walletId: walletId || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<{
    availableBalance: string;
    currencyCode: string;
    currencyId: string;
    walletId: string;
  } | null>(null);

  const [quoteOpen, setQuoteOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error'>(
    'success'
  );
  const [resultMessage, setResultMessage] = useState('');
  const [currentQuote, setCurrentQuote] = useState<MobileMoneyQuote | null>(
    null
  );
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const [lastTransferPhone, setLastTransferPhone] = useState('');

  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === 'BJ') || countries[0]
  );

  const [beneficiaryOpen, setBeneficiaryOpen] = useState(false);
  const [beneficiarySearch, setBeneficiarySearch] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<BeneficiaryEntry | null>(null);

  const { data: currenciesData } = useQuery<MyCurrenciesResult>(
    GET_MY_CURRENCIES_QUERY,
    { errorPolicy: 'all', fetchPolicy: 'cache-first' }
  );

  const { data: beneficiariesData, loading: beneficiariesLoading } =
    useQuery<BeneficiariesResult>(FETCH_BENEFICIARIES_QUERY, {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    });

  const [getMobileMoneyQuote, { loading: quoting }] = useMutation<QuoteResult>(
    MOBILE_MONEY_WITHRAWAL_QOUTE,
    { errorPolicy: 'all' }
  );

  const [withdrawToMobileMoney, { loading: withdrawing }] =
    useMutation<WithdrawToMobileMoneyResult>(WITHDRAW_TO_MOBILE_MONEY, {
      errorPolicy: 'all',
    });

  const [createBeneficiary, { loading: creatingBeneficiary }] = useMutation(
    CREATE_BENEFICIARY_MUTATION,
    {
      errorPolicy: 'all',
      refetchQueries: [{ query: FETCH_BENEFICIARIES_QUERY }],
      awaitRefetchQueries: true,
    }
  );

  const isBusy = quoting || withdrawing;

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
      }));
    }
  }, [urlProvider]);

  const selectedProvider = TRANSFER_PROVIDERS_ARRAY.find(
    (p) => p.key === form.provider
  );

  const currencyById = useMemo(() => {
    const map = new Map<
      string,
      {
        availableBalance: string;
        currencyCode: string;
        currencyId: string;
        walletId: string;
      }
    >();
    const wallets = currenciesData?.me?.wallets || [];
    for (const wallet of wallets) {
      const currencyId = wallet?.currency?.id;
      const currencyCode = wallet?.currency?.code;
      if (!currencyId || !currencyCode || map.has(currencyId)) continue;
      map.set(currencyId, {
        availableBalance: wallet?.balances?.[0]?.availableBalance || '0',
        currencyCode,
        currencyId,
        walletId: wallet.id,
      });
    }
    return map;
  }, [currenciesData]);

  useEffect(() => {
    if (selectedCurrency) return;
    const wallets = currenciesData?.me?.wallets || [];
    const primary = wallets[0];
    if (!primary?.id || !primary?.currency?.code) return;
    const value = {
      availableBalance: primary?.balances?.[0]?.availableBalance || '0',
      currencyCode: primary.currency.code,
      currencyId: primary.currency.id || '',
      walletId: primary.id,
    };
    setSelectedCurrency(value);
    setForm((prev) => ({
      ...prev,
      walletId: value.walletId,
      currencyCode: value.currencyCode,
    }));
  }, [currenciesData, selectedCurrency]);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.walletId) newErrors.walletId = 'Wallet is required';
    if (!form.currencyCode) newErrors.currencyCode = 'Currency is required';
    if (!form.amount || parseFloat(form.amount) <= 0)
      newErrors.amount = 'Valid amount is required';
    if (!form.receiverPhone)
      newErrors.receiverPhone = 'Phone number is required';
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

    const amountNum = parseFloat(String(form.amount).replace(/,/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Invalid amount',
        text2: 'Please enter a valid amount.',
      });
      return;
    }

    (async () => {
      try {
        const wallet = selectedCurrency?.walletId || form.walletId;
        const currencyCode =
          selectedCurrency?.currencyCode || form.currencyCode;

        const resp = await getMobileMoneyQuote({
          variables: {
            input: {
              amount: amountNum,
              countryCode: selectedCountry.code.toUpperCase(),
              currencyCode,
              network: form.provider,
              walletId: wallet,
            },
          },
        });

        const quote = resp.data?.mobileMoneyWithdrawalQuote;
        const msg =
          resp.errors?.[0]?.message ||
          (!quote?.quoteId ? 'Something went wrong. Please try again.' : '');

        if (msg || !quote?.quoteId) {
          setResultStatus('error');
          setResultMessage(msg || 'Something went wrong. Please try again.');
          setResultOpen(true);
          return;
        }

        setPendingData({
          ...form,
          walletId: wallet,
          currencyCode,
        });
        setCurrentQuote(quote);
        setQuoteOpen(true);
      } catch (error: any) {
        const msg =
          error?.graphQLErrors?.[0]?.message ||
          error?.message ||
          'Something went wrong. Please try again.';
        setResultStatus('error');
        setResultMessage(msg);
        setResultOpen(true);
      }
    })();
  };

  const handlePinVerified = async (pin: string) => {
    setShowPinModal(false);

    try {
      if (!pendingData || !currentQuote?.quoteId) {
        setResultStatus('error');
        setResultMessage('Something went wrong. Please try again.');
        setResultOpen(true);
        return;
      }

      const amountNum = parseFloat(
        String(pendingData.amount).replace(/,/g, '')
      );
      if (isNaN(amountNum) || amountNum <= 0) {
        setResultStatus('error');
        setResultMessage('Invalid amount');
        setResultOpen(true);
        return;
      }

      const resp = await withdrawToMobileMoney({
        variables: {
          input: {
            amount: amountNum,
            countryCode: selectedCountry.code.toUpperCase(),
            currencyCode: pendingData.currencyCode,
            description: 'Mobile Money Transfer',
            network: pendingData.provider,
            paymentPin: pin,
            phoneNumber: pendingData.receiverPhone,
            quoteId: currentQuote.quoteId,
            walletId: pendingData.walletId,
          },
        },
      });

      const msg =
        resp.errors?.[0]?.message ||
        (resp.data?.withdrawToMobileMoney?.success
          ? ''
          : resp.data?.withdrawToMobileMoney?.message) ||
        '';

      if (msg && !resp.data?.withdrawToMobileMoney?.success) {
        setResultStatus('error');
        setResultMessage(msg || 'Transfer failed. Please try again.');
        setResultOpen(true);
        return;
      }

      if (resp.data?.withdrawToMobileMoney?.success) {
        setResultStatus('success');
        setResultMessage(
          resp.data?.withdrawToMobileMoney?.message || 'Transfer successful'
        );
        setResultOpen(true);
        setLastTransferPhone(pendingData.receiverPhone);
        setForm((prev) => ({
          ...prev,
          amount: '',
          receiverPhone: '',
        }));
        setSelectedBeneficiary(null);
      } else {
        setResultStatus('error');
        setResultMessage(
          resp.data?.withdrawToMobileMoney?.message ||
            'Transfer failed. Please try again.'
        );
        setResultOpen(true);
      }
    } catch (error: any) {
      const msg =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        'An unexpected error occurred. Please try again.';
      setResultStatus('error');
      setResultMessage(msg);
      setResultOpen(true);
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    }
  };

  if (showPinModal) {
    return (
      <ScreenContainer useSafeArea={true}>
        <VerifyTransactionPin
          onClose={() => setShowPinModal(false)}
          onSuccess={handlePinVerified}
          loading={withdrawing}
          title="Verify Transaction"
          description="Enter your 4-digit PIN to authorize this transfer"
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
          value={selectedCurrency}
          onCurrencySelect={(currency) => {
            setSelectedCurrency(currency);
            setForm((prev) => ({
              ...prev,
              walletId: currency.walletId,
              currencyCode: currency.currencyCode,
            }));
          }}
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

        <View className="mb-4">
          <MoneyInput
            label="Amount"
            value={
              form.amount ? parseFloat(String(form.amount).replace(/,/g, '')) : 0
            }
            onChange={(v) => handleChange('amount', v.toLocaleString('en-US'))}
            currency={(form.currencyCode as any) || 'USD'}
            error={errors.amount}
            className="mb-0"
          />
          {errors.amount && (
            <Typography className="text-red-500 text-xs mt-1">
              {errors.amount}
            </Typography>
          )}
        </View>

        <View className="mb-4">
          <PhoneInput
            label="Receiver Phone Number"
            value={form.receiverPhone}
            onChangeText={(phone: string) => handleChange('receiverPhone', phone)}
            placeholder="Enter phone number"
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            countries={countries}
            error={errors.receiverPhone}
          />
          {errors.receiverPhone && (
            <Typography className="text-red-500 text-xs mt-1">
              {errors.receiverPhone}
            </Typography>
          )}
        </View>

        <View className="mb-6">
          <TouchableOpacity
            onPress={() => setBeneficiaryOpen(true)}
            activeOpacity={0.8}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
          >
            <Typography variant="caption" className="text-gray-500 mb-1">
              Beneficiary
            </Typography>
            <Typography className="text-gray-900">
              {selectedBeneficiary
                ? `${selectedBeneficiary.name} • ${selectedBeneficiary.number}`
                : 'Select beneficiary (optional)'}
            </Typography>
          </TouchableOpacity>
        </View>

        <ReusableButton
          text={isBusy ? 'Processing...' : 'Send Money'}
          onPress={handleContinue}
          disabled={isBusy}
          className="w-full"
        />
      </View>

      <ReusableModal
        visible={beneficiaryOpen}
        onClose={() => {
          setBeneficiaryOpen(false);
          setBeneficiarySearch('');
        }}
        variant="bottom"
        animationType="slide"
        showCloseButton={false}
      >
        <View className="gap-4">
          <View className="items-center">
            <Typography variant="h4" weight="semiBold" className="text-gray-900">
              Select Beneficiary
            </Typography>
            <Typography variant="caption" className="text-gray-500 mt-1 text-center">
              Choose from your saved mobile money beneficiaries.
            </Typography>
          </View>

          <TextInput
            value={beneficiarySearch}
            onChangeText={setBeneficiarySearch}
            placeholder="Search by name or number"
            placeholderTextColor="#9CA3AF"
            className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50"
          />

          <ScrollView showsVerticalScrollIndicator={false} className="max-h-[260px]">
            {beneficiariesLoading ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="small" color="#dc2626" />
              </View>
            ) : (
              (beneficiariesData?.myBeneficiaries?.entries || [])
                .filter((b) => {
                  const q = beneficiarySearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    b.name.toLowerCase().includes(q) ||
                    b.number.toLowerCase().includes(q)
                  );
                })
                .map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedBeneficiary(b);
                      handleChange('receiverPhone', b.number);
                      if (b.currencyId) {
                        const opt = currencyById.get(b.currencyId);
                        if (opt) {
                          setSelectedCurrency(opt);
                          setForm((prev) => ({
                            ...prev,
                            walletId: opt.walletId,
                            currencyCode: opt.currencyCode,
                          }));
                        }
                      }
                      setBeneficiaryOpen(false);
                      setBeneficiarySearch('');
                    }}
                    className="py-4 border-b border-gray-100"
                  >
                    <Typography className="text-gray-900" weight="semiBold">
                      {b.name}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500 mt-1">
                      {b.number}
                    </Typography>
                  </TouchableOpacity>
                ))
            )}
          </ScrollView>

          <ReusableButton
            variant="outline"
            text="Close"
            onPress={() => {
              setBeneficiaryOpen(false);
              setBeneficiarySearch('');
            }}
            textColor="#111827"
          />
        </View>
      </ReusableModal>

      <ReusableModal
        visible={quoteOpen}
        onClose={() => {
          setQuoteOpen(false);
          setCurrentQuote(null);
          setPendingData(null);
        }}
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
              Withdrawal Quote
            </Typography>
            <Typography
              variant="caption"
              className="text-gray-500 mt-1 text-center"
            >
              Review the fees before continuing.
            </Typography>
          </View>

          <View className="rounded-2xl border border-gray-200 bg-gray-50 p-4 gap-3">
            <View className="flex-row justify-between items-center">
              <Typography variant="caption" className="text-gray-500">
                Amount
              </Typography>
              <Typography className="text-gray-900">
                {currentQuote?.amount} {currentQuote?.currencyCode}
              </Typography>
            </View>
            <View className="flex-row justify-between items-center">
              <Typography variant="caption" className="text-gray-500">
                Fee
              </Typography>
              <Typography className="text-gray-900">
                {currentQuote?.feeAmount} {currentQuote?.feeCurrencyCode}
              </Typography>
            </View>
            <View className="flex-row justify-between items-center">
              <Typography variant="caption" className="text-gray-500">
                Total Debit
              </Typography>
              <Typography className="text-gray-900">
                {currentQuote?.totalDebit} {currentQuote?.currencyCode}
              </Typography>
            </View>
            <View className="flex-row justify-between items-center">
              <Typography variant="caption" className="text-gray-500">
                Network
              </Typography>
              <Typography className="text-gray-900">
                {currentQuote?.paymentType}
              </Typography>
            </View>
            <View className="flex-row justify-between items-center">
              <Typography variant="caption" className="text-gray-500">
                Tier
              </Typography>
              <Typography className="text-gray-900">
                {currentQuote?.tier}
              </Typography>
            </View>
            <View className="flex-row justify-between items-center">
              <Typography variant="caption" className="text-gray-500">
                Applies
              </Typography>
              <Typography className="text-gray-900">
                {currentQuote?.applies ? 'Yes' : 'No'}
              </Typography>
            </View>
            <View className="flex-row justify-between items-center">
              <Typography variant="caption" className="text-gray-500">
                Expires
              </Typography>
              <Typography className="text-gray-900">
                {currentQuote?.expiresAt}
              </Typography>
            </View>
          </View>

          <View className="gap-3">
            <ReusableButton
              text={quoting ? 'Processing...' : 'Continue'}
              onPress={() => {
                setQuoteOpen(false);
                setShowPinModal(true);
              }}
              disabled={quoting}
              className="bg-red-600"
            />
            <ReusableButton
              variant="outline"
              text="Cancel"
              onPress={() => {
                setQuoteOpen(false);
                setCurrentQuote(null);
                setPendingData(null);
              }}
              textColor="#111827"
            />
          </View>
        </View>
      </ReusableModal>

      <ReusableModal
        visible={resultOpen}
        onClose={() => {
          setResultOpen(false);
          setResultMessage('');
          setResultStatus('success');
          setCurrentQuote(null);
          setPendingData(null);
          setLastTransferPhone('');
        }}
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
              ? 'Transfer Successful'
              : 'Transfer Failed'}
          </Typography>
          <Typography variant="body" className="text-gray-500 text-center mb-4">
            {resultMessage}
          </Typography>
          {resultStatus === 'success' ? (
            <ReusableButton
              variant="outline"
              text={creatingBeneficiary ? 'Adding...' : 'Add Beneficiary'}
              onPress={async () => {
                const phone = String(lastTransferPhone || '').trim();
                if (!phone) {
                  Toast.show({
                    type: 'error',
                    text1: 'No phone number',
                    text2: 'Enter a phone number first.',
                  });
                  return;
                }

                try {
                  const res = await createBeneficiary({
                    variables: {
                      name: phone,
                      number: phone,
                      type: 'MOBILE_MONEY',
                      providerName: form.provider,
                      currencyId: selectedCurrency?.currencyId || null,
                    },
                  });

                  const ok = res.data?.createBeneficiary?.success;
                  const msg =
                    res.errors?.[0]?.message ||
                    res.data?.createBeneficiary?.message ||
                    (ok ? 'Beneficiary added' : 'Failed to add beneficiary');

                  Toast.show({
                    type: ok ? 'success' : 'error',
                    text1: ok ? 'Saved' : 'Failed',
                    text2: msg,
                  });
                } catch (e: any) {
                  Toast.show({
                    type: 'error',
                    text1: 'Failed',
                    text2:
                      e?.graphQLErrors?.[0]?.message ||
                      e?.message ||
                      'Failed to add beneficiary',
                  });
                }
              }}
              disabled={creatingBeneficiary}
              textColor="#111827"
            />
          ) : null}
          <ReusableButton
            text="Done"
            onPress={() => {
              setResultOpen(false);
              setResultMessage('');
              setCurrentQuote(null);
              setPendingData(null);
              setLastTransferPhone('');
            }}
            className="bg-red-600"
          />
        </View>
      </ReusableModal>
      <Toast />
    </ScreenContainer>
  );
}

export default TransferForm;
