import React from 'react';
import { Controller } from 'react-hook-form';
import * as z from 'zod';
import { EasyForm } from '@/components/common/forms/easy-form';
import { EasyInput } from '@/components/common/forms/easy-input';
import { EasySelect } from '@/components/common/forms/easy-select';
import { ModularCard } from '@/components/sub-modules/card/card';

const schema = z.object({
  from: z.string(),
  to: z.string(),
  amount: z.string().regex(/^\d*\.?\d*$/, 'Only numbers allowed')
});

const currencies = [
  { label: 'USD', value: 'usd' },
  { label: 'ZMW', value: 'zmw' },
  { label: 'NGN', value: 'ngn' }
];

const ExchainMoney: React.FC = () => {
  const rate = 25.5;
  return (
    <ModularCard title="Exchange Money">
      <EasyForm schema={schema} defaultValues={{ from: 'usd', to: 'zmw', amount: '' }} onSubmit={() => {}}>
        {(form) => {
          const converted = form.watch('amount') ? (parseFloat(form.watch('amount')) * rate).toFixed(2) : '';
          return (
            <>
              <div className="flex gap-2">
                <Controller
                  name="from"
                  control={form.control}
                  render={({ field }) => <EasySelect {...field} options={currencies} label="From" />}
                />
                <Controller
                  name="to"
                  control={form.control}
                  render={({ field }) => <EasySelect {...field} options={currencies} label="To" />}
                />
              </div>
              <Controller
                name="amount"
                control={form.control}
                render={({ field }) => <EasyInput {...field} label="Amount" />}
              />
              <div className="mt-2 text-xs text-muted-foreground">
                Converted: <span className="font-semibold">{converted}</span>
              </div>
            </>
          );
        }}
      </EasyForm>
    </ModularCard>
  );
};

export default ExchainMoney;
