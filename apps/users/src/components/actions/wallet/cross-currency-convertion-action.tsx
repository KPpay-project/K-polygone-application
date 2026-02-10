import { useState } from 'react';
import { CROSS_CURRENCY_TRANSFER } from '@repo/api';
import { Button } from 'k-polygon-assets';
import { useMutation } from '@apollo/client';
import { FormProgress } from '@/components/common/forms/form-progress';
import { toast } from 'sonner';
import { handleGraphQLError } from '@/utils/error-handling';
import { normalizeApolloError, toFriendlyMessage } from '@/helpers/errors';
import { VerifyTransactionPin } from '@/components/actions/pin/verify-transaction-pin';
import { DialogHeader } from '@/components/ui/dialog';
import { Typography } from '@/components/sub-modules/typography/typography';

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

interface CrossCurrencyPreviewAndConvertionActionProps {
  quote: CrossCurrencyQuote;
  onSuccess?: () => void;
}

const CrossCurrencyPreviewAndConvertionAction = ({
  quote,
  onSuccess
}: CrossCurrencyPreviewAndConvertionActionProps) => {
  const [crossCurrencyTransfer, { loading }] = useMutation(CROSS_CURRENCY_TRANSFER);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  const handleTransfer = async (pin: string) => {
    setError(null);

    try {
      const result = await crossCurrencyTransfer({
        variables: {
          input: {
            amount: parseFloat(quote.sendAmount),
            fromWalletId: quote.fromWalletId,
            toWalletId: quote.toWalletId,
            paymentPin: pin
          }
        }
      });

      if (result.errors && result.errors.length > 0) {
        handleGraphQLError(result, 'Transfer failed. Please try again.');
        setError(result.errors[0].message);
        return;
      }

      toast.success(
        `Successfully exchanged ${quote.sendAmount} ${quote.fromCurrencyCode} to ${quote.receiveAmount} ${quote.toCurrencyCode}`
      );
      onSuccess?.();
    } catch (error: any) {
      console.error('Transfer failed:', error);

      try {
        const normalizedError = normalizeApolloError(error);
        const friendlyMessage = toFriendlyMessage(normalizedError);
        setError(friendlyMessage);
        toast.error(friendlyMessage);
      } catch {
        handleGraphQLError(error, 'Transfer failed. Please try again.');
        const fallbackMessage =
          error?.message || error?.graphQLErrors?.[0]?.message || 'Transfer failed. Please try again.';
        setError(fallbackMessage);
      }
    }
  };

  if (showPin) {
    return (
      <VerifyTransactionPin
        onClose={() => setShowPin(false)}
        onSuccess={handleTransfer}
        loading={loading}
        title="Authorize Exchange"
        description="Enter your transaction PIN to confirm this exchange"
      />
    );
  }

  return (
    <div className="space-y-4">
      <DialogHeader>
        <Typography variant="h3" className="font-bold text-center">
          Confirm your request
        </Typography>
      </DialogHeader>
      <FormProgress steps={2} currentStep={2} title="Confirm details" />
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">From</span>
          <span className="font-medium">
            {quote.sendAmount} {quote.fromCurrencyCode}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">To</span>
          <span className="font-medium">
            {Number(quote.receiveAmount).toFixed(2)} {quote.toCurrencyCode}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Exchange Rate</span>
          <span className="font-medium">{Number(quote.exchangeRate).toFixed(4)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Fee</span>
          <span className="font-medium">
            {quote.feeAmount} {quote.fromCurrencyCode}
          </span>
        </div>
        <div className="border-t border-gray-200 my-2" />
        <div className="flex justify-between items-center font-semibold text-base">
          <span>Net Debit</span>
          <span>
            {quote.netDebit} {quote.fromCurrencyCode}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <Button className="w-full" onClick={() => setShowPin(true)} disabled={loading}>
        Proceed
      </Button>
    </div>
  );
};

export default CrossCurrencyPreviewAndConvertionAction;
