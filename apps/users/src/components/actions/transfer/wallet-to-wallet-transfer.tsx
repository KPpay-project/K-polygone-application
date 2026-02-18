import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatNumberFixed, parseAmountStringToNumber } from '@/utils/maths.ts';
import { Input } from 'k-polygon-assets';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { NumberInput, Currency } from '@/components/ui/input';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { TransferConfirmation } from '@/components/modules/transfer/transfer-confirmation';
import { WALLET_TO_WALLET_TRANSFER, WalletToWalletInput, GET_USER_WALLET_CODE } from '@repo/api';
import { BENEFICIARY_TYPE_ENUM, TRANSFER_METHOD_ENUM } from '@/enums';
import { useTransferQuote } from '@/hooks/api/use-transfer';
import UsersCurrencyDropdown from '@/components/currency-dropdown/users-currency-dropdown.tsx';
import { useGetMyWallets } from '@/hooks/api';
import ListBeneficiariesPanel, { Beneficiary } from '@/components/modules/beneficiaries/list-beneficiaries-panel';
import { EmptyState } from '@/components/common/fallbacks';
import { CREATE_BENEFICIARY_MUTATION } from '@repo/api';
import { Typography, type CurrencyOption, TransactionSuccessDialog, TransactionErrorDialog } from '@repo/ui';

interface WalletToWalletTransferResponse {
  fromBalance: { availableBalance: number };
  toBalance: { availableBalance: number };
  outTransaction: { status: string; reference: string };
  inTransaction: { status: string; reference: string };
  success: boolean;
  message: string;
}

const walletToWalletTransferSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  receivers_wallet_code: z.string().min(1, 'Receiver wallet code is required'),
  description: z.string().optional()
});

type WalletToWalletTransferFormData = z.infer<typeof walletToWalletTransferSchema>;

interface WalletToWalletTransferActionProps {
  onSuccess?: () => void;
  defaultCurrencyId?: string;
}

export function WalletToWalletTransferAction({ onSuccess }: WalletToWalletTransferActionProps) {
  const { t } = useTranslation();
  const {
    data: walletsData,
    loading: walletsLoading,
    error: walletsError,
    refetch: refetchWallets
  } = useGetMyWallets();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error'>('success');
  const [resultMessage, setResultMessage] = useState('');
  const [resultReference, setResultReference] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [selectedCurrencyOption, setSelectedCurrencyOption] = useState<CurrencyOption | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<WalletToWalletTransferFormData>({
    resolver: zodResolver(walletToWalletTransferSchema)
  });

  const watchedAmount = watch('amount');
  const watchedReceiverCode = watch('receivers_wallet_code');
  const watchedDescription = watch('description');
  const watchedAmountNum = parseAmountStringToNumber(watchedAmount);

  const [walletToWalletTransfer, { loading: transferLoading }] = useMutation<
    { walletToWalletTransfer: WalletToWalletTransferResponse },
    { input: WalletToWalletInput }
  >(WALLET_TO_WALLET_TRANSFER, {
    onCompleted: (data) => {
      const response = data.walletToWalletTransfer;
      if (response?.success) {
        refetchWallets();
        setResultStatus('success');
        setResultMessage(response?.message || t('transfer.transferSuccessful') || 'Transfer successful');
        setResultReference(response?.outTransaction?.reference || '');
        setResultOpen(true);
        onSuccess?.();
      } else {
        setResultStatus('error');
        setResultMessage(response?.message || t('transfer.failed') || 'Transfer failed');
        setResultReference('');
        setResultOpen(true);
      }
    },
    onError: (error) => {
      setResultStatus('error');
      setResultMessage(error.message || t('common.error') || 'An error occurred');
      setResultReference('');
      setResultOpen(true);
    }
  });

  const [createBeneficiary] = useMutation(CREATE_BENEFICIARY_MUTATION, {
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
    const receiverUser = receiverData?.getUserByWalletCode?.user;
    if (!receiverUser || !watchedReceiverCode) {
      toast.error('No valid receiver to add as beneficiary');
      return;
    }
    const beneficiaryName = `${receiverUser.firstName || ''} ${receiverUser.lastName || ''}`.trim() || 'Unknown';
    createBeneficiary({
      variables: {
        name: beneficiaryName,
        number: watchedReceiverCode.trim(),
        type: BENEFICIARY_TYPE_ENUM.WALLET_CODE,
        providerName: BENEFICIARY_TYPE_ENUM.WALLET_CODE
      }
    });
  };

  const [fetchQuote, { data: quoteData, loading: quoteLoading, error: quoteError }] = useTransferQuote();

  const [fetchUserByWalletCode, { data: receiverData, loading: receiverLoading, error: receiverError }] =
    useLazyQuery(GET_USER_WALLET_CODE);

  useEffect(() => {
    if (!watchedReceiverCode || watchedReceiverCode.trim().length < 5) return;
    const handle = setTimeout(() => {
      fetchUserByWalletCode({ variables: { walletCode: watchedReceiverCode.trim() } });
    }, 300);
    return () => clearTimeout(handle);
  }, [watchedReceiverCode, fetchUserByWalletCode]);

  useEffect(() => {
    if (receiverError)
      toast.error(receiverError.message || t('transfer.receiverFetchFailed') || 'Failed to fetch receiver');
  }, [receiverError, t]);

  useEffect(() => {
    if (quoteError) toast.error(quoteError.message || t('transfer.quoteFetchFailed') || 'Failed to fetch quote');
  }, [quoteError, t]);

  const wallets = walletsData?.myWallet || [];
  const senderWallet = wallets[0];
  const senderWalletId = senderWallet?.id;
  const senderCurrencyCode = senderWallet?.balances?.[0]?.currency?.code || 'USD';

  const effectiveCurrencyCode = selectedCurrencyOption?.currencyCode || senderCurrencyCode;
  const effectiveSenderWalletId = selectedCurrencyOption?.walletId || senderWalletId;

  const normalizedQuote = useMemo(() => {
    const fq = quoteData?.transferQuote;
    if (!fq) return null;
    const amountNum = parseAmountStringToNumber(fq.amount);
    const feeNum = parseAmountStringToNumber(fq.feeAmount);
    const totalDebitNum = parseAmountStringToNumber(fq.totalDebit);
    return {
      amount: formatNumberFixed(amountNum, 2),
      applies: Boolean(fq.applies),
      currencyCode: fq.currencyCode || effectiveCurrencyCode,
      expiresAt: fq.expiresAt || '',
      feeAmount: formatNumberFixed(feeNum, 2),
      feeCurrencyCode: fq.feeCurrencyCode || fq.currencyCode || effectiveCurrencyCode,
      paymentType: fq.paymentType || 'WALLET_TO_WALLET',
      quoteId: fq.quoteId || '',
      tier: fq.tier ?? null,
      totalDebit: formatNumberFixed(totalDebitNum, 2)
    };
  }, [quoteData, effectiveCurrencyCode]);

  const isReceiverValid = useMemo(() => !!receiverData?.getUserByWalletCode?.user, [receiverData]);

  const processDisabled =
    transferLoading ||
    quoteLoading ||
    !watchedAmount ||
    watchedAmountNum <= 0 ||
    !watchedReceiverCode ||
    watchedReceiverCode.trim().length < 5 ||
    !isReceiverValid;

  const handleAmountChange = (value: number) => {
    setValue('amount', formatNumberFixed(value, 2));
  };

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    console.log(beneficiary);
    setValue('receivers_wallet_code', beneficiary.number);
  };

  const handleTransfer = async (form: WalletToWalletTransferFormData, paymentPin?: string) => {
    const amountNum = parseAmountStringToNumber(form.amount);
    const amount = formatNumberFixed(amountNum, 2);
    const input: WalletToWalletInput = {
      amount,
      description: form.description || null,
      quoteId: normalizedQuote?.quoteId ?? null,
      receiversWalletCode: form.receivers_wallet_code.trim(),
      sendersWalletId: effectiveSenderWalletId!,
      paymentPin: paymentPin || ''
    };
    await walletToWalletTransfer({
      variables: { input }
    });
  };

  const onFormSubmit = () => handleSubmit((data) => handleTransfer(data))();

  const onFormSubmitWithPin = (pin: string) => {
    const formData = {
      amount: watchedAmount || '',
      receivers_wallet_code: watchedReceiverCode || '',
      description: watchedDescription
    };
    handleTransfer(formData, pin);
  };

  if (walletsLoading) {
    return <div className="p-4 text-center text-gray-500">{t('common.loading') || 'Loading...'}</div>;
  }

  if (walletsError) {
    return <div className="p-4 text-center text-red-500">{t('common.error') || 'Error loading wallets'}</div>;
  }

  if (!wallets.length) {
    return <EmptyState title="No Wallet" description="You do not have any wallets available." />;
  }

  if (!senderWalletId) {
    return <div className="p-4 text-center text-red-500">{t('transfer.invalidWallet')}</div>;
  }

  const closeResultDialog = () => {
    setResultOpen(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleTransfer)} className="space-y-4">
        <div>
          <ListBeneficiariesPanel
            selectedBeneficiary={selectedBeneficiary}
            onSelectBeneficiary={handleSelectBeneficiary}
            beneficiaryType={BENEFICIARY_TYPE_ENUM.WALLET_CODE}
          />

          <UsersCurrencyDropdown value={selectedCurrencyOption} onChange={setSelectedCurrencyOption} dedupeByCurrency />
          <Label>{t('transfer.amount')}</Label>
          <NumberInput
            placeholder={t('transfer.enterAmount')}
            value={watchedAmountNum}
            onChange={handleAmountChange}
            currency={(effectiveCurrencyCode as Currency) || 'USD'}
            className="w-full"
          />
          {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}
        </div>

        <div>
          <Label>{t('transfer.receiverWalletCode')}</Label>
          <Input
            {...register('receivers_wallet_code')}
            placeholder={t('transfer.enterReceiverWalletCode')}
            className="w-full"
            type={'number'}
          />
          {errors.receivers_wallet_code && (
            <span className="text-red-500 text-sm">{errors.receivers_wallet_code.message}</span>
          )}

          <div className="">
            {receiverLoading && <span className="text-xs text-muted-foreground">{t('common.processing')}</span>}
            {!receiverLoading && receiverData?.getUserByWalletCode?.user && (
              <Typography className="text-green-600 mt-2">
                {receiverData.getUserByWalletCode.user.firstName} {receiverData.getUserByWalletCode.user.lastName}
              </Typography>
            )}
            {!receiverLoading && watchedReceiverCode && !receiverData?.getUserByWalletCode && (
              <span className="text-xs text-muted-foreground text-red-500 font-semibold">
                {t('transfer.receiverNotFound') || 'No user found for this code'}
              </span>
            )}
          </div>
        </div>

        <div>
          <Label>{t('transfer.description')}</Label>
          <Input {...register('description')} placeholder={t('transfer.enterDescription')} className="w-full" />
          {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
        </div>

        <Button
          type="button"
          // disabled={processDisabled}
          className="w-full"
          onClick={async () => {
            const amountStr = formatNumberFixed(watchedAmountNum, 2);
            const toCode = (watchedReceiverCode || '').trim();
            try {
              await fetchQuote({
                variables: {
                  input: {
                    amount: amountStr,
                    currencyCode: effectiveCurrencyCode,
                    fromWalletId: effectiveSenderWalletId,
                    paymentType: 'WALLET_TO_WALLET',
                    toWalletCode: toCode
                  }
                }
              });
            } catch (error) {
              console.error('Failed to fetch quote:', error);
            }
            setIsModalOpen(true);
          }}
        >
          {t('common.proceed') || 'Proceed'}
        </Button>
      </form>

      <DefaultModal
        open={isModalOpen && !resultOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-md"
        trigger={<></>}
      >
        <div className="p-4">
          <TransferConfirmation
            amount={formatNumberFixed(watchedAmountNum, 2)}
            destination={watchedReceiverCode || ''}
            recipientEmail={''}
            description={watchedDescription}
            currency={effectiveCurrencyCode || 'USD'}
            transferMethod={TRANSFER_METHOD_ENUM.WALLET}
            onFormSubmit={onFormSubmit}
            onFormSubmitWithPin={onFormSubmitWithPin}
            quote={normalizedQuote}
            quoteLoading={quoteLoading}
            loading={transferLoading}
          />
        </div>
      </DefaultModal>

      <TransactionSuccessDialog
        open={resultOpen && resultStatus === 'success'}
       
        onOpenChange={(open) => {
          if (!open) closeResultDialog();
        }}
        title={t('transfer.transferSuccessful') || 'Transfer successful'}
        amount={`${effectiveCurrencyCode || 'USD'} ${formatNumberFixed(watchedAmountNum, 2)}`}
        subtitle={resultMessage}
        details={[
          {
            label: 'Recipient',
            value: receiverData?.getUserByWalletCode?.user
              ? `${receiverData.getUserByWalletCode.user.firstName || ''} ${receiverData.getUserByWalletCode.user.lastName || ''}`.trim()
              : watchedReceiverCode || '-'
          },
          { label: 'Account', value: watchedReceiverCode || '-' },
          { label: 'Date', value: new Date().toLocaleString() }
        ]}
        reference={resultReference}
        onCopyReference={() => {
          if (resultReference) navigator.clipboard.writeText(resultReference);
        }}
        onPrimaryAction={closeResultDialog}
        onShareReceipt={handleAddBeneficiary}
        shareLabel="Add Beneficiary"
        primaryLabel="Done"
      />

      <TransactionErrorDialog
        open={resultOpen && resultStatus === 'error'}
        onOpenChange={(open) => {
          if (!open) closeResultDialog();
        }}
        title={t('transfer.transferFailed') || 'Transfer failed'}
        description={resultMessage}
        onRetry={() => {
          setResultOpen(false);
          setResultStatus('error');
        }}
        onCancel={closeResultDialog}
      />
    </>
  );
}
