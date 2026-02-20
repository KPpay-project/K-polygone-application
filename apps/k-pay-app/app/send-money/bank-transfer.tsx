import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Typography, ReusableButton } from '@/components/ui';
import { HeaderWithTitle } from '@/components/header';
import { useTranslation } from 'react-i18next';
import { ContainerLayout } from '@/layout/safe-area-layout';
import {
  FLW_BANKS_QUERY,
  FLW_BANK_WITHDRAWAL_QUOTE,
  RESOLVE_BANK_ACCOUNT_QUERY,
  WITHDRAW_TO_BANK,
} from '@/lib/graphql/flutterwave';
import CustomTextInput from '@/components/input/custom-text-input';
import CurrencyDropdownWithBalance from '@/components/currency/currency-dropdown-with-balance';
import { BottomSheetModal } from '@/components/ui/modal/bottom-sheet-modal';
import { DetailRow } from '@/components/actions/cross-currency-convertion-action';
import { formatCurrencyByCode } from '@/utils/numbers';
import moment from 'moment';
import { StatusScreen } from '@/components/fallbacks/status-screen';
import { useProfileStore } from '@/store/profile-store';
import Toast from 'react-native-toast-message';
import VerifyTransactionPin from '@/components/actions/verify-pin-action';

type FormData = {
  amount: string;
  bankCode: string;
  accountNumber: string;
  narration: string;
};

type FormErrors = {
  amount?: string;
  bankCode?: string;
  accountNumber?: string;
};

interface TransferQuoteData {
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
}

export default function BankTransferScreen() {
  const { t } = useTranslation();
  const { profile } = useProfileStore();

  const [form, setForm] = useState<FormData>({
    amount: '',
    bankCode: '',
    accountNumber: '',
    narration: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [userSelectedCurrency, setUserSelectedCurrency] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [transferStatus, setTransferStatus] = useState<
    'success' | 'failed' | null
  >(null);
  const [transferMessage, setTransferMessage] = useState<string>('');
  const [bankSearch, setBankSearch] = useState('');

  if (!profile?.wallets?.length) {
    return (
      <View className="flex-1 p-4 justify-center">
        <Typography variant="body" className="text-red-500 text-center">
          No wallet available
        </Typography>
      </View>
    );
  }

  const senderWalletId =
    userSelectedCurrency?.walletId || profile.wallets[0]?.id;
  const senderCurrencyCode = userSelectedCurrency?.currencyCode || 'NGN';

  const setValue = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const { data: banksData, loading: banksLoading } = useQuery(FLW_BANKS_QUERY, {
    variables: { countryCode: 'NG' },
  });

  const [resolveAccount, { data: accountData, loading: accountLoading }] =
    useLazyQuery(RESOLVE_BANK_ACCOUNT_QUERY);

  const [
    fetchQuote,
    { data: quoteData, loading: quoteLoading, error: quoteError },
  ] = useMutation(FLW_BANK_WITHDRAWAL_QUOTE, { errorPolicy: 'all' });

  const [withdrawToBank, { loading: withdrawLoading }] = useMutation(
    WITHDRAW_TO_BANK,
    {
      onCompleted: (data) => {
        if (data.withdrawToBank.success) {
          setTransferStatus('success');
          setTransferMessage(
            data.withdrawToBank.message || 'Transfer completed successfully'
          );
        } else {
          setTransferStatus('failed');
          setTransferMessage(data.withdrawToBank.message || 'Transfer failed');
        }
      },
      onError: (error) => {
        setTransferStatus('failed');
        setTransferMessage(error.message || 'An error occurred');
      },
    }
  );

  const banks = banksData?.flutterwaveBanks || [];
  const accountName = accountData?.resolveBankAccountName?.accountName || '';

  const filteredBanks = useMemo(() => {
    if (!bankSearch.trim()) return banks;
    const lower = bankSearch.toLowerCase();
    return banks.filter((b: any) => b.name.toLowerCase().includes(lower));
  }, [banks, bankSearch]);

  useEffect(() => {
    if (
      form.accountNumber &&
      form.accountNumber.length === 10 &&
      form.bankCode
    ) {
      const timer = setTimeout(() => {
        resolveAccount({
          variables: {
            accountNumber: form.accountNumber,
            bankCode: form.bankCode,
          },
        }).catch(() => undefined);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [form.accountNumber, form.bankCode, resolveAccount]);

  useEffect(() => {
    if (quoteError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: quoteError.message || 'Failed to fetch quote',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  }, [quoteError]);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!form.amount) newErrors.amount = 'Amount is required';
    if (parseFloat(form.amount) <= 0)
      newErrors.amount = 'Amount must be greater than 0';
    if (!form.bankCode) newErrors.bankCode = 'Bank is required';
    if (!form.accountNumber)
      newErrors.accountNumber = 'Account number is required';
    if (form.accountNumber.length !== 10)
      newErrors.accountNumber = 'Account number must be 10 digits';
    if (!userSelectedCurrency) newErrors.amount = 'Currency is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenPinModal = () => {
    if (!validate()) return;
    setIsModalOpen(false);
    setShowPinModal(true);
  };

  const handlePinVerified = async (pin: string) => {
    setShowPinModal(false);
    try {
      const result = await withdrawToBank({
        variables: {
          input: {
            walletId: senderWalletId,
            amount: parseFloat(form.amount),
            currencyCode: senderCurrencyCode,
            accountBank: form.bankCode,
            accountNumber: form.accountNumber,
            beneficiaryName: accountName,
            narration: form.narration || 'Bank withdrawal',
            description: 'Withdrawal to bank account',
            quoteId: normalizedQuote?.quoteId || null,
            paymentPin: pin,
          },
        },
      });

      if (result.errors && result.errors.length > 0) {
        const msg =
          result.errors[0]?.message || 'Transfer failed. Please try again.';
        setTransferStatus('failed');
        setTransferMessage(msg);
      }
    } catch (error: any) {
      const msg =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        'An unexpected error occurred.';
      setTransferStatus('failed');
      setTransferMessage(msg);
    }
  };

  const normalizedQuote: TransferQuoteData | null =
    quoteData?.flutterwaveBankWithdrawalQuote
      ? {
          amount: quoteData.flutterwaveBankWithdrawalQuote.amount,
          applies: quoteData.flutterwaveBankWithdrawalQuote.applies,
          currencyCode:
            quoteData.flutterwaveBankWithdrawalQuote.currencyCode ||
            senderCurrencyCode,
          expiresAt: quoteData.flutterwaveBankWithdrawalQuote.expiresAt || '',
          feeAmount: quoteData.flutterwaveBankWithdrawalQuote.feeAmount,
          feeCurrencyCode:
            quoteData.flutterwaveBankWithdrawalQuote.feeCurrencyCode ||
            quoteData.flutterwaveBankWithdrawalQuote.currencyCode ||
            senderCurrencyCode,
          paymentType:
            quoteData.flutterwaveBankWithdrawalQuote.paymentType || 'BANK',
          quoteId: quoteData.flutterwaveBankWithdrawalQuote.quoteId || '',
          tier: quoteData.flutterwaveBankWithdrawalQuote.tier || '',
          totalDebit: quoteData.flutterwaveBankWithdrawalQuote.totalDebit,
        }
      : null;

  const processDisabled =
    withdrawLoading ||
    quoteLoading ||
    !form.amount ||
    parseFloat(form.amount) <= 0 ||
    !form.bankCode ||
    !form.accountNumber ||
    form.accountNumber.length !== 10 ||
    !accountName ||
    !userSelectedCurrency;

  if (showPinModal) {
    return (
      <ContainerLayout>
        <VerifyTransactionPin
          onClose={() => setShowPinModal(false)}
          onSuccess={handlePinVerified}
          loading={withdrawLoading}
          title="Verify Transaction"
          description="Enter your 4-digit PIN to authorize this transfer"
        />
      </ContainerLayout>
    );
  }

  if (transferStatus) {
    return (
      <ContainerLayout>
        <StatusScreen
          status={transferStatus}
          title={
            transferStatus === 'success'
              ? 'Transfer Successful!'
              : 'Transfer Failed'
          }
          message={transferMessage}
          buttonText="Back to Dashboard"
          onPress={() => {
            setTransferStatus(null);
            setTransferMessage('');
          }}
        />
      </ContainerLayout>
    );
  }

  return (
    <ContainerLayout>
      
      <View className="flex-1 bg-white">
        <ScrollView className="px-6 pt-6" showsVerticalScrollIndicator={false}>
          <HeaderWithTitle
            title={t('sendMoneyToBankAccount')}
            description={t('sendToNewOrPreviousRecipient')}
          />

          <View className="mb-6">
            <Typography
              variant="body"
              className="text-gray-900 font-medium mb-2"
            >
              Select Bank
            </Typography>
            <CustomTextInput
              placeholder="Search bank..."
              value={bankSearch}
              onChangeText={setBankSearch}
              editable={!withdrawLoading}
            />
            <View className="mt-2 border border-gray-300 rounded-lg max-h-40">
              <ScrollView>
                {filteredBanks.map((bank: any) => (
                  <TouchableOpacity
                    key={bank.code}
                    className={`p-3 border-b border-gray-200 ${
                      form.bankCode === bank.code ? 'bg-blue-50' : ''
                    }`}
                    onPress={() => setValue('bankCode', bank.code)}
                  >
                    <Typography
                      variant="body"
                      className={
                        form.bankCode === bank.code
                          ? 'text-blue-600 font-semibold'
                          : ''
                      }
                    >
                      {bank.name}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {errors.bankCode && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.bankCode}
              </Typography>
            )}
          </View>

          <View className="mb-6">
            <CustomTextInput
              label="Account Number"
              placeholder="Enter account number"
              value={form.accountNumber}
              onChangeText={(value) => setValue('accountNumber', value)}
              keyboardType="numeric"
              maxLength={10}
              editable={!withdrawLoading}
              hasError={!!errors.accountNumber}
            />
            {errors.accountNumber && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.accountNumber}
              </Typography>
            )}
            <View className="mt-2" style={{ minHeight: 24 }}>
              {accountLoading && (
                <Typography variant="caption" className="text-gray-500">
                  Resolving account...
                </Typography>
              )}
              {!accountLoading && accountName && (
                <Typography
                  variant="body"
                  className="text-green-700 font-semibold"
                >
                  {accountName}
                </Typography>
              )}
              {!accountLoading &&
                form.accountNumber.length === 10 &&
                form.bankCode &&
                !accountName && (
                  <Typography
                    variant="caption"
                    className="text-red-500 font-semibold"
                  >
                    Account not found
                  </Typography>
                )}
            </View>
          </View>

          <View className="mb-6">
            <CustomTextInput
              label="Amount"
              placeholder="Enter amount"
              value={form.amount}
              onChangeText={(value) => setValue('amount', value)}
              keyboardType="decimal-pad"
              editable={!withdrawLoading}
              hasError={!!errors.amount}
            />
            {errors.amount && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.amount}
              </Typography>
            )}
          </View>

          <CurrencyDropdownWithBalance
            onCurrencySelect={(currency) => setUserSelectedCurrency(currency)}
          />

          <View className="mb-8">
            <CustomTextInput
              label="Narration (Optional)"
              placeholder="Enter narration"
              value={form.narration}
              onChangeText={(value) => setValue('narration', value)}
              editable={!withdrawLoading}
            />
          </View>

          <View className="pb-6">
            <ReusableButton
              text="Proceed"
              onPress={async () => {
                if (!validate()) return;
                if (!accountName) {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Please verify account first',
                    visibilityTime: 3000,
                    autoHide: true,
                  });
                  return;
                }
                try {
                  await fetchQuote({
                    variables: {
                      input: {
                        amount: parseFloat(form.amount),
                        currencyCode: senderCurrencyCode,
                        walletId: senderWalletId,
                      },
                    },
                  });
                } catch (e) {
                  // Quote fetch failed, continue to show modal
                }
                setIsModalOpen(true);
              }}
              disabled={processDisabled}
            />
          </View>
        </ScrollView>

        <Toast />
      </View>

      <BottomSheetModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <View className="mb-6">
          <Typography
            variant="h3"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            Confirm Transfer
          </Typography>

          <View className="bg-gray-50 p-4 rounded-lg mb-6">
            <DetailRow
              label="Amount"
              value={formatCurrencyByCode(form.amount, senderCurrencyCode)}
            />

            <DetailRow
              label="Fee"
              value={
                quoteLoading
                  ? 'Loading...'
                  : normalizedQuote
                    ? `${normalizedQuote.feeAmount} ${normalizedQuote.feeCurrencyCode}`
                    : '—'
              }
            />

            <DetailRow label="Bank Account" value={form.accountNumber} />

            <DetailRow label="Account Name" value={accountName} />

            {normalizedQuote && (
              <DetailRow
                label="Expires at"
                value={moment(normalizedQuote.expiresAt).endOf('day').fromNow()}
              />
            )}

            <DetailRow
              label="Total"
              value={
                quoteLoading
                  ? 'Loading...'
                  : normalizedQuote
                    ? formatCurrencyByCode(
                        normalizedQuote.totalDebit,
                        normalizedQuote.currencyCode
                      )
                    : formatCurrencyByCode(form.amount, senderCurrencyCode)
              }
              emphasis={true}
            />
          </View>

          <ReusableButton
            text={withdrawLoading ? 'Processing...' : 'Confirm and Send'}
            onPress={handleOpenPinModal}
            disabled={withdrawLoading}
          />
        </View>
      </BottomSheetModal>
    </ContainerLayout>
  );
}
