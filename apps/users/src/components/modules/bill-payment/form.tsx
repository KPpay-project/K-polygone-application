import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useBillPayment } from '@/hooks/api/use-bill-payment';
import { useProfileStore } from '@/store/profile-store';
import { FlutterwaveBillPaymentInput } from '@repo/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, NumberInput } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBillPaymentSchema, billPaymentDefaultValues, BillPaymentFormData } from '@/schema/bill-payment';
import { FormProgress } from '@/components/common/forms/form-progress';
import { ConfirmationDialog } from '@repo/ui';

type SelectedCategory = {
  code: string;
  country: string;
  id: string;
  name: string;
};

type SelectedBiller = {
  billerCode: string;
  category: string;
  country: string;
  id: string;
  isActive: boolean | null;
  name: string;
};

type SelectedItem = {
  amount: string;
  billerCode: string;
  country: string;
  currency: string | null;
  id: string;
  isAmountFixed: boolean | null;
  itemCode: string;
  name: string;
};

interface BillsPaymentFormProps {
  selectedCategory?: SelectedCategory | null;
  selectedBiller?: SelectedBiller | null;
  selectedItem?: SelectedItem | null;
  countryCode?: string;
}

const BillsPaymentForm = ({ selectedCategory, selectedBiller, selectedItem, countryCode }: BillsPaymentFormProps) => {
  const { t } = useTranslation();
  const { profile } = useProfileStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { createBillPayment, getFlutterwaveBillPaymentStatus, validateFlutterwaveBillCustomer, creating } =
    useBillPayment();

  const formSchema = createBillPaymentSchema(t);

  const form = useForm<BillPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: billPaymentDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  const currencyOptions = useMemo(() => {
    const currencies = new Set<string>();
    (profile?.wallets || []).forEach((wallet) => {
      (wallet.balances || []).forEach((balance) => {
        if (balance.currency?.code) {
          currencies.add(balance.currency.code);
        }
      });
    });

    return Array.from(currencies);
  }, [profile?.wallets]);

  const isAmountFixed = selectedItem?.isAmountFixed === true;

  useEffect(() => {
    form.setValue('service', selectedCategory?.code || '');
    form.setValue('country', countryCode || selectedCategory?.country || '');
    form.setValue('network', selectedItem?.itemCode || '');

    if (selectedItem?.currency) {
      form.setValue('currency', selectedItem.currency.toUpperCase());
    } else if (!form.getValues('currency') && currencyOptions.length > 0) {
      form.setValue('currency', currencyOptions[0]);
    }

    if (selectedItem?.amount) {
      form.setValue('amount', Number(selectedItem.amount).toLocaleString());
    }
  }, [selectedCategory, selectedItem, countryCode, form, currencyOptions]);

  const onSubmit = () => {
    if (!selectedCategory || !selectedBiller || !selectedItem) {
      toast.error('Please select a category, biller and bill item');
      return;
    }
    setConfirmOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = form.getValues();

      if (!selectedItem?.itemCode) {
        toast.error('Please select a bill item');
        return;
      }

      const parsedAmount = Number(formData.amount?.toString().replace(/,/g, ''));
      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        toast.error(t('validation.amountNumeric'));
        return;
      }

      const resolvedCurrency = (selectedItem.currency || formData.currency).toUpperCase();
      const resolvedWallet = (profile?.wallets || []).find((wallet) =>
        (wallet.balances || []).some((balance) => balance.currency?.code?.toUpperCase() === resolvedCurrency)
      );

      if (!resolvedWallet?.id) {
        toast.error(`No wallet found for ${resolvedCurrency}`);
        return;
      }

      const validationResult = await validateFlutterwaveBillCustomer({
        variables: {
          customerId: formData.account,
          itemCode: selectedItem.itemCode
        }
      });

      const validationData = validationResult.data?.validateFlutterwaveBillCustomer;
      if (!validationData?.valid) {
        toast.error(validationData?.message || 'Invalid customer account details');
        return;
      }

      const billPaymentInput: FlutterwaveBillPaymentInput = {
        amount: parsedAmount,
        billerCode: selectedBiller.billerCode,
        billerId: selectedBiller.id,
        countryCode: countryCode || selectedCategory.country,
        currencyCode: resolvedCurrency,
        customerId: formData.account,
        itemCode: selectedItem.itemCode,
        walletId: resolvedWallet.id,
        description: `${selectedCategory.name} - ${selectedBiller.name}`,
        narration: `${selectedCategory.name} for ${formData.account}`
      };

      const createResult = await createBillPayment({
        variables: {
          input: billPaymentInput
        }
      });

      const reference = createResult.data?.payFlutterwaveBill?.reference;
      if (reference) {
        const statusResult = await getFlutterwaveBillPaymentStatus({
          variables: { reference }
        });

        const paymentStatus = statusResult.data?.flutterwaveBillPaymentStatus;
        if (paymentStatus && !paymentStatus.success) {
          toast.error(paymentStatus.message || t('billPayment.paymentFailed'));
          return;
        }
      }

      setConfirmOpen(false);
      form.reset({
        ...billPaymentDefaultValues,
        service: selectedCategory.code,
        network: selectedItem.itemCode,
        country: countryCode || selectedCategory.country,
        currency: (selectedItem.currency || formData.currency || '').toUpperCase(),
        amount: selectedItem.amount ? Number(selectedItem.amount).toLocaleString() : ''
      });
      toast.success(t('billPayment.paymentSuccessful'));
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(t('billPayment.paymentFailed'));
    }
  };

  const watchedValues = form.watch();

  const isFormValid = useMemo(() => {
    const { amount, account, currency } = watchedValues;
    const hasRequiredValues = !!(account && account.trim().length >= 3 && currency);
    const parsedAmount = Number((amount || '').toString().replace(/,/g, ''));
    const validAmount = !Number.isNaN(parsedAmount) && parsedAmount > 0;

    const resolvedCurrency = (selectedItem?.currency || currency || '').toUpperCase();
    const hasWalletForCurrency = !!(profile?.wallets || []).find((wallet) =>
      (wallet.balances || []).some((balance) => balance.currency?.code?.toUpperCase() === resolvedCurrency)
    );

    return hasRequiredValues && validAmount && !!selectedItem?.itemCode && hasWalletForCurrency && !creating;
  }, [watchedValues, selectedItem?.itemCode, selectedItem?.currency, creating, profile?.wallets]);

  if (!selectedCategory) {
    return null;
  }

  return (
    <>
      <Card className="shadow-lg w-full md:w-[480px] py-6 animate-in slide-in-from-right duration-500">
        <CardContent>
          <div className="mb-6 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <h3 className="font-semibold text-gray-900">{selectedCategory.name}</h3>
            {selectedBiller ? <p className="text-sm text-gray-600 mt-1">Biller: {selectedBiller.name}</p> : null}
            {selectedItem ? <p className="text-sm text-gray-600 mt-1">Item: {selectedItem.name}</p> : null}
          </div>

          <div className="mb-6">
            <FormProgress steps={2} currentStep={1} title={t('billPayment.form.title')} />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">{t('billPayment.form.currency')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!!selectedItem?.currency || currencyOptions.length === 0}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.map((currencyCode) => (
                            <SelectItem key={currencyCode} value={currencyCode}>
                              {currencyCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => {
                  const selectedCurrency = (form.watch('currency') || '').toUpperCase();

                  return (
                    <FormItem>
                      <FormLabel className="!text-black">{t('billPayment.form.amount')}</FormLabel>
                      <FormControl>
                        <NumberInput
                          className="font-mono"
                          currency={selectedCurrency}
                          value={Number(field.value?.toString().replace(/,/g, '') || 0)}
                          onChange={(value) => {
                            if (isAmountFixed) return;
                            field.onChange(value.toLocaleString());
                          }}
                          placeholder={t('placeholders.enterAmount')}
                        />
                      </FormControl>
                      {isAmountFixed ? <p className="text-xs text-gray-500">Amount is fixed for this item.</p> : null}
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">Customer ID / Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" className="font-mono" placeholder="Enter customer account ID" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-6 text-base font-medium transition-all duration-200 ${
                  isFormValid ? 'bg-primary hover:bg-primary/90 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('billPayment.form.processing')}
                  </>
                ) : (
                  <>
                    {t('billPayment.form.proceed')}
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Bill Payment"
        description={`You are about to pay ${form.watch('currency')} ${form.watch('amount')} for ${selectedCategory.name} (${selectedBiller?.name || '-'}) to ${form.watch('account')}.`}
        cancelLabel="Cancel"
        confirmLabel={creating ? 'Processing...' : 'Continue'}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleFormSubmit}
        confirmDisabled={creating}
      />
    </>
  );
};

export default BillsPaymentForm;
