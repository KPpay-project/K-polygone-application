import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ConfirmTransaction } from '@/components/ui';
import type { TransactionDetail } from '@/components/ui/confirm-transaction/confirm-transaction';
import { getCurrencyForCountry } from '@/utils/currency-mapping';

export default function AirtimeReviewScreen() {
  const params = useLocalSearchParams();

  const { country, network, phoneNumber, amount } = params;

  const currency = getCurrencyForCountry(
    Array.isArray(country) ? country[0] : country || 'KE'
  );

  const handleContinue = async () => {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Navigate to PIN entry screen with airtime data
    router.push({
      pathname: '/airtime-pin',
      params: {
        country,
        network,
        phoneNumber,
        amount,
        currency,
      },
    });
  };

  const transactionDetails: TransactionDetail[] = [
    {
      label: 'Phone Number',
      value: Array.isArray(phoneNumber) ? phoneNumber[0] : phoneNumber || '',
    },
    {
      label: 'Amount',
      value: `${currency} ${Array.isArray(amount) ? amount[0] : amount}`,
    },
    {
      label: 'Network',
      value: Array.isArray(network) ? network[0] : network || '',
    },
  ];

  return (
    <ConfirmTransaction
      title="Review your Transaction"
      subtitle="Airtime Purchase"
      amount={Array.isArray(amount) ? amount[0] : amount || '0'}
      currency={currency}
      details={transactionDetails}
      onContinue={handleContinue}
      continueButtonText="Continue"
    />
  );
}
