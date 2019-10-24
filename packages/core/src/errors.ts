import { ErrorCode, CollectionTree } from '~/types';
import { isTypeError } from './inspect';

export class PublicError extends Error {
  public id: string;
  public code: ErrorCode;
  public source?: Error;
  public constructor(
    id: string,
    code: ErrorCode,
    source?: Error | null,
    message?: string,
    clear?: boolean
  ) {
    super(message);
    this.id = id;
    this.code = code;
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

export class CollectionError<
  T extends CollectionTree,
  K extends keyof T['types']
> extends PublicError {
  public constructor(
    collection: T,
    id: K,
    source?: Error | null,
    clear?: boolean
  ) {
    if (!Object.hasOwnProperty.call(collection.types, id)) {
      throw Error(`Type "${id}" does not exist on collection`);
    }

    const error = (collection.types as any)[id];
    if (!isTypeError(error)) {
      throw Error(`Type "${id}" is not an error on collection`);
    }
    super(id as string, error.code, source, error.description, clear);
  }
}
