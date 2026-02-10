import React, { useState } from 'react';
import { useDialog } from '@/hooks/use-dialog';
import { FormProgress } from '@/components/common/forms/form-progress';
import { Typography } from '@/components/sub-modules/typography/typography';
import { CloseCircle } from 'iconsax-reactjs';
import { IconArrowRight, Button, Input } from 'k-polygon-assets';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Check, CreditCard, Building2, Wallet } from 'lucide-react';

import { Label } from '@/components/ui/label';

type PaymentMethod = 'card' | 'bank' | 'kpay';
type Step = 'confirmation' | 'payment-method' | 'card-details' | 'bank-details';

interface PaymentOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const PaymentOption = ({ icon, title, description, isSelected, onClick }: PaymentOptionProps) => (
  <div
    onClick={onClick}
    className={cn(
      'p-4 border rounded-xl cursor-pointer transition-all relative',
      isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
    )}
  >
    <div className="flex items-start space-x-3">
      <div
        className={cn(
          'w-12 h-12 rounded-full border-2 flex items-center justify-center',
          isSelected ? 'bg-primary/10 border-primary' : 'bg-gray-100 border-gray-300'
        )}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: cn('w-6 h-6', isSelected ? 'text-primary' : 'text-gray-500')
        })}
      </div>
      <div className="flex-1">
        <Typography className="font-semibold text-gray-900 mb-1">{title}</Typography>
        <Typography className="text-sm text-gray-500 leading-relaxed">{description}</Typography>
      </div>
      <div
        className={cn(
          'absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center',
          isSelected ? 'bg-primary' : 'bg-gray-300'
        )}
      >
        <Check className="w-3 h-3 text-white" />
      </div>
    </div>
  </div>
);

interface BillPaymentConfirmationProps {
  amount: string;
  currency: string;
  destination: string;
  serviceName: string;
  onFormSubmit?: (paymentMethod: PaymentMethod) => void;
  isLoading?: boolean;
}

export const BillPaymentConfirmation = ({
  amount,
  currency,
  destination,
  serviceName,
  onFormSubmit,
  isLoading = false
}: BillPaymentConfirmationProps) => {
  const { t } = useTranslation();
  const { close } = useDialog();
  const [step, setStep] = useState<Step>('confirmation');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const [cardDetails, setCardDetails] = useState({
    holderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [bankDetails, setBankDetails] = useState({
    bankCode: '',
    accountNumber: ''
  });

  const banks = [
    { code: 'GTB', name: 'Guaranty Trust Bank' },
    { code: 'FBN', name: 'First Bank of Nigeria' },
    { code: 'UBA', name: 'United Bank for Africa' },
    { code: 'ACCESS', name: 'Access Bank' },
    { code: 'ZENITH', name: 'Zenith Bank' },
    { code: 'STANBIC', name: 'Stanbic IBTC Bank' },
    { code: 'STERLING', name: 'Sterling Bank' },
    { code: 'UNION', name: 'Union Bank' },
    { code: 'WEMA', name: 'Wema Bank' },
    { code: 'FCMB', name: 'First City Monument Bank' }
  ];

  const paymentOptions = [
    {
      id: 'card' as PaymentMethod,
      icon: <CreditCard />,
      title: t('billPayment.payWithCard') || 'Pay with Card',
      description: t('billPayment.cardDescription') || 'Use your debit or credit card to complete payment'
    },
    {
      id: 'bank' as PaymentMethod,
      icon: <Building2 />,
      title: t('billPayment.payWithBank') || 'Bank Transfer',
      description: t('billPayment.bankDescription') || 'Pay directly from your bank account'
    },
    {
      id: 'kpay' as PaymentMethod,
      icon: <Wallet />,
      title: t('billPayment.payWithKpay') || 'KPay Wallet',
      description: t('billPayment.kpayDescription') || 'Pay using your KPay wallet balance'
    }
  ];

  const handleProceed = () => {
    setStep('payment-method');
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    if (method === 'card') {
      setStep('card-details');
    } else if (method === 'bank') {
      setStep('bank-details');
    }
  };

  const handlePaymentSubmit = () => {
    if (selectedPaymentMethod) {
      onFormSubmit?.(selectedPaymentMethod);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardDetails({ ...cardDetails, expiryDate: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const isCardFormValid =
    cardDetails.holderName.length > 0 &&
    cardDetails.cardNumber.replace(/\s/g, '').length === 16 &&
    cardDetails.expiryDate.length === 5 &&
    cardDetails.cvv.length >= 3;

  const isBankFormValid = bankDetails.bankCode.length > 0 && bankDetails.accountNumber.length === 10;

  if (step === 'card-details') {
    return (
      <div className="relative">
        <div className="flex justify-center mb-6">
          <FormProgress steps={4} currentStep={4} title={t('billPayment.enterCardDetails') || 'Enter Card Details'} />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">{t('billPayment.cardDetails') || 'Card Details'}</h1>
          <div className="cursor-pointer">
            <CloseCircle onClick={close} size={24} className="text-gray-500" />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {t('dashboard.card.cardHolderName') || 'Card Holder Name'}
            </Label>
            <Input
              placeholder={t('placeholders.fullName') || 'Full Name'}
              value={cardDetails.holderName}
              onChange={(e) => setCardDetails({ ...cardDetails, holderName: e.target.value })}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {t('dashboard.card.cardNumber') || 'Card Number'}
            </Label>
            <Input
              placeholder="0000 0000 0000 0000"
              value={cardDetails.cardNumber}
              onChange={handleCardNumberChange}
              className="w-full font-mono"
              maxLength={19}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                {t('dashboard.card.expiryDate') || 'Expiry Date'}
              </Label>
              <Input
                placeholder="MM/YY"
                value={cardDetails.expiryDate}
                onChange={handleExpiryChange}
                className="w-full"
                maxLength={5}
              />
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">{t('dashboard.card.cvv') || 'CVV'}</Label>
              <Input
                placeholder="123"
                value={cardDetails.cvv}
                onChange={handleCvvChange}
                className="w-full"
                maxLength={4}
                type="password"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('payment-method')}>
            {t('common.back') || 'Back'}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            icon={isLoading ? undefined : <IconArrowRight />}
            disabled={isLoading || !isCardFormValid}
            onClick={handlePaymentSubmit}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('billPayment.form.processing')}
              </>
            ) : (
              t('billPayment.payNow') || 'Pay Now'
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'bank-details') {
    return (
      <div className="relative">
        <div className="flex justify-center mb-6">
          <FormProgress steps={4} currentStep={4} title={t('billPayment.enterBankDetails') || 'Enter Bank Details'} />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">{t('billPayment.bankDetails') || 'Bank Details'}</h1>
          <div className="cursor-pointer">
            <CloseCircle onClick={close} size={24} className="text-gray-500" />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {t('transfer.selectBank') || 'Select Bank'}
            </Label>
            <select
              value={bankDetails.bankCode}
              onChange={(e) => setBankDetails({ ...bankDetails, bankCode: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('transfer.selectBank') || 'Select Bank'}</option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              {t('transfer.accountNumber') || 'Account Number'}
            </Label>
            <Input
              placeholder={t('transfer.enterBankAccount') || 'Enter 10-digit account number'}
              value={bankDetails.accountNumber}
              onChange={(e) =>
                setBankDetails({ ...bankDetails, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })
              }
              className="w-full"
              maxLength={10}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('payment-method')}>
            {t('common.back') || 'Back'}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            icon={isLoading ? undefined : <IconArrowRight />}
            disabled={isLoading || !isBankFormValid}
            onClick={handlePaymentSubmit}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('billPayment.form.processing')}
              </>
            ) : (
              t('billPayment.payNow') || 'Pay Now'
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'payment-method') {
    return (
      <div className="relative">
        <div className="flex justify-center mb-6">
          <FormProgress
            steps={4}
            currentStep={3}
            title={t('billPayment.selectPaymentMethod') || 'Select Payment Method'}
          />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            {t('billPayment.howWouldYouPay') || 'How would you like to pay?'}
          </h1>
          <div className="cursor-pointer">
            <CloseCircle onClick={close} size={24} className="text-gray-500" />
          </div>
        </div>

        <div className="space-y-3 mb-8">
          {paymentOptions.map((option) => (
            <PaymentOption
              key={option.id}
              icon={option.icon}
              title={option.title}
              description={option.description}
              isSelected={selectedPaymentMethod === option.id}
              onClick={() => handlePaymentMethodSelect(option.id)}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => setStep('confirmation')}>
            {t('common.back') || 'Back'}
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            icon={isLoading ? undefined : <IconArrowRight />}
            disabled={isLoading || !selectedPaymentMethod || selectedPaymentMethod !== 'kpay'}
            onClick={handlePaymentSubmit}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {t('billPayment.form.processing')}
              </>
            ) : (
              t('billPayment.payNow') || 'Pay Now'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-center mb-6">
        <FormProgress steps={4} currentStep={2} title={t('billPayment.confirmYourRequest')} />
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">{t('billPayment.confirmPayment')}</h1>
        <div className="cursor-pointer">
          <CloseCircle onClick={close} size={24} className="text-gray-500" />
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-5 rounded-lg mb-8">
        <div className="flex w-full items-center justify-between mb-4">
          <Typography className="text-sm text-gray-600">{t('billPayment.amount')}</Typography>
          <Typography className="text-sm font-medium">
            {amount} {currency}
          </Typography>
        </div>
        <div className="flex w-full items-center justify-between mb-4">
          <Typography className="text-sm text-gray-600">{t('billPayment.fee')}</Typography>
          <Typography className="text-sm font-medium">1 {currency}</Typography>
        </div>
        <div className="flex w-full items-center justify-between mb-4">
          <Typography className="text-sm text-gray-600">{t('billPayment.destination')}</Typography>
          <Typography className="text-sm font-medium">{destination}</Typography>
        </div>
        <div className="flex w-full items-center justify-between mb-4">
          <Typography className="text-sm text-gray-600">{t('billPayment.service')}</Typography>
          <Typography className="text-sm font-medium">{serviceName}</Typography>
        </div>
        <div className="flex w-full items-center justify-between">
          <Typography className="text-sm font-semibold">{t('billPayment.total')}</Typography>
          <Typography className="text-sm font-semibold">
            {parseInt(amount) + 1} {currency}
          </Typography>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-red-500 hover:bg-red-600 text-white"
        icon={<IconArrowRight />}
        onClick={handleProceed}
      >
        {t('billPayment.proceed') || 'Proceed'}
      </Button>
    </div>
  );
};
