import { type ApiErrorCode, DEFAULT_API_ERROR_MESSAGES } from '../enums';

export interface SharedGraphQLError {
  message: string;
  path?: Array<string | number>;
  success?: boolean;
  locations?: Array<{ line: number; column: number }>;
}

export interface GraphQLLikeResponse<TData = unknown> {
  data?: TData;
  errors?: SharedGraphQLError[];
  graphQLErrors?: SharedGraphQLError[];
  message?: string;
}

interface ExtractApiErrorOptions {
  fallback?: string;
  knownErrors?: Partial<Record<ApiErrorCode, string>> & Record<string, string>;
}

export const normalizeApiErrorMessage = (
  message?: string,
  options?: ExtractApiErrorOptions,
): string | null => {
  if (!message) return options?.fallback || null;

  const normalized = message.replace(/^An error occurred:\s*/i, '').trim();
  const normalizedCode = normalized.startsWith(':') ? normalized.slice(1) : normalized;
  const knownErrors = { ...DEFAULT_API_ERROR_MESSAGES, ...(options?.knownErrors || {}) };

  if (knownErrors[normalizedCode]) {
    return knownErrors[normalizedCode];
  }

  return normalized || options?.fallback || null;
};

export const extractApiErrorMessage = (
  respOrError: GraphQLLikeResponse | null | undefined,
  options?: ExtractApiErrorOptions,
): string | null => {
  const responseErrors = respOrError?.errors;
  if (responseErrors?.length) {
    return normalizeApiErrorMessage(responseErrors[0].message, options);
  }

  const apolloErrors = respOrError?.graphQLErrors;
  if (apolloErrors?.length) {
    return normalizeApiErrorMessage(apolloErrors[0].message, options);
  }

  if (respOrError?.message) {
    return normalizeApiErrorMessage(respOrError.message, options);
  }

  return null;
};
