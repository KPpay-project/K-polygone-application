import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DEPOSIT, GET_MTN_MOMO_BASIC_USER_INFO } from '@repo/api';
import { Button } from 'k-polygon-assets/components';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrencyStore } from '@/store/currency-store';
import { useCurrencies } from '@/hooks/use-currencies';
import { toast } from 'sonner';
import { useProfileStore } from '@/store/profile-store';
import { SupportedProviders } from '@repo/types';
import UsersCurrencyDropdown from '@/components/currency-dropdown/users-currency-dropdown.tsx';
import { extractErrorMessages } from '@/utils';
import { NumberInput } from '@/components/ui/input';
import { PrimaryPhoneNumberInput } from '@repo/ui';
import { useGetMyWallets } from '@/hooks/api';
import { SuccessModal } from '@/components/ui/success-modal';
import { TransactionSuccessDialog, TransactionErrorDialog } from '@repo/ui';

interface DepositActionProps {
  walletId?: string;
  currencyCode?: string;
  customerPhone?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface DepositInput {
  walletId: string;
  currencyCode: string;
  amount: number;
  provider?: string;
  customerPhone?: string;
}

interface DepositResponse {
  deposit: {
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

type Currency = 'USD' | 'NGN' | 'EUR' | 'GBP';

export function DepositAction({ walletId, currencyCode, customerPhone, onSuccess }: DepositActionProps) {
  const { profile, fetchProfile } = useProfileStore();
  const { wallets } = profile || {};
  const { refetch: refetchWallets } = useGetMyWallets();

  const { selectedCurrency } = useCurrencyStore();
  const { apiCurrencies } = useCurrencies();

  const [amount, setAmount] = useState<number>(0);

  const [phone, setPhone] = useState(customerPhone || '');
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(() => {
    if (currencyCode && apiCurrencies) {
      const found = apiCurrencies.find((c: any) => c.code === currencyCode);
      return found?.code || '';
    }
    if (selectedCurrency && apiCurrencies) {
      const found = apiCurrencies.find((c: any) => c.code === selectedCurrency);
      return found?.code || '';
    }
    return '';
  });

  let resolvedWalletId = walletId;
  if (!resolvedWalletId && wallets && wallets.length > 0) {
    resolvedWalletId = wallets[0].id;
  }

  const [selectedProvider, setSelectedProvider] = useState<SupportedProviders>(SupportedProviders.MTN_MOMO);
  const [selectedWalletId, setSelectedWalletId] = useState<string>(resolvedWalletId || '');
  const [momoUserInfo, setMomoUserInfo] = useState<{
    givenName: string | null;
    familyName: string | null;
    name: string | null;
  } | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error'>('success');
  const [resultMessage, setResultMessage] = useState('');
  const [momoLookupError, setMomoLookupError] = useState('');

  const [deposit, { loading }] = useMutation<DepositResponse, { input: DepositInput }>(DEPOSIT, {
    errorPolicy: 'all'
  });
  const [getMtnMomoBasicUserInfo, { loading: verifyingMomo }] = useLazyQuery<{
    mtnMomoBasicUserInfo: {
      found: boolean;
      basicUserInfo: {
        givenName: string | null;
        familyName: string | null;
        name: string | null;
      } | null;
    };
  }>(GET_MTN_MOMO_BASIC_USER_INFO, {
    fetchPolicy: 'no-cache'
  });

  const currencyForNumberInput: Currency | undefined = ['USD', 'NGN', 'EUR', 'GBP'].includes(selectedCurrencyCode)
    ? (selectedCurrencyCode as Currency)
    : undefined;

  useEffect(() => {
    if (selectedProvider !== SupportedProviders.MTN_MOMO) {
      setMomoUserInfo(null);
      setMomoLookupError('');
      return;
    }

    const normalizedPhone = phone.replace(/\s+/g, '');
    if (!normalizedPhone || normalizedPhone.length < 8) {
      setMomoUserInfo(null);
      setMomoLookupError('');
      return;
    }

    const timeout = setTimeout(async () => {
      const verification = await getMtnMomoBasicUserInfo({
        variables: {
          phoneNumber: normalizedPhone,
          service: 'COLLECTION'
        }
      });

      if (verification.errors && verification.errors.length) {
        setMomoUserInfo(null);
        setMomoLookupError('Unable to verify MTN MoMo user');
        return;
      }

      const verifiedUser = verification.data?.mtnMomoBasicUserInfo;
      if (!verifiedUser?.found) {
        setMomoUserInfo(null);
        setMomoLookupError('MTN MoMo user not found for this phone number');
        return;
      }

      setMomoLookupError('');
      setMomoUserInfo({
        givenName: verifiedUser.basicUserInfo?.givenName ?? null,
        familyName: verifiedUser.basicUserInfo?.familyName ?? null,
        name: verifiedUser.basicUserInfo?.name ?? null
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [phone, selectedProvider, getMtnMomoBasicUserInfo]);

  const handleDeposit = async () => {
    const finalWalletId = selectedWalletId || resolvedWalletId;
    if (!finalWalletId || !selectedCurrencyCode || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      if (selectedProvider === SupportedProviders.MTN_MOMO) {
        if (!momoUserInfo) {
          setResultStatus('error');
          setResultMessage(momoLookupError || 'Please enter a valid MTN MoMo number');
          setResultOpen(true);
          return;
        }
      }

      const res = await deposit({
        variables: {
          input: {
            walletId: finalWalletId,
            currencyCode: selectedCurrencyCode,
            amount: amountNumber,
            provider: selectedProvider,
            customerPhone: phone
          }
        }
      });
      if (res.errors && res.errors.length) {
        const msgs = extractErrorMessages(res);
        setResultStatus('error');
        setResultMessage(msgs.join('\n') || 'Deposit failed');
        setResultOpen(true);
        return;
      }
      const success = res.data?.deposit?.success;
      const message = res.data?.deposit?.message || (success ? 'Deposit successful' : 'Deposit failed');
      if (success) {
        refetchWallets();
        setAmount(0);
        await fetchProfile();
        if (selectedProvider !== SupportedProviders.MTN_MOMO) {
          setMomoUserInfo(null);
        }
        setResultStatus('success');
        setResultMessage(message);
        setResultOpen(true);
        onSuccess?.();
      } else {
        setResultStatus('error');
        setResultMessage(message);
        setResultOpen(true);
      }
    } catch (e: any) {
      const msgs = extractErrorMessages(e);
      setResultStatus('error');
      setResultMessage(msgs.join('\n') || (typeof e?.message === 'string' ? e.message : 'Deposit failed'));
      setResultOpen(true);
    }
  };

  return (
    <div className="space-y-4">
      <UsersCurrencyDropdown
        label="Select currency"
        selectedCurrency={selectedCurrencyCode}
        onChange={(opt) => {
          setSelectedWalletId(opt?.walletId ?? '');
          setSelectedCurrencyCode(opt?.currencyCode ?? '');
        }}
      />

      <div className="space-y-2">
        <Label htmlFor="provider">Provider</Label>
        <Select value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as SupportedProviders)}>
          <SelectTrigger>
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SupportedProviders.MTN_MOMO}>MTN Mobile Money</SelectItem>
            <SelectItem value={SupportedProviders.M_PESA}>M-Pesa</SelectItem>
            <SelectItem value={SupportedProviders.AIRTEL}>Airtel Money</SelectItem>
            <SelectItem value={SupportedProviders.ORANGE}>Orange Money</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <NumberInput
          value={amount}
          onChange={(val: number) => setAmount(val)}
          currency={currencyForNumberInput}
          placeholder="Enter amount"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <PrimaryPhoneNumberInput value={phone} onChange={(e) => setPhone(e)} />
      </div>

      {selectedProvider === SupportedProviders.MTN_MOMO && momoUserInfo ? (
        <div className="rounded-md border p-3 text-sm">
          {momoUserInfo?.name || `${momoUserInfo?.givenName || ''} ${momoUserInfo?.familyName || ''}`.trim() || 'N/A'}
        </div>
      ) : null}
      {selectedProvider === SupportedProviders.MTN_MOMO && !momoUserInfo && momoLookupError ? (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{momoLookupError}</div>
      ) : null}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          onClick={handleDeposit}
          disabled={loading || verifyingMomo}
          className="bg-primary hover:bg-primary/90 w-full"
        >
          {loading || verifyingMomo ? 'Processing...' : 'Deposit'}
        </Button>
      </div>

      <SuccessModal
        open={resultOpen}
        onOpenChange={setResultOpen}
        status={resultStatus}
        title={resultStatus === 'success' ? 'Deposit Successful' : 'Deposit Failed'}
        description={resultMessage}
        actionLabel={resultStatus === 'success' ? 'Done' : 'Try Again'}
      />
    </div>
  );
}
