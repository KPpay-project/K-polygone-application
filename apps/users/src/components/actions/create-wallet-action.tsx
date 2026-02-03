import { useState, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_WALLET } from '@/lib/graphql/mutations/create-wallet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from 'k-polygon-assets/components';
import SecondaryCurrencyDropdown from '../common/currency-dropdown/secondary-currency-dropdown';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import BaseModal from '@/components/sub-modules/modal-contents/base-modal';
import { ArrowRight } from 'iconsax-reactjs';
import { Label } from '@/components/ui/label.tsx';

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

export function CreateWalletAction({ onSuccess, isDisabled = false }: CreateWalletActionProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [successCurrencyCode, setSuccessCurrencyCode] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
          <button
            disabled={isDisabled}
            className="text-primary bg-primary/10
           border-[1px] rounded-2xl border-primary py-3 hover:bg-blue-50 px-3 py-1 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Plus size={14} />
            {t('balance.createWallet')}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('wallet.createWalletTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Select currency</Label>
            <SecondaryCurrencyDropdown value={currencyCode} onChange={setCurrencyCode} />
            <div className="flex justify-end space-x-2 pt-4">
              {/*<Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>*/}
              {/*  Cancel*/}
              {/*</Button>*/}
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
