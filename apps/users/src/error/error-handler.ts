import { toast } from 'sonner';
import { BaseError } from './base-error';
import { ErrorMessages } from './error-messages';
import { ErrorCodes } from './error-codes';

export class ErrorHandler {
  static handle(error: unknown): void {
    if (error instanceof BaseError) {
      this.handleCustomError(error);
    } else if (error instanceof Error) {
      this.handleSystemError(error);
    } else {
      this.handleUnknownError(error);
    }
  }

  private static handleCustomError(error: BaseError): void {
    toast.error(error.message, {
      description: error.details ? JSON.stringify(error.details) : undefined
    });

    console.error('Custom Error:', {
      code: error.code,
      message: error.message,
      httpCode: error.httpCode,
      details: error.details,
      stack: error.stack
    });
  }

  private static handleSystemError(error: Error): void {
    toast.error(ErrorMessages[ErrorCodes.INTERNAL_ERROR], {
      description: error.message
    });

    console.error('System Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }

  private static handleUnknownError(error: unknown): void {
    const errorMessage = error instanceof Object ? JSON.stringify(error) : String(error);

    toast.error(ErrorMessages[ErrorCodes.INTERNAL_ERROR], {
      description: errorMessage
    });

    console.error('Unknown Error:', error);
  }
}
