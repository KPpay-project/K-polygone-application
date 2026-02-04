import type {
  ApolloError,
  ApolloQueryResult,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client';
import {
  assertGraphQLResponse,
  ErrorCode,
  ErrorMessages,
  normalizeApolloError,
  ValidationError,
} from '../helpers/errors';

export interface SafeResult<TPayload = any> {
  ok: boolean;
  payload?: TPayload;
  error?: ValidationError;
}

export interface SafeOptions<TVars = OperationVariables> extends MutationFunctionOptions<
  any,
  TVars
> {
  payloadPath?: string;
  requireSuccess?: boolean;
  friendlyMessages?: Partial<Record<ErrorCode, string>>;
}

function getByPath(obj: any, path?: string): any {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export async function safeGraphQLOperation<TData, TVars = OperationVariables, TPayload = any>(
  execute: (
    options?: MutationFunctionOptions<TData, TVars>,
  ) => Promise<ApolloQueryResult<TData> | FetchResult<TData>>,
  options?: SafeOptions<TVars>,
): Promise<SafeResult<TPayload>> {
  try {
    const result = await execute(options);
    const data = assertGraphQLResponse<TData>(result as any, {
      requiredPaths: options?.payloadPath ? [`data.${options.payloadPath}`] : [],
      friendlyMessageMap: options?.friendlyMessages,
    });
    const payload = getByPath(data as any, options?.payloadPath) as any as TPayload;
    if (options?.requireSuccess) {
      const success = (payload as any)?.success;
      if (success === false) {
        const message: string = (payload as any)?.message || ErrorMessages[ErrorCode.UNKNOWN];
        const code =
          message?.toLowerCase().includes('not authenticated') ||
          message?.toLowerCase().includes('authentication required')
            ? ErrorCode.AUTHENTICATION_REQUIRED
            : ErrorCode.VALIDATION_ERROR;
        return {
          ok: false,
          error: new ValidationError(message, {
            code,
            details: { fieldErrors: (payload as any)?.errors, raw: payload },
          }),
        };
      }
    }
    return { ok: true, payload };
  } catch (e) {
    const apolloErr = e as ApolloError;
    const normalized =
      apolloErr?.graphQLErrors || apolloErr?.networkError
        ? normalizeApolloError(apolloErr)
        : new ValidationError((e as Error)?.message || ErrorMessages[ErrorCode.UNKNOWN], {
            code: ErrorCode.UNKNOWN,
          });
    if (options?.friendlyMessages) {
      const fm = options.friendlyMessages[normalized.code as ErrorCode];
      if (fm) normalized.message = fm;
    }
    return { ok: false, error: normalized };
  }
}
