import { BaseError } from './base-error';
import { ErrorCode } from './error-codes';
import { ErrorMessages } from './error-messages';

export class AuthenticationError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 401, details);
  }
}

export class ValidationError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 400, details);
  }
}

export class ResourceError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 404, details);
  }
}

export class TransactionError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 400, details);
  }
}

export class NetworkError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 503, details);
  }
}

export class SystemError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 500, details);
  }
}

export class FileError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 400, details);
  }
}

export class AccountError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 403, details);
  }
}

export class PermissionError extends BaseError {
  constructor(code: ErrorCode, details?: Record<string, unknown>) {
    super(code, ErrorMessages[code], 403, details);
  }
}
