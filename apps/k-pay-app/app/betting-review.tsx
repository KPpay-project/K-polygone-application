import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ConfirmTransaction } from '@/components/ui';
import type { TransactionDetail } from '@/components/ui/confirm-transaction/confirm-transaction';
import { getCurrencyForCountry } from '@/utils/currency-mapping';

export default function BettingReview() {
  const params = useLocalSearchParams();

  const { country, provider, customerId, amount } = params;

  const currency = getCurrencyForCountry(
    Array.isArray(country) ? country[0] : country || 'KE'
  );

  const handleContinue = async () => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to PIN entry screen with betting data
    router.push({
      pathname: '/betting-pin',
      params: {
        country,
        provider,
        customerId,
        amount,
        currency,
      },
    });
  };

  const transactionDetails: TransactionDetail[] = [
    {
      label: 'Customer ID',
      value: Array.isArray(customerId) ? customerId[0] : customerId || '',
    },
    {
      label: 'Amount',
      value: `${currency} ${Array.isArray(amount) ? amount[0] : amount}`,
    },
    {
      label: 'Betting Provider',
      value: Array.isArray(provider) ? provider[0] : provider || '',
    },
  ];

  return (
    <ConfirmTransaction
      title="Review your Transaction"
      subtitle="Betting Payment"
      amount={Array.isArray(amount) ? amount[0] : amount || '0'}
      currency={currency}
      details={transactionDetails}
      onContinue={handleContinue}
      continueButtonText="Continue"
    />
  );
}
