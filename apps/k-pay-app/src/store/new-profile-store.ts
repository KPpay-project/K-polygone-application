import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ME } from '@/lib/graphql/operations';
import type { UserAccountType } from '@/types/auth';
import { useProfile } from '@/store/profile-store';

interface MeQueryResult {
  me: UserAccountType;
}

export const useMe = () => {
  const { setMe } = useProfile();
  const query = useQuery<MeQueryResult>(ME, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (query.data?.me) {
      setMe(query.data.me); // push into Zustand store
    }
  }, [query.data, setMe]);

  return query;
};
