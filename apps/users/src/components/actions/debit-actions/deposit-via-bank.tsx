import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { DEPOSIT_VIA_BANK } from '@repo/api';
import { Button } from 'k-polygon-assets/components';
import UsersCurrencyDropdown from '@/components/currency-dropdown/users-currency-dropdown.tsx';
import { toast } from 'sonner';
import DefaultModal from '@/components/sub-modules/popups/modal.tsx';
import { copyToClipboard } from '@/utils/copy-to-clipboard.tsx';
import { Copy } from 'lucide-react';

type BankResp = {
  accountName?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  currency?: string | null;
  expiresAt?: string | null;
  isPermanent?: boolean | null;
  message?: string | null;
  success?: boolean | null;
};

const DepositViaBank = () => {
  const [form, setForm] = useState({
    currencyCode: '',
    walletId: ''
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [bankDetails, setBankDetails] = useState<BankResp | null>(null);

  const [mutate, { loading }] = useMutation(DEPOSIT_VIA_BANK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      currencyCode: form.currencyCode || null,
      walletId: form.walletId || null
    };

    try {
      const { data } = await mutate({ variables: { input } });
      const resp: BankResp | undefined = data?.depositViaBank;
      const success = Boolean(resp?.success);
      const message =
        resp?.message ??
        (success ? 'Deposit via bank initiated successfully.' : 'An error occurred while initiating bank deposit.');

      if (success) {
        // toast.success(message);
        setBankDetails(resp ?? null);
        setModalOpen(true);
      } else {
        toast.error(message);
      }
    } catch (err: any) {
      const fallback =
        err?.message || err?.networkError?.message || 'Unable to process deposit via bank at the moment.';
      toast.error(fallback);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-6">
        <UsersCurrencyDropdown
          label="Select currency"
          selectedCurrency={form.currencyCode}
          onChange={(opt) =>
            setForm((s) => ({ ...s, walletId: opt?.walletId ?? '', currencyCode: opt?.currencyCode ?? '' }))
          }
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Processing...' : 'Deposit Via Bank'}
        </Button>
      </form>

      <DefaultModal
        title="Bank Deposit Details"
        open={modalOpen}
        onClose={closeModal}
        canExit
        // trigger={<Button disabled>View Bank Details</Button>}
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Use the details below to make a transfer. Your wallet will be credited automatically.
          </p>

          <div className="rounded-md border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Account Name</span>
              <span>{bankDetails?.accountName ?? '—'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Account Number</span>
              <div className="flex items-center gap-2">
                <span>{bankDetails?.accountNumber ?? '—'}</span>
                {bankDetails?.accountNumber ? (
                  <span className={' cursor-pointer'}>
                    <Copy
                      className={'w-4 h-4 text-gray-500 hover:text-gray-700'}
                      onClick={() => {
                        copyToClipboard(bankDetails.accountNumber!);
                      }}
                    />
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Bank</span>
              <span>{bankDetails?.bankName ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Currency</span>
              <span>{bankDetails?.currency ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Permanent</span>
              <span>{bankDetails?.isPermanent ? 'Yes' : 'No'}</span>
            </div>
            {bankDetails?.expiresAt ? (
              <div className="flex justify-between">
                <span className="font-medium">Expires At</span>
                <span>{bankDetails.expiresAt}</span>
              </div>
            ) : null}
          </div>
        </div>
      </DefaultModal>
    </>
  );
};

export default DepositViaBank;
