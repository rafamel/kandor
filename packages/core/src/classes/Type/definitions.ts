import {
  ErrorLabel,
  ErrorTypeUnion,
  RequestTypeUnion,
  ResponseTypeUnion,
  ErrorTypeKind,
  RequestTypeKind,
  ResponseTypeImplementation,
  TypeElementKind
} from '~/types';

/* Input */
export type TypeCreateInput<K extends TypeElementKind> = K extends ErrorTypeKind
  ? TypeErrorInput
  : K extends RequestTypeKind
  ? TypeRequestInput
  : TypeResponseInput;

export type TypeErrorInput<L extends ErrorLabel = ErrorLabel> = Omit<
  ErrorTypeUnion<L>,
  'kind'
>;

export type TypeRequestInput = Omit<RequestTypeUnion, 'kind'>;

export type TypeResponseInput = Omit<ResponseTypeUnion, 'kind'>;

/* Maps */
export type TypeCreate<K, T> = K extends ErrorTypeKind
  ? ErrorTypeUnion
  : K extends RequestTypeKind
  ? RequestTypeUnion
  : T extends ResponseTypeImplementation
  ? ResponseTypeImplementation
  : ResponseTypeUnion;
