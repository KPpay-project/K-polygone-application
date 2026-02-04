import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DepositMethods, DepositFormCard } from './components';
import { useEffect, useState } from 'react';
import { DepositMethodKey, depositMethodsRegistry, methodRequiresPhone } from './methods';

const depositSchema = z
  .object({
    currency: z.string().min(1, 'Currency is required'),
    amount: z.string().min(1, 'Amount is required'),
    phoneNumber: z.string().optional(),
    method: z.custom<DepositMethodKey>()
  })
  .superRefine((data, ctx) => {
    const requiresPhone = methodRequiresPhone(data.method as DepositMethodKey);
    if (requiresPhone && (!data.phoneNumber || String(data.phoneNumber).trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['phoneNumber'],
        message: 'Phone number is required'
      });
    }
  });

type DepositFormValues = z.infer<typeof depositSchema>;

const DepositScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState<DepositMethodKey>('card');

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      currency: 'USD',
      amount: '',
      phoneNumber: '',
      method: selectedMethod
    }
  });

  useEffect(() => {
    form.setValue('method', selectedMethod, { shouldValidate: true, shouldDirty: true });
  }, [selectedMethod, form]);

  const onSubmit = async (values: DepositFormValues) => {
    await depositMethodsRegistry[values.method].submit(values);
  };

  const handleMethodSelect = (method: DepositMethodKey) => {
    setSelectedMethod(method);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start gap-6 max-w-6xl mx-auto p-4">
        <DepositMethods selectedMethod={selectedMethod} onMethodSelect={handleMethodSelect} />
        <DepositFormCard form={form} onSubmit={onSubmit} selectedMethod={selectedMethod} />
      </div>
    </>
  );
};
export default DepositScreen;
