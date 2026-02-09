import { useEffect, useMemo, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { NumberInput, Currency, Dialog, DialogContent, Loader, Input, Button, InputWithSearch, Skeleton } from '@repo/ui';
import UsersCurrencyDropdown from '@/components/currency-dropdown/users-currency-dropdown';
import { useProfileStore } from '@/store/profile-store';
import { toast } from 'sonner';
import { Typography } from '@/components/sub-modules/typography/typography';
import { FLW_BANK_WITHDRAWAL_QUOTE, WITHDRAW_TO_BANK } from '@repo/api';
import { TransferConfirmation } from '@/components/modules/transfer/transfer-confirmation.tsx';
import { TRANSFER_METHOD_ENUM } from '@/enums';
import ErrorAndSuccessFallback from '@/components/sub-modules/modal-contents/error-success-fallback.tsx';
import { useUnifiedBanks } from '@/hooks/bank/use-unified-banks';

type CurrencyOption = {
  currencyCode: string;
  walletId: string;
  balanceId: string;
};

const schema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  currency: z.string().min(1),
  bankCode: z.string().min(1, 'Bank is required'),
  accountNumber: z.string().length(10, 'Account number must be 10 digits'),
  narration: z.string().optional()
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

const BankTransferAction = ({ onSuccess }: Props) => {
  const { t } = useTranslation();
  const { profile } = useProfileStore();
  const defaultWalletId = profile?.wallets?.[0]?.id;
  const defaultCurrency = profile?.wallets?.[0]?.balances?.[0]?.currency?.code || 'USD';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      currency: defaultCurrency,
      bankCode: '',
      accountNumber: '',
      narration: ''
    }
  });

  const watchedAmount = watch('amount');
  const watchedCurrency = watch('currency');
  const watchedBankCode = watch('bankCode');
  const watchedAccountNumber = watch('accountNumber');

  const { banks, loading: banksLoading, resolveBankAccount } = useUnifiedBanks( 'paystack', 'NG');

  const [getQuote, { loading: quoting }] = useMutation(FLW_BANK_WITHDRAWAL_QUOTE, {
    errorPolicy: 'all'
  });
  const [withdrawToBank, { loading: withdrawing }] = useMutation(WITHDRAW_TO_BANK);

  const [resolving, setResolving] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormData | null>(null);
  const [resultStatus, setResultStatus] = useState<'success' | 'error' | null>(null);

  const [resultMessage, setResultMessage] = useState<string>('');
  const [selectedCurrencyOption, setSelectedCurrencyOption] = useState<CurrencyOption | null>(null);
  const [currentQuote, setCurrentQuote] = useState<any>(null);

  const bankOptions = useMemo(() => {
    return banks.map((b: any) => ({
      label: b.name,
      value: b.code
    }));
  }, [banks]);

  useEffect(() => {
    if (watchedAccountNumber.length === 10 && watchedBankCode) {
      const timer = setTimeout(async () => {
        setResolving(true);
        try {
          const details = await resolveBankAccount(watchedAccountNumber, watchedBankCode);
          if (details) {
            setAccountName(details.accountName);
            clearErrors('accountNumber');
          } else {
            setAccountName('');
            setError('accountNumber', {
              type: 'manual',
              message: 'Invalid account number'
            });
          }
        } catch (error) {
          setAccountName('');
          setError('accountNumber', {
            type: 'manual',
            message: 'Error resolving account'
          });
        } finally {
          setResolving(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAccountName('');
    }
  }, [watchedAccountNumber, watchedBankCode, resolveBankAccount, setError, clearErrors]);

  const openConfirm = async (values: FormData) => {
    const walletId = selectedCurrencyOption?.walletId || defaultWalletId;
    if (!walletId) {
      toast.error(t('transfer.invalidWallet') || 'Invalid wallet');
      return;
    }

    if (!accountName) {
      toast.error(t('transfer.verifyAccount') || 'Please verify account number');
      return;
    }

    const amountNum = parseFloat(values.amount.replace(/,/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('amount', { message: 'Invalid amount' });
      return;
    }

    try {
      const resp = await getQuote({
        variables: {
          input: {
            amount: amountNum,
            currencyCode: values.currency,
            walletId
          }
        }
      });

      const quote = resp.data?.flutterwaveBankWithdrawalQuote;
      const errorMsg = (resp as any)?.errors?.[0]?.message;

      if (errorMsg || !quote?.quoteId) {
        setResultStatus('error');
        setResultMessage(errorMsg || t('transfer.quoteFailed') || 'Failed to get quote');
        setIsConfirmOpen(true);
        return;
      }

      setCurrentQuote(quote);
      setPendingValues(values);
      setResultStatus(null);
      setResultMessage('');
      setIsConfirmOpen(true);
    } catch (err: any) {
      setResultStatus('error');
      setResultMessage(err?.message || t('common.error') || 'An error occurred');
      setIsConfirmOpen(true);
    }
  };

  const confirmTransfer = async (pin?: string) => {
    const walletId = selectedCurrencyOption?.walletId || defaultWalletId;
    if (!pendingValues || !currentQuote || !walletId) return;

    const amountNum = parseFloat(pendingValues.amount.replace(/,/g, ''));

    try {
      const resp = await withdrawToBank({
        variables: {
          input: {
            walletId,
            amount: amountNum,
            currencyCode: pendingValues.currency,
            accountBank: pendingValues.bankCode,
            accountNumber: pendingValues.accountNumber,
            beneficiaryName: accountName,
            narration: pendingValues.narration || 'Withdrawal',
            description: 'Withdrawal to bank account',
            quoteId: currentQuote.quoteId,
            paymentPin: pin || ''
          }
        }
      });

      const result = resp.data?.withdrawToBank;
      console.log(resp.data, 'showing bank result');
      if (result?.success) {
        setResultStatus('success');
        setResultMessage(result.message || t('transfer.success') || 'Withdrawal successful');
        onSuccess?.();
      } else {
        setResultStatus('error');
        setResultMessage(result?.message || t('transfer.failed') || 'Withdrawal failed');
      }
    } catch (err: any) {
      setResultStatus('error');
      let msg = err?.message || t('common.error') || 'Transaction failed';
      if (msg.includes(':exceeds_single_transaction_limit')) {
        msg = t('transfer.exceedsLimit') || 'Transaction amount exceeds the single transaction limit.';
      } else {
        msg = msg.replace('An error occurred: ', '');
      }
      setResultMessage(msg);
    }
  };

  const actionIsLoading = quoting || withdrawing;
  return (
    <>
      <form onSubmit={handleSubmit(openConfirm)} className="px-4 pb-6 space-y-6" autoComplete="on">
        {actionIsLoading && <Loader />}
        <div>
          <Typography className="text-sm font-medium text-gray-700 mb-2">
            {t('transfer.selectBank') || 'Select Bank'}
          </Typography>
          {banksLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <InputWithSearch
              options={bankOptions}
              value={watchedBankCode}
              onChange={(val) => setValue('bankCode', val, { shouldValidate: true })}
              placeholder={t('transfer.selectBank') || 'Select Bank'}
              emptyMessage="No bank found."
              className="w-full"
            />
          )}
          {errors.bankCode && <Typography className="text-red-500 text-xs mt-1">{errors.bankCode.message}</Typography>}
        </div>

        <div>
          <Typography className="text-sm font-medium text-gray-700 mb-2">
            {t('transfer.accountNumber') || 'Account Number'}
          </Typography>
          <Input
            {...register('accountNumber')}
            placeholder={t('transfer.enterBankAccount') || 'Enter 10-digit account number'}
            maxLength={10}
            className="w-full"
          />
          {resolving ? (
            <Skeleton className="h-4 w-1/2 mt-2" />
          ) : (
            accountName && (
              <Typography className="text-green-600 text-sm font-medium mt-1">{accountName}</Typography>
            )
          )}
          {errors.accountNumber && (
            <Typography className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</Typography>
          )}
        </div>

        <div>
          <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.amount') || 'Amount'}</Typography>
          <NumberInput
            value={watchedAmount ? parseFloat(watchedAmount.replace(/,/g, '')) || 0 : 0}
            onChange={(num) => {
              clearErrors('amount');
              setValue('amount', num.toLocaleString('en-US'));
            }}
            currency={(watchedCurrency as Currency) || 'USD'}
            placeholder={t('transfer.enterAmount') || 'Enter amount'}
            className="w-full"
          />
          {errors.amount && <Typography className="text-red-500 text-xs mt-1">{errors.amount.message}</Typography>}
        </div>

        <UsersCurrencyDropdown
          selectedCurrency={watchedCurrency}
          onCurrencyChange={(c) => setValue('currency', c)}
          onChange={(opt) => {
            setSelectedCurrencyOption(opt);
            if (opt?.currencyCode) setValue('currency', opt.currencyCode);
          }}
        />

        <div>
          <Typography className="text-sm font-medium text-gray-700 mb-2">
            {t('transfer.narration') || 'Narration (optional)'}
          </Typography>
          <Input
            {...register('narration')}
            placeholder={t('transfer.narrationPlaceholder') || 'Enter narration'}
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full" disabled={!accountName || resolving}>
          {t('common.continue') || 'Continue'}
        </Button>
      </form>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-md">
          {resultStatus ? (
            <ErrorAndSuccessFallback status={resultStatus} body={resultMessage} />
          ) : (
            pendingValues && (
              <TransferConfirmation
                amount={pendingValues.amount}
                destination={pendingValues.accountNumber}
                beneficiaryName={accountName}
                currency={pendingValues.currency}
                transferMethod={TRANSFER_METHOD_ENUM.BANK}
                quote={currentQuote}
                quoteLoading={quoting}
                onFormSubmitWithPin={confirmTransfer}
                loading={withdrawing}
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BankTransferAction;
