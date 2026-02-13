import { useState, ReactNode, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_WALLET } from '@repo/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import BaseModal from '@/components/sub-modules/modal-contents/base-modal';
import { ArrowRight } from 'iconsax-reactjs';
import { Label } from '@/components/ui/label.tsx';
import { InputWithSearch } from '@repo/ui';
import { useFetchAllCurrencies } from '@/hooks/use-currencies';

interface CreateWalletActionProps {
  buttonLabel?: string;
  buttonIcon?: ReactNode;
  buttonClassName?: string;
  onSuccess?: () => void;
  isDisabled?: boolean;
}

interface CreateWalletInput {
  currencyCode: string;
}

interface CreateWalletResponse {
  createWallet: {
    id: string;
    status: string;
  };
}

const getFlagEmoji = (countryCode: string): string => {
  if (!countryCode || countryCode.length !== 2) return '🏳️';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};

export function CreateWalletAction({ onSuccess, isDisabled = false }: CreateWalletActionProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [successCurrencyCode, setSuccessCurrencyCode] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data: currenciesData, loading: currenciesLoading } = useFetchAllCurrencies();
  const currencies = currenciesData?.currencies || [];

  const currencyOptions = useMemo(() => {
    return currencies.map((c: any) => ({
      label: `${c.code} (${c.symbol}) ${getFlagEmoji(c.countryCode)}`,
      value: c.code
    }));
  }, [currencies]);

  const [createWallet, { loading }] = useMutation<CreateWalletResponse, { input: CreateWalletInput }>(CREATE_WALLET, {
    onCompleted: () => {
      toast.success('Wallet created');
      setOpen(false);
      setSuccessCurrencyCode(currencyCode);
      setShowSuccessModal(true);
      setCurrencyCode('USD');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred');
    }
  });

  const handleCreate = async () => {
    if (!currencyCode) {
      toast.error('Please select a currency');
      return;
    }
    await createWallet({
      variables: {
        input: {
          currencyCode
        }
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button disabled={isDisabled} variant={'disabled_outline'}>
            <Plus size={14} />
            {t('balance.createWallet')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('wallet.createWalletTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Select currency</Label>
            {currenciesLoading ? (
              <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
            ) : (
              <InputWithSearch
                options={currencyOptions}
                value={currencyCode}
                onChange={setCurrencyCode}
                placeholder="Select currency"
                searchPlaceholder="Search currency..."
                className="mt-[8px]"
              />
            )}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                onClick={handleCreate}
                disabled={loading}
                className="bg-primary
                w-full hover:bg-primary/90 !font-medium"
              >
                {loading ? 'Processing...' : t('wallet.createWallet')}
                <ArrowRight />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <BaseModal
            title="Wallet created"
            body={`Your ${successCurrencyCode || currencyCode} wallet has been created successfully.`}
            buttonText="Back to Dashboard"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
