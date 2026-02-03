import { useState, useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import {
  WALLET_TO_WALLET_TRANSFER,
  WalletToWalletInput,
  GET_USER_WALLET_CODE,
} from '@/lib/graphql/mutations/transfer';
import { View, ScrollView } from 'react-native';
import { useProfileStore } from '@/store/profile-store';
import { Typography, ReusableButton } from '@/components/ui';
import Toast from 'react-native-toast-message';
import { HeaderWithTitle } from '@/components';
import { ContainerLayout } from '@/layout/safe-area-layout';
import CustomTextInput from '@/components/input/custom-text-input';
import { StatusScreen } from '@/components/fallbacks/status-screen';
import { BottomSheetModal } from '@/components/ui/modal/bottom-sheet-modal';
import { useTransferQuote } from '@/hooks/api/use-transfer';
import { formatCurrencyByCode } from '@/utils/numbers';
import moment from 'moment';
import CurrencyDropdownWithBalance from '@/components/currency/currency-dropdown-with-balance';
import { DetailRow } from '@/components/actions/cross-currency-convertion-action';
import VerifyTransactionPin from '@/components/actions/verify-pin-action';
interface WalletToWalletTransferResponse {
  fromBalance: { availableBalance: number };
  toBalance: { availableBalance: number };
  outTransaction: { status: string; reference: string };
  inTransaction: { status: string; reference: string };
  success: boolean;
  message: string;
}

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

type FormData = {
  amount: string;
  receivers_wallet_code: string;
  currency_id: string;
  description: string;
};

type FormErrors = {
  amount?: string;
  receivers_wallet_code?: string;
  currency_id?: string;
  description?: string;
};

interface WalletToWalletTransferProps {
  onSuccess?: () => void;
  defaultCurrencyId?: string;
}

export default function WalletToWalletTransfer({
  onSuccess,
  defaultCurrencyId = 'USD',
}: WalletToWalletTransferProps) {
  const { profile } = useProfileStore();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [form, setForm] = useState<FormData>({
    amount: '',
    receivers_wallet_code: '',
    currency_id: defaultCurrencyId,
    description: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [userSelectedCurrency, setUserSelectedCurrency] = useState<any>(null);
  const [transferStatus, setTransferStatus] = useState<
    'success' | 'failed' | null
  >(null);
  const [transferMessage, setTransferMessage] = useState<string>('');

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
  const senderCurrencyCode = userSelectedCurrency?.currencyCode || 'USD';

  const setValue = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const [walletToWalletTransfer, { loading }] = useMutation<
    { walletToWalletTransfer: WalletToWalletTransferResponse },
    { input: WalletToWalletInput }
  >(WALLET_TO_WALLET_TRANSFER, {
    onCompleted: (data) => {
      if (data.walletToWalletTransfer.success) {
        setTransferStatus('success');
        setTransferMessage(
          data.walletToWalletTransfer.message ||
            'Transfer completed successfully'
        );
        onSuccess?.();
      } else {
        setTransferStatus('failed');
        setTransferMessage(
          data.walletToWalletTransfer.message || 'Transfer failed'
        );
      }
    },
    onError: (error) => {
      setTransferStatus('failed');
      setTransferMessage(error.message || 'An error occurred');
    },
  });

  const [
    fetchUserByWalletCode,
    { data: receiverData, loading: receiverLoading, error: receiverError },
  ] = useLazyQuery(GET_USER_WALLET_CODE);

  const [
    fetchQuote,
    { data: quoteData, loading: quoteLoading, error: quoteError },
  ] = useTransferQuote();

  useEffect(() => {
    if (
      !form.receivers_wallet_code ||
      form.receivers_wallet_code.trim().length < 5
    )
      return;
    const handle = setTimeout(() => {
      fetchUserByWalletCode({
        variables: { walletCode: form.receivers_wallet_code.trim() },
      });
    }, 300);
    return () => clearTimeout(handle);
  }, [form.receivers_wallet_code, fetchUserByWalletCode]);

  useEffect(() => {
    if (receiverError) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: receiverError.message || 'Failed to fetch receiver',
        visibilityTime: 3000,
        autoHide: true,
      });
    }
  }, [receiverError]);

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
    if (!form.receivers_wallet_code)
      newErrors.receivers_wallet_code = 'Receiver wallet code is required';
    if (!userSelectedCurrency) newErrors.currency_id = 'Currency is required';
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
      const result = await walletToWalletTransfer({
        variables: {
          input: {
            amount: form.amount,
            receiversWalletCode: form.receivers_wallet_code,
            description: form.description || null,
            sendersWalletId: senderWalletId,
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

  const normalizedQuote: TransferQuoteData | null = quoteData?.transferQuote
    ? {
        amount: quoteData.transferQuote.amount,
        applies: quoteData.transferQuote.applies,
        currencyCode:
          quoteData.transferQuote.currencyCode || senderCurrencyCode,
        expiresAt: quoteData.transferQuote.expiresAt || '',
        feeAmount: quoteData.transferQuote.feeAmount,
        feeCurrencyCode:
          quoteData.transferQuote.feeCurrencyCode ||
          quoteData.transferQuote.currencyCode ||
          senderCurrencyCode,
        paymentType: quoteData.transferQuote.paymentType || 'WALLET_TO_WALLET',
        quoteId: quoteData.transferQuote.quoteId || '',
        tier: quoteData.transferQuote.tier || '',
        totalDebit: quoteData.transferQuote.totalDebit,
      }
    : null;

  const isReceiverValid = !!receiverData?.getUserByWalletCode?.user;

  const processDisabled =
    loading ||
    quoteLoading ||
    !form.amount ||
    parseFloat(form.amount) <= 0 ||
    !form.receivers_wallet_code ||
    form.receivers_wallet_code.trim().length < 5 ||
    !isReceiverValid;

  if (showPinModal) {
    return (
      <ContainerLayout>
        <VerifyTransactionPin
          onClose={() => setShowPinModal(false)}
          onSuccess={handlePinVerified}
          loading={loading}
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
            title="Wallet to Wallet Transfer"
            description=" Enter your details correctly"
          />

          <View className="mb-6">
            <CustomTextInput
              label="Amount"
              placeholder="Enter amount"
              value={form.amount}
              onChangeText={(value) => setValue('amount', value)}
              keyboardType="decimal-pad"
              editable={!loading}
              hasError={!!errors.amount}
            />
            {errors.amount && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.amount}
              </Typography>
            )}
          </View>

          <View className="mb-6">
            <CustomTextInput
              label="Receiver Wallet Code"
              placeholder="Enter receiver wallet code"
              value={form.receivers_wallet_code}
              onChangeText={(value) => setValue('receivers_wallet_code', value)}
              editable={!loading}
              hasError={!!errors.receivers_wallet_code}
            />
            {errors.receivers_wallet_code && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.receivers_wallet_code}
              </Typography>
            )}
            <View className="mt-2" style={{ minHeight: 24 }}>
              {receiverLoading && (
                <Typography variant="caption" className="text-gray-500">
                  Loading...
                </Typography>
              )}
              {!receiverLoading && receiverData?.getUserByWalletCode?.user && (
                <Typography
                  variant="body"
                  className="text-green-700 font-semibold"
                >
                  {receiverData.getUserByWalletCode.user.firstName}{' '}
                  {receiverData.getUserByWalletCode.user.lastName}
                </Typography>
              )}
              {!receiverLoading &&
                form.receivers_wallet_code &&
                !receiverData?.getUserByWalletCode && (
                  <Typography
                    variant="caption"
                    className="text-red-500 font-semibold"
                  >
                    No user found for this code
                  </Typography>
                )}
            </View>
          </View>

          <CurrencyDropdownWithBalance
            onCurrencySelect={(currency) => setUserSelectedCurrency(currency)}
          />

          <View className="mb-8">
            <CustomTextInput
              label="Description"
              placeholder="Enter description"
              value={form.description}
              onChangeText={(value) => setValue('description', value)}
              editable={!loading}
              hasError={!!errors.description}
            />
            {errors.description && (
              <Typography variant="caption" className="text-red-500 mt-1">
                {errors.description}
              </Typography>
            )}
          </View>

          <View className="pb-6">
            <ReusableButton
              text="Proceed"
              onPress={async () => {
                if (!validate()) return;
                try {
                  await fetchQuote({
                    variables: {
                      input: {
                        amount: form.amount,
                        currencyCode: senderCurrencyCode,
                        fromWalletId: senderWalletId,
                        paymentType: 'WALLET_TO_WALLET',
                        toWalletCode: form.receivers_wallet_code.trim(),
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

            <DetailRow label="Destination" value={form.receivers_wallet_code} />

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
            text={loading ? 'Processing...' : 'Confirm and Send'}
            onPress={handleOpenPinModal}
            disabled={loading}
          />
        </View>
      </BottomSheetModal>
    </ContainerLayout>
  );
}
