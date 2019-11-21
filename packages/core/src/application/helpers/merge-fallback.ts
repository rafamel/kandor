import {
  CollectionTreeImplementation,
  QueryServiceImplementation,
  UnaryApplicationResolve
} from '~/types';
import { services, collections } from '~/create';
import { lift } from '~/transform';
import { getRoutes } from './get-routes';
import { atPath } from '~/inspect';
import { ApplicationCreateMapFn } from '../types';

export interface MergeFallback {
  collection: CollectionTreeImplementation;
  fallback: UnaryApplicationResolve;
}

export function mergeFallback(
  collection: CollectionTreeImplementation,
  fallback: QueryServiceImplementation,
  map: ApplicationCreateMapFn
): MergeFallback {
  if (fallback.kind !== 'query') {
    throw Error(`Fallback service must be a query service`);
  }

  const lifted = lift(services({ fallback }), {
    skipReferences: Object.keys(collection.types)
  });

  return {
    collection: collections(collection, {
      ...lifted,
      services: {}
    }),
    fallback: atPath(
      getRoutes(lifted, map),
      ['fallback'],
      (x: any): x is UnaryApplicationResolve => typeof x === 'function'
    )
  };
}
