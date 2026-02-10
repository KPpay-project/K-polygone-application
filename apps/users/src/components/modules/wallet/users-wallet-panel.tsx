//@ts-nocheck
import { FC, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Copy, EllipsisVertical, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { useProfile } from '@/store/profile-store.ts';
import ErrorAndSuccessFallback from '@/components/sub-modules/modal-contents/error-success-fallback.tsx';
import { extractErrorMessages } from '@/utils';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Verify, Cd } from 'iconsax-reactjs';
import { WalletCardProps, WalletAction } from '../../../../types/wallet.interface.ts';
import VerifyWalletKyc from '@/components/actions/wallet/verify-wallet-kyc.tsx';
import { useFreezeWallet } from '@/hooks/api/kyc/wallet';
import { useQuery } from '@apollo/client';
import { ME } from '@repo/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';

const UserWalletCard: FC<WalletCardProps> = ({
  wallet,
  index = 0,
  showBalance,
  onToggleBalance,
  onCopyWalletId,
  t
}) => {
  const profile = useProfile();
  const walletCode = profile?.walletCode ?? '';
  const { data } = useQuery(ME);
  console.log(data, 'users data');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<WalletAction | null>(null);
  const [freezeReason, setFreezeReason] = useState('');
  const { freezeWallet, loading: freezing } = useFreezeWallet();

  const [localFrozen, setLocalFrozen] = useState<boolean>(!!wallet.isFrozen);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultStatus, setResultStatus] = useState<'success' | 'error'>('success');
  const [resultMessage, setResultMessage] = useState('');

  /* eslint-disable */
  const actions = useMemo<WalletAction[]>(
    () => [
      {
        key: 'verify',
        label: 'Verify',
        Icon: Verify,
        onSelect: () => {
          setSelectedAction({ key: 'verify', label: 'Verify', Icon: Verify, onSelect: () => {} });
          setConfirmOpen(true);
        }
      },
      {
        key: 'set-default',
        label: 'Set as default',
        Icon: Cd,
        onSelect: () => {
          setSelectedAction({ key: 'set-default', label: 'Set as default', Icon: Cd, onSelect: () => {} });
          setConfirmOpen(true);
        }
      },
      {
        key: localFrozen ? 'unfreeze' : 'freeze',
        label: localFrozen ? 'Unfreeze wallet' : 'Freeze wallet',
        Icon: localFrozen ? Unlock : Lock,
        onSelect: () => {
          setSelectedAction({
            key: localFrozen ? 'unfreeze' : 'freeze',
            label: localFrozen ? 'Unfreeze wallet' : 'Freeze wallet',
            Icon: localFrozen ? Unlock : Lock,
            onSelect: () => {}
          });
          setConfirmOpen(true);
        }
      }
    ],
    [localFrozen]
  );

  async function handleFreezeConfirm() {
    if (!selectedAction || (selectedAction.key !== 'freeze' && selectedAction.key !== 'unfreeze')) return;
    const isFreezing = selectedAction.key === 'freeze';
    const promise = (async () => {
      const r = await freezeWallet({ walletId: wallet.walletId || wallet.id, isFrozen: isFreezing, freezeReason });
      if (!r.ok) {
        const msg = r.error?.message || 'Operation failed';
        throw new Error(msg);
      }
      return r;
    })();
    try {
      const res = await toast.promise(promise, {
        loading: isFreezing ? 'Freezing wallet...' : 'Unfreezing wallet...',
        success: isFreezing ? 'Wallet has been frozen successfully.' : 'Wallet has been unfrozen successfully.',
        error: (e) => {
          const msgs = extractErrorMessages(e);
          return msgs[0] || (typeof e?.message === 'string' ? e.message : 'Operation failed');
        }
      });
      setLocalFrozen(!!res.payload?.isFrozen);
      setConfirmOpen(false);
      setFreezeReason('');
      setResultStatus('success');
      setResultMessage(isFreezing ? 'Wallet has been frozen successfully.' : 'Wallet has been unfrozen successfully.');
      setResultOpen(true);
    } catch (e: any) {
      const msgs = extractErrorMessages(e);
      const msg = msgs.length ? msgs.join('\n') : typeof e?.message === 'string' ? e.message : 'Operation failed';
      setResultStatus('error');
      setResultMessage(msg);
      setResultOpen(true);
    }
  }

  const formattedAmount = useMemo(() => {
    if (!showBalance) return '••••';
    try {
      return wallet.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch {
      return String(wallet.amount);
    }
  }, [showBalance, wallet.amount]);

  const idToCopy = wallet.walletId || walletCode;
  const idLabel = wallet.walletId ? 'Wallet ID' : 'Wallet Code';

  return (
    <div key={wallet.id} className="bg-white rounded-xl p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 ${wallet.color} rounded-full flex items-center justify-center shrink-0`}>
            {wallet.icon || (
              <span className="text-white text-md font-medium" aria-hidden>
                {wallet.symbol.charAt(0)}
              </span>
            )}
          </div>
          <span className="font-medium text-gray-800 truncate" title={wallet.symbol}>
            {wallet?.label}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-1.5 rounded-md hover:bg-gray-50 text-gray-600"
              aria-label="Wallet options"
            >
              <EllipsisVertical size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            {actions.map((item) => (
              <DropdownMenuItem
                key={item.key}
                onSelect={(e) => {
                  e.preventDefault();
                  item.onSelect();
                }}
                className="gap-2 cursor-pointer"
              >
                <item.Icon size={16} className="text-gray-500" />
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-3 flex items-center">
        <motion.div
          key={`balance-${wallet.id}`}
          className="text-2xl font-semibold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {formattedAmount}
        </motion.div>
        <button
          type="button"
          className="p-1 hover:bg-gray-100 rounded-full inline-flex ml-2"
          onClick={onToggleBalance}
          aria-label={showBalance ? 'Hide balance' : 'Show balance'}
        >
          {showBalance ? <Eye size={16} className="text-gray-400" /> : <EyeOff size={16} className="text-gray-400" />}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="truncate" title={`${idLabel}: ${idToCopy || '—'}`}>
          Acc. NO: {walletCode || '—'}
        </span>
        <button
          type="button"
          className="hover:text-gray-700"
          onClick={() => onCopyWalletId(idToCopy)}
          aria-label={`Copy ${walletCode}`}
          disabled={!idToCopy}
        >
          <Copy size={12} />
        </button>
      </div>

      {index === 0 && (
        <div className="mt-4">
          <span className="inline-block bg-green-100/50 text-green-700 text-[11px] px-2 py-0.5 rounded-full">
            {t('balance.default')}
          </span>
        </div>
      )}

      <Dialog
        open={confirmOpen}
        onOpenChange={(o) => {
          setConfirmOpen(o);
          if (!o) setFreezeReason('');
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center">
            {selectedAction?.key === 'set-default' && (
              <div className="w-16 h-16 rounded-full border-2 border-blue-100 flex items-center justify-center mx-auto mb-2">
                <Cd size={28} className="text-blue-500" />
              </div>
            )}
            {selectedAction?.key === 'freeze' || selectedAction?.key === 'unfreeze' ? (
              <>
                <DialogTitle className="text-xl font-bold">
                  {selectedAction?.key === 'freeze' ? 'Freeze wallet' : 'Unfreeze wallet'}
                </DialogTitle>
                <div className="w-full text-left mt-2">
                  {selectedAction?.key === 'freeze' ? (
                    <>
                      <p className="text-sm text-gray-600 mb-3">Provide a reason for freezing this wallet.</p>
                      <textarea
                        className="w-full border rounded-md p-2 text-sm"
                        rows={3}
                        placeholder="Irregular activities"
                        value={freezeReason}
                        onChange={(e) => setFreezeReason(e.target.value)}
                      />
                    </>
                  ) : (
                    <p className="text-sm text-gray-600">Are you sure you want to unfreeze this wallet?</p>
                  )}
                </div>
                <DialogFooter className="mt-4 w-full flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md border text-sm"
                    onClick={() => setConfirmOpen(false)}
                    disabled={freezing}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm disabled:opacity-70"
                    onClick={handleFreezeConfirm}
                    disabled={freezing || (selectedAction?.key === 'freeze' && !freezeReason.trim())}
                  >
                    {freezing ? 'Please wait…' : selectedAction?.key === 'freeze' ? 'Freeze' : 'Unfreeze'}
                  </button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogTitle className="text-xl font-bold">
                  {selectedAction?.key === 'set-default'
                    ? 'Are you sure you want to set this wallet as  default?'
                    : selectedAction?.label || 'Confirm action'}
                </DialogTitle>
                {selectedAction?.key === 'set-default' ? (
                  'This action cannot be undone and the funds will be moved back'
                ) : (
                  <VerifyWalletKyc />
                )}
              </>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent className="sm:max-w-md">
          <ErrorAndSuccessFallback status={resultStatus} body={resultMessage} onAction={() => setResultOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { UserWalletCard };
