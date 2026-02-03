import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, NumberInput } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBillPaymentSchema, billPaymentDefaultValues, BillPaymentFormData } from '@/schema/bill-payment';
import { FormProgress } from '@/components/common/forms/form-progress';
import { BillPaymentService, billPaymentServices } from '@/data/bill-payment-services';
import { PhoneCountrySelector } from '@/components/common';
import { countries } from '@/utils/constants';
import { getBrandsFor } from '@/data/bill-payment-brands';
import DefaultModal from '@/components/sub-modules/popups/modal';
import { BillPaymentConfirmation } from './bill-payment-confirmation';
import { useBillPayment } from '@/hooks/api/use-bill-payment';
import { BillPaymentInput } from '@repo/types';

const ISO_TO_SCHEMA_COUNTRY: Record<string, BillPaymentFormData['country']> = {
  NG: 'nigeria',
  GH: 'ghana',
  KE: 'kenya'
} as const;

const SCHEMA_TO_ISO_COUNTRY: Record<BillPaymentFormData['country'], string> = {
  nigeria: 'NG',
  ghana: 'GH',
  kenya: 'KE'
} as const;

interface BillsPaymentFormProps {
  selectedService?: BillPaymentService | null;
  countryCode?: string;
  selectedNetwork?: string | null;
}

const BillsPaymentForm = ({ selectedService, countryCode, selectedNetwork }: BillsPaymentFormProps) => {
  const { t } = useTranslation();
  const [selectedPhoneCountry, setSelectedPhoneCountry] = useState(countries[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createBillPayment, creating } = useBillPayment();

  const formSchema = createBillPaymentSchema(t);

  const form = useForm<BillPaymentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: billPaymentDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange'
  });

  useEffect(() => {
    if (selectedService) {
      const serviceDefaults = getServiceDefaults(selectedService.id, countryCode);
      form.reset(serviceDefaults, {
        keepErrors: false,
        keepDirty: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false
      });

      if (countryCode) {
        const schemaCountry = ISO_TO_SCHEMA_COUNTRY[countryCode];
        if (schemaCountry) {
          form.setValue('country', schemaCountry);
        }
      }

      if (selectedNetwork) {
        form.setValue('network', selectedNetwork);
      }
    }
  }, [selectedService, countryCode, selectedNetwork, form]);

  const getServiceDefaults = (serviceId: string, isoCountryCode?: string): BillPaymentFormData => {
    const baseDefaults = { ...billPaymentDefaultValues };
    const brandOptions = getBrandsFor(isoCountryCode, serviceId);
    const firstBrandNetwork = brandOptions?.[0]?.networkValue;
    const resolvedCountry: BillPaymentFormData['country'] =
      (isoCountryCode ? ISO_TO_SCHEMA_COUNTRY[isoCountryCode] : undefined) ?? baseDefaults.country;

    switch (serviceId) {
      case 'airtime':
        return {
          ...baseDefaults,
          service: serviceId,
          country: resolvedCountry,
          network: firstBrandNetwork || 'mtn'
        };
      case 'data':
        return {
          ...baseDefaults,
          service: serviceId,
          country: resolvedCountry,
          network: firstBrandNetwork || 'mtn'
        };
      case 'electricity':
        return {
          ...baseDefaults,
          service: serviceId,
          country: resolvedCountry,
          network: firstBrandNetwork || 'sbee'
        };
      case 'cabletv':
        return {
          ...baseDefaults,
          service: serviceId,
          country: resolvedCountry,
          network: firstBrandNetwork || 'sbee'
        };
      case 'betting':
        return {
          ...baseDefaults,
          service: serviceId,
          country: resolvedCountry,
          network: firstBrandNetwork || 'bet9ja'
        };
      case 'giftcard':
        return {
          ...baseDefaults,
          service: serviceId,
          country: resolvedCountry
        };
      default:
        return {
          ...baseDefaults,
          service: serviceId,
          country: resolvedCountry
        };
    }
  };

  const getNetworkOptions = (serviceId: string, country?: string) => {
    const brandOptions = getBrandsFor(country, serviceId);
    if (brandOptions.length > 0) {
      return brandOptions.map((b) => ({ value: b.networkValue || b.id, label: b.name }));
    }

    switch (serviceId) {
      case 'airtime':
      case 'data':
        return [
          { value: 'mtn', label: t('billPayment.networks.mtn') },
          { value: 'airtel', label: t('billPayment.networks.airtel') },
          { value: 'glo', label: t('billPayment.networks.glo') },
          { value: '9mobile', label: t('billPayment.networks.9mobile') }
        ];
      case 'electricity':
      case 'cabletv':
        return [
          { value: 'sbee', label: t('billPayment.networks.sbee') },
          { value: 'ekedc', label: t('billPayment.networks.ekedc') },
          { value: 'ikedc', label: t('billPayment.networks.ikedc') }
        ];
      case 'betting':
        return [{ value: 'bet9ja', label: t('billPayment.networks.bet9ja') }];
      default:
        return [
          { value: 'sbee', label: t('billPayment.networks.sbee') },
          { value: 'mtn', label: t('billPayment.networks.mtn') },
          { value: 'airtel', label: t('billPayment.networks.airtel') }
        ];
    }
  };

  const getAccountLabel = (serviceId: string) => {
    switch (serviceId) {
      case 'airtime':
      case 'data':
        return t('billPayment.form.phoneNumber');
      case 'electricity':
        return t('billPayment.form.meterNumber');
      case 'cabletv':
        return t('billPayment.form.smartCardNumber');
      case 'betting':
        return t('billPayment.form.betAccountId');
      case 'giftcard':
        return t('billPayment.form.recipientEmail');
      default:
        return t('billPayment.form.accountNumber');
    }
  };

  const requiresPhoneInput = (serviceId: string) => {
    return serviceId === 'airtime' || serviceId === 'data';
  };

  const getAccountPlaceholder = (serviceId: string) => {
    switch (serviceId) {
      case 'airtime':
      case 'data':
        return t('placeholders.enterPhoneNumber');
      case 'electricity':
        return t('placeholders.enterMeterNumber');
      case 'cabletv':
        return t('placeholders.enterSmartCardNumber');
      case 'betting':
        return t('placeholders.enterBetAccountId');
      case 'giftcard':
        return t('placeholders.enterRecipientEmail');
      default:
        return t('placeholders.enterAccountNumber');
    }
  };

  const onSubmit = (data: BillPaymentFormData) => {
    console.log('Form submitted:', data);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const formData = form.getValues();

      const billPaymentInput: BillPaymentInput = {
        service: formData.service,
        network: formData.network,
        amount: parseFloat(formData.amount.replace(/,/g, '')),
        currency: formData.currency,
        account: formData.account,

        country: countryCode ?? SCHEMA_TO_ISO_COUNTRY[formData.country] ?? formData.country,
        paymentMethod: formData.paymentMethod,
        walletId: 'default-wallet',
        description: `${selectedService?.labelKey} payment for ${formData.account}`
      };

      await createBillPayment({
        variables: {
          input: billPaymentInput
        }
      });

      setIsModalOpen(false);
      form.reset(getServiceDefaults(selectedService?.id || '', countryCode));
      toast.success(t('billPayment.paymentSuccessful'));
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(t('billPayment.paymentFailed'));
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const watchedValues = form.watch();

  const isFormValid = useMemo(() => {
    const { service, currency, amount, account, network } = watchedValues;

    const hasRequiredFields = service && currency && amount && account;

    const hasValidNetwork = selectedService?.id === 'giftcard' || network;

    const isValidAmount =
      amount && !isNaN(parseFloat(amount.replace(/,/g, ''))) && parseFloat(amount.replace(/,/g, '')) >= 1;

    let isValidAccount = true;
    if (selectedService?.id === 'giftcard') {
      isValidAccount = !!(account && isValidEmail(account));
    } else {
      isValidAccount = !!(account && account.trim().length >= 3);
    }

    return hasRequiredFields && hasValidNetwork && isValidAmount && isValidAccount && !form.formState.isSubmitting;
  }, [watchedValues, selectedService?.id, form.formState.isSubmitting]);

  if (!selectedService) {
    return null;
  }

  const getServiceName = (service: BillPaymentService) => {
    return t(service.labelKey);
  };

  return (
    <>
      <Card className="shadow-lg w-full md:w-[480px] py-6 animate-in slide-in-from-right duration-500">
        <CardContent>
          {selectedService && (
            <div className="mb-6 p-3 rounded-lg" style={{ backgroundColor: selectedService.bgColor }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 flex items-center justify-center rounded-full"
                  style={{ backgroundColor: selectedService.color + '20' }}
                >
                  <selectedService.icon className="w-4 h-4" style={{ color: selectedService.color }} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{getServiceName(selectedService)}</h3>
                  <p className="text-sm text-gray-600">
                    {t(`billPayment.services.${selectedService.id}Description`) || getServiceName(selectedService)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <FormProgress steps={2} currentStep={1} title={t('billPayment.form.title')} />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-black">{t('billPayment.form.service')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('billPayment.form.selectService')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billPaymentServices.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {getServiceName(service)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedService.id !== 'giftcard' && (
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="!text-black">{t('billPayment.form.network')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('billPayment.form.selectNetwork')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {getNetworkOptions(selectedService.id, countryCode).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel className="!text-black">{t('billPayment.form.currency')}</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue>
                              {field.value && (
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">
                                      {field.value === 'USD' ? '$' : field.value === 'EUR' ? '€' : '₦'}
                                    </span>
                                  </div>
                                  <span>{field.value}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">
                              <div className="flex items-center gap-2">
                                <span>USD</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="EUR">
                              <div className="flex items-center gap-2">
                                <span>EUR</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="NGN">
                              <div className="flex items-center gap-2">
                                <span>NGN</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => {
                  const selectedCurrency = (form.watch('currency') || '').toUpperCase() as 'USD' | 'NGN' | 'EUR';

                  return (
                    <FormItem>
                      <FormLabel className="!text-black">{t('billPayment.form.amount')}</FormLabel>
                      <FormControl>
                        <NumberInput
                          className="font-mono"
                          currency={selectedCurrency}
                          value={Number(field.value?.toString().replace(/,/g, '') || 0)}
                          onChange={(value) => {
                            field.onChange(value.toLocaleString());
                          }}
                          placeholder={t('placeholders.enterAmount')}
                        />
                      </FormControl>
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
                    <FormLabel className="!text-black">{getAccountLabel(selectedService.id)}</FormLabel>
                    {requiresPhoneInput(selectedService.id) ? (
                      <div className="flex items-center relative">
                        <div className="absolute flex items-center z-10">
                          <PhoneCountrySelector
                            value={selectedPhoneCountry.code}
                            onCountryChange={(country) => {
                              setSelectedPhoneCountry(country);
                            }}
                          />
                          <span className="text-sm text-[#6C727F] ml-1">{selectedPhoneCountry.prefix}</span>
                        </div>
                        <div className="flex-1">
                          <FormControl>
                            <Input
                              className="pl-24 !rounded-0 font-mono"
                              type="tel"
                              placeholder={getAccountPlaceholder(selectedService.id)}
                              {...field}
                            />
                          </FormControl>
                        </div>
                      </div>
                    ) : (
                      <FormControl>
                        <Input
                          {...field}
                          type={selectedService.id === 'giftcard' ? 'email' : 'text'}
                          className={`${
                            selectedService.id === 'giftcard'
                              ? field.value && !isValidEmail(field.value)
                                ? 'border-red-500'
                                : ''
                              : 'font-mono'
                          }`}
                          placeholder={getAccountPlaceholder(selectedService.id)}
                          autoComplete={selectedService.id === 'giftcard' ? 'email' : 'off'}
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                    {selectedService.id === 'giftcard' && field.value && !isValidEmail(field.value) && (
                      <p className="text-sm text-red-500 mt-1">{t('validation.emailInvalid')}</p>
                    )}
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!isFormValid || creating}
                className={`w-full py-6 text-base font-medium transition-all duration-200 ${
                  isFormValid && !creating
                    ? 'bg-primary hover:bg-primary/90 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {form.formState.isSubmitting || creating ? (
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

      <DefaultModal open={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md" trigger={<></>}>
        <div className="p-4">
          <BillPaymentConfirmation
            amount={form.watch('amount') || '0'}
            currency={form.watch('currency') || 'USD'}
            destination={form.watch('account') || ''}
            serviceName={selectedService ? getServiceName(selectedService) : ''}
            onFormSubmit={handleFormSubmit}
            isLoading={creating}
          />
        </div>
      </DefaultModal>
    </>
  );
};

export default BillsPaymentForm;
