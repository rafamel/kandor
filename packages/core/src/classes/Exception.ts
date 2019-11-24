import { ExceptionUnion, ExceptionLabel, Optional } from '~/types';
import { Element } from './Element';
import { PublicError } from '~/PublicError';

export type ExceptionConstructor = <L extends ExceptionLabel = ExceptionLabel>(
  exception: ExceptionInput<L>
) => Exception<L>;

export type ExceptionInput<L extends ExceptionLabel> = Optional<
  ExceptionUnion<L>,
  'kind'
>;

export class Exception<
  L extends ExceptionLabel = ExceptionLabel
> extends Element<ExceptionUnion> {
  public static ensure<L extends ExceptionLabel = ExceptionLabel>(
    exception: ExceptionUnion<L>
  ): Exception<L> {
    return exception instanceof Exception
      ? exception
      : new Exception(exception);
  }
  public readonly label: L;
  public readonly description: string | undefined;
  public constructor(exception: ExceptionInput<L>) {
    super('exception');
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
  public element(): ExceptionUnion<L> {
    return this.description
      ? {
          kind: this.kind,
          label: this.label,
          description: this.description
        }
      : {
          kind: this.kind,
          label: this.label
        };
  }
}
