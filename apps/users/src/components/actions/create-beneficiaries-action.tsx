'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { IconArrowRight } from 'k-polygon-assets';
import { FETCH_BENEFICIARIES_QUERY, CREATE_BENEFICIARY_MUTATION } from '@repo/api';
import ErrorAndSuccessFallback from '../sub-modules/modal-contents/error-success-fallback';
import { useMutation } from '@apollo/client';
import { BENEFICIARY_TYPE_ENUM } from '@/enums';
import { PROVIDER_LABELS } from '@/constant';
import { PrimaryPhoneNumberInput } from '@repo/ui';
import { InputWithSearch } from '@repo/ui';
import { CustomModal } from '@repo/ui';

const beneficiaryTypes = ['bank_transfer', 'kpay_user', 'mobile_money', 'airtime'] as const;

type BeneficiaryType = (typeof beneficiaryTypes)[number];

const typeToGraphQLEnum: Record<BeneficiaryType, BENEFICIARY_TYPE_ENUM> = {
  bank_transfer: BENEFICIARY_TYPE_ENUM.BANK,
  kpay_user: BENEFICIARY_TYPE_ENUM.WALLET_CODE,
  mobile_money: BENEFICIARY_TYPE_ENUM.MOBILE_MONEY,
  airtime: BENEFICIARY_TYPE_ENUM.AIRTIME
};

const formSchema = z.object({
  name: z.string().min(1, 'Beneficiary name is required'),
  type: z.enum(beneficiaryTypes, {
    message: 'Please select a beneficiary type'
  }),
  identifier: z.string().min(1, 'This field is required'),
  providerName: z.string().optional()
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

  React.useEffect(() => {
    if (selectedType === 'kpay_user') {
      form.setValue('providerName', BENEFICIARY_TYPE_ENUM.WALLET_CODE);
    } else if (selectedType === 'airtime') {
      form.setValue('providerName', BENEFICIARY_TYPE_ENUM.AIRTIME);
    } else if (selectedType === 'bank_transfer') {
      form.setValue('providerName', BENEFICIARY_TYPE_ENUM.BANK);
    }
  }, [selectedType, form]);

  const handleSubmit = async (values: FormValues) => {
    await createBeneficiary({
      variables: {
        name: values.name,
        number: values.identifier,
        type: typeToGraphQLEnum[values.type],
        providerName: values.providerName || undefined
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
        return 'Enter KPay account/username';
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
        return "Enter the recipient's bank account number.";
      case 'kpay_user':
        return "Enter the recipient's KPay username or account.";
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

          {/* Conditional Identifier Field */}
          {selectedType && (
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {selectedType === 'mobile_money' || selectedType === 'airtime' ? (
                      <PrimaryPhoneNumberInput
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        showValidation={false}
                      />
                    ) : (
                      <Input placeholder={getIdentifierPlaceholder()} {...field} />
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

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              'Adding Beneficiary...'
            ) : (
              <>
                <IconArrowRight className="mr-2 h-4 w-4" />
                Add Beneficiary
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateBeneficiariesActions;
