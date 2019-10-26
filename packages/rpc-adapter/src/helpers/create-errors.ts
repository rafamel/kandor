import {
  PublicError,
  CollectionError,
  GeneralError,
  CollectionTree,
  ElementItem,
  ErrorType
} from '@karmic/core';

export function createErrors(
  collection: CollectionTree,
  routeError: ElementItem<ErrorType<'ClientNotFound'>>
): { [P in GeneralError | 'RouteError']: PublicError } {
  return {
    ServerError: new CollectionError(collection, 'ServerError'),
    ClientError: new CollectionError(collection, 'ClientError'),
    RouteError: new PublicError(
      routeError.name,
      routeError.item.label,
      null,
      routeError.item.description
    )
  };
}
