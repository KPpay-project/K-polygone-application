export enum ApiErrorCode {
  QUOTE_EXPIRED = 'quote_expired',
  INVALID_QUOTE = 'invalid_quote',
  INSUFFICIENT_BALANCE = 'insufficient_balance',
}

export const DEFAULT_API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.QUOTE_EXPIRED]: 'Quote expired. Please request a new quote.',
  [ApiErrorCode.INVALID_QUOTE]: 'Invalid quote. Please request a new quote.',
  [ApiErrorCode.INSUFFICIENT_BALANCE]: 'Insufficient balance for this transaction.',
};
