import { FREEZE_WALLET, type SafeResult, useSafeMutation } from '@repo/api';

export interface FreezeWalletParams {
  walletId: string;
  isFrozen: boolean;
  freezeReason?: string;
}

export function useFreezeWallet() {
  const [mutateSafe, { loading }] = useSafeMutation(FREEZE_WALLET, {
    defaultSafe: { payloadPath: 'freezeWallet' }
  });

  const freezeWallet = async (params: FreezeWalletParams): Promise<SafeResult<{ id: string; isFrozen: boolean }>> => {
    const { walletId, isFrozen, freezeReason } = params;
    return mutateSafe({
      variables: {
        walletId,
        input: { isFrozen, freezeReason }
      },
      friendlyMessages: {
        VALIDATION_ERROR: isFrozen ? 'Unable to freeze wallet.' : 'Unable to unfreeze wallet.',
        UNKNOWN: 'Something went wrong. Please try again.'
      }
    });
  };

  return { freezeWallet, loading };
}
