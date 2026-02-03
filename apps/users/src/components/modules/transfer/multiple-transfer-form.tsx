import React, { useEffect, useState } from 'react';
import { Typography } from '@/components/sub-modules/typography/typography';
import { Button, Input } from 'k-polygon-assets';
import { ArrowRight, Add, CloseCircle } from 'iconsax-reactjs';
import { CurrencyDropdown } from './currency-dropdown';
import { NumberInput } from '@/components/ui/input';
import type { Currency } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import type { TransferMethod, SavedCard } from './transfer-money';

type Entry = {
  // Common fields
  amount: number;
  reason: string;
  // KPay user (mobile money)
  phone?: string;
  // Bank
  destination?: string; // bank account number or destination identifier
  recipientName?: string;
  bankName?: string;
  routingNumber?: string;
  // Card
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  holderName?: string;
  method: TransferMethod;
};

interface MultipleTransferFormProps {
  selectedMethod: TransferMethod;
  selectedCard: string | null;
  savedCards: SavedCard[];
  onProceed: (entries: Entry[], currency: string) => void;
}

export const MultipleTransferForm: React.FC<MultipleTransferFormProps> = ({
  selectedMethod,
  selectedCard,
  savedCards,
  onProceed
}) => {
  const { t } = useTranslation();
  const [currency, setCurrency] = useState<Currency>('USD');
  // KPay
  const [phone, setPhone] = useState('');
  // Common
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('');
  // Bank
  const [destination, setDestination] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  // Card (we keep simple inputs similar to single payment)
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [holderName, setHolderName] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);

  // Auto-populate card details when a saved card is selected
  useEffect(() => {
    if (selectedMethod === 'card' && selectedCard) {
      const card = savedCards.find((c) => c.id === selectedCard);
      if (card) {
        setCardNumber(`•••• •••• •••• ${card.lastFour}`);
        setExpiryDate('01/26');
        setCvv('');
        setHolderName(card.holderName || 'Card Holder');
      }
    } else if (selectedMethod === 'card' && !selectedCard) {
      // Reset to allow manual entry for new card
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setHolderName('');
    }
  }, [selectedMethod, selectedCard, savedCards]);

  const addEntry = () => {
    // Basic validation per method
    if (selectedMethod === 'kpay') {
      if (!phone || amount <= 0) return;
      setEntries((prev) => [...prev, { method: 'kpay', phone, amount, reason }]);
      setPhone('');
    } else if (selectedMethod === 'bank') {
      if (!destination || amount <= 0) return;
      setEntries((prev) => [
        ...prev,
        { method: 'bank', destination, recipientName, bankName, routingNumber, amount, reason }
      ]);
      setDestination('');
      setRecipientName('');
      setBankName('');
      setRoutingNumber('');
    } else if (selectedMethod === 'card') {
      // Require only amount and destination when a saved card is selected
      if (amount <= 0 || !destination) return;
      if (selectedCard) {
        // Use saved card details
        const card = savedCards.find((c) => c.id === selectedCard);
        const masked = card ? `•••• •••• •••• ${card.lastFour}` : cardNumber;
        setEntries((prev) => [
          ...prev,
          {
            method: 'card',
            destination,
            cardNumber: masked,
            expiryDate: '01/26',
            cvv: '',
            holderName: card?.holderName,
            amount,
            reason
          }
        ]);
      } else {
        // New card requires full details
        if (!cardNumber || !expiryDate || !cvv) return;
        setEntries((prev) => [
          ...prev,
          { method: 'card', destination, cardNumber, expiryDate, cvv, holderName, amount, reason }
        ]);
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setHolderName('');
      }
    }
    // Common resets
    setAmount(0);
    setReason('');
    setDestination('');
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProceed = () => {
    if (entries.length === 0) {
      addEntry();
    }
    onProceed(entries, currency);
  };

  const currencySymbols: Record<string, string> = {
    USD: '$',
    NGN: '₦',
    EUR: '€',
    GBP: '£'
  };

  // Determine if there is any unsaved input in the current form entry
  const hasAnyInput = (() => {
    const commonFilled = amount > 0 || !!reason || !!destination;
    if (selectedMethod === 'kpay') {
      return commonFilled || !!phone;
    }
    if (selectedMethod === 'bank') {
      return commonFilled || !!recipientName || !!bankName || !!routingNumber;
    }
    if (selectedMethod === 'card') {
      // When using a saved card, only amount/destination constitute unsaved input
      const manualCardFilled = !!cardNumber || !!expiryDate || !!cvv || !!holderName;
      return commonFilled || (!selectedCard && manualCardFilled);
    }
    return commonFilled;
  })();

  // Button label: show "Add" when there is unsaved input; after adding (inputs cleared) and entries exist, show "Add Another"
  const addButtonLabel = hasAnyInput
    ? t('transfer.add') || 'Add'
    : entries.length > 0
      ? t('transfer.addAnother') || 'Add Another'
      : t('transfer.add') || 'Add';

  return (
    <div className="space-y-6">
      {/* Header bar with currency and balance placeholder */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <CurrencyDropdown selectedCurrency={currency} onCurrencyChange={(c) => setCurrency(c as Currency)} />
        </div>
        <Typography className="text-base font-semibold text-gray-800">$1000</Typography>
      </div>

      <div className="space-y-4">
        {/* Destination / phone field depends on method */}
        {selectedMethod === 'kpay' ? (
          <div>
            <Typography className="text-sm font-medium text-gray-700 mb-2">
              {t('transfer.mobileMoneyPhone') || 'Mobile Money Phone'}
            </Typography>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="23455555523"
              className="w-full"
              name="mobileMoneyPhone"
            />
          </div>
        ) : (
          <div>
            <Typography className="text-sm font-medium text-gray-700 mb-2">
              {selectedMethod === 'bank'
                ? t('transfer.bankAccount') || 'Bank Account'
                : t('transfer.destination') || 'Destination'}
            </Typography>
            <Input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={
                selectedMethod === 'bank'
                  ? t('transfer.enterBankAccount') || 'Enter bank account'
                  : t('transfer.enterDestination') || 'Enter destination'
              }
              className="w-full"
              name="destination"
            />
          </div>
        )}

        <div>
          <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.amount') || 'Amount'}</Typography>
          <NumberInput
            value={amount}
            onChange={(v) => setAmount(v)}
            currency={currency}
            placeholder="$300"
            className="w-full"
          />
        </div>

        <div>
          <Typography className="text-sm font-medium text-gray-700 mb-2">
            {t('transfer.reason') || 'Reason for transfer'}
          </Typography>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('transfer.reasonPlaceholder') || 'Salary'}
            className="w-full"
            name="reason"
          />
        </div>

        {/* Extra fields based on method */}
        {selectedMethod === 'bank' && (
          <>
            <div>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                {t('transfer.recipientName') || 'Recipient Name'}
              </Typography>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t('transfer.enterRecipientName') || 'Enter recipient name'}
                className="w-full"
                autoComplete="name"
                name="recipientName"
              />
            </div>
            <div>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                {t('transfer.bankName') || 'Bank Name'}
              </Typography>
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder={t('transfer.enterBankName') || 'Enter bank name'}
                className="w-full"
                autoComplete="organization"
                name="bankName"
              />
            </div>
            <div>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                {t('transfer.routingNumber') || 'Routing Number'}
              </Typography>
              <Input
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder={t('transfer.enterRoutingNumber') || 'Enter routing number'}
                className="w-full"
                autoComplete="off"
                name="routingNumber"
              />
            </div>
          </>
        )}

        {selectedMethod === 'card' && !selectedCard && (
          <>
            <div>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                {t('transfer.cardNumber') || 'Card Number'}
              </Typography>
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full"
                autoComplete="cc-number"
                name="cardNumber"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Typography className="text-sm font-medium text-gray-700 mb-2">
                  {t('transfer.expiryDate') || 'Expiry Date'}
                </Typography>
                <Input
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full"
                  autoComplete="cc-exp"
                  name="expiryDate"
                />
              </div>
              <div>
                <Typography className="text-sm font-medium text-gray-700 mb-2">{t('transfer.cvv') || 'CVV'}</Typography>
                <Input
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full"
                  autoComplete="cc-csc"
                  name="cvv"
                />
              </div>
            </div>
            <div>
              <Typography className="text-sm font-medium text-gray-700 mb-2">
                {t('transfer.cardHolderName') || 'Card Holder Name'}
              </Typography>
              <Input
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder={t('transfer.enterCardHolderName') || 'Enter card holder name'}
                className="w-full"
                autoComplete="name"
                name="holderName"
              />
            </div>
          </>
        )}

        <div>
          <Button
            type="button"
            onClick={addEntry}
            className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md"
          >
            <Add size={16} />
            <span>{addButtonLabel}</span>
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {entries.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex-1 grid grid-cols-3 gap-3 text-sm">
                <span className="text-gray-800 truncate">
                  {item.method === 'kpay' && item.phone}
                  {item.method === 'bank' && item.destination}
                  {item.method === 'card' && (item.cardNumber ? `Card •••• ${item.cardNumber.slice(-4)}` : '')}
                </span>
                <span className="text-gray-800">{`${currencySymbols[currency] || ''}${item.amount.toLocaleString()}`}</span>
                <span className="text-gray-800 truncate">{item.reason}</span>
              </div>
              <button
                type="button"
                onClick={() => removeEntry(idx)}
                className="ml-3 inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-200"
                aria-label={t('common.remove') || 'Remove'}
              >
                <CloseCircle size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          onClick={handleProceed}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <span>{t('transfer.proceed') || 'Proceed'}</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};
