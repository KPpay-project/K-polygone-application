import { ErrorCodes } from './error-codes';

export const ErrorMessages: Record<string, string> = {
  [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid email/phone or password',
  [ErrorCodes.TOKEN_EXPIRED]: 'Authentication token has expired',
  [ErrorCodes.UNAUTHORIZED]: 'Unauthorized access',
  [ErrorCodes.INVALID_TOKEN]: 'Invalid authentication token',
  [ErrorCodes.SESSION_EXPIRED]: 'Your session has expired, please login again',

  [ErrorCodes.INVALID_INPUT]: 'Invalid input provided',
  [ErrorCodes.REQUIRED_FIELD_MISSING]: 'Required field is missing',
  [ErrorCodes.INVALID_FORMAT]: 'Invalid format',
  [ErrorCodes.INVALID_EMAIL]: 'Invalid email address',
  [ErrorCodes.INVALID_PHONE]: 'Invalid phone number',

  [ErrorCodes.RESOURCE_NOT_FOUND]: 'Requested resource not found',
  [ErrorCodes.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [ErrorCodes.RESOURCE_CONFLICT]: 'Resource conflict',

  [ErrorCodes.INSUFFICIENT_FUNDS]: 'Insufficient funds in account',
  [ErrorCodes.TRANSACTION_FAILED]: 'Transaction failed',
  [ErrorCodes.INVALID_AMOUNT]: 'Invalid transaction amount',
  [ErrorCodes.EXCEEDED_LIMIT]: 'Transaction limit exceeded',
  [ErrorCodes.INVALID_CURRENCY]: 'Invalid currency',

  [ErrorCodes.NETWORK_ERROR]: 'Network connection error',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'Service is currently unavailable',
  [ErrorCodes.TIMEOUT]: 'Request timed out',
  [ErrorCodes.API_ERROR]: 'API request failed',

  [ErrorCodes.INTERNAL_ERROR]: 'Internal system error',
  [ErrorCodes.DATABASE_ERROR]: 'Database operation failed',
  [ErrorCodes.CONFIGURATION_ERROR]: 'System configuration error',

  [ErrorCodes.FILE_NOT_FOUND]: 'File not found',
  [ErrorCodes.FILE_TOO_LARGE]: 'File size exceeds maximum limit',
  [ErrorCodes.INVALID_FILE_TYPE]: 'Invalid file type',
  [ErrorCodes.FILE_UPLOAD_FAILED]: 'File upload failed',

  [ErrorCodes.ACCOUNT_LOCKED]: 'Account has been locked',
  [ErrorCodes.ACCOUNT_DISABLED]: 'Account has been disabled',
  [ErrorCodes.ACCOUNT_NOT_VERIFIED]: 'Account not verified',
  [ErrorCodes.PASSWORD_EXPIRED]: 'Password has expired',

  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
  [ErrorCodes.ACCESS_DENIED]: 'Access denied',
  [ErrorCodes.ROLE_NOT_FOUND]: 'Role not found'
};
