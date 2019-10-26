import {
  ResponseTypeImplementation,
  CollectionTreeImplementation,
  TreeTypesImplementation,
  ErrorTypeImplementation,
  RequestTypeImplementation,
  ErrorLabel
} from '~/types';

export type ErrorTypeInput<L extends ErrorLabel> = Omit<
  ErrorTypeImplementation<L>,
  'kind'
>;
export type RequestTypeInput = Omit<RequestTypeImplementation, 'kind'>;
export type ResponseTypeInput = Omit<ResponseTypeImplementation, 'kind'>;

/**
 * Returns a new `collection` with types `types`.
 */
export function types<T extends TreeTypesImplementation>(
  types: T
): CollectionTreeImplementation<T, {}, {}> {
  return {
    kind: 'collection',
    types: types,
    scopes: {},
    services: {}
  };
}

/**
 * Creates an `ErrorTypeImplementation`.
 */
export function error<L extends ErrorLabel>(
  error: ErrorTypeInput<L>
): ErrorTypeImplementation<L> {
  return {
    kind: 'error',
    ...error
  };
}

/**
 * Creates a `RequestTypeImplementation`.
 */
export function request(request: RequestTypeInput): RequestTypeImplementation {
  return {
    kind: 'request',
    ...request
  };
}

/**
 * Creates a `ResponseTypeImplementation`.
 */
export function response(
  response: ResponseTypeInput
): ResponseTypeImplementation {
  return {
    kind: 'response',
    ...response
  };
}
