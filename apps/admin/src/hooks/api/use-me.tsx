import { useQuery } from '@apollo/client';
import { ME } from '../../lib/graphql/operations';
import { UserAccountType } from '@repo/types';

interface MeQueryResult {
  me: UserAccountType;
}

export const useMe = () => {
  return useQuery<MeQueryResult>(ME, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-first'
  });
};
