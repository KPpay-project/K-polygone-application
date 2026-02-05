import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { DEPOSIT_VIA_CARD, VALIDATE_CARD_PAYMENT } from '@repo/api';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UsersCurrencyDropdown from '@/components/currency-dropdown/users-currency-dropdown.tsx';
import { NumberInput, Currency } from '@/components/ui/input';
import { useProfileStore } from '@/store/profile-store';
import { toast } from 'sonner';
import ErrorAndSuccessFallback from '@/components/sub-modules/modal-contents/error-success-fallback';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import CreditCardInput from 'react-credit-card-input';

type Step = 'form' | 'pin-validation' | 'result';

interface DepositResponse {
  flutterwaveTransactionId: string;
  requiresAuth: boolean;
  authMode: string;
  authFields: string[];
  message: string;
  status: string;
}

const DepositeViaCard = () => {
  const { t } = useTranslation();
  const { profile } = useProfileStore();

  const defaultWalletId = profile?.wallets?.[0]?.id ?? '';
  const defaultCurrencyCode = profile?.wallets?.[0]?.balances?.[0]?.currency?.code || 'USD';
  const userEmail = profile?.email || '';
  const userName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();

  const [step, setStep] = useState<Step>('form');
  const [depositResponse, setDepositResponse] = useState<DepositResponse | null>(null);
  const [resultStatus, setResultStatus] = useState<'success' | 'error'>('success');
  const [resultMessage, setResultMessage] = useState('');
  const [transactionReference, setTransactionReference] = useState('');

  const [selectedWalletId, setSelectedWalletId] = useState<string>(defaultWalletId);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(defaultCurrencyCode);
  const [amount, setAmount] = useState<number>(0);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [saveCard, setSaveCard] = useState('false');
  const [cardError, setCardError] = useState('');

  const [pin, setPin] = useState(['', '', '', '']);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const [depositViaCard, { loading: depositLoading }] = useMutation(DEPOSIT_VIA_CARD, {
    onCompleted: (data) => {
      const response = data.depositViaCard;
      if (response.success) {
        if (response.requiresAuth) {
          setDepositResponse({
            flutterwaveTransactionId: response.flutterwaveTransactionId,
            requiresAuth: response.requiresAuth,
            authMode: response.authMode || '',
            authFields: response.authFields || [],
            message: response.message,
            status: response.status
          });
          setIsPinModalOpen(true);
        } else {
          setResultStatus('success');
          setResultMessage(response.message || 'Deposit successful!');
          setTransactionReference(response.reference || '');
          setStep('result');
        }
      } else {
        setResultStatus('error');
        setResultMessage(response.message || 'Deposit failed');
        setStep('result');
      }
    },
    onError: (error) => {
      setResultStatus('error');
      setResultMessage(error.message || 'An error occurred');
      setStep('result');
    }
  });

  const [validateCardPayment, { loading: validationLoading }] = useMutation(VALIDATE_CARD_PAYMENT, {
    onCompleted: (data) => {
      const response = data.validateCardPayment;
      if (response.success) {
        setResultStatus('success');
        setResultMessage(response.message || 'Payment validated successfully!');
        setTransactionReference(response.transaction?.reference || '');
        setStep('result');
        setIsPinModalOpen(false);
      } else {
        toast.error(response.message || 'Validation failed');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Validation error occurred');
    }
  });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(e.target.value);
    if (cardError) setCardError('');
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(e.target.value);
    if (cardError) setCardError('');
  };

  const handleCardCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvc(e.target.value);
    if (cardError) setCardError('');
  };

  const handleSaveCardChange = (value: string) => {
    setSaveCard(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWalletId) {
      toast.error('Please select a wallet');
      return;
    }

    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!cardNumber || !cvc || !expiry) {
      setCardError('Please fill in all card details');
      return;
    }

    const [expiryMonth, expiryYear] = expiry.split(' / ');
    if (!expiryMonth || !expiryYear) {
      setCardError('Invalid expiry date format');
      return;
    }

    const input = {
      walletId: selectedWalletId,
      amount: amount.toString(),
      currencyCode: selectedCurrency,
      email: userEmail,
      cardNumber: cardNumber.replace(/\s/g, ''),
      cvv: cvc,
      expiryMonth,
      expiryYear,
      phoneNumber: '08134044405',
      customerName: userName,
      description: 'Card Deposit',
      saveCard: saveCard === 'true',
      redirectUrl: window.location.origin + '/deposit/callback'
    };

    await depositViaCard({ variables: { input } });
  };

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePinSubmit = async () => {
    const pinValue = pin.join('');
    if (pinValue.length !== 4) {
      toast.error('Please enter a 4-digit PIN');
      return;
    }

    if (!depositResponse?.flutterwaveTransactionId) {
      toast.error('Transaction ID not found');
      return;
    }

    await validateCardPayment({
      variables: {
        input: {
          flutterwaveTransactionId: depositResponse.flutterwaveTransactionId,
          pin: pinValue
        }
      }
    });
  };

  const handleResultAction = () => {
    if (resultStatus === 'success') {
      setStep('form');
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setSaveCard('false');
      setAmount(0);
      setPin(['', '', '', '']);
    } else {
      setStep('form');
    }
  };

  if (step === 'result') {
    return (
      <div className="p-6 max-w-md mx-auto">
        <ErrorAndSuccessFallback
          status={resultStatus}
          title={resultStatus === 'success' ? 'Deposit Successful' : 'Deposit Failed'}
          body={resultMessage}
          onAction={handleResultAction}
          buttonText={resultStatus === 'success' ? 'Make Another Deposit' : 'Try Again'}
        />
        {resultStatus === 'success' && transactionReference && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Reference: {transactionReference}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
        <div className="space-y-2">
          <Label>{t('transfer.amount') || 'Amount'}</Label>
          <NumberInput
            placeholder={t('transfer.enterAmount') || 'Enter amount'}
            value={amount}
            onChange={(v) => setAmount(v)}
            currency={(selectedCurrency as Currency) || 'USD'}
            className="w-full"
          />
        </div>

        <UsersCurrencyDropdown
          selectedCurrency={selectedCurrency}
          onChange={(opt) => {
            if (opt) {
              setSelectedWalletId(opt.walletId ?? '');
              setSelectedCurrency(opt.currencyCode ?? defaultCurrencyCode);
            }
          }}
        />

        <div className="space-y-2">
          <Label>Card Details</Label>

          <div className="relative w-full">
            <style>
              {`
                .react-credit-card-input-container {
                  width: 100% !important;
                  max-width: 100% !important;
                  height: 40px;
                  border: 1px solid #e2e8f0;
                  border-radius: 0.375rem;
                  display: flex;
                  align-items: center;
                  padding: 0 0.75rem;
                  transition: all 0.2s;
                  background-color: transparent;
                }
                .react-credit-card-input-container:focus-within {
                  outline: 2px solid #000;
                  outline-offset: 2px;
                  border-color: #000;
                }
                .react-credit-card-input {
                  font-size: 0.875rem !important;
                  color: #020817 !important;
                  background: transparent !important;
                }
                .react-credit-card-input::placeholder {
                  color: #64748b !important;
                }
              `}
            </style>
            <CreditCardInput
              cardNumberInputProps={{
                value: cardNumber,
                onChange: handleCardNumberChange,
                placeholder: '0000 0000 0000 0000'
              }}
              cardExpiryInputProps={{
                value: expiry,
                onChange: handleCardExpiryChange,
                placeholder: 'MM / YY'
              }}
              cardCVCInputProps={{
                value: cvc,
                onChange: handleCardCVCChange,
                placeholder: 'CVC'
              }}
              fieldClassName="react-credit-card-input"
              containerClassName="react-credit-card-input-container"
            />
            {cardError && <p className="text-sm text-red-500 mt-1">{cardError}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Save Card</Label>
          <Select value={saveCard} onValueChange={handleSaveCardChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={depositLoading} className="w-full">
          {depositLoading ? 'Processing...' : 'Deposit Via Card'}
        </Button>
      </form>

      <Dialog open={isPinModalOpen} onOpenChange={setIsPinModalOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-center mb-2">Verify Payment</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              {depositResponse?.message || 'Please enter the verification code to complete the transaction'}
            </p>

            <div className="flex gap-3 justify-center mb-6">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-semibold border-2 rounded-lg focus:outline-none focus:border-primary transition-all"
                />
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsPinModalOpen(false);
                  setPin(['', '', '', '']);
                }}
                disabled={validationLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handlePinSubmit}
                disabled={validationLoading || pin.join('').length !== 4}
              >
                {validationLoading ? 'Validating...' : 'Verify'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepositeViaCard;
