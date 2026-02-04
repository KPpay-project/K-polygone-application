import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { TRANSFER_TO_KPAY_USER } from '@/lib/graphql/mutations/transfer';
import type { TransferToKpayUserInput } from '@/lib/graphql/mutations/transfer';
import { TRANSFER_QUOTE } from '@/lib/graphql/mutations/transfer';

interface TransferToKpayUserResult {
  transferToKpayUser: {
    success: boolean;
    message: string;
    jobId?: string;
    reference?: string;
    status?: string;
  };
}

interface TransferToKpayUserVariables {
  input: TransferToKpayUserInput;
}

export const useTransferToKpayUser = () => {
  const { t } = useTranslation();

  return useMutation<TransferToKpayUserResult, TransferToKpayUserVariables>(TRANSFER_TO_KPAY_USER, {
    errorPolicy: 'all',
    onCompleted: (data) => {
      if (data.transferToKpayUser.success) {
        toast.success(data.transferToKpayUser.message || t('transfer.transferSuccessful'));
      } else {
        toast.error(data.transferToKpayUser.message || t('transfer.transferFailed'));
      }
    },
    onError: (error) => {
      console.error('Transfer error:', error);
      toast.error(error.message || t('transfer.transferFailed'));
    }
  });
};

interface TransferQuoteResult {
  transferQuote: {
    amount: string;
    applies: boolean;
    currencyCode: string;
    expiresAt: string;
    feeAmount: string;
    feeCurrencyCode: string;
    paymentType: string;
    quoteId: string;
    tier: string;
    totalDebit: string;
  };
}

interface TransferQuoteVariables {
  input: import('@/lib/graphql/mutations/transfer').TransferQuoteInput;
}

export const useTransferQuote = () => {
  const { t } = useTranslation();
  return useMutation<TransferQuoteResult, TransferQuoteVariables>(TRANSFER_QUOTE, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error('Quote error:', error);
      toast.error(error.message || t('transfer.quoteFailed') || 'Failed to fetch quote');
    }
  });
};
