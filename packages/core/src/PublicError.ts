import { ErrorCode } from '~/types';

export default class PublicError extends Error {
  public id: string;
  public code: ErrorCode;
  public source?: Error;
  public constructor(
    id: string,
    code: ErrorCode,
    source?: Error | null,
    message?: string
  ) {
    super(message);
    this.id = id;
    this.code = code;
    this.source = source || undefined;
  }
  public get name(): string {
    return 'PublicError';
  }
  public get root(): PublicError {
    return this.source instanceof PublicError && this.source !== this
      ? this.source.root
      : this;
  }
}
