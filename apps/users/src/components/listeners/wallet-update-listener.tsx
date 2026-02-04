import { useProfileStore } from '@/store/profile-store';
import { useChannel, useChannelEvent } from '@/hooks/use-phoenix-socket';
import { toast } from 'sonner';

const WalletUpdateListener = () => {
  const { profile, fetchProfile } = useProfileStore();
  const wallets = profile?.wallets || [];

  // Create a ref to track if we've already set up listeners to avoid duplicate toasts on re-renders
  // logic handled by hooks, but we iterate over wallets.

  return (
    <>
      {wallets.map((wallet) => (
        <SingleWalletListener
          key={wallet.id}
          walletId={wallet.id}
          onUpdate={() => {
            fetchProfile();
            toast.success('Wallet balance updated');
          }}
        />
      ))}
    </>
  );
};

const SingleWalletListener = ({ walletId, onUpdate }: { walletId: string; onUpdate: (payload: any) => void }) => {
  const { channel } = useChannel(`wallet:${walletId}`);

  useChannelEvent(channel, 'wallet_updated', (payload) => {
    console.log(`Wallet ${walletId} updated:`, payload);
    onUpdate(payload);
  });

  return null;
};

export default WalletUpdateListener;
