import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

import { ModularCard } from '@/components/sub-modules/card/card';
import { FormProgress } from '@/components/common/forms/form-progress';
import { Input } from '@/components/ui/input';
import { Button, IconArrowRight } from 'k-polygon-assets';
import { ArrowLeft, ArrowRight } from 'iconsax-reactjs';
import { exchangeSchema } from '@/schema/dashboard';
import z from 'zod';
import { useGetMyWallets } from '@/hooks/api';
import CrossCurrencyPreviewAndConvertionAction from '@/components/actions/wallet/cross-currency-convertion-action';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { CROSS_CURRENCY_QUOTE } from '@repo/api';
import { handleGraphQLError } from '@/utils/error-handling';
import { normalizeApolloError, toFriendlyMessage } from '@/helpers/errors';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/common/fallbacks';
import { InputWithSearch, TransactionErrorDialog, TransactionSuccessDialog } from '@ui/index';

const ExchangeMoney = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [quote, setQuote] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLiveQuote] = useState<any>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const { data: walletsData, loading: walletsLoading } = useGetMyWallets();
  const wallets = walletsData?.myWallet || [];
  const [getCrossQuote, { loading: quoteLoading }] = useMutation(CROSS_CURRENCY_QUOTE);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error' | null>(null);
  const [resultMessage, setResultMessage] = useState('');

  const availableOptions = wallets.map((wallet) => ({
    value: wallet.currency?.code || '',
    label: wallet.currency?.code || ''
  }));

  const defaultCurrencyFrom = availableOptions[0]?.value || 'USD';
  const defaultCurrencyTo = availableOptions[1]?.value || 'XOF';

  const formSchema = exchangeSchema();
  type FormValues = z.infer<typeof formSchema>;

  const [formData, setFormData] = useState<FormValues>({
    currencyFrom: defaultCurrencyFrom,
    currencyTo: defaultCurrencyTo,
    amountFrom: '',
    amountTo: ''
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as unknown as any),
    defaultValues: formData,
    values: formData
  });

  const getBalance = (code: string): string => {
    if (walletsLoading) return '---';
    const wallet = wallets.find((w) => w.currency?.code === code);
    const balance = wallet?.balances?.[0]?.availableBalance || '0';
    return parseFloat(balance.toString()).toLocaleString();
  };

  const getBalanceNumber = (code: string): number => {
    const wallet = wallets.find((w) => w.currency?.code === code);
    const balance = wallet?.balances?.[0]?.availableBalance || '0';
    return parseFloat(balance.toString());
  };

  const getLiveQuote = useCallback(
    async (amount: string, fromCurrency: string, toCurrency: string) => {
      if (!amount || parseFloat(amount) <= 0 || fromCurrency === toCurrency) {
        setLiveQuote(null);
        setFormData((prev) => ({ ...prev, amountTo: '' }));
        return;
      }

      const fromWallet = wallets.find((w) => w.currency?.code === fromCurrency);
      const toWallet = wallets.find((w) => w.currency?.code === toCurrency);

      if (!fromWallet || !toWallet) {
        return;
      }

      try {
        const { data } = await getCrossQuote({
          variables: {
            input: {
              amount: parseFloat(amount),
              fromWalletId: fromWallet.id,
              toWalletId: toWallet.id
            }
          }
        });

        if (data?.crossCurrencyQuote) {
          setLiveQuote(data.crossCurrencyQuote);
          const receiveAmount = data.crossCurrencyQuote.receiveAmount?.toString() || '';
          setFormData((prev) => ({ ...prev, amountTo: receiveAmount }));
          form.setValue('amountTo', receiveAmount);
        }
      } catch (error: any) {
        console.error('Live quote failed:', error);
      }
    },
    [wallets, getCrossQuote, form]
  );

  const handleAmountChange = (value: string) => {
    setFormData((prev) => ({ ...prev, amountFrom: value }));
    form.setValue('amountFrom', value);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      getLiveQuote(value, formData.currencyFrom, formData.currencyTo);
    }, 800);

    setDebounceTimer(newTimer);
  };

  const handleSwitchCurrencies = () => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        currencyFrom: prev.currencyTo,
        currencyTo: prev.currencyFrom,
        amountFrom: prev.amountTo,
        amountTo: prev.amountFrom
      };
      form.setValue('currencyFrom', newData.currencyFrom);
      form.setValue('currencyTo', newData.currencyTo);
      form.setValue('amountFrom', newData.amountFrom);
      form.setValue('amountTo', newData.amountTo);

      if (newData.amountFrom) {
        getLiveQuote(newData.amountFrom, newData.currencyFrom, newData.currencyTo);
      }

      return newData;
    });
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  async function onSubmit(values: FormValues) {
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (!values.amountFrom || parseFloat(values.amountFrom) <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      if (values.currencyFrom === values.currencyTo) {
        setError('Please select different currencies for exchange');
        return;
      }

      const fromWallet = wallets.find((w) => w.currency?.code === values.currencyFrom);
      const toWallet = wallets.find((w) => w.currency?.code === values.currencyTo);

      if (!fromWallet || !toWallet) {
        setError('Selected wallet not found. Please try again.');
        return;
      }

      // Check if user has sufficient balance
      const availableBalance = getBalanceNumber(values.currencyFrom);
      const requestedAmount = parseFloat(values.amountFrom);

      if (requestedAmount > availableBalance) {
        setError(`Insufficient balance. Available: ${availableBalance} ${values.currencyFrom}`);
        return;
      }

      const { data } = await getCrossQuote({
        variables: {
          input: {
            amount: parseFloat(values.amountFrom),
            fromWalletId: fromWallet.id,
            toWalletId: toWallet.id
          }
        }
      });

      if (data?.crossCurrencyQuote) {
        setQuote(data.crossCurrencyQuote);
        setIsOpen(true);
      } else {
        setError('Unable to get exchange quote. Please try again.');
      }
    } catch (error: any) {
      console.error('Quote failed:', error);

      try {
        const normalizedError = normalizeApolloError(error);
        const friendlyMessage = toFriendlyMessage(normalizedError);
        setError(friendlyMessage);
        toast.error(friendlyMessage);
      } catch {
        // Fallback error handling if normalization fails
        handleGraphQLError(error, 'Failed to get exchange quote. Please try again.');
        const fallbackMessage =
          error?.message || error?.graphQLErrors?.[0]?.message || 'Failed to get exchange quote. Please try again.';
        setError(fallbackMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Skeleton loading component
  const FormSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {/* From section */}
      <div className="grid grid-cols-4 gap-[17px] border border-gray-300 py-[15px] px-[24px] rounded-[10px]">
        <div className="col-span-1">
          <Skeleton className="h-4 w-8 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="col-span-3">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Switch button */}
      <div className="flex items-center flex-col justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      <div className="grid grid-cols-4 gap-[17px] border border-gray-300 py-[15px] px-[24px] rounded-[10px]">
        <div className="col-span-1">
          <Skeleton className="h-4 w-8 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="col-span-3">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Proceed button */}
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );

  return (
    <ModularCard>
      <div>
        <div className="flex justify-end">
          {wallets.length > 0 && <FormProgress steps={2} currentStep={1} title="Enter details" />}
        </div>
        <div className="mt-[16px]">
          <div className="flex items-center justify-between mb-8">
            {wallets.length > 0 && <h1 className="text-[18px] font-semibold text-gray-900">Exchange money</h1>}
            {walletsLoading && (
              <div className="flex items-center text-sm text-gray-500">
                <Skeleton className="h-4 w-4 rounded-full mr-2" />
                Loading wallets...
              </div>
            )}
          </div>
          {walletsLoading ? (
            <FormSkeleton />
          ) : wallets.length === 0 ? (
            <div className="text-center py-12">
              <EmptyState
                title={'No wallets available'}
                description={'Please create a wallet first to exchange money.'}
              />
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-4 gap-[17px] border border-gray-300 py-[15px] px-[24px] rounded-[10px]">
                <div className="col-span-1">
                  <small>From</small>
                  <InputWithSearch
                    options={availableOptions}
                    value={formData.currencyFrom}
                    onChange={(value: string) => {
                      setFormData((prev) => ({ ...prev, currencyFrom: value }));
                      form.setValue('currencyFrom', value);
                      if (formData.amountFrom) {
                        getLiveQuote(formData.amountFrom, value, formData.currencyTo);
                      }
                    }}
                    placeholder="Select currency"
                    emptyMessage="No currency found."
                  />
                </div>
                <div className="col-span-3">
                  <small>
                    Available balance:{' '}
                    {walletsLoading ? (
                      <Skeleton className="inline-block h-4 w-20" />
                    ) : (
                      <b>
                        {getBalance(formData.currencyFrom)} {formData.currencyFrom}
                      </b>
                    )}
                  </small>
                  <Input
                    value={formData.amountFrom}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      handleAmountChange(inputValue);
                    }}
                    type="number"
                    placeholder="Enter Amount"
                    max={getBalanceNumber(formData.currencyFrom)}
                  />
                </div>
              </div>
              <div className="flex items-center flex-col justify-center">
                <button
                  type="button"
                  onClick={handleSwitchCurrencies}
                  className="-gap-5 bg-blue-100 p-1 text-blue-700 aspect-square flex items-center flex-col justify-center rounded-full hover:bg-blue-200 transition-colors"
                >
                  <ArrowLeft className="-mb-1" size={15} />
                  <ArrowRight className="-mt-1" size={15} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-[17px] border border-gray-300 py-[15px] px-[24px] rounded-[10px]">
                <div className="col-span-1">
                  <small>To</small>
                  <InputWithSearch
                    options={availableOptions}
                    value={formData.currencyTo}
                    onChange={(value: string) => {
                      setFormData((prev) => ({ ...prev, currencyTo: value }));
                      form.setValue('currencyTo', value);
                      if (formData.amountFrom) {
                        getLiveQuote(formData.amountFrom, formData.currencyFrom, value);
                      }
                    }}
                    placeholder="Select currency"
                    emptyMessage="No currency found."
                  />
                </div>
                <div className="col-span-3">
                  <small>
                    Available balance:{' '}
                    {walletsLoading ? (
                      <Skeleton className="inline-block h-4 w-20" />
                    ) : (
                      <b>
                        {getBalance(formData.currencyTo)} {formData.currencyTo}
                      </b>
                    )}
                  </small>
                  <Input
                    value={Number(formData?.amountTo).toFixed(2)}
                    readOnly
                    type="number"
                    placeholder="0"
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-brandBlue-600"
                icon={<IconArrowRight />}
                disabled={isSubmitting || quoteLoading || walletsLoading || wallets.length === 0}
              >
                {isSubmitting || quoteLoading ? 'Getting Quote...' : 'Proceed'}
              </Button>
            </form>
          )}

          <DefaultModal open={isOpen} onClose={() => setIsOpen(false)} trigger={<div />}>
            {quote && (
              <CrossCurrencyPreviewAndConvertionAction
                quote={quote as any}
                onSuccess={(payload?: { message?: string }) => {
                  setIsOpen(false);
                  setResultStatus('success');
                  setResultMessage(payload?.message || 'Exchange completed successfully');
                  setResultOpen(true);
                }}
                onError={(payload?: { message?: string }) => {
                  setResultStatus('error');
                  setResultMessage(payload?.message || 'Exchange failed. Please try again.');
                  setResultOpen(true);
                }}
              />
            )}
          </DefaultModal>
          <TransactionSuccessDialog
            open={resultOpen && resultStatus === 'success'}
            onOpenChange={(open) => {
              if (!open) {
                setResultOpen(false);
              }
            }}
            title="Exchange Successful"
            amount={quote ? `${Number(quote.receiveAmount).toFixed(2)} ${quote.toCurrencyCode}` : undefined}
            subtitle={resultMessage}
            details={
              quote
                ? [
                    {
                      label: 'From',
                      value: `${quote.sendAmount} ${quote.fromCurrencyCode}`
                    },
                    {
                      label: 'To',
                      value: `${Number(quote.receiveAmount).toFixed(2)} ${quote.toCurrencyCode}`
                    },
                    {
                      label: 'Rate',
                      value: Number(quote.exchangeRate).toFixed(4)
                    }
                  ]
                : []
            }
            onPrimaryAction={() => setResultOpen(false)}
          />
          <TransactionErrorDialog
            open={resultOpen && resultStatus === 'error'}
            onOpenChange={(open) => {
              if (!open) {
                setResultOpen(false);
              }
            }}
            title="Exchange Failed"
            description={resultMessage}
            onRetry={() => {
              setResultOpen(false);
            }}
            onCancel={() => setResultOpen(false)}
          />
        </div>
      </div>
    </ModularCard>
  );
};

export default ExchangeMoney;
