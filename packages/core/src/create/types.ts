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

export function error(error: InputErrorType): ErrorTypeImplementation {
  return {
    kind: 'error',
    ...error
  };
}

export function request(request: InputRequestType): RequestTypeImplementation {
  return {
    kind: 'request',
    ...request
  };
}

export function response(
  response: InputResponseType
): ResponseTypeImplementation {
  return {
    kind: 'response',
    ...response
  };
}
