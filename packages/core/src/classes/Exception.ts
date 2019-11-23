import { ExceptionUnion, ExceptionLabel } from '~/types';
import { Element } from './Element';
import { PublicError } from '~/PublicError';

export type ExceptionCreateInput<
  L extends ExceptionLabel = ExceptionLabel
> = Omit<ExceptionUnion<L>, 'kind'>;

export class Exception<
  T extends ExceptionUnion = ExceptionUnion
> extends Element<T> {
  public static create<L extends ExceptionLabel>(
    exception: ExceptionCreateInput<L>
  ): Exception<ExceptionUnion<L>> {
    return new Exception({
      kind: 'exception',
      ...exception
    });
  }
  public readonly label: T['label'];
  public readonly description: T['description'];
  public constructor(exception: T) {
    super(exception.kind);
    this.label = exception.label;
    this.description = exception.description;
  }
  public error(
    id: string,
    source?: Error | null,
    clear?: boolean
  ): PublicError {
    return new PublicError(id, this.label, source, this.description, clear);
  }
  public element(): T {
    return (this.description
      ? {
          kind: this.kind,
          label: this.label,
          description: this.description
        }
      : {
          kind: this.kind,
          label: this.label
        }) as T;
  }
}
