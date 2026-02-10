import { useState, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { WITHDRAW } from '@repo/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardReceive } from 'iconsax-reactjs';
import { useTranslation } from 'react-i18next';
import { useCurrencyStore } from '@/store/currency-store';
import { useCurrencies } from '@/hooks/use-currencies';
import { toast } from 'sonner';

interface WithdrawActionProps {
  walletId?: string;
  currencyCode?: string;
  onSuccess?: () => void;
  buttonLabel?: string;
  buttonIcon?: ReactNode;
  buttonClassName?: string;
}

interface WithdrawInput {
  walletId: string;
  currencyCode: string;
  amount: number;
}

interface WithdrawResponse {
  withdraw: {
    success: boolean;
    message: string;
    balance: {
      id: string;
      amount: number;
      currency: string;
      wallet_id: string;
      updated_at: string;
    };
    transaction: {
      id: string;
      amount: number;
      currency: string;
      transaction_type: string;
      status: string;
      description: string;
      reference: string;
      wallet_id: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export function WithdrawAction({
  walletId,
  currencyCode,
  onSuccess,
  buttonLabel,
  buttonIcon = <CardReceive size={20} />,
  buttonClassName = 'bg-primary hover:bg-primary text-white px-6 py-2.5 rounded-[12px] font-light transition-colors flex items-center gap-2'
}: WithdrawActionProps) {
  const { t } = useTranslation();
  const { selectedCurrency } = useCurrencyStore();
  const { apiCurrencies } = useCurrencies();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(currencyCode || selectedCurrency);

  const [withdraw, { loading }] = useMutation<WithdrawResponse, { input: WithdrawInput }>(WITHDRAW, {
    onCompleted: (data) => {
      if (data.withdraw.success) {
        toast.success(data.withdraw.message || 'Withdraw successful');
        setOpen(false);
        setAmount('');
        onSuccess?.();
      } else {
        toast.error(data.withdraw.message || 'Withdraw failed');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred during withdraw');
    }
  });

  const handleWithdraw = async () => {
    if (!walletId || !selectedCurrencyCode || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    await withdraw({
      variables: {
        input: {
          walletId,
          currencyCode: selectedCurrencyCode,
          amount: amountNumber
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className={buttonClassName} type="button">
          {buttonIcon}
          {buttonLabel || t('wallet.withdraw')}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('wallet.withdraw')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={selectedCurrencyCode} onValueChange={setSelectedCurrencyCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {apiCurrencies?.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currency.code}</span>
                      <span className="text-gray-500 text-sm">({currency.name})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} disabled={loading} className="bg-primary hover:bg-primary/90">
              {loading ? 'Processing...' : t('wallet.withdraw')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
