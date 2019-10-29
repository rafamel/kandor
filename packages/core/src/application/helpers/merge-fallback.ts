import {
  CollectionTreeImplementation,
  UnaryApplicationResolve,
  QueryServiceImplementation
} from '~/types';
import { services, collections } from '~/create';
import { normalize } from '~/transform';
import { ApplicationCreateMapFn } from '../types';
import { getRoutes } from './get-routes';
import { atPath } from '~/inspect';

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

  const normal = normalize(services({ fallback }), {
    skipReferences: Object.keys(collection.types)
  });

  return {
    collection: collections(collection, {
      ...normal,
      services: {}
    }),
    fallback: atPath(
      getRoutes(normal, map),
      ['fallback'],
      (x: any): x is UnaryApplicationResolve => typeof x === 'function'
    )
  };
}
