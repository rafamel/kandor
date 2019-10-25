import {
  PublicError,
  CollectionError,
  GeneralError,
  CollectionTree
} from '@karmic/core';
import { RPCAdapterRouteError } from '~/types';

export function createErrors(
  collection: CollectionTree,
  routeError: RPCAdapterRouteError
): { [P in GeneralError | 'RouteError']: PublicError } {
  return {
    ServerError: new CollectionError(collection, 'ServerError'),
    ClientError: new CollectionError(collection, 'ClientError'),
    RouteError: new PublicError(
      routeError.name,
      routeError.type.code,
      null,
      routeError.type.description
    )
  };
}
