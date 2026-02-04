import { useMutation } from '@apollo/client';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  TRANSFER_TO_KPAY_USER,
  TRANSFER_QUOTE_MUTATION,
} from '@/lib/graphql/mutations/transfer';
import type {
  TransferToKpayUserInput,
  TransferQuoteInput,
} from '@/lib/graphql/mutations/transfer';

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

  return useMutation<TransferToKpayUserResult, TransferToKpayUserVariables>(
    TRANSFER_TO_KPAY_USER,
    {
      errorPolicy: 'all',
      onCompleted: (data) => {
        const msg =
          data.transferToKpayUser.message || t('transfer.transferSuccessful');
        if (data.transferToKpayUser.success) {
          Alert.alert(
            t('transfer.successTitle', { defaultValue: 'Success' }),
            msg
          );
        } else {
          Alert.alert(
            t('transfer.failedTitle', { defaultValue: 'Transfer Failed' }),
            msg
          );
        }
      },
      onError: (error) => {
        Alert.alert(
          t('transfer.failedTitle', { defaultValue: 'Transfer Failed' }),
          error.message ||
            t('transfer.transferFailed', { defaultValue: 'Transfer failed' })
        );
      },
    }
  );
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
  input: TransferQuoteInput;
}

export const useTransferQuote = () => {
  const { t } = useTranslation();

  return useMutation<TransferQuoteResult, TransferQuoteVariables>(
    TRANSFER_QUOTE_MUTATION,
    {
      errorPolicy: 'all',
      onError: (error) => {
        Alert.alert(
          t('transfer.quoteFailedTitle', { defaultValue: 'Quote Failed' }),
          error.message ||
            t('transfer.quoteFailed', { defaultValue: 'Failed to fetch quote' })
        );
      },
    }
  );
};
