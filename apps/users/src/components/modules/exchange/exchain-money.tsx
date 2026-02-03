import { useForm, useWatch } from 'react-hook-form';
import React, { useState, useEffect, useCallback } from 'react';
import { FormProgress } from '@/components/common/forms/form-progress';
import { EasyForm } from '@/components/common/forms/easy-form';
import { EasySelect } from '@/components/common/forms/easy-select';
import { NumberInput, Currency } from '@/components/ui/input';
import { IconArrowRight } from 'k-polygon-assets';
import { ArrowLeft, ArrowRight } from 'iconsax-reactjs';
import { ModularCard } from '@/components/sub-modules/card/card';
import { useCurrencies } from '@/hooks/use-currencies';
import { exchangeSchema } from '@/schema/dashboard';
import { Button } from 'k-polygon-assets';
import { WithdrawalRequest } from './withdrawal-request';

const ExchangeMoney = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currencyOptions, currencies } = useCurrencies();

  const defaultCurrencyFrom = currencyOptions[0]?.value || '';
  const defaultCurrencyTo = currencyOptions[1]?.value || '';

  const form = useForm({
    defaultValues: {
      currencyFrom: defaultCurrencyFrom,
      currencyTo: defaultCurrencyTo,
      amountFrom: '',
      amountTo: ''
    },
    mode: 'onChange'
  });
  const { control, setValue, getValues } = form;

  const currencyFrom = useWatch({ control, name: 'currencyFrom' });
  const currencyTo = useWatch({ control, name: 'currencyTo' });
  const amountFrom = useWatch({ control, name: 'amountFrom' });
  const amountTo = useWatch({ control, name: 'amountTo' });

  const [lastEdited, setLastEdited] = useState<string | null>(null);

  const formatNumber = (value: string) => {
    if (!value) return '';
    const cleaned = value.replace(/[^0-9.]/g, '').replace(/(\.*?)\..*/g, '$1');
    if (cleaned.match(/^0+[0-9]/)) return cleaned.replace(/^0+/, '');
    return cleaned || '';
  };

  const rates: Record<string, Record<string, number>> = {
    USD: { XOF: 666.67, EUR: 0.92, NGN: 1500 },
    XOF: { USD: 0.0015, EUR: 0.0014, NGN: 2.25 },
    EUR: { USD: 1.09, XOF: 655.96, NGN: 1635 },
    NGN: { USD: 0.00067, XOF: 0.44, EUR: 0.00061 }
  };
  const balances: Record<string, number> = {
    USD: 567889,
    XOF: 1000000,
    EUR: 20000,
    NGN: 500000
  };

  const getRate = useCallback((from: string, to: string) => (from === to ? 1 : rates[from]?.[to] || 1), []);
  const getBalance = (code: string) => balances[code] || 0;

  useEffect(() => {
    if (lastEdited !== 'amountFrom' || !currencyFrom || !currencyTo) return;
    const num = amountFrom ? parseFloat(amountFrom) : 0;
    const rate = getRate(currencyFrom, currencyTo);
    setValue('amountTo', num ? (num * rate).toFixed(2) : '', {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [currencyFrom, currencyTo, amountFrom, lastEdited, setValue, getRate]);

  useEffect(() => {
    if (lastEdited !== 'amountTo' || !currencyFrom || !currencyTo) return;
    const num = amountTo ? parseFloat(amountTo) : 0;
    const rate = getRate(currencyTo, currencyFrom);
    setValue('amountFrom', num ? (num * rate).toFixed(2) : '', {
      shouldValidate: true,
      shouldDirty: true
    });
  }, [currencyFrom, currencyTo, amountTo, lastEdited, setValue, getRate]);

  const handleInputChange = (field: string, value: string) => {
    const formatted = formatNumber(value);
    setLastEdited(field);
    setValue(field as any, formatted, { shouldValidate: true, shouldDirty: true });
  };

  const handleSwitchCurrencies = () => {
    const currentFrom = getValues('currencyFrom');
    const currentTo = getValues('currencyTo');
    const currentAmountFrom = getValues('amountFrom');
    setValue('currencyFrom', currentTo, { shouldValidate: true, shouldDirty: true });
    setValue('currencyTo', currentFrom, { shouldValidate: true, shouldDirty: true });
    if (currentAmountFrom) {
      setLastEdited('amountFrom');
      setValue('amountFrom', currentAmountFrom, { shouldValidate: true, shouldDirty: true });
    } else {
      setLastEdited(null);
      setValue('amountFrom', '', { shouldValidate: true, shouldDirty: true });
      setValue('amountTo', '', { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = () => {
    setIsOpen(true);
  };

  return (
    <ModularCard>
      <div>
        <div className="flex justify-end">
          <FormProgress steps={2} currentStep={1} title="Enter details" />
        </div>
        <div className="mt-[16px]">
          <h1 className="text-[18px] font-semibold text-gray-900 mb-8">Exchange money</h1>
          <EasyForm schema={exchangeSchema()} onSubmit={onSubmit} className="gap-y-[24px]">
            {() => (
              <>
                <div className="grid grid-cols-4 gap-[17px] border border-gray-300 py-[15px] px-[24px] rounded-[10px]">
                  <div className="col-span-1">
                    <small>From</small>
                    <EasySelect
                      name="currencyFrom"
                      options={currencyOptions}
                      renderOption={(item) => {
                        const Icon = currencies.find((c) => c.currency === item.value)?.icon;
                        return (
                          <div className="flex gap-[9px]">
                            {item.value}
                            {Icon && <Icon width={20} height={20} />}
                          </div>
                        );
                      }}
                    />
                  </div>
                  <div className="col-span-3">
                    <small>
                      Available balance: <b>{getBalance(currencyFrom)}</b>
                    </small>
                    <NumberInput
                      value={parseFloat(amountFrom) || 0}
                      onChange={(value) => handleInputChange('amountFrom', value.toString())}
                      placeholder="Enter Amount"
                      currency={currencyFrom as Currency}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex items-center flex-col justify-center">
                  <button
                    onClick={handleSwitchCurrencies}
                    className="-gap-5 bg-blue-100 p-1 text-blue-700 aspect-square flex items-center flex-col justify-center rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <ArrowLeft className="-mb-1" size={15} />
                    <ArrowRight className="-mt-1" size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-[17px] border border-gray-300 py-[15px] px-[24px] rounded-[10px]">
                  <div className="col-span-1">
                    <small>To</small>
                    <EasySelect
                      name="currencyTo"
                      options={currencyOptions}
                      renderOption={(item) => {
                        const Icon = currencies.find((c) => c.currency === item.value)?.icon;
                        return (
                          <div className="flex gap-[9px]">
                            {item.value}
                            {Icon && <Icon width={20} height={20} />}
                          </div>
                        );
                      }}
                    />
                  </div>
                  <div className="col-span-3">
                    <small>
                      Available balance: <b>{getBalance(currencyTo)}</b>
                    </small>
                    <NumberInput
                      value={parseFloat(amountTo) || 0}
                      onChange={(value) => handleInputChange('amountTo', value.toString())}
                      placeholder="Enter Amount"
                      currency={currencyTo as Currency}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-[12px] mb-[24px] py-[22px]">
                  <p>Fee</p>
                  <span className="p-0.5 bg-green-50 text-green-600 px-[6px] py-[3px] rounded">1%</span>
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-brandBlue-600" icon={<IconArrowRight />}>
                  Proceed
                </Button>
              </>
            )}
          </EasyForm>
        </div>
        <WithdrawalRequest onSubmit={() => {}} open={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </ModularCard>
  );
};

export default ExchangeMoney;
