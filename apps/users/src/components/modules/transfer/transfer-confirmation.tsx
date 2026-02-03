/* eslint-disable */
import { useState } from 'react';

import { useDialog } from '@/hooks/use-dialog';
import { FormProgress } from '@/components/common/forms/form-progress';
import { Typography } from '@/components/sub-modules/typography/typography';
import { CloseCircle } from 'iconsax-reactjs';
import { IconArrowRight, Button } from 'k-polygon-assets';
import { useTranslation } from 'react-i18next';
import { useTransferToKpayUser } from '@/hooks/api/use-transfer';
import type { TransferMethod } from './transfer-money';
import moment from 'moment';
import { formatCurrency } from '@/utils/current.ts';
import { VerifyTransactionPin } from '@/components/actions/pin/verify-transaction-pin';
import { TRANSFER_METHOD_ENUM } from '@/enums';
import { handleGraphQLError } from '@/lib/graphql';

interface TransferQuoteData {
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
}

interface TransferConfirmationProps {
  amount: string;
  destination: string;
  recipientEmail?: string;
  description?: string;
  currency?: string;
  transferMethod: TransferMethod;
  onFormSubmit?: () => void;
  onFormSubmitWithPin?: (pin: string) => void;
  quote?: TransferQuoteData | null;
  quoteLoading?: boolean;
  showSubmitButton?: boolean;
  loading?: boolean;
}

export const TransferConfirmation = ({
  amount,
  destination,
  recipientEmail,
  description,
  currency = 'USD',
  transferMethod,
  onFormSubmit,
  onFormSubmitWithPin,
  quote,
  quoteLoading,
  showSubmitButton = true,
  loading = false
}: TransferConfirmationProps) => {
  const { t } = useTranslation();
  const { close } = useDialog();
  const [showPinInput, setShowPinInput] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error' | null>(null);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [transferToKpayUser, { loading: kpayLoading }] = useTransferToKpayUser();

  const handlePinSuccess = (pin: string) => {
    onFormSubmitWithPin?.(pin);
  };

  const handleButtonClick = async () => {
    if (transferMethod === TRANSFER_METHOD_ENUM.WALLET || transferMethod === TRANSFER_METHOD_ENUM.BANK) {
      setShowPinInput(true);
      return;
    }

    if (transferMethod === 'kpay' && recipientEmail) {
      try {
        const result = await transferToKpayUser({
          variables: {
            input: {
              amount,
              currencyCode: currency,
              recipientEmail,
              description: description || undefined
            }
          }
        });

        const res = result.data?.transferToKpayUser;
        if (res?.success) {
          setResultStatus('success');
          setResultMessage(res?.message || (t('transfer.success') as string));
        } else {
          setResultStatus('error');

          setResultMessage(res?.message || (t('transfer.failed') as string));
        }
      } catch (error: any) {
        setResultMessage(handleGraphQLError(error).message);
      }
    } else {
      onFormSubmit?.();
      setResultStatus('success');
      setResultMessage(t('transfer.success') as string);
    }
  };

  if (showPinInput) {
    return (
      <VerifyTransactionPin
        onClose={() => setShowPinInput(false)}
        onSuccess={handlePinSuccess}
        title="Authorize Transfer"
        description="Enter your 4-digit PIN to complete the transfer"
        loading={loading}
      />
    );
  }

  return (
    <>
      <div className="relative">
        <div className="flex justify-center mb-6">
          <FormProgress steps={2} currentStep={2} title={t('transfer.confirmYourRequest')} />
        </div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-900">{t('transfer.confirmTransfer')}</h1>
          <div className="cursor-pointer">
            <CloseCircle onClick={close} size={24} className="text-gray-500" />
          </div>
        </div>
        <div className="bg-gray-50 px-6 py-5 rounded-lg mb-8">
          <div className="flex w-full items-center justify-between mb-4">
            <Typography className="text-sm text-gray-600">{t('transfer.amount')}</Typography>
            <Typography className="text-sm font-medium">{formatCurrency(Number(amount), currency)}</Typography>
          </div>
          <div className="flex w-full items-center justify-between mb-4">
            <Typography className="text-sm text-gray-600">{t('transfer.fee')}</Typography>
            <Typography className="text-sm font-medium">
              {quoteLoading ? t('common.loading') : quote ? `${quote.feeAmount} ${quote.feeCurrencyCode}` : `—`}
            </Typography>
          </div>
          <div className="flex w-full items-center justify-between mb-2">
            <Typography className="text-sm text-gray-600">{t('transfer.destination')}</Typography>
            <Typography className="text-sm font-medium">{destination}</Typography>
          </div>
          {quote && (
            <div className="flex w-full items-center justify-between mb-2">
              <Typography className="text-sm text-gray-600">{!t('transfer.expiresAt') || 'Expires at'}</Typography>
              <Typography className="text-sm font-medium">{moment(quote.expiresAt).endOf('day').fromNow()}</Typography>
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <Typography className="text-sm font-semibold">{t('transfer.total')}</Typography>
            <Typography className="text-sm font-semibold">
              {quoteLoading
                ? t('common.loading')
                : quote
                  ? `${formatCurrency(Number(quote.totalDebit), quote.currencyCode)} `
                  : `${formatCurrency(amount, currency)}`}
            </Typography>
          </div>
        </div>
        {showSubmitButton && (
          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white"
            icon={<IconArrowRight />}
            disabled={loading || kpayLoading}
            onClick={handleButtonClick}
          >
            {loading || kpayLoading ? t('transfer.processing') : t('transfer.confirmAndSend')}
          </Button>
        )}
      </div>
    </>
  );
};
