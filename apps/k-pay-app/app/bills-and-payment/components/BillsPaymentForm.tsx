import { zodResolver } from '@hookform/resolvers/zod';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ReusableModal } from '@/components/ui/modal/modal';
import { Dropdown } from '@/components/ui/dropdown/dropdown';
import { Input } from '@/components/ui/input/input';
import { NumberInput } from '@/components/ui/input/money-input';
import { ReusableButton } from '@/components/ui/button/reusable-button';
import { Typography } from '@/components/ui/typography/typography';
import { FormProgress } from '@/components/form/form-progress';
import { useBillPayment } from '@/hooks/api/use-bill-payment';
import { useProfileStore } from '@/store/profile-store';
import {
  billPaymentDefaultValues,
  BillPaymentFormData,
  createBillPaymentSchema,
} from '../../../schema/bill-payment';

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

export default function BillsPaymentForm({
  selectedCategory,
  selectedBiller,
  selectedItem,
  countryCode,
}: BillsPaymentFormProps) {
  const { t } = useTranslation();
  const { profile } = useProfileStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error'>(
    'success'
  );
  const [resultMessage, setResultMessage] = useState('');
  const [resultReference, setResultReference] = useState('');
  const [resultAmount, setResultAmount] = useState('');
  const [customerValidation, setCustomerValidation] = useState<{
    checking: boolean;
    valid: boolean | null;
    message: string;
    customerName: string;
  }>({
    checking: false,
    valid: null,
    message: '',
    customerName: '',
  });

  const { createBillPayment, getFlutterwaveBillPaymentStatus, validateFlutterwaveBillCustomer, creating } =
    useBillPayment();

  const formSchema = createBillPaymentSchema(t);

  const form = useForm<BillPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: billPaymentDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
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
  const watchedAccount = form.watch('account');

  const showError = (message: string) => {
    setConfirmOpen(false);
    setResultStatus('error');
    setResultMessage(message);
    setResultReference('');
    setResultAmount('');
    setResultOpen(true);
  };

  const showSuccess = (message: string, reference?: string | null, amount?: string) => {
    setConfirmOpen(false);
    setResultStatus('success');
    setResultMessage(message);
    setResultReference(reference || '');
    setResultAmount(amount || '');
    setResultOpen(true);
  };

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

  useEffect(() => {
    const customerId = watchedAccount?.trim();
    const itemCode = selectedItem?.itemCode;

    if (!itemCode || !customerId || customerId.length < 3) {
      setCustomerValidation({
        checking: false,
        valid: null,
        message: '',
        customerName: '',
      });
      return;
    }

    let active = true;
    setCustomerValidation((prev) => ({ ...prev, checking: true }));

    const timeout = setTimeout(async () => {
      try {
        const validationResult = await validateFlutterwaveBillCustomer({
          variables: {
            customerId,
            itemCode,
          },
        });

        const validationData =
          validationResult.data?.validateFlutterwaveBillCustomer;
        if (!active) return;

        if (!validationData) {
          setCustomerValidation({
            checking: false,
            valid: false,
            message: 'Unable to validate customer',
            customerName: '',
          });
          return;
        }

        setCustomerValidation({
          checking: false,
          valid: validationData.valid,
          message: validationData.message || '',
          customerName: validationData.customerName || '',
        });
      } catch {
        if (!active) return;
        setCustomerValidation({
          checking: false,
          valid: false,
          message: 'Unable to validate customer',
          customerName: '',
        });
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [watchedAccount, selectedItem?.itemCode, validateFlutterwaveBillCustomer]);

  const onSubmit = () => {
    if (!selectedCategory || !selectedBiller || !selectedItem) {
      showError('Please select a category, biller and bill item');
      return;
    }
    setConfirmOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      if (!selectedCategory || !selectedBiller || !selectedItem) {
        showError('Please select a category, biller and bill item');
        return;
      }

      const formData = form.getValues();

      if (!selectedItem?.itemCode) {
        showError('Please select a bill item');
        return;
      }

      const parsedAmount = Number(formData.amount?.toString().replace(/,/g, ''));
      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        showError(t('validation.amountNumeric'));
        return;
      }

      const resolvedCurrency = (selectedItem.currency || formData.currency).toUpperCase();
      const resolvedWallet = (profile?.wallets || []).find((wallet) =>
        (wallet.balances || []).some(
          (balance) =>
            balance.currency?.code?.toUpperCase() === resolvedCurrency
        )
      );

      if (!resolvedWallet?.id) {
        showError(`No wallet found for ${resolvedCurrency}`);
        return;
      }

      const validationResult = await validateFlutterwaveBillCustomer({
        variables: {
          customerId: formData.account,
          itemCode: selectedItem.itemCode,
        },
      });

      const validationData =
        validationResult.data?.validateFlutterwaveBillCustomer;
      if (!validationData?.valid) {
        showError(validationData?.message || 'Invalid customer account details');
        return;
      }

      const billPaymentInput = {
        amount: parsedAmount,
        billerCode: selectedBiller.billerCode,
        billerId: selectedBiller.id,
        countryCode: countryCode || selectedCategory.country,
        currencyCode: resolvedCurrency,
        customerId: formData.account,
        itemCode: selectedItem.itemCode,
        walletId: resolvedWallet.id,
        description: `${selectedCategory.name} - ${selectedBiller.name}`,
        narration: `${selectedCategory.name} for ${formData.account}`,
      };

      const createResult = await createBillPayment({
        variables: {
          input: billPaymentInput,
        },
      });

      const paymentResult = createResult.data?.payFlutterwaveBill;
      if (!paymentResult) {
        showError(t('billPayment.paymentFailed'));
        return;
      }

      if (!paymentResult.success) {
        showError(paymentResult.message || t('billPayment.paymentFailed'));
        return;
      }

      const reference =
        paymentResult.reference || paymentResult.flutterwaveReference;
      if (reference) {
        const statusResult = await getFlutterwaveBillPaymentStatus({
          variables: { reference },
        });

        const paymentStatus = statusResult.data?.flutterwaveBillPaymentStatus;
        if (paymentStatus && !paymentStatus.success) {
          showError(paymentStatus.message || t('billPayment.paymentFailed'));
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
        amount: selectedItem.amount ? Number(selectedItem.amount).toLocaleString() : '',
      });

      showSuccess(
        paymentResult.message || t('billPayment.paymentSuccessful'),
        paymentResult.reference || paymentResult.flutterwaveReference || '',
        `${resolvedCurrency} ${parsedAmount.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      );
    } catch (error) {
      console.error('Payment failed:', error);
      showError(t('billPayment.paymentFailed'));
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
      (wallet.balances || []).some(
        (balance) => balance.currency?.code?.toUpperCase() === resolvedCurrency
      )
    );

    return (
      hasRequiredValues &&
      validAmount &&
      !!selectedItem?.itemCode &&
      hasWalletForCurrency &&
      !creating
    );
  }, [watchedValues, selectedItem?.itemCode, selectedItem?.currency, creating, profile?.wallets]);

  if (!selectedCategory) {
    return null;
  }

  return (
    <>
      <View className="bg-white rounded-2xl border border-gray-100 p-4">
        <View className="mb-6 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <Typography className="font-semibold text-gray-900">
            {selectedCategory.name}
          </Typography>
          {selectedBiller ? (
            <Typography variant="caption" className="text-gray-600 mt-1">
              Biller: {selectedBiller.name}
            </Typography>
          ) : null}
          {selectedItem ? (
            <Typography variant="caption" className="text-gray-600 mt-1">
              Item: {selectedItem.name}
            </Typography>
          ) : null}
        </View>

        <View className="mb-6">
          <FormProgress steps={2} currentStep={1} title={t('billPayment.form.title')} />
        </View>

        <View className="gap-6">
          <Controller
            control={form.control}
            name="currency"
            render={({ field, fieldState }) => (
              <Dropdown
                options={currencyOptions.map((currencyCode) => ({
                  value: currencyCode,
                  label: currencyCode,
                }))}
                selectedValue={field.value}
                onSelect={(option) => field.onChange(option.value)}
                placeholder="Select currency"
                label={t('billPayment.form.currency')}
                error={fieldState.error?.message}
                disabled={!!selectedItem?.currency || currencyOptions.length === 0}
                searchable={true}
                searchPlaceholder="Search currency"
                emptyMessage="No currency found"
              />
            )}
          />

          <Controller
            control={form.control}
            name="amount"
            render={({ field, fieldState }) => {
              const selectedCurrency = (form.watch('currency') || '').toUpperCase();
              const numericValue = Number((field.value || '').toString().replace(/,/g, '')) || 0;

              return (
                <View>
                  <NumberInput
                    currency={(selectedCurrency as any) || undefined}
                    value={numericValue}
                    onChange={(value) => {
                      if (isAmountFixed) return;
                      field.onChange(value.toLocaleString());
                    }}
                    placeholder={t('placeholders.enterAmount')}
                    label={t('billPayment.form.amount')}
                    error={fieldState.error?.message}
                    className="mb-0"
                  />
                  {isAmountFixed ? (
                    <Typography variant="caption" className="text-gray-500">
                      Amount is fixed for this item.
                    </Typography>
                  ) : null}
                </View>
              );
            }}
          />

          <Controller
            control={form.control}
            name="account"
            render={({ field, fieldState }) => (
              <View>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Enter customer account ID"
                  label="Customer ID / Account Number"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={fieldState.error?.message}
                  className="mb-0"
                />
                {customerValidation.checking ? (
                  <Typography variant="caption" className="text-gray-500 mt-2">
                    Validating customer...
                  </Typography>
                ) : null}
                {!customerValidation.checking &&
                customerValidation.valid === true ? (
                  <Typography variant="caption" className="text-green-600 mt-2">
                    {customerValidation.customerName
                      ? `Valid customer: ${customerValidation.customerName}`
                      : customerValidation.message || 'Customer validated'}
                  </Typography>
                ) : null}
                {!customerValidation.checking &&
                customerValidation.valid === false ? (
                  <Typography variant="caption" className="text-red-600 mt-2">
                    {customerValidation.message || 'Invalid customer'}
                  </Typography>
                ) : null}
              </View>
            )}
          />

          <ReusableButton
            onPress={form.handleSubmit(onSubmit)}
            disabled={!isFormValid}
            loading={creating}
            variant="primary"
            text={creating ? t('billPayment.form.processing') : t('billPayment.form.proceed')}
            className={isFormValid ? 'bg-primary' : 'bg-gray-300'}
            textColor={isFormValid ? '#fff' : '#6B7280'}
          />
        </View>
      </View>

      <ReusableModal
        visible={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Bill Payment"
        showCloseButton={false}
        variant="center"
        isClosing={creating}
      >
        <Typography variant="body" className="text-gray-700 text-center">
          You are about to pay {form.watch('currency')} {form.watch('amount')} for{' '}
          {selectedCategory.name} ({selectedBiller?.name || '-'}) to{' '}
          {form.watch('account')}.
        </Typography>

        <View className="mt-6 gap-3">
          <TouchableOpacity
            onPress={() => setConfirmOpen(false)}
            disabled={creating}
            activeOpacity={0.85}
            className="w-full py-3 rounded-xl border border-gray-200"
          >
            <Typography variant="body" className="text-gray-900 text-center">
              Cancel
            </Typography>
          </TouchableOpacity>

          <ReusableButton
            onPress={handleFormSubmit}
            disabled={creating}
            loading={creating}
            variant="primary"
            text={creating ? 'Processing...' : 'Continue'}
          />
        </View>
      </ReusableModal>

      <ReusableModal
        visible={resultOpen && resultStatus === 'success'}
        onClose={() => setResultOpen(false)}
        title="Bill Payment Successful"
        showCloseButton={false}
        variant="center"
      >
        <View className="gap-4">
          <View className="items-center">
            <Typography className="text-gray-900 font-semibold">
              {resultAmount}
            </Typography>
            <Typography variant="caption" className="text-gray-600 mt-1 text-center">
              {resultMessage}
            </Typography>
          </View>

          <View className="bg-gray-50 border border-gray-100 rounded-xl p-4 gap-3">
            <View className="flex-row justify-between">
              <Typography variant="caption" className="text-gray-600">
                Category
              </Typography>
              <Typography variant="caption" className="text-gray-900">
                {selectedCategory.name || '-'}
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography variant="caption" className="text-gray-600">
                Biller
              </Typography>
              <Typography variant="caption" className="text-gray-900">
                {selectedBiller?.name || '-'}
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography variant="caption" className="text-gray-600">
                Item
              </Typography>
              <Typography variant="caption" className="text-gray-900">
                {selectedItem?.name || '-'}
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography variant="caption" className="text-gray-600">
                Customer ID
              </Typography>
              <Typography variant="caption" className="text-gray-900">
                {form.watch('account') || '-'}
              </Typography>
            </View>
            <View className="flex-row justify-between">
              <Typography variant="caption" className="text-gray-600">
                Date
              </Typography>
              <Typography variant="caption" className="text-gray-900">
                {new Date().toLocaleString()}
              </Typography>
            </View>
          </View>

          {resultReference ? (
            <View className="bg-white border border-gray-200 rounded-xl p-4">
              <Typography variant="caption" className="text-gray-600">
                Reference
              </Typography>
              <Typography className="text-gray-900 font-mono mt-1">
                {resultReference}
              </Typography>
              <TouchableOpacity
                onPress={() => Clipboard.setStringAsync(resultReference)}
                activeOpacity={0.85}
                className="mt-3 w-full py-3 rounded-xl border border-gray-200"
              >
                <Typography variant="body" className="text-gray-900 text-center">
                  Copy reference
                </Typography>
              </TouchableOpacity>
            </View>
          ) : null}

          <ReusableButton
            onPress={() => setResultOpen(false)}
            variant="primary"
            text="Done"
          />
        </View>
      </ReusableModal>

      <ReusableModal
        visible={resultOpen && resultStatus === 'error'}
        onClose={() => setResultOpen(false)}
        title="Bill Payment Failed"
        showCloseButton={false}
        variant="center"
      >
        <View className="gap-4">
          <Typography variant="body" className="text-gray-700 text-center">
            {resultMessage}
          </Typography>
          <ReusableButton
            onPress={() => setResultOpen(false)}
            variant="outline"
            text="Close"
            textColor="#111827"
            className="bg-transparent border border-gray-200"
          />
        </View>
      </ReusableModal>
    </>
  );
}
