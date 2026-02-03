import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Button, Input } from 'k-polygon-assets';
import { Typography } from '@/components/sub-modules/typography/typography';
import { NumberInput, Currency } from '@/components/ui/input';
import UsersCurrencyDropdown from '@/components/currency-dropdown/users-currency-dropdown';
import Loading from '@/components/common/loading';
import { toast } from 'sonner';
import { useProfileStore } from '@/store/profile-store';
import { DEPOSIT_VIA_CARD, FLW_CARD_DEPOSIT_QUOTE, VALIDATE_CARD_PAYMENT } from '@/lib/graphql/mutations/transfer';

const cardFormSchema = z.object({
  amount: z.string().min(1),
  currencyCode: z.string().min(1),
  cardNumber: z.string().min(12),
  cvv: z.string().min(3),
  expiryMonth: z.string().min(1),
  expiryYear: z.string().min(2),
  pin: z.string().optional(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  customerName: z.string().optional(),
  saveCard: z.boolean().optional()
});

type CardFormData = z.infer<typeof cardFormSchema>;

interface Props {
  onSuccess?: () => void;
}

const CardDepositAction = ({ onSuccess }: Props) => {
  const { t } = useTranslation();
  const { profile } = useProfileStore();
  const walletId = profile?.wallets?.[0]?.id || '';
  const defaultCurrency = profile?.wallets?.[0]?.balances?.[0]?.currency?.code || 'USD';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CardFormData>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      amount: '',
      currencyCode: defaultCurrency,
      cardNumber: '',
      cvv: '',
      expiryMonth: '',
      expiryYear: '',
      pin: '',
      email: profile?.user?.email || ''
    }
  });

  const watchedAmount = watch('amount');
  const watchedCurrency = watch('currencyCode');

  const [step, setStep] = useState<'form' | 'otp' | 'avs' | 'success'>('form');
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');

  const [addressFields, setAddressFields] = useState({
    billingZip: '',
    billingCity: '',
    billingAddress: '',
    billingState: '',
    billingCountry: ''
  });

  const [getQuote, { data: quoteData, loading: quoteLoading }] = useLazyQuery(FLW_CARD_DEPOSIT_QUOTE);
  const [depositViaCard, { loading: depositing }] = useMutation(DEPOSIT_VIA_CARD);
  const [validateCardPayment, { loading: validating }] = useMutation(VALIDATE_CARD_PAYMENT);

  const quote = quoteData?.flutterwaveCardDepositQuote;

  useEffect(() => {
    if (!walletId) return;
    const amountNum = parseFloat((watchedAmount || '0').replace(/,/g, ''));
    if (!amountNum) return;
    const timer = setTimeout(() => {
      getQuote({
        variables: { input: { walletId, amount: amountNum, currencyCode: watchedCurrency || defaultCurrency } }
      })
        .then((res) => setQuoteId(res.data?.flutterwaveCardDepositQuote?.quoteId || null))
        .catch(() => undefined);
    }, 400);
    return () => clearTimeout(timer);
  }, [walletId, watchedAmount, watchedCurrency, defaultCurrency, getQuote]);

  const onSubmitForm = async (values: CardFormData) => {
    if (!walletId) {
      toast.error(t('transfer.invalidWallet') || 'Invalid wallet');
      return;
    }
    try {
      const amountNum = parseFloat(values.amount.replace(/,/g, ''));
      const resp = await depositViaCard({
        variables: {
          input: {
            walletId,
            amount: amountNum,
            currencyCode: values.currencyCode,
            email: values.email,
            cardNumber: values.cardNumber,
            cvv: values.cvv,
            expiryMonth: values.expiryMonth,
            expiryYear: values.expiryYear,
            pin: values.pin || undefined,
            phoneNumber: undefined,
            customerName: undefined,
            saveCard: !!values.saveCard,
            redirectUrl: window.location.origin + '/payment-complete',
            quoteId: quoteId || undefined,
            clientPlatform: 'web'
          }
        }
      });
      const result = resp.data?.depositViaCard;
      if (!result) return;
      if (result.success) {
        toast.success(result.message || t('transfer.success'));
        setStep('success');
        onSuccess?.();
        return;
      }
      if (result.requiresAuth) {
        setTransactionId(result.flutterwaveTransactionId || null);
        setAuthMode(result.authMode || null);
        if (result.authMode === 'redirect' && result.authUrl) {
          window.location.href = result.authUrl;
        } else if (result.authMode === 'otp') {
          setStep('otp');
        } else if (result.authMode === 'avs_noauth') {
          setStep('avs');
        } else {
          toast.message(result.message || 'Additional authentication required');
        }
      } else {
        toast.error(result.message || t('transfer.failed'));
      }
    } catch (e: any) {
      toast.error(e?.message || t('common.error'));
    }
  };

  const onValidateOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;
    try {
      const resp = await validateCardPayment({
        variables: { input: { flutterwaveTransactionId: transactionId, otp } }
      });
      const res = resp.data?.validateCardPayment;
      if (res?.success) {
        toast.success(res?.message || t('transfer.success'));
        setStep('success');
        onSuccess?.();
      } else {
        toast.error(res?.message || t('transfer.failed'));
      }
    } catch (e: any) {
      toast.error(e?.message || t('common.error'));
    }
  };

  const onValidateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;
    try {
      const resp = await validateCardPayment({
        variables: { input: { flutterwaveTransactionId: transactionId, ...addressFields } }
      });
      const res = resp.data?.validateCardPayment;
      if (res?.success) {
        toast.success(res?.message || t('transfer.success'));
        setStep('success');
        onSuccess?.();
      } else {
        toast.error(res?.message || t('transfer.failed'));
      }
    } catch (e: any) {
      toast.error(e?.message || t('common.error'));
    }
  };

  return (
    <div className="px-4 pb-6 space-y-6">
      <Loading isLoading={quoteLoading || depositing || validating} text={t('common.processing') || 'Processing...'} />

      {step === 'form' && (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div>
            <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.amount')}</Typography>
            <NumberInput
              placeholder={t('transfer.enterAmount')}
              value={parseFloat((watchedAmount || '0').replace(/,/g, '')) || 0}
              onChange={(v) => setValue('amount', v.toString())}
              currency={(watchedCurrency as Currency) || 'USD'}
              className="w-full"
            />
            {errors.amount && (
              <Typography className="text-red-500 text-xs mt-1">{errors.amount.message as string}</Typography>
            )}
          </div>

          <UsersCurrencyDropdown
            selectedCurrency={watchedCurrency || defaultCurrency}
            onCurrencyChange={(c) => setValue('currencyCode', c)}
          />

          {quote && (
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>{t('transfer.fee')}</span>
                <span>
                  {quote.feeAmount} {quote.currencyCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t('transfer.total')}</span>
                <span>
                  {quote.totalDebit} {quote.currencyCode}
                </span>
              </div>
            </div>
          )}

          <div>
            <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.cardNumber')}</Typography>
            <Input
              {...register('cardNumber')}
              placeholder={t('transfer.cardNumberPlaceholder') || '0000 0000 0000 0000'}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.cvv') || 'CVV'}</Typography>
              <Input
                {...register('cvv')}
                placeholder={t('transfer.cvvPlaceholder') || '123'}
                className="w-full"
                maxLength={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Typography className="text-sm font-medium text-gray-700 mb-2">MM</Typography>
                <Input {...register('expiryMonth')} placeholder="MM" className="w-full" />
              </div>
              <div>
                <Typography className="text-sm font-medium text-gray-700 mb-2">YY</Typography>
                <Input {...register('expiryYear')} placeholder="YY" className="w-full" />
              </div>
            </div>
          </div>

          <div>
            <Typography className="text-sm font-medium text-gray-700 mb-2">PIN</Typography>
            <Input
              type="password"
              {...register('pin')}
              placeholder={t('transfer.pinOptional') || 'PIN (Nigerian cards)'}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography className="text-sm font-medium text-gray-700 mb-2">{t('common.email') || 'Email'}</Typography>
              <Input type="email" {...register('email')} placeholder="you@example.com" className="w-full" />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" {...register('saveCard')} />
                <span className="text-sm text-gray-600">{t('transfer.saveCard') || 'Save card'}</span>
              </label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!quoteId}>
            {t('common.continue') || 'Continue'}
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={onValidateOtp} className="space-y-4">
          <Typography className="text-base font-medium">{t('transfer.enterOtp') || 'Enter OTP'}</Typography>
          <Input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t('transfer.otpPlaceholder') || 'Enter OTP'}
            className="w-full"
          />
          <Button type="submit" className="w-full">
            {t('common.confirm') || 'Confirm'}
          </Button>
        </form>
      )}

      {step === 'avs' && (
        <form onSubmit={onValidateAddress} className="space-y-4">
          <Typography className="text-base font-medium">{t('transfer.billingAddress') || 'Billing Address'}</Typography>
          <Input
            value={addressFields.billingAddress}
            onChange={(e) => setAddressFields((v) => ({ ...v, billingAddress: e.target.value }))}
            placeholder={t('transfer.address') || 'Address'}
            className="w-full"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={addressFields.billingCity}
              onChange={(e) => setAddressFields((v) => ({ ...v, billingCity: e.target.value }))}
              placeholder={t('transfer.city') || 'City'}
              className="w-full"
            />
            <Input
              value={addressFields.billingState}
              onChange={(e) => setAddressFields((v) => ({ ...v, billingState: e.target.value }))}
              placeholder={t('transfer.state') || 'State'}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={addressFields.billingCountry}
              onChange={(e) => setAddressFields((v) => ({ ...v, billingCountry: e.target.value }))}
              placeholder={t('transfer.country') || 'Country'}
              className="w-full"
            />
            <Input
              value={addressFields.billingZip}
              onChange={(e) => setAddressFields((v) => ({ ...v, billingZip: e.target.value }))}
              placeholder={t('transfer.zip') || 'ZIP'}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            {t('common.confirm') || 'Confirm'}
          </Button>
        </form>
      )}

      {step === 'success' && (
        <div className="space-y-2">
          <Typography className="text-lg">{t('transfer.paymentSuccessful') || 'Payment successful'}</Typography>
        </div>
      )}
    </div>
  );
};

export default CardDepositAction;
