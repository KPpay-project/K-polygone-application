//@ts-ignore
import type { ApolloError, GraphQLError as ApolloGraphQLError } from '@apollo/client';

export enum ErrorCode {
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  UNKNOWN = 'UNKNOWN'
}

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.AUTHENTICATION_REQUIRED]: 'Authentication required',
  [ErrorCode.UNAUTHENTICATED]: 'You need to sign in to continue',
  [ErrorCode.UNAUTHORIZED]: 'You are not allowed to perform this action',
  [ErrorCode.FORBIDDEN]: 'You are not allowed to perform this action',
  [ErrorCode.BAD_USER_INPUT]: 'Some fields are invalid. Please check and try again',
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed. Please review the form',
  [ErrorCode.NETWORK_ERROR]: 'Network error occurred. Please check your connection and try again',
  [ErrorCode.NOT_FOUND]: 'Requested resource was not found',
  [ErrorCode.RATE_LIMITED]: 'Too many requests. Please slow down and try again later',
  [ErrorCode.UNKNOWN]: 'Something went wrong. Please try again'
};

export interface NormalizedGraphQLError {
  message: string;
  path?: readonly (string | number)[];
  locations?: readonly { line: number; column: number }[];
  code?: string;
  extensions?: Record<string, unknown>;
}

export interface ValidationErrorOptions {
  code?: ErrorCode | string;
  details?: any;
  path?: readonly (string | number)[];
  locations?: readonly { line: number; column: number }[];
  originalErrors?: NormalizedGraphQLError[];
}

export class ValidationError extends Error {
  code?: ErrorCode | string;
  details?: any;
  path?: readonly (string | number)[];
  locations?: readonly { line: number; column: number }[];
  originalErrors?: NormalizedGraphQLError[];

  constructor(message: string, opts: ValidationErrorOptions = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = opts.code;
    this.details = opts.details;
    this.path = opts.path;
    this.locations = opts.locations;
    this.originalErrors = opts.originalErrors;
  }
}

export const normalizeGraphQLError = (err: ApolloGraphQLError | any): NormalizedGraphQLError => {
  const locations = (err?.locations || []) as any;
  const path = (err?.path || []) as any;
  const code = err?.extensions?.code || err?.code;
  const message = err?.message || 'GraphQL error';
  return { message, path, locations, code, extensions: err?.extensions };
};

const resolveErrorCode = (apollo: ApolloError | null, normalizedErrors: NormalizedGraphQLError[]): ErrorCode => {
  const extCode = normalizedErrors.find((e) => typeof e.code === 'string')?.code as string | undefined;
  if (extCode) {
    const upper = extCode.toUpperCase();
    if (upper.includes('UNAUTH')) return ErrorCode.AUTHENTICATION_REQUIRED;
    if (upper.includes('FORBIDDEN')) return ErrorCode.FORBIDDEN;
    if (upper.includes('BAD_USER_INPUT')) return ErrorCode.BAD_USER_INPUT;
    if (upper.includes('VALIDATION')) return ErrorCode.VALIDATION_ERROR;
    if (upper.includes('NOT_FOUND')) return ErrorCode.NOT_FOUND;
    if (upper.includes('RATE_LIMIT')) return ErrorCode.RATE_LIMITED;
  }

  const msg = normalizedErrors[0]?.message?.toLowerCase?.() || '';
  if (msg.includes('authentication required') || msg.includes('unauth')) return ErrorCode.AUTHENTICATION_REQUIRED;
  if (msg.includes('forbidden')) return ErrorCode.FORBIDDEN;
  if (msg.includes('validation')) return ErrorCode.VALIDATION_ERROR;

  if (apollo?.networkError) return ErrorCode.NETWORK_ERROR;

  return ErrorCode.UNKNOWN;
};

export const normalizeApolloError = (error: ApolloError): ValidationError => {
  const normalized = (error.graphQLErrors || []).map(normalizeGraphQLError);
  const code = resolveErrorCode(error, normalized);
  const message = normalized[0]?.message || error.message || ErrorMessages[code] || ErrorMessages.UNKNOWN;

  return new ValidationError(message, {
    code,
    details: error.networkError || error.extraInfo || undefined,
    path: normalized[0]?.path,
    locations: normalized[0]?.locations,
    originalErrors: normalized
  });
};

export const assertGraphQLResponse = <TData = any>(
  response: { data?: TData | null; errors?: any[] | null },
  options?: { requiredPaths?: string[]; friendlyMessageMap?: Partial<Record<ErrorCode, string>> }
): TData => {
  const { requiredPaths = [], friendlyMessageMap = {} } = options || {};

  const errors = (response as any)?.errors || [];
  if (errors && errors.length > 0) {
    const normalized = errors.map(normalizeGraphQLError);
    const code = resolveErrorCode(null, normalized);
    const message = friendlyMessageMap[code] || normalized[0]?.message || ErrorMessages[code] || ErrorMessages.UNKNOWN;
    throw new ValidationError(message, { code, originalErrors: normalized });
  }

  const data = response?.data ?? null;
  if (data === null || data === undefined) {
    throw new ValidationError(ErrorMessages.UNKNOWN, { code: ErrorCode.UNKNOWN });
  }

  for (const p of requiredPaths) {
    const segs = p.split('.');
    let cur: any = response;
    for (const s of segs) cur = cur?.[s];
    if (cur === null || cur === undefined) {
      throw new ValidationError(ErrorMessages.UNKNOWN, { code: ErrorCode.UNKNOWN, details: { path: p } });
    }
  }

  return data as TData;
};

export const isAuthError = (err: unknown): boolean => {
  const e = err as any;
  const code = e?.code as string | undefined;
  const msg = (e?.message as string | '').toLowerCase?.() || '';
  return (
    code === ErrorCode.AUTHENTICATION_REQUIRED ||
    code === ErrorCode.UNAUTHENTICATED ||
    msg.includes('authentication required') ||
    msg.includes('unauth')
  );
};

export const toFriendlyMessage = (err: unknown): string => {
  const e = err as ValidationError;
  const code = (e?.code as ErrorCode) || ErrorCode.UNKNOWN;
  return ErrorMessages[code] || e?.message || ErrorMessages.UNKNOWN;
};
