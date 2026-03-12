import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button } from 'k-polygon-assets';
import { NumberInput, Currency } from '@/components/ui/input';
import UsersCurrencyDropdown from '@/components/currency-dropdown/users-currency-dropdown';
import { useProfileStore } from '@/store/profile-store';
import { toast } from 'sonner';
import Loading from '@/components/common/loading';
import { Typography } from '@/components/sub-modules/typography/typography';
import { SupportedProviders } from '@repo/types';
import { PrimaryPhoneNumberInput, type CurrencyOption } from '@repo/ui';
import ErrorAndSuccessFallback from '@/components/sub-modules/modal-contents/error-success-fallback';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { VerifyTransactionPin } from '@/components/actions/pin/verify-transaction-pin';
import ListBeneficiariesPanel, { Beneficiary } from '@/components/modules/beneficiaries/list-beneficiaries-panel';
import { BENEFICIARY_TYPE_ENUM } from '@/enums';
import {
  CREATE_BENEFICIARY_MUTATION,
  FETCH_BENEFICIARIES_QUERY,
  MOBILE_MONEY_WITHRAWAL_QOUTE,
  WITHDRAW_TO_MOBILE_MONEY
} from '@repo/api';
import { useMutation } from '@apollo/client';
import { Button as ShadcnButton } from '@/components/ui/button';
import { useGetMyWallets } from '@/hooks/api';
import { extractApiErrorMessage, type GraphQLLikeResponse } from '@repo/common';

const schema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  receiverPhone: z.string().min(5, 'Valid phone number required'),
  currency: z.string().min(1)
});

const SIMPLE_ERROR_MESSAGE = 'Something went wrong. Please try again.';

type FormData = z.infer<typeof schema>;
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
type MobileMoneyQuoteResult = {
  mobileMoneyWithdrawalQuote: MobileMoneyQuote | null;
};
type WithdrawToMobileMoneyPayload = {
  success: boolean;
  message?: string;
  flutterwaveTransferId?: string;
  reference?: string;
  status?: string;
};
type WithdrawToMobileMoneyResult = {
  withdrawToMobileMoney: WithdrawToMobileMoneyPayload | null;
};

interface Props {
  onSuccess?: () => void;
  selectedProvider?: SupportedProviders | null;
}

const MobileMoneyTransfereAction = ({ onSuccess, selectedProvider }: Props) => {
  const { t } = useTranslation();
  const { profile } = useProfileStore();
  const { data: walletsData } = useGetMyWallets();

  const defaultWalletId = profile?.wallets?.[0]?.id ?? '';
  const defaultCurrencyCode = profile?.wallets?.[0]?.balances?.[0]?.currency?.code || 'USD';

  const [selectedWalletId, setSelectedWalletId] = useState<string>(defaultWalletId);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedCurrencyOption, setSelectedCurrencyOption] = useState<CurrencyOption | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState('NG');
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState<MobileMoneyQuote | null>(null);

  const [resultStatus, setResultStatus] = useState<'success' | 'error'>('success');
  const [resultMessage, setResultMessage] = useState('');

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      receiverPhone: '',
      currency: defaultCurrencyCode
    }
  });

  const watchedAmount = watch('amount');
  const watchedCurrency = watch('currency');
  const watchedPhone = watch('receiverPhone');

  const currencyById = useMemo(() => {
    const map = new Map<string, CurrencyOption>();
    for (const wallet of walletsData?.myWallet || []) {
      for (const balance of wallet?.balances || []) {
        const currencyId = balance?.currency?.id;
        const currencyCode = balance?.currency?.code;
        if (!currencyId || !currencyCode || map.has(currencyId)) continue;
        map.set(currencyId, {
          currencyCode,
          walletId: wallet.id,
          balanceId: `${wallet.id}-${currencyCode}`
        });
      }
    }
    return map;
  }, [walletsData]);

  const [getMobileMoneyQuote, { loading: quoting }] = useMutation<MobileMoneyQuoteResult>(
    MOBILE_MONEY_WITHRAWAL_QOUTE,
    {
      errorPolicy: 'all'
    }
  );
  const [withdrawToMobileMoney, { loading: withdrawing }] = useMutation<WithdrawToMobileMoneyResult>(
    WITHDRAW_TO_MOBILE_MONEY,
    { errorPolicy: 'all' }
  );

  const onSubmit = async (values: FormData) => {
    const walletId = selectedWalletId || defaultWalletId;

    if (!walletId) {
      toast.error(t('transfer.invalidWallet') || 'Invalid wallet selected');
      return;
    }
    if (!selectedProvider) {
      toast.error(t('transfer.selectProvider') || 'Please select a provider');
      return;
    }

    const amountNum = parseFloat(values.amount.replace(/,/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Invalid amount');
      return;
    }

    try {
      const quoteResp: GraphQLLikeResponse<MobileMoneyQuoteResult> = await getMobileMoneyQuote({
        variables: {
          input: {
            amount: amountNum,
            countryCode: selectedCountryCode.toUpperCase(),
            currencyCode: values.currency,
            network: selectedProvider,
            walletId
          }
        }
      });

      const quote = quoteResp.data?.mobileMoneyWithdrawalQuote;
      const errorMsg = extractApiErrorMessage(quoteResp, {
        fallback: SIMPLE_ERROR_MESSAGE
      });

      if (errorMsg || !quote?.quoteId) {
        setResultStatus('error');
        setResultMessage(errorMsg || SIMPLE_ERROR_MESSAGE);
        setIsResultModalOpen(true);
        return;
      }

      setCurrentQuoteId(quote.quoteId);
      setCurrentQuote(quote);
      setPendingData(values);
      setIsQuoteModalOpen(true);
    } catch (error: any) {
      setResultStatus('error');
      setResultMessage(
        extractApiErrorMessage(error, {
          fallback: SIMPLE_ERROR_MESSAGE
        }) || SIMPLE_ERROR_MESSAGE
      );
      setIsResultModalOpen(true);
    }
  };

  const handlePinVerified = async (pin: string) => {
    const walletId = selectedWalletId || defaultWalletId;
    if (!pendingData || !walletId || !selectedProvider || !currentQuoteId) return;

    const amountNum = parseFloat(pendingData.amount.replace(/,/g, ''));

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Invalid amount');
      return;
    }

    try {
      const resp: GraphQLLikeResponse<WithdrawToMobileMoneyResult> = await withdrawToMobileMoney({
        variables: {
          input: {
            amount: amountNum,
            countryCode: selectedCountryCode.toUpperCase(),
            currencyCode: pendingData.currency,
            description: 'Mobile Money Transfer',
            network: selectedProvider,
            paymentPin: pin,
            phoneNumber: pendingData.receiverPhone,
            quoteId: currentQuoteId,
            walletId
          }
        }
      });

      const graphQlErrorMessage = extractApiErrorMessage(resp);
      if (graphQlErrorMessage && !resp.data?.withdrawToMobileMoney) {
        setResultStatus('error');
        setResultMessage(graphQlErrorMessage);
        setIsResultModalOpen(true);
        return;
      }

      const payload = resp.data?.withdrawToMobileMoney;
      if (payload?.success) {
        setResultStatus('success');
        setResultMessage(payload?.message || t('transfer.success') || 'Transfer successful');
        setIsResultModalOpen(true);
        onSuccess?.();
        reset();
      } else {
        setResultStatus('error');
        setResultMessage(
          extractApiErrorMessage(
            { message: payload?.message },
            {
              fallback: SIMPLE_ERROR_MESSAGE
            }
          ) || SIMPLE_ERROR_MESSAGE
        );
        setIsResultModalOpen(true);
      }
    } catch (error: any) {
      setResultStatus('error');
      setResultMessage(
        extractApiErrorMessage(error, {
          fallback: SIMPLE_ERROR_MESSAGE
        }) || SIMPLE_ERROR_MESSAGE
      );
      setIsResultModalOpen(true);
    } finally {
      setPendingData(null);
      setIsPinModalOpen(false);
    }
  };

  const closeResultModal = () => {
    setIsResultModalOpen(false);
    setIsQuoteModalOpen(false);
    setIsPinModalOpen(false);
    setResultMessage('');
    setCurrentQuoteId(null);
    setCurrentQuote(null);
  };

  const continueFromQuote = () => {
    setIsQuoteModalOpen(false);
    setIsPinModalOpen(true);
  };

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setValue('receiverPhone', beneficiary.number);

    if (beneficiary.currencyId) {
      const matchedCurrency = currencyById.get(beneficiary.currencyId);
      if (matchedCurrency) {
        setSelectedCurrencyOption(matchedCurrency);
        setSelectedWalletId(matchedCurrency.walletId);
        setValue('currency', matchedCurrency.currencyCode);
      }
    }
  };

  const [createBeneficiary, { loading: createBeneficiaryLoading }] = useMutation(CREATE_BENEFICIARY_MUTATION, {
    refetchQueries: [{ query: FETCH_BENEFICIARIES_QUERY }],
    onCompleted: (data) => {
      if (data.createBeneficiary.success) {
        toast.success(data.createBeneficiary.message || 'Beneficiary added successfully');
      } else {
        toast.error(
          data.createBeneficiary.errors?.[0]?.message || data.createBeneficiary.message || 'Failed to add beneficiary'
        );
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add beneficiary');
    }
  });

  const handleAddBeneficiary = () => {
    if (!watchedPhone) {
      toast.error('No phone number to add as beneficiary');
      return;
    }
    createBeneficiary({
      variables: {
        name: watchedPhone,
        number: watchedPhone,
        type: BENEFICIARY_TYPE_ENUM.MOBILE_MONEY,
        providerName: selectedProvider || BENEFICIARY_TYPE_ENUM.MOBILE_MONEY
      }
    });
  };

  return (
    <>
      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-6 space-y-6">
        <Loading isLoading={quoting || withdrawing} text={t('common.processing') || 'Processing...'} />

        <ListBeneficiariesPanel
          selectedBeneficiary={selectedBeneficiary}
          onSelectBeneficiary={handleSelectBeneficiary}
          beneficiaryType={BENEFICIARY_TYPE_ENUM.MOBILE_MONEY}
        />

        <div>
          <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.amount') || 'Amount'}</Typography>
          <NumberInput
            placeholder={t('transfer.enterAmount') || 'Enter amount'}
            value={watchedAmount ? parseFloat(watchedAmount.replace(/,/g, '')) || 0 : 0}
            onChange={(v) => setValue('amount', v.toLocaleString('en-US'))}
            currency={(watchedCurrency as Currency) || 'USD'}
            className="w-full"
          />
          {errors.amount && <Typography className="text-red-500 text-xs mt-1">{errors.amount.message}</Typography>}
        </div>

        <UsersCurrencyDropdown
          value={selectedCurrencyOption}
          selectedCurrency={watchedCurrency || defaultCurrencyCode}
          onChange={(opt) => {
            if (opt) {
              setSelectedCurrencyOption(opt);
              setSelectedWalletId(opt.walletId ?? '');
              setValue('currency', opt.currencyCode ?? defaultCurrencyCode);
            }
          }}
        />

        <div>
          <PrimaryPhoneNumberInput
            value={watchedPhone || ''}
            onChange={(v, countryData) => {
              setValue('receiverPhone', v);
              setSelectedCountryCode(countryData?.countryCode?.toUpperCase?.() || 'NG');
            }}
            placeholder={t('transfer.enterMobileNumber') || 'Enter mobile number'}
            className="w-full"
          />
          {errors.receiverPhone && (
            <Typography className="text-red-500 text-xs mt-1">{errors.receiverPhone.message}</Typography>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={quoting || withdrawing}>
          {t('common.continue') || 'Continue'}
        </Button>
      </form>

      <Dialog
        open={isPinModalOpen || isQuoteModalOpen || isResultModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsPinModalOpen(false);
            setIsQuoteModalOpen(false);
            setIsResultModalOpen(false);
            setPendingData(null);
            setCurrentQuoteId(null);
            setCurrentQuote(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-2xl">
          <div className="p-6">
            {isResultModalOpen ? (
              <>
                <ErrorAndSuccessFallback
                  status={resultStatus}
                  title={
                    resultStatus === 'success'
                      ? t('transfer.successTitle') || 'Transfer Successful'
                      : t('transfer.failedTitle') || 'Transfer Failed'
                  }
                  body={resultMessage}
                  onAction={closeResultModal}
                  buttonText={t('common.close') || 'Close'}
                />
                {resultStatus === 'success' && (
                  <ShadcnButton
                    variant="outline"
                    className="w-full mt-2"
                    onClick={handleAddBeneficiary}
                    disabled={createBeneficiaryLoading || !watchedPhone}
                  >
                    {createBeneficiaryLoading ? 'Adding...' : 'Add Beneficiary'}
                  </ShadcnButton>
                )}
              </>
            ) : isQuoteModalOpen ? (
              <div className="space-y-4">
                <Typography className="text-lg font-semibold text-gray-900">Withdrawal Quote</Typography>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium text-gray-900">
                      {currentQuote?.amount} {currentQuote?.currencyCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fee</span>
                    <span className="font-medium text-gray-900">
                      {currentQuote?.feeAmount} {currentQuote?.feeCurrencyCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Debit</span>
                    <span className="font-semibold text-gray-900">
                      {currentQuote?.totalDebit} {currentQuote?.currencyCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Network</span>
                    <span className="font-medium text-gray-900">{currentQuote?.paymentType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tier</span>
                    <span className="font-medium text-gray-900">{currentQuote?.tier}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Applies</span>
                    <span className="font-medium text-gray-900">{currentQuote?.applies ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-gray-600">Expires At</span>
                    <span className="font-medium text-gray-900 text-right">{currentQuote?.expiresAt}</span>
                  </div>
                </div>
                <Button type="button" className="w-full" onClick={continueFromQuote}>
                  {t('common.continue') || 'Continue'}
                </Button>
              </div>
            ) : (
              <VerifyTransactionPin
                onClose={() => {
                  setIsPinModalOpen(false);
                  setPendingData(null);
                }}
                onSuccess={handlePinVerified}
                loading={withdrawing}
                title={t('transfer.verifyTransaction') || 'Verify Transaction'}
                description={t('transfer.enterPinDescription') || 'Enter your 4-digit PIN to confirm'}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileMoneyTransfereAction;
