'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '@/lib/graphql/operations';
import { useProfileStore, type Profile } from '@/store/profile-store';
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
          id: me.user.id,
          email: me.user.email,
          firstName: me.user.firstName,
          lastName: me.user.lastName,
        }
      : { id: '', email: '', firstName: '', lastName: '' },
    wallets: Array.isArray(me.wallets ?? []) ? me.wallets! : [],
  };
}

interface MeQueryResult {
  me: UserAccountType | null;
}

export function useAuthenticatedProfile(isAuthenticated: boolean) {
  const { setProfile, clearProfile, profile } = useProfileStore();

  const { data, loading, error, refetch } = useQuery<MeQueryResult>(ME, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
    skip: !isAuthenticated,
  });

  const mappedProfile = useMemo(
    () => (data?.me ? mapUserAccountToProfile(data.me) : null),
    [data?.me]
  );

  useEffect(() => {
    if (mappedProfile && mappedProfile.id !== profile?.id) {
      setProfile(mappedProfile);
    }
    if (!loading && error) {
      clearProfile();
    }
  }, [mappedProfile, profile?.id, setProfile, clearProfile, error, loading]);

  return { profile: mappedProfile, loading, error, refetch };
}
