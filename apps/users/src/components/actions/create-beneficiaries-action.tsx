'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FETCH_BENEFICIARIES_QUERY, CREATE_BENEFICIARY_MUTATION } from '@repo/api';
import ErrorAndSuccessFallback from '../sub-modules/modal-contents/error-success-fallback';
import { useMutation, useLazyQuery } from '@apollo/client';
import { BENEFICIARY_TYPE_ENUM } from '@/enums';
import { PAYSTACK_TEST_KEY, PROVIDER_LABELS } from '@/constant';
import { PrimaryPhoneNumberInput, InputWithSearch, type CurrencyOption } from '@repo/ui';
import { GET_USER_WALLET_CODE } from '@repo/api';
import UsersCurrencyDropdown from '@/components/currency-dropdown/users-currency-dropdown';
import { useGetMyWallets } from '@/hooks/api';
import { useUnifiedBanks } from '@repo/common';
import { Skeleton } from '@/components/ui/skeleton';


const beneficiaryTypes = ['bank_transfer', 'kpay_user', 'mobile_money', 'airtime'] as const;

type BeneficiaryType = (typeof beneficiaryTypes)[number];

const typeToGraphQLEnum: Record<BeneficiaryType, BENEFICIARY_TYPE_ENUM> = {
  bank_transfer: BENEFICIARY_TYPE_ENUM.BANK,
  kpay_user: BENEFICIARY_TYPE_ENUM.WALLET_CODE,
  mobile_money: BENEFICIARY_TYPE_ENUM.MOBILE_MONEY,
  airtime: BENEFICIARY_TYPE_ENUM.AIRTIME
};

const formSchema = z
  .object({
    name: z.string().min(1, 'Beneficiary name is required'),
    type: z.enum(beneficiaryTypes, {
      message: 'Please select a beneficiary type'
    }),
    identifier: z.string().min(1, 'This field is required'),
    providerName: z.string().optional()
  })
  .superRefine((val, ctx) => {
    if (val.type === 'kpay_user') {
      if (!/^\d{10}$/.test(val.identifier)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'KPay account must be exactly 10 digits',
          path: ['identifier']
        });
      }
    }

    if (val.type === 'bank_transfer') {
      if (!val.providerName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select a bank',
          path: ['providerName']
        });
      }

      if (!/^\d{10}$/.test(val.identifier)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Account number must be 10 digits',
          path: ['identifier']
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface CreateBeneficiariesActionsProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const CreateBeneficiariesActions = ({ onSuccess, onClose }: CreateBeneficiariesActionsProps) => {
  const [step, setStep] = React.useState<'form' | 'result'>('form');
  const [mutationResult, setMutationResult] = React.useState<{
    status: 'success' | 'error';
    message: string;
  } | null>(null);
  const [selectedCurrencyOption, setSelectedCurrencyOption] = React.useState<CurrencyOption | null>(null);
  const { data: userWalletsData } = useGetMyWallets();

  const [createBeneficiary, { loading }] = useMutation(CREATE_BENEFICIARY_MUTATION, {
    refetchQueries: [{ query: FETCH_BENEFICIARIES_QUERY }],
    onCompleted: (data) => {
      if (data.createBeneficiary.success) {
        setMutationResult({
          status: 'success',
          message: data.createBeneficiary.message || 'Beneficiary added successfully!'
        });
        setStep('result');
      } else {
        const errorMessage =
          data.createBeneficiary.errors?.[0]?.message ||
          data.createBeneficiary.message ||
          'Failed to create beneficiary';
        setMutationResult({
          status: 'error',
          message: errorMessage
        });
        setStep('result');
      }
    },
    onError: (error) => {
      setMutationResult({
        status: 'error',
        message: error.message || 'An error occurred while creating beneficiary'
      });
      setStep('result');
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      name: '',
      type: undefined as BeneficiaryType | undefined,
      identifier: '',
      providerName: ''
    }
  });

  const selectedType = form.watch('type');
  const identifier = form.watch('identifier');
  const selectedBankCode = form.watch('providerName');
  const [verifyWalletCode, { data: verifiedUserData, loading: verifyingUser }] = useLazyQuery(GET_USER_WALLET_CODE);
  const { banks, loading: banksLoading, resolveBankAccount } = useUnifiedBanks('paystack', PAYSTACK_TEST_KEY, 'NG');
  const [resolvingBankAccount, setResolvingBankAccount] = React.useState(false);
  const [resolvedBankAccountName, setResolvedBankAccountName] = React.useState('');

  const bankOptions = React.useMemo(
    () =>
      banks.map((bank: any) => ({
        label: bank.name,
        value: bank.code
      })),
    [banks]
  );

  const selectedCurrencyId = React.useMemo(() => {
    if (!selectedCurrencyOption) return undefined;

    const selectedWallet = userWalletsData?.myWallet?.find((wallet) => wallet.id === selectedCurrencyOption.walletId);
    const selectedBalance = selectedWallet?.balances?.find(
      (balance) => balance.currency?.code === selectedCurrencyOption.currencyCode
    );

    return selectedBalance?.currency?.id;
  }, [selectedCurrencyOption, userWalletsData]);

  React.useEffect(() => {
    const code = identifier?.trim();
    if (selectedType === 'kpay_user' && /^\d{10}$/.test(code || '')) {
      const t = setTimeout(() => {
        verifyWalletCode({ variables: { walletCode: code } });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [selectedType, identifier, verifyWalletCode]);

  React.useEffect(() => {
    if (selectedType === 'kpay_user') {
      form.setValue('providerName', BENEFICIARY_TYPE_ENUM.WALLET_CODE);
    } else if (selectedType === 'airtime') {
      form.setValue('providerName', BENEFICIARY_TYPE_ENUM.AIRTIME);
    } else if (selectedType === 'bank_transfer') {
      form.setValue('providerName', '');
    }
  }, [selectedType, form]);

  React.useEffect(() => {
    const user = verifiedUserData?.getUserByWalletCode?.user;
    if (selectedType === 'kpay_user' && user) {
      const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
      const currentName = form.getValues('name');
      if (!currentName) {
        form.setValue('name', fullName);
      }
    }
  }, [verifiedUserData, selectedType]);

  React.useEffect(() => {
    if (selectedType !== 'bank_transfer') {
      setResolvedBankAccountName('');
      setResolvingBankAccount(false);
      return;
    }

    if (!selectedBankCode || !/^\d{10}$/.test(identifier || '')) {
      setResolvedBankAccountName('');
      return;
    }

    const timer = setTimeout(async () => {
      setResolvingBankAccount(true);
      try {
        const details = await resolveBankAccount(identifier, selectedBankCode);
        if (details?.accountName) {
          setResolvedBankAccountName(details.accountName);
          form.clearErrors('identifier');
          if (!form.getValues('name')) {
            form.setValue('name', details.accountName, { shouldValidate: true });
          }
        } else {
          setResolvedBankAccountName('');
          form.setError('identifier', {
            type: 'manual',
            message: 'Invalid account number'
          });
        }
      } catch {
        setResolvedBankAccountName('');
        form.setError('identifier', {
          type: 'manual',
          message: 'Error resolving account'
        });
      } finally {
        setResolvingBankAccount(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedType, selectedBankCode, identifier, resolveBankAccount, form]);

  const handleSubmit = async (values: FormValues) => {
    if (values.type === 'bank_transfer' && !resolvedBankAccountName) {
      form.setError('identifier', {
        type: 'manual',
        message: 'Please verify account number'
      });
      return;
    }

    await createBeneficiary({
      variables: {
        name: values.name,
        number: values.identifier,
        type: typeToGraphQLEnum[values.type],
        providerName: values.providerName || undefined,
        currencyId: selectedCurrencyId
      }
    });
  };

  const handleResultAction = () => {
    if (mutationResult?.status === 'success') {
      onSuccess?.();
      onClose?.();
    } else {
      setStep('form');
      setMutationResult(null);
    }
  };

  
  const getIdentifierLabel = () => {
    switch (selectedType) {
      case 'bank_transfer':
        return 'Account Number';
      case 'kpay_user':
        return 'KPay Account';
      case 'mobile_money':
      case 'airtime':
        return 'Phone Number';
      default:
        return 'Identifier';
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (selectedType) {
      case 'bank_transfer':
        return 'Enter account number';
      case 'kpay_user':
        return 'Enter 10-digit KPay account';
      case 'mobile_money':
      case 'airtime':
        return 'Enter phone number';
      default:
        return 'Enter details';
    }
  };

  const getIdentifierDescription = () => {
    switch (selectedType) {
      case 'bank_transfer':
        return resolvingBankAccount
          ? 'Verifying account number...'
          : resolvedBankAccountName || "Enter the recipient's 10-digit bank account number.";
      case 'kpay_user':
        return verifyingUser
          ? 'Verifying KPay user...'
          : verifiedUserData?.getUserByWalletCode?.user
            ? `${verifiedUserData.getUserByWalletCode.user.firstName} ${verifiedUserData.getUserByWalletCode.user.lastName}`
            : 'Enter the recipient’s 10-digit KPay account.';
      case 'mobile_money':
      case 'airtime':
        return "Enter the recipient's mobile phone number.";
      default:
        return '';
    }
  };

  if (step === 'result' && mutationResult) {
    return (
      <div className="p-6 max-w-md mx-auto bg-background rounded-lg shadow-sm">
        <ErrorAndSuccessFallback
          status={mutationResult.status}
          title={mutationResult.status === 'success' ? 'Beneficiary Added' : 'Failed to Add Beneficiary'}
          body={mutationResult.message}
          onAction={handleResultAction}
          buttonText={mutationResult.status === 'success' ? 'Done' : 'Try Again'}
        />
      </div>
    );
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiary Type</FormLabel>
                <FormControl>
                  <InputWithSearch
                    options={[
                      { label: 'Bank Transfer', value: 'bank_transfer' },
                      { label: 'KPay User', value: 'kpay_user' },
                      { label: 'Mobile Money', value: 'mobile_money' },
                      { label: 'Airtime', value: 'airtime' }
                    ]}
                    value={field.value || ''}
                    onChange={(v) => field.onChange(v ? (v as BeneficiaryType) : undefined)}
                    placeholder="Select a type"
                    searchPlaceholder="Search types..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiary Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter beneficiary name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedType === 'bank_transfer' && (
            <FormField
              control={form.control}
              name="providerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Bank</FormLabel>
                  <FormControl>
                    {banksLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <InputWithSearch
                        options={bankOptions}
                        value={field.value || ''}
                        onChange={(v) => field.onChange(v || '')}
                        placeholder="Select a bank"
                        searchPlaceholder="Search banks..."
                        emptyMessage="No bank found."
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="space-y-2">
            <UsersCurrencyDropdown
              label="Select currency"
              value={selectedCurrencyOption}
              onChange={setSelectedCurrencyOption}
              dedupeByCurrency
            />
            {!selectedCurrencyId ? <p className="text-[0.8rem] font-medium text-destructive">Please select a currency</p> : null}
          </div>

          {/* Conditional Identifier Field */}
          {selectedType && (
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getIdentifierLabel()}</FormLabel>
                  <FormControl>
                    {selectedType === 'mobile_money' || selectedType === 'airtime' ? (
                      <PrimaryPhoneNumberInput
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        showValidation={false}
                      />
                    ) : (
                      <Input
                        type={selectedType === 'kpay_user' || selectedType === 'bank_transfer' ? 'tel' : 'text'}
                        maxLength={selectedType === 'bank_transfer' ? 10 : undefined}
                        placeholder={getIdentifierPlaceholder()}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            selectedType === 'kpay_user' || selectedType === 'bank_transfer'
                              ? e.target.value.replace(/\D/g, '').slice(0, 10)
                              : e.target.value
                          )
                        }
                      />
                    )}
                  </FormControl>
                  <FormDescription>{getIdentifierDescription()}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {selectedType === 'mobile_money' && (
            <FormField
              control={form.control}
              name="providerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Money Provider</FormLabel>
                  <FormControl>
                    <InputWithSearch
                      options={Object.entries(PROVIDER_LABELS).map(([key, label]) => ({
                        label,
                        value: key
                      }))}
                      value={field.value || ''}
                      onChange={(v) => field.onChange(v || '')}
                      placeholder="Select a provider"
                      searchPlaceholder="Search providers..."
                    />
                  </FormControl>
                  <FormDescription>Select the mobile money provider for this beneficiary.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {(selectedType === 'kpay_user' || selectedType === 'airtime') && (
            <FormField
              control={form.control}
              name="providerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-muted" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full" disabled={loading || !selectedCurrencyId}>
            {loading ? 'Adding Beneficiary...' : <>Add Beneficiary</>}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateBeneficiariesActions;
