/* eslint-disable */
import React, { useCallback, useState } from 'react';
import { ModularCard } from '@/components/sub-modules/card/card';
import { Typography } from '@/components/sub-modules/typography/typography';
// import { StepIndicator } from '@/components/shared/step-indicator';
import { TransferMethods } from './transfer-methods.tsx';
import { TransferForm } from './transfer-form.tsx';
import { MultipleTransferForm } from './multiple-transfer-form.tsx';
import { BulkTransferForm } from './bulk-transfer-form.tsx';
import { useTranslation } from 'react-i18next';
import { SupportedProviders } from '@repo/types';
import { TRANSFER_METHOD_ENUM, TRANSFER_MODE_ENUM } from '@/enums';

export type TransferMethod = TRANSFER_METHOD_ENUM;

export interface SavedCard {
  id: string;
  lastFour: string;
  type: 'mastercard' | 'visa';
  holderName: string;
}

export type TransferMode = TRANSFER_MODE_ENUM | 'single' | 'multiple' | 'bulk';

interface TransferMoneyProps {
  mode?: TransferMode;
  type?: 'withdraw';
}

export const TransferMoney: React.FC<TransferMoneyProps> = ({ mode = TRANSFER_MODE_ENUM.SINGLE, type }) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<TransferMethod>(TRANSFER_METHOD_ENUM.WALLET);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<SupportedProviders | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({ amount: '', destination: '', currency: t('currencies.UGX') });
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    { id: '1234', lastFour: '1234', type: 'mastercard', holderName: t('transfer.defaultCardHolders.first') },
    { id: '4464', lastFour: '4464', type: 'visa', holderName: t('transfer.defaultCardHolders.second') }
  ]);

  const handleMethodSelect = (method: TransferMethod) => {
    setSelectedMethod(method);

    if (method === TRANSFER_METHOD_ENUM.BANK) {
      setSelectedCard(null);
    }
    if (method !== TRANSFER_METHOD_ENUM.BANK) {
      setSelectedProvider(null);
    }
  };

  const handleFormSubmit = () => {
    setCurrentStep(2);
  };

  const handleModalClose = () => {
    setCurrentStep(1);
  };

  const handleFormDataChange = useCallback(
    (data: { amount: string; destination: string; currency: string }) => {
      setFormData((prev) => {
        if (prev.amount === data.amount && prev.destination === data.destination && prev.currency === data.currency) {
          return prev;
        }
        return data;
      });
    },
    [setFormData]
  );

  const addCard = (cardData: { cardNumber: string; expiryDate: string; cvv: string; holderName?: string }) => {
    const lastFour = cardData.cardNumber.slice(-4);
    const cardType = cardData.cardNumber.startsWith('4') ? 'visa' : 'mastercard';
    const newCard: SavedCard = {
      id: Date.now().toString(),
      lastFour,
      type: cardType,
      holderName: cardData.holderName || t('transfer.defaultCardHolder')
    };
    setSavedCards((prev) => [...prev, newCard]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <ModularCard className="bg-white shadow-sm border border-gray-100 h-full">
              <div className="p-2 h-full flex flex-col">
                <Typography variant="h3" className="text-gray-900 font-semibold mb-4 px-4 pt-4">
                  {type === 'withdraw' ? t('withdraw.title', 'Withdraw Money') : t('transfer.title')}
                </Typography>

                <div className="flex-1">
                  <TransferMethods
                    selectedMethod={selectedMethod}
                    onMethodSelect={handleMethodSelect}
                    selectedCard={selectedCard}
                    onCardSelect={setSelectedCard}
                    savedCards={savedCards}
                    onWalletSelect={() => setCurrentStep(1)}
                    selectedProvider={selectedProvider}
                    onProviderSelect={setSelectedProvider}
                  />
                </div>
              </div>
            </ModularCard>
          </div>

          <div>
            <ModularCard className="bg-white shadow-sm border border-gray-100 h-full">
              <div className="p-2">
                {mode === TRANSFER_MODE_ENUM.MULTIPLE || mode === 'multiple' ? (
                  <MultipleTransferForm
                    selectedMethod={selectedMethod}
                    selectedCard={selectedCard}
                    savedCards={savedCards}
                    onProceed={() => {
                      handleFormSubmit();
                    }}
                  />
                ) : mode === TRANSFER_MODE_ENUM.BULK ? (
                  <BulkTransferForm
                    selectedMethod={selectedMethod}
                    onProceed={() => {
                      handleFormSubmit();
                    }}
                  />
                ) : (
                  <TransferForm
                    selectedMethod={selectedMethod}
                    selectedCard={selectedCard}
                    onFormSubmit={handleFormSubmit}
                    onFormDataChange={handleFormDataChange}
                    formData={formData}
                    savedCards={savedCards}
                    onAddCard={addCard}
                    selectedProvider={selectedProvider}
                  />
                )}
              </div>
            </ModularCard>
          </div>
        </div>
      </div>
    </div>
  );
};
