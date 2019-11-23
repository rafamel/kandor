import { ExceptionLabel } from '~/types';

export class PublicError extends Error {
  public id: string;
  public label: ExceptionLabel;
  public source?: Error;
  public constructor(
    id: string,
    label: ExceptionLabel,
    source?: Error | null,
    message?: string | null,
    clear?: boolean
  ) {
    super(message || '');
    this.id = id;
    this.label = label;
    this.source = source || undefined;
    if (clear) this.stack = `${this.name}: ${this.message}`;
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
