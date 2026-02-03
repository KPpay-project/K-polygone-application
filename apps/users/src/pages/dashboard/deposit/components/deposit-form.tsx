import { toast } from 'sonner';
import { PhoneCountrySelector } from '@/components/common';
import CurrencyDropdown from '@/components/common/currency-dropdown';
import { ArrowRight } from 'iconsax-reactjs';
import { Button, Form, FormControl, FormItem, FormLabel, Input } from 'k-polygon-assets/components';
import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { countries } from '@/utils/constants';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { FormField } from '@/components/ui/form';
import { Currency, NumberInput } from '@/components/ui/input';

import { DepositMethodKey, DepositFormValues, methodRequiresPhone, depositMethodsRegistry } from '../methods';
import { useDeposit } from '@/hooks/api/use-deposit';
import { useProfileStore } from '@/store/profile-store';
import { useCurrencyStore } from '@/store/currency-store';
import { useCurrencies } from '@/hooks/use-currencies';

interface DepositFormProps {
  form: UseFormReturn<DepositFormValues>;
  onSubmit: (values: DepositFormValues) => void;
  selectedMethod: DepositMethodKey;
}

export const DepositForm = ({ form, onSubmit, selectedMethod }: DepositFormProps) => {
  const [depositMutation, { loading }] = useDeposit();
  const { profile, fetchProfile } = useProfileStore();
  const { wallets } = profile || {};
  const { t } = useTranslation();
  const { selectedCurrency } = useCurrencyStore();
  const { apiCurrencies, getCurrencySymbol } = useCurrencies();
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState('');

  useEffect(() => {
    if (apiCurrencies && apiCurrencies.length > 0) {
      if (selectedCurrency) {
        const found = apiCurrencies.find((c: any) => c.code === selectedCurrency);
        if (found) {
          setSelectedCurrencyCode(found.code);
          return;
        }
      }

      setSelectedCurrencyCode(apiCurrencies[0].code);
    }
  }, [apiCurrencies, selectedCurrency]);
  const [displayBalance, setDisplayBalance] = useState('$100');
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(countries[0]);

  const watchedAmount = form?.watch?.('amount') || '';

  const getPhonePlaceholder = () => {
    return t('wallet.deposit.form.enterPhoneNumber');
  };

  useEffect(() => {
    const symbol = getCurrencySymbol ? getCurrencySymbol(selectedCurrencyCode) : '$';
    if (watchedAmount && watchedAmount.trim() !== '') {
      setDisplayBalance(`${symbol}${watchedAmount}`);
    } else {
      setDisplayBalance(`${symbol}1000`);
    }
  }, [watchedAmount, selectedCurrencyCode, getCurrencySymbol]);

  if (!form) {
    console.error('DepositForm: form prop is required');
    return <div className="text-red-500">Form not initialized properly</div>;
  }

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrencyCode(currency);
    if (form.setValue) {
      form.setValue('currency', currency);
    }
  };

  const handleSubmit = async (values: DepositFormValues) => {
    let resolvedWalletId;
    if (wallets && wallets.length > 0) {
      resolvedWalletId = wallets[0].id;
    }

    if (!resolvedWalletId) {
      toast.error('No wallet found');
      return;
    }

    const payload = {
      wallet_id: resolvedWalletId,
      currencyCode: values.currency || selectedCurrencyCode,
      amount: Number(values.amount?.toString().replace(/,/g, '') || 0),
      provider: 'MTN_MOMO',
      customerPhone: values.phoneNumber
    };

    try {
      const response = await depositMutation({ variables: { input: payload } });
      if (response?.data?.deposit?.success) {
        toast.success(response.data.deposit.message || 'Deposit successful!');
        await fetchProfile();
        onSubmit(values);
      } else {
        toast.error(response?.data?.deposit?.message || 'Deposit failed.');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Deposit request failed.');
    }
  };

  const isMobileMoney = methodRequiresPhone(selectedMethod);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CurrencyDropdown
          selectedCurrency={selectedCurrencyCode}
          balance={displayBalance}
          onCurrencyChange={handleCurrencyChange}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">{t('wallet.deposit.form.amount')}</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder={t('wallet.deposit.form.enterAmount')}
                  className="h-12 text-lg"
                  currency={selectedCurrencyCode as Currency}
                  value={Number(field.value?.toString().replace(/,/g, '') || 0)}
                  onChange={(value) => {
                    field.onChange(value.toLocaleString());
                  }}
                />
              </FormControl>
              <CustomFormMessage message={form.formState.errors.amount} scope="error" />
            </FormItem>
          )}
        />

        {isMobileMoney ? (
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">{t('wallet.deposit.form.phoneNumber')}</FormLabel>
                <div className="flex items-center relative">
                  <div className="absolute flex items-center">
                    <PhoneCountrySelector
                      value={selectedPhoneCountry.code}
                      onCountryChange={(country) => {
                        setSelectedPhoneCountry(country);
                      }}
                    />
                    <span className="text-sm text-[#6C727F]">{selectedPhoneCountry.prefix}</span>
                  </div>
                  <div className="flex-1">
                    <FormControl>
                      <Input className="pl-24 !rounded-0" type="tel" placeholder={getPhonePlaceholder()} {...field} />
                    </FormControl>
                  </div>
                </div>
                <CustomFormMessage message={form.formState.errors.phoneNumber} scope="error" />
              </FormItem>
            )}
          />
        ) : (
          <div className="text-sm text-gray-600">
            {t('wallet.deposit.form.bankTransferHint', {
              defaultValue: 'You will receive bank account details after proceeding.'
            })}
          </div>
        )}

        {depositMethodsRegistry[selectedMethod]?.renderExtraFields?.(form)}

        <Button className="w-full h-12" disabled={loading}>
          {loading ? t('common.processing', { defaultValue: 'Processing...' }) : t('wallet.deposit.form.proceed')}
          {!loading && <ArrowRight />}
        </Button>
      </form>
    </Form>
  );
};
