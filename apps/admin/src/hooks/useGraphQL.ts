import {
  useQuery,
  useMutation,
  useSubscription,
  QueryHookOptions,
  MutationHookOptions,
  SubscriptionHookOptions
} from '@apollo/client';
import { DocumentNode } from 'graphql';

export const useGraphQLQuery = <TData = any, TVariables = any>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
) => {
  return useQuery<TData, TVariables>(query, options);
};

export const useGraphQLMutation = <TData = any, TVariables = any>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
) => {
  return useMutation<TData, TVariables>(mutation, options);
};

export const useGraphQLSubscription = <TData = any, TVariables = any>(
  subscription: DocumentNode,
  options?: SubscriptionHookOptions<TData, TVariables>
) => {
  return useSubscription<TData, TVariables>(subscription, options);
};
