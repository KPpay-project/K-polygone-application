import {
  useQuery,
  useMutation,
  useSubscription,
  QueryHookOptions,
  MutationHookOptions,
  SubscriptionHookOptions,
  OperationVariables,
} from '@apollo/client';
import type { DocumentNode } from 'graphql';

export const useGraphQLQuery = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode,
  options?: QueryHookOptions<TData, TVariables>
) => {
  return useQuery<TData, TVariables>(query, options);
};

export const useGraphQLMutation = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  mutation: DocumentNode,
  options?: MutationHookOptions<TData, TVariables>
) => {
  return useMutation<TData, TVariables>(mutation, options);
};

export const useGraphQLSubscription = <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  subscription: DocumentNode,
  options?: SubscriptionHookOptions<TData, TVariables>
) => {
  return useSubscription<TData, TVariables>(subscription, options);
};
