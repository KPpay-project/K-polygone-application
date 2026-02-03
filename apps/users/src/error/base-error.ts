export class BaseError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly httpCode?: number,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
