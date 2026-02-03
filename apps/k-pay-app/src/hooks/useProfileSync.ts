import { useEffect } from 'react';
import { useMe } from '@/hooks/api';
import { useProfileStore } from '@/store/profile-store';
import type { Profile } from '@/store/profile-store';
import type { UserAccountType } from '@/types/graphql';

function mapUserAccountToProfile(me: UserAccountType): Profile {
  return {
    admin: me.admin,
    currentSignInAt: me.currentSignInAt,
    currentSignInIp: me.currentSignInIp,
    id: me.id,
    insertedAt: me.insertedAt,
    lastSignInAt: me.lastSignInAt,
    lastSignInIp: me.lastSignInIp ?? null,
    merchant: me.merchant,
    role: me.role,
    signInCount: me.signInCount,
    signInIp: me.signInIp ?? null,
    status: me.status ?? null,
    updatedAt: me.updatedAt,
    user: me.user
      ? {
          email: me.user.email,
          firstName: me.user.firstName,
          id: me.user.id,
          lastName: me.user.lastName,
        }
      : { email: '', firstName: '', id: '', lastName: '' },
    wallets: Array.isArray((me as any).wallets) ? (me as any).wallets : [],
  };
}

export function useProfileSync() {
  const { data } = useMe();
  const setProfile = useProfileStore((state) => state.setProfile);
  const profile = useProfileStore((state) => state.profile);

  useEffect(() => {
    if (data?.me && data.me.id && data.me.id !== profile?.id) {
      setProfile(mapUserAccountToProfile(data.me));
    }
  }, [data?.me, profile?.id, setProfile]);
}
