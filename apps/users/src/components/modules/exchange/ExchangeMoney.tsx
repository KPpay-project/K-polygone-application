import { ModularCard } from '@/components/sub-modules/card/card';
import { exchangeSchema } from '@/schema/dashboard';
import { ArrowLeft, ArrowRight } from 'iconsax-reactjs';
import { Button, IconArrowRight } from 'k-polygon-assets';
import z from 'zod';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client';
import { WithdrawalRequest } from './withdrawal-request';
import { useGetMyWallets } from '@/hooks/api';
import { EXCHANGE_CURRENCY_VIA_WALLET } from '@/lib/graphql/mutations/wallet';

const ExchangeMoney = () => {
  const formSchema = exchangeSchema();
  type FormValues = z.infer<typeof formSchema>;
  const [isOpen, setIsOpen] = useState(false);
  const { data: walletsData } = useGetMyWallets();
  const wallets = walletsData?.myWallet || [];
  const [exchangeCurrency] = useMutation(EXCHANGE_CURRENCY_VIA_WALLET);

  const currencyOptions = wallets.map((wallet) => ({
    value: wallet.currency.code,
    label: wallet.currency.code
  }));

  const [formData, setFormData] = useState<FormValues>({
    currencyFrom: 'USD',
    currencyTo: 'XOF',
    amountFrom: '',
    amountTo: ''
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
    values: formData
  });

  async function onSubmit(values: FormValues) {
    try {
      const fromWallet = wallets.find((w) => w.currency.code === values.currencyFrom);
      const toWallet = wallets.find((w) => w.currency.code === values.currencyTo);

      if (!fromWallet || !toWallet) {
        console.error('Wallet not found for selected currencies');
        return;
      }

      await exchangeCurrency({
        variables: {
          input: {
            fromWalletId: fromWallet.id,
            toWalletId: toWallet.id,
            amount: parseFloat(values.amountFrom)
          }
        }
      });

      setIsOpen(true);
    } catch (error) {
      console.error('Exchange failed:', error);
    }
  }

  return (
    <ModularCard>
      <div>
        <div className="flex justify-end">
          <FormProgress steps={2} currentStep={1} title="Enter details" />
        </div>

        <div className="mt-[16px]">
          <h1 className="text-[18px] font-semibold text-gray-900 mb-8">Exchange money</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-4 gap-[17px] border border-gray-300 py-[15px] px-[24px] rounded-[10px]">
              <div className="col-span-1">
                <small>From</small>
                <Select
                  value={formData.currencyFrom}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, currencyFrom: value }));
                    form.setValue('currencyFrom', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <small>
                  Available balance: <b>$567889</b>
                </small>
                <Input
                  value={formData.amountFrom}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, amountFrom: e.target.value }));
                    form.setValue('amountFrom', e.target.value);
                  }}
                  type="text"
                  placeholder="Enter Amount"
                />
              </div>
            </div>
            <div className="flex items-center flex-col justify-center ">
              <div className="-gap-5 bg-blue-100 p-1 text-blue-700 aspect-square flex items-center flex-col justify-center rounded-full">
                <ArrowLeft className="-mb-1" size={15} />
                <ArrowRight className="-mt-1" size={15} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-[17px] border border-gray-300 py-[15px] px-[24px] rounded-[10px]">
              <div className="col-span-1">
                <small>To</small>
                <Select
                  value={formData.currencyTo}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, currencyTo: value }));
                    form.setValue('currencyTo', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <small>
                  Available balance: <b>$567889</b>
                </small>
                <Input
                  value={formData.amountTo}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, amountTo: e.target.value }));
                    form.setValue('amountTo', e.target.value);
                  }}
                  type="text"
                  placeholder="Enter Amount"
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
          </form>
        </div>

        <WithdrawalRequest
          onSubmit={() => {}}
          open={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </div>
    </ModularCard>
  );
};

export default ExchangeMoney;
