import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ConfirmTransaction } from '@/components/ui';
import type { TransactionDetail } from '@/components/ui/confirm-transaction/confirm-transaction';

export default function ElectricityReviewScreen() {
  const params = useLocalSearchParams();

  const {
    country,
    provider,
    meterNumber,
    meterType,
    amount,
    currency = 'KES',
  } = params;

  const handleContinue = async () => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to PIN entry screen with electricity data
    router.push({
      pathname: '/electricity-pin',
      params: {
        country,
        provider,
        meterNumber,
        meterType,
        amount,
        currency,
      },
    });
  };

  const transactionDetails: TransactionDetail[] = [
    {
      label: 'Meter/Account Number',
      value: Array.isArray(meterNumber) ? meterNumber[0] : meterNumber || '',
    },
    {
      label: 'Amount',
      value: `${currency} ${Array.isArray(amount) ? amount[0] : amount}`,
    },
    {
      label: 'Electricity Provider',
      value: Array.isArray(provider) ? provider[0] : provider || '',
    },
    {
      label: 'Meter Type',
      value: Array.isArray(meterType) ? meterType[0] : meterType || '',
    },
  ];

  return (
    <ConfirmTransaction
      title="Electricity Bill Payment"
      amount={`${currency} ${Array.isArray(amount) ? amount[0] : amount}`}
      details={transactionDetails}
      onContinue={handleContinue}
      onBack={() => router.back()}
    />
  );
}
