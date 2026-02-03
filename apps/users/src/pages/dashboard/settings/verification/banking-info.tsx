/* eslint-disable */
import { DashboardSubHeader } from '@/components/modules/header/dashboard-sub-header.tsx';
import { Button } from 'k-polygon-assets';
import { useNavigate } from '@tanstack/react-router';
import { useCreateBankInfo } from '@/hooks/api/use-create-bank-info';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from 'k-polygon-assets/components';
import { FormWrapper } from '@/components/common/forms/form-wrapper';
import { useForm } from 'react-hook-form';
import { CustomFormMessage } from '@/components/common/forms/form-message';
import { Loading } from '@/components/common';
import { z, ZodIssue } from 'zod';
import React from 'react';

import { CountrySelector } from '@/components/common';
import { useUnifiedBanks } from '@/hooks/bank/use-unified-banks';
import { createBankingInfoSchema } from '@/schema/banks';

const BankingInfoVerificationScreen = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = React.useState('');
  const { banks, loading: banksLoading, resolveBankAccount } = useUnifiedBanks('paystack');
  const bankOptions = React.useMemo(
    () =>
      banks.map((bank: { code: string; name: string }) => ({
        value: bank.code,
        label: bank.name
      })),
    [banks]
  );
  const [validationErrors, setValidationErrors] = React.useState<ZodIssue[] | null>(null);
  const [wrapperErrorMessage, setWrapperErrorMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const errorTopRef = React.useRef<HTMLDivElement | null>(null);
  const [createBankInfo] = useCreateBankInfo();

  const defaultSchema = createBankingInfoSchema();
  type FormValues = z.infer<typeof defaultSchema>;

  const formContext = useForm<FormValues>({
    defaultValues: {
      countryAccountHeld: '',
      primaryBank: '',
      accountNumber: ''
    }
  });

  const form = React.useMemo(
    () => ({
      ...formContext,
      control: formContext.control as any
    }),
    [formContext]
  );

  const [accountName, setAccountName] = React.useState<string>('');
  const [validatingAccount, setValidatingAccount] = React.useState(false);

  const scrollToTopOfForm = () => {
    try {
      if (errorTopRef.current) {
        errorTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {
      window.scrollTo(0, 0);
    }
  };

  async function onSubmit(values: FormValues) {
    try {
      setValidationErrors(null);
      setWrapperErrorMessage(null);

      const { primaryBank, accountNumber } = values;
      if (primaryBank && accountNumber) {
        const accountDetails = await resolveBankAccount(accountNumber, primaryBank);
        if (!accountDetails) {
          setValidationErrors([
            {
              path: ['accountNumber'],
              message: 'Invalid account number for the selected bank',
              code: 'custom'
            } as ZodIssue
          ]);
          scrollToTopOfForm();
          return;
        }
      }

      const currentSchema = createBankingInfoSchema();

      const validationResult = currentSchema.safeParse(values);
      if (!validationResult.success) {
        setValidationErrors(validationResult.error.issues);
        scrollToTopOfForm();
        return;
      }

      setIsSubmitting(true);

      const selectedBank = banks.find((bank) => bank.code === values.primaryBank);
      if (!selectedBank) {
        setWrapperErrorMessage('Selected bank not found');
        scrollToTopOfForm();
        return;
      }

      const [result] = await Promise.all([
        createBankInfo({
          variables: {
            input: {
              countryAccountHeld: values.countryAccountHeld,
              primaryBank: selectedBank.name,
              accountNumber: values.accountNumber
            }
          }
        })
      ]);

      const res = {
        ok: !result.errors && result.data?.createBankInfo,
        error: result.errors?.[0] || undefined
      };

      if (res.ok) {
        navigate({ to: '/settings/verifications/contact-details' });
      } else {
        setWrapperErrorMessage(res.error?.message || 'An error occurred');
        scrollToTopOfForm();
      }
    } catch (error: any) {
      setWrapperErrorMessage(error?.message || 'An unexpected error occurred');
      scrollToTopOfForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  const bannerShouldShow = !!(validationErrors || wrapperErrorMessage);
  React.useEffect(() => {
    if (bannerShouldShow) {
      scrollToTopOfForm();
    }
  }, [bannerShouldShow]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <DashboardSubHeader
        title={'Banking Information'}
        content={'Provide basic details about your bank'}
        steps={7}
        currentStep={2}
      />

      <div ref={errorTopRef} className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Loading />
          </div>
        )}
        {(validationErrors || wrapperErrorMessage) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700">
            {validationErrors && (
              <ul className="list-disc pl-4 mb-2">
                {validationErrors.map((error: ZodIssue, index: number) => (
                  <li key={index}>{`${error.path.join('.')}: ${error.message}`}</li>
                ))}
              </ul>
            )}
            {wrapperErrorMessage && <div className="mb-2">{wrapperErrorMessage}</div>}
          </div>
        )}
        <FormWrapper form={form} onSubmit={onSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="countryAccountHeld"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Account Held</FormLabel>
                    <FormControl>
                      <CountrySelector
                        value={field.value}
                        onValueChange={React.useCallback(
                          (_: any, country: { code: string }) => {
                            field.onChange(country.code);
                            setSelectedCountry(country.code);
                            form.setValue('primaryBank', '');
                            form.setValue('accountNumber', '');
                            setAccountName('');
                          },
                          [field, form, setSelectedCountry, setAccountName]
                        )}
                        placeholder="Select country"
                        disabled={isSubmitting}
                        hasFlag
                        showPrefix={false}
                        className="max-h-[300px] overflow-y-auto"
                      />
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.countryAccountHeld} scope="error" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="primaryBank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Bank</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('accountNumber', '');
                          setAccountName('');
                        }}
                        disabled={isSubmitting || !selectedCountry || banksLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={banksLoading ? 'Loading banks...' : 'Select bank'} />
                        </SelectTrigger>
                        <SelectContent>
                          {bankOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <CustomFormMessage message={form.formState.errors.primaryBank} scope="error" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Account Number</FormLabel>
                  <div className="space-y-2">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Enter your account number"
                          required
                          maxLength={10}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            if (value.length <= 10) {
                              field.onChange(value);
                            }
                          }}
                          onKeyUp={async (e) => {
                            const value = e.currentTarget.value;
                            const bankCode = form.getValues('primaryBank');

                            if (value.length === 10 && bankCode) {
                              try {
                                setValidatingAccount(true);
                                const accountDetails = await resolveBankAccount(value, bankCode);
                                if (accountDetails) {
                                  setAccountName(accountDetails.accountName);
                                  form.clearErrors('accountNumber');
                                } else {
                                  setAccountName('');
                                  form.setError('accountNumber', {
                                    type: 'manual',
                                    message: 'Invalid account number'
                                  });
                                }
                              } catch {
                                setAccountName('');
                                form.setError('accountNumber', {
                                  type: 'manual',
                                  message: 'Error validating account'
                                });
                              } finally {
                                setValidatingAccount(false);
                              }
                            } else {
                              setAccountName('');
                            }
                          }}
                          disabled={!form.getValues('primaryBank') || isSubmitting}
                          className={accountName ? 'border-green-500 focus:border-green-500' : ''}
                        />
                        {validatingAccount && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4">
                              <Loading />
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    {accountName && <div className="text-sm text-green-600 font-medium pl-1">{accountName}</div>}
                    <CustomFormMessage message={form.formState.errors.accountNumber} scope="error" />
                  </div>
                </FormItem>
              )}
            />

            <div className="mt-8">
              <Button type="submit" className="w-full lg:w-[300px] md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save and continue'}
              </Button>
            </div>
          </div>
        </FormWrapper>
      </div>
    </div>
  );
};

export default BankingInfoVerificationScreen;
