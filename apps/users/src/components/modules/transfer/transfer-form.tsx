//@ts-nocheck
import { SavedCard, TransferMethod } from './transfer-money';
import { TRANSFER_METHOD_ENUM } from '@/enums';
import { WalletToWalletTransferAction } from '@/components/actions/transfer/wallet-to-wallet-transfer.tsx';
import BankTransferAction from '@/components/actions/transfer/bank-transfer-action.tsx';
import MobileMoneyTransfereAction from '@/components/actions/transfer/mobile-money-transfer-action.tsx';
import CardDepositAction from '@/components/actions/transfer/card-deposit-action';
import { EmptyState } from '@/components/common/fallbacks';
import FilledTicketsFallbackSvg from '@/assets/svgs/filled-tickets-fallback.tsx';
import { StepIndicator } from '@/components/shared/step-indicator.tsx';

interface TransferFormProps {
  selectedMethod: TransferMethod;
  selectedCard: string | null;
  onFormSubmit: () => void;
  onFormDataChange: (data: { amount: string; destination: string; currency: string }) => void;
  formData: { amount: string; destination: string; currency: string };
  savedCards: SavedCard[];
  onAddCard: (cardData: { cardNumber: string; expiryDate: string; cvv: string; holderName?: string }) => void;
  selectedProvider?: import('@repo/types').SupportedProviders | null;
}

export const TransferForm = ({ selectedMethod, onFormSubmit, selectedProvider }: TransferFormProps) => {
  return (
    <div className="px-4 pb-6 space-y-6" autoComplete="on">
      {selectedMethod !== TRANSFER_METHOD_ENUM.CARD &&
        selectedMethod !== TRANSFER_METHOD_ENUM.PROVIDERS &&
        selectedMethod !== TRANSFER_METHOD_ENUM.KPAY &&
        selectedMethod !== TRANSFER_METHOD_ENUM.BANK && (
          <EmptyState
            icon={<FilledTicketsFallbackSvg />}
            title={'Choose how you want to deposit'}
            description={
              'You haven’t selected a payment method yet. Pick from Bank Transfer, Mobile Money, or Card to get started.'
            }
          />
        )}

      {(selectedMethod === TRANSFER_METHOD_ENUM.BANK ||
        selectedMethod === TRANSFER_METHOD_ENUM.PROVIDERS ||
        selectedMethod === TRANSFER_METHOD_ENUM.KPAY) && (
        <div className="flex justify-end mb-4 px-4 pt-4">
          <StepIndicator currentStep={1} steps={2} title="Enter details" />
        </div>
      )}

      {selectedMethod === TRANSFER_METHOD_ENUM.CARD && <CardDepositAction onSuccess={onFormSubmit} />}

      {selectedMethod === TRANSFER_METHOD_ENUM.PROVIDERS && (
        <MobileMoneyTransfereAction onSuccess={onFormSubmit} selectedProvider={selectedProvider} />
      )}

      {selectedMethod === TRANSFER_METHOD_ENUM.BANK && (
        <BankTransferAction onSuccess={onFormSubmit} selectedProvider={selectedProvider} />
      )}

      {selectedMethod === TRANSFER_METHOD_ENUM.KPAY && <WalletToWalletTransferAction onSuccess={onFormSubmit} />}
    </div>
  );
};
