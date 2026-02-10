import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { CROSS_CURRENCY_TRANSFER } from '@/lib/graphql/mutations/exchange_mutation';
import { ReusableButton } from '../ui';
import { useMutation } from '@apollo/client';
import { normalizeApolloError, toFriendlyMessage } from '@/helpers/errors';
import { FormProgress } from '@/components/form/form-progress';
import {
  formatCurrencyByCode,
  formatCurrencyWithCommas,
} from '@/utils/numbers';
import { StatusScreen } from '../fallbacks/status-screen';

interface CrossCurrencyQuote {
  quoteId: string;
  exchangeRate: string;
  expiresAt: string | null;
  feeAmount: string;
  fromCurrencyCode: string;
  fromWalletId: string;
  netDebit: string;
  receiveAmount: string;
  sendAmount: string;
  toCurrencyCode: string;
  toWalletId: string;
}

interface Props {
  quote: CrossCurrencyQuote;
  onSuccess?: () => void;
}

export const DetailRow = ({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) => (
  <View
    className={`flex-row justify-between items-center ${emphasis ? 'mt-1' : ''}`}
  >
    <Text className={`text-[14px] text-[#555] ${emphasis ? 'font-bold' : ''}`}>
      {label}
    </Text>
    <Text className={`text-[14px] text-black ${emphasis ? 'font-bold' : ''}`}>
      {value}
    </Text>
  </View>
);

const CrossCurrencyPreviewAndConvertionAction: React.FC<Props> = ({
  quote,
  onSuccess,
}) => {
  const [crossCurrencyTransfer, { loading }] = useMutation(
    CROSS_CURRENCY_TRANSFER
  );

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleTransfer = async () => {
    setError(null);

    try {
      const result = await crossCurrencyTransfer({
        variables: {
          input: {
            amount: parseFloat(quote.sendAmount),
            fromWalletId: quote.fromWalletId,
            toWalletId: quote.toWalletId,
          },
        },
      });

      if (result.errors?.length) {
        const msg = result.errors[0].message;
        setError(msg);
        return;
      }

      setSuccess(true);
    } catch (err: any) {
      try {
        const friendly = toFriendlyMessage(normalizeApolloError(err));
        setError(friendly);
      } catch {
        const fallback =
          err?.message ||
          err?.graphQLErrors?.[0]?.message ||
          'Transfer failed. Please try again.';

        setError(fallback);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
  };

  const handleSuccessClose = () => {
    setSuccess(false);
    onSuccess?.();
  };

  return (
    <View className="w-full gap-3">
      {success && (
        <StatusScreen
          status="success"
          title="Exchange successful"
          message={`Successfully exchanged ${quote.sendAmount} ${quote.fromCurrencyCode} to ${quote.receiveAmount} ${quote.toCurrencyCode}`}
          buttonText="Done"
          onPress={handleSuccessClose}
        />
      )}

      {error && (
        <StatusScreen
          status="failed"
          title="Exchange Failed"
          message={error}
          buttonText="Try Again"
          onPress={handleRetry}
        />
      )}

      <View className="flex items-end mb-8">
        <FormProgress steps={2} currentStep={2} title="Confirm your request" />
      </View>

      <View className="gap-2">
        <DetailRow
          label="From:"
          value={`${quote.sendAmount} ${quote.fromCurrencyCode}`}
        />
        <DetailRow
          label="To:"
          value={`${formatCurrencyByCode(quote.receiveAmount, quote.toCurrencyCode)} `}
        />
        <DetailRow
          label="Exchange Rate:"
          value={formatCurrencyWithCommas(quote.exchangeRate)}
        />
        <DetailRow
          label="Fee:"
          value={`${quote.feeAmount} ${quote.fromCurrencyCode}`}
        />
        <DetailRow
          label="Net Debit:"
          value={`${quote.netDebit} ${quote.fromCurrencyCode}`}
          emphasis
        />
      </View>

      <ReusableButton
        className="w-full bg-primary text-white"
        onPress={handleTransfer}
        disabled={loading}
        text={loading ? 'Processing...' : 'Proceed'}
      />
    </View>
  );
};

export default CrossCurrencyPreviewAndConvertionAction;
