import {
  InputErrorType,
  ErrorTypeImplementation,
  InputRequestType,
  RequestTypeImplementation,
  InputResponseType,
  ResponseTypeImplementation,
  TreeTypesImplementation,
  CollectionTreeImplementation
} from '~/types';

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
export function error(error: InputErrorType): ErrorTypeImplementation {
  return {
    kind: 'error',
    ...error
  };
}

/**
 * Creates a `RequestTypeImplementation`.
 */
export function request(request: InputRequestType): RequestTypeImplementation {
  return {
    kind: 'request',
    ...request
  };
}

/**
 * Creates a `ResponseTypeImplementation`.
 */
export function response(
  response: InputResponseType
): ResponseTypeImplementation {
  return {
    kind: 'response',
    ...response
  };
}
