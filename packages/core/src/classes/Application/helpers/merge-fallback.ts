import {
  CollectionTreeImplementation,
  QueryServiceImplementation
} from '~/types';
import { getRoutes } from './get-routes';
import {
  UnaryApplicationResolve,
  ApplicationCreateOptionsMapFn
} from '../definitions';
import { Collection, CollectionInstance } from '../../Collection';
import { atPath } from '~/inspect/at';

export interface MergeFallback {
  collection: CollectionInstance<CollectionTreeImplementation>;
  fallback: UnaryApplicationResolve;
}

export function mergeFallback(
  collection: CollectionTreeImplementation,
  fallback: QueryServiceImplementation,
  map: ApplicationCreateOptionsMapFn
): MergeFallback {
  if (fallback.kind !== 'query') {
    throw Error(`Fallback service must be a query service`);
  }

  const lifted = Collection.services({ fallback }).lift({
    skipReferences: Object.keys(collection.exceptions).concat(
      Object.keys(collection.schemas)
    )
  });

  return {
    collection: Collection.merge(collection, {
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
