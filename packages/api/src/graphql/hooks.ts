import {
  useMutation,
  useQuery,
  type MutationHookOptions,
  type QueryHookOptions,
  type OperationVariables,
  type ApolloError,
  type DocumentNode,
} from '@apollo/client';
import { safeGraphQLOperation, type SafeOptions, type SafeResult } from './wrapper';
import {
  assertGraphQLResponse,
  ErrorCode,
  ErrorMessages,
  normalizeApolloError,
  ValidationError,
} from '../helpers/errors';
import { useMemo } from 'react';

function getByPath(obj: any, path?: string): any {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

type FriendlyMap = Partial<Record<ErrorCode, string>>;

type UseSafeMutationOptions<TData, TVars> = MutationHookOptions<TData, TVars> & {
  defaultSafe?: Pick<SafeOptions<TVars>, 'payloadPath' | 'requireSuccess' | 'friendlyMessages'>;
};

export function useSafeMutation<
  TData = any,
  TVars extends OperationVariables = OperationVariables,
  TPayload = any,
>(
  mutation: DocumentNode,
  options?: UseSafeMutationOptions<TData, TVars>,
): [
  (opts?: SafeOptions<TVars>) => Promise<SafeResult<TPayload>>,
  { loading: boolean; data?: TData; error?: ApolloError },
] {
  const { defaultSafe, ...apolloOptions } = options || {};
  const [mutate, { loading, data, error }] = useMutation<TData, TVars>(mutation, apolloOptions);

  const mutateSafe = async (opts?: SafeOptions<TVars>) => {
    const merged: SafeOptions<TVars> = {
      ...(defaultSafe || {}),
      ...(opts || {}),
    };
    return safeGraphQLOperation<TData, TVars, TPayload>(mutate as any, merged);
  };

  return [mutateSafe, { loading, data: data || undefined, error }];
}

type UseSafeQueryOptions<TData, TVars extends OperationVariables> = QueryHookOptions<
  TData,
  TVars
> & {
  payloadPath?: string;
  requireSuccess?: boolean;
  friendlyMessages?: FriendlyMap;
};

export function useSafeQuery<
  TData = any,
  TVars extends OperationVariables = OperationVariables,
  TPayload = any,
>(
  query: DocumentNode,
  options?: UseSafeQueryOptions<TData, TVars>,
): {
  loading: boolean;
  data?: TData;
  error?: ApolloError;
  safe: SafeResult<TPayload> | undefined;
} {
  const { payloadPath, requireSuccess, friendlyMessages, ...apolloOptions } = options || {};
  const { loading, data, error } = useQuery<TData, TVars>(query, {
    errorPolicy: 'all',
    ...apolloOptions,
  });

  const safe = useMemo<SafeResult<TPayload> | undefined>(() => {
    if (loading) return undefined;

    if (data) {
      try {
        const validated = assertGraphQLResponse<TData>({ data } as any, {
          requiredPaths: payloadPath ? [`data.${payloadPath}`] : [],
          friendlyMessageMap: friendlyMessages,
        });
        const payload = getByPath(validated as any, payloadPath) as any as TPayload;
        if (requireSuccess) {
          const success = (payload as any)?.success;
          if (success === false) {
            const message: string = (payload as any)?.message || ErrorMessages[ErrorCode.UNKNOWN];
            const code =
              message?.toLowerCase().includes('not authenticated') ||
              message?.toLowerCase().includes('authentication required')
                ? ErrorCode.AUTHENTICATION_REQUIRED
                : ErrorCode.VALIDATION_ERROR;
            const v = new ValidationError(message, {
              code,
              details: { fieldErrors: (payload as any)?.errors, raw: payload },
            });
            if (friendlyMessages && friendlyMessages[code])
              v.message = friendlyMessages[code] as string;
            return { ok: false, error: v };
          }
        }
        return { ok: true, payload };
      } catch (e) {
        const apolloErr = (error as ApolloError) || (e as ApolloError);
        const normalized =
          apolloErr?.graphQLErrors || apolloErr?.networkError
            ? normalizeApolloError(apolloErr)
            : new ValidationError((e as Error)?.message || ErrorMessages[ErrorCode.UNKNOWN], {
                code: ErrorCode.UNKNOWN,
              });
        if (friendlyMessages && friendlyMessages[normalized.code as ErrorCode]) {
          normalized.message = friendlyMessages[normalized.code as ErrorCode] as string;
        }
        return { ok: false, error: normalized };
      }
    }

    if (error) {
      const normalized = normalizeApolloError(error);
      if (friendlyMessages && friendlyMessages[normalized.code as ErrorCode]) {
        normalized.message = friendlyMessages[normalized.code as ErrorCode] as string;
      }
      return { ok: false, error: normalized };
    }

    return {
      ok: false,
      error: new ValidationError(ErrorMessages[ErrorCode.UNKNOWN], { code: ErrorCode.UNKNOWN }),
    };
  }, [loading, data, error, payloadPath, requireSuccess, friendlyMessages]);

  return { loading, data, error, safe };
}
