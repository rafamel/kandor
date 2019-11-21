import {
  TypeElementUnion,
  TypeElementKind,
  ErrorLabel,
  ErrorTypeUnion,
  RequestTypeUnion,
  ResponseTypeUnion
} from '~/types';
import {
  TypeCreateInput,
  TypeCreate,
  TypeErrorInput,
  TypeRequestInput,
  TypeResponseInput
} from './definitions';
import { Element } from '../Element';

export class Type<
  T extends TypeElementUnion = TypeElementUnion
> extends Element<T> {
  public static create<K extends TypeElementKind, T extends TypeCreateInput<K>>(
    kind: K,
    type: T
  ): Type<TypeCreate<K, T>> {
    return new Type({
      kind,
      ...type
    } as any);
  }
  public static error<L extends ErrorLabel>(
    error: TypeErrorInput<L>
  ): Type<ErrorTypeUnion<L>> {
    return Type.create('error', error) as Type<ErrorTypeUnion<L>>;
  }
  public static request(request: TypeRequestInput): Type<RequestTypeUnion> {
    return Type.create('request', request);
  }
  public static response(response: TypeResponseInput): Type<ResponseTypeUnion> {
    return Type.create('response', response);
  }
  public readonly schema: T['schema'];
  public readonly children: T['children'];
  public readonly label: T['label'];
  public readonly description: T['description'];
  public constructor(type: T) {
    super(type.kind);
    this.schema = type.schema;
    this.children = type.children;
    this.label = type.label;
    this.description = type.description;
  }
  public element(): T {
    if (this.kind === 'error') {
      return {
        kind: this.kind,
        label: this.label,
        description: this.description
      } as T;
    }

    if (this.children) {
      return {
        kind: this.kind,
        schema: this.schema,
        children: this.children
      } as T;
    }

    return {
      kind: this.kind,
      schema: this.schema
    } as T;
  }
}
